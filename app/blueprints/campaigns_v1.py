# ==============================================================================
# app/blueprints/campaigns_v1.py
# ==============================================================================
# Comprehensive REST API Blueprint for LinkedIn-Style Marketing & Recruitment Campaigns
# Includes complete Social Interactions: Like, Comment, Share, Save, Notifications & Analytics
# ==============================================================================

from datetime import datetime
from flask import Blueprint, request, jsonify, session
from sqlalchemy import desc, or_, and_, func

from app import db
from services.campaign import (
    Campaign, CampaignCandidate, CampaignJob,
    CampaignLike, CampaignComment, CampaignShare,
    CampaignSave, CampaignView, Notification
)
from services.company import Company
from services.customer import Customers
from services.university import University
from services.admin import Admin
from services.job import Jobs

campaigns_v1_bp = Blueprint('campaigns_v1_bp', __name__)


# ── Helper: Authenticated User Identity Resolution ────────────────────────────

def get_current_user_identity():
    """
    Resolves the current authenticated user context across all account types:
    Company, University, Candidate, Admin.
    Prioritizes explicit Bearer tokens and X-Persona-Role headers for robust test/switch support.
    """
    # 0. Check explicit X-Persona-Role or Bearer demo token first
    persona = request.headers.get('X-Persona-Role')
    auth_header = request.headers.get('Authorization', '')
    if not persona and auth_header.startswith('Bearer demo-'):
        persona = auth_header.replace('Bearer demo-', '').replace('-token', '').strip()

    if persona in ('company', 'university', 'candidate', 'admin'):
        if persona == 'university':
            univ = University.query.first()
            return {
                "user_type": "university",
                "user_id": univ.id if univ else 1,
                "name": univ.name_ar if univ else "جامعة الملك فيصل (جامعة)",
                "avatar": f"/download_image/{univ.logo}" if (univ and univ.logo) else "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=150&h=150&fit=crop",
                "title": univ.institution_type if univ else "وكالة الشؤون الأكاديمية والبحث العلمي",
                "username": f"univ-{univ.id if univ else 1}",
                "is_admin": False
            }
        elif persona == 'company':
            comp = Company.query.first()
            return {
                "user_type": "company",
                "user_id": comp.id if comp else 1,
                "name": comp.company_arabic_name or comp.company_english_name if comp else "أرامكو الرقمية (شركة)",
                "avatar": f"/download_image/{comp.company_logo}" if (comp and comp.company_logo) else "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop",
                "title": comp.company_field if comp else "إدارة استقطاب المواهب والتوظيف الوطني",
                "username": f"company-{comp.id if comp else 1}",
                "is_admin": False
            }
        elif persona == 'candidate':
            cand = Customers.query.first()
            return {
                "user_type": "candidate",
                "user_id": cand.id if cand else 1,
                "name": cand.fullname if cand else "عمر المنصور (باحث عن عمل)",
                "avatar": f"/download_image/{cand.img}" if (cand and cand.img) else "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
                "title": cand.preferred_field_of_work if cand else "مهندس برمجيات وذكاء اصطناعي",
                "username": cand.user_id if cand else f"candidate-{cand.id if cand else 1}",
                "is_admin": False
            }
        elif persona == 'admin':
            return {
                "user_type": "admin",
                "user_id": 1,
                "name": "مدير النظام (Admin)",
                "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
                "title": "إدارة منصة فائدة وظائف",
                "username": "admin",
                "is_admin": True
            }

    # 1. Candidate session
    if session.get('session_customer') or session.get('user_id'):
        cand_id = session.get('user_id') or 1
        cand = Customers.query.get(cand_id)
        return {
            "user_type": "candidate",
            "user_id": cand.id if cand else cand_id,
            "name": cand.fullname if (cand and cand.fullname) else "عمر المنصور (باحث عن عمل)",
            "avatar": f"/download_image/{cand.img}" if (cand and cand.img) else "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
            "title": cand.preferred_field_of_work if (cand and cand.preferred_field_of_work) else "مهندس برمجيات وذكاء اصطناعي",
            "username": cand.user_id if (cand and cand.user_id) else f"candidate-{cand_id}",
            "is_admin": False
        }

    # 2. Company session
    if session.get('session_company') or session.get('company_id'):
        comp_id = session.get('company_id') or 1
        comp = Company.query.get(comp_id)
        return {
            "user_type": "company",
            "user_id": comp.id if comp else comp_id,
            "name": comp.company_arabic_name or comp.company_english_name if comp else "أرامكو الرقمية (شركة)",
            "avatar": f"/download_image/{comp.company_logo}" if (comp and comp.company_logo) else "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop",
            "title": comp.company_field if (comp and comp.company_field) else "إدارة استقطاب المواهب والتوظيف الوطني",
            "username": f"company-{comp_id}",
            "is_admin": False
        }

    # 3. University session
    if session.get('session_university') or session.get('university_id'):
        univ_id = session.get('university_id') or 1
        univ = University.query.get(univ_id)
        return {
            "user_type": "university",
            "user_id": univ.id if univ else univ_id,
            "name": univ.name_ar or univ.name_en if univ else "جامعة الملك فيصل (جامعة)",
            "avatar": f"/download_image/{univ.logo}" if (univ and univ.logo) else "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=150&h=150&fit=crop",
            "title": univ.institution_type if (univ and univ.institution_type) else "وكالة الشؤون الأكاديمية والبحث العلمي",
            "username": f"univ-{univ_id}",
            "is_admin": False
        }

    # 4. Admin session
    if session.get('admin_id'):
        admin_id = session.get('admin_id')
        admin = Admin.query.get(admin_id)
        return {
            "user_type": "admin",
            "user_id": admin.id if admin else admin_id,
            "name": admin.name if (admin and admin.name) else "مدير النظام (Admin)",
            "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
            "title": "إدارة منصة فائدة وظائف",
            "username": "admin",
            "is_admin": True
        }

    # Guest / Unauthenticated
    return {
        "user_type": None,
        "user_id": None,
        "name": "زائر",
        "avatar": None,
        "title": None,
        "username": None,
        "is_admin": False
    }

    # Guest / Unauthenticated
    return {
        "user_type": None,
        "user_id": None,
        "name": "زائر",
        "avatar": None,
        "title": None,
        "username": None,
        "is_admin": False
    }


