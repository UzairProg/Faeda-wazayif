from app import create_app, db
from services.admin import Admin
from werkzeug.security import generate_password_hash

app = create_app()

with app.app_context():
    # Check if admin already exists
    admin = Admin.query.filter_by(username='admin').first()
    if not admin:
        admin = Admin(
            username='admin',
            email='admin@faida.com',
            role='super_admin'
        )
        admin.is_active = True
        admin.set_password('admin123')
        db.session.add(admin)
        db.session.commit()
        print("Super Admin created successfully!")
        print("Username: admin")
        print("Password: admin123")
    else:
        print("Super Admin already exists.")
        
    # Create default settings if not exist
    from services.system_settings import SystemSetting
    if not SystemSetting.query.filter_by(key='SITE_NAME').first():
        db.session.add(SystemSetting(key='SITE_NAME', value='فائدة (Faida)'))
        db.session.add(SystemSetting(key='MAINTENANCE_MODE', value='false'))
        db.session.add(SystemSetting(key='CONTACT_EMAIL', value='admin@faida.com'))
        db.session.commit()
        print("Default system settings created.")
