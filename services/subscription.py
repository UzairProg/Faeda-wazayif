# ==============================================================================
# services/subscription.py
# ==============================================================================
# Database Models & Services for Faeda Jobs Subscription, Billing & Moyasar Gateway.
# Supports Saudi Mada, Credit Cards (Visa/Mastercard), Apple Pay, ZATCA VAT compliance,
# and tiered enterprise subscriptions (Starter, Professional, Enterprise).
# ==============================================================================

from datetime import datetime, timedelta
from app import db
import json
import uuid
import os


# Billing cycle constants
BILLING_MONTHLY = 'monthly'
BILLING_YEARLY = 'yearly'

BILLING_CYCLES = {
    BILLING_MONTHLY: 'شهري',
    BILLING_YEARLY: 'سنوي',
}

# Subscription status
SUB_STATUS_ACTIVE = 'active'
SUB_STATUS_EXPIRED = 'expired'
SUB_STATUS_CANCELLED = 'cancelled'
SUB_STATUS_TRIAL = 'trial'

SUB_STATUSES = {
    SUB_STATUS_ACTIVE: 'نشط',
    SUB_STATUS_EXPIRED: 'منتهي',
    SUB_STATUS_CANCELLED: 'ملغي',
    SUB_STATUS_TRIAL: 'تجريبي',
}

# Payment status
PAYMENT_COMPLETED = 'completed'
PAYMENT_FAILED = 'failed'
PAYMENT_REFUNDED = 'refunded'
PAYMENT_PENDING = 'pending'

PAYMENT_STATUSES = {
    PAYMENT_COMPLETED: 'مكتمل',
    PAYMENT_FAILED: 'فاشل',
    PAYMENT_REFUNDED: 'مسترد',
    PAYMENT_PENDING: 'بانتظار',
}

# Payment methods
PAYMENT_METHODS = {
    'credit_card': 'بطاقة ائتمان',
    'mada': 'مدى',
    'apple_pay': 'Apple Pay',
    'bank_transfer': 'تحويل بنكي',
    'moyasar': 'Moyasar Gateway',
}


