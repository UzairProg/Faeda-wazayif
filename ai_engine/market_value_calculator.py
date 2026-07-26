# ==============================================================================
# Purpose: Calculate a user's estimated market value based on education,
#          experience, specialization, and salary benchmarks from the database.
# Features: QS World University Rankings bonus scoring, degree-level scoring,
#           experience tier evaluation, salary benchmark lookup.
# Dependencies: sqlite3, pandas, os, logging
# ==============================================================================

import os
import re
import sys
import sqlite3
import logging
from typing import Dict, Optional, Any, List, Tuple

import pandas as pd
from thefuzz import fuzz, process

_qs_df: pd.DataFrame | None = None

def _load_qs_data() -> pd.DataFrame:
    """Load QS rankings CSV into a cached DataFrame.

    Returns:
        pd.DataFrame: DataFrame with at least '2025 Rank' and 'Institution Name' columns.
    """
    global _qs_df
    if _qs_df is None:
        try:
            csv_path = os.path.join(BASE_DIR, "ai_engine", "data", "qs_rankings_2025.csv")
            _qs_df = pd.read_csv(csv_path)
        except Exception as e:
            logger.warning("Failed to load QS rankings data: %s", e)
            _qs_df = pd.DataFrame(columns=["2025 Rank", "Institution Name"])
    return _qs_df

def get_qs_university_bonus(user_university_name: str) -> int:
    """Return bonus points based on QS world ranking using fuzzy matching.

    Matching confidence threshold is 80. Bonus tiers:
        rank <= 100  → +20
        rank <= 500  → +15
        rank <= 1000 → +10
        otherwise    → +5
    If no confident match, returns +5 as fallback.
    """
    if not user_university_name:
        return 0
    df = _load_qs_data()
    if df.empty:
        return 5
    # Prepare list of institution names
    institutions = df["Institution Name"].astype(str).tolist()
    match, score = process.extractOne(user_university_name, institutions, scorer=fuzz.ratio) or (None, 0)
    if score < 80 or match is None:
        logger.debug("No confident QS match for university '%s' (best score %s)", user_university_name, score)
        return 5
    # Retrieve rank for matched institution
    try:
        rank_val = int(df.loc[df["Institution Name"] == match, "2025 Rank"].iloc[0])
    except Exception as e:
        logger.debug("Failed to retrieve rank for matched university '%s': %s", match, e)
        return 5
    if rank_val <= 100:
        bonus = 20
    elif rank_val <= 500:
        bonus = 15
    elif rank_val <= 1000:
        bonus = 10
    else:
        bonus = 5
    logger.info("[+] QS university match: '%s' (rank %d) → +%d bonus points", match, rank_val, bonus)
    return bonus


# ---------------------------------------------------------------------------
# Constants & Configuration
# ---------------------------------------------------------------------------

BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH: str = os.path.join(BASE_DIR, "instance", "database.db")

# QS World University Rankings — Top Saudi Universities (2024-2026)
# Source: QS World University Rankings regional listings for Saudi Arabia.
# These universities consistently rank in the top tier globally and regionally.
# Removed hardcoded QS_TOP_SAUDI_UNIVERSITIES list; using fuzzy matching against CSV.
# Degree-level scoring (base points)
DEGREE_SCORES: Dict[str, int] = {
    # Arabic values (as stored in the Customers model)
    "دكتوراه": 25,
    "ماجستير": 20,
    "بكالوريوس": 15,
    "دبلوم": 10,
    "ثانوية عامة": 5,
    "ثانوي": 5,
    # English equivalents
    "phd": 25,
    "doctorate": 25,
    "master": 20,
    "masters": 20,
    "bachelor": 15,
    "bachelors": 15,
    "diploma": 10,
    "high school": 5,
}

