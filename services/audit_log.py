# ==============================================================================
# الوظيفة الأساسية للملف: نموذج قاعدة البيانات (Model) لسجل عمليات المديرين (Audit Log).
# الروابط أو الميزات: تتبع جميع إجراءات المديرين للمساءلة والأمان.
# المتطلبات الخاصة: يعتمد على SQLAlchemy وارتباط بجدول المديرين.
# ==============================================================================
from datetime import datetime
from app import db
import json


# Action type constants
ACTION_LABELS = {
    # User actions
    'create_user': 'إنشاء مستخدم',
    'edit_user': 'تعديل مستخدم',
    'delete_user': 'حذف مستخدم',
    'suspend_user': 'إيقاف مستخدم',
    'ban_user': 'حظر مستخدم',
    'warn_user': 'تحذير مستخدم',
    'activate_user': 'تفعيل مستخدم',
    'verify_user': 'توثيق مستخدم',
    'reset_password': 'إعادة تعيين كلمة المرور',
    # Company actions
    'verify_company': 'توثيق شركة',
    'suspend_company': 'إيقاف شركة',
    # Team actions
    'delete_team': 'حذف مجموعة',
    'transfer_team': 'نقل ملكية مجموعة',
    # Job actions
    'approve_job': 'قبول وظيفة',
    'reject_job': 'رفض وظيفة',
    'edit_job': 'تعديل وظيفة',
    'delete_job': 'حذف وظيفة',
    # Report actions
    'resolve_report': 'حل بلاغ',
    'dismiss_report': 'رفض بلاغ',
    'assign_report': 'تعيين بلاغ',
    # Billing actions
    'create_plan': 'إنشاء خطة اشتراك',
    'edit_plan': 'تعديل خطة اشتراك',
    'delete_plan': 'حذف خطة اشتراك',
    # Settings actions
    'update_settings': 'تحديث إعدادات النظام',
    'create_admin': 'إنشاء حساب مدير',
    'edit_admin': 'تعديل حساب مدير',
    'delete_admin': 'حذف حساب مدير',
    # Category actions
    'create_category': 'إنشاء تصنيف',
    'edit_category': 'تعديل تصنيف',
    'delete_category': 'حذف تصنيف',
    # System actions
    'backup_database': 'نسخ احتياطي لقاعدة البيانات',
}

TARGET_TYPE_LABELS = {
    'customer': 'مستخدم',
    'company': 'شركة',
    'team': 'مجموعة',
    'job': 'وظيفة',
    'report': 'بلاغ',
    'plan': 'خطة اشتراك',
    'category': 'تصنيف',
    'admin': 'مدير',
    'settings': 'إعدادات',
    'database': 'قاعدة بيانات',
}


class AuditLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    admin_id = db.Column(db.Integer, db.ForeignKey('admin.id'), nullable=False)
    action = db.Column(db.String(50), nullable=False)
    target_type = db.Column(db.String(20), nullable=True)
    target_id = db.Column(db.Integer, nullable=True)
    details = db.Column(db.Text, nullable=True)  # JSON string with context data
    ip_address = db.Column(db.String(45), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, admin_id, action, target_type=None, target_id=None, details=None, ip_address=None):
        self.admin_id = admin_id
        self.action = action
        self.target_type = target_type
        self.target_id = target_id
        if isinstance(details, dict):
            self.details = json.dumps(details, ensure_ascii=False)
        else:
            self.details = details
        self.ip_address = ip_address

    @property
    def action_label(self):
        return ACTION_LABELS.get(self.action, self.action)

    @property
    def target_type_label(self):
        return TARGET_TYPE_LABELS.get(self.target_type, self.target_type or '')

    @property
    def details_dict(self):
        """Parse the JSON details string into a dictionary."""
        if self.details:
            try:
                return json.loads(self.details)
            except (json.JSONDecodeError, TypeError):
                return {}
        return {}

    @classmethod
    def log_action(cls, admin_id, action, target_type=None, target_id=None, details=None, ip_address=None):
        """Convenience method to create and commit an audit log entry."""
        log = cls(
            admin_id=admin_id,
            action=action,
            target_type=target_type,
            target_id=target_id,
            details=details,
            ip_address=ip_address,
        )
        db.session.add(log)
        db.session.commit()
        return log
