# ==============================================================================
# services/campaign.py
# ==============================================================================
# Domain Models for LinkedIn-Style Hiring, Marketing & Recruitment Campaigns
# Includes complete Social Interactions: Likes, Comments, Shares, Saves, Analytics & Notifications
# ==============================================================================

from datetime import datetime
from app import db


class Campaign(db.Model):
    __tablename__ = 'campaigns'

    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=True)
    university_id = db.Column(db.Integer, db.ForeignKey('universities.id'), nullable=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=True)
    
    account_type = db.Column(db.String(50), default='company')  # 'company', 'university', 'candidate'
    post_type = db.Column(db.String(100), default='hiring_general')
    category = db.Column(db.String(100), default='استقطاب كفاءات')
    
    title = db.Column(db.String(255), nullable=False)
    tagline = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=True)
    banner_url = db.Column(db.String(500), nullable=True)
    media_type = db.Column(db.String(20), default='image')  # 'image' or 'video'
    video_url = db.Column(db.String(500), nullable=True)
    cta_text = db.Column(db.String(100), nullable=True)
    cta_url = db.Column(db.String(500), nullable=True)
    
    target_roles = db.Column(db.String(255), nullable=True)
    target_skills = db.Column(db.Text, nullable=True)
    target_specializations = db.Column(db.Text, nullable=True)
    target_location = db.Column(db.String(255), nullable=True)
    target_locations = db.Column(db.Text, nullable=True)
    experience_level = db.Column(db.String(50), nullable=True)
    work_type = db.Column(db.String(50), default="Full-time")
    min_salary = db.Column(db.Integer, nullable=True)
    max_salary = db.Column(db.Integer, nullable=True)
    tags = db.Column(db.String(500), nullable=True)

    # ── Budget & Proposed Reach ────────────────────────────────────────────
    budget_type = db.Column(db.String(50), nullable=True)       # 'total' | 'daily' | 'free'
    total_budget = db.Column(db.Float, nullable=True)            # SAR amount
    daily_budget = db.Column(db.Float, nullable=True)            # SAR/day (optional)
    currency = db.Column(db.String(10), default='SAR')           # ISO 4217
    campaign_duration_days = db.Column(db.Integer, nullable=True) # integer days
    # proposed_reach: ESTIMATED, never guaranteed — calculated from budget + targeting
    proposed_reach_min = db.Column(db.Integer, nullable=True)
    proposed_reach_max = db.Column(db.Integer, nullable=True)

    status = db.Column(db.String(50), default='active')
    outreach_template = db.Column(db.Text, nullable=True)

    author_name = db.Column(db.String(150), nullable=True)
    author_title = db.Column(db.String(200), nullable=True)
    author_avatar = db.Column(db.String(500), nullable=True)
    author_username = db.Column(db.String(100), nullable=True)
    is_verified = db.Column(db.Boolean, default=True)

    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    end_date = db.Column(db.DateTime, nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    company = db.relationship('Company', backref=db.backref('campaigns', lazy='dynamic'))
    university = db.relationship('University', backref=db.backref('campaigns', lazy='dynamic'))
    customer = db.relationship('Customers', backref=db.backref('campaigns', lazy='dynamic'))
    
    candidates = db.relationship('CampaignCandidate', backref='campaign', lazy='dynamic', cascade='all, delete-orphan')
    jobs = db.relationship('CampaignJob', backref='campaign', lazy='dynamic', cascade='all, delete-orphan')
    
    likes = db.relationship('CampaignLike', backref='campaign', lazy='dynamic', cascade='all, delete-orphan')
    comments = db.relationship('CampaignComment', backref='campaign', lazy='dynamic', cascade='all, delete-orphan')
    shares = db.relationship('CampaignShare', backref='campaign', lazy='dynamic', cascade='all, delete-orphan')
    saves = db.relationship('CampaignSave', backref='campaign', lazy='dynamic', cascade='all, delete-orphan')
    views = db.relationship('CampaignView', backref='campaign', lazy='dynamic', cascade='all, delete-orphan')

    def get_author_info(self):
        """Derive author details from relationships or fallback stored fields."""
        if self.account_type == 'university' and self.university:
            return {
                "name": self.university.name_ar or self.university.name_en or self.author_name or "الجامعة",
                "title": self.university.institution_type or self.author_title or "صرح أكاديمي",
                "avatar": f"/download_image/{self.university.logo}" if self.university.logo else (self.author_avatar or "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=150&h=150&fit=crop"),
                "isVerified": bool(self.university.is_verified),
                "username": self.author_username or f"univ-{self.university.id}",
                "accountType": "university",
                "organizationName": self.university.name_en or self.university.name_ar
            }
        elif self.account_type == 'candidate' and self.customer:
            return {
                "name": self.customer.fullname or self.author_name or "كفاءة مهنية",
                "title": self.customer.preferred_field_of_work or self.author_title or "باحث عن عمل",
                "avatar": f"/download_image/{self.customer.img}" if self.customer.img else (self.author_avatar or "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"),
                "isVerified": bool(self.customer.is_verified),
                "username": self.customer.user_id or self.author_username or f"user-{self.customer.id}",
                "accountType": "candidate"
            }
        elif self.company:
            return {
                "name": self.company.company_english_name or self.company.company_arabic_name or self.author_name or "الشركة",
                "title": self.company.company_field or self.author_title or "إدارة استقطاب المواهب",
                "avatar": f"/download_image/{self.company.company_logo}" if self.company.company_logo else (self.author_avatar or "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop"),
                "isVerified": bool(self.company.is_verified),
                "username": self.author_username or f"company-{self.company.id}",
                "accountType": "company",
                "organizationName": self.company.company_english_name or self.company.company_arabic_name
            }
        else:
            return {
                "name": self.author_name or ("جامعة الملك فهد" if self.account_type == "university" else "شركة وطنية" if self.account_type == "company" else "عضو مجتمع فائدة"),
                "title": self.author_title or ("عمادة البحث العلمي" if self.account_type == "university" else "إدارة الموارد البشرية" if self.account_type == "company" else "مطور برمجيات"),
                "avatar": self.author_avatar or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
                "isVerified": self.is_verified if self.is_verified is not None else True,
                "username": self.author_username or f"user-{self.account_type}-{self.id}",
                "accountType": self.account_type or "company"
            }

    def to_dict(self, include_stats=False, current_user=None):
        author_info = self.get_author_info()
        
        # Tags list
        tags_list = [t.strip() for t in (self.tags or "").split(",") if t.strip()]
        if not tags_list and self.category:
            tags_list = [self.category]

        # Target audience structure
        roles_list = [r.strip() for r in (self.target_roles or "").split(",") if r.strip()]
        if not roles_list:
            roles_list = ["candidate"] if self.account_type == "company" else ["candidate", "company"] if self.account_type == "university" else ["company"]

        specializations_list = [s.strip() for s in (self.target_specializations or self.target_skills or "").split(",") if s.strip()]
        locations_list = [l.strip() for l in (self.target_locations or self.target_location or "").split(",") if l.strip()]

        # Interaction Counts
        likes_count = self.likes.count()
        comments_count = self.comments.count()
        shares_count = self.shares.count()
        saves_count = self.saves.count()
        views_count = self.views.count()

        # User-specific interaction flags
        is_liked = False
        is_saved = False
        if current_user and current_user.get('user_type') and current_user.get('user_id'):
            ut = current_user['user_type']
            uid = current_user['user_id']
            is_liked = self.likes.filter_by(user_type=ut, user_id=uid).first() is not None
            is_saved = self.saves.filter_by(user_type=ut, user_id=uid).first() is not None

        content_str = self.description or ""
        word_count = len(content_str.split())
        read_time_mins = max(2, word_count // 150)

        data = {
            "id": self.id,
            "title": self.title,
            "slug": f"campaign-{self.id}",
            "summary": self.tagline or (content_str[:140] + "..." if content_str else ""),
            "content": content_str,
            "category": self.category or "استقطاب كفاءات",
            "accountType": self.account_type or "company",
            "postType": self.post_type or "hiring_general",
            "tags": tags_list,
            "coverImage": self.banner_url or "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop",
            "mediaType": self.media_type or "image",
            "videoUrl": self.video_url,
            "ctaText": self.cta_text,
            "ctaUrl": self.cta_url,
            "targetAudience": {
                "roles": roles_list,
                "targetSpecializations": specializations_list or ["جميع التخصصات"],
                "targetLocations": locations_list or ["جميع مناطق المملكة"],
                "experienceLevels": [self.experience_level] if self.experience_level else []
            },
            "publishedAt": (self.created_at or datetime.utcnow()).isoformat() + "Z",
            "readTime": f"{read_time_mins} دقائق قراءة",
            "views": views_count,
            "likes": likes_count,
            "commentsCount": comments_count,
            "sharesCount": shares_count,
            "savesCount": saves_count,
            "isLiked": is_liked,
            "isSaved": is_saved,
            "author": author_info,
            "status": self.status or 'active',
            # Backwards compatibility fields for recruitment board
            "company_id": self.company_id,
            "company_name": author_info.get("name", "Company"),
            "company_arabic_name": author_info.get("name", "الشركة"),
            "company_logo": author_info.get("avatar"),
            "tagline": self.tagline,
            "description": self.description,
            "banner_url": self.banner_url,
            "target_roles": roles_list,
            "target_skills": specializations_list,
            "target_location": self.target_location,
            "experience_level": self.experience_level,
            "work_type": self.work_type,
            "min_salary": self.min_salary,
            "max_salary": self.max_salary,
            "outreach_template": self.outreach_template,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            # ── Budget & Estimated Reach (clearly labeled as ESTIMATES) ──
            "budget": {
                "budgetType": self.budget_type or "free",
                "totalBudget": self.total_budget,
                "dailyBudget": self.daily_budget,
                "currency": self.currency or "SAR",
                "durationDays": self.campaign_duration_days,
            },
            "proposedReach": {
                "isEstimate": True,                  # ← always True — never guarantee
                "label": "الوصول المقدر/المتوقع (تقديري)",
                "min": self.proposed_reach_min,
                "max": self.proposed_reach_max,
            },
        }

        # Candidate recruitment funnel stats (for company panel)
        if include_stats:
            total_talent = self.candidates.count()
            contacted = self.candidates.filter(CampaignCandidate.stage != 'discovered').count()
            replied = self.candidates.filter(CampaignCandidate.stage.in_(['replied', 'interviewing', 'offered', 'hired'])).count()
            interviewing = self.candidates.filter_by(stage='interviewing').count()
            hired = self.candidates.filter_by(stage='hired').count()
            response_rate = round((replied / contacted * 100), 1) if contacted > 0 else 0
            
            data["stats"] = {
                "total_talent": total_talent,
                "contacted": contacted,
                "replied": replied,
                "interviewing": interviewing,
                "hired": hired,
                "response_rate": response_rate,
            }

        return data

    def get_analytics(self):
        """Compute full social media analytics for the campaign owner."""
        views_cnt = self.views.count()
        likes_cnt = self.likes.count()
        comments_cnt = self.comments.count()
        shares_cnt = self.shares.count()
        saves_cnt = self.saves.count()
        
        total_engagements = likes_cnt + comments_cnt + shares_cnt + saves_cnt
        engagement_rate = round((total_engagements / max(views_cnt, 1)) * 100, 1)

        # Recent activities log
        recent_likes = [
            {"user_name": l.user_name or "مستخدم", "user_type": l.user_type, "time": l.created_at.isoformat()}
            for l in self.likes.order_by(CampaignLike.created_at.desc()).limit(5).all()
        ]
        recent_comments = [
            {"author": c.author_name, "content": c.content[:60], "time": c.created_at.isoformat()}
            for c in self.comments.order_by(CampaignComment.created_at.desc()).limit(5).all()
        ]
        recent_shares = [
            {"user_name": s.user_name or "مستخدم", "quote": s.repost_quote, "time": s.created_at.isoformat()}
            for s in self.shares.order_by(CampaignShare.created_at.desc()).limit(5).all()
        ]

        return {
            "campaign_id": self.id,
            "title": self.title,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            # ── ACTUAL metrics (real database counts) ──
            "actual": {
                "views": views_cnt,
                "likes": likes_cnt,
                "comments": comments_cnt,
                "shares": shares_cnt,
                "saves": saves_cnt,
                "total_engagements": total_engagements,
                "engagement_rate": engagement_rate,
            },
            # ── ESTIMATED / PROPOSED reach (budget-based, labeled as estimate) ──
            "estimated": {
                "isEstimate": True,
                "label": "الوصول المقدر/المتوقع (تقديري وليس مضموناً)",
                "proposedReachMin": self.proposed_reach_min,
                "proposedReachMax": self.proposed_reach_max,
                "budgetType": self.budget_type or "free",
                "totalBudget": self.total_budget,
                "dailyBudget": self.daily_budget,
                "currency": self.currency or "SAR",
                "durationDays": self.campaign_duration_days,
            },
            # backward-compat flat fields
            "views": views_cnt,
            "likes": likes_cnt,
            "comments": comments_cnt,
            "shares": shares_cnt,
            "saves": saves_cnt,
            "total_engagements": total_engagements,
            "engagement_rate": engagement_rate,
            "recent_likes": recent_likes,
            "recent_comments": recent_comments,
            "recent_shares": recent_shares
        }


class CampaignLike(db.Model):
    __tablename__ = 'campaign_likes'

    id = db.Column(db.Integer, primary_key=True)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaigns.id', ondelete='CASCADE'), nullable=False)
    user_type = db.Column(db.String(30), nullable=False)  # 'company', 'university', 'candidate', 'admin'
    user_id = db.Column(db.Integer, nullable=False)
    user_name = db.Column(db.String(150), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('campaign_id', 'user_type', 'user_id', name='uq_campaign_like'),
    )


class CampaignComment(db.Model):
    __tablename__ = 'campaign_comments'

    id = db.Column(db.Integer, primary_key=True)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaigns.id', ondelete='CASCADE'), nullable=False)
    user_type = db.Column(db.String(30), nullable=False)
    user_id = db.Column(db.Integer, nullable=False)
    author_name = db.Column(db.String(150), nullable=False)
    author_avatar = db.Column(db.String(500), nullable=True)
    author_title = db.Column(db.String(200), nullable=True)
    author_username = db.Column(db.String(100), nullable=True)
    content = db.Column(db.Text, nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('campaign_comments.id', ondelete='CASCADE'), nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Self-referential relationship for nested replies
    replies = db.relationship('CampaignComment', backref=db.backref('parent', remote_side=[id]), cascade='all, delete-orphan', lazy=True)

    def to_dict(self, current_user=None):
        is_owner = False
        if current_user and current_user.get('user_type') and current_user.get('user_id'):
            is_owner = (self.user_type == current_user['user_type'] and self.user_id == current_user['user_id'])
            if current_user.get('user_type') == 'admin':
                is_owner = True

        replies_list = [r.to_dict(current_user=current_user) for r in sorted(self.replies, key=lambda x: x.created_at)]

        return {
            "id": self.id,
            "campaignId": self.campaign_id,
            "author": self.author_name,
            "avatar": self.author_avatar or "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
            "authorTitle": self.author_title,
            "authorUsername": self.author_username,
            "userType": self.user_type,
            "userId": self.user_id,
            "text": self.content,
            "content": self.content,
            "parentId": self.parent_id,
            "time": self.created_at.strftime("%Y-%m-%d %H:%M") if self.created_at else "الآن",
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "isOwner": is_owner,
            "replies": replies_list
        }


class CampaignShare(db.Model):
    __tablename__ = 'campaign_shares'

    id = db.Column(db.Integer, primary_key=True)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaigns.id', ondelete='CASCADE'), nullable=False)
    user_type = db.Column(db.String(30), nullable=False)
    user_id = db.Column(db.Integer, nullable=False)
    user_name = db.Column(db.String(150), nullable=True)
    user_avatar = db.Column(db.String(500), nullable=True)
    user_title = db.Column(db.String(200), nullable=True)
    repost_quote = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "campaignId": self.campaign_id,
            "userType": self.user_type,
            "userId": self.user_id,
            "userName": self.user_name,
            "userAvatar": self.user_avatar,
            "userTitle": self.user_title,
            "quote": self.repost_quote,
            "createdAt": self.created_at.isoformat() if self.created_at else None
        }


class CampaignSave(db.Model):
    __tablename__ = 'campaign_saves'

    id = db.Column(db.Integer, primary_key=True)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaigns.id', ondelete='CASCADE'), nullable=False)
    user_type = db.Column(db.String(30), nullable=False)
    user_id = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('campaign_id', 'user_type', 'user_id', name='uq_campaign_save'),
    )


class CampaignView(db.Model):
    __tablename__ = 'campaign_views'

    id = db.Column(db.Integer, primary_key=True)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaigns.id', ondelete='CASCADE'), nullable=False)
    user_type = db.Column(db.String(30), nullable=True)
    user_id = db.Column(db.Integer, nullable=True)
    ip_address = db.Column(db.String(50), nullable=True)
    viewed_at = db.Column(db.DateTime, default=datetime.utcnow)


class Notification(db.Model):
    __tablename__ = 'notifications'

    id = db.Column(db.Integer, primary_key=True)
    recipient_type = db.Column(db.String(30), nullable=False)  # 'company', 'university', 'candidate', 'admin'
    recipient_id = db.Column(db.Integer, nullable=False)
    actor_type = db.Column(db.String(30), nullable=False)
    actor_id = db.Column(db.Integer, nullable=False)
    actor_name = db.Column(db.String(150), nullable=True)
    actor_avatar = db.Column(db.String(500), nullable=True)
    action_type = db.Column(db.String(50), nullable=False)  # 'like', 'comment', 'share', 'reply'
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaigns.id', ondelete='CASCADE'), nullable=True)
    comment_id = db.Column(db.Integer, nullable=True)
    title = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    read_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    campaign = db.relationship('Campaign', backref=db.backref('notifications', lazy='dynamic', cascade='all, delete-orphan'))

    def to_dict(self):
        return {
            "id": self.id,
            "recipientType": self.recipient_type,
            "recipientId": self.recipient_id,
            "actor": {
                "type": self.actor_type,
                "id": self.actor_id,
                "name": self.actor_name or "مستخدم",
                "avatar": self.actor_avatar or "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
            },
            "actionType": self.action_type,
            "campaignId": self.campaign_id,
            "commentId": self.comment_id,
            "title": self.title,
            "message": self.message,
            "isRead": bool(self.is_read),
            "readAt": self.read_at.isoformat() if self.read_at else None,
            "createdAt": self.created_at.isoformat() if self.created_at else None
        }


class CampaignCandidate(db.Model):
    __tablename__ = 'campaign_candidates'

    id = db.Column(db.Integer, primary_key=True)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaigns.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    
    stage = db.Column(db.String(50), default='discovered')
    match_score = db.Column(db.Integer, default=85)
    notes = db.Column(db.Text, nullable=True)
    outreach_sent_at = db.Column(db.DateTime, nullable=True)
    last_activity_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    customer = db.relationship('Customers', backref=db.backref('campaign_memberships', lazy='dynamic'))

    def to_dict(self):
        c = self.customer
        skills_list = [s.skill_name for s in (c.skills or [])] if c and hasattr(c, 'skills') else []
        return {
            "id": self.id,
            "campaign_id": self.campaign_id,
            "customer_id": self.customer_id,
            "match_score": self.match_score,
            "stage": self.stage,
            "notes": self.notes,
            "outreach_sent_at": self.outreach_sent_at.isoformat() if self.outreach_sent_at else None,
            "last_activity_at": self.last_activity_at.isoformat() if self.last_activity_at else None,
            "candidate": {
                "id": c.id if c else self.customer_id,
                "user_id": c.user_id if c else None,
                "fullname": c.fullname if c else "Candidate",
                "email": c.email if c else None,
                "mobile": c.mobile if c else None,
                "img": c.img if c and c.img else None,
                "title": c.preferred_field_of_work or (c.about[:60] if c and c.about else "Professional"),
                "location": c.government or c.country or "Saudi Arabia" if c else "Saudi Arabia",
                "years_of_experience": c.years_of_skills or "2+" if c else "2+",
                "skills": skills_list[:8],
                "expected_salary": c.expected_salary if c else None,
                "is_verified": bool(c.is_verified) if c else False,
            }
        }


class CampaignJob(db.Model):
    __tablename__ = 'campaign_jobs'

    id = db.Column(db.Integer, primary_key=True)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaigns.id'), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)

    job = db.relationship('Jobs', backref=db.backref('campaign_links', lazy='dynamic'))

    def to_dict(self):
        j = self.job
        return {
            "id": self.id,
            "job_id": self.job_id,
            "title": j.job_title if j else "Job",
            "location": j.location if j else "",
            "work_type": j.work_type if j else "",
            "salary": f"{j.min_salary} - {j.max_salary} SAR" if j and j.min_salary else None,
        }
