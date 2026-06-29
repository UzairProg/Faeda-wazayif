#data base for following.py
from services.database import db
from datetime import datetime


class Following(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_follow = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=True)
    company_followers = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=True)
    customer_follow = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=True)
    customer_followers = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self,company_follow = None, company_followers=None,customer_follow=None,customer_followers=None ):
        self.company_follow = company_follow
        self.company_followers = company_followers
        self.customer_follow = customer_follow
        self.customer_followers = customer_followers