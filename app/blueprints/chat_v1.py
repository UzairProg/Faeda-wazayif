# ==============================================================================
# app/blueprints/chat_v1.py
# ==============================================================================
# REST API v1 for Faeda Professional Chat & Real-Time Communication System
# Authenticated, database-backed, IDOR-protected messaging for:
#   - Candidate ↔ Company
#   - Team Members (Internal Squad Chat)
#   - Company ↔ Team
# ==============================================================================

import re
import html
from datetime import datetime
from flask import Blueprint, request, jsonify, session
from app import db
from services.chat import Conversation, ConversationParticipant, ChatMessage
from services.customer import Customers, customer_jobs
from services.company import Company
from services.teams import Teams, team_members_association
from services.job import Jobs

chat_v1_bp = Blueprint('chat_v1', __name__)


# ------------------------------------------------------------------------------
# AUTHENTICATION & IDENTITY HELPERS
# ------------------------------------------------------------------------------

def get_current_user_identity():
    """
    Derives authenticated caller identity strictly from active Flask session.
    Returns: (user_type, user_id, user_obj, error_response)
    """
    # Company session check
    if 'session_company' in session and 'company_id' in session:
        comp = Company.query.get(session['company_id'])
        if comp:
            return 'company', comp.id, comp, None
    # Candidate session check
    if 'session_customer' in session and 'user_id' in session:
        cust = Customers.query.get(session['user_id'])
        if cust:
            return 'candidate', cust.id, cust, None
    # Admin session check
    if 'admin_id' in session:
        return 'admin', session['admin_id'], None, None

    return None, None, None, (jsonify({"success": False, "message": "يجب تسجيل الدخول للوصول إلى المحادثات"}), 401)


def is_candidate_team_member(team, cust):
    """Check if candidate is an active member or leader of the team."""
    if not team or not cust:
        return False
    if team.admin_id in [str(cust.id), str(getattr(cust, 'user_id', ''))]:
        return True
    row = db.session.query(team_members_association).filter(
        team_members_association.c.team_id == team.id,
        (team_members_association.c.member_id == str(getattr(cust, 'user_id', ''))) | (team_members_association.c.member_id == str(cust.id)),
        team_members_association.c.status.in_(['active', 'منضم', 'accepted'])
    ).first()
    return bool(row)


def get_candidate_team_ids(cust):
    """Get all team IDs where candidate is a leader or active member."""
    if not cust:
        return []
    led_ids = [t.id for t in Teams.query.filter(
        (Teams.admin_id == str(cust.id)) | (Teams.admin_id == str(getattr(cust, 'user_id', '')))
    ).all()]
    member_rows = db.session.query(team_members_association.c.team_id).filter(
        (team_members_association.c.member_id == str(getattr(cust, 'user_id', ''))) | (team_members_association.c.member_id == str(cust.id)),
        team_members_association.c.status.in_(['active', 'منضم', 'accepted'])
    ).all()
    member_ids = [r[0] for r in member_rows]
    return list(set(led_ids + member_ids))


def sanitize_message_text(text: str) -> str:
    """Sanitize message text against HTML/script injection while preserving Arabic characters."""
    if not text:
        return ""
    cleaned = html.escape(text.strip())
    return cleaned


# ------------------------------------------------------------------------------
# CONVERSATION ENDPOINTS
# ------------------------------------------------------------------------------

