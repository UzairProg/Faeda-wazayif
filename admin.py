# ==============================================================================
# الوظيفة الأساسية للملف: يحتوي على نموذج قاعدة البيانات (Database Model) الخاص بحسابات المديرين (Admin).
# الروابط أو الميزات: يستخدم لتعريف وحفظ بيانات المديرين في قاعدة البيانات.
# المتطلبات الخاصة: يعتمد على مكتبة SQLAlchemy (db).
# ==============================================================================
####### data for admin.py#####
from datetime import datetime

from services.database import db


# User model
class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(120), nullable=True)
    photo = db.Column(db.String(120), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, username, email , password , photo):
        self.username = username
        self.email = email
        self.password = password        
        self.photo = photo