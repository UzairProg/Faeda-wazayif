import sys
import os

# Add the app path to sys.path so we can import app and models
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app import create_app, db
from services.job_category import JobCategory

app = create_app()

categories = [
    {"name_ar": "برمجة وتطوير", "name_en": "Programming & Development", "icon": "fas fa-code", "sort_order": 1},
    {"name_ar": "تصميم وإبداع", "name_en": "Design & Creative", "icon": "fas fa-paint-brush", "sort_order": 2},
    {"name_ar": "تسويق ومبيعات", "name_en": "Marketing & Sales", "icon": "fas fa-bullhorn", "sort_order": 3},
    {"name_ar": "إدارة وموارد بشرية", "name_en": "Management & HR", "icon": "fas fa-users", "sort_order": 4},
    {"name_ar": "هندسة", "name_en": "Engineering", "icon": "fas fa-hard-hat", "sort_order": 5},
    {"name_ar": "مالية ومحاسبة", "name_en": "Finance & Accounting", "icon": "fas fa-file-invoice-dollar", "sort_order": 6},
    {"name_ar": "دعم فني", "name_en": "Technical Support", "icon": "fas fa-headset", "sort_order": 7},
    {"name_ar": "كتابة وترجمة", "name_en": "Writing & Translation", "icon": "fas fa-language", "sort_order": 8}
]

with app.app_context():
    # Only add if they don't exist
    for cat_data in categories:
        exists = JobCategory.query.filter_by(name_en=cat_data["name_en"]).first()
        if not exists:
            cat = JobCategory(**cat_data)
            db.session.add(cat)
            print(f"Added category: {cat_data['name_ar']}")
    
    db.session.commit()
    print("Database seeded with job categories!")