def get_campaign_owner(campaign):
    """Return (owner_type, owner_id) for a campaign."""
    if campaign.account_type == 'university' and campaign.university_id:
        return 'university', campaign.university_id
    elif campaign.account_type == 'candidate' and campaign.customer_id:
        return 'candidate', campaign.customer_id
    elif campaign.company_id:
        return 'company', campaign.company_id
    return campaign.account_type or 'company', 1


# ── 1. Campaign & Posts Feed (GET) ───────────────────────────────────────────

@campaigns_v1_bp.route('/api/v1/posts', methods=['GET'])
@campaigns_v1_bp.route('/api/v1/campaigns', methods=['GET'])
def get_campaigns_feed():
    """
    Return paginated, targeted, and filtered campaigns/posts from the database.
    Query params: search, category, account_type, post_type, target_audience_role, sort, page, pageSize.
    """
    user_ctx = get_current_user_identity()
    
    search = request.args.get('search', '').strip().lower()
    category = request.args.get('category', '').strip()
    account_type = request.args.get('account_type', 'all').strip().lower()
    post_type = request.args.get('post_type', 'all').strip()
    target_audience_role = request.args.get('target_audience_role', 'all').strip().lower()
    sort_by = request.args.get('sort', 'newest')

    query = Campaign.query.filter(Campaign.status != 'archived')

    # Filter by account type
    if account_type and account_type != 'all':
        query = query.filter_by(account_type=account_type)

    # Filter by post/campaign objective sub-type
    if post_type and post_type != 'all':
        query = query.filter_by(post_type=post_type)

    # Filter by target audience role ("Matched for you")
    if target_audience_role and target_audience_role != 'all':
        query = query.filter(
            or_(
                Campaign.target_roles.is_(None),
                Campaign.target_roles == '',
                Campaign.target_roles.ilike(f"%{target_audience_role}%")
            )
        )

    # Filter by category
    if category and category not in ('all', 'الكل'):
        query = query.filter(
            or_(
                Campaign.category == category,
                Campaign.tags.ilike(f"%{category}%")
            )
        )

    # Filter by search keyword
    if search:
        query = query.filter(
            or_(
                Campaign.title.ilike(f"%{search}%"),
                Campaign.description.ilike(f"%{search}%"),
                Campaign.tagline.ilike(f"%{search}%"),
                Campaign.author_name.ilike(f"%{search}%"),
                Campaign.tags.ilike(f"%{search}%")
            )
        )

    # Sorting
    if sort_by == 'popular':
        query = query.outerjoin(CampaignView).group_by(Campaign.id).order_by(desc(func.count(CampaignView.id)), desc(Campaign.created_at))
    elif sort_by == 'likes':
        query = query.outerjoin(CampaignLike).group_by(Campaign.id).order_by(desc(func.count(CampaignLike.id)), desc(Campaign.created_at))
    else:  # newest
        query = query.order_by(desc(Campaign.created_at))

    page = max(1, request.args.get('page', 1, type=int))
    page_size = min(50, max(1, request.args.get('pageSize', 12, type=int)))
    
    paginated = query.paginate(page=page, per_page=page_size, error_out=False)
    posts = [c.to_dict(current_user=user_ctx) for c in paginated.items]

    # Dynamic categories from DB
    all_campaigns = Campaign.query.filter(Campaign.status != 'archived').all()
    categories_dict = {}
    for c in all_campaigns:
        cat_name = c.category or "عام"
        categories_dict[cat_name] = categories_dict.get(cat_name, 0) + 1

    categories_list = [{"name": "الكل", "key": "all", "count": len(all_campaigns)}]
    for cat_name, cnt in categories_dict.items():
        categories_list.append({"name": cat_name, "key": cat_name, "count": cnt})

    trending_topics = [
        {"id": 1, "title": "#SaudiVision2030", "posts": "45.2K", "category": "رؤية 2030"},
        {"id": 2, "title": "#University_Job_Fairs", "posts": "34.1K", "category": "معارض التوظيف"},
        {"id": 3, "title": "#Aramco_AI_Recruitment", "posts": "28.4K", "category": "استقطاب كفاءات"},
        {"id": 4, "title": "#ATS_Optimization", "posts": "22.6K", "category": "السير الذاتية وATS"},
        {"id": 5, "title": "#Tech_Innovations_2026", "posts": "19.8K", "category": "الابتكار والمشاريع"},
    ]

    suggested_authors = [
        {
            "name": "جامعة الملك فهد (KFUPM)",
            "title": "مركز التميز لأبحاث الذكاء الاصطناعي",
            "avatar": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=100&h=100&fit=crop",
            "username": "kfupm-ai-research",
            "articlesCount": 18,
            "isVerified": True,
            "accountType": "university",
        },
        {
            "name": "شركة علم (Elm)",
            "title": "إدارة استقطاب المواهب الوطنية",
            "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop",
            "username": "elm-careers",
            "articlesCount": 24,
            "isVerified": True,
            "accountType": "company",
        },
        {
            "name": "أحمد الفارسي",
            "title": "خبير استقطاب المواهب التقنية",
            "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
            "username": "ahmed-alfarsi",
            "articlesCount": 14,
            "isVerified": True,
            "accountType": "candidate",
        },
    ]

    return jsonify({
        "success": True,
        "posts": posts,
        "total": paginated.total,
        "page": page,
        "pageSize": page_size,
        "totalPages": max(1, paginated.pages),
        "categories": categories_list,
        "trendingTopics": trending_topics,
        "suggestedAuthors": suggested_authors
    }), 200