class SubscriptionPlan(db.Model):
    __tablename__ = 'subscription_plan'

    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(50), unique=True, nullable=True)  # starter, professional, enterprise
    name_ar = db.Column(db.String(100), nullable=False)
    name_en = db.Column(db.String(100), nullable=False)
    description_ar = db.Column(db.Text, nullable=True)
    description_en = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)  # Monthly price in SAR
    yearly_price = db.Column(db.Float, nullable=True)  # Yearly discounted price in SAR
    currency = db.Column(db.String(3), default='SAR')
    billing_cycle = db.Column(db.String(20), default=BILLING_MONTHLY)
    features = db.Column(db.Text, nullable=True)  # JSON string of feature list
    max_jobs = db.Column(db.Integer, default=5)
    max_teams = db.Column(db.Integer, default=3)
    max_campaigns = db.Column(db.Integer, default=3)
    badge = db.Column(db.String(50), nullable=True)  # POPULAR, BEST_VALUE, ENTERPRISE
    is_active = db.Column(db.Boolean, default=True)
    sort_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    subscriptions = db.relationship('Subscription', backref='plan', lazy=True)

    def __init__(self, name_ar, name_en, price, billing_cycle=BILLING_MONTHLY, currency='SAR',
                 description_ar=None, description_en=None, features=None, max_jobs=5, max_teams=3,
                 max_campaigns=3, slug=None, yearly_price=None, badge=None, sort_order=0):
        self.name_ar = name_ar
        self.name_en = name_en
        self.price = price
        self.yearly_price = yearly_price or (price * 10 if price > 0 else 0)
        self.billing_cycle = billing_cycle
        self.currency = currency
        self.description_ar = description_ar
        self.description_en = description_en
        self.slug = slug
        self.badge = badge
        if isinstance(features, (list, dict)):
            self.features = json.dumps(features, ensure_ascii=False)
        else:
            self.features = features
        self.max_jobs = max_jobs
        self.max_teams = max_teams
        self.max_campaigns = max_campaigns
        self.sort_order = sort_order

    @property
    def features_list(self):
        if self.features:
            try:
                data = json.loads(self.features)
                if isinstance(data, list):
                    return data
                elif isinstance(data, dict):
                    return data.get('en', [])
            except (json.JSONDecodeError, TypeError):
                return []
        return []

    @property
    def features_dict(self):
        if self.features:
            try:
                data = json.loads(self.features)
                if isinstance(data, dict):
                    return data
                elif isinstance(data, list):
                    return {"ar": data, "en": data}
            except Exception:
                pass
        return {"ar": [], "en": []}

    @property
    def billing_cycle_label(self):
        return BILLING_CYCLES.get(self.billing_cycle, self.billing_cycle)

    @classmethod
    def get_active_plans(cls):
        plans = cls.query.filter_by(is_active=True).order_by(cls.sort_order).all()
        if not plans:
            cls.seed_default_plans()
            plans = cls.query.filter_by(is_active=True).order_by(cls.sort_order).all()
        return plans

    @classmethod
    def get_by_id_or_slug(cls, identifier):
        if str(identifier).isdigit():
            plan = cls.query.get(int(identifier))
            if plan:
                return plan
        return cls.query.filter_by(slug=str(identifier)).first()

    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(id=id).first()

    def to_dict(self):
        feat = self.features_dict
        return {
            "id": self.id,
            "slug": self.slug or f"plan_{self.id}",
            "name_ar": self.name_ar,
            "name_en": self.name_en,
            "description_ar": self.description_ar,
            "description_en": self.description_en,
            "price_monthly": float(self.price),
            "price_yearly": float(self.yearly_price if self.yearly_price is not None else (self.price * 10)),
            "currency": self.currency,
            "billing_cycle": self.billing_cycle,
            "max_jobs": self.max_jobs,
            "max_teams": self.max_teams,
            "max_campaigns": self.max_campaigns,
            "badge": self.badge,
            "features_ar": feat.get("ar", []),
            "features_en": feat.get("en", []),
            "sort_order": self.sort_order,
            "is_active": self.is_active,
        }

    @classmethod
    def seed_default_plans(cls):
        """Seed standard Saudi corporate tiers if not present."""
        default_defs = [
            {
                "slug": "starter",
                "name_ar": "الباقة الأساسية",
                "name_en": "Starter Plan",
                "price": 199.0,
                "yearly_price": 1990.0,
                "currency": "SAR",
                "max_jobs": 5,
                "max_teams": 3,
                "max_campaigns": 3,
                "badge": None,
                "sort_order": 1,
                "features": {
                    "ar": [
                        "5 وظائف نشطة معلنة",
                        "50 متقدم / شهرياً مع فحص السير",
                        "3 حملات استقطاب كفاءات",
                        "محادثات مباشرة مع المرشحين",
                        "تقارير التوظيف الأساسية",
                        "دعم فني عبر البريد"
                    ],
                    "en": [
                        "5 Active Job Postings",
                        "50 Applications / month with ATS parsing",
                        "3 Talent Discovery Campaigns",
                        "Direct In-App Candidate Messaging",
                        "Basic Recruitment Analytics",
                        "Standard Email Support"
                    ]
                }
            },
            {
                "slug": "professional",
                "name_ar": "الباقة الاحترافية",
                "name_en": "Professional Plan",
                "price": 499.0,
                "yearly_price": 4990.0,
                "currency": "SAR",
                "max_jobs": 25,
                "max_teams": 10,
                "max_campaigns": 20,
                "badge": "POPULAR",
                "sort_order": 2,
                "features": {
                    "ar": [
                        "25 وظيفة نشطة معلنة",
                        "500 متقدم / شهرياً مع مطابقة الذكاء الاصطناعي",
                        "20 حملة توظيف متقدمة",
                        "اكتشاف الكفاءات واستقطاب الفرق الجاهزة",
                        "تقييم القيمة السوقية للمرشحين",
                        "تحليلات توظيف متقدمة ومؤشرات أداء",
                        "دعم أولوية مخصص على مدار الساعة"
                    ],
                    "en": [
                        "25 Active Job Postings",
                        "500 Applications / month with AI matching",
                        "20 Advanced Talent Campaigns",
                        "Talent Pool & Ready-made Teams Discovery",
                        "AI Candidate Market Value Scoring",
                        "Advanced Hiring Pipeline & KPIs",
                        "24/7 Priority Support"
                    ]
                }
            },
            {
                "slug": "enterprise",
                "name_ar": "باقة المؤسسات الكبرى",
                "name_en": "Enterprise Elite",
                "price": 0.0,  # Custom
                "yearly_price": 0.0,
                "currency": "SAR",
                "max_jobs": 9999,
                "max_teams": 9999,
                "max_campaigns": 9999,
                "badge": "CUSTOM",
                "sort_order": 3,
                "features": {
                    "ar": [
                        "وظائف معلنة غير محدودة",
                        "طلبات وتطبيقات غير محدودة",
                        "حملات استقطاب وتوظيف غير محدودة",
                        "تكامل كامل مع أنظمة المنشأة عبر API",
                        "مدير حساب تقني مخصص",
                        "اتفاقية مستوى خدمة (SLA) مضمونة 99.9%",
                        "تقارير مخصصة وفواتير ضريبية مجدولة"
                    ],
                    "en": [
                        "Unlimited Active Job Postings",
                        "Unlimited Candidate Applications",
                        "Unlimited Talent Campaigns",
                        "Full Corporate ATS API Integration",
                        "Dedicated Enterprise Account Manager",
                        "Guaranteed 99.9% Enterprise SLA",
                        "Custom ZATCA-compliant Consolidated Invoicing"
                    ]
                }
            }
        ]

        for p_def in default_defs:
            existing = cls.query.filter((cls.slug == p_def["slug"]) | (cls.name_en == p_def["name_en"])).first()
            if not existing:
                plan = cls(
                    slug=p_def["slug"],
                    name_ar=p_def["name_ar"],
                    name_en=p_def["name_en"],
                    price=p_def["price"],
                    yearly_price=p_def["yearly_price"],
                    currency=p_def["currency"],
                    max_jobs=p_def["max_jobs"],
                    max_teams=p_def["max_teams"],
                    max_campaigns=p_def["max_campaigns"],
                    badge=p_def["badge"],
                    sort_order=p_def["sort_order"],
                    features=p_def["features"]
                )
                db.session.add(plan)
        try:
            db.session.commit()
        except Exception:
            db.session.rollback()


