import kagglehub
import pandas as pd
import os

print("Downloading LinkedIn Jobs Dataset...")
jobs_path = kagglehub.dataset_download("majedalhulayel/linkedin-jobs-data-in-saudi-arabia-2020")
print("Jobs Path:", jobs_path)
for file in os.listdir(jobs_path):
    if file.endswith('.csv'):
        df = pd.read_csv(os.path.join(jobs_path, file))
        print(f"\n--- {file} ---")
        print("Columns:", df.columns.tolist())
        print(df.head(2))

print("\nDownloading Resume Dataset...")
resume_path = kagglehub.dataset_download("snehaanbhawal/resume-dataset")
print("Resume Path:", resume_path)
for file in os.listdir(resume_path):
    if file.endswith('.csv'):
        df = pd.read_csv(os.path.join(resume_path, file))
        print(f"\n--- {file} ---")
        print("Columns:", df.columns.tolist())
        print(df.head(2))
