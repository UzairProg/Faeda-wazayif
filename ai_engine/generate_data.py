import os
import random
import string
import json
from datetime import datetime, timedelta
import pandas as pd
from faker import Faker
import sys

# تحديد المسار للوصول إلى المجلدات الأخرى
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

from app import create_app, db
from services.customer import Customers
from services.company import Company
from services.job import Jobs
from services.teams import Teams, team_members_association

fake = Faker('ar_SA')

CITIES = ["الرياض", "جدة", "الدمام", "الخبر", "مكة المكرمة", "المدينة المنورة", "أبها", "تبوك", "الجبيل", "الأحساء"]
JOB_TYPES = ["دوام كامل", "دوام جزئي", "تمهير", "تدريب تعاوني", "تدريب صيفي"]
WORKPLACES = ["عن بعد", "حضوري", "هجين"]

def get_random_date(days_back=365):
    random_days = random.randint(0, days_back)
    return datetime.now() - timedelta(days=random_days)

def load_kaggle_datasets():
    print("[*] جاري تحميل بيانات Kaggle...")
    jobs_file = r"C:\Users\Admin\.cache\kagglehub\datasets\majedalhulayel\linkedin-jobs-data-in-saudi-arabia-2020\versions\1\Linkedin Job Posts in Saudi Arabia 2020.xlsx"
    resume_file = r"C:\Users\Admin\.cache\kagglehub\datasets\snehaanbhawal\resume-dataset\versions\1\Resume\Resume.csv"
    
    df_jobs = None
    df_resumes = None
    
    try:
        if os.path.exists(jobs_file):
            df_jobs = pd.read_excel(jobs_file)
            print("[*] تم تحميل بيانات الوظائف بنجاح.")
        else:
            print("❌ لم يتم العثور على ملف الوظائف.")
            
        if os.path.exists(resume_file):
            df_resumes = pd.read_csv(resume_file)
            print("[*] تم تحميل بيانات السير الذاتية بنجاح.")
        else:
            print("❌ لم يتم العثور على ملف السير الذاتية.")
    except Exception as e:
        print(f"❌ خطأ في تحميل البيانات: {e}")
        
    return df_jobs, df_resumes

def generate_companies(count=50):
    print(f"[*] جاري توليد {count} شركة...")
    for _ in range(count):
        company_name = fake.company()
        new_company = Company(
            company_arabic_name=company_name,
            company_english_name=fake.company_suffix() + " " + fake.word(),
            company_email=fake.unique.company_email(),
            company_mobile=fake.phone_number(),
            country="المملكة العربية السعودية",
            state=random.choice(CITIES),
            company_field=random.choice(["تقنية المعلومات", "المالية", "الهندسة", "التجزئة", "الرعاية الصحية"]),
            login_password="password123",
            activated=True
        )
        # Assign fields not in __init__
        new_company.status = 'active'
        # Assign timestamp
        new_company.timestamp = get_random_date()
        db.session.add(new_company)
    db.session.commit()
    print("[*] تم حفظ الشركات.")

def generate_customers_from_resumes(df_resumes, count=500):
    print(f"[*] جاري توليد {count} باحث عن عمل من بيانات السير الذاتية...")
    
    if df_resumes is not None and not df_resumes.empty:
        # Sample random rows
        sample_resumes = df_resumes.sample(n=min(count, len(df_resumes))).to_dict('records')
    else:
        sample_resumes = [{}] * count
        print("⚠️ سيتم توليد باحثين عن عمل بدون بيانات السير الذاتية نظراً لعدم توفر الملف.")

    for row in sample_resumes:
        user_id = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
        
        category = row.get('Category', random.choice(["تقنية المعلومات", "الإدارة", "الهندسة", "التسويق"]))
        resume_text = row.get('Resume_str', "")
        
        # Fake structured data
        expected_salary = random.randint(4000, 25000)
        languages = {"Arabic": "Native", "English": random.choice(["Professional", "Intermediate", "Basic"])}
        work_style = random.choice(["Remote", "Hybrid", "On-site", "Fast-paced", "Structured"])
        certifications = [random.choice(["PMP", "AWS Certified", "CCNA", "ITIL", "None"])]

        new_customer = Customers(
            user_id=user_id,
            fullname=fake.name(),
            email=fake.unique.email(),
            mobile=fake.phone_number(),
            password="password123",
            sex=random.choice(["ذكر", "أنثى"]),
            country="المملكة العربية السعودية",
            government=random.choice(CITIES),
            education_statue=random.choice(["خريج", "طالب"]),
            educational_qualification=random.choice(["بكالوريوس", "دبلوم", "ماجستير"]),
            university="جامعة وهمية",
            department_university=category,
            gpa=str(round(random.uniform(2.5, 5.0), 2)),
            years_of_skills=random.choice(["بدون خبرة", "1-3 سنوات", "3-5 سنوات", "أكثر من 5 سنوات"]),
            preferred_field_of_work=category,
            work_type=random.choice(JOB_TYPES),
            activated=True,
            resume_text=resume_text,
            expected_salary=expected_salary,
            languages_json=json.dumps(languages),
            certifications=json.dumps(certifications),
            work_style=work_style
        )
        new_customer.status = 'active'
        new_customer.timestamp = get_random_date()
        db.session.add(new_customer)
    db.session.commit()
    print("[*] تم حفظ الباحثين عن عمل.")

