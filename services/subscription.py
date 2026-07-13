# ==============================================================================
# الوظيفة الأساسية للملف: نماذج قاعدة البيانات (Models) لنظام الاشتراكات والمدفوعات.
# الروابط أو الميزات: إدارة خطط الاشتراك، الاشتراكات النشطة، وسجل المدفوعات.
# المتطلبات الخاصة: يعتمد على SQLAlchemy. لا يتضمن ربط بوابة دفع (يُضاف لاحقاً).
# ==============================================================================
from datetime import datetime
from app import db
import json


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
}


class SubscriptionPlan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name_ar = db.Column(db.String(100), nullable=False)
    name_en = db.Column(db.String(100), nullable=False)
    description_ar = db.Column(db.Text, nullable=True)
    description_en = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(3), default='SAR')
    billing_cycle = db.Column(db.String(20), default=BILLING_MONTHLY)
    features = db.Column(db.Text, nullable=True)  # JSON string of feature list
    max_jobs = db.Column(db.Integer, default=5)
    max_teams = db.Column(db.Integer, default=3)
    is_active = db.Column(db.Boolean, default=True)
    sort_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    subscriptions = db.relationship('Subscription', backref='plan', lazy=True)

    def __init__(self, name_ar, name_en, price, billing_cycle=BILLING_MONTHLY, currency='SAR',
                 description_ar=None, description_en=None, features=None, max_jobs=5, max_teams=3, sort_order=0):
        self.name_ar = name_ar
        self.name_en = name_en
        self.price = price
        self.billing_cycle = billing_cycle
        self.currency = currency
        self.description_ar = description_ar
        self.description_en = description_en
        if isinstance(features, list):
            self.features = json.dumps(features, ensure_ascii=False)
        else:
            self.features = features
        self.max_jobs = max_jobs
        self.max_teams = max_teams
        self.sort_order = sort_order

    @property
    def features_list(self):
        if self.features:
            try:
                return json.loads(self.features)
            except (json.JSONDecodeError, TypeError):
                return []
        return []

    @property
    def billing_cycle_label(self):
        return BILLING_CYCLES.get(self.billing_cycle, self.billing_cycle)

    @classmethod
    def get_active_plans(cls):
        return cls.query.filter_by(is_active=True).order_by(cls.sort_order).all()

    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(id=id).first()


class Subscription(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    subscriber_type = db.Column(db.String(20), nullable=False)  # 'customer', 'company'
    subscriber_id = db.Column(db.Integer, nullable=False)
    plan_id = db.Column(db.Integer, db.ForeignKey('subscription_plan.id'), nullable=False)
    status = db.Column(db.String(20), default=SUB_STATUS_ACTIVE)
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    end_date = db.Column(db.DateTime, nullable=True)
    auto_renew = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    payments = db.relationship('Payment', backref='subscription', lazy=True)

    def __init__(self, subscriber_type, subscriber_id, plan_id, status=SUB_STATUS_ACTIVE,
                 start_date=None, end_date=None, auto_renew=True):
        self.subscriber_type = subscriber_type
        self.subscriber_id = subscriber_id
        self.plan_id = plan_id
        self.status = status
        self.start_date = start_date or datetime.utcnow()
        self.end_date = end_date
        self.auto_renew = auto_renew

    @property
    def status_label(self):
        return SUB_STATUSES.get(self.status, self.status)

    @property
    def is_expired(self):
        if self.end_date:
            return datetime.utcnow() > self.end_date
        return False

    @classmethod
    def get_active_count(cls):
        return cls.query.filter_by(status=SUB_STATUS_ACTIVE).count()

    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(id=id).first()


class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    subscription_id = db.Column(db.Integer, db.ForeignKey('subscription.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(3), default='SAR')
    payment_method = db.Column(db.String(30), nullable=True)
    transaction_id = db.Column(db.String(100), nullable=True)
    status = db.Column(db.String(20), default=PAYMENT_PENDING)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, subscription_id, amount, currency='SAR', payment_method=None,
                 transaction_id=None, status=PAYMENT_PENDING, notes=None):
        self.subscription_id = subscription_id
        self.amount = amount
        self.currency = currency
        self.payment_method = payment_method
        self.transaction_id = transaction_id
        self.status = status
        self.notes = notes

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