# ── 2. Campaign Detail (GET) ─────────────────────────────────────────────────

@campaigns_v1_bp.route('/api/v1/posts/<int:campaign_id>', methods=['GET'])
@campaigns_v1_bp.route('/api/v1/campaigns/<int:campaign_id>', methods=['GET'])
def get_single_campaign(campaign_id):
    """
    Return full campaign detail with nested comments, replies, and like/save interaction states.
    Automatically increments view counter.
    """
    c = Campaign.query.get(campaign_id)
    if not c:
        return jsonify({"message": "الحملة أو المنشور غير موجود", "error": "Not Found"}), 404

    user_ctx = get_current_user_identity()

    # Record view
    try:
        ip = request.remote_addr
        view = CampaignView(
            campaign_id=c.id,
            user_type=user_ctx.get('user_type'),
            user_id=user_ctx.get('user_id'),
            ip_address=ip
        )
        db.session.add(view)
        db.session.commit()
    except Exception:
        db.session.rollback()

    post_dict = c.to_dict(current_user=user_ctx)

    # Fetch top-level comments and nest replies
    top_comments = CampaignComment.query.filter_by(campaign_id=c.id, parent_id=None).order_by(CampaignComment.created_at.desc()).all()
    post_dict["comments"] = [comm.to_dict(current_user=user_ctx) for comm in top_comments]

    # Related campaigns
    related_camps = Campaign.query.filter(
        Campaign.id != c.id,
        or_(Campaign.account_type == c.account_type, Campaign.category == c.category)
    ).order_by(desc(Campaign.created_at)).limit(3).all()

    related = [rc.to_dict(current_user=user_ctx) for rc in related_camps]

    return jsonify({
        "success": True,
        "post": post_dict,
        "campaign": post_dict,
        "related": related
    }), 200


# ── 3. Create Campaign / Post (POST) ─────────────────────────────────────────

@campaigns_v1_bp.route('/api/v1/posts', methods=['POST'])
@campaigns_v1_bp.route('/api/v1/campaigns', methods=['POST'])
def create_campaign_post():
    """
    Create a new marketing, recruitment, or academic campaign.
    Enforces authentication & sets appropriate ownership (Company, University, Candidate).
    """
    user_ctx = get_current_user_identity()
    if not user_ctx.get('user_id'):
        return jsonify({"error": "يجب تسجيل الدخول لإنشاء ونشر حملة", "code": "UNAUTHORIZED"}), 401

    data = request.get_json() or {}
    title = (data.get('title') or '').strip()
    content = (data.get('content') or data.get('description') or '').strip()

    if not title or not content:
        return jsonify({"error": "عنوان الحملة وتفاصيل المحتوى مطلوبان لنشر الحملة", "code": "BAD_REQUEST"}), 400

    account_type = (data.get('accountType') or user_ctx['user_type'] or 'company').strip().lower()
    post_type = (data.get('postType') or ('research_paper' if account_type == 'university' else 'hiring_general' if account_type == 'company' else 'portfolio_showcase')).strip()
    category = (data.get('category') or ('الأبحاث والابتكار' if account_type == 'university' else 'استقطاب كفاءات' if account_type == 'company' else 'المشاريع والأعمال')).strip()
    summary = (data.get('summary') or data.get('tagline') or (content[:140] + "...")).strip()

    # Target audience
    target_aud = data.get('targetAudience') or {}
    roles = target_aud.get('roles') or data.get('target_roles', [])
    if isinstance(roles, list):
        target_roles_str = ", ".join(roles)
    else:
        target_roles_str = str(roles)

    specs = target_aud.get('targetSpecializations') or data.get('target_skills', [])
    if isinstance(specs, list):
        target_specs_str = ", ".join(specs)
    else:
        target_specs_str = str(specs)

    locs = target_aud.get('targetLocations') or [data.get('target_location', 'جميع مناطق المملكة')]
    if isinstance(locs, list):
        target_locs_str = ", ".join(locs)
    else:
        target_locs_str = str(locs)

    tags = data.get('tags') or [category]
    if isinstance(tags, list):
        tags_str = ", ".join(tags)
    else:
        tags_str = str(tags)

    # ── Budget Fields (optional) ──
    budget_type = (data.get('budgetType') or data.get('budget_type') or 'free').strip()
    total_budget = data.get('totalBudget') or data.get('total_budget')
    daily_budget = data.get('dailyBudget') or data.get('daily_budget')
    currency = (data.get('currency') or 'SAR').strip().upper()
    duration_days = data.get('durationDays') or data.get('campaign_duration_days')

    # Validate budgets
    if total_budget is not None:
        try:
            total_budget = float(total_budget)
            if total_budget < 0:
                total_budget = 0.0
        except (ValueError, TypeError):
            total_budget = None

    if daily_budget is not None:
        try:
            daily_budget = float(daily_budget)
            if daily_budget < 0:
                daily_budget = 0.0
        except (ValueError, TypeError):
            daily_budget = None

    if duration_days is not None:
        try:
            duration_days = int(duration_days)
            if duration_days < 1:
                duration_days = 1
        except (ValueError, TypeError):
            duration_days = None

    # ── Estimated / Proposed Reach Calculation (NEVER guaranteed, always labeled as estimate) ──
    # Formula: Base audience pool * targeting_factor * budget_multiplier
    # This is a rough estimate — clearly marked as isEstimate=True in the model
    base_pool = 5000  # platform audience baseline
    num_roles = len([r for r in (target_roles_str or "").split(",") if r.strip()])
    num_locs = len([l for l in (target_locs_str or "").split(",") if l.strip()])
    targeting_breadth = max(1, (num_roles + num_locs) * 0.5)
    effective_budget = (total_budget or 0) + ((daily_budget or 0) * (duration_days or 1))
    budget_multiplier = 1.0 + (effective_budget / 500.0) if effective_budget > 0 else 1.0
    est_reach = int(base_pool * targeting_breadth * budget_multiplier)
    proposed_reach_min = max(100, int(est_reach * 0.7))
    proposed_reach_max = int(est_reach * 1.4)

    # Ownership bindings
    company_id = user_ctx['user_id'] if user_ctx['user_type'] == 'company' else None
    university_id = user_ctx['user_id'] if user_ctx['user_type'] == 'university' else None
    customer_id = user_ctx['user_id'] if user_ctx['user_type'] == 'candidate' else None

    # Fallback if admin or general
    if not company_id and not university_id and not customer_id:
        if account_type == 'company':
            company_id = 1
        elif account_type == 'university':
            university_id = 1
        else:
            customer_id = 1

    c = Campaign(
        company_id=company_id,
        university_id=university_id,
        customer_id=customer_id,
        account_type=account_type,
        post_type=post_type,
        category=category,
        title=title,
        tagline=summary,
        description=content,
        banner_url=data.get('coverImage') or data.get('banner_url') or "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop",
        media_type=data.get('mediaType', 'image'),
        video_url=data.get('videoUrl'),
        cta_text=data.get('ctaText'),
        cta_url=data.get('ctaUrl'),
        target_roles=target_roles_str,
        target_skills=target_specs_str,
        target_specializations=target_specs_str,
        target_location=locs[0] if locs else "المملكة العربية السعودية",
        target_locations=target_locs_str,
        experience_level=data.get('experience_level', 'Mid level'),
        work_type=data.get('work_type', 'Full-time'),
        min_salary=data.get('min_salary'),
        max_salary=data.get('max_salary'),
        tags=tags_str,
        status="active",
        outreach_template=data.get('outreach_template'),
        author_name=data.get('authorName') or user_ctx['name'],
        author_title=data.get('authorTitle') or user_ctx['title'],
        author_avatar=user_ctx['avatar'],
        author_username=user_ctx['username'],
        is_verified=True,
        # ── Budget & Estimated Reach ──
        budget_type=budget_type,
        total_budget=total_budget,
        daily_budget=daily_budget,
        currency=currency,
        campaign_duration_days=duration_days,
        proposed_reach_min=proposed_reach_min,
        proposed_reach_max=proposed_reach_max,
    )

    db.session.add(c)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "تم إطلاق ونشر الحملة بنجاح!",
        "post": c.to_dict(current_user=user_ctx),
        "campaign": c.to_dict(current_user=user_ctx)
    }), 201


