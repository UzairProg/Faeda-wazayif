# ==============================================================================
# services/university.py
# Models for University / Educational Institution Workspace (Section 6)
# ==============================================================================
from datetime import datetime
from app import db
import secrets


class University(db.Model):
    """Educational Institution / University Model."""
    __tablename__ = 'universities'

    id = db.Column(db.Integer, primary_key=True)
    name_ar = db.Column(db.String(200), nullable=False)
    name_en = db.Column(db.String(200), nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    description_ar = db.Column(db.Text, nullable=True)
    description_en = db.Column(db.Text, nullable=True)
    location = db.Column(db.String(120), nullable=True)  # e.g. "الرياض"
    country = db.Column(db.String(120), default="المملكة العربية السعودية")
    website = db.Column(db.String(255), nullable=True)
    logo = db.Column(db.String(255), nullable=True)
    institution_type = db.Column(db.String(80), default="جامعة حكومية")  # جامعة حكومية, جامعة أهلية, كلية تطبيقية, معهد تقني
    qs_rank = db.Column(db.String(50), nullable=True)
    phone = db.Column(db.String(50), nullable=True)
    dean_name = db.Column(db.String(120), nullable=True)
    career_center_email = db.Column(db.String(120), nullable=True)
    is_verified = db.Column(db.Boolean, default=True)
    verified_at = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(30), default="active")
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    departments = db.relationship('UniversityDepartment', backref='university', lazy=True, cascade="all, delete-orphan")
    verifications = db.relationship('AcademicVerification', backref='university', lazy=True, cascade="all, delete-orphan")

    def __init__(self, name_ar, email, password, name_en=None, description_ar=None, description_en=None,
                 location=None, country="المملكة العربية السعودية", website=None, logo=None,
                 institution_type="جامعة حكومية", qs_rank=None, phone=None, dean_name=None,
                 career_center_email=None, is_verified=True, status="active", **kwargs):
        self.name_ar = name_ar
        self.name_en = name_en
        self.email = email
        self.password = password
        self.description_ar = description_ar
        self.description_en = description_en
        self.location = location
        self.country = country
        self.website = website
        self.logo = logo
        self.institution_type = institution_type
        self.qs_rank = qs_rank
        self.phone = phone
        self.dean_name = dean_name
        self.career_center_email = career_center_email
        self.is_verified = is_verified
        self.status = status
        super().__init__(**kwargs)


class UniversityDepartment(db.Model):
    """Academic department / faculty within an institution."""
    __tablename__ = 'university_departments'

    id = db.Column(db.Integer, primary_key=True)
    university_id = db.Column(db.Integer, db.ForeignKey('universities.id'), nullable=False)
    name_ar = db.Column(db.String(120), nullable=False)
    name_en = db.Column(db.String(120), nullable=True)
    faculty = db.Column(db.String(120), nullable=True)  # e.g. "كلية علوم الحاسب والمعلومات"
    degree_levels = db.Column(db.String(200), default="بكالوريوس")  # e.g. "بكالوريوس, ماجستير, دكتوراه"
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, university_id, name_ar, name_en=None, faculty=None, degree_levels="بكالوريوس", description=None):
        self.university_id = university_id
        self.name_ar = name_ar
        self.name_en = name_en
        self.faculty = faculty
        self.degree_levels = degree_levels
        self.description = description


class AcademicVerification(db.Model):
    """Official Academic Verification Record between University and Candidate."""
    __tablename__ = 'academic_verifications'

    id = db.Column(db.Integer, primary_key=True)
    university_id = db.Column(db.Integer, db.ForeignKey('universities.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    degree = db.Column(db.String(100), nullable=False)  # e.g. "بكالوريوس"
    department = db.Column(db.String(120), nullable=False)  # e.g. "علوم الحاسب"
    graduation_year = db.Column(db.String(50), nullable=True)  # e.g. "2024"
    gpa = db.Column(db.String(50), nullable=True)  # e.g. "4.85 / 5.0"
    status = db.Column(db.String(30), default="pending")  # 'pending', 'verified', 'rejected'
    verification_code = db.Column(db.String(64), unique=True, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    requested_at = db.Column(db.DateTime, default=datetime.utcnow)
    verified_at = db.Column(db.DateTime, nullable=True)
    verified_by = db.Column(db.String(120), nullable=True)

    customer = db.relationship('Customers', backref='academic_verifications', lazy=True)

    def __init__(self, university_id, customer_id, degree, department, graduation_year=None,
                 gpa=None, status="pending", notes=None, **kwargs):
        self.university_id = university_id
        self.customer_id = customer_id
        self.degree = degree
        self.department = department
        self.graduation_year = graduation_year
        self.gpa = gpa
        self.status = status
        self.notes = notes
        if not self.verification_code:
            self.verification_code = f"FAEDA-VERIF-{secrets.token_hex(4).upper()}"
        super().__init__(**kwargs)

    @classmethod
    def generate_verification_code(cls, institution_code="UNI"):
        return f"FAEDA-VERIF-{institution_code}-{secrets.token_hex(4).upper()}"
