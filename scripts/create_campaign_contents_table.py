import os
import sys

# Ensure project root is in path
sys.path.insert(0, os.path.abspath(os.path.dirname(os.path.dirname(__file__))))

from app import create_app, db
from services.campaign import CampaignContent

def init_table():
    app = create_app()
    with app.app_context():
        # Create campaign_contents table via SQLAlchemy
        db.create_all()
        print("Table 'campaign_contents' ensured successfully in database!")

if __name__ == '__main__':
    init_table()
