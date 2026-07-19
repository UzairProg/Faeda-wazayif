import pandas as pd

print("--- Linkedin Jobs ---")
jobs_file = r"C:\Users\Admin\.cache\kagglehub\datasets\majedalhulayel\linkedin-jobs-data-in-saudi-arabia-2020\versions\1\Linkedin Job Posts in Saudi Arabia 2020.xlsx"
df_jobs = pd.read_excel(jobs_file, nrows=2)
print("Columns:", df_jobs.columns.tolist())
print(df_jobs.head(1).to_dict('records'))

print("\n--- Resumes ---")
resume_file = r"C:\Users\Admin\.cache\kagglehub\datasets\snehaanbhawal\resume-dataset\versions\1\Resume\Resume.csv"
df_resumes = pd.read_csv(resume_file, nrows=2)
print("Columns:", df_resumes.columns.tolist())
print(df_resumes.head(1).to_dict('records'))
