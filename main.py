# ==============================================================================
# الوظيفة الأساسية للملف: الإعدادات الأساسية للتطبيق وتهيئة خدمات فلاسك مثل البريد الإلكتروني (Flask-Mail) وإدارة الجلسات.
# الروابط أو الميزات: يوفر دوال مساعدة مثل login_required و user_on_mobile.
# المتطلبات الخاصة: يعتمد على Flask, Flask-Mail, URLSafeTimedSerializer.
# ==============================================================================
from flask import Flask, url_for, render_template, jsonify, request, session, abort
from datetime import timedelta
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired

app = Flask(__name__)
app.config.from_object('config.DevelopmentConfig')
app.permanent_session_lifetime = timedelta(minutes=10)

serial = URLSafeTimedSerializer(app.config.get('SECRET_KEY', 'default-secret-key-for-dev'))

mail = Mail(app)

def login_required(function):
    def wrapper(*args, **kwargs):
        if 'email' not in session:
            return render_template('new_design/login.html')
        else:
            return function()
    return wrapper

def user_on_mobile():

    user_agent = request.headers.get("User-Agent")
    user_agent = user_agent.lower()
    phones = ["android", "iphone"]

    for phone in phones:
        if phone in user_agent:
            return True
        
    return False



