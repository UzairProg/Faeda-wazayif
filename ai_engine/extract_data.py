# ==============================================================================
# الوظيفة الأساسية: استخراج البيانات من قاعدة SQLite وتحويلها إلى DataFrames (Pandas)
# ==============================================================================

import sqlite3
import pandas as pd
import os

# تحديد مسار قاعدة البيانات الصحيح
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, 'instance', 'database.db')
def clean_data(df_jobs, df_customers):
    print("[*] جاري تنظيف ومعالجة البيانات...")
    
    # 1. تنظيف بيانات الوظائف (df_jobs)
    # ملء القيم المفقودة في التخصص والمهارات بقيم افتراضية
    df_jobs['specialization'] = df_jobs['specialization'].fillna('غير محدد')
    df_jobs['skills_years'] = df_jobs['skills_years'].fillna('بدون خبرة')
    
    # 2. تنظيف بيانات الباحثين عن عمل (df_customers)
    # تنظيف حقل preferred_field_of_work من القيم العشوائية (مثل Nonerxtcfygvu)
    # سنقوم بتبديل أي قيمة تحتوي على 'None' أو سلاسل عشوائية بـ 'غير محدد'
    df_customers['preferred_field_of_work'] = df_customers['preferred_field_of_work'].apply(
        lambda x: 'غير محدد' if pd.isna(x) or str(x).startswith('None') else x
    )
    
    # تنظيف سنوات الخبرة
    df_customers['years_of_skills'] = df_customers['years_of_skills'].apply(
        lambda x: 'بدون خبرة' if pd.isna(x) or str(x).strip() == '' else x
    )
    
    # توحيد النصوص (مثال: تحويل كل شيء لأحرف صغيرة إذا كان إنجليزياً، وإزالة المسافات الزائدة)
    for col in ['specialization', 'educational_qualification', 'department_university', 'preferred_field_of_work']:
        if col in df_customers.columns:
            df_customers[col] = df_customers[col].astype(str).str.strip()
        if col in df_jobs.columns:
            df_jobs[col] = df_jobs[col].astype(str).str.strip()

    print("✅ تم تنظيف البيانات بنجاح!")
    return df_jobs, df_customers



    
def extract_data_to_dataframes():
    print("[*] جاري الاتصال بقاعدة البيانات واستخراج الجداول...")
    
    try:
        # إنشاء اتصال بقاعدة البيانات
        conn = sqlite3.connect(DB_PATH)
        
        # 1. استخراج جدول الوظائف
        query_jobs = "SELECT id, title, job_type, town, specialization, skills_years, educational_qualification FROM jobs"
        df_jobs = pd.read_sql_query(query_jobs, conn)
        
        # 2. استخراج جدول الباحثين عن عمل
        query_customers = "SELECT user_id, fullname, education_statue, educational_qualification, department_university, years_of_skills, preferred_field_of_work FROM customers"
        df_customers = pd.read_sql_query(query_customers, conn)
        
        print("✅ تم استخراج البيانات بنجاح!")
        print("-" * 50)
        
        # طباعة نظرة عامة لبيانات الوظائف
        print(f"📊 نظرة عامة على الوظائف (إجمالي {len(df_jobs)} وظيفة):")
        print(df_jobs.head(3)) # طباعة أول 3 صفوف
        print("-" * 50)
        
        # طباعة نظرة عامة لبيانات العملاء
        print(f"👥 نظرة عامة على الباحثين عن عمل (إجمالي {len(df_customers)} مستخدم):")
        print(df_customers.head(3)) # طباعة أول 3 صفوف
        print("-" * 50)
        
        return df_jobs, df_customers

    except Exception as e:
        print(f"❌ حدث خطأ أثناء الاستخراج: {e}")
    finally:
        # إغلاق الاتصال دائماً
        if conn:
            conn.close()

if __name__ == "__main__":
    jobs_data, customers_data = extract_data_to_dataframes()