@chat_v1_bp.route('/api/v1/chat/conversations', methods=['GET'])
def api_get_conversations():
    """
    GET /api/v1/chat/conversations
    Returns list of active conversation threads for authenticated user/company/team.
    """
    u_type, u_id, u_obj, err = get_current_user_identity()
    if err:
        return err

    # Find conversation IDs where user is a direct participant
    direct_conv_ids = [
        p.conversation_id for p in ConversationParticipant.query.filter_by(
            participant_type=u_type, participant_id=u_id
        ).all()
    ]

    # If candidate, also include conversations for teams where candidate is an active member
    team_conv_ids = []
    if u_type == 'candidate':
        all_my_team_ids = get_candidate_team_ids(u_obj)
        if all_my_team_ids:
            team_conv_ids = [
                p.conversation_id for p in ConversationParticipant.query.filter(
                    ConversationParticipant.participant_type == 'team',
                    ConversationParticipant.participant_id.in_(all_my_team_ids)
                ).all()
            ]

    all_conv_ids = list(set(direct_conv_ids + team_conv_ids))
    if not all_conv_ids:
        return jsonify({
            "success": True,
            "conversations": [],
            "total": 0
        }), 200

    conversations_raw = Conversation.query.filter(Conversation.id.in_(all_conv_ids)).order_by(Conversation.updated_at.desc()).all()
    conversations = [c.to_summary_dict(u_type, u_id) for c in conversations_raw]

    return jsonify({
        "success": True,
        "conversations": conversations,
        "total": len(conversations)
    }), 200


@chat_v1_bp.route('/api/v1/chat/conversations/<int:conv_id>', methods=['GET'])
def api_get_conversation_detail(conv_id):
    """
    GET /api/v1/chat/conversations/:id
    Returns conversation metadata, participant directory, and paginated message history.
    Strictly enforces authorization and IDOR prevention.
    """
    u_type, u_id, u_obj, err = get_current_user_identity()
    if err:
        return err

    conv = Conversation.query.get(conv_id)
    if not conv:
        return jsonify({"success": False, "message": "المحادثة غير موجودة"}), 404

    # Verify authorization
    is_authorized = False
    all_parts = conv.participants.all()
    for p in all_parts:
        if p.participant_type == u_type and p.participant_id == u_id:
            is_authorized = True
            break
        elif p.participant_type == 'team' and u_type == 'candidate':
            team = Teams.query.get(p.participant_id)
            if is_candidate_team_member(team, u_obj):
                is_authorized = True
                break

    if not is_authorized and u_type != 'admin':
        return jsonify({"success": False, "message": "ليس لديك صلاحية لعرض هذه المحادثة"}), 403

    messages_q = conv.messages.filter(ChatMessage.deleted_at.is_(None)).order_by(ChatMessage.created_at.asc())
    messages_raw = messages_q.all()
    messages = [m.to_dict(u_type, u_id) for m in messages_raw]

    summary = conv.to_summary_dict(u_type, u_id)

    return jsonify({
        "success": True,
        "conversation": summary,
        "messages": messages,
        "totalMessages": len(messages)
    }), 200


