# ==============================================================================
# الوظيفة الأساسية للملف: توليد بيانات وهمية (Synthetic Data) لتدريب نماذج الذكاء الاصطناعي.
# الروابط أو الميزات: يتصل مباشرة بقاعدة البيانات SQLite ويحقن آلاف السجلات.
# المتطلبات الخاصة: يتطلب تثبيت مكتبة Faker (pip install faker).
# ==============================================================================

import sqlite3
import random
import string
from datetime import datetime, timedelta
from faker import Faker
import os


# إعداد Faker باللغة العربية لدعم الأسماء والنصوص المحلية
fake = Faker('ar_SA')

# مسار قاعدة البيانات (تأكد أن المسار يطابق موقع قاعدة البيانات لديك)

# تحديد المسار الصحيح بالرجوع خطوة للخلف إلى المجلد الرئيسي ثم الدخول إلى instance
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, 'instance', 'database.db')

# قوائم البيانات المحلية لتوليد بيانات منطقية للذكاء الاصطناعي
CITIES = ["الرياض", "جدة", "الدمام", "الخبر", "مكة المكرمة", "المدينة المنورة", "أبها", "تبوك", "الجبيل", "الأحساء"]
JOB_TITLES = ["مطور ويب", "مهندس برمجيات", "محلل بيانات", "محاسب", "مدير تسويق", "مهندس مدني", "أخصائي موارد بشرية", "مصمم جرافيك", "مهندس شبكات", "مطور تطبيقات جوال"]
UNIVERSITIES = ["جامعة الإمام عبد الرحمن بن فيصل", "جامعة الملك سعود", "جامعة الملك فهد للبترول والمعادن", "جامعة الملك عبد العزيز", "جامعة الأميرة نورة"]
MAJORS = ["علوم الحاسب", "نظم المعلومات", "هندسة البرمجيات", "إدارة أعمال", "المحاسبة", "التسويق", "الهندسة المدنية"]
JOB_TYPES = ["دوام كامل", "دوام جزئي", "تمهير", "تدريب تعاوني", "تدريب صيفي"]
WORKPLACES = ["عن بعد", "حضوري", "هجين"]

def get_random_date(days_back=365):
    """توليد تاريخ عشوائي خلال فترة معينة"""
    random_days = random.randint(0, days_back)
    return datetime.now() - timedelta(days=random_days)

def generate_companies(cursor, count=50):
    print(f"[*] جاري توليد {count} شركة...")
    for _ in range(count):
        company_name = fake.company()
        cursor.execute('''
            INSERT INTO company (company_arabic_name, company_english_name, company_email, company_mobile, country, state, company_field, activated, timestamp, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            company_name,
            fake.company_suffix() + " " + fake.word(),
            fake.unique.company_email(),
            fake.phone_number(),
            "المملكة العربية السعودية",
            random.choice(CITIES),
            random.choice(["تقنية المعلومات", "المالية", "الهندسة", "التجزئة", "الرعاية الصحية"]),
            True,
            get_random_date(),
            'active'
        ))

def generate_customers(cursor, count=500):
    print(f"[*] جاري توليد {count} باحث عن عمل...")
    for _ in range(count):
        # إنشاء user_id عشوائي وفريد
        user_id = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
        cursor.execute('''
            INSERT INTO customers (user_id, fullname, email, mobile, password, sex, country, government, education_statue, educational_qualification, university, department_university, gpa, years_of_skills, preferred_field_of_work, work_type, activated, timestamp, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            user_id,
            fake.name(),
            fake.unique.email(),
            fake.phone_number(),
            "12345678", # كلمة مرور افتراضية للجميع للسهولة
            random.choice(["ذكر", "أنثى"]),
            "المملكة العربية السعودية",
            random.choice(CITIES),
            random.choice(["خريج", "طالب"]),
            random.choice(["بكالوريوس", "دبلوم", "ماجستير"]),
            random.choice(UNIVERSITIES),
            random.choice(MAJORS),
            str(round(random.uniform(2.5, 5.0), 2)),
            random.choice(["بدون خبرة", "1-3 سنوات", "3-5 سنوات", "أكثر من 5 سنوات"]),
            random.choice(["تقنية المعلومات", "الإدارة", "الهندسة", "التسويق"]),
            random.choice(JOB_TYPES),
            True,
            get_random_date(),
            'active'
        ))

def generate_jobs(cursor, count=500):
    print(f"[*] جاري توليد {count} وظيفة...")
    # جلب معرفات الشركات المتوفرة لربط الوظائف بها
    cursor.execute("SELECT id FROM company")
    company_ids = [row[0] for row in cursor.fetchall()]
    
    for _ in range(count):
        cursor.execute('''
            INSERT INTO jobs (title, job_type, town, company_about, job_description, specialization, skills_years, educational_qualification, workplace, company_id, date_posted, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            random.choice(JOB_TITLES),
            random.choice(JOB_TYPES),
            random.choice(CITIES),
            fake.text(max_nb_chars=100),
            fake.text(max_nb_chars=200), # سيتم لاحقاً استخدام هذا الوصف في خوارزميات الـ NLP
            random.choice(MAJORS),
            random.choice(["بدون خبرة", "1-3 سنوات", "3-5 سنوات"]),
            random.choice(["بكالوريوس", "دبلوم"]),
            random.choice(WORKPLACES),
            random.choice(company_ids),
            get_random_date(days_back=60),
            'active'
        ))

def main():
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        generate_companies(cursor, 50)
        generate_customers(cursor, 500)
        generate_jobs(cursor, 500)
        
        conn.commit()
        print("✅ تم بنجاح! تم حقن قاعدة البيانات بآلاف السجلات الجاهزة لنموذج الذكاء الاصطناعي.")
        
    except Exception as e:
        print(f"❌ حدث خطأ أثناء التوليد: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    main()