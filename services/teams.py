# ==============================================================================
# الوظيفة الأساسية للملف: نموذج قاعدة البيانات (Model) للفرق والمجموعات.
# الروابط أو الميزات: إدارة إنشاء الفرق وأعضائها.
# المتطلبات الخاصة: يعتمد على SQLAlchemy وارتباطات الأعضاء (relationship).
# ==============================================================================
####### data for teams.py#####
from sqlalchemy import and_

from services.customer import customer_jobs
from app import db
from datetime import datetime
from sqlalchemy.orm import relationship

# services/customer.py


# Define the association table for the many-to-many relationship
team_members_association = db.Table('team_members',
    db.Column('team_id', db.Integer, db.ForeignKey('teams.id'), primary_key=True),
    db.Column('member_id', db.String(120), db.ForeignKey('customers.user_id'), primary_key=True),
    db.Column('status', db.String(50), nullable=False, default='مدعو'),  # Status column added
    db.Column('general_program', db.String(50), nullable=True),  
    db.Column('semi_special_program', db.String(50), nullable=True),  
    db.Column('special_program', db.String(50), nullable=True),  
    db.Column('date_of_addition',db.DateTime, default=datetime.utcnow)
)

team_members = team_members_association

# Define the Teams class

class Teams(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    admin_id =  db.Column(db.String(120), nullable=False)
    team_name = db.Column(db.String(255), nullable=False)
    about = db.Column(db.Text, nullable=True)
    achievements = db.Column(db.Text, nullable=True)
    general_program = db.Column(db.String(255), nullable=True)
    special_program = db.Column(db.String(255), nullable=True)
    semi_special_program = db.Column(db.String(255), nullable=True)
    img = db.Column(db.String(255), nullable=True)
    creation_date = db.Column(db.DateTime, default=datetime.utcnow)
    members = relationship("Customers", secondary=team_members_association, backref="teams")
    jobs = db.relationship("Jobs", secondary="customer_jobs", back_populates="teams")
    
    @property
    def name(self):
        return self.team_name

    @name.setter
    def name(self, val):
        self.team_name = val

    @property
    def team_img(self):
        return self.img

    @property
    def specialization(self):
        return self.special_program or self.general_program

    def __init__(self, **kwargs):
        if 'name' in kwargs and 'team_name' not in kwargs:
            kwargs['team_name'] = kwargs.pop('name')
        if 'specialization' in kwargs and 'special_program' not in kwargs:
            kwargs['special_program'] = kwargs.pop('specialization')
        if 'leader_id' in kwargs and 'admin_id' not in kwargs:
            kwargs['admin_id'] = str(kwargs.pop('leader_id'))
        super(Teams, self).__init__(**kwargs)
    
    
    @classmethod
    def get_teams_for_admin(cls, admin_id):
        query = cls.query.filter_by(admin_id=admin_id).all()
        return query

    @classmethod
    def get_admin_id_by_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        admin_id = query.admin_id
        return admin_id


    @classmethod
    def get_job_status_by_team_id(cls, id, job_id):
        query = db.session.query(customer_jobs.c.status).filter(
            and_(customer_jobs.c.team_id == id, customer_jobs.c.job_id == job_id)
        ).first()
        if query:
            return query[0]
        return None
    
    @classmethod
    def get_job_note_by_team_id(cls, id, job_id):
        query = db.session.query(customer_jobs.c.note).filter(
            and_(customer_jobs.c.team_id == id, customer_jobs.c.job_id == job_id)
        ).first()
        if query:
            return query[0]
        return None
    
    
    @classmethod
    def get_job_application_time_by_team_id(cls, id, job_id):
        query = db.session.query(customer_jobs.c.timestamp).filter(
            and_(customer_jobs.c.team_id == id, customer_jobs.c.job_id == job_id)
        ).first()
        if query:
            return query[0]
        return None
    
    @classmethod
    def get_member_ids_by_team_id(cls, team_id):
        query = db.session.query(team_members_association.c.member_id).filter_by(team_id=team_id, status = 'منضم').all()
        member_ids = [result[0] for result in query]
        return member_ids


class TeamInvitation(db.Model):
    __tablename__ = 'team_invitations'
    id = db.Column(db.Integer, primary_key=True)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id', ondelete='CASCADE'), nullable=False)
    candidate_id = db.Column(db.Integer, db.ForeignKey('customers.id', ondelete='CASCADE'), nullable=False)
    invited_by_id = db.Column(db.Integer, db.ForeignKey('customers.id', ondelete='CASCADE'), nullable=False)
    status = db.Column(db.String(20), default='pending')  # 'pending', 'accepted', 'rejected', 'cancelled'
    message = db.Column(db.String(255), nullable=True)
    role = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    responded_at = db.Column(db.DateTime, nullable=True)

    team = db.relationship('Teams', backref=db.backref('invitations', lazy=True, cascade='all, delete-orphan'))
    candidate = db.relationship('Customers', foreign_keys=[candidate_id], backref=db.backref('received_team_invitations', lazy=True))
    invited_by = db.relationship('Customers', foreign_keys=[invited_by_id], backref=db.backref('sent_team_invitations', lazy=True))