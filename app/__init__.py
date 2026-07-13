# ==============================================================================
# الوظيفة الأساسية للملف: إعداد تطبيق فلاسك (App Factory) وتهيئة قاعدة البيانات (SQLAlchemy).
# الروابط أو الميزات: دالة create_app() التي تقوم بتسجيل جميع الـ Blueprints لربط مسارات التطبيق.
# المتطلبات الخاصة: يعتمد على Flask, Flask-SQLAlchemy, استيراد النماذج (Models) والـ Blueprints.
# ==============================================================================
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

db = SQLAlchemy()

def create_app():
    
    base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    template_dir = os.path.join(base_dir, 'templates')
    
    app = Flask(__name__,template_folder=os.path.join(base_dir, 'templates'),static_folder=os.path.join(base_dir, 'static'))
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    # 🔴  هذا السطر لتفعيل الجلسات 🔴
    app.secret_key = 'faeda_super_secret_key_2024'
    
    # Configure Upload Directories
    app.config['UPLOAD_CUSTOMERS_IMAGES'] = os.path.join(base_dir, 'static', 'uploads', 'customers', 'images')
    app.config['UPLOAD_TEAM_IMAGES'] = os.path.join(base_dir, 'static', 'uploads', 'customers', 'teams', 'images')
    app.config['UPLOAD_CUSTOMERS_CV'] = os.path.join(base_dir, 'static', 'uploads', 'customers', 'cv')
    app.config['UPLOAD_company_logo'] = os.path.join(base_dir, 'static', 'uploads', 'company', 'logo')
    app.config['UPLOAD_COMPANY_COMMERCIAL_REGISTER'] = os.path.join(base_dir, 'static', 'uploads', 'company', 'commercial_register')
    
    db.init_app(app)

    with app.app_context():
        # استيراد النماذج (Models) ليتعرف عليها SQLAlchemy
        from services.customer import Customers
        from services.message import Message
        from services.admin import Admin
        from services.company import Company
        from services.job import Jobs
        from services.teams import Teams
        from services.report import Report
        from services.audit_log import AuditLog
        from services.subscription import SubscriptionPlan, Subscription, Payment
        from services.system_settings import SystemSetting
        from services.job_category import JobCategory
        
        # استيراد وتسجيل المسارات (Blueprints)
        from app.blueprints.core import core_bp
        from app.blueprints.customers import customer 
        from app.blueprints.companies import company
        from app.blueprints.jobs import job
        from app.blueprints.messages import messages_routes 
        from app.blueprints.admin import admin_bp
        from app.blueprints.chat import chat_bp
        
        app.register_blueprint(core_bp)
        app.register_blueprint(customer)
        app.register_blueprint(company)
        app.register_blueprint(job)
        app.register_blueprint(messages_routes)
        app.register_blueprint(admin_bp)
        app.register_blueprint(chat_bp)
        
        # إنشاء الجداول في قاعدة البيانات (في حال لم تكن موجودة)
        db.create_all()

    return app