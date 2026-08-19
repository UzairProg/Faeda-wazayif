from app import create_app, db
import traceback
from sqlalchemy import text

app = create_app()

with app.app_context():
    try:
        db.session.execute(text("ALTER TABLE direct_offers ADD COLUMN meeting_time DATETIME;"))
        db.session.commit()
        print("Added meeting_time")
    except Exception as e:
        print("meeting_time error:", e)

    try:
        db.session.execute(text("ALTER TABLE direct_offers ADD COLUMN offer_file VARCHAR(255);"))
        db.session.commit()
        print("Added offer_file")
    except Exception as e:
        print("offer_file error:", e)
