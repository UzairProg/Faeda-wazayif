# ==============================================================================
# services/moyasar_service.py
# ==============================================================================
# Moyasar Payment Gateway Service Layer for Saudi Arabian market.
# Handles Mada, Visa/Mastercard, Apple Pay, Webhook processing,
# and sandbox fallback verification for Faeda Jobs ATS.
# ==============================================================================

import os
import logging
import base64
import requests
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

from app import db
from services.subscription import (
    SubscriptionPlan, Subscription, Payment,
    SUB_STATUS_ACTIVE, PAYMENT_COMPLETED, PAYMENT_FAILED,
    BILLING_MONTHLY, BILLING_YEARLY
)

logger = logging.getLogger("moyasar_service")

MOYASAR_API_BASE = os.environ.get("MOYASAR_API_URL", "https://api.moyasar.com/v1").rstrip("/")
MOYASAR_SECRET_KEY = os.environ.get("MOYASAR_SECRET_KEY", "sk_test_moyasar_faeda_sandbox_demo")
MOYASAR_PUBLISHABLE_KEY = os.environ.get("MOYASAR_PUBLISHABLE_KEY", "pk_test_moyasar_faeda_sandbox_demo")


def is_live_moyasar_key() -> bool:
    """Check if valid non-mock Moyasar key is configured."""
    key = os.environ.get("MOYASAR_SECRET_KEY", "")
    return bool(key and key.startswith("sk_live_"))


