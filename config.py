import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'default-secret-key-for-dev'
    raw_db_url = os.environ.get('DATABASE_URL') or os.environ.get('DATABASE_URL_NEW') or 'sqlite:///database.db'
    if raw_db_url.startswith('postgres://'):
        raw_db_url = raw_db_url.replace('postgres://', 'postgresql://', 1)
    if raw_db_url.startswith('postgresql://') and not raw_db_url.startswith('postgresql+'):
        raw_db_url = raw_db_url.replace('postgresql://', 'postgresql+psycopg://', 1)
    SQLALCHEMY_DATABASE_URI = raw_db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_COOKIE_SAMESITE = os.environ.get('SESSION_COOKIE_SAMESITE', 'Lax')
    SESSION_COOKIE_SECURE = os.environ.get('SESSION_COOKIE_SECURE', 'False').lower() in ('true', '1')
    SESSION_COOKIE_HTTPONLY = True

    # CSRF Protection
    WTF_CSRF_ENABLED = os.environ.get('WTF_CSRF_ENABLED', 'True').lower() in ('true', '1')
    WTF_CSRF_TIME_LIMIT = int(os.environ.get('WTF_CSRF_TIME_LIMIT', 86400))
    WTF_CSRF_HEADERS = ['X-CSRFToken', 'X-CSRF-Token', 'X-CSRF-TOKEN', 'X-XSRF-TOKEN']
    
    # Mail Config
    MAIL_SERVER = 'smtp.googlemail.com'
    MAIL_PORT = 587
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_SENDER = os.environ.get('MAIL_SENDER')

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
