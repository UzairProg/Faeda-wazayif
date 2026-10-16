"""
Test Suite: Moyasar Payment Gateway & Billing Integration
=========================================================
Validates:
1. Subscription models (SubscriptionPlan, Subscription, Payment).
2. Default plans seeding (Starter, Professional, Enterprise).
3. 15% Saudi VAT calculation & ZATCA compliance.
4. Moyasar checkout quote generation.
5. Moyasar payment verification & subscription upgrade.
6. Tax invoice generation and retrieval.
"""

import unittest
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from services.subscription import SubscriptionPlan, Subscription, Payment, SUB_STATUS_ACTIVE, PAYMENT_COMPLETED
from services.moyasar_service import process_subscription_upgrade, fetch_moyasar_payment


class MoyasarBillingTestSuite(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.app_context = cls.app.app_context()
        cls.app_context.push()
        cls.client = cls.app.test_client()

    @classmethod
    def tearDownClass(cls):
        cls.app_context.pop()

    def test_default_plans_seeding(self):
        """Verify default subscription plans exist and have correct pricing and features."""
        plans = SubscriptionPlan.get_active_plans()
        self.assertGreaterEqual(len(plans), 3)

        slugs = [p.slug for p in plans]
        self.assertIn("starter", slugs)
        self.assertIn("professional", slugs)
        self.assertIn("enterprise", slugs)

        pro = SubscriptionPlan.get_by_id_or_slug("professional")
        self.assertEqual(pro.price, 499.0)
        self.assertEqual(pro.currency, "SAR")
        self.assertGreater(len(pro.features_list), 0)

    def test_vat_and_checkout_calculation(self):
        """Verify 15% Saudi VAT calculations on checkout."""
        res = self.client.post("/api/v1/billing/checkout", json={
            "plan_id": "professional",
            "billing_cycle": "monthly"
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data["success"])
        order = data["order"]
        self.assertEqual(order["subtotal"], 499.0)
        self.assertEqual(order["vat_amount"], 74.85)
        self.assertEqual(order["total_amount"], 573.85)
        self.assertEqual(order["amount_halalas"], 57385)

    def test_moyasar_payment_verification_and_upgrade(self):
        """Verify simulated/sandbox Moyasar payment processes subscription upgrade cleanly."""
        res = self.client.post("/api/v1/billing/verify", json={
            "plan_id": "professional",
            "billing_cycle": "monthly",
            "payment_method": "mada",
            "payment_id": "mock_moyasar_test_001"
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data["success"])
        self.assertIn("invoice", data)
        self.assertIn("subscription", data)
        self.assertEqual(data["subscription"]["status"], SUB_STATUS_ACTIVE)

        inv = data["invoice"]
        self.assertEqual(inv["amount"], 573.85)
        self.assertEqual(inv["status"], PAYMENT_COMPLETED)
        self.assertTrue(inv["invoice_number"].startswith("INV-"))

    def test_invoices_retrieval(self):
        """Verify company invoice history returns populated list."""
        res = self.client.get("/api/v1/billing/invoices")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data["success"])
        self.assertGreater(len(data["invoices"]), 0)


if __name__ == "__main__":
    unittest.main()