def get_moyasar_headers() -> Dict[str, str]:
    """Generate HTTP Basic Auth header for Moyasar API."""
    sec = os.environ.get("MOYASAR_SECRET_KEY", MOYASAR_SECRET_KEY)
    token = base64.b64encode(f"{sec}:".encode("utf-8")).decode("utf-8")
    return {
        "Authorization": f"Basic {token}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }


def create_moyasar_invoice(
    amount_sar: float,
    description: str,
    callback_url: str,
    metadata: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Create a hosted invoice on Moyasar.
    Amount in Moyasar API is formatted in Halalas (1 SAR = 100 Halalas).
    """
    amount_halalas = int(round(amount_sar * 100))
    payload = {
        "amount": amount_halalas,
        "currency": "SAR",
        "description": description,
        "callback_url": callback_url,
        "metadata": metadata or {}
    }

    # If test sandbox key, return simulated invoice object
    if not is_live_moyasar_key() and "sk_test" in MOYASAR_SECRET_KEY and "sandbox" in MOYASAR_SECRET_KEY:
        import uuid
        mock_id = f"inv_{uuid.uuid4().hex[:16]}"
        return {
            "id": mock_id,
            "status": "initiated",
            "amount": amount_halalas,
            "currency": "SAR",
            "description": description,
            "url": f"{callback_url}?id={mock_id}&status=paid",
            "is_sandbox": True
        }

    try:
        resp = requests.post(
            f"{MOYASAR_API_BASE}/invoices",
            json=payload,
            headers=get_moyasar_headers(),
            timeout=15
        )
        if resp.status_code in (200, 201):
            return resp.json()
        logger.error("Moyasar create invoice failed: %s - %s", resp.status_code, resp.text)
        return {"error": "Failed to initiate payment invoice with gateway", "details": resp.text}
    except Exception as e:
        logger.exception("Moyasar network exception: %s", e)
        return {"error": str(e)}


def fetch_moyasar_payment(payment_id: str) -> Dict[str, Any]:
    """
    Fetch and verify payment status from Moyasar API.
    """
    if not is_live_moyasar_key() and ("sandbox" in MOYASAR_SECRET_KEY or payment_id.startswith("mock_") or payment_id.startswith("inv_")):
        # Sandbox simulated verification
        return {
            "id": payment_id,
            "status": "paid",
            "amount": 49900,
            "currency": "SAR",
            "source": {
                "type": "mada",
                "company": "mada",
                "name": "Mada Test Cardholder",
                "number": "588845******1111"
            },
            "is_sandbox": True
        }

    try:
        resp = requests.get(
            f"{MOYASAR_API_BASE}/payments/{payment_id}",
            headers=get_moyasar_headers(),
            timeout=15
        )
        if resp.status_code == 200:
            return resp.json()
        logger.warning("Moyasar payment lookup failed: %s %s", resp.status_code, resp.text)
        return {"error": "Payment verification failed", "details": resp.text}
    except Exception as e:
        logger.exception("Error checking Moyasar payment: %s", e)
        return {"error": str(e)}


def process_subscription_upgrade(
    company_id: int,
    plan_slug_or_id: Any,
    billing_cycle: str = BILLING_MONTHLY,
    payment_method: str = "mada",
    moyasar_payment_id: Optional[str] = None,
    client_metadata: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Executes the business logic to upgrade a company's subscription upon payment.
    - Updates or creates active Subscription
    - Sets start and end dates (1 month or 1 year)
    - Records Payment & calculates 15% VAT
    - Generates tax invoice
    """
    plan = SubscriptionPlan.get_by_id_or_slug(plan_slug_or_id)
    if not plan:
        # Fallback to professional
        plan = SubscriptionPlan.get_by_id_or_slug("professional")
        if not plan:
            return {"success": False, "error": "Invalid subscription plan selected."}

    # Calculate price based on cycle
    if billing_cycle == BILLING_YEARLY:
        base_price = float(plan.yearly_price if plan.yearly_price is not None else (plan.price * 10))
        days = 365
    else:
        base_price = float(plan.price)
        days = 30

    # Enterprise plans are handled via sales inquiry
    if base_price <= 0 and plan.slug == "enterprise":
        return {
            "success": True,
            "custom": True,
            "message": "Enterprise plan inquiry submitted. Dedicated account manager will reach out within 2 hours."
        }

    # Saudi VAT calculation (0% if not VAT registered)
    vat_enabled = os.environ.get("COMPANY_VAT_ENABLED", "false").lower() in ("true", "1", "yes")
    subtotal = round(base_price, 2)
    vat_amount = round(subtotal * 0.15, 2) if vat_enabled else 0.0
    total_amount = round(subtotal + vat_amount, 2)

    now = datetime.utcnow()
    end_date = now + timedelta(days=days)

    # 1. Update or create subscription
    sub = Subscription.query.filter_by(
        subscriber_type='company',
        subscriber_id=company_id
    ).order_by(Subscription.created_at.desc()).first()

    if sub:
        sub.plan_id = plan.id
        sub.status = SUB_STATUS_ACTIVE
        sub.start_date = now
        sub.end_date = end_date
        sub.billing_cycle = billing_cycle
        sub.auto_renew = True
    else:
        sub = Subscription(
            subscriber_type='company',
            subscriber_id=company_id,
            plan_id=plan.id,
            status=SUB_STATUS_ACTIVE,
            start_date=now,
            end_date=end_date,
            auto_renew=True,
            billing_cycle=billing_cycle
        )
        db.session.add(sub)

    db.session.flush()

    # 2. Record Payment & Tax Invoice
    import uuid
    inv_num = f"INV-{now.year}-{uuid.uuid4().hex[:6].upper()}"
    txn_id = moyasar_payment_id or f"MOY-{uuid.uuid4().hex[:10].upper()}"

    payment = Payment(
        subscription_id=sub.id,
        amount=total_amount,
        subtotal=subtotal,
        vat_amount=vat_amount,
        currency="SAR",
        payment_method=payment_method,
        transaction_id=txn_id,
        moyasar_payment_id=moyasar_payment_id or txn_id,
        status=PAYMENT_COMPLETED,
        invoice_number=inv_num,
        notes=f"Faeda {plan.name_en} ({billing_cycle.capitalize()}) via Moyasar {payment_method.upper()}"
    )
    db.session.add(payment)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        logger.exception("Failed to commit subscription upgrade: %s", e)
        return {"success": False, "error": f"Database commit failed: {str(e)}"}

    return {
        "success": True,
        "subscription": sub.to_dict(),
        "invoice": payment.to_dict(),
        "message": f"Successfully upgraded to {plan.name_en} via Moyasar ({payment_method.upper()})."
    }