@chat_v1_bp.route('/api/v1/chat/conversations', methods=['POST'])
def api_create_conversation():
    """
    POST /api/v1/chat/conversations
    Creates or retrieves an existing legitimate conversation between candidate, company, or team.
    Validates relationship to prevent unsolicited spam.
    Request body:
      - type: 'CANDIDATE_COMPANY' | 'TEAM_INTERNAL' | 'TEAM_COMPANY' | 'DIRECT'
      - targetId: target entity ID (companyId / candidateId / teamId)
      - subject: optional subject
      - contextType: 'job_application' | 'job' | 'team' | 'direct'
      - contextId: optional reference ID
      - initialMessage: optional initial text
    """
    u_type, u_id, u_obj, err = get_current_user_identity()
    if err:
        return err

    data = request.get_json() or {}
    conv_type = data.get('type', 'CANDIDATE_COMPANY').strip().upper()
    target_id = data.get('targetId')
    subject = data.get('subject', '').strip()
    context_type = data.get('contextType', 'direct').strip()
    context_id = str(data.get('contextId', '')).strip()
    initial_message = data.get('initialMessage', '').strip()

    if not target_id:
        return jsonify({"success": False, "message": "المعرف المستهدف مطلوب"}), 400

    target_id = int(target_id)

    # --------------------------------------------------------------------------
    # 1. CANDIDATE ↔ COMPANY CONVERSATION
    # --------------------------------------------------------------------------
    if conv_type == 'CANDIDATE_COMPANY':
        if u_type == 'candidate':
            candidate_id = u_id
            company_id = target_id
            comp = Company.query.get(company_id)
            if not comp:
                return jsonify({"success": False, "message": "المنشأة غير موجودة"}), 404
        elif u_type == 'company':
            candidate_id = target_id
            company_id = u_id
            cand = Customers.query.get(candidate_id)
            if not cand:
                return jsonify({"success": False, "message": "المرشح غير موجود"}), 404
        else:
            return jsonify({"success": False, "message": "نوع المستخدم غير مصرح له بإنشاء هذه المحادثة"}), 403

        # Check existing conversation
        existing_conv = Conversation.query.filter_by(
            type='CANDIDATE_COMPANY'
        ).filter(
            Conversation.id.in_(
                db.session.query(ConversationParticipant.conversation_id).filter_by(
                    participant_type='candidate', participant_id=candidate_id
                )
            )
        ).filter(
            Conversation.id.in_(
                db.session.query(ConversationParticipant.conversation_id).filter_by(
                    participant_type='company', participant_id=company_id
                )
            )
        ).first()

        if existing_conv:
            if initial_message:
                msg = ChatMessage(
                    conversation_id=existing_conv.id,
                    sender_type=u_type,
                    sender_id=u_id,
                    body=sanitize_message_text(initial_message)
                )
                db.session.add(msg)
                existing_conv.updated_at = datetime.utcnow()
                db.session.commit()

            return jsonify({
                "success": True,
                "isExisting": True,
                "conversation": existing_conv.to_summary_dict(u_type, u_id)
            }), 200

        # Create new conversation
        if not subject:
            if u_type == 'candidate':
                comp = Company.query.get(company_id)
                subject = f"محادثة مع {(comp.company_arabic_name or comp.company_english_name) if comp else 'المنشأة'}"
            else:
                cand = Customers.query.get(candidate_id)
                subject = f"محادثة مع {cand.fullname if cand else 'المرشح'}"

        conv = Conversation(
            type='CANDIDATE_COMPANY',
            subject=subject,
            context_type=context_type,
            context_id=context_id,
            created_by_type=u_type,
            created_by_id=u_id
        )
        db.session.add(conv)
        db.session.flush()

        db.session.add(ConversationParticipant(conversation_id=conv.id, participant_type='candidate', participant_id=candidate_id))
        db.session.add(ConversationParticipant(conversation_id=conv.id, participant_type='company', participant_id=company_id))

        if initial_message:
            db.session.add(ChatMessage(
                conversation_id=conv.id,
                sender_type=u_type,
                sender_id=u_id,
                body=sanitize_message_text(initial_message)
            ))

        db.session.commit()
        return jsonify({
            "success": True,
            "isExisting": False,
            "conversation": conv.to_summary_dict(u_type, u_id)
        }), 201

    # --------------------------------------------------------------------------
    # 2. TEAM INTERNAL SQUAD CHAT
    # --------------------------------------------------------------------------
    elif conv_type == 'TEAM_INTERNAL':
        if u_type != 'candidate':
            return jsonify({"success": False, "message": "محادثات الفرق الداخلية مخصصة للأعضاء فقط"}), 403

        team_id = target_id
        team = Teams.query.get(team_id)
        if not team:
            return jsonify({"success": False, "message": "الفريق غير موجود"}), 404

        if not is_candidate_team_member(team, u_obj):
            return jsonify({"success": False, "message": "يجب أن تكون عضواً في الفريق للوصول إلى المحادثة"}), 403

        existing_conv = Conversation.query.filter_by(
            type='TEAM_INTERNAL',
            context_type='team',
            context_id=str(team_id)
        ).first()

        if existing_conv:
            if initial_message:
                msg = ChatMessage(
                    conversation_id=existing_conv.id,
                    sender_type=u_type,
                    sender_id=u_id,
                    body=sanitize_message_text(initial_message)
                )
                db.session.add(msg)
                existing_conv.updated_at = datetime.utcnow()
                db.session.commit()

            return jsonify({
                "success": True,
                "isExisting": True,
                "conversation": existing_conv.to_summary_dict(u_type, u_id)
            }), 200

        conv = Conversation(
            type='TEAM_INTERNAL',
            subject=f"محادثة فريق {team.name}",
            context_type='team',
            context_id=str(team_id),
            created_by_type=u_type,
            created_by_id=u_id
        )
        db.session.add(conv)
        db.session.flush()

        db.session.add(ConversationParticipant(conversation_id=conv.id, participant_type='team', participant_id=team_id))
        db.session.add(ConversationParticipant(conversation_id=conv.id, participant_type='candidate', participant_id=u_id))

        if initial_message:
            db.session.add(ChatMessage(
                conversation_id=conv.id,
                sender_type=u_type,
                sender_id=u_id,
                body=sanitize_message_text(initial_message)
            ))

        db.session.commit()
        return jsonify({
            "success": True,
            "isExisting": False,
            "conversation": conv.to_summary_dict(u_type, u_id)
        }), 201

    # --------------------------------------------------------------------------
    # 3. COMPANY ↔ TEAM CONVERSATION
    # --------------------------------------------------------------------------
    elif conv_type == 'TEAM_COMPANY':
        if u_type == 'company':
            company_id = u_id
            team_id = target_id
        elif u_type == 'candidate':
            team_id = int(context_id) if context_id.isdigit() else target_id
            company_id = target_id if context_id.isdigit() else u_id
        else:
            return jsonify({"success": False, "message": "نوع المستخدم غير مصرح له"}), 403

        comp = Company.query.get(company_id)
        team = Teams.query.get(team_id)
        if not comp or not team:
            return jsonify({"success": False, "message": "المنشأة أو الفريق غير موجود"}), 404

        existing_conv = Conversation.query.filter_by(
            type='TEAM_COMPANY'
        ).filter(
            Conversation.id.in_(
                db.session.query(ConversationParticipant.conversation_id).filter_by(
                    participant_type='company', participant_id=company_id
                )
            )
        ).filter(
            Conversation.id.in_(
                db.session.query(ConversationParticipant.conversation_id).filter_by(
                    participant_type='team', participant_id=team_id
                )
            )
        ).first()

        if existing_conv:
            if initial_message:
                msg = ChatMessage(
                    conversation_id=existing_conv.id,
                    sender_type=u_type,
                    sender_id=u_id,
                    body=sanitize_message_text(initial_message)
                )
                db.session.add(msg)
                existing_conv.updated_at = datetime.utcnow()
                db.session.commit()

            return jsonify({
                "success": True,
                "isExisting": True,
                "conversation": existing_conv.to_summary_dict(u_type, u_id)
            }), 200

        conv = Conversation(
            type='TEAM_COMPANY',
            subject=f"تواصل مع فريق {team.name}",
            context_type='team',
            context_id=str(team_id),
            created_by_type=u_type,
            created_by_id=u_id
        )
        db.session.add(conv)
        db.session.flush()

        db.session.add(ConversationParticipant(conversation_id=conv.id, participant_type='company', participant_id=company_id))
        db.session.add(ConversationParticipant(conversation_id=conv.id, participant_type='team', participant_id=team_id))

        if initial_message:
            db.session.add(ChatMessage(
                conversation_id=conv.id,
                sender_type=u_type,
                sender_id=u_id,
                body=sanitize_message_text(initial_message)
            ))

        db.session.commit()
        return jsonify({
            "success": True,
            "isExisting": False,
            "conversation": conv.to_summary_dict(u_type, u_id)
        }), 201

    return jsonify({"success": False, "message": "نوع المحادثة غير مدعوم"}), 400