# ── 4. LIKE / UNLIKE Campaign (POST) ─────────────────────────────────────────

@campaigns_v1_bp.route('/api/v1/posts/<int:campaign_id>/like', methods=['POST'])
@campaigns_v1_bp.route('/api/v1/campaigns/<int:campaign_id>/like', methods=['POST'])
def toggle_like_campaign(campaign_id):
    """
    Toggle like/unlike on a campaign.
    Prevents duplicate likes with database unique constraints.
    Creates a notification for the campaign owner if liked.
    """
    user_ctx = get_current_user_identity()
    if not user_ctx.get('user_id'):
        return jsonify({"error": "يجب تسجيل الدخول للإعجاب بالحملة", "code": "UNAUTHORIZED"}), 401

    c = Campaign.query.get_or_404(campaign_id)
    ut = user_ctx['user_type']
    uid = user_ctx['user_id']

    existing_like = CampaignLike.query.filter_by(campaign_id=c.id, user_type=ut, user_id=uid).first()

    if existing_like:
        # Unlike
        db.session.delete(existing_like)
        db.session.commit()
        return jsonify({
            "success": True,
            "isLiked": False,
            "likes": c.likes.count(),
            "message": "تم إلغاء الإعجاب"
        }), 200
    else:
        # Like
        new_like = CampaignLike(
            campaign_id=c.id,
            user_type=ut,
            user_id=uid,
            user_name=user_ctx['name']
        )
        db.session.add(new_like)

        # Notify campaign owner (if not liking own campaign)
        owner_type, owner_id = get_campaign_owner(c)
        if (owner_type != ut or owner_id != uid) and owner_id:
            notif = Notification(
                recipient_type=owner_type,
                recipient_id=owner_id,
                actor_type=ut,
                actor_id=uid,
                actor_name=user_ctx['name'],
                actor_avatar=user_ctx['avatar'],
                action_type="like",
                campaign_id=c.id,
                title="إعجاب جديد بحملتك",
                message=f"أبدى {user_ctx['name']} إعجابه بحملتك: {c.title[:45]}..."
            )
            db.session.add(notif)

        db.session.commit()
        return jsonify({
            "success": True,
            "isLiked": True,
            "likes": c.likes.count(),
            "message": "تم الإعجاب بالحملة!"
        }), 200


# ── 5. Add Comment or Reply (POST) ───────────────────────────────────────────

