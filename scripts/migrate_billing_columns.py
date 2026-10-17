"""
Migration script: Add Moyasar and billing columns to PostgreSQL tables
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from sqlalchemy import text

app = create_app()

queries = [
    "ALTER TABLE subscription_plan ADD COLUMN IF NOT EXISTS slug VARCHAR(50);",
    "ALTER TABLE subscription_plan ADD COLUMN IF NOT EXISTS yearly_price DOUBLE PRECISION;",
    "ALTER TABLE subscription_plan ADD COLUMN IF NOT EXISTS max_campaigns INTEGER DEFAULT 3;",
    "ALTER TABLE subscription_plan ADD COLUMN IF NOT EXISTS badge VARCHAR(50);",
    "ALTER TABLE subscription ADD COLUMN IF NOT EXISTS billing_cycle VARCHAR(20) DEFAULT 'monthly';",
    "ALTER TABLE payment ADD COLUMN IF NOT EXISTS invoice_number VARCHAR(50);",
    "ALTER TABLE payment ADD COLUMN IF NOT EXISTS subtotal DOUBLE PRECISION;",
    "ALTER TABLE payment ADD COLUMN IF NOT EXISTS vat_amount DOUBLE PRECISION;",
    "ALTER TABLE payment ADD COLUMN IF NOT EXISTS moyasar_payment_id VARCHAR(100);",
    "ALTER TABLE payment ADD COLUMN IF NOT EXISTS receipt_url VARCHAR(255);"
]

with app.app_context():
    print("[*] Applying PostgreSQL billing schema migration...")
    for q in queries:
        try:
            db.session.execute(text(q))
            db.session.commit()
            print(f"[+] Executed: {q}")
        except Exception as e:
            db.session.rollback()
            print(f"[-] Note for '{q}': {e}")

    # Seed default plans if needed
    try:
        from services.subscription import SubscriptionPlan
        SubscriptionPlan.seed_default_plans()
        print("[+] Seeded default subscription plans successfully.")
    except Exception as e:
        print(f"[-] Seed error: {e}")

    print("[*] Billing migration complete.")