# ------------------------------------------------------------------------------
# MESSAGE DISPATCH & LIFECYCLE ENDPOINTS
# ------------------------------------------------------------------------------

@chat_v1_bp.route('/api/v1/chat/conversations/<int:conv_id>/messages', methods=['POST'])
def api_send_message(conv_id):
    """
    POST /api/v1/chat/conversations/:id/messages
    Sends a new message into the specified conversation thread.
    Validates participant authorization, content length (1..4000 chars), and sanitizes HTML.
    """
    u_type, u_id, u_obj, err = get_current_user_identity()
    if err:
        return err

    conv = Conversation.query.get(conv_id)
    if not conv:
        return jsonify({"success": False, "message": "المحادثة غير موجودة"}), 404

    # Verify authorization
    is_authorized = False
    all_parts = conv.participants.all()
    for p in all_parts:
        if p.participant_type == u_type and p.participant_id == u_id:
            is_authorized = True
            break
        elif p.participant_type == 'team' and u_type == 'candidate':
            team = Teams.query.get(p.participant_id)
            if is_candidate_team_member(team, u_obj):
                is_authorized = True
                break

    if not is_authorized and u_type != 'admin':
        return jsonify({"success": False, "message": "ليس لديك صلاحية للإرسال في هذه المحادثة"}), 403

    data = request.get_json() or {}
    raw_body = data.get('body', '')
    if not raw_body or not str(raw_body).strip():
        return jsonify({"success": False, "message": "نص الرسالة لا يمكن أن يكون فارغاً"}), 400

    clean_body = sanitize_message_text(str(raw_body))
    if len(clean_body) > 4000:
        return jsonify({"success": False, "message": "تجاوزت الرسالة الحد الأقصى المسموح به (4000 حرف)"}), 400

    new_msg = ChatMessage(
        conversation_id=conv.id,
        sender_type=u_type,
        sender_id=u_id,
        body=clean_body,
        message_type=data.get('messageType', 'text')
    )
    db.session.add(new_msg)

    # Update conversation last activity timestamp
    conv.updated_at = datetime.utcnow()

    # Update sender's last_read_at
    sender_part = next((p for p in all_parts if p.participant_type == u_type and p.participant_id == u_id), None)
    if sender_part:
        sender_part.last_read_at = datetime.utcnow()

    db.session.commit()

    return jsonify({
        "success": True,
        "message": new_msg.to_dict(u_type, u_id)
    }), 201


