import os
import sys

sys.path.insert(0, os.path.abspath(os.path.dirname(os.path.dirname(__file__))))

from app import create_app, db
from services.campaign import CampaignContent
from sqlalchemy import inspect

app = create_app()
with app.app_context():
    inspector = inspect(db.engine)
    columns = inspector.get_columns('campaign_contents')
    print("Columns in campaign_contents:")
    for col in columns:
        print(f" - {col['name']} ({col['type']})")
