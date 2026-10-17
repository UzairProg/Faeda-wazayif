import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'default-secret-key-for-dev'
    raw_db_url = os.environ.get('DATABASE_URL') or os.environ.get('DATABASE_URL_NEW') or 'sqlite:///database.db'
    if raw_db_url and ('postgresql://' in raw_db_url or 'postgres://' in raw_db_url):
        import urllib.parse
        prefix = 'postgresql://' if 'postgresql://' in raw_db_url else 'postgres://'
        rest = raw_db_url.split(prefix, 1)[1]
        parts = rest.split('@')
        if len(parts) > 2:
            user_pass = '@'.join(parts[:-1])
            host_db = parts[-1]
            if ':' in user_pass:
                u, p = user_pass.split(':', 1)
                p_encoded = urllib.parse.quote(p)
                raw_db_url = f"postgresql://{u}:{p_encoded}@{host_db}"
        elif raw_db_url.startswith('postgres://'):
            raw_db_url = raw_db_url.replace('postgres://', 'postgresql://', 1)

    if raw_db_url.startswith('postgresql://') and not raw_db_url.startswith('postgresql+'):
        raw_db_url = raw_db_url.replace('postgresql://', 'postgresql+psycopg://', 1)
    SQLALCHEMY_DATABASE_URI = raw_db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Connection pooling and resilience for Managed PostgreSQL (Neon, Supabase, AWS RDS, Render)
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': int(os.environ.get('DB_POOL_RECYCLE', 300)),
    }
    if 'postgresql' in raw_db_url:
        SQLALCHEMY_ENGINE_OPTIONS.update({
            'pool_size': int(os.environ.get('DB_POOL_SIZE', 10)),
            'max_overflow': int(os.environ.get('DB_MAX_OVERFLOW', 20)),
            'connect_args': {
                'connect_timeout': int(os.environ.get('DB_CONNECT_TIMEOUT', 15))
            }
        })

    SESSION_COOKIE_SAMESITE = os.environ.get('SESSION_COOKIE_SAMESITE', 'Lax')
    SESSION_COOKIE_SECURE = os.environ.get('SESSION_COOKIE_SECURE', 'False').lower() in ('true', '1')
    SESSION_COOKIE_HTTPONLY = True

    # CSRF Protection
    WTF_CSRF_ENABLED = os.environ.get('WTF_CSRF_ENABLED', 'True').lower() in ('true', '1')
    WTF_CSRF_TIME_LIMIT = int(os.environ.get('WTF_CSRF_TIME_LIMIT', 86400))
    WTF_CSRF_HEADERS = ['X-CSRFToken', 'X-CSRF-Token', 'X-CSRF-TOKEN', 'X-XSRF-TOKEN']

    # API Rate Limiting & DoS Protection
    RATELIMIT_ENABLED = os.environ.get('RATELIMIT_ENABLED', 'True').lower() in ('true', '1')
    RATELIMIT_STORAGE_URI = os.environ.get('RATELIMIT_STORAGE_URI', 'memory://')
    RATELIMIT_STRATEGY = os.environ.get('RATELIMIT_STRATEGY', 'moving-window')
    RATELIMIT_HEADERS_ENABLED = True
    RATELIMIT_SWALLOW_ERRORS = True
    RATELIMIT_DEFAULT = [
        os.environ.get('RATELIMIT_DEFAULT_MIN', '200 per minute'),
        os.environ.get('RATELIMIT_DEFAULT_HR', '2000 per hour')
    ]
    
    # Mail & Transactional Email Configuration
    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.googlemail.com')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', 587))
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME') or os.environ.get('SENDER_EMAIL')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD') or os.environ.get('SENDER_PASSWORD')
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'True').lower() in ('true', '1')
    MAIL_USE_SSL = os.environ.get('MAIL_USE_SSL', 'False').lower() in ('true', '1')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER') or os.environ.get('SENDER_EMAIL', 'coursesforyo@gmail.com')
    RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
    SENDGRID_API_KEY = os.environ.get('SENDGRID_API_KEY')

    # Upload Directories
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    UPLOAD_CUSTOMERS_IMAGES = os.path.join(BASE_DIR, 'static', 'uploads', 'customers', 'images')
    UPLOAD_TEAM_IMAGES = os.path.join(BASE_DIR, 'static', 'uploads', 'customers', 'teams', 'images')
    UPLOAD_CUSTOMERS_CV = os.path.join(BASE_DIR, 'static', 'uploads', 'customers', 'cv')
    UPLOAD_company_logo = os.path.join(BASE_DIR, 'static', 'uploads', 'company', 'logo')
    UPLOAD_COMPANY_COMMERCIAL_REGISTER = os.path.join(BASE_DIR, 'static', 'uploads', 'company', 'commercial_register')

    # Cloudinary Cloud Storage Configuration
    CLOUDINARY_CLOUD_NAME = os.environ.get('CLOUDINARY_CLOUD_NAME')
    CLOUDINARY_API_KEY = os.environ.get('CLOUDINARY_API_KEY')
    CLOUDINARY_API_SECRET = os.environ.get('CLOUDINARY_API_SECRET')

class DevelopmentConfig(Config):
    DEBUG = True
    SESSION_COOKIE_SECURE = False

class ProductionConfig(Config):
    DEBUG = False
    SESSION_COOKIE_SECURE = os.environ.get('SESSION_COOKIE_SECURE', 'True').lower() in ('true', '1')
