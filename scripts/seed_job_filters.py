import sys
import os

# أضف المسار الرئيسي للتطبيق
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app, db
from services.job_filters import JobType, Specialty

app = create_app()

JOB_TYPES = {
    'تنفيذي': 'Executive',
    'مبتدئ': 'Entry level',
    'مشارك': 'Associate',
    'مدير': 'Director',
    'متوسط الخبرة': 'Mid-Senior level',
    'تدريب': 'Internship',
    'غير محدد': 'Not Applicable',
}

SPECIALTIES = {
    'الأغذية والمشروبات': 'Food',
    'تقنية المعلومات والبرمجيات': 'Computer|Internet|Information',
    'الرعاية الصحية والطب': 'Health|Medical',
    'المالية والمحاسبة': 'Finance|Accounting',
    'الهندسة': 'Engineering',
    'المبيعات والتسويق': 'Sales|Marketing',
    'الموارد البشرية': 'Human Resources|HR',
    'إدارة المشاريع': 'Project Management',
    'القانون والمحاماة': 'Law|Legal',
    'التعليم والتدريب': 'Education|Training',
    'التصميم والفنون': 'Design|Art',
    'أخرى': ''
}

with app.app_context():
    print("Seeding Job Types...")
    for ar, en in JOB_TYPES.items():
        if not JobType.query.filter_by(name_ar=ar).first():
            jt = JobType(name_ar=ar, name_en=en)
            db.session.add(jt)
            
    print("Seeding Specialties...")
    for ar, en in SPECIALTIES.items():
        if not Specialty.query.filter_by(name_ar=ar).first():
            spec = Specialty(name_ar=ar, name_en=en)
            db.session.add(spec)
            
    db.session.commit()
    print("Done seeding job types and specialties.")
