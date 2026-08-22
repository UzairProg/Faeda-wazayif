# ==============================================================================
# الوظيفة الأساسية للملف: وحدة (Blueprint) للمسارات الأساسية والعامة في الموقع.
# الروابط أو الميزات: مسار الصفحة الرئيسية (/) ومسارات الصفحات العامة الأخرى.
# المتطلبات الخاصة: يعتمد على دوال render_template لعرض قوالب HTML.
# ==============================================================================
import os
import json
from flask import Blueprint, render_template, jsonify, current_app, request, flash, redirect, url_for, session
from app import db
from services.ticket import Ticket

# Create a Blueprint named 'core'
core_bp = Blueprint('core', __name__)

@core_bp.route('/')
def home():
    """Render the homepage for the application."""
    return render_template('new_design/index.html')


@core_bp.route('/news')
def news():
    """
    Render the news feed page containing mock posts, trending topics, 
    and suggested profiles to follow.
    """
    mock_posts = [
        {
            "id": 1,
            "user": {
                "name": "Ahmed Al-Farsi",
                "title": "Senior Product Designer at Google",
                "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
                "isVerified": True
            },
            "content": "Just published a new guide on how to optimize your resume for ATS systems in Saudi Arabia! 🇸🇦 The landscape is changing rapidly with AI screening. Make sure your keywords are perfectly aligned with the job description.\n\nKey takeaways:\n1. Avoid complex formatting\n2. Use standard job titles\n3. Quantify your achievements\n\nWhat's your biggest struggle with resume writing?",
            "image": "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=400&fit=crop",
            "time": "2h ago",
            "likes": 1245,
            "comments": 84,
            "reposts": 32,
            "isLiked": False
        },
        {
            "id": 2,
            "user": {
                "name": "Sarah Chen",
                "title": "Talent Acquisition Lead at Aramco",
                "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
                "isVerified": True
            },
            "content": "We are actively hiring for our new AI Research division in Dhahran! 🚀\n\nLooking for:\n- Senior ML Engineers\n- Data Scientists\n- AI Product Managers\n\nIf you're passionate about pushing the boundaries of technology in the energy sector, let's connect. Drop a comment below or send me your resume directly through the Faeda platform.",
            "time": "5h ago",
            "likes": 3421,
            "comments": 215,
            "reposts": 412,
            "isLiked": True
        }
    ]

    trending_topics = [
        {"id": 1, "title": "#SaudiVision2030", "posts": "45.2K posts"},
        {"id": 2, "title": "AI in Recruitment", "posts": "12.5K posts"},
        {"id": 3, "title": "Remote Work in MENA", "posts": "8.2K posts"}
    ]

    suggested_people = [
        {"id": 1, "name": "Dr. Khalid", "title": "AI Researcher", "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"},
        {"id": 2, "name": "Reem Fahad", "title": "HR Director", "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"}
    ]

    return render_template('new_design/news.html', posts=mock_posts, trending_topics=trending_topics, suggested_people=suggested_people)


@core_bp.route('/support')
def support():
    return render_template('new_design/support.html')

@core_bp.route('/support/ticket', methods=['GET', 'POST'])
def support_ticket():
    if request.method == 'POST':
        email = request.form.get('email')
        subject = request.form.get('subject')
        description = request.form.get('description')
        
        if not all([email, subject, description]):
            flash('يرجى ملء جميع الحقول المطلوبة', 'error')
            return redirect(url_for('core.support_ticket'))
            
        new_ticket = Ticket(email=email, subject=subject, description=description)
        db.session.add(new_ticket)
        db.session.commit()
        
        flash('تم إرسال تذكرتك بنجاح، سيقوم الدعم الفني بالتواصل معك قريباً ويمكنك متابعتها باستخدام بريدك الإلكتروني.', 'success')
        # Clear suspension session data if exists
        session.pop('suspended_email', None)
        session.pop('suspension_reason', None)
        return redirect(url_for('core.home'))
        
    return render_template('new_design/ticket_form.html')

@core_bp.route('/support/track', methods=['GET', 'POST'])
def track_ticket():
    tickets = None
    if request.method == 'POST':
        email = request.form.get('email')
        
        if email:
            tickets = Ticket.query.filter_by(email=email).order_by(Ticket.created_at.desc()).all()
            if not tickets:
                flash('لم يتم العثور على أي تذاكر مرتبطة بهذا البريد الإلكتروني.', 'error')
        else:
            flash('يرجى إدخال البريد الإلكتروني.', 'error')
            
    return render_template('new_design/track_ticket.html', tickets=tickets)

@core_bp.route('/report', methods=['POST'])
def submit_report():
    from services.report import Report
    target_type = request.form.get('target_type')
    target_id = request.form.get('target_id')
    reason = request.form.get('reason')
    description = request.form.get('description')
    
    reporter_type = None
    reporter_id = None
    
    if session.get('session_customer'):
        reporter_type = 'customer'
        reporter_id = session.get('user_id')
    elif session.get('session_company'):
        reporter_type = 'company'
        reporter_id = session.get('company_id')
        
    if not reporter_type:
        flash('يجب تسجيل الدخول لتقديم بلاغ.', 'error')
        return redirect(request.referrer or url_for('core.home'))
        
    new_report = Report(
        reporter_type=reporter_type,
        reporter_id=reporter_id,
        target_type=target_type,
        target_id=target_id,
        reason=reason,
        description=description
    )
    db.session.add(new_report)
    db.session.commit()
    
    flash('تم إرسال البلاغ بنجاح وهو بانتظار المراجعة.', 'success')
    return redirect(request.referrer or url_for('core.home'))

@core_bp.route('/suspended')
def suspended_account():
    email = session.get('suspended_email')
    reason = session.get('suspension_reason')
    
    if not email:
        return redirect(url_for('customer.login'))
        
    return render_template('new_design/suspended.html', email=email, reason=reason)


