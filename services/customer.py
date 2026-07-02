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
    fullname = db.Column(db.String(120), nullable=False)
    about = db.Column(db.String(120), nullable=True)
    email = db.Column(db.String(120), nullable=False)
    mobile = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(120), nullable=False)
    #########################################################################################
    img = db.Column(db.String(80), nullable=True)

    sex = db.Column(db.String(120), nullable=True)
    country = db.Column(db.String(120), nullable=True)
    government = db.Column(db.String(120), nullable=True)
    education_statue = db.Column(db.String(120), nullable=True)
    educational_qualification = db.Column(db.String(120), nullable=True)
    university = db.Column(db.String(120), nullable=True)
    department_university = db.Column(db.String(120), nullable=True)
    graduation_date = db.Column(db.Date, nullable=True)
    gpa = db.Column(db.String(120), nullable=True)
    years_of_skills = db.Column(db.String(120), nullable=True)
    preferred_field_of_work = db.Column(db.String(120), nullable=True)
    work_type = db.Column(db.String(120), nullable=True)
    activated = db.Column(db.Boolean, nullable=True)

    ############# uploaded data names ##########
    cv = db.Column(db.String(120), nullable=True)
    token = db.Column(db.String(120))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    jobs = db.relationship("Jobs", secondary="customer_jobs", back_populates="customers")

    messages = db.relationship('Message', backref='customer', lazy=True)
    skills = db.relationship('Skills', backref='job_skills', lazy=True)
    lang = db.relationship('Lang', backref='customer_languages', lazy=True)

    def __init__(
        self, fullname, email, mobile, password,about=None, sex=None, country=None,city = None,government = None, education_statue=None,
        educational_qualification=None, university=None, department_university=None, graduation_date=None,
        gpa=None, years_of_skills=None, preferred_field_of_work=None, work_type=None, activated=False, cv=None,
     token=None, **kwargs
    ):
    # ... rest of the code ...

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
        self.token = token
        super().__init__(**kwargs)  # handle additional fields and inheritance if necessary


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



