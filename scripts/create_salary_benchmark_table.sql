-- ==============================================================================
-- Purpose: Create the salary_benchmark table for storing Saudi market salary data.
-- Features: Stores min/avg/max salaries per specialization and experience tier.
-- Dependencies: SQLite3 (instance/database.db)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS salary_benchmark (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    specialization      TEXT    NOT NULL,
    exp_years_range     TEXT    NOT NULL,
    min_salary          INTEGER NOT NULL,
    avg_salary          INTEGER NOT NULL,
    max_salary          INTEGER NOT NULL,
    last_updated        DATETIME DEFAULT CURRENT_TIMESTAMP,

    -- Unique constraint to support UPSERT (INSERT OR REPLACE) logic
    UNIQUE(specialization, exp_years_range)
);

-- Index for fast lookups by specialization
CREATE INDEX IF NOT EXISTS idx_salary_benchmark_specialization
    ON salary_benchmark(specialization);

-- Index for fast lookups by experience range
CREATE INDEX IF NOT EXISTS idx_salary_benchmark_exp_range
    ON salary_benchmark(exp_years_range);
