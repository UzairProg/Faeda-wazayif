# ==============================================================================
# الوظيفة الأساسية للملف: نماذج قاعدة البيانات (Models) لخيارات الفلاتر.
# الروابط أو الميزات: إدارة المدن وأنواع الوظائف.
# المتطلبات الخاصة: يعتمد على SQLAlchemy.
# ==============================================================================
from datetime import datetime
from app import db


class City(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name_ar = db.Column(db.String(100), nullable=False)
    name_en = db.Column(db.String(100), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    sort_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, name_ar, name_en=None, sort_order=0):
        self.name_ar = name_ar
        self.name_en = name_en
        self.sort_order = sort_order

    @classmethod
    def get_active_cities(cls):
        return cls.query.filter_by(is_active=True).order_by(cls.sort_order).all()

    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(id=id).first()


class JobType(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name_ar = db.Column(db.String(100), nullable=False)
    name_en = db.Column(db.String(100), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    sort_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, name_ar, name_en=None, sort_order=0):
        self.name_ar = name_ar
        self.name_en = name_en
        self.sort_order = sort_order

    @classmethod
    def get_active_job_types(cls):
        return cls.query.filter_by(is_active=True).order_by(cls.sort_order).all()

    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(id=id).first()

class Specialty(db.Model):
    __tablename__ = 'specialties'

    id = db.Column(db.Integer, primary_key=True)
    name_ar = db.Column(db.String(100), nullable=False, unique=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)

    @classmethod
    def get_active_specialties(cls):
        return cls.query.filter_by(is_active=True).all()

    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(id=id).first()
