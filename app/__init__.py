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
    db.init_app(app)

    with app.app_context():
        # استيراد النماذج (Models) ليتعرف عليها SQLAlchemy
        from services.customer import Customers
        from services.message import Message
        
        # استيراد وتسجيل المسارات (Blueprints)
        from app.blueprints.core import core_bp
        from app.blueprints.customers import customer 
        from app.blueprints.companies import company
        from app.blueprints.jobs import job
        from app.blueprints.messages import messages_routes 
        
        app.register_blueprint(core_bp)
        app.register_blueprint(customer)
        app.register_blueprint(company)
        app.register_blueprint(job)
        app.register_blueprint(messages_routes)
        
        # إنشاء الجداول في قاعدة البيانات (في حال لم تكن موجودة)
        db.create_all()

    return app