def generate_jobs_from_linkedin(df_jobs, count=500):
    print(f"[*] جاري توليد {count} وظيفة من بيانات LinkedIn...")
    
    companies = Company.query.all()
    if not companies:
        print("❌ لا توجد شركات متاحة لربط الوظائف بها.")
        return

    if df_jobs is not None and not df_jobs.empty:
        sample_jobs = df_jobs.sample(n=min(count, len(df_jobs))).to_dict('records')
    else:
        sample_jobs = [{}] * count
        print("⚠️ سيتم توليد وظائف وهمية نظراً لعدم توفر الملف.")

    for row in sample_jobs:
        company = random.choice(companies)
        
        title = row.get('position', random.choice(["مطور ويب", "محلل بيانات", "مهندس برمجيات"]))
        job_type = row.get('level', random.choice(JOB_TYPES))
        town = row.get('location', random.choice(CITIES))
        job_description = str(row.get('description', fake.text(max_nb_chars=200)))
        if len(job_description) > 500:
            job_description = job_description[:497] + "..."
            
        specialization = row.get('industries', "غير محدد")
        if pd.isna(specialization):
            specialization = "غير محدد"
            
        # Fake structured data
        salary_min = random.randint(4000, 15000)
        salary_max = salary_min + random.randint(2000, 10000)
        required_skills = [random.choice(["Python", "SQL", "Management", "Communication", "Sales"])]
        preferred_work_style = random.choice(["Remote", "Hybrid", "On-site", "Corporate"])

        new_job = Jobs(
            title=str(title)[:80] if not pd.isna(title) else "بدون عنوان",
            job_type=str(job_type)[:120] if not pd.isna(job_type) else "غير محدد",
            town=str(town)[:80] if not pd.isna(town) else "غير محدد",
            company_about=fake.text(max_nb_chars=100),
            job_description=job_description,
            specialization=str(specialization)[:120],
            skills_years=random.choice(["بدون خبرة", "1-3 سنوات", "3-5 سنوات"]),
            educational_qualification=random.choice(["بكالوريوس", "دبلوم"]),
            workplace=random.choice(WORKPLACES),
            company_id=company.id,
            salary_min=salary_min,
            salary_max=salary_max,
            required_skills=json.dumps(required_skills),
            preferred_work_style=preferred_work_style
        )
        new_job.date_posted = get_random_date(days_back=60)
        new_job.status = 'approved'
        db.session.add(new_job)
    db.session.commit()
    print("[*] تم حفظ الوظائف.")

def generate_teams(count=50):
    print(f"[*] جاري توليد {count} فريق...")
    customers = Customers.query.all()
    if not customers:
        print("لا يوجد باحثين عن عمل لإنشاء فرق.")
        return

    team_names = ["فريق الابتكار", "رواد التقنية", "مجموعة التطوير", "فريق الإبداع", "خبراء البيانات"]
    
    for i in range(count):
        admin = random.choice(customers)
        team_name = f"{random.choice(team_names)} {i+1}"
        
        new_team = Teams(
            admin_id=admin.user_id,
            team_name=team_name,
            about=fake.text(max_nb_chars=100),
            achievements=fake.text(max_nb_chars=100),
            general_program=random.choice(["برنامج تطوير عام", "برنامج القيادة"]),
            special_program=random.choice(["تدريب مكثف", "تطوير خاص"]),
            semi_special_program=random.choice(["برنامج شبه خاص أ", "برنامج شبه خاص ب"]),
            creation_date=get_random_date(days_back=90)
        )
        db.session.add(new_team)
        db.session.commit() # Commit to get ID
        
        # Add random members
        num_members = random.randint(2, 8)
        members = random.sample(customers, min(num_members, len(customers)))
        
        for member in members:
            status = random.choice(["مدعو", "منضم", "مرفوض"])
            stmt = team_members_association.insert().values(
                team_id=new_team.id,
                member_id=member.user_id,
                status=status,
                general_program=random.choice(["مسار أ", "مسار ب"]),
                semi_special_program=random.choice(["مسار فرعي", None]),
                special_program=random.choice(["مسار خاص", None]),
                date_of_addition=get_random_date(days_back=30)
            )
            db.session.execute(stmt)
    db.session.commit()
    print("[*] تم حفظ الفرق.")

def main():
    try:
        app = create_app()
        with app.app_context():
            # إزالة قاعدة البيانات القديمة وإنشاء واحدة جديدة
            print("[*] جاري تهيئة قاعدة البيانات (Create)...")
            # db.drop_all()  # تم التعليق على هذا السطر لمنع حذف البيانات السابقة عند كل تشغيل
            db.create_all()
            print("[*] تم إنشاء جداول قاعدة البيانات بنجاح.")
            
            df_jobs, df_resumes = load_kaggle_datasets()
            
            generate_companies(50)
            generate_customers_from_resumes(df_resumes, 500)
            generate_jobs_from_linkedin(df_jobs, 500)
            generate_teams(50)
            
            print("✅ تم بنجاح! تم حقن قاعدة البيانات بآلاف السجلات الجاهزة لنموذج الذكاء الاصطناعي.")
            
    except Exception as e:
        import traceback
        print(f"❌ حدث خطأ أثناء التوليد: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    main()