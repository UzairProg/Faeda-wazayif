import sys, os, json
sys.path.insert(0, os.path.abspath('.'))
from app import create_app, db
from services.job_filters import City

app = create_app()
with app.app_context():
    # Only seed if empty
    if City.query.count() == 0:
        data = json.load(open('data/cities.json', encoding='utf-8'))
        saudi_cities = data.get('المملكة العربية السعودية', [])
        for c in saudi_cities:
            city_name = c.get('city_name')
            if city_name:
                db.session.add(City(name_ar=city_name))
        db.session.commit()
        print(f"Successfully seeded {len(saudi_cities)} cities.")
    else:
        print("Cities already seeded.")
