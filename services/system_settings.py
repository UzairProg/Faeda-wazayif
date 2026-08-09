# ==============================================================================
# الوظيفة الأساسية للملف: نموذج قاعدة البيانات (Model) لإعدادات النظام العامة.
# الروابط أو الميزات: تخزين إعدادات المنصة مثل وضع الصيانة، روابط سياسة الخصوصية، والإشعارات.
# المتطلبات الخاصة: يعتمد على SQLAlchemy. يستخدم نمط key-value للمرونة.
# ==============================================================================
from datetime import datetime
from app import db


# Default settings keys
SETTING_KEYS = {
    'maintenance_mode': {
        'label': 'وضع الصيانة',
        'type': 'boolean',
        'default': 'false',
    },
    'tos_url': {
        'label': 'رابط شروط الاستخدام',
        'type': 'url',
        'default': '',
    },
    'privacy_url': {
        'label': 'رابط سياسة الخصوصية',
        'type': 'url',
        'default': '',
    },
    'notification_banner': {
        'label': 'نص إشعار عام',
        'type': 'text',
        'default': '',
    },
    'banner_active': {
        'label': 'تفعيل الإشعار العام',
        'type': 'boolean',
        'default': 'false',
    },
    'support_email': {
        'label': 'بريد الدعم الفني',
        'type': 'email',
        'default': 'support@faeda.com',
    },
    'max_jobs_per_company': {
        'label': 'الحد الأقصى للوظائف لكل شركة',
        'type': 'number',
        'default': '50',
    },
    'ai_assistant_active': {
        'label': 'تفعيل المساعد الذكي (AI Assistant)',
        'type': 'boolean',
        'default': 'true',
    },
}


class SystemSetting(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(100), unique=True, nullable=False)
    value = db.Column(db.Text, nullable=True)
    updated_by = db.Column(db.Integer, db.ForeignKey('admin.id'), nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __init__(self, key, value=None, updated_by=None):
        self.key = key
        self.value = value
        self.updated_by = updated_by

    @classmethod
    def get_value(cls, key, default=None):
        """Get a setting value by key, falling back to default."""
        setting = cls.query.filter_by(key=key).first()
        if setting and setting.value is not None:
            return setting.value
        # Fall back to defined defaults
        key_config = SETTING_KEYS.get(key)
        if key_config:
            return key_config.get('default', default)
        return default

    @classmethod
    def set_value(cls, key, value, admin_id=None):
        """Set a setting value, creating the record if it doesn't exist."""
        setting = cls.query.filter_by(key=key).first()
        if setting:
            setting.value = value
            setting.updated_by = admin_id
            setting.updated_at = datetime.utcnow()
        else:
            setting = cls(key=key, value=value, updated_by=admin_id)
            db.session.add(setting)
        db.session.commit()
        return setting

    @classmethod
    def get_all_settings(cls):
        """Get all settings as a dictionary."""
        settings = cls.query.all()
        result = {}
        for setting in settings:
            result[setting.key] = setting.value
        # Fill in defaults for missing keys
        for key, config in SETTING_KEYS.items():
            if key not in result:
                result[key] = config.get('default', '')
        return result

    @classmethod
    def is_maintenance_mode(cls):
        """Quick check if the platform is in maintenance mode."""
        return cls.get_value('maintenance_mode', 'false').lower() == 'true'