class Subscription(db.Model):
    __tablename__ = 'subscription'

    id = db.Column(db.Integer, primary_key=True)
    subscriber_type = db.Column(db.String(20), nullable=False)  # 'company', 'customer'
    subscriber_id = db.Column(db.Integer, nullable=False)
    plan_id = db.Column(db.Integer, db.ForeignKey('subscription_plan.id'), nullable=False)
    status = db.Column(db.String(20), default=SUB_STATUS_ACTIVE)
    billing_cycle = db.Column(db.String(20), default=BILLING_MONTHLY)
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    end_date = db.Column(db.DateTime, nullable=True)
    auto_renew = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    payments = db.relationship('Payment', backref='subscription', lazy=True)

    def __init__(self, subscriber_type, subscriber_id, plan_id, status=SUB_STATUS_ACTIVE,
                 start_date=None, end_date=None, auto_renew=True, billing_cycle=BILLING_MONTHLY):
        self.subscriber_type = subscriber_type
        self.subscriber_id = subscriber_id
        self.plan_id = plan_id
        self.status = status
        self.start_date = start_date or datetime.utcnow()
        if end_date:
            self.end_date = end_date
        else:
            days = 365 if billing_cycle == BILLING_YEARLY else 30
            self.end_date = self.start_date + timedelta(days=days)
        self.auto_renew = auto_renew
        self.billing_cycle = billing_cycle

    @property
    def status_label(self):
        return SUB_STATUSES.get(self.status, self.status)

    @property
    def is_expired(self):
        if self.end_date:
            return datetime.utcnow() > self.end_date
        return False

    @property
    def days_remaining(self):
        if self.end_date:
            diff = self.end_date - datetime.utcnow()
            return max(0, diff.days)
        return 0

    @classmethod
    def get_active_count(cls):
        return cls.query.filter_by(status=SUB_STATUS_ACTIVE).count()

    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(id=id).first()

    @classmethod
    def get_company_active_subscription(cls, company_id):
        sub = cls.query.filter_by(
            subscriber_type='company',
            subscriber_id=company_id,
            status=SUB_STATUS_ACTIVE
        ).order_by(cls.created_at.desc()).first()

        # If no active subscription exists, create or assign default trial/starter
        if not sub:
            default_plan = SubscriptionPlan.get_by_id_or_slug('professional') or SubscriptionPlan.query.first()
            if default_plan:
                sub = cls(
                    subscriber_type='company',
                    subscriber_id=company_id,
                    plan_id=default_plan.id,
                    status=SUB_STATUS_ACTIVE,
                    start_date=datetime.utcnow(),
                    end_date=datetime.utcnow() + timedelta(days=30),
                    billing_cycle=BILLING_MONTHLY
                )
                db.session.add(sub)
                try:
                    db.session.commit()
                except Exception:
                    db.session.rollback()
        return sub

    def to_dict(self):
        plan_dict = self.plan.to_dict() if self.plan else None
        return {
            "id": self.id,
            "subscriber_type": self.subscriber_type,
            "subscriber_id": self.subscriber_id,
            "plan_id": self.plan_id,
            "plan": plan_dict,
            "status": self.status,
            "status_label": self.status_label,
            "billing_cycle": self.billing_cycle,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "auto_renew": self.auto_renew,
            "is_expired": self.is_expired,
            "days_remaining": self.days_remaining,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Payment(db.Model):
    __tablename__ = 'payment'

    id = db.Column(db.Integer, primary_key=True)
    subscription_id = db.Column(db.Integer, db.ForeignKey('subscription.id'), nullable=False)
    invoice_number = db.Column(db.String(50), unique=True, nullable=True)  # e.g. INV-2026-0041
    amount = db.Column(db.Float, nullable=False)  # Total amount charged (incl. VAT)
    subtotal = db.Column(db.Float, nullable=True)  # Amount before 15% VAT
    vat_amount = db.Column(db.Float, nullable=True)  # 15% Saudi VAT
    currency = db.Column(db.String(3), default='SAR')
    payment_method = db.Column(db.String(30), nullable=True)  # mada, credit_card, apple_pay
    moyasar_payment_id = db.Column(db.String(100), nullable=True)  # Moyasar UUID
    transaction_id = db.Column(db.String(100), nullable=True)
    status = db.Column(db.String(20), default=PAYMENT_PENDING)
    receipt_url = db.Column(db.String(255), nullable=True)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, subscription_id, amount, currency='SAR', payment_method=None,
                 transaction_id=None, status=PAYMENT_PENDING, notes=None,
                 moyasar_payment_id=None, subtotal=None, vat_amount=None, invoice_number=None):
        self.subscription_id = subscription_id
        self.amount = float(amount)
        self.currency = currency
        self.payment_method = payment_method or 'mada'
        self.moyasar_payment_id = moyasar_payment_id
        self.transaction_id = transaction_id or moyasar_payment_id or f"TXN-{uuid.uuid4().hex[:12].upper()}"
        self.status = status
        self.notes = notes

        # Calculate VAT breakdown (0% if company is not VAT-registered)
        vat_enabled = os.environ.get("COMPANY_VAT_ENABLED", "false").lower() in ("true", "1", "yes")
        if subtotal is not None and vat_amount is not None:
            self.subtotal = float(subtotal)
            self.vat_amount = float(vat_amount)
        elif vat_enabled:
            self.subtotal = round(self.amount / 1.15, 2)
            self.vat_amount = round(self.amount - self.subtotal, 2)
        else:
            self.subtotal = round(float(self.amount), 2)
            self.vat_amount = 0.0

        # Generate standard sequential invoice number if omitted
        self.invoice_number = invoice_number or f"INV-{datetime.utcnow().year}-{uuid.uuid4().hex[:6].upper()}"

    @property
    def status_label(self):
        return PAYMENT_STATUSES.get(self.status, self.status)

    @property
    def payment_method_label(self):
        return PAYMENT_METHODS.get(self.payment_method, self.payment_method or '')

    @classmethod
    def get_total_revenue(cls):
        result = db.session.query(db.func.sum(cls.amount)).filter_by(status=PAYMENT_COMPLETED).scalar()
        return result or 0.0

    def to_dict(self):
        plan_name = self.subscription.plan.name_en if self.subscription and self.subscription.plan else "Subscription Plan"
        vat_enabled = os.environ.get("COMPANY_VAT_ENABLED", "false").lower() in ("true", "1", "yes")
        vat_number = os.environ.get("COMPANY_VAT_NUMBER") if vat_enabled else None
        return {
            "id": self.id,
            "invoice_number": self.invoice_number or f"INV-2026-{self.id:04d}",
            "subscription_id": self.subscription_id,
            "plan_name": plan_name,
            "amount": float(self.amount),
            "subtotal": float(self.subtotal if self.subtotal is not None else self.amount),
            "vat_amount": float(self.vat_amount if self.vat_amount is not None else 0.0),
            "vat_rate": "15%" if vat_enabled else "0%",
            "currency": self.currency,
            "payment_method": self.payment_method,
            "payment_method_label": self.payment_method_label,
            "moyasar_payment_id": self.moyasar_payment_id,
            "transaction_id": self.transaction_id,
            "status": self.status,
            "status_label": self.status_label,
            "date": self.created_at.strftime("%Y-%m-%d") if self.created_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "company_vat_number": vat_number,
            "vat_registered": vat_enabled,
        }