@chat_v1_bp.route('/api/v1/chat/messages/<int:msg_id>', methods=['PUT'])
def api_edit_message(msg_id):
    """
    PUT /api/v1/chat/messages/:id
    Edits user's own message within permitted boundaries.
    """
    u_type, u_id, u_obj, err = get_current_user_identity()
    if err:
        return err

    msg = ChatMessage.query.get(msg_id)
    if not msg or msg.deleted_at:
        return jsonify({"success": False, "message": "الرسالة غير موجودة"}), 404

    # Verify message ownership
    if msg.sender_type != u_type or msg.sender_id != u_id:
        return jsonify({"success": False, "message": "لا يمكنك تعديل رسائل الآخرين"}), 403

    data = request.get_json() or {}
    raw_body = data.get('body', '')
    if not raw_body or not str(raw_body).strip():
        return jsonify({"success": False, "message": "نص الرسالة لا يمكن أن يكون فارغاً"}), 400

    clean_body = sanitize_message_text(str(raw_body))
    msg.body = clean_body
    msg.edited_at = datetime.utcnow()
    db.session.commit()

    return jsonify({
        "success": True,
        "message": msg.to_dict(u_type, u_id)
    }), 200


@chat_v1_bp.route('/api/v1/chat/messages/<int:msg_id>', methods=['DELETE'])
def api_delete_message(msg_id):
    """
    DELETE /api/v1/chat/messages/:id
    Soft-deletes user's own message.
    """
    u_type, u_id, u_obj, err = get_current_user_identity()
    if err:
        return err

    msg = ChatMessage.query.get(msg_id)
    if not msg:
        return jsonify({"success": False, "message": "الرسالة غير موجودة"}), 404

    if msg.sender_type != u_type or msg.sender_id != u_id:
        if u_type != 'admin':
            return jsonify({"success": False, "message": "لا يمكنك حذف رسائل الآخرين"}), 403

    msg.deleted_at = datetime.utcnow()
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "تم حذف الرسالة بنجاح"
    }), 200