@campaigns_v1_bp.route('/api/v1/posts/<int:campaign_id>/comments', methods=['POST'])
@campaigns_v1_bp.route('/api/v1/campaigns/<int:campaign_id>/comments', methods=['POST'])
def add_campaign_comment(campaign_id):
    """
    Post a comment or nested reply on a campaign.
    Supports comment replies via parent_id.
    Creates notification for campaign owner or comment author being replied to.
    """
    user_ctx = get_current_user_identity()
    if not user_ctx.get('user_id'):
        return jsonify({"error": "يجب تسجيل الدخول للتعليق على الحملة", "code": "UNAUTHORIZED"}), 401

    c = Campaign.query.get_or_404(campaign_id)
    data = request.get_json() or {}
    text = (data.get('text') or data.get('content') or '').strip()

    if not text:
        return jsonify({"error": "نص التعليق مطلوب", "code": "BAD_REQUEST"}), 400

    parent_id = data.get('parent_id') or data.get('parentId')
    if parent_id:
        parent_id = int(parent_id)
        # Verify parent comment belongs to this campaign
        parent_comm = CampaignComment.query.filter_by(id=parent_id, campaign_id=c.id).first()
        if not parent_comm:
            return jsonify({"error": "التعليق الأصلي غير موجود", "code": "NOT_FOUND"}), 404
    else:
        parent_comm = None

    ut = user_ctx['user_type']
    uid = user_ctx['user_id']

    comment = CampaignComment(
        campaign_id=c.id,
        user_type=ut,
        user_id=uid,
        author_name=user_ctx['name'],
        author_avatar=user_ctx['avatar'],
        author_title=user_ctx['title'],
        author_username=user_ctx['username'],
        content=text,
        parent_id=parent_id
    )
    db.session.add(comment)
    db.session.flush()

    # Notification handling
    if parent_comm:
        # Reply Notification
        if parent_comm.user_type != ut or parent_comm.user_id != uid:
            notif = Notification(
                recipient_type=parent_comm.user_type,
                recipient_id=parent_comm.user_id,
                actor_type=ut,
                actor_id=uid,
                actor_name=user_ctx['name'],
                actor_avatar=user_ctx['avatar'],
                action_type="reply",
                campaign_id=c.id,
                comment_id=comment.id,
                title="رد جديد على تعليقك",
                message=f"رد {user_ctx['name']} على تعليقك في حملة: {c.title[:40]}..."
            )
            db.session.add(notif)
    else:
        # Campaign Owner Notification
        owner_type, owner_id = get_campaign_owner(c)
        if (owner_type != ut or owner_id != uid) and owner_id:
            notif = Notification(
                recipient_type=owner_type,
                recipient_id=owner_id,
                actor_type=ut,
                actor_id=uid,
                actor_name=user_ctx['name'],
                actor_avatar=user_ctx['avatar'],
                action_type="comment",
                campaign_id=c.id,
                comment_id=comment.id,
                title="تعليق جديد على حملتك",
                message=f"علّق {user_ctx['name']} على حملتك: {text[:50]}..."
            )
            db.session.add(notif)

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "تم إضافة التعليق بنجاح!",
        "comment": comment.to_dict(current_user=user_ctx),
        "commentsCount": c.comments.count()
    }), 201


# ── 6. Edit Comment (PUT) ───────────────────────────────────────────────────

@campaigns_v1_bp.route('/api/v1/posts/comments/<int:comment_id>', methods=['PUT'])
@campaigns_v1_bp.route('/api/v1/campaigns/comments/<int:comment_id>', methods=['PUT'])
def edit_campaign_comment(comment_id):
    """
    Allow users to edit only their own comments.
    Enforces permission check in backend.
    """
    user_ctx = get_current_user_identity()
    if not user_ctx.get('user_id'):
        return jsonify({"error": "يجب تسجيل الدخول", "code": "UNAUTHORIZED"}), 401

    comment = CampaignComment.query.get_or_404(comment_id)

    # Permission: Only comment author can edit
    if comment.user_type != user_ctx['user_type'] or comment.user_id != user_ctx['user_id']:
        return jsonify({"error": "غير مصرح لك بتعديل هذا التعليق", "code": "FORBIDDEN"}), 403

    data = request.get_json() or {}
    text = (data.get('text') or data.get('content') or '').strip()
    if not text:
        return jsonify({"error": "نص التعليق لا يمكن أن يكون فارغاً", "code": "BAD_REQUEST"}), 400

    comment.content = text
    comment.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "تم تحديث التعليق بنجاح!",
        "comment": comment.to_dict(current_user=user_ctx)
    }), 200


# ── 7. Delete Comment (DELETE) ───────────────────────────────────────────────

@campaigns_v1_bp.route('/api/v1/posts/comments/<int:comment_id>', methods=['DELETE'])
@campaigns_v1_bp.route('/api/v1/campaigns/comments/<int:comment_id>', methods=['DELETE'])
def delete_campaign_comment(comment_id):
    """
    Delete comment:
    - Comment author can delete their own comment.
    - Campaign owner can moderate/delete any comment on their campaign.
    - Admin can moderate/delete any comment.
    Enforces backend permissions.
    """
    user_ctx = get_current_user_identity()
    if not user_ctx.get('user_id'):
        return jsonify({"error": "يجب تسجيل الدخول", "code": "UNAUTHORIZED"}), 401

    comment = CampaignComment.query.get_or_404(comment_id)
    c = comment.campaign
    owner_type, owner_id = get_campaign_owner(c)

    is_author = (comment.user_type == user_ctx['user_type'] and comment.user_id == user_ctx['user_id'])
    is_campaign_owner = (owner_type == user_ctx['user_type'] and owner_id == user_ctx['user_id'])
    is_admin = user_ctx.get('is_admin', False)

    if not (is_author or is_campaign_owner or is_admin):
        return jsonify({"error": "غير مصرح لك بحذف هذا التعليق", "code": "FORBIDDEN"}), 403

    campaign_id = c.id
    db.session.delete(comment)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "تم حذف التعليق بنجاح.",
        "commentsCount": CampaignComment.query.filter_by(campaign_id=campaign_id).count()
    }), 200


