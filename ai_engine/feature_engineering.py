import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from ai_engine.extract_data import extract_data_to_dataframes

def build_features():
    df_jobs, df_customers = extract_data_to_dataframes()
    
    df_jobs['job_profile_text'] = df_jobs[['title', 'category', 'specialization', 'educational_qualification', 'skills_years', 'job_description', 'required_skills']].fillna('').agg(' '.join, axis=1)
    df_customers['user_profile_text'] = df_customers[['preferred_field_of_work', 'department_university', 'educational_qualification', 'years_of_skills', 'certifications', 'resume_text']].fillna('').agg(' '.join, axis=1)
    
    vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
    combined_text = pd.concat([df_jobs['job_profile_text'], df_customers['user_profile_text']])
    vectorizer.fit(combined_text)
    
    return vectorizer, vectorizer.transform(df_jobs['job_profile_text']), vectorizer.transform(df_customers['user_profile_text']), df_jobs, df_customers