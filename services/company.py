# ==============================================================================
# الوظيفة الأساسية للملف: نموذج قاعدة البيانات (Model) الخاص بالشركات.
# الروابط أو الميزات: تعريف بيانات الشركة كاسمها وبريدها الإلكتروني وغيرها من الحقول.
# المتطلبات الخاصة: يعتمد على SQLAlchemy (db).
# ==============================================================================
#database fir company.py
from datetime import datetime
from app import db

# User model
class CompanyProfileHistory(db.Model):
    __tablename__ = 'company_profile_history'
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    score = db.Column(db.Float, nullable=False)
    event_description = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, company_id, score, event_description):
        self.company_id = company_id
        self.score = score
        self.event_description = event_description


class Company(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_arabic_name = db.Column(db.String(255), nullable=True)
    company_english_name = db.Column(db.String(255), nullable=False)
    company_email = db.Column(db.String(120), unique=True, nullable=True)
    company_mobile = db.Column(db.String(120), nullable=True)
    country = db.Column(db.String(120), nullable=True)
    state = db.Column(db.String(120), nullable=True)
    english_adress = db.Column(db.String(255), nullable=True)
    company_type = db.Column(db.String(120), nullable=True)
    company_size = db.Column(db.String(120), nullable=True)
    company_field = db.Column(db.String(120), nullable=True)
    hr_name = db.Column(db.String(120), nullable=True)
    hr_mobile = db.Column(db.String(120), nullable=True)
    hr_email = db.Column(db.String(120), nullable=True)
    about_company_arabic = db.Column(db.Text, nullable=True)
    about_company_english = db.Column(db.Text, nullable=True)
    commercial_register = db.Column(db.String(120), nullable=True)
    company_website = db.Column(db.String(255), nullable=True)
    twitter_email = db.Column(db.String(255), nullable=True)
    instagram_email = db.Column(db.String(255), nullable=True)
    company_logo = db.Column(db.String(255), nullable=True)
    company_name_on_faeda = db.Column(db.String(255), nullable=True)
    login_password = db.Column(db.String(255), nullable=True)
    activated = db.Column(db.Boolean, nullable=True)
    is_verified = db.Column(db.Boolean, default=False)     # Employer verification
    verified_at = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(20), default='active')    # 'active','suspended','banned'
    suspension_reason = db.Column(db.Text, nullable=True)
    warnings_count = db.Column(db.Integer, default=0)
    deleted_at = db.Column(db.DateTime, nullable=True)
    token = db.Column(db.String(120))
    
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    # Added 8 new metrics fields
    project_size = db.Column(db.Integer, default=0)
    number_of_projects = db.Column(db.Integer, default=0)
    success_rate = db.Column(db.Float, default=0.0)
    reputation = db.Column(db.String(20), default='N/A')
    profit_percentage = db.Column(db.Float, default=0.0)
    services_provided = db.Column(db.String(100), default='N/A')
    intellectual_property = db.Column(db.Integer, default=0)
    social_impact = db.Column(db.String(20), default='N/A')

    company_jobs = db.relationship('Jobs', backref='company', lazy=True)
    profile_history = db.relationship('CompanyProfileHistory', backref='company_record', lazy=True, order_by="desc(CompanyProfileHistory.created_at)")


    def __init__(self, company_arabic_name=None, company_english_name=None, company_email=None, company_mobile=None, country=None, state=None, english_adress=None, company_type=None, company_size=None, company_field=None, hr_name=None, hr_mobile=None, hr_email=None, about_company_arabic=None, about_company_english=None, commercial_register=None, company_website=None, twitter_email=None, instagram_email=None, company_logo=None, google_map_link=None, company_name_on_faeda=None, login_password=None, activated=None):
        self.company_arabic_name = company_arabic_name
        self.company_english_name = company_english_name
        self.company_email = company_email
        self.company_mobile = company_mobile
        self.country = country
        self.state = state
        self.english_adress = english_adress
        self.company_type = company_type
        self.company_size = company_size
        self.company_field = company_field
        self.hr_name = hr_name
        self.hr_mobile = hr_mobile
        self.hr_email = hr_email
        self.about_company_arabic = about_company_arabic
        self.about_company_english = about_company_english
        self.commercial_register = commercial_register
        self.company_website = company_website
        self.twitter_email = twitter_email
        self.instagram_email = instagram_email
        self.company_logo = company_logo
        self.google_map_link = google_map_link
        self.company_name_on_faeda = company_name_on_faeda
        self.login_password = login_password
        self.activated = activated

    @classmethod
    def get_company_By_name(cls, company_name):
        return cls.query.filter_by(company_english_name=company_name).first()
    
    @classmethod
    def get_by_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        return query
    
    @classmethod
    def get_company_id_by_email(cls, company_email):
        query = cls.query.filter_by(company_email=company_email).first()
        return query.id if query else None
    @classmethod
    def company_is_activated(cls, company_id):
        company = cls.query.get(company_id)
        return company.activated if company else False
    @classmethod
    def get_by_email(cls, company_email):
        return cls.query.filter_by(company_email=company_email).first()

    @property
    def number_of_jobs_offered(self):
        return len(self.company_jobs)

    @classmethod
    def activate(cls, email):
        query = cls.query.filter_by(company_email=email).first()
        if query:
            query.activated = True
            db.session.commit()
        else:
            raise ValueError(f"No Company record found with email {email}")

    @classmethod
    def get_company_name_by_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        return query.company_english_name if query else None

    @classmethod
    def is_public_not_null(cls, id):
        data = cls.query.get(id)
        if (data    and data.company_arabic_name 
                    and data.company_english_name and data.about_company_arabic 
                    and data.about_company_english and data.country 
                    and data.state and data.english_adress
                    and data.login_password and data.timestamp):
            return True
        return False    
    @classmethod
    def is_contact_data_not_null(cls, id):
        data = cls.query.get(id)
        if (data    and data.company_email
                    and data.login_password and data.timestamp):
            return True
        return False    
    @classmethod
    def is_commercial_data_not_null(cls, id):
        data = cls.query.get(id)
        if (data and data.company_mobile and
            data.company_type and data.company_size and data.company_field and data.hr_name and
            data.hr_mobile and data.hr_email and data.login_password and data.timestamp):
            return True
        return False
    @classmethod
    def is_not_null(cls, id):
        data = cls.query.get(id)
        if (data and data.company_arabic_name and data.company_english_name and  data.company_email
            and data.company_mobile and data.country and data.state and data.english_adress and
            data.company_type and data.company_size and data.company_field and data.hr_name and
            data.hr_mobile and data.hr_email and data.about_company_arabic and data.about_company_english and
            data.commercial_register and data.login_password and data.timestamp):
            return True
        return False
