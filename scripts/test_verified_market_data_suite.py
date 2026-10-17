"""
Test Suite: Verified Official Saudi Market & Salary Data Integration
=====================================================================
Validates that:
1. Demo / mock / estimated salary benchmarks have been fully replaced by verified official data.
2. Market insights return is_demo=False and reference official Saudi sources (GASTAT, SDAIA, data.gov.sa).
3. Licensed under Saudi Open Government Data License (رخصة البيانات الحكومية المفتوحة).
4. Automated scheduled background sync and admin sync endpoints function properly.
"""

import unittest
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from services.market_data_service import market_data_service
from services.market_insights import MarketInsight
from services.market_data_scheduler import get_market_data_sync_status, sync_official_market_data


class VerifiedMarketDataTestSuite(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.app.config['TESTING'] = True
        self.app.config['WTF_CSRF_ENABLED'] = False
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()

    def tearDown(self):
        self.ctx.pop()

    def test_provider_status_is_verified_and_not_demo(self):
        """Verify the active provider is official GASTAT / Open Data and not demo."""
        status = market_data_service.get_provider_status()
        self.assertFalse(status.get("is_demo", True))
        self.assertEqual(status.get("status"), "verified_official")
        self.assertIn("GASTAT", status.get("provider_name", ""))
        self.assertIn("data.gov.sa", status.get("source_url", ""))
        self.assertIn("رخصة البيانات الحكومية المفتوحة", status.get("license", ""))

    def test_salary_benchmark_api_returns_verified_data(self):
        """GET /api/market-insights/salary returns verified official benchmarks."""
        res = self.client.get('/api/market-insights/salary?role=Full+Stack+Developer&experience=3')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data.get("success"))
        salary_info = data.get("data", {})
        self.assertGreater(salary_info.get("salary_min", 0), 0)
        self.assertGreater(salary_info.get("salary_max", 0), salary_info.get("salary_min", 0))
        self.assertFalse(salary_info.get("is_demo", True))
        self.assertEqual(salary_info.get("data_status"), "verified_official")
        self.assertIn("GASTAT", salary_info.get("source", ""))
        self.assertIn("data.gov.sa", salary_info.get("source_url", ""))
        self.assertIn("رخصة البيانات الحكومية المفتوحة", salary_info.get("license", ""))

    def test_market_trends_api_returns_verified_official(self):
        """GET /api/market-insights/trends returns official Saudi labor market survey trends."""
        res = self.client.get('/api/market-insights/trends')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data.get("success"))
        trends = data.get("data", {})
        self.assertFalse(trends.get("is_demo", True))
        self.assertIn("GASTAT", trends.get("data_source", ""))

    def test_database_market_insights_all_verified(self):
        """Verify that all records in MarketInsight table have is_demo == False."""
        records = MarketInsight.query.all()
        self.assertGreater(len(records), 0)
        for r in records:
            self.assertFalse(r.is_demo, f"Record {r.id} ({r.role}) still flagged as demo")
            self.assertEqual(r.data_status, "verified_official")
            self.assertIn("data.gov.sa", r.source_url)

    def test_admin_providers_endpoint(self):
        """GET /api/market-insights/admin/providers lists verified official government provider."""
        res = self.client.get('/api/market-insights/admin/providers')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data.get("success"))
        providers = data.get("providers", [])
        self.assertGreater(len(providers), 0)
        gastat_p = next((p for p in providers if p.get("id") == "verified_official"), None)
        self.assertIsNotNone(gastat_p)
        self.assertFalse(gastat_p.get("is_demo"))
        self.assertEqual(gastat_p.get("status"), "Active (Verified Official)")

    def test_admin_sync_status_endpoint(self):
        """GET /api/market-insights/admin/sync-status returns real sync status and provenance."""
        res = self.client.get('/api/market-insights/admin/sync-status')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data.get("success"))
        status = data.get("sync_status", {})
        self.assertFalse(status.get("is_demo"))
        self.assertEqual(status.get("status"), "success")
        self.assertIn("GASTAT", status.get("source"))
        self.assertIn("data.gov.sa", status.get("source_url"))


if __name__ == '__main__':
    unittest.main()
