# ==============================================================================
# الوظيفة الأساسية للملف: نماذج قاعدة البيانات (Models) الخاصة بالعملاء.
# الروابط أو الميزات: جداول العملاء (Customers) والوظائف المقدمة (customer_jobs).
# المتطلبات الخاصة: يعتمد على SQLAlchemy وارتباطات الجداول (Relationships).
# ==============================================================================
####### data for customer.py#####
from sqlalchemy import and_

from datetime import datetime
from app import db
from services.language import Lang

# services/customer.py


class Customers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id =  db.Column(db.String(120), nullable=False , unique = True)
    ############## personal data ##########
    fullname = db.Column(db.String(255), nullable=False)
    about = db.Column(db.Text, nullable=True)
    email = db.Column(db.String(255), nullable=False)
    mobile = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    #########################################################################################
    img = db.Column(db.String(255), nullable=True)

    sex = db.Column(db.String(120), nullable=True)
    country = db.Column(db.String(120), nullable=True)
    government = db.Column(db.String(120), nullable=True)
    education_statue = db.Column(db.String(120), nullable=True)
    educational_qualification = db.Column(db.String(255), nullable=True)
    university = db.Column(db.String(255), nullable=True)
    department_university = db.Column(db.String(255), nullable=True)
    graduation_date = db.Column(db.Date, nullable=True)
    gpa = db.Column(db.String(120), nullable=True)
    years_of_skills = db.Column(db.String(120), nullable=True)
    preferred_field_of_work = db.Column(db.String(255), nullable=True)
    work_type = db.Column(db.String(120), nullable=True)
    activated = db.Column(db.Boolean, nullable=True)

    ############# Admin Moderation Fields ##########
    status = db.Column(db.String(20), default='active')  # 'active','suspended','banned','warned'
    is_verified = db.Column(db.Boolean, default=False)     # Professional verification checkmark
    verified_at = db.Column(db.DateTime, nullable=True)
    suspension_reason = db.Column(db.Text, nullable=True)
    warnings_count = db.Column(db.Integer, default=0)
    deleted_at = db.Column(db.DateTime, nullable=True)

    ############# AI Recommendation Fields ##########
    resume_text = db.Column(db.Text, nullable=True)
    expected_salary = db.Column(db.Integer, nullable=True)
    languages_json = db.Column(db.Text, nullable=True)
    certifications = db.Column(db.Text, nullable=True)
    work_style = db.Column(db.String(255), nullable=True)

    ############# uploaded data names ##########
    cv = db.Column(db.String(255), nullable=True)
    visibility = db.Column(db.String(30), default='employers_only')  # 'public', 'employers_only', 'private'
    token = db.Column(db.String(255))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    jobs = db.relationship("Jobs", secondary="customer_jobs", back_populates="customers")

    messages = db.relationship('Message', backref='customer', lazy=True)
    skills = db.relationship('Skills', backref='job_skills', lazy=True)
    lang = db.relationship('Lang', backref='customer_languages', lazy=True, cascade="all, delete-orphan")
    profile_history = db.relationship('CustomerProfileHistory', backref='customer', lazy=True, order_by="desc(CustomerProfileHistory.created_at)", cascade="all, delete-orphan")
    projects = db.relationship('CustomerProject', backref='customer', lazy=True, cascade="all, delete-orphan")
    ip_contributions = db.relationship('CustomerIPContribution', backref='customer', lazy=True, cascade="all, delete-orphan")
    certifications_list = db.relationship('CustomerCertification', backref='customer', lazy=True, cascade="all, delete-orphan")

    def __init__(
        self, fullname, email, mobile, password,about=None, sex=None, country=None,city = None,government = None, education_statue=None,
        educational_qualification=None, university=None, department_university=None, graduation_date=None,
        gpa=None, years_of_skills=None, preferred_field_of_work=None, work_type=None, activated=False, cv=None,
        token=None, resume_text=None, expected_salary=None, languages_json=None, certifications=None, work_style=None, visibility='employers_only', **kwargs
    ):
        self.fullname = fullname
        self.email = email
        self.mobile = mobile
        self.password = password
        self.about = about
        self.sex = sex
        self.country = country
        self.city = city
        self.government = government
        self.education_statue = education_statue
        self.educational_qualification = educational_qualification
        self.university = university
        self.department_university = department_university
        self.graduation_date = graduation_date
        self.gpa = gpa
        self.years_of_skills = years_of_skills
        self.preferred_field_of_work = preferred_field_of_work
        self.work_type = work_type
        self.activated = activated
        self.cv = cv
        self.visibility = visibility or 'employers_only'
        self.token = token
        self.resume_text = resume_text
        self.expected_salary = expected_salary
        self.languages_json = languages_json
        self.certifications = certifications
        self.work_style = work_style
        super().__init__(**kwargs)

    def to_candidate_profile_dict(self):
        """Serialize customer into a clean structured candidate profile dictionary."""
        skills_list = [s.skill_name for s in self.skills] if self.skills else []
        
        projects_data = []
        for p in (self.projects or []):
            desc = getattr(p, 'description', None) or getattr(p, 'project_size', None) or ''
            projects_data.append({
                'id': p.id,
                'project_name': p.project_name,
                'description': desc,
                'project_url': p.project_url or '',
                'created_at': p.created_at.isoformat() if p.created_at else None
            })
            
        certs_data = []
        for c in (self.certifications_list or []):
            certs_data.append({
                'id': c.id,
                'cert_name': c.cert_name,
                'issuing_org': c.issuing_org or '',
                'issue_month': c.issue_month,
                'issue_year': c.issue_year,
                'expiry_month': c.expiry_month,
                'expiry_year': c.expiry_year,
                'no_expiry': bool(c.no_expiry),
                'credential_id': c.credential_id or '',
                'credential_url': c.credential_url or '',
                'created_at': c.created_at.isoformat() if c.created_at else None
            })

        langs_data = [l.language_name for l in self.lang] if self.lang else []

        checklist = [
            {'key': 'basic_info', 'label': 'المعلومات الشخصية والاتصال', 'completed': bool(self.fullname and self.email and self.mobile), 'weight': 15},
            {'key': 'headline_about', 'label': 'الملخص المهني والنبذة', 'completed': bool(self.about and len(self.about.strip()) > 5), 'weight': 15},
            {'key': 'skills', 'label': 'المهارات المهنية', 'completed': bool(len(skills_list) > 0), 'weight': 15},
            {'key': 'education', 'label': 'المؤهل العلمي والتعليم', 'completed': bool(self.educational_qualification or self.university), 'weight': 15},
            {'key': 'experience', 'label': 'سنوات الخبرة والمجال', 'completed': bool(self.years_of_skills and self.preferred_field_of_work), 'weight': 15},
            {'key': 'cv', 'label': 'السيرة الذاتية (CV)', 'completed': bool(self.cv), 'weight': 15},
            {'key': 'preferences', 'label': 'تفضيلات العمل ونوع الوظيفة', 'completed': bool(self.work_type or self.work_style or self.expected_salary), 'weight': 10},
        ]
        completed_weight = sum(item['weight'] for item in checklist if item['completed'])

        ats_score = None
        if self.cv:
            try:
                from ai_engine.market_value_calculator import get_market_value_for_customer
                market = get_market_value_for_customer(self)
                ats_score = market.get('total_score', 75)
            except Exception:
                ats_score = 75

        return {
            'id': self.id,
            'user_id': self.user_id,
            'fullname': self.fullname or '',
            'about': self.about or '',
            'email': self.email or '',
            'mobile': self.mobile or '',
            'img': self.img or '',
            'sex': self.sex or '',
            'country': self.country or 'المملكة العربية السعودية',
            'government': self.government or '',
            'education_statue': self.education_statue or '',
            'educational_qualification': self.educational_qualification or '',
            'university': self.university or '',
            'department_university': self.department_university or '',
            'graduation_date': self.graduation_date.isoformat() if self.graduation_date else None,
            'gpa': self.gpa or '',
            'years_of_skills': self.years_of_skills or '',
            'preferred_field_of_work': self.preferred_field_of_work or '',
            'work_type': self.work_type or '',
            'work_style': self.work_style or '',
            'expected_salary': self.expected_salary,
            'visibility': getattr(self, 'visibility', 'employers_only') or 'employers_only',
            'status': self.status or 'active',
            'is_verified': bool(self.is_verified),
            'verified_at': self.verified_at.isoformat() if self.verified_at else None,
            'cv': self.cv or '',
            'skills': skills_list,
            'languages': langs_data,
            'projects': projects_data,
            'certifications': certs_data,
            'ats_score': ats_score,
            'completion': {
                'percentage': completed_weight,
                'checklist': checklist
            }
        }


    @classmethod
    def get_user_id_by_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        mobile = query.user_id
        return mobile

    @classmethod
    def get_by_email(cls, email):
        query = cls.query.filter_by(email=email).first()
        return query

    @classmethod
    def get_by_user_id(cls, user_id):
        query = cls.query.filter_by(user_id=user_id).first()
        return query
    @classmethod
    def get_by_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        return query

    @classmethod
    def active(cls, email):
        query = cls.query.filter_by(email=email).first()
        if query is not None:
            query.activated = True
            db.session.commit()
        else:
            raise ValueError(f"No Castomers record found with email {email}")
    @classmethod
    def get_session_user_id(cls, email):
        query = cls.query.filter_by(email=email).first()
        idt = query.id
        return idt
    @classmethod
    def get_by_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        return query

    @classmethod
    def get_id_by_email(email):
        query = Customers.query.filter_by(email=email).first()
        return query.id if query else None

    @classmethod
    def get_customer_fullname_by_user_email(cls, email):
        query = cls.query.filter_by(email=email).first()
        idt = query.fullname
        return idt
    @classmethod
    def get_customer_cv_by_user_email(cls, id):
        query = cls.query.filter_by(id=id).first()
        cv_cv = query.cv
        return cv_cv
    ########################################################## check if data isnot null ###################################
    @classmethod
    def is_not_null(cls, id):
        data = cls.query.get(id)
        if data and data.fullname and data.email and data.mobile and data.password and data.sex and data.country and data.government and data.education_statue and data.educational_qualification and data.university and data.department_university and data.graduation_date and data.gpa and data.years_of_skills and data.preferred_field_of_work and data.work_type and data.cv and data.timestamp:
            return True
        return False

    @classmethod
    def is_personal_not_null(cls, id):
        data = cls.query.get(id)
        if data and data.fullname and data.email and data.mobile and data.password and data.sex and data.country and data.government and data.timestamp:
            return True
        return False

    @classmethod
    def is_educational_datanot_null(cls, id):
        data = cls.query.get(id)
        if data and data.education_statue and data.educational_qualification and data.university and data.department_university and data.graduation_date and data.gpa :
            return True

    @classmethod
    def is_job_data_not_null(cls, id):
        data = cls.query.get(id)
        if data and data.years_of_skills and data.preferred_field_of_work and data.work_type and data.cv and data.timestamp:
            return True

    #####################################################################################################################################################################
    @classmethod
    def get_customer_name_by_user_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        cv_cv = query.fullname
        return cv_cv

    @classmethod
    def get_customer_about_by_user_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        about = query.about
        return about
    @classmethod
    def get_customer_cv_by_user_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        cv_cv = query.cv
        return cv_cv
    @classmethod
    def get_customer_image_by_user_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        image = query.img
        return image
    @classmethod
    def get_customer_id_by_user_id(cls, user_id):
        query = cls.query.filter_by(user_id=user_id).first()
        id = query.id
        return id


    @classmethod
    def get_customer_data_by_customer_user_id(cls, user_id):
        query = cls.query.filter_by(user_id=user_id).first()
        fullname = query.fullname
        email = query.fullname
        cv = query.cv

        return fullname, email , cv


    @classmethod
    def get_customer_country_by_user_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        country = query.country
        return country
    @classmethod
    def get_customer_city_by_user_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        city = query.city
        return city
    @classmethod
    def get_customer_government_by_user_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        government = query.government
        return government
    @classmethod
    def get_customer_mobile_by_user_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        mobile = query.mobile
        return mobile
    @classmethod
    def get_customer_education_status_by_user_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        education_statues = query.education_statue
        return education_statues
    @classmethod
    def get_customer_sex_by_user_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        sex = query.sex
        return sex
    @classmethod
    def get_customer_educational_qualification_by_user_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        educational_qualifications = query.educational_qualification
        return educational_qualifications
    @classmethod
    def get_customer_university_by_user_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        university = query.university
        return university
    @classmethod
    def get_customer_department_university_by_user_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        department_university = query.department_university
        return department_university
    @classmethod
    def get_customer_graduation_date_by_user_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        graduation_date = query.graduation_date
        return graduation_date
    @classmethod
    def get_customer_gpa_by_user_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        gpa = query.gpa
        return gpa
    @classmethod
    def get_customer_years_of_skills_by_user_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        years_of_skills = query.years_of_skills
        return years_of_skills
    @classmethod
    def get_customer_preferred_field_of_work_by_user_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        preferred_field_of_work = query.preferred_field_of_work
        return preferred_field_of_work
    @classmethod
    def get_customer_work_type_by_user_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        work_type = query.work_type
        return work_type


    ######################################################################################################################################################################

    @classmethod
    def get_job_applicants(self):
        applicants = []
        for job in self.company_jobs:
            applicants.extend(job.get_applicants())
        return applicants


    @classmethod
    def get_job_application_time_by_customer_id(cls, customer_id, job_id):
        query = db.session.query(customer_jobs.c.timestamp).filter(
            and_(customer_jobs.c.customer_id == customer_id, customer_jobs.c.job_id == job_id)
        ).first()
        if query:
            return query[0]
        return None

    @classmethod
    def get_job_application_time_by_team_id(cls, id, job_id):
        query = db.session.query(customer_jobs.c.timestamp).filter(
            and_(customer_jobs.c.id == id, customer_jobs.c.job_id == job_id)
        ).first()
        if query:
            return query[0]
        return None

    @classmethod
    def get_application_note_by_customer_id(cls, customer_id, job_id):
        query = db.session.query(customer_jobs.c.note).filter(
            and_(customer_jobs.c.customer_id == customer_id, customer_jobs.c.job_id == job_id)
        ).first()
        if query:
            return query[0]
        return None

    @classmethod
    def get_application_note_by_team_id(cls, id, job_id):
        query = db.session.query(customer_jobs.c.note).filter(
            and_(customer_jobs.c.team_id == id, customer_jobs.c.job_id == job_id)
        ).first()
        if query:
            return query[0]
        return None
    @classmethod
    def get_application_type_by_customer_id(cls, customer_id, job_id):
        query = db.session.query(customer_jobs.c.type).filter(
            and_(customer_jobs.c.customer_id == customer_id, customer_jobs.c.job_id == job_id)
        ).first()
        if query:
            return query[0]
        return None

    @classmethod
    def get_job_status_by_customer_id(cls, customer_id, job_id):
        query = db.session.query(customer_jobs.c.status).filter(
            and_(customer_jobs.c.customer_id == customer_id, customer_jobs.c.job_id == job_id)
        ).first()
        if query:
            return query[0]
        return None

    @classmethod
    def get_job_id_by_customer_id(cls, customer_id, job_id):
        query = db.session.query(customer_jobs.c.id).filter(
            and_(customer_jobs.c.customer_id == customer_id, customer_jobs.c.job_id == job_id)
        ).first()
        if query:
            return query[0]
        return None

    @classmethod
    def get_job_status_by_team_id(cls, id, job_id):
        query = db.session.query(customer_jobs.c.status).filter(
            and_(customer_jobs.c.id == id, customer_jobs.c.job_id == job_id)
        ).first()
        if query:
            return query[0]
        return None
    @classmethod
    def get_job_note_by_customer_id(cls, customer_id, job_id):
        query = db.session.query(customer_jobs.c.note).filter(
            and_(customer_jobs.c.customer_id == customer_id, customer_jobs.c.job_id == job_id)
        ).first()
        if query:
            return query[0]
        return None
    @classmethod
    def get_application_type_by_customer_id(cls, user_id, job_id):
        query = db.session.query(customer_jobs.c.type).filter(
            and_(customer_jobs.c.customer_id == user_id, customer_jobs.c.job_id == job_id)
        ).first()
        if query:
            return query[0]
        return None
    @classmethod
    def get_number_of_job_applications_by_customer_id(cls, customer_id):
    # Retrieve the customer instance with the given ID
        customer = cls.query.get(customer_id)
        if not customer:
            return 0

    # Count job applications from the customer_jobs association table
        job_application_count = db.session.query(customer_jobs).filter_by(customer_id=customer_id).count()

        return job_application_count



