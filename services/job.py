# ==============================================================================
# الوظيفة الأساسية للملف: نموذج قاعدة البيانات (Model) للوظائف المتاحة.
# الروابط أو الميزات: تعريف بيانات الوظيفة والارتباطات بالعملاء الذين تقدموا لها.
# المتطلبات الخاصة: يعتمد على SQLAlchemy (db).
# ==============================================================================
####### data for jobs.py#####
from datetime import datetime

from app import db
# Import what you need inside functions/methods
from services.customer import customer_jobs, Customers

# Define your classes and functions as usual





# ... (previous fields)


class Jobs(db.Model):
    id = db.Column(db.Integer, primary_key=True)  
    title = db.Column(db.String(80), nullable=False)
    job_type = db.Column(db.String(120), nullable=False)
    town = db.Column(db.String(80), nullable=False)
    company_about = db.Column(db.Text, nullable=False)
    job_description = db.Column(db.Text, nullable=False) 
    specialization = db.Column(db.String(120), nullable=False)
    skills_years = db.Column(db.String(120), nullable=False)
    educational_qualification = db.Column(db.String(120), nullable=False)
    workplace = db.Column(db.String(120), nullable=False)
    workdays = db.Column(db.String(120), nullable=True)  
    rest_days = db.Column(db.String(120), nullable=True)   
    work_hours = db.Column(db.String(120), nullable=True) 
    languages = db.Column(db.String(120), nullable=True)  

    # New Fields
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    date_posted = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='pending')  # 'pending','approved','rejected','archived'
    category = db.Column(db.String(100), nullable=True)
    is_featured = db.Column(db.Boolean, default=False)
    customers = db.relationship('Customers', secondary="customer_jobs", back_populates="jobs")
    teams = db.relationship('Teams', secondary="customer_jobs", back_populates="jobs")
    skills = db.relationship('Skills', backref='customer_skills', lazy=True)

    def __init__(self, title, job_type, town, company_about, job_description, specialization, skills_years, educational_qualification, workplace, company_id, workdays=None, rest_days=None, work_hours=None, languages=None):
        self.title = title
        self.job_type = job_type
        self.town = town
        self.company_about = company_about
        self.job_description = job_description
        self.specialization = specialization
        self.skills_years = skills_years
        self.educational_qualification = educational_qualification
        self.workplace = workplace
        self.company_id = company_id
        self.workdays = workdays
        self.rest_days = rest_days
        self.work_hours = work_hours
        self.languages = languages

    @classmethod
    def get_job_By_title(self, title):
        query = self.query.filter_by(title=title).first()
        return query

    @classmethod
    def get_by_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        return query

    @classmethod
    def get_applicants_for_open_session_company(cls, company_id):
        # Step 2: Query for jobs of the company
        company_jobs = cls.query.filter_by(company_id=company_id).all()

        applicants_by_job = {}

        # Step 3: For each job, retrieve applicants
        for job in company_jobs:
            job_id = job.id
            # Query for applicants (customers) who applied for the job
            applicants = Customers.query.join(
                customer_jobs, Customers.id == customer_jobs.c.customer_id
            ).filter(
                customer_jobs.c.job_id == job_id
            ).all()

            applicants_by_job[job] = applicants

        # Now, applicants_by_job is a dictionary where keys are jobs, and values are lists of applicants.

        return applicants_by_job




    # Add the delete_by_id class method
    @classmethod
    def delete_by_id(cls, job_id, company_id):
        job_to_delete = cls.query.filter_by(id=job_id, company_id=company_id).first()
        if job_to_delete:
            db.session.delete(job_to_delete)
            db.session.commit()
            return True
        return False





    @classmethod
    def get_applicants(self, town=None, kind=None, job_title=None):
        applicants = []
        for customer in self.customers:
            if (
                (town is None or customer.town == town) and
                (kind is None or customer.kind == kind)
            ):
                if job_title is None or job_title.lower() in self.title.lower():
                    applicants.append(customer)
        return applicants
