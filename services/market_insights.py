# ==============================================================================
# services/market_insights.py
# ==============================================================================
# Database Models for Talent & Market Insights Module:
# - MarketInsight: Scalable salary and skill benchmark repository
# - CandidateMarketInsight: Profile-driven candidate market position & salary estimates
# ==============================================================================

from datetime import datetime
from app import db


class MarketInsight(db.Model):
    """
    Market salary & talent benchmark data table.
    Stores verified salary benchmarks, skill demand levels, and talent availability
    across roles, specializations, industries, and locations.
    """
    __tablename__ = 'market_insights'

    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(120), nullable=False, index=True)
    specialization = db.Column(db.String(120), nullable=False, index=True)
    skills = db.Column(db.Text, nullable=True)  # JSON or comma-separated list of skills
    industry = db.Column(db.String(120), nullable=False, index=True)
    location = db.Column(db.String(120), nullable=False, index=True)
    experience_min = db.Column(db.Integer, default=0)
    experience_max = db.Column(db.Integer, default=5)
    salary_min = db.Column(db.Float, nullable=False)
    salary_max = db.Column(db.Float, nullable=False)
    average_salary = db.Column(db.Float, nullable=False)
    median_salary = db.Column(db.Float, nullable=True)
    currency = db.Column(db.String(10), default='SAR')  # SAR, INR (LPA), USD
    demand_level = db.Column(db.String(50), default='High')  # Critical, High, Medium, Low
    talent_availability = db.Column(db.String(50), default='Moderate')  # Very Scarce, Scarce, Moderate, High
    hiring_competition = db.Column(db.String(50), default='Medium')  # High, Medium, Low
    source = db.Column(db.String(255), default='Market Salary Dataset')
    source_url = db.Column(db.String(255), nullable=True)
    is_demo = db.Column(db.Boolean, default=True)  # Clearly labels demo data
    data_date = db.Column(db.String(50), default='2026-10-02')
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        import json
        parsed_skills = []
        if self.skills:
            try:
                parsed_skills = json.loads(self.skills) if self.skills.startswith('[') else [s.strip() for s in self.skills.split(',') if s.strip()]
            except Exception:
                parsed_skills = [s.strip() for s in self.skills.split(',') if s.strip()]

        return {
            'id': self.id,
            'role': self.role,
            'specialization': self.specialization,
            'skills': parsed_skills,
            'industry': self.industry,
            'location': self.location,
            'experience_min': self.experience_min,
            'experience_max': self.experience_max,
            'salary_min': self.salary_min,
            'salary_max': self.salary_max,
            'average_salary': self.average_salary,
            'median_salary': self.median_salary or self.average_salary,
            'currency': self.currency or 'SAR',
            'demand_level': self.demand_level,
            'talent_availability': self.talent_availability,
            'hiring_competition': self.hiring_competition,
            'source': self.source,
            'source_url': self.source_url,
            'is_demo': self.is_demo,
            'data_date': self.data_date,
            'last_updated': self.last_updated.strftime('%Y-%m-%d') if self.last_updated else '2026-10-02',
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }


class CandidateMarketInsight(db.Model):
    """
    Calculated market salary estimate and positioning for an individual candidate.
    Recalculated whenever the candidate's profile, experience, or skills update.
    Never exposes fixed 'worth'; provides statistical market benchmark.
    """
    __tablename__ = 'candidate_market_insights'

    id = db.Column(db.Integer, primary_key=True)
    candidate_id = db.Column(db.String(120), nullable=False, index=True)
    estimated_salary_min = db.Column(db.Float, nullable=False)
    estimated_salary_max = db.Column(db.Float, nullable=False)
    average_salary = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(10), default='SAR')
    matching_roles = db.Column(db.Text, nullable=True)  # JSON list
    skill_match_percentage = db.Column(db.Float, default=80.0)
    skill_demand = db.Column(db.String(50), default='High')
    industry_demand = db.Column(db.String(50), default='High')
    market_position = db.Column(db.String(100), default='Competitive (Top 25%)')
    profile_strength = db.Column(db.Integer, default=85)
    calculated_at = db.Column(db.DateTime, default=datetime.utcnow)
    data_source = db.Column(db.String(255), default='Market Salary Dataset')
    is_demo = db.Column(db.Boolean, default=True)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        import json
        roles = []
        if self.matching_roles:
            try:
                roles = json.loads(self.matching_roles) if self.matching_roles.startswith('[') else [r.strip() for r in self.matching_roles.split(',') if r.strip()]
            except Exception:
                roles = [r.strip() for r in self.matching_roles.split(',') if r.strip()]

        return {
            'id': self.id,
            'candidate_id': self.candidate_id,
            'estimated_salary_min': self.estimated_salary_min,
            'estimated_salary_max': self.estimated_salary_max,
            'average_salary': self.average_salary,
            'currency': self.currency or 'SAR',
            'matching_roles': roles,
            'skill_match_percentage': self.skill_match_percentage,
            'skill_demand': self.skill_demand,
            'industry_demand': self.industry_demand,
            'market_position': self.market_position,
            'profile_strength': self.profile_strength,
            'calculated_at': self.calculated_at.isoformat() if self.calculated_at else None,
            'data_source': self.data_source,
            'is_demo': self.is_demo,
            'last_updated': self.last_updated.strftime('%Y-%m-%d') if self.last_updated else '2026-10-02',
        }
