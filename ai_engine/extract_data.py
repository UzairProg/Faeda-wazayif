import sqlite3
import pandas as pd
import os
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, 'instance', 'database.db')

def clean_text(text):
    if pd.isna(text) or str(text).lower() in ['none', 'nan', 'null']: 
        return ''
    text = re.sub(r'[^a-zA-Z\u0600-\u06FF0-9\s]', ' ', str(text).lower())
    return re.sub(r'\s+', ' ', text).strip()

def extract_data_to_dataframes():
    conn = sqlite3.connect(DB_PATH)
    query_jobs = "SELECT id, title, job_type, town, specialization, skills_years, educational_qualification, job_description, required_skills, category FROM jobs"
    query_customers = "SELECT user_id, fullname, education_statue, educational_qualification, department_university, years_of_skills, preferred_field_of_work, resume_text, certifications FROM customers"
    df_jobs = pd.read_sql_query(query_jobs, conn)
    df_customers = pd.read_sql_query(query_customers, conn)
    conn.close()
    
    # Cleaning
    for col in ['specialization', 'job_description', 'required_skills', 'category']: 
        df_jobs[col] = df_jobs[col].apply(clean_text)
    for col in ['preferred_field_of_work', 'resume_text', 'certifications']: 
        df_customers[col] = df_customers[col].apply(clean_text)
        
    return df_jobs, df_customers