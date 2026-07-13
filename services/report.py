# ==============================================================================
# الوظيفة الأساسية للملف: نموذج قاعدة البيانات (Model) لنظام البلاغات والتذاكر.
# الروابط أو الميزات: إدارة البلاغات المقدمة من المستخدمين (محتوى مخالف، وظائف وهمية، إلخ).
# المتطلبات الخاصة: يعتمد على SQLAlchemy وارتباطات مع جدول المديرين.
# ==============================================================================
from datetime import datetime
from app import db


# Report status constants
REPORT_STATUS_PENDING = 'pending'
REPORT_STATUS_REVIEWING = 'reviewing'
REPORT_STATUS_RESOLVED = 'resolved'
REPORT_STATUS_DISMISSED = 'dismissed'

REPORT_STATUSES = [REPORT_STATUS_PENDING, REPORT_STATUS_REVIEWING, REPORT_STATUS_RESOLVED, REPORT_STATUS_DISMISSED]

REPORT_STATUS_LABELS = {
    REPORT_STATUS_PENDING: 'بانتظار المراجعة',
    REPORT_STATUS_REVIEWING: 'قيد المراجعة',
    REPORT_STATUS_RESOLVED: 'تم الحل',
    REPORT_STATUS_DISMISSED: 'مرفوض',
}

# Report reason constants
REPORT_REASONS = {
    'spam': 'محتوى مزعج',
    'fake': 'محتوى مزيف',
    'harassment': 'تحرش أو إساءة',
    'inappropriate': 'محتوى غير لائق',
    'scam': 'احتيال',
    'other': 'أخرى',
}

# Report target types
REPORT_TARGET_TYPES = {
    'customer': 'مستخدم',
    'company': 'شركة',
    'team': 'مجموعة',
    'job': 'وظيفة',
}

# Priority levels
REPORT_PRIORITIES = {
    'low': 'منخفضة',
    'medium': 'متوسطة',
    'high': 'عالية',
    'critical': 'حرجة',
}


class Report(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reporter_type = db.Column(db.String(20), nullable=False)  # 'customer', 'company'
    reporter_id = db.Column(db.Integer, nullable=False)
    target_type = db.Column(db.String(20), nullable=False)  # 'customer', 'company', 'team', 'job'
    target_id = db.Column(db.Integer, nullable=False)
    reason = db.Column(db.String(50), nullable=False)  # 'spam', 'fake', 'harassment', etc.
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default=REPORT_STATUS_PENDING)
    priority = db.Column(db.String(10), default='medium')
    assigned_admin_id = db.Column(db.Integer, db.ForeignKey('admin.id'), nullable=True)
    resolution_note = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    resolved_at = db.Column(db.DateTime, nullable=True)

    # Relationships
    assigned_admin = db.relationship('Admin', backref='assigned_reports', foreign_keys=[assigned_admin_id])

    def __init__(self, reporter_type, reporter_id, target_type, target_id, reason, description=None, priority='medium'):
        self.reporter_type = reporter_type
        self.reporter_id = reporter_id
        self.target_type = target_type
        self.target_id = target_id
        self.reason = reason
        self.description = description
        self.priority = priority

    @property
    def status_label(self):
        return REPORT_STATUS_LABELS.get(self.status, self.status)

    @property
    def reason_label(self):
        return REPORT_REASONS.get(self.reason, self.reason)

    @property
    def target_type_label(self):
        return REPORT_TARGET_TYPES.get(self.target_type, self.target_type)

    @property
    def priority_label(self):
        return REPORT_PRIORITIES.get(self.priority, self.priority)

    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(id=id).first()

    @classmethod
    def get_pending_count(cls):
        return cls.query.filter_by(status=REPORT_STATUS_PENDING).count()

    @classmethod
    def get_by_status(cls, status):
        return cls.query.filter_by(status=status).order_by(cls.created_at.desc()).all()
