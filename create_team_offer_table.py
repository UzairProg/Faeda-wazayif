from app import create_app, db
from services.team_offer import TeamOffer
from services.company import Company
from services.teams import Teams
from services.job import Jobs

app = create_app()
with app.app_context():
    db.create_all()
    print("Created team_offers table successfully.")