# ── 8. SHARE / REPOST Campaign (POST) ────────────────────────────────────────

@campaigns_v1_bp.route('/api/v1/posts/<int:campaign_id>/share', methods=['POST'])
@campaigns_v1_bp.route('/api/v1/campaigns/<int:campaign_id>/share', methods=['POST'])
def share_campaign(campaign_id):
    """
    Share/repost a campaign with optional quote.
    Tracks share count, retains original creator, creates notification.
    """
    user_ctx = get_current_user_identity()
    if not user_ctx.get('user_id'):
        return jsonify({"error": "يجب تسجيل الدخول لمشاركة الحملة", "code": "UNAUTHORIZED"}), 401

    c = Campaign.query.get_or_404(campaign_id)
    data = request.get_json() or {}
    quote = (data.get('quote') or '').strip() or None

    ut = user_ctx['user_type']
    uid = user_ctx['user_id']

    share = CampaignShare(
        campaign_id=c.id,
        user_type=ut,
        user_id=uid,
        user_name=user_ctx['name'],
        user_avatar=user_ctx['avatar'],
        user_title=user_ctx['title'],
        repost_quote=quote
    )
    db.session.add(share)

    # Notify campaign owner if not self
    owner_type, owner_id = get_campaign_owner(c)
    if (owner_type != ut or owner_id != uid) and owner_id:
        notif = Notification(
            recipient_type=owner_type,
            recipient_id=owner_id,
            actor_type=ut,
            actor_id=uid,
            actor_name=user_ctx['name'],
            actor_avatar=user_ctx['avatar'],
            action_type="share",
            campaign_id=c.id,
            title="مشاركة جديدة لحملتك",
            message=f"قام {user_ctx['name']} بمشاركة حملتك: {c.title[:45]}..."
        )
        db.session.add(notif)

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "تمت مشاركة الحملة بنجاح!",
        "sharesCount": c.shares.count(),
        "share": share.to_dict()
    }), 201


# ── 9. SAVE / UNSAVE Campaign (POST) ─────────────────────────────────────────

@campaigns_v1_bp.route('/api/v1/posts/<int:campaign_id>/save', methods=['POST'])
@campaigns_v1_bp.route('/api/v1/campaigns/<int:campaign_id>/save', methods=['POST'])
def toggle_save_campaign(campaign_id):
    """
    Save or unsave a campaign for bookmarking.
    Unique constraint prevents duplicates.
    """
    user_ctx = get_current_user_identity()
    if not user_ctx.get('user_id'):
        return jsonify({"error": "يجب تسجيل الدخول لحفظ الحملة", "code": "UNAUTHORIZED"}), 401

    c = Campaign.query.get_or_404(campaign_id)
    ut = user_ctx['user_type']
    uid = user_ctx['user_id']

    existing_save = CampaignSave.query.filter_by(campaign_id=c.id, user_type=ut, user_id=uid).first()

    if existing_save:
        # Unsave
        db.session.delete(existing_save)
        db.session.commit()
        return jsonify({
            "success": True,
            "isSaved": False,
            "savesCount": c.saves.count(),
            "message": "تمت إزالة الحملة من المحفوظات"
        }), 200
    else:
        # Save
        new_save = CampaignSave(
            campaign_id=c.id,
            user_type=ut,
            user_id=uid
        )
        db.session.add(new_save)
        db.session.commit()
        return jsonify({
            "success": True,
            "isSaved": True,
            "savesCount": c.saves.count(),
            "message": "تم حفظ الحملة بنجاح في قائمتك المفضلة!"
        }), 200


# ── 10. Saved Campaigns List (GET) ───────────────────────────────────────────

@campaigns_v1_bp.route('/api/v1/posts/saved', methods=['GET'])
@campaigns_v1_bp.route('/api/v1/campaigns/saved', methods=['GET'])
def get_saved_campaigns():
    """
    Return all campaigns bookmarked/saved by the active user.
    """
    user_ctx = get_current_user_identity()
    if not user_ctx.get('user_id'):
        return jsonify({"error": "يجب تسجيل الدخول", "code": "UNAUTHORIZED"}), 401

    ut = user_ctx['user_type']
    uid = user_ctx['user_id']

    saves = CampaignSave.query.filter_by(user_type=ut, user_id=uid).order_by(CampaignSave.created_at.desc()).all()
    posts = [s.campaign.to_dict(current_user=user_ctx) for s in saves if s.campaign]

    return jsonify({
        "success": True,
        "posts": posts,
        "campaigns": posts,
        "total": len(posts)
    }), 200


# ── 11. Campaign Analytics (GET) ─────────────────────────────────────────────

@campaigns_v1_bp.route('/api/v1/campaigns/<int:campaign_id>/analytics', methods=['GET'])
def get_campaign_analytics(campaign_id):
    """
    Return engagement analytics for campaign owners:
    - Total Views
    - Likes
    - Comments
    - Shares
    - Saves
    - Engagement Rate (%)
    - Recent interactions breakdown
    """
    user_ctx = get_current_user_identity()
    if not user_ctx.get('user_id'):
        return jsonify({"error": "يجب تسجيل الدخول", "code": "UNAUTHORIZED"}), 401

    c = Campaign.query.get_or_404(campaign_id)
    owner_type, owner_id = get_campaign_owner(c)

    is_owner = (owner_type == user_ctx['user_type'] and owner_id == user_ctx['user_id'])
    is_admin = user_ctx.get('is_admin', False)

    if not (is_owner or is_admin):
        return jsonify({"error": "غير مصرح لك بالاطلاع على تحليلات هذه الحملة", "code": "FORBIDDEN"}), 403

    analytics = c.get_analytics()
    return jsonify({
        "success": True,
        "analytics": analytics
    }), 200


