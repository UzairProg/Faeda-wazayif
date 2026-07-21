from sklearn.metrics.pairwise import cosine_similarity
from ai_engine.feature_engineering import build_features

def get_job_recommendations(target_user_id, top_n=3):
    vectorizer, job_vectors, user_vectors, df_jobs, df_customers = build_features()
    try:
        user_index = df_customers[df_customers['user_id'] == target_user_id].index[0]
    except IndexError: 
        return []
    
    similarity_matrix = cosine_similarity(user_vectors, job_vectors)
    user_scores = similarity_matrix[user_index]
    sorted_indices = sorted(list(enumerate(user_scores)), key=lambda x: x[1], reverse=True)
    
    recommendations = []
    for job_idx, score in sorted_indices[:top_n]:
        job_info = df_jobs.iloc[job_idx]
        recommendations.append({
            'job_id': int(job_info['id']), 
            'title': str(job_info['title']), 
            'match_score': float(round(score * 100, 2))
        })
        
    return recommendations