@chat_v1_bp.route('/api/v1/chat/conversations/<int:conv_id>/read', methods=['POST'])
def api_mark_conversation_read(conv_id):
    """
    POST /api/v1/chat/conversations/:id/read
    Updates caller's last_read_at timestamp and marks incoming messages as read.
    """
    u_type, u_id, u_obj, err = get_current_user_identity()
    if err:
        return err

    conv = Conversation.query.get(conv_id)
    if not conv:
        return jsonify({"success": False, "message": "المحادثة غير موجودة"}), 404

    part = ConversationParticipant.query.filter_by(
        conversation_id=conv_id, participant_type=u_type, participant_id=u_id
    ).first()

    if not part and u_type == 'candidate':
        team_parts = ConversationParticipant.query.filter_by(conversation_id=conv_id, participant_type='team').all()
        for tp in team_parts:
            team = Teams.query.get(tp.participant_id)
            if is_candidate_team_member(team, u_obj):
                part = tp
                break

    if part:
        part.last_read_at = datetime.utcnow()
        ChatMessage.query.filter(
            ChatMessage.conversation_id == conv.id,
            ~((ChatMessage.sender_type == u_type) & (ChatMessage.sender_id == u_id))
        ).update({"is_read": True}, synchronize_session=False)
        db.session.commit()

    return jsonify({
        "success": True,
        "message": "تم تحديث حالة القراءة بنجاح"
    }), 200


@chat_v1_bp.route('/api/v1/chat/unread-count', methods=['GET'])
def api_get_unread_count():
    """
    GET /api/v1/chat/unread-count
    Returns real aggregated total unread messages count for authenticated caller.
    """
    u_type, u_id, u_obj, err = get_current_user_identity()
    if err:
        return err

    direct_parts = ConversationParticipant.query.filter_by(
        participant_type=u_type, participant_id=u_id
    ).all()

    total_unread = 0

    for part in direct_parts:
        q = ChatMessage.query.filter(
            ChatMessage.conversation_id == part.conversation_id,
            ChatMessage.deleted_at.is_(None),
            ~((ChatMessage.sender_type == u_type) & (ChatMessage.sender_id == u_id))
        )
        if part.last_read_at:
            q = q.filter(ChatMessage.created_at > part.last_read_at)
        total_unread += q.count()

    # If candidate, also calculate unread in candidate's teams
    if u_type == 'candidate':
        all_my_team_ids = get_candidate_team_ids(u_obj)
        if all_my_team_ids:
            team_parts = ConversationParticipant.query.filter(
                ConversationParticipant.participant_type == 'team',
                ConversationParticipant.participant_id.in_(all_my_team_ids)
            ).all()
            for tp in team_parts:
                tq = ChatMessage.query.filter(
                    ChatMessage.conversation_id == tp.conversation_id,
                    ChatMessage.deleted_at.is_(None),
                    ~((ChatMessage.sender_type == 'candidate') & (ChatMessage.sender_id == u_id))
                )
                if tp.last_read_at:
                    tq = tq.filter(ChatMessage.created_at > tp.last_read_at)
                total_unread += tq.count()

    return jsonify({
        "success": True,
        "unreadCount": total_unread
    }), 200
