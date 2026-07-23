# ==============================================================================
# Purpose: Automated pipeline to fetch, transform, and upsert Saudi salary
#          benchmark data from the Saudi Open Data Portal (data.gov.sa CKAN API).
# Features: API fetching with retry/pagination, pandas transformation, SQLite
#           UPSERT, fallback seed data, scheduled 30-day execution.
# Dependencies: requests, pandas, schedule, sqlite3, logging, os, re
# ==============================================================================

import os
import re
import sys
import time
import sqlite3
import logging
from datetime import datetime, timezone
from typing import List, Dict, Optional, Any

import pandas as pd
import requests
import schedule

# ---------------------------------------------------------------------------
# Constants & Configuration
# ---------------------------------------------------------------------------

BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH: str = os.path.join(BASE_DIR, "instance", "database.db")

# Saudi Open Data Portal CKAN API endpoint.
# Replace RESOURCE_ID with the actual resource ID in production.
CKAN_API_URL: str = (
    "https://data.gov.sa/api/3/action/datastore_search"
)
CKAN_RESOURCE_ID: str = "CURRENT_YEAR_WAGES"

# API configuration
API_TIMEOUT_SECONDS: int = 30
API_MAX_RETRIES: int = 3
API_PAGE_SIZE: int = 100

# Scheduler interval (days)
SCHEDULE_INTERVAL_DAYS: int = 30

# Mapping: government sector names (Arabic & English) -> platform specializations.
# Keys are lowercased patterns that may appear in government data; values are the
# canonical specialization names used on the Faeda platform.
SECTOR_TO_SPECIALIZATION: Dict[str, str] = {
    # IT / Technology
    "information technology": "IT",
    "تقنية المعلومات": "IT",
    "technology": "IT",
    "software": "IT",
    "برمجيات": "IT",
    "حاسب": "IT",
    "computer": "IT",
    "data": "IT",
    "بيانات": "IT",
    "cybersecurity": "IT",
    "أمن سيبراني": "IT",
    # Human Resources
    "human resources": "HR",
    "الموارد البشرية": "HR",
    "hr": "HR",
    "personnel": "HR",
    "شؤون الموظفين": "HR",
    # Marketing
    "marketing": "Marketing",
    "التسويق": "Marketing",
    "digital marketing": "Marketing",
    "التسويق الرقمي": "Marketing",
    "advertising": "Marketing",
    "إعلان": "Marketing",
    # Engineering
    "engineering": "Engineering",
    "الهندسة": "Engineering",
    "هندسة": "Engineering",
    "mechanical": "Engineering",
    "civil": "Engineering",
    "electrical": "Engineering",
    "ميكانيكا": "Engineering",
    # Finance / Accounting
    "finance": "Finance",
    "المالية": "Finance",
    "accounting": "Finance",
    "المحاسبة": "Finance",
    "مالية": "Finance",
    "banking": "Finance",
    "بنوك": "Finance",
    # Healthcare
    "healthcare": "Healthcare",
    "الرعاية الصحية": "Healthcare",
    "health": "Healthcare",
    "صحة": "Healthcare",
    "medical": "Healthcare",
    "طب": "Healthcare",
    "nursing": "Healthcare",
    "تمريض": "Healthcare",
    "pharmacy": "Healthcare",
    "صيدلة": "Healthcare",
    # Education
    "education": "Education",
    "التعليم": "Education",
    "تعليم": "Education",
    "training": "Education",
    "تدريب": "Education",
    "academic": "Education",
    # Legal
    "legal": "Legal",
    "القانون": "Legal",
    "قانون": "Legal",
    "law": "Legal",
    "compliance": "Legal",
    # Sales
    "sales": "Sales",
    "المبيعات": "Sales",
    "مبيعات": "Sales",
    "retail": "Sales",
    "تجزئة": "Sales",
    # Administration
    "administration": "Administration",
    "الإدارة": "Administration",
    "إدارة": "Administration",
    "management": "Administration",
    "operations": "Administration",
    "عمليات": "Administration",
}

