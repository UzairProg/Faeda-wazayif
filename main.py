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
app.secret_key = "SecretKey!" #This supposed to be secret
app.permanent_session_lifetime = timedelta(minutes=10)

serial = URLSafeTimedSerializer('SecretKey!') #This supposed to be secret



app.config['MAIL_SERVER'] = 'smtp.googlemail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'temproryosama123@gmail.com' #This supposed to be secret
app.config['MAIL_PASSWORD'] = 'lhje fnuq vxlp njua' #This supposed to be secret
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False

mail = Mail(app)

def login_required(function):
    def wrapper(*args, **kwargs):
        if 'email' not in session:
            return render_template('login.html')
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



