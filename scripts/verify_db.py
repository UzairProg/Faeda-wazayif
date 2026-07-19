import sqlite3
import pandas as pd

conn = sqlite3.connect(r'c:\mysite\instance\database.db')

print("--- Customers ---")
df_cust = pd.read_sql_query("SELECT id, fullname, expected_salary, languages_json, certifications, work_style FROM customers LIMIT 1", conn)
print(df_cust.to_dict('records'))

print("\n--- Jobs ---")
df_jobs = pd.read_sql_query("SELECT id, title, salary_min, salary_max, required_skills, preferred_work_style FROM jobs LIMIT 1", conn)
print(df_jobs.to_dict('records'))

conn.close()
