from app import db
from datetime import datetime

class DirectOffer(db.Model):
    __tablename__ = 'direct_offers'
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    user_id = db.Column(db.String(120), db.ForeignKey('customers.user_id'), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=True) # Optional linking to a specific posted job
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), default='pending') # pending, accepted, rejected
    meeting_time = db.Column(db.DateTime, nullable=True) # Optional meeting time
    offer_file = db.Column(db.String(255), nullable=True) # Optional file path
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    company = db.relationship('Company', backref=db.backref('direct_offers', lazy=True))
    customer = db.relationship('Customers', backref=db.backref('direct_offers', lazy=True))
    job = db.relationship('Jobs', backref=db.backref('direct_offers', lazy=True))
