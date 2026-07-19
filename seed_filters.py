import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app import create_app, db
from services.job_filters import City, JobType

app = create_app()

cities = [
    "الرياض", "جدة", "الدمام", "مكة المكرمة", "المدينة المنورة", 
    "الخبر", "الظهران", "تبوك", "بريدة", "خميس مشيط", "أبها", "الطائف"
]

job_types = [
    "دوام كامل", "دوام جزئي", "تمهير", "تدريب صيفي", "تدريب تعاوني", "تطوع", "عن بعد", "عمل حر"
]

with app.app_context():
    # Create the new tables
    City.__table__.create(db.engine, checkfirst=True)
    JobType.__table__.create(db.engine, checkfirst=True)
    
    print("Tables created.")
    
    # Seed Cities
    for index, c in enumerate(cities, start=1):
        if not City.query.filter_by(name_ar=c).first():
            db.session.add(City(name_ar=c, sort_order=index))
            print(f"Added city: {c}")
            
    # Seed Job Types
    for index, jt in enumerate(job_types, start=1):
        if not JobType.query.filter_by(name_ar=jt).first():
            db.session.add(JobType(name_ar=jt, sort_order=index))
            print(f"Added job type: {jt}")
            
    db.session.commit()
    print("Database seeding completed.")
