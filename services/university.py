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
    thesis_campaigns = db.relationship('UniversityThesisCampaign', backref='university', lazy=True, cascade="all, delete-orphan")
    incubator_ventures = db.relationship('UniversityIncubatorVenture', backref='university', lazy=True, cascade="all, delete-orphan")
    coop_supervisions = db.relationship('CoopTrainingSupervision', backref='university', lazy=True, cascade="all, delete-orphan")

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


class UniversityThesisCampaign(db.Model):
    """
    University Research & Innovation Marketing Campaign.
    Showcases Master's theses, PhD dissertations, and campus innovations with university co-branding and live performance metrics.
    """
    __tablename__ = 'university_thesis_campaigns'

    id = db.Column(db.Integer, primary_key=True)
    university_id = db.Column(db.Integer, db.ForeignKey('universities.id'), nullable=False)
    
    # Researcher & Thesis details
    researcher_name = db.Column(db.String(150), nullable=False)
    researcher_title = db.Column(db.String(150), nullable=True)  # e.g. "باحثة ماجستير في هندسة الذكاء الاصطناعي"
    researcher_email = db.Column(db.String(120), nullable=True)
    researcher_img = db.Column(db.String(500), nullable=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=True)
    
    thesis_title = db.Column(db.String(300), nullable=False)
    thesis_type = db.Column(db.String(80), default="رسالة ماجستير")  # رسالة ماجستير, أطروحة دكتوراه, براءة اختراع وابتكار جامعي, مشروع تخرج نوعي
    department = db.Column(db.String(120), nullable=False)
    supervisor_name = db.Column(db.String(120), nullable=True)
    summary = db.Column(db.Text, nullable=False)
    
    # Commercialization & Impact
    commercial_readiness_level = db.Column(db.String(80), default="TRL 7 - نموذج صناعي مجرب")
    target_audience = db.Column(db.String(200), default="ترخيص تجاري وشراكة صناعية")  # ترخيص براءة اختراع, توظيف الباحث, شراكة بحث وتطوير R&D, حضانة ريادية
    tags = db.Column(db.String(300), nullable=True)
    banner_url = db.Column(db.String(500), nullable=True)
    
    # University Endorsement
    university_logo_endorsed = db.Column(db.Boolean, default=True)
    endorsement_text = db.Column(db.String(255), default="معتمد رسمياً من وكالة الجامعة للدراسات العليا والبحث العلمي")
    
    # Performance Indicators
    views_count = db.Column(db.Integer, default=1240)
    inquiries_count = db.Column(db.Integer, default=38)
    sponsorship_leads = db.Column(db.Integer, default=7)
    status = db.Column(db.String(30), default="active")  # active, draft, completed
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    customer = db.relationship('Customers', backref='thesis_campaigns', lazy=True)

    def to_dict(self):
        uni = self.university
        tag_list = [t.strip() for t in (self.tags or "").split(",") if t.strip()]
        return {
            "id": self.id,
            "university_id": self.university_id,
            "university_name_ar": uni.name_ar if uni else "الجامعة",
            "university_name_en": uni.name_en if uni else "University",
            "university_logo": uni.logo if uni and uni.logo else None,
            "university_location": uni.location if uni else "المملكة العربية السعودية",
            "researcher_name": self.researcher_name,
            "researcher_title": self.researcher_title or "باحث / مبتكر",
            "researcher_email": self.researcher_email or "",
            "researcher_img": self.researcher_img or "",
            "customer_id": self.customer_id,
            "thesis_title": self.thesis_title,
            "thesis_type": self.thesis_type,
            "department": self.department,
            "supervisor_name": self.supervisor_name or "",
            "summary": self.summary,
            "commercial_readiness_level": self.commercial_readiness_level,
            "target_audience": self.target_audience,
            "tags": tag_list,
            "banner_url": self.banner_url or "",
            "university_logo_endorsed": bool(self.university_logo_endorsed),
            "endorsement_text": self.endorsement_text,
            "views_count": self.views_count,
            "inquiries_count": self.inquiries_count,
            "sponsorship_leads": self.sponsorship_leads,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class UniversityIncubatorVenture(db.Model):
    """
    University Incubator & Entrepreneurship Showcase (e.g. Monsha'at Incubator at King Faisal University).
    Tracks graduated entrepreneurs, company details, products/services, and link to university criteria and curriculum updates.
    """
    __tablename__ = 'university_incubator_ventures'

    id = db.Column(db.Integer, primary_key=True)
    university_id = db.Column(db.Integer, db.ForeignKey('universities.id'), nullable=False)
    
    incubator_name = db.Column(db.String(200), default="حاضنة منشآت - جامعة الملك فيصل بالأحساء")
    company_name_ar = db.Column(db.String(200), nullable=False)
    company_name_en = db.Column(db.String(200), nullable=True)
    logo = db.Column(db.String(500), nullable=True)
    
    # Founder & Origin
    founder_name = db.Column(db.String(150), nullable=False)
    founder_major = db.Column(db.String(120), nullable=True)
    founder_graduation_year = db.Column(db.String(50), nullable=True)
    graduation_cohort = db.Column(db.String(100), default="الدفعة الرابعة - حاضنة منشآت 2024")
    
    # Business & Market Offerings
    business_activity = db.Column(db.String(200), nullable=False)
    products_and_services = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(60), default="خريج حاضنة - شركة نشطة تجارياً")
    
    # Economic & Criteria Impact
    jobs_created = db.Column(db.Integer, default=5)
    funding_raised_sar = db.Column(db.Integer, default=750000)
    university_criteria_connection = db.Column(db.Text, nullable=True)
    academic_material_updates = db.Column(db.Text, nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        uni = self.university
        return {
            "id": self.id,
            "university_id": self.university_id,
            "university_name": uni.name_ar if uni else "الجامعة",
            "incubator_name": self.incubator_name,
            "company_name_ar": self.company_name_ar,
            "company_name_en": self.company_name_en or "",
            "logo": self.logo or "",
            "founder_name": self.founder_name,
            "founder_major": self.founder_major or "خريج الجامعة",
            "founder_graduation_year": self.founder_graduation_year or "—",
            "graduation_cohort": self.graduation_cohort,
            "business_activity": self.business_activity,
            "products_and_services": self.products_and_services,
            "status": self.status,
            "jobs_created": self.jobs_created,
            "funding_raised_sar": self.funding_raised_sar,
            "university_criteria_connection": self.university_criteria_connection or "",
            "academic_material_updates": self.academic_material_updates or "",
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class CoopTrainingSupervision(db.Model):
    """
    Cooperative Training (التدريب التعاوني) Record for Graduating Seniors.
    Supervised by Academic Professor with workplace trainer and host company details.
    """
    __tablename__ = 'coop_training_supervisions'

    id = db.Column(db.Integer, primary_key=True)
    university_id = db.Column(db.Integer, db.ForeignKey('universities.id'), nullable=False)
    
    # Professor / Academic Supervisor Details
    professor_id = db.Column(db.String(100), nullable=False)  # Unique identifier / email
    professor_name = db.Column(db.String(150), nullable=False)
    professor_title = db.Column(db.String(150), default="أستاذ مشارك - المشرف الأكاديمي للتدريب التعاوني")
    professor_email = db.Column(db.String(120), default="k.sulaiman@kfu.edu.sa")
    professor_department = db.Column(db.String(120), default="كلية علوم الحاسب وتقنية المعلومات")
    
    # Supervised Student Details (as requested)
    student_name = db.Column(db.String(150), nullable=False)  # الاسم الكامل للطالب
    student_id_number = db.Column(db.String(50), nullable=True)  # الرقم الجامعي
    student_major = db.Column(db.String(150), nullable=False)  # التخصص الدقيق
    
    # Host Training Company & Location (as requested)
    company_name = db.Column(db.String(200), nullable=False)  # اسم الشركة المتدرب فيها
    company_location = db.Column(db.String(200), nullable=False)  # موقع الشركة الجغرافي والفرع
    
    # Workplace Industry Trainer Details (as requested)
    trainer_name = db.Column(db.String(150), nullable=False)  # اسم المدرب الميداني بالشركة
    trainer_specialization = db.Column(db.String(150), nullable=False)  # تخصص المدرب الميداني
    trainer_phone = db.Column(db.String(50), nullable=True)
    trainer_email = db.Column(db.String(120), nullable=True)
    
    # Training Program Metrics & Evaluations
    training_start_date = db.Column(db.String(50), nullable=True)
    training_end_date = db.Column(db.String(50), nullable=True)
    total_required_hours = db.Column(db.Integer, default=400)
    completed_hours = db.Column(db.Integer, default=280)
    midterm_score = db.Column(db.Integer, nullable=True)
    final_score = db.Column(db.Integer, nullable=True)
    status = db.Column(db.String(50), default="تدريب نشط")  # تدريب نشط, بانتظار تقييم الزيارة الميدانية, مكتمل وناجح
    notes = db.Column(db.Text, nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    schedules = db.relationship('ProfessorSupervisionSchedule', backref='supervision', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        progress_pct = int((self.completed_hours / self.total_required_hours) * 100) if self.total_required_hours > 0 else 0
        return {
            "id": self.id,
            "university_id": self.university_id,
            "professor_id": self.professor_id,
            "professor_name": self.professor_name,
            "professor_title": self.professor_title,
            "professor_email": self.professor_email,
            "professor_department": self.professor_department,
            "student_name": self.student_name,
            "student_id_number": self.student_id_number or "—",
            "student_major": self.student_major,
            "company_name": self.company_name,
            "company_location": self.company_location,
            "trainer_name": self.trainer_name,
            "trainer_specialization": self.trainer_specialization,
            "trainer_phone": self.trainer_phone or "",
            "trainer_email": self.trainer_email or "",
            "training_start_date": self.training_start_date or "—",
            "training_end_date": self.training_end_date or "—",
            "total_required_hours": self.total_required_hours,
            "completed_hours": self.completed_hours,
            "progress_percentage": min(100, progress_pct),
            "midterm_score": self.midterm_score,
            "final_score": self.final_score,
            "status": self.status,
            "notes": self.notes or "",
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class ProfessorSupervisionSchedule(db.Model):
    """
    Professor's Supervision Calendar & Schedule of Site Visits and Check-ins.
    """
    __tablename__ = 'professor_supervision_schedules'

    id = db.Column(db.Integer, primary_key=True)
    university_id = db.Column(db.Integer, db.ForeignKey('universities.id'), nullable=False)
    supervision_id = db.Column(db.Integer, db.ForeignKey('coop_training_supervisions.id'), nullable=True)
    
    professor_id = db.Column(db.String(100), nullable=False)
    date_time = db.Column(db.String(100), nullable=False)  # e.g. "2026-10-12 10:30 ص"
    event_type = db.Column(db.String(100), default="زيارة إشرافية ميدانية للشركة")  # زيارة إشرافية ميدانية, جلسة متابعة افتراضية, مناقشة التقرير الفني
    student_name = db.Column(db.String(150), nullable=False)
    company_name = db.Column(db.String(200), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(50), default="مجدولة")  # مجدولة, منجزة, مؤجلة
    notes = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "university_id": self.university_id,
            "supervision_id": self.supervision_id,
            "professor_id": self.professor_id,
            "date_time": self.date_time,
            "event_type": self.event_type,
            "student_name": self.student_name,
            "company_name": self.company_name,
            "location": self.location,
            "status": self.status,
            "notes": self.notes or ""
        }

