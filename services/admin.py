# ==============================================================================
# الوظيفة الأساسية للملف: نموذج قاعدة البيانات (Model) لجدول المديرين (Admin) مع نظام الصلاحيات (RBAC).
# الروابط أو الميزات: إنشاء خصائص وحقول جدول المديرين بما في ذلك الأدوار والتحقق من كلمات المرور.
# المتطلبات الخاصة: يعتمد على SQLAlchemy كائن (db) من التطبيق ومكتبة werkzeug.security لتشفير كلمات المرور.
# ==============================================================================
from datetime import datetime

from app import db
from werkzeug.security import generate_password_hash, check_password_hash


# Admin Roles Constants
ROLE_SUPER_ADMIN = 'super_admin'
ROLE_SUPPORT_MODERATOR = 'support_moderator'
ROLE_CONTENT_MODERATOR = 'content_moderator'
ROLE_FINANCE_ADMIN = 'finance_admin'

ALL_ROLES = [ROLE_SUPER_ADMIN, ROLE_SUPPORT_MODERATOR, ROLE_CONTENT_MODERATOR, ROLE_FINANCE_ADMIN]

ROLE_LABELS = {
    ROLE_SUPER_ADMIN: 'مدير عام',
    ROLE_SUPPORT_MODERATOR: 'مشرف دعم',
    ROLE_CONTENT_MODERATOR: 'مشرف محتوى',
    ROLE_FINANCE_ADMIN: 'مدير مالي',
}

# Permissions map: role -> set of allowed module keys
ROLE_PERMISSIONS = {
    ROLE_SUPER_ADMIN: {
        'dashboard', 'users', 'users.crud', 'users.actions',
        'companies', 'companies.verify',
        'teams', 'teams.crud',
        'jobs', 'jobs.crud',
        'reports', 'reports.resolve',
        'audit_logs',
        'billing', 'billing.crud',
        'settings', 'settings.admins',
    },
    ROLE_SUPPORT_MODERATOR: {
        'dashboard',
        'users', 'users.actions',  # view + warn only (no crud)
        'companies',
        'reports', 'reports.resolve',
    },
    ROLE_CONTENT_MODERATOR: {
        'dashboard',
        'teams', 'teams.crud',
        'jobs', 'jobs.crud',
        'reports', 'reports.resolve',
    },
    ROLE_FINANCE_ADMIN: {
        'dashboard',
        'users',  # view-only
        'companies',
        'billing', 'billing.crud',
    },
}


class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=True)  # Legacy plain-text field kept for migration
    password_hash = db.Column(db.String(256), nullable=True)
    photo = db.Column(db.String(120), nullable=True)
    role = db.Column(db.String(50), nullable=False, default=ROLE_SUPPORT_MODERATOR)
    is_active = db.Column(db.Boolean, default=True)
    last_login = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)  # Keep for backward compat

    # Relationships
    audit_logs = db.relationship('AuditLog', backref='admin', lazy=True)

    def __init__(self, username, email, password=None, photo=None, role=ROLE_SUPPORT_MODERATOR):
        self.username = username
        self.email = email
        if password:
            self.set_password(password)
        self.photo = photo
        self.role = role

    def set_password(self, password):
        """Hash and store the password securely."""
        self.password_hash = generate_password_hash(password)
        self.password = None  # Clear legacy plain-text

    def check_password(self, password):
        """Verify password against stored hash. Falls back to legacy plain-text check."""
        if self.password_hash:
            return check_password_hash(self.password_hash, password)
        # Legacy fallback for old accounts
        if self.password and self.password == password:
            # Auto-migrate to hashed password
            self.set_password(password)
            db.session.commit()
            return True
        return False

    def has_permission(self, permission):
        """Check if admin's role includes the given permission key."""
        role_perms = ROLE_PERMISSIONS.get(self.role, set())
        return permission in role_perms

    @property
    def role_label(self):
        """Get Arabic label for the admin's role."""
        return ROLE_LABELS.get(self.role, self.role)

    @classmethod
    def get_by_email(cls, email):
        return cls.query.filter_by(email=email).first()

    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(id=id).first()

    @classmethod
    def get_by_username(cls, username):
        return cls.query.filter_by(username=username).first()