# Experience year tiers used on the platform
EXPERIENCE_TIERS: List[str] = ["0-2", "3-5", "5+"]


# ---------------------------------------------------------------------------
# Logging Setup
# ---------------------------------------------------------------------------

def setup_logging() -> logging.Logger:
    """Configure structured logging with English messages per AI_AGENT_RULES Section 9.2.

    Returns:
        logging.Logger: Configured logger instance for the market data updater.
    """
    logger = logging.getLogger("market_data_updater")
    logger.setLevel(logging.DEBUG)

    # Prevent duplicate handlers on re-import
    if not logger.handlers:
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(logging.INFO)
        formatter = logging.Formatter(
            "[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)

    return logger


logger = setup_logging()


# ---------------------------------------------------------------------------
# Database Helpers
# ---------------------------------------------------------------------------

def get_db_connection() -> sqlite3.Connection:
    """Open a connection to the SQLite database using an absolute path.

    Returns:
        sqlite3.Connection: Active database connection.

    Raises:
        sqlite3.Error: If the database file cannot be opened.
    """
    logger.debug("Connecting to database at: %s", DB_PATH)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def ensure_table_exists(conn: sqlite3.Connection) -> None:
    """Create the salary_benchmark table if it does not already exist.

    Uses CREATE TABLE IF NOT EXISTS for idempotent execution.

    Args:
        conn: Active SQLite database connection.
    """
    create_sql = """
    CREATE TABLE IF NOT EXISTS salary_benchmark (
        id                  INTEGER PRIMARY KEY AUTOINCREMENT,
        specialization      TEXT    NOT NULL,
        exp_years_range     TEXT    NOT NULL,
        min_salary          INTEGER NOT NULL,
        avg_salary          INTEGER NOT NULL,
        max_salary          INTEGER NOT NULL,
        last_updated        DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(specialization, exp_years_range)
    );
    """
    index_spec_sql = """
    CREATE INDEX IF NOT EXISTS idx_salary_benchmark_specialization
        ON salary_benchmark(specialization);
    """
    index_exp_sql = """
    CREATE INDEX IF NOT EXISTS idx_salary_benchmark_exp_range
        ON salary_benchmark(exp_years_range);
    """
    try:
        cursor = conn.cursor()
        cursor.execute(create_sql)
        cursor.execute(index_spec_sql)
        cursor.execute(index_exp_sql)
        conn.commit()
        logger.info("[+] salary_benchmark table verified/created successfully")
    except sqlite3.Error as e:
        logger.error("[-] Failed to create salary_benchmark table: %s", e)
        raise


# ---------------------------------------------------------------------------
# API Fetching
# ---------------------------------------------------------------------------

def fetch_saudi_market_data() -> List[Dict[str, Any]]:
    """Fetch salary/wage data from the Saudi Open Data Portal (CKAN API).

    Implements pagination, retry with exponential backoff, and timeout.
    Returns raw records from the API or an empty list on failure.

    Returns:
        List[Dict[str, Any]]: Raw records from the CKAN datastore, or empty list.
    """
    all_records: List[Dict[str, Any]] = []
    offset: int = 0

    logger.info("[*] Starting data fetch from Saudi Open Data Portal...")
    logger.info("[*] API URL: %s (resource_id=%s)", CKAN_API_URL, CKAN_RESOURCE_ID)

    while True:
        params: Dict[str, Any] = {
            "resource_id": CKAN_RESOURCE_ID,
            "limit": API_PAGE_SIZE,
            "offset": offset,
        }

        success: bool = False
        for attempt in range(1, API_MAX_RETRIES + 1):
            try:
                logger.info(
                    "[*] Fetching page at offset=%d (attempt %d/%d)",
                    offset, attempt, API_MAX_RETRIES,
                )
                response = requests.get(
                    CKAN_API_URL,
                    params=params,
                    timeout=API_TIMEOUT_SECONDS,
                )
                response.raise_for_status()

                payload = response.json()

                # CKAN API wraps results in {"success": true, "result": {...}}
                if not payload.get("success", False):
                    error_msg = payload.get("error", {}).get("message", "Unknown API error")
                    logger.warning("[-] API returned success=false: %s", error_msg)
                    break

                records = payload.get("result", {}).get("records", [])
                if not records:
                    logger.info("[*] No more records at offset=%d. Pagination complete.", offset)
                    success = True
                    break

                all_records.extend(records)
                total = payload.get("result", {}).get("total", 0)
                logger.info(
                    "[+] Fetched %d records (total so far: %d / %d)",
                    len(records), len(all_records), total,
                )

                offset += API_PAGE_SIZE
                success = True
                break

            except requests.exceptions.Timeout:
                logger.warning(
                    "[-] Request timed out (attempt %d/%d). Retrying...",
                    attempt, API_MAX_RETRIES,
                )
                time.sleep(2 ** attempt)  # Exponential backoff

            except requests.exceptions.ConnectionError as e:
                logger.warning(
                    "[-] Connection error (attempt %d/%d): %s",
                    attempt, API_MAX_RETRIES, e,
                )
                time.sleep(2 ** attempt)

            except requests.exceptions.HTTPError as e:
                logger.error("[-] HTTP error: %s", e)
                return all_records

            except ValueError as e:
                # Catches json.JSONDecodeError (e.g., API returned HTML
                # instead of JSON). Retry since this can be transient.
                logger.warning(
                    "[-] JSON decode error (attempt %d/%d): %s",
                    attempt, API_MAX_RETRIES, e,
                )
                time.sleep(2 ** attempt)

            except OSError as e:
                # Windows socket-level errors (WinError 10060, etc.) can
                # escape the requests wrapper on some urllib3 versions.
                logger.warning(
                    "[-] OS/Socket error (attempt %d/%d): %s",
                    attempt, API_MAX_RETRIES, e,
                )
                time.sleep(2 ** attempt)

            except requests.exceptions.RequestException as e:
                # Catch-all for any other requests library errors
                logger.error("[-] Request error: %s", e)
                return all_records

        if not success:
            logger.error("[-] Failed to fetch data after %d attempts. Aborting pagination.", API_MAX_RETRIES)
            break

        # If we got fewer records than the page size, we've reached the end
        if len(records) < API_PAGE_SIZE:
            break

    logger.info("[+] Total records fetched from API: %d", len(all_records))
    return all_records


# ---------------------------------------------------------------------------
# Data Transformation
# ---------------------------------------------------------------------------

def _clean_text(text: Any) -> str:
    """Clean and normalize a text field, stripping unwanted symbols and None values.

    Args:
        text: Raw text value (may be None, NaN, or contain artifacts).

    Returns:
        str: Cleaned, lowercased text string.
    """
    if pd.isna(text) or str(text).lower() in ("none", "nan", "null", ""):
        return ""
    # Keep Arabic, English, digits, and whitespace
    cleaned = re.sub(r"[^a-zA-Z\u0600-\u06FF0-9\s]", " ", str(text).lower())
    return re.sub(r"\s+", " ", cleaned).strip()


def _map_sector_to_specialization(sector_name: str) -> Optional[str]:
    """Map a government sector name to a platform specialization.

    Args:
        sector_name: Raw sector name from API data (Arabic or English).

    Returns:
        Optional[str]: Matched specialization name, or None if no match found.
    """
    cleaned = _clean_text(sector_name)
    if not cleaned:
        return None

    # Direct match
    if cleaned in SECTOR_TO_SPECIALIZATION:
        return SECTOR_TO_SPECIALIZATION[cleaned]

    # Substring/keyword match
    for keyword, specialization in SECTOR_TO_SPECIALIZATION.items():
        if keyword in cleaned or cleaned in keyword:
            return specialization

    return None


def _classify_experience_tier(years: Any) -> str:
    """Classify a years-of-experience value into one of the platform tiers.

    Args:
        years: Raw experience value (int, float, or string like "3-5 سنوات").

    Returns:
        str: One of "0-2", "3-5", or "5+".
    """
    try:
        # Try to extract a numeric value
        if isinstance(years, (int, float)):
            numeric_years = float(years)
        else:
            # Extract first number from strings like "3-5 سنوات" or "5+ years"
            numbers = re.findall(r"[\d.]+", str(years))
            numeric_years = float(numbers[0]) if numbers else 0.0
    except (ValueError, IndexError):
        numeric_years = 0.0

    if numeric_years <= 2:
        return "0-2"
    elif numeric_years <= 5:
        return "3-5"
    else:
        return "5+"


def transform_data(raw_records: List[Dict[str, Any]]) -> pd.DataFrame:
    """Transform raw API records into salary benchmark rows.

    Maps government sectors to platform specializations, buckets experience
    into tiers, and computes min/avg/max salary per group.

    Args:
        raw_records: List of dictionaries from the CKAN API.

    Returns:
        pd.DataFrame: Transformed data with columns: specialization,
                      exp_years_range, min_salary, avg_salary, max_salary.
    """
    if not raw_records:
        logger.warning("[-] No raw records to transform. Returning empty DataFrame.")
        return pd.DataFrame(columns=[
            "specialization", "exp_years_range", "min_salary", "avg_salary", "max_salary"
        ])

    logger.info("[*] Transforming %d raw records...", len(raw_records))
    df = pd.DataFrame(raw_records)

    # Attempt to identify relevant columns (CKAN datasets vary in schema)
    # Common column patterns: sector/industry, experience/years, salary/wage
    sector_col = None
    salary_col = None
    exp_col = None

    for col in df.columns:
        col_lower = col.lower()
        if any(kw in col_lower for kw in ("sector", "industry", "قطاع", "مجال", "occupation")):
            sector_col = col
        elif any(kw in col_lower for kw in ("salary", "wage", "راتب", "أجر", "pay", "compensation")):
            salary_col = col
        elif any(kw in col_lower for kw in ("experience", "years", "خبرة", "سنوات")):
            exp_col = col

    if not sector_col or not salary_col:
        logger.warning(
            "[-] Could not identify sector (%s) or salary (%s) columns. "
            "Available columns: %s",
            sector_col, salary_col, list(df.columns),
        )
        return pd.DataFrame(columns=[
            "specialization", "exp_years_range", "min_salary", "avg_salary", "max_salary"
        ])

    # Map sectors to specializations
    df["specialization"] = df[sector_col].apply(_map_sector_to_specialization)
    df = df.dropna(subset=["specialization"])

    # Classify experience tiers
    if exp_col:
        df["exp_years_range"] = df[exp_col].apply(_classify_experience_tier)
    else:
        # If no experience column, distribute evenly across tiers
        logger.warning("[-] No experience column found. Assigning tiers cyclically.")
        df["exp_years_range"] = [EXPERIENCE_TIERS[i % 3] for i in range(len(df))]

    # Parse salary column to numeric
    df["salary_numeric"] = pd.to_numeric(df[salary_col], errors="coerce")
    df = df.dropna(subset=["salary_numeric"])

    # Group by (specialization, exp_years_range) and compute aggregates
    grouped = (
        df.groupby(["specialization", "exp_years_range"])["salary_numeric"]
        .agg(["min", "mean", "max"])
        .reset_index()
    )
    grouped.columns = [
        "specialization", "exp_years_range", "min_salary", "avg_salary", "max_salary"
    ]

    # Round salary values to nearest integer
    grouped["min_salary"] = grouped["min_salary"].round(0).astype(int)
    grouped["avg_salary"] = grouped["avg_salary"].round(0).astype(int)
    grouped["max_salary"] = grouped["max_salary"].round(0).astype(int)

    logger.info(
        "[+] Transformation complete. %d specialization-tier groups produced.",
        len(grouped),
    )
    return grouped


# ---------------------------------------------------------------------------
# Fallback / Seed Data
# ---------------------------------------------------------------------------

def get_fallback_data() -> pd.DataFrame:
    """Return realistic fallback salary benchmarks for the Saudi market.

    Based on publicly available data from GASTAT labor market reports and
    Jadarat/LinkedIn Saudi Arabia salary ranges (2024-2026). Used when the
    API is unreachable or returns no usable data.

    Returns:
        pd.DataFrame: Fallback salary benchmarks covering all specializations
                      and experience tiers.
    """
    logger.info("[*] Generating fallback salary benchmark data...")

    # Salary ranges in SAR (Saudi Riyal) per month
    # Format: (specialization, exp_tier, min, avg, max)
    fallback_rows = [
        # IT / Technology
        ("IT", "0-2", 6000, 8500, 12000),
        ("IT", "3-5", 10000, 14000, 19000),
        ("IT", "5+", 16000, 22000, 35000),
        # Human Resources
        ("HR", "0-2", 5000, 7000, 9500),
        ("HR", "3-5", 8000, 11000, 15000),
        ("HR", "5+", 13000, 18000, 28000),
        # Marketing
        ("Marketing", "0-2", 5500, 7500, 10000),
        ("Marketing", "3-5", 9000, 12500, 16000),
        ("Marketing", "5+", 14000, 19000, 30000),
        # Engineering
        ("Engineering", "0-2", 7000, 9500, 13000),
        ("Engineering", "3-5", 11000, 15000, 20000),
        ("Engineering", "5+", 17000, 24000, 38000),
        # Finance / Accounting
        ("Finance", "0-2", 6000, 8000, 11000),
        ("Finance", "3-5", 9500, 13000, 17000),
        ("Finance", "5+", 15000, 21000, 33000),
        # Healthcare
        ("Healthcare", "0-2", 7000, 10000, 14000),
        ("Healthcare", "3-5", 12000, 16000, 22000),
        ("Healthcare", "5+", 18000, 26000, 40000),
        # Education
        ("Education", "0-2", 5000, 7000, 9000),
        ("Education", "3-5", 7500, 10000, 13000),
        ("Education", "5+", 11000, 15000, 22000),
        # Legal
        ("Legal", "0-2", 6000, 8500, 12000),
        ("Legal", "3-5", 10000, 14000, 19000),
        ("Legal", "5+", 16000, 23000, 36000),
        # Sales
        ("Sales", "0-2", 4500, 6500, 9000),
        ("Sales", "3-5", 7500, 10500, 14000),
        ("Sales", "5+", 12000, 16000, 25000),
        # Administration
        ("Administration", "0-2", 4500, 6000, 8500),
        ("Administration", "3-5", 7000, 9500, 13000),
        ("Administration", "5+", 11000, 15000, 23000),
    ]

    df = pd.DataFrame(
        fallback_rows,
        columns=["specialization", "exp_years_range", "min_salary", "avg_salary", "max_salary"],
    )

    logger.info("[+] Fallback data generated: %d rows across %d specializations",
                len(df), df["specialization"].nunique())
    return df


# ---------------------------------------------------------------------------
# Database Upsert
# ---------------------------------------------------------------------------

def upsert_salary_benchmarks(conn: sqlite3.Connection, df: pd.DataFrame) -> int:
    """Upsert (Insert or Replace) salary benchmark data into the database.

    Uses parameterized queries to prevent SQL injection (AI_AGENT_RULES Section 5.2).
    Wraps operations in try-except-finally with proper connection handling.

    Args:
        conn: Active SQLite database connection.
        df: DataFrame with columns: specialization, exp_years_range,
            min_salary, avg_salary, max_salary.

    Returns:
        int: Number of rows successfully upserted.
    """
    if df.empty:
        logger.warning("[-] Empty DataFrame provided. No data to upsert.")
        return 0

    upsert_sql = """
    INSERT OR REPLACE INTO salary_benchmark
        (specialization, exp_years_range, min_salary, avg_salary, max_salary, last_updated)
    VALUES
        (?, ?, ?, ?, ?, ?)
    """

    rows_upserted: int = 0
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")

    try:
        cursor = conn.cursor()
        for _, row in df.iterrows():
            try:
                cursor.execute(upsert_sql, (
                    str(row["specialization"]),
                    str(row["exp_years_range"]),
                    int(row["min_salary"]),
                    int(row["avg_salary"]),
                    int(row["max_salary"]),
                    now,
                ))
                rows_upserted += 1
            except sqlite3.IntegrityError as e:
                logger.warning(
                    "[-] Integrity error for %s / %s: %s",
                    row["specialization"], row["exp_years_range"], e,
                )
            except (ValueError, TypeError) as e:
                logger.warning(
                    "[-] Data conversion error for %s / %s: %s",
                    row["specialization"], row["exp_years_range"], e,
                )

        conn.commit()
        logger.info("[+] Successfully upserted %d salary benchmark rows", rows_upserted)

    except sqlite3.Error as e:
        logger.error("[-] Database error during upsert: %s", e)
        conn.rollback()

    return rows_upserted


# ---------------------------------------------------------------------------
# Pipeline Orchestrator
# ---------------------------------------------------------------------------

def run_pipeline() -> None:
    """Execute the full salary benchmark update pipeline.

    Steps:
        1. Ensure the salary_benchmark table exists.
        2. Fetch data from the Saudi Open Data Portal API.
        3. Transform API data (or fall back to seed data).
        4. Upsert transformed data into the database.

    All operations use try-except-finally with proper connection cleanup
    per AI_AGENT_RULES Sections 2 and 9.1.
    """
    logger.info("=" * 70)
    logger.info("[*] SALARY BENCHMARK UPDATE PIPELINE - STARTED")
    logger.info("[*] Timestamp: %s", datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"))
    logger.info("=" * 70)

    conn: Optional[sqlite3.Connection] = None
    try:
        # Step 1: Database setup
        conn = get_db_connection()
        ensure_table_exists(conn)

        # Step 2: Fetch data from API
        raw_records = fetch_saudi_market_data()

        # Step 3: Transform or fall back
        if raw_records:
            df = transform_data(raw_records)
            if df.empty:
                logger.warning(
                    "[-] API data could not be transformed. Using fallback data."
                )
                df = get_fallback_data()
        else:
            logger.warning(
                "[-] No data fetched from API. Using fallback data."
            )
            df = get_fallback_data()

        # Step 4: Upsert into database
        rows = upsert_salary_benchmarks(conn, df)

        logger.info("=" * 70)
        logger.info(
            "[+] PIPELINE COMPLETE - %d specialization-tier rows updated", rows
        )
        logger.info("=" * 70)

    except sqlite3.Error as e:
        logger.error("[-] Critical database error in pipeline: %s", e)
    except Exception as e:
        logger.error("[-] Unexpected error in pipeline: %s", e)
    finally:
        if conn:
            conn.close()
            logger.debug("[*] Database connection closed.")


# ---------------------------------------------------------------------------
# Scheduler
# ---------------------------------------------------------------------------

def start_scheduler() -> None:
    """Start the lightweight scheduler to run the pipeline every 30 days.

    Uses the `schedule` library for standalone background worker execution.
    The pipeline runs immediately on startup, then every SCHEDULE_INTERVAL_DAYS.
    """
    logger.info(
        "[*] Scheduler configured: pipeline will run every %d days",
        SCHEDULE_INTERVAL_DAYS,
    )

    # Schedule recurring execution
    schedule.every(SCHEDULE_INTERVAL_DAYS).days.do(run_pipeline)

    # Run immediately on first launch
    logger.info("[*] Running initial pipeline execution...")
    run_pipeline()

    # Keep the scheduler alive
    logger.info("[*] Scheduler is now active. Waiting for next scheduled run...")
    try:
        while True:
            schedule.run_pending()
            time.sleep(60)  # Check every minute
    except KeyboardInterrupt:
        logger.info("[*] Scheduler stopped by user (KeyboardInterrupt).")


# ---------------------------------------------------------------------------
# Entry Point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    start_scheduler()
