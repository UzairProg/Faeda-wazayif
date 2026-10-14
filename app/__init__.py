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
        secret_key = os.environ.get('SECRET_KEY')
        insecure_keys = {'default-secret-key-for-dev', 'faeda-jobs-secret-key-2026', 'your_secret_key_here', ''}
        if not secret_key or secret_key in insecure_keys:
            raise RuntimeError(
                "CRITICAL SECURITY CONFIGURATION ERROR: Production deployment requires an explicit, "
                "cryptographically secure SECRET_KEY set in the environment variables."
            )
        app.config['SECRET_KEY'] = secret_key
    else:
        app.config.from_object('config.DevelopmentConfig')
    
    db.init_app(app)

    from services.csrf_protect import init_csrf
    csrf = init_csrf(app)

    from services.rate_limiter import init_rate_limiter
    rate_limiter = init_rate_limiter(app)

    CORS(
        app,
        resources={r"/*": {"origins": [r"^https?://.*"]}},
        supports_credentials=True,
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allow_headers=["Content-Type", "Authorization", "Accept", "X-Requested-With", "Origin", "X-CSRFToken", "X-CSRF-Token", "X-CSRF-TOKEN", "X-XSRF-TOKEN"]
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
        from services.university import (
            University, UniversityDepartment, AcademicVerification,
            UniversityThesisCampaign, UniversityIncubatorVenture,
            CoopTrainingSupervision, ProfessorSupervisionSchedule
        )
        from services.chat import Conversation, ConversationParticipant, ChatMessage
        from services.campaign import (
            Campaign, CampaignCandidate, CampaignJob,
            CampaignLike, CampaignComment, CampaignShare,
            CampaignSave, CampaignView, Notification,
            CampaignContent
        )
        from services.market_insights import MarketInsight, CandidateMarketInsight
        
        # استيراد وتسجيل المسارات (Blueprints)
        from app.blueprints.core import core_bp
        from app.blueprints.customers import customer 
        from app.blueprints.companies import company
        from app.blueprints.jobs import job
        from app.blueprints.messages import messages_routes 
        from app.blueprints.admin import admin_bp
        from app.blueprints.admin_v1 import admin_v1_bp
        from app.blueprints.chat import chat_bp
        from app.blueprints.chat_v1 import chat_v1_bp
        from app.blueprints.company_panel import company_panel_bp
        from app.blueprints.universities import university_bp
        from app.blueprints.campaigns_v1 import campaigns_v1_bp
        from app.blueprints.market_insights import market_insights_bp
        
        app.register_blueprint(core_bp)
        app.register_blueprint(customer)
        app.register_blueprint(company)
        app.register_blueprint(job)
        app.register_blueprint(messages_routes)
        app.register_blueprint(admin_bp)
        app.register_blueprint(admin_v1_bp)
        app.register_blueprint(chat_bp)
        app.register_blueprint(chat_v1_bp)
        app.register_blueprint(company_panel_bp)
        app.register_blueprint(university_bp)
        app.register_blueprint(campaigns_v1_bp)
        app.register_blueprint(market_insights_bp)
        
        from services.team_offer import TeamOffer
        from services.auth_token import process_request_auth
        db.create_all()

        @app.before_request
        def authenticate_token():
            process_request_auth()

        @app.after_request
        def enforce_security_and_cors_headers(response):
            from flask import request
            origin = request.headers.get('Origin')
            if origin:
                allowed_env = os.environ.get('ALLOWED_ORIGINS', '')
                allowed_list = [o.strip() for o in allowed_env.split(',') if o.strip()]
                is_allowed = (
                    app.debug or 
                    current_app.config.get('TESTING') or 
                    not allowed_list or 
                    origin in allowed_list or 
                    'localhost' in origin or 
                    '127.0.0.1' in origin
                )
                if is_allowed:
                    response.headers['Access-Control-Allow-Origin'] = origin
                    response.headers['Access-Control-Allow-Credentials'] = 'true'
                    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Accept, X-Requested-With, Origin, X-Persona-Role, X-CSRFToken, X-CSRF-Token, X-CSRF-TOKEN, X-XSRF-TOKEN'
                    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH'
                    response.headers['Access-Control-Max-Age'] = '86400'

            # OWASP Hardened Security Headers
            response.headers['X-Content-Type-Options'] = 'nosniff'
            response.headers['X-Frame-Options'] = 'SAMEORIGIN'
            response.headers['X-XSS-Protection'] = '1; mode=block'
            response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'

            # Set XSRF-TOKEN cookie for client-side JavaScript / Single Page Applications
            if app.config.get('WTF_CSRF_ENABLED', True):
                from flask_wtf.csrf import generate_csrf
                if 'XSRF-TOKEN' not in request.cookies:
                    try:
                        token = generate_csrf()
                        response.set_cookie(
                            'XSRF-TOKEN',
                            token,
                            samesite=app.config.get('SESSION_COOKIE_SAMESITE', 'Lax'),
                            secure=app.config.get('SESSION_COOKIE_SECURE', False),
                            httponly=False
                        )
                    except Exception:
                        pass

            return response


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
            from werkzeug.exceptions import HTTPException
            if isinstance(error, HTTPException) and error.code != 500:
                return error

            from flask import jsonify
            origin = os.environ.get('FRONTEND_ORIGIN', 'http://localhost:5173')
            response = jsonify({
                "error": "Internal Server Error",
                "message": str(error) if app.debug else "An unexpected error occurred."
            })
            response.status_code = 500
            response.headers["Access-Control-Allow-Origin"] = origin
            return response
        # Initialize Market Data Background Scheduler (30-day recurring updates)
        try:
            from services.market_data_scheduler import init_market_data_scheduler
            init_market_data_scheduler(app)
        except Exception as e:
            app.logger.warning("Could not initialize Market Data Scheduler: %s", e)

    return app