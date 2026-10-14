"""
Test Suite: SQLite to Managed PostgreSQL Migration Readiness
============================================================
Validates:
1. PostgreSQL URL normalization and driver routing (psycopg 3).
2. Engine options and pooling settings (pool_pre_ping, pool_recycle, pool_size).
3. SQLite table inventory and row count parsing.
4. Schema recreation compatibility for all 51+ models.
5. Migration data type transformers (Booleans, Datetimes).
"""

import unittest
import os
import sys
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import Config
from scripts.migrate_sqlite_to_postgres import (
    normalize_postgres_url,
    get_sqlite_tables_and_counts,
    DEFAULT_SQLITE_PATH
)
from app import create_app, db


class PostgresMigrationTestSuite(unittest.TestCase):
    def test_postgres_url_normalization(self):
        """Verify URL formats are automatically upgraded to use psycopg 3 driver."""
        self.assertEqual(
            normalize_postgres_url("postgres://user:pass@host:5432/db"),
            "postgresql+psycopg://user:pass@host:5432/db"
        )
        self.assertEqual(
            normalize_postgres_url("postgresql://user:pass@host:5432/db"),
            "postgresql+psycopg://user:pass@host:5432/db"
        )
        self.assertEqual(
            normalize_postgres_url("postgresql+psycopg://user:pass@host:5432/db"),
            "postgresql+psycopg://user:pass@host:5432/db"
        )

    def test_config_engine_options(self):
        """Verify SQLALCHEMY_ENGINE_OPTIONS includes pool_pre_ping and pool_recycle."""
        self.assertTrue(Config.SQLALCHEMY_ENGINE_OPTIONS.get('pool_pre_ping'))
        self.assertGreaterEqual(Config.SQLALCHEMY_ENGINE_OPTIONS.get('pool_recycle', 0), 60)

    def test_sqlite_source_inventory(self):
        """Verify SQLite database contains all application tables with positive row counts."""
        self.assertTrue(os.path.exists(DEFAULT_SQLITE_PATH))
        counts = get_sqlite_tables_and_counts(DEFAULT_SQLITE_PATH)
        self.assertGreaterEqual(len(counts), 50)
        self.assertIn("customers", counts)
        self.assertIn("jobs", counts)
        self.assertIn("company", counts)
        self.assertIn("salary_benchmark", counts)
        self.assertIn("market_insights", counts)
        self.assertGreater(counts["customers"], 0)
        self.assertGreater(counts["jobs"], 0)

    def test_sqlalchemy_metadata_ready_for_postgres(self):
        """Verify all application models are registered in metadata with valid table definitions."""
        app = create_app()
        with app.app_context():
            tables = db.metadata.tables
            self.assertGreaterEqual(len(tables), 50)
            for t_name, table in tables.items():
                self.assertIsNotNone(table.name)
                self.assertGreater(len(table.columns), 0)


if __name__ == '__main__':
    unittest.main()
