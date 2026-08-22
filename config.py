import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'default-secret-key-for-dev'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///database.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_COOKIE_SAMESITE = 'Lax'
    SESSION_COOKIE_HTTPONLY = True
    
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

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False