# Experience-level scoring (base points)
EXPERIENCE_SCORES: Dict[str, int] = {
    "أكثر من 5 سنوات": 25,
    "5+ سنوات": 25,
    "3-5 سنوات": 15,
    "1-3 سنوات": 10,
    "بدون خبرة": 5,
    "أقل من سنة": 5,
}

# QS university premium bonus points
QS_UNIVERSITY_BONUS: int = 10

# GPA bonus thresholds (out of 5.0 scale)
GPA_BONUS_THRESHOLDS: List[Tuple[float, int]] = [
    (4.5, 10),   # Excellent: 4.5+ → +10 points
    (3.75, 7),   # Very Good: 3.75-4.49 → +7 points
    (3.0, 4),    # Good: 3.0-3.74 → +4 points
    (2.5, 2),    # Acceptable: 2.5-2.99 → +2 points
]

# Maximum possible score for normalization
MAX_SCORE: int = 100


# ---------------------------------------------------------------------------
# Logging Setup
# ---------------------------------------------------------------------------

def setup_logging() -> logging.Logger:
    """Configure structured logging with English messages per AI_AGENT_RULES Section 9.2.

    Returns:
        logging.Logger: Configured logger instance for the market value calculator.
    """
    calc_logger = logging.getLogger("market_value_calculator")
    calc_logger.setLevel(logging.DEBUG)

    if not calc_logger.handlers:
        console_handler = logging.StreamHandler(
            stream=open(sys.stdout.fileno(), mode='w', encoding='utf-8', errors='replace', closefd=False)
        )
        console_handler.setLevel(logging.INFO)
        formatter = logging.Formatter(
            "[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
        console_handler.setFormatter(formatter)
        calc_logger.addHandler(console_handler)

    return calc_logger


logger = setup_logging()


# ---------------------------------------------------------------------------
# Scoring Functions
# ---------------------------------------------------------------------------

def score_education(educational_qualification: Optional[str]) -> int:
    """Score the user's educational qualification level.

    Args:
        educational_qualification: Degree name (Arabic or English), e.g. "بكالوريوس".

    Returns:
        int: Points awarded for the degree level (0-25).
    """
    if not educational_qualification:
        return 0

    cleaned = educational_qualification.strip().lower()

    # Direct match
    if cleaned in DEGREE_SCORES:
        return DEGREE_SCORES[cleaned]

    # Substring match for flexibility
    for keyword, points in DEGREE_SCORES.items():
        if keyword in cleaned or cleaned in keyword:
            return points

    logger.debug("No degree match found for: '%s'", educational_qualification)
    return 0


def score_university(university: Optional[str]) -> int:
    """Award bonus points based on QS ranking using fuzzy matching.

    Args:
        university: University name from the user's profile.

    Returns:
        int: Bonus points according to ranking tier, or 0 if no university provided.
    """
    if not university:
        return 0
    return get_qs_university_bonus(university)



def score_experience(years_of_skills: Optional[str]) -> int:
    """Score the user's years of experience.

    Args:
        years_of_skills: Experience range string, e.g. "3-5 سنوات".

    Returns:
        int: Points awarded for experience level (0-25).
    """
    if not years_of_skills:
        return 0

    cleaned = years_of_skills.strip()

    # Direct match
    if cleaned in EXPERIENCE_SCORES:
        return EXPERIENCE_SCORES[cleaned]

    # Substring match
    for keyword, points in EXPERIENCE_SCORES.items():
        if keyword in cleaned or cleaned in keyword:
            return points

    # Try numeric extraction
    numbers = re.findall(r"[\d.]+", cleaned)
    if numbers:
        years = float(numbers[0])
        if years >= 5:
            return 25
        elif years >= 3:
            return 15
        elif years >= 1:
            return 10
        else:
            return 5

    logger.debug("No experience match found for: '%s'", years_of_skills)
    return 0


def score_gpa(gpa: Optional[str]) -> int:
    """Score the user's GPA with bonus points for high achievement.

    Args:
        gpa: GPA value as a string (on a 5.0 scale).

    Returns:
        int: Bonus points for GPA (0-10).
    """
    if not gpa:
        return 0

    try:
        gpa_value = float(gpa)
    except (ValueError, TypeError):
        # Try extracting a number from strings like "4.5 من 5"
        numbers = re.findall(r"[\d.]+", str(gpa))
        if not numbers:
            return 0
        gpa_value = float(numbers[0])

    for threshold, bonus in GPA_BONUS_THRESHOLDS:
        if gpa_value >= threshold:
            return bonus

    return 0


def score_certifications(certifications: Optional[str]) -> int:
    """Score the user's professional certifications.

    Args:
        certifications: JSON string or comma-separated list of certifications.

    Returns:
        int: Points for certifications (0-15).
    """
    if not certifications:
        return 0

    cleaned = certifications.strip()
    if cleaned.lower() in ("none", "null", "nan", "[]", '["none"]', '["None"]'):
        return 0

    # Count meaningful certifications
    import json
    try:
        cert_list = json.loads(cleaned)
        if isinstance(cert_list, list):
            meaningful = [c for c in cert_list if str(c).lower() not in ("none", "null", "")]
            count = len(meaningful)
        else:
            count = 1
    except (json.JSONDecodeError, TypeError):
        # Fallback: count comma-separated items
        items = [c.strip() for c in cleaned.split(",") if c.strip().lower() not in ("none", "null", "")]
        count = len(items)

    # Cap at 3 certifications for scoring (5 points each, max 15)
    return min(count, 3) * 5


# ---------------------------------------------------------------------------
# Salary Benchmark Lookup
# ---------------------------------------------------------------------------

def get_salary_benchmark(
    specialization: Optional[str],
    exp_years_range: str,
) -> Optional[Dict[str, int]]:
    """Look up salary benchmarks from the database for a given specialization and tier.

    Args:
        specialization: Platform specialization name (e.g. "IT", "HR").
        exp_years_range: Experience tier (e.g. "0-2", "3-5", "5+").

    Returns:
        Optional[Dict[str, int]]: Dictionary with min_salary, avg_salary,
                                   max_salary, or None if not found.
    """
    if not specialization:
        return None

    conn: Optional[sqlite3.Connection] = None
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT min_salary, avg_salary, max_salary
            FROM salary_benchmark
            WHERE specialization = ? AND exp_years_range = ?
            """,
            (specialization, exp_years_range),
        )
        row = cursor.fetchone()

        if row:
            return {
                "min_salary": row["min_salary"],
                "avg_salary": row["avg_salary"],
                "max_salary": row["max_salary"],
            }

        logger.debug(
            "No benchmark found for specialization='%s', tier='%s'",
            specialization, exp_years_range,
        )
        return None

    except sqlite3.Error as e:
        logger.error("[-] Database error during benchmark lookup: %s", e)
        return None
    finally:
        if conn:
            conn.close()


def _map_experience_to_tier(years_of_skills: Optional[str]) -> str:
    """Map the user's experience string to a benchmark tier.

    Args:
        years_of_skills: Experience string from user profile.

    Returns:
        str: One of "0-2", "3-5", "5+".
    """
    if not years_of_skills:
        return "0-2"

    cleaned = years_of_skills.strip().lower()

    if any(kw in cleaned for kw in ("أكثر من 5", "5+", "more than 5", "senior")):
        return "5+"
    elif any(kw in cleaned for kw in ("3-5", "3 to 5", "mid")):
        return "3-5"
    elif any(kw in cleaned for kw in ("1-3", "1 to 3")):
        return "0-2"
    elif any(kw in cleaned for kw in ("بدون", "no experience", "0")):
        return "0-2"

    # Numeric extraction fallback
    numbers = re.findall(r"[\d.]+", cleaned)
    if numbers:
        years = float(numbers[0])
        if years > 5:
            return "5+"
        elif years > 2:
            return "3-5"

    return "0-2"


def _map_field_to_specialization(preferred_field: Optional[str]) -> Optional[str]:
    """Map the user's preferred field of work to a benchmark specialization.

    Args:
        preferred_field: User's preferred field (Arabic or English).

    Returns:
        Optional[str]: Matched specialization or None.
    """
    if not preferred_field:
        return None

    cleaned = re.sub(r"\s+", " ", preferred_field.strip().lower())

    field_mapping: Dict[str, str] = {
        "تقنية المعلومات": "IT",
        "it": "IT",
        "information technology": "IT",
        "برمجة": "IT",
        "software": "IT",
        "computer": "IT",
        "حاسب": "IT",
        "الموارد البشرية": "HR",
        "human resources": "HR",
        "hr": "HR",
        "التسويق": "Marketing",
        "marketing": "Marketing",
        "تسويق": "Marketing",
        "الهندسة": "Engineering",
        "engineering": "Engineering",
        "هندسة": "Engineering",
        "المالية": "Finance",
        "finance": "Finance",
        "مالية": "Finance",
        "المحاسبة": "Finance",
        "accounting": "Finance",
        "الرعاية الصحية": "Healthcare",
        "healthcare": "Healthcare",
        "صحة": "Healthcare",
        "طب": "Healthcare",
        "medical": "Healthcare",
        "التعليم": "Education",
        "education": "Education",
        "تعليم": "Education",
        "القانون": "Legal",
        "legal": "Legal",
        "قانون": "Legal",
        "المبيعات": "Sales",
        "sales": "Sales",
        "مبيعات": "Sales",
        "الإدارة": "Administration",
        "administration": "Administration",
        "إدارة": "Administration",
        "management": "Administration",
    }

    # Direct match
    if cleaned in field_mapping:
        return field_mapping[cleaned]

    # Substring match
    for keyword, spec in field_mapping.items():
        if keyword in cleaned or cleaned in keyword:
            return spec

    return None


# ---------------------------------------------------------------------------
# Main Calculator
# ---------------------------------------------------------------------------

def calculate_market_value(user_profile: Dict[str, Any]) -> Dict[str, Any]:
    """Calculate the estimated market value for a user based on their profile.

    Scoring breakdown (max 100 points):
        - Education level:    0-25 points
        - QS University:      0-10 points (bonus)
        - Experience:         0-25 points
        - GPA:                0-10 points
        - Certifications:     0-15 points
        - Subtotal max:       85 points (capped at 100)

    The score is then mapped to a salary range using the salary_benchmark table.

    Args:
        user_profile: Dictionary containing user data fields:
            - educational_qualification (str): Degree level
            - university (str): University name
            - years_of_skills (str): Experience range
            - gpa (str): GPA value
            - certifications (str): JSON or CSV of certifications
            - preferred_field_of_work (str): Specialization area

    Returns:
        Dict[str, Any]: Result containing:
            - total_score (int): Composite score out of 100
            - score_breakdown (dict): Points per category
            - salary_range (dict or None): min/avg/max salary from benchmarks
            - specialization (str or None): Matched specialization
            - experience_tier (str): Mapped experience tier
            - percentile_label (str): Human-readable ranking label
    """
    logger.info("[*] Calculating market value for user profile...")

    # --- Score each component ---
    edu_score = score_education(user_profile.get("educational_qualification"))
    uni_score = score_university(user_profile.get("university"))
    exp_score = score_experience(user_profile.get("years_of_skills"))
    gpa_score = score_gpa(user_profile.get("gpa"))
    cert_score = score_certifications(user_profile.get("certifications"))

    # --- Compute total (capped at MAX_SCORE) ---
    raw_total = edu_score + uni_score + exp_score + gpa_score + cert_score
    total_score = min(raw_total, MAX_SCORE)

    # --- Map to experience tier and specialization ---
    exp_tier = _map_experience_to_tier(user_profile.get("years_of_skills"))
    specialization = _map_field_to_specialization(
        user_profile.get("preferred_field_of_work")
    )

    # --- Look up salary benchmarks ---
    salary_range = get_salary_benchmark(specialization, exp_tier)

    # --- Determine percentile label ---
    if total_score >= 80:
        percentile_label = "Top Performer (Top 10%)"
    elif total_score >= 65:
        percentile_label = "Above Average (Top 25%)"
    elif total_score >= 50:
        percentile_label = "Average (Top 50%)"
    elif total_score >= 35:
        percentile_label = "Below Average"
    else:
        percentile_label = "Entry Level"

    # --- Build result ---
    result: Dict[str, Any] = {
        "total_score": total_score,
        "score_breakdown": {
            "education": edu_score,
            "university_bonus": uni_score,
            "experience": exp_score,
            "gpa": gpa_score,
            "certifications": cert_score,
        },
        "salary_range": salary_range,
        "specialization": specialization,
        "experience_tier": exp_tier,
        "percentile_label": percentile_label,
    }

    logger.info(
        "[+] Market value calculated: score=%d/100 (%s), specialization=%s, tier=%s",
        total_score, percentile_label, specialization or "Unknown", exp_tier,
    )
    if salary_range:
        logger.info(
            "[+] Salary range: %d - %d SAR/month (avg: %d)",
            salary_range["min_salary"],
            salary_range["max_salary"],
            salary_range["avg_salary"],
        )

    return result


# ---------------------------------------------------------------------------
# Convenience Function for Flask Routes
# ---------------------------------------------------------------------------

def get_market_value_for_customer(customer_row: Any) -> Dict[str, Any]:
    """Calculate market value from a Customers ORM object or dict-like row.

    This is the main entry point intended for Flask route handlers.

    Args:
        customer_row: A Customers model instance or dictionary with user fields.

    Returns:
        Dict[str, Any]: Market value result (see calculate_market_value).
    """
    if isinstance(customer_row, dict):
        profile = customer_row
    else:
        # SQLAlchemy model instance — extract attributes
        profile = {
            "educational_qualification": getattr(customer_row, "educational_qualification", None),
            "university": getattr(customer_row, "university", None),
            "years_of_skills": getattr(customer_row, "years_of_skills", None),
            "gpa": getattr(customer_row, "gpa", None),
            "certifications": getattr(customer_row, "certifications", None),
            "preferred_field_of_work": getattr(customer_row, "preferred_field_of_work", None),
        }

    return calculate_market_value(profile)


# ---------------------------------------------------------------------------
# Standalone Test / Demo
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    # Demo: Calculate market value for a sample user profile
    sample_profile = {
        "educational_qualification": "بكالوريوس",
        "university": "جامعة الملك فهد للبترول والمعادن",
        "years_of_skills": "3-5 سنوات",
        "gpa": "4.2",
        "certifications": '["AWS Certified", "PMP"]',
        "preferred_field_of_work": "تقنية المعلومات",
    }

    print("=" * 60)
    print("MARKET VALUE CALCULATOR - DEMO")
    print("=" * 60)

    result = calculate_market_value(sample_profile)

    print(f"\nTotal Score: {result['total_score']}/100")
    print(f"Percentile: {result['percentile_label']}")
    print(f"Specialization: {result['specialization']}")
    print(f"Experience Tier: {result['experience_tier']}")
    print("\nScore Breakdown:")
    for category, points in result["score_breakdown"].items():
        print(f"  - {category}: {points} pts")

    if result["salary_range"]:
        sr = result["salary_range"]
        print(f"\nSalary Range (SAR/month):")
        print(f"  Min: {sr['min_salary']:,}")
        print(f"  Avg: {sr['avg_salary']:,}")
        print(f"  Max: {sr['max_salary']:,}")
    else:
        print("\nSalary Range: No benchmark data available.")
        print("  Run market_data_updater.py first to populate salary benchmarks.")