# Many-to-Many association table  to store applicants
customer_jobs = db.Table(
    'customer_jobs', db.Model.metadata,
    db.Column('id', db.Integer, primary_key=True),
    db.Column('customer_id', db.String(120), db.ForeignKey('customers.user_id') ,nullable = True),
    db.Column('team_id', db.Integer, db.ForeignKey('teams.id') ,nullable = True),
    db.Column('type', db.String(120), nullable=True),
    db.Column('job_id', db.Integer, db.ForeignKey('jobs.id')),
    db.Column('status', db.String(120), nullable=True),
    db.Column('note', db.String(120), nullable=True),
    db.Column('timestamp', db.DateTime, default=datetime.utcnow)
)

customer_saved_jobs = db.Table(
    'customer_saved_jobs', db.Model.metadata,
    db.Column('id', db.Integer, primary_key=True),
    db.Column('customer_id', db.Integer, db.ForeignKey('customers.id'), nullable=False),
    db.Column('job_id', db.Integer, db.ForeignKey('jobs.id'), nullable=False),
    db.Column('created_at', db.DateTime, default=datetime.utcnow),
    db.UniqueConstraint('customer_id', 'job_id', name='uq_customer_job_saved')
)

class CustomerProfileHistory(db.Model):
    __tablename__ = 'customer_profile_history'
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    score = db.Column(db.Float, nullable=False)
    event_description = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, customer_id, score, event_description):
        self.customer_id = customer_id
        self.score = score
        self.event_description = event_description

class CustomerProject(db.Model):
    __tablename__ = 'customer_projects'
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    project_name = db.Column(db.String(200), nullable=False)
    project_size = db.Column(db.String(50), default='متوسط')
    description = db.Column(db.Text, nullable=True)
    project_url = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class CustomerIPContribution(db.Model):
    __tablename__ = 'customer_ip_contributions'
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    ip_name = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class CustomerCertification(db.Model):
    """Model for storing professional certifications with detailed fields (LinkedIn-style)."""
    __tablename__ = 'customer_certifications'
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    cert_name = db.Column(db.String(200), nullable=False)
    issuing_org = db.Column(db.String(200), nullable=False)
    issue_month = db.Column(db.Integer, nullable=True)
    issue_year = db.Column(db.Integer, nullable=True)
    expiry_month = db.Column(db.Integer, nullable=True)
    expiry_year = db.Column(db.Integer, nullable=True)
    no_expiry = db.Column(db.Boolean, default=False)
    credential_id = db.Column(db.String(200), nullable=True)
    credential_url = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
