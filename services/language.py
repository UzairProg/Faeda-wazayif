# ==============================================================================
# الوظيفة الأساسية للملف: نموذج قاعدة البيانات (Model) للغات الخاصة بالعميل.
# الروابط أو الميزات: تسجيل مهارات اللغات للعملاء.
# المتطلبات الخاصة: يعتمد على SQLAlchemy لربط جدول اللغات بالعميل.
# ==============================================================================
####### data for message.py#####
from datetime import datetime

from app import db


# User model
class Lang(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=True)
    language_name = db.Column(db.String(80), nullable=False)

    def __init__(self, customer_id,language_name ):
        self.customer_id = customer_id
        self.language_name = language_name