@core_bp.route('/faeda-details')
def faeda_details():
    return render_template('new_design/faeda_details.html')

@core_bp.route('/api/countries')
def api_countries():
    file_path = os.path.join(current_app.root_path, '..', 'data', 'countries.json')
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            countries = json.load(f)
        return jsonify(countries)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@core_bp.route('/api/cities/<country>')
def api_cities(country):
    file_path = os.path.join(current_app.root_path, '..', 'data', 'cities.json')
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            cities_data = json.load(f)
        cities = cities_data.get(country, [])
        return jsonify(cities)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==============================================================================
# JSON REST API ENDPOINTS FOR FRONTEND PUBLIC TEAMS MARKETPLACE
# ==============================================================================

def extract_team_capabilities(t):
    caps = []
    if t.special_program:
        parts = [p.strip() for p in t.special_program.replace('،', ',').split(',') if p.strip()]
        caps.extend(parts)
    if t.semi_special_program and t.semi_special_program not in caps:
        caps.append(t.semi_special_program)
    if t.general_program and t.general_program not in caps:
        caps.append(t.general_program)
    return caps[:8]


def serialize_team_summary(t):
    from services.teams import Teams
    capabilities = extract_team_capabilities(t)
    member_count = len(t.members) if t.members else 0

    return {
        "id": str(t.id),
        "name": t.team_name,
        "about": t.about or "",
        "achievements": t.achievements or "",
        "generalProgram": t.general_program,
        "semiSpecialProgram": t.semi_special_program,
        "specialProgram": t.special_program,
        "logoUrl": t.img if t.img else None,
        "memberCount": member_count,
        "capabilities": capabilities,
        "location": "الرياض" if not t.members else (t.members[0].government or "السعودية"),
        "isRemote": True,
        "creationDate": t.creation_date.isoformat() if t.creation_date else None,
    }


def serialize_team_detail(t):
    from app.blueprints.jobs import serialize_job_summary
    base = serialize_team_summary(t)

    public_members = []
    if t.members:
        for m in t.members:
            public_members.append({
                "id": str(m.id),
                "name": m.fullname,
                "role": m.preferred_field_of_work or m.about or "عضو فريق",
                "avatarUrl": m.img if m.img else None,
                "skills": [m.preferred_field_of_work] if m.preferred_field_of_work else [],
            })

    associated_jobs = []
    if t.jobs:
        associated_jobs = [serialize_job_summary(j) for j in t.jobs if j.status == 'approved']

    return {
        **base,
        "members": public_members,
        "jobs": associated_jobs,
    }


@core_bp.route('/api/v1/teams/suggestions')
def api_get_team_suggestions():
    from services.teams import Teams
    q = request.args.get('q', '').strip()

    if not q or len(q) < 2:
        return jsonify({"suggestions": []})

    teams = Teams.query.filter(
        db.or_(
            Teams.team_name.ilike(f"%{q}%"),
            Teams.about.ilike(f"%{q}%"),
            Teams.general_program.ilike(f"%{q}%"),
            Teams.special_program.ilike(f"%{q}%")
        )
    ).limit(8).all()

    suggestions = []
    for t in teams:
        caps = extract_team_capabilities(t)
        sub = caps[0] if caps else "فريق تخصصي"
        suggestions.append({
            "id": str(t.id),
            "label": t.team_name,
            "subLabel": sub,
            "category": "فريق",
            "value": t.team_name,
            "location": "السعودية",
        })

    return jsonify({"suggestions": suggestions})


@core_bp.route('/api/v1/teams')
def api_get_teams():
    from services.teams import Teams
    q = request.args.get('q', '').strip()
    location = request.args.get('location', '').strip()
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('page_size', 10))

    query = Teams.query

    if q:
        query = query.filter(
            db.or_(
                Teams.team_name.ilike(f"%{q}%"),
                Teams.about.ilike(f"%{q}%"),
                Teams.general_program.ilike(f"%{q}%"),
                Teams.semi_special_program.ilike(f"%{q}%"),
                Teams.special_program.ilike(f"%{q}%"),
                Teams.achievements.ilike(f"%{q}%")
            )
        )

    paginated = query.order_by(Teams.id.desc()).paginate(page=page, per_page=page_size, error_out=False)

    return jsonify({
        "teams": [serialize_team_summary(t) for t in paginated.items],
        "total": paginated.total,
        "page": paginated.page,
        "pageSize": paginated.per_page,
        "totalPages": paginated.pages,
    })


@core_bp.route('/api/v1/teams/<int:team_id>')
def api_get_team_detail(team_id):
    from services.teams import Teams
    t = Teams.query.get(team_id)
    if not t:
        return jsonify({"message": "الفريق غير موجود"}), 404

    return jsonify(serialize_team_detail(t))


@core_bp.route('/api/v1/contact', methods=['POST'])
def api_submit_contact():
    data = request.get_json() or request.form
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip()
    reason = (data.get('reason') or '').strip()
    message = (data.get('message') or data.get('description') or '').strip()

    if not email or not message:
        return jsonify({"success": False, "message": "يرجى ملء جميع الحقول المطلوبة (البريد والرسالة)"}), 400

    subject_text = f"[{reason}] {name}" if (reason and name) else (reason or name or "استفسار جديد عبر الموقع")

    try:
        new_ticket = Ticket(email=email, subject=subject_text, description=message)
        db.session.add(new_ticket)
        db.session.commit()
        return jsonify({"success": True, "message": "تم استلام رسالتك بنجاح. شكرًا لتواصلك معنا."})
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": "تعذر إرسال الرسالة حالياً. حاول مرة أخرى."}), 500