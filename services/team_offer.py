# ==============================================================================
# الوظيفة الأساسية للملف: نموذج قاعدة البيانات (Model) لعروض المنشآت للفرق.
# ==============================================================================
from app import db
from datetime import datetime

class TeamOffer(db.Model):
    __tablename__ = 'team_offers'
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=True)
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), default='pending') # pending, accepted, rejected
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    company = db.relationship('Company', backref=db.backref('team_offers', lazy=True))
    team = db.relationship('Teams', backref=db.backref('team_offers', lazy=True))
    job = db.relationship('Jobs', backref=db.backref('team_offers', lazy=True))