#####################################################################################################
    @classmethod
    def get_company_arabic_name_by_company_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        company_arabic_name = query.company_arabic_name
        return company_arabic_name
    
    @classmethod
    def get_company_english_name_by_company_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        company_english_name = query.company_english_name
        return company_english_name
    
    @classmethod
    def get_company_company_email_by_company_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        company_email = query.company_email
        return company_email
    

    @classmethod
    def get_company_country_by_company_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        country = query.country
        return country
    @classmethod
    def get_company_state_by_company_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        state = query.state
        return state
    @classmethod
    def get_company_english_adress_by_company_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        english_adress = query.english_adress
        return english_adress
   
    @classmethod
    def get_company_company_type_by_company_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        return query.company_type if query else None

    @classmethod
    def get_company_company_size_by_company_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        return query.company_size if query else None

    @classmethod
    def get_company_company_field_by_company_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        return query.company_field if query else None

    @classmethod
    def get_company_hr_name_by_company_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        return query.hr_name if query else None

    @classmethod
    def get_company_hr_mobile_by_company_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        return query.hr_mobile if query else None

    @classmethod
    def get_company_hr_email_by_company_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        return query.hr_email if query else None

    @classmethod
    def get_company_ar_about_company_by_company_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        return query.about_company_arabic if query else None

    @classmethod
    def get_company_en_about_company_by_company_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        return query.about_company_english if query else None

    @classmethod
    def get_company_commercial_register_by_company_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        return query.commercial_register if query else None

    @classmethod
    def get_company_company_website_by_company_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        return query.company_website if query else None

    @classmethod
    def get_company_tweeter_email_by_company_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        return query.twitter_email if query else None

    @classmethod
    def get_company_instagram_email_by_company_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        return query.instagram_email if query else None

    @classmethod
    def get_company_company_logo_by_company_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        return query.company_logo if query else None

    @classmethod
    def get_company_googlemap_by_company_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        return query.google_map_link if query else None

    @classmethod
    def get_company_faeda_company_name_by_company_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        return query.company_name_on_faeda if query else None
    

































