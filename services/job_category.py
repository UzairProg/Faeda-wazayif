# ==============================================================================
# الوظيفة الأساسية للملف: نموذج قاعدة البيانات (Model) لتصنيفات الوظائف.
# الروابط أو الميزات: إدارة تصنيفات وفئات الوظائف المتاحة في المنصة.
# المتطلبات الخاصة: يعتمد على SQLAlchemy.
# ==============================================================================
from datetime import datetime
from app import db


class JobCategory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name_ar = db.Column(db.String(100), nullable=False)
    name_en = db.Column(db.String(100), nullable=False)
    icon = db.Column(db.String(50), nullable=True)  # Font Awesome icon class, e.g. 'fas fa-code'
    is_active = db.Column(db.Boolean, default=True)
    sort_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, name_ar, name_en, icon=None, sort_order=0):
        self.name_ar = name_ar
        self.name_en = name_en
        self.icon = icon
        self.sort_order = sort_order

    @classmethod
    def get_active_categories(cls):
        return cls.query.filter_by(is_active=True).order_by(cls.sort_order).all()

    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(id=id).first()

    @classmethod
    def get_all(cls):
        return cls.query.order_by(cls.sort_order).all()
