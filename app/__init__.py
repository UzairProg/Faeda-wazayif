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
    env = os.environ.get('FLASK_ENV', 'development')
    if env == 'production':
        app.config.from_object('config.ProductionConfig')
    else:
        app.config.from_object('config.DevelopmentConfig')
    
    db.init_app(app)

    allowed_origins = [
        os.environ.get('FRONTEND_ORIGIN', 'http://localhost:5173'),
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ]

    CORS(
        app,
        resources={r"/*": {"origins": allowed_origins}},
        supports_credentials=True,
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization", "Accept", "X-Requested-With"]
    )

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
        from services.university import University, UniversityDepartment, AcademicVerification
        from services.chat import Conversation, ConversationParticipant, ChatMessage
        
        # استيراد وتسجيل المسارات (Blueprints)
        from app.blueprints.core import core_bp
        from app.blueprints.customers import customer 
        from app.blueprints.companies import company
        from app.blueprints.jobs import job
        from app.blueprints.messages import messages_routes 
        from app.blueprints.admin import admin_bp
        from app.blueprints.chat import chat_bp
        from app.blueprints.chat_v1 import chat_v1_bp
        from app.blueprints.company_panel import company_panel_bp
        from app.blueprints.universities import university_bp
        
        app.register_blueprint(core_bp)
        app.register_blueprint(customer)
        app.register_blueprint(company)
        app.register_blueprint(job)
        app.register_blueprint(messages_routes)
        app.register_blueprint(admin_bp)
        app.register_blueprint(chat_bp)
        app.register_blueprint(chat_v1_bp)
        app.register_blueprint(company_panel_bp)
        app.register_blueprint(university_bp)
        
        from services.team_offer import TeamOffer
        db.create_all()

        @app.before_request
        def check_maintenance():
            from flask import request, render_template
            # Allow static files
            if request.endpoint == 'static':
                return
            # Allow admin panel routes to function normally
            if request.endpoint and request.endpoint.startswith('admin.'):
                return
            # Allow support routes so users can contact support during maintenance
            if request.endpoint in ['core.support', 'core.support_ticket', 'core.track_ticket']:
                return
            
            try:
                # If maintenance mode is active, render the dedicated page
                if SystemSetting.is_maintenance_mode():
                    return render_template('new_design/maintenance.html'), 503
            except Exception:
                pass

        @app.context_processor
        def inject_system_settings():
            try:
                settings = SystemSetting.get_all_settings()
                return dict(system_settings=settings)
            except Exception:
                return dict(system_settings={})

        @app.errorhandler(500)
        @app.errorhandler(Exception)
        def handle_internal_error(error):
            from flask import jsonify
            origin = os.environ.get('FRONTEND_ORIGIN', 'http://localhost:5173')
            response = jsonify({
                "error": "Internal Server Error",
                "message": str(error) if app.debug else "An unexpected error occurred."
            })
            response.status_code = 500
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            return response

    return app