# ── 12. User Published Campaigns (GET) ───────────────────────────────────────

@campaigns_v1_bp.route('/api/v1/campaigns/by-user', methods=['GET'])
@campaigns_v1_bp.route('/api/v1/posts/by-user', methods=['GET'])
def get_user_published_campaigns():
    """
    Return all campaigns published by a specific user or organization.
    Used on Company, University, and Candidate profile pages.
    """
    user_ctx = get_current_user_identity()
    user_type = request.args.get('user_type') or user_ctx.get('user_type')
    user_id = request.args.get('user_id', type=int) or user_ctx.get('user_id')

    if not user_type or not user_id:
        return jsonify({"campaigns": [], "posts": []}), 200

    query = Campaign.query.filter(Campaign.status != 'archived')

    if user_type == 'university':
        query = query.filter_by(university_id=user_id)
    elif user_type == 'candidate':
        query = query.filter_by(customer_id=user_id)
    elif user_type == 'company':
        query = query.filter_by(company_id=user_id)
    else:
        query = query.filter_by(account_type=user_type)

    campaigns = query.order_by(desc(Campaign.created_at)).all()
    serialized = [c.to_dict(include_stats=True, current_user=user_ctx) for c in campaigns]

    return jsonify({
        "success": True,
        "campaigns": serialized,
        "posts": serialized,
        "total": len(serialized)
    }), 200


# ── 13. Notifications (GET, PATCH, POST) ─────────────────────────────────────

@campaigns_v1_bp.route('/api/v1/notifications', methods=['GET'])
def get_user_notifications():
    """
    Return recent notifications for the logged-in user with unread counter.
    """
    user_ctx = get_current_user_identity()
    if not user_ctx.get('user_id'):
        return jsonify({"notifications": [], "unreadCount": 0}), 200

    ut = user_ctx['user_type']
    uid = user_ctx['user_id']

    notifs = Notification.query.filter_by(recipient_type=ut, recipient_id=uid).order_by(desc(Notification.created_at)).limit(30).all()
    unread_count = sum(1 for n in notifs if not n.is_read)

    return jsonify({
        "success": True,
        "notifications": [n.to_dict() for n in notifs],
        "unreadCount": unread_count
    }), 200


@campaigns_v1_bp.route('/api/v1/notifications/<int:notification_id>/read', methods=['PATCH', 'POST'])
def mark_notification_as_read(notification_id):
    """Mark a single notification as read."""
    user_ctx = get_current_user_identity()
    if not user_ctx.get('user_id'):
        return jsonify({"error": "يجب تسجيل الدخول", "code": "UNAUTHORIZED"}), 401

    notif = Notification.query.get_or_404(notification_id)
    if notif.recipient_type != user_ctx['user_type'] or notif.recipient_id != user_ctx['user_id']:
        return jsonify({"error": "غير مصرح", "code": "FORBIDDEN"}), 403

    notif.is_read = True
    notif.read_at = datetime.utcnow()
    db.session.commit()

    return jsonify({"success": True, "message": "تم تحديد الإشعار كمقروء"}), 200


@campaigns_v1_bp.route('/api/v1/notifications/read-all', methods=['POST'])
def mark_all_notifications_as_read():
    """Mark all notifications for active user as read."""
    user_ctx = get_current_user_identity()
    if not user_ctx.get('user_id'):
        return jsonify({"error": "يجب تسجيل الدخول", "code": "UNAUTHORIZED"}), 401

    ut = user_ctx['user_type']
    uid = user_ctx['user_id']

    Notification.query.filter_by(recipient_type=ut, recipient_id=uid, is_read=False).update(
        {"is_read": True, "read_at": datetime.utcnow()}
    )
    db.session.commit()

    return jsonify({"success": True, "message": "تم تحديد جميع الإشعارات كمقروءة"}), 200


# ── 14. Existing Company Recruitment Funnel Endpoints (Preserved) ────────────

def get_current_company():
    comp_id = session.get('company_id')
    if comp_id:
        return Company.query.get(comp_id)
    return Company.query.first()


@campaigns_v1_bp.route('/api/v1/company/campaigns', methods=['GET'])
def get_company_campaigns():
    comp = get_current_company()
    if not comp:
        return jsonify({"campaigns": []}), 200

    campaigns = Campaign.query.filter(
        or_(Campaign.company_id == comp.id, Campaign.account_type == 'company')
    ).order_by(desc(Campaign.created_at)).all()
    
    return jsonify({
        "success": True,
        "campaigns": [c.to_dict(include_stats=True) for c in campaigns]
    }), 200


@campaigns_v1_bp.route('/api/v1/company/campaigns/<int:campaign_id>', methods=['GET'])
def get_company_campaign_detail(campaign_id):
    c = Campaign.query.get(campaign_id)
    if not c:
        return jsonify({"error": "Campaign not found"}), 404

    linked_jobs = [j.to_dict() for j in c.jobs]
    return jsonify({
        "success": True,
        "campaign": c.to_dict(include_stats=True),
        "linked_jobs": linked_jobs
    }), 200


@campaigns_v1_bp.route('/api/v1/company/campaigns', methods=['POST'])
def create_company_campaign():
    comp = get_current_company()
    if not comp:
        return jsonify({"error": "Company not authenticated"}), 401

    data = request.get_json() or {}
    title = data.get('title', '').strip()
    if not title:
        return jsonify({"error": "Campaign title is required"}), 400

    target_roles = data.get('target_roles', [])
    if isinstance(target_roles, list):
        target_roles = ", ".join(target_roles)

    target_skills = data.get('target_skills', [])
    if isinstance(target_skills, list):
        target_skills = ", ".join(target_skills)

    c = Campaign(
        company_id=comp.id,
        account_type="company",
        post_type="hiring_general",
        category="استقطاب كفاءات",
        title=title,
        tagline=data.get('tagline', ''),
        description=data.get('description', ''),
        banner_url=data.get('banner_url') or "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=400&fit=crop",
        target_roles=target_roles,
        target_skills=target_skills,
        target_location=data.get('target_location', 'Saudi Arabia'),
        experience_level=data.get('experience_level', 'Mid level'),
        work_type=data.get('work_type', 'Full-time'),
        min_salary=data.get('min_salary'),
        max_salary=data.get('max_salary'),
        status="active",
        outreach_template=data.get('outreach_template', 'مرحباً، يسعدنا دعوتك للانضمام إلى حملتنا الوظيفية.')
    )
    db.session.add(c)
    db.session.commit()

    return jsonify({
        "success": True,
        "campaign": c.to_dict(include_stats=True)
    }), 201


@campaigns_v1_bp.route('/api/v1/company/campaigns/<int:campaign_id>/candidates', methods=['GET'])
def get_campaign_candidates(campaign_id):
    c = Campaign.query.get(campaign_id)
    if not c:
        return jsonify({"error": "Campaign not found"}), 404

    stage = request.args.get('stage')
    q = CampaignCandidate.query.filter_by(campaign_id=campaign_id)
    if stage:
        q = q.filter_by(stage=stage)

    candidates = q.order_by(desc(CampaignCandidate.match_score)).all()
    return jsonify({
        "success": True,
        "candidates": [cand.to_dict() for cand in candidates]
    }), 200


@campaigns_v1_bp.route('/api/v1/company/campaigns/<int:campaign_id>/match', methods=['POST'])
def run_talent_scan(campaign_id):
    c = Campaign.query.get(campaign_id)
    if not c:
        return jsonify({"error": "Campaign not found"}), 404

    existing_cids = {cc.customer_id for cc in c.candidates}
    customers = Customers.query.filter(~Customers.id.in_(existing_cids) if existing_cids else True).limit(5).all()

    added = 0
    for cust in customers:
        cc = CampaignCandidate(
            campaign_id=c.id,
            customer_id=cust.id,
            stage="discovered",
            match_score=85 + (cust.id % 12),
            notes="مطابقة ذكية عبر محرك الذكاء الاصطناعي لفائدة"
        )
        db.session.add(cc)
        added += 1

    db.session.commit()
    return jsonify({
        "success": True,
        "newly_added_count": added,
        "message": f"تمت مطابقة وإضافة {added} مرشحين بنجاح."
    }), 200


@campaigns_v1_bp.route('/api/v1/company/campaigns/<int:campaign_id>/outreach', methods=['POST'])
def send_outreach(campaign_id):
    data = request.get_json() or {}
    cids = data.get('candidate_ids', [])
    count = 0
    for cid in cids:
        cc = CampaignCandidate.query.filter_by(campaign_id=campaign_id, customer_id=cid).first()
        if cc:
            cc.stage = "contacted"
            cc.outreach_sent_at = datetime.utcnow()
            count += 1
    db.session.commit()
    return jsonify({
        "success": True,
        "contacted_count": count,
        "message": f"تم إرسال دعوة التواصل إلى {count} مرشح بنجاح."
    }), 200


@campaigns_v1_bp.route('/api/v1/company/campaigns/<int:campaign_id>/candidates/<int:candidate_id>/stage', methods=['PATCH'])
def update_candidate_stage(campaign_id, candidate_id):
    data = request.get_json() or {}
    stage = data.get('stage')
    notes = data.get('notes')

    cc = CampaignCandidate.query.filter_by(campaign_id=campaign_id, customer_id=candidate_id).first()
    if not cc:
        return jsonify({"error": "Candidate not found in campaign"}), 404

    if stage:
        cc.stage = stage
    if notes:
        cc.notes = notes
    cc.last_activity_at = datetime.utcnow()
    db.session.commit()

    return jsonify({
        "success": True,
        "candidate": cc.to_dict()
    }), 200


@campaigns_v1_bp.route('/api/v1/candidate/campaign-invites', methods=['GET'])
def get_candidate_invites():
    cust_id = session.get('customer_id') or session.get('user_id') or 1
    memberships = CampaignCandidate.query.filter_by(customer_id=cust_id).all()
    invites = []
    for m in memberships:
        c = m.campaign
        if not c:
            continue
        invites.append({
            "id": m.id,
            "campaign_id": c.id,
            "campaign_title": c.title,
            "company_name": c.company.company_english_name if c.company else "Company",
            "company_logo": f"/download_image/{c.company.company_logo}" if c.company and c.company.company_logo else None,
            "match_score": m.match_score,
            "stage": m.stage,
            "tagline": c.tagline or "",
            "location": c.target_location or "Saudi Arabia",
            "salary_range": f"{c.min_salary} - {c.max_salary} SAR" if c.min_salary else "تنافسي",
            "outreach_sent_at": m.outreach_sent_at.isoformat() if m.outreach_sent_at else None
        })
    return jsonify({"success": True, "invites": invites}), 200


@campaigns_v1_bp.route('/api/v1/candidate/campaign-invites/<int:campaign_id>/respond', methods=['POST'])
def respond_invite(campaign_id):
    cust_id = session.get('customer_id') or session.get('user_id') or 1
    data = request.get_json() or {}
    action = data.get('action')  # 'accept' or 'decline'
    m = CampaignCandidate.query.filter_by(campaign_id=campaign_id, customer_id=cust_id).first()
    if m:
        m.stage = "replied" if action == "accept" else "rejected"
        db.session.commit()
    return jsonify({
        "success": True,
        "message": "تم قبول الدعوة بنجاح!" if action == "accept" else "تم الاعتذار عن الدعوة.",
        "stage": m.stage if m else "replied"
    }), 200
