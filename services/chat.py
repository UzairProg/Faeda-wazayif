# ==============================================================================
# services/chat.py
# ==============================================================================
# Domain Models for Faeda Professional Chat & Real-Time Communication System
# Supports:
#   - CANDIDATE_COMPANY: Candidate & Employer discussions on job applications
#   - TEAM_INTERNAL: Internal messaging within professional squad members
#   - TEAM_COMPANY: Employer & Squad discussions on team-friendly opportunities
#   - DIRECT: Authorized professional 1-on-1 communication
# ==============================================================================

from datetime import datetime
from app import db


class Conversation(db.Model):
    __tablename__ = 'conversations'

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50), nullable=False, default='CANDIDATE_COMPANY')
    subject = db.Column(db.String(255), nullable=True)
    
    # Context link (e.g. 'job_application', 'job', 'team', 'direct')
    context_type = db.Column(db.String(50), nullable=True)
    context_id = db.Column(db.String(100), nullable=True)
    
    created_by_type = db.Column(db.String(50), nullable=False) # 'candidate', 'company', 'admin'
    created_by_id = db.Column(db.Integer, nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    participants = db.relationship('ConversationParticipant', backref='conversation', cascade='all, delete-orphan', lazy='dynamic')
    messages = db.relationship('ChatMessage', backref='conversation', cascade='all, delete-orphan', lazy='dynamic', order_by='ChatMessage.created_at.asc()')

    def to_summary_dict(self, current_user_type: str, current_user_id: int):
        """Serialize conversation summary for conversation list view."""
        # Find other participants
        all_parts = self.participants.all()
        other_parts = [p for p in all_parts if not (p.participant_type == current_user_type and p.participant_id == current_user_id)]
        current_part = next((p for p in all_parts if p.participant_type == current_user_type and p.participant_id == current_user_id), None)
        
        # Get latest message
        last_msg = self.messages.filter(ChatMessage.deleted_at.is_(None)).order_by(ChatMessage.created_at.desc()).first()
        
        # Calculate unread count for current participant
        unread_count = 0
        if current_part:
            unread_q = self.messages.filter(
                ChatMessage.deleted_at.is_(None),
                ~((ChatMessage.sender_type == current_user_type) & (ChatMessage.sender_id == current_user_id))
            )
            if current_part.last_read_at:
                unread_q = unread_q.filter(ChatMessage.created_at > current_part.last_read_at)
            unread_count = unread_q.count()

        # Primary counterpart metadata
        counterpart_meta = self._resolve_counterpart_meta(other_parts, current_user_type)

        return {
            "id": self.id,
            "type": self.type,
            "subject": self.subject or counterpart_meta.get("name", "محادثة مهنية"),
            "context": {
                "type": self.context_type,
                "id": self.context_id
            },
            "counterpart": counterpart_meta,
            "participants": [p.to_dict() for p in all_parts],
            "lastMessage": last_msg.to_dict() if last_msg else None,
            "lastMessageAt": (last_msg.created_at.isoformat() if last_msg and last_msg.created_at else (self.updated_at.isoformat() if self.updated_at else self.created_at.isoformat())),
            "unreadCount": unread_count,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None
        }

    def _resolve_counterpart_meta(self, other_parts, current_user_type):
        from services.customer import Customers
        from services.company import Company
        from services.teams import Teams

        if self.type == 'TEAM_INTERNAL':
            # Resolve team
            team_id = int(self.context_id) if self.context_id and str(self.context_id).isdigit() else None
            team = Teams.query.get(team_id) if team_id else None
            return {
                "type": "team",
                "id": team.id if team else 0,
                "name": team.name if team else "فريق العمل",
                "avatar": f"/download_image_team/{team.team_img}" if (team and team.team_img) else None,
                "badge": "فريق مهني",
                "badgeEn": "Professional Team"
            }

        if not other_parts:
            return {
                "type": "unknown",
                "id": 0,
                "name": "مستخدم غير متوفر",
                "avatar": None,
                "badge": "محادثة",
                "badgeEn": "Chat"
            }

        primary_other = other_parts[0]
        if primary_other.participant_type == 'company':
            comp = Company.query.get(primary_other.participant_id)
            comp_name = (comp.company_arabic_name or comp.company_english_name or comp.company_name_on_faeda) if comp else "منشأة معتمدة"
            comp_logo = f"/download_image_company/{comp.company_logo}" if (comp and comp.company_logo) else None
            return {
                "type": "company",
                "id": comp.id if comp else primary_other.participant_id,
                "name": comp_name,
                "avatar": comp_logo,
                "badge": comp.company_field or "جهة توظيف",
                "badgeEn": "Employer"
            }
        elif primary_other.participant_type == 'candidate':
            cand = Customers.query.get(primary_other.participant_id)
            cand_name = cand.fullname if cand else "مرشح مهني"
            cand_avatar = f"/download_image/{cand.img}" if (cand and cand.img) else None
            return {
                "type": "candidate",
                "id": cand.id if cand else primary_other.participant_id,
                "name": cand_name,
                "avatar": cand_avatar,
                "badge": cand.preferred_field_of_work or cand.educational_qualification or "كفاءة مهنية",
                "badgeEn": "Candidate"
            }
        elif primary_other.participant_type == 'team':
            team = Teams.query.get(primary_other.participant_id)
            return {
                "type": "team",
                "id": team.id if team else primary_other.participant_id,
                "name": team.name if team else "فريق مهني",
                "avatar": f"/download_image_team/{team.team_img}" if (team and team.team_img) else None,
                "badge": team.specialization or "فريق مهني",
                "badgeEn": "Team"
            }

        return {
            "type": primary_other.participant_type,
            "id": primary_other.participant_id,
            "name": "مستخدم",
            "avatar": None,
            "badge": "محادثة",
            "badgeEn": "Conversation"
        }


class ConversationParticipant(db.Model):
    __tablename__ = 'conversation_participants'

    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversations.id', ondelete='CASCADE'), nullable=False)
    participant_type = db.Column(db.String(50), nullable=False) # 'candidate', 'company', 'team', 'admin'
    participant_id = db.Column(db.Integer, nullable=False)
    
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_read_at = db.Column(db.DateTime, nullable=True)
    is_muted = db.Column(db.Boolean, default=False)

    __table_args__ = (
        db.UniqueConstraint('conversation_id', 'participant_type', 'participant_id', name='uq_conv_participant'),
    )

    def to_dict(self):
        from services.customer import Customers
        from services.company import Company
        from services.teams import Teams

        name = ""
        avatar = None
        if self.participant_type == 'candidate':
            cand = Customers.query.get(self.participant_id)
            name = cand.fullname if cand else f"Candidate #{self.participant_id}"
            avatar = f"/download_image/{cand.img}" if (cand and cand.img) else None
        elif self.participant_type == 'company':
            comp = Company.query.get(self.participant_id)
            name = (comp.company_arabic_name or comp.company_english_name) if comp else f"Company #{self.participant_id}"
            avatar = f"/download_image_company/{comp.company_logo}" if (comp and comp.company_logo) else None
        elif self.participant_type == 'team':
            team = Teams.query.get(self.participant_id)
            name = team.name if team else f"Team #{self.participant_id}"
            avatar = f"/download_image_team/{team.team_img}" if (team and team.team_img) else None

        return {
            "id": self.id,
            "conversationId": self.conversation_id,
            "type": self.participant_type,
            "idRef": self.participant_id,
            "name": name,
            "avatar": avatar,
            "joinedAt": self.joined_at.isoformat() if self.joined_at else None,
            "lastReadAt": self.last_read_at.isoformat() if self.last_read_at else None
        }


class ChatMessage(db.Model):
    __tablename__ = 'chat_messages'

    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversations.id', ondelete='CASCADE'), nullable=False)
    
    sender_type = db.Column(db.String(50), nullable=False) # 'candidate', 'company', 'admin'
    sender_id = db.Column(db.Integer, nullable=False)
    
    body = db.Column(db.Text, nullable=False)
    message_type = db.Column(db.String(50), default='text') # 'text', 'system', 'file'
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    edited_at = db.Column(db.DateTime, nullable=True)
    deleted_at = db.Column(db.DateTime, nullable=True)
    is_read = db.Column(db.Boolean, default=False)

    def to_dict(self, current_user_type=None, current_user_id=None):
        from services.customer import Customers
        from services.company import Company

        sender_name = "مستخدم"
        sender_avatar = None
        if self.sender_type == 'candidate':
            cand = Customers.query.get(self.sender_id)
            sender_name = cand.fullname if cand else "مرشح"
            sender_avatar = f"/download_image/{cand.img}" if (cand and cand.img) else None
        elif self.sender_type == 'company':
            comp = Company.query.get(self.sender_id)
            sender_name = (comp.company_arabic_name or comp.company_english_name) if comp else "المنشأة"
            sender_avatar = f"/download_image_company/{comp.company_logo}" if (comp and comp.company_logo) else None
        elif self.sender_type == 'admin':
            sender_name = "فريق الدعم الفني"

        is_own = False
        if current_user_type and current_user_id:
            is_own = (self.sender_type == current_user_type and self.sender_id == current_user_id)

        is_deleted = bool(self.deleted_at)
        body_text = "تم حذف هذه الرسالة" if is_deleted else self.body

        return {
            "id": self.id,
            "conversationId": self.conversation_id,
            "senderType": self.sender_type,
            "senderId": self.sender_id,
            "senderName": sender_name,
            "senderAvatar": sender_avatar,
            "isOwn": is_own,
            "body": body_text,
            "messageType": self.message_type,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "editedAt": self.edited_at.isoformat() if self.edited_at else None,
            "isDeleted": is_deleted,
            "isRead": self.is_read
        }
