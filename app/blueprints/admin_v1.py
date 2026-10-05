# ==============================================================================
# app/blueprints/admin_v1.py
# ==============================================================================
# REST API v1 for Faeda Admin Governance Console
# Complete, production-ready, RBAC-guarded endpoints for:
#   - Dashboard Analytics & KPIs
#   - User Management (Candidates, Companies, Universities, Admins)
#   - Job Postings Moderation (Approve, Reject, Delete)
#   - System Audit Logs
#   - Abuse Reports / Moderation
#   - Dynamic Platform Settings
# ==============================================================================

import json
from functools import wraps
from datetime import datetime
from flask import Blueprint, request, jsonify, session
from sqlalchemy import or_, desc

from app import db
from services.admin import (
    Admin, ROLE_SUPER_ADMIN, ROLE_SUPPORT_MODERATOR,
    ROLE_CONTENT_MODERATOR, ROLE_FINANCE_ADMIN, ROLE_PERMISSIONS, ROLE_LABELS
)
from services.customer import Customers
from services.company import Company
from services.university import University
from services.job import Jobs
from services.teams import Teams
from services.audit_log import AuditLog
from services.report import Report
from services.system_settings import SystemSetting, SETTING_KEYS
from services.subscription import Subscription
from services.auth_token import decode_auth_token
from services.ticket import Ticket
from services.job_category import JobCategory
from services.job_filters import City, JobType, Specialty

admin_v1_bp = Blueprint('admin_v1', __name__, url_prefix='/api/v1/admin')


# ------------------------------------------------------------------------------
# AUTHENTICATION & RBAC DECORATOR
# ------------------------------------------------------------------------------

def get_current_admin():
    """Extract authenticated active Admin from session or Bearer token."""
    # 1. From session
    admin_id = session.get('admin_id')
    if admin_id:
        admin = Admin.query.get(admin_id)
        if admin and admin.is_active:
            return admin

    # 2. From Authorization header Bearer token
    auth_header = request.headers.get('Authorization', '')
    token = None
    if auth_header.startswith('Bearer '):
        token = auth_header[7:].strip()
    elif auth_header:
        token = auth_header.strip()

    if token:
        payload = decode_auth_token(token)
        if payload and payload.get('role') == 'admin':
            aid = payload.get('id') or payload.get('user_id')
            if aid:
                admin = Admin.query.get(aid)
                if admin and admin.is_active:
                    return admin

    return None


def admin_api_required(permission=None):
    """Decorator ensuring request has a valid, active Admin caller."""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            admin = get_current_admin()
            if not admin:
                return jsonify({
                    "success": False,
                    "message": "غير مصرح. يرجى تسجيل الدخول بحساب مدير نظام نشط."
                }), 401

            if permission and not admin.has_permission(permission):
                return jsonify({
                    "success": False,
                    "message": "ليس لديك الصلاحيات الكافية لتنفيذ هذا الإجراء."
                }), 403

            return f(admin, *args, **kwargs)
        return decorated_function
    return decorator


def log_action(admin, action, target_type=None, target_id=None, details=None):
    """Helper to log administrative action to AuditLog."""
    try:
        AuditLog.log_action(
            admin_id=admin.id,
            action=action,
            target_type=target_type,
            target_id=target_id,
            details=details,
            ip_address=request.remote_addr
        )
    except Exception as e:
        print(f"[Admin AuditLog Error]: {e}", flush=True)


# ------------------------------------------------------------------------------
# 1. DASHBOARD ANALYTICS & METRICS
# ------------------------------------------------------------------------------

@admin_v1_bp.route('/dashboard', methods=['GET'])
@admin_api_required('dashboard')
def get_dashboard_stats(admin):
    """Return platform KPI metrics, pending queues, and recent activity."""
    try:
        # User counts
        total_candidates = Customers.query.filter(Customers.deleted_at.is_(None)).count()
        suspended_candidates = Customers.query.filter(
            Customers.deleted_at.is_(None),
            Customers.status == 'suspended'
        ).count()

        total_companies = Company.query.filter(Company.deleted_at.is_(None)).count()
        verified_companies = Company.query.filter(
            Company.deleted_at.is_(None),
            Company.is_verified.is_(True)
        ).count()
        pending_companies = Company.query.filter(
            Company.deleted_at.is_(None),
            Company.is_verified.is_(False)
        ).count()

        total_universities = University.query.count()
        total_teams = Teams.query.count()

        # Job metrics
        total_jobs = Jobs.query.count()
        pending_jobs = Jobs.query.filter_by(status='pending').count()
        active_jobs = Jobs.query.filter_by(status='approved').count()

        # Reports & Subscriptions
        total_reports = Report.query.count()
        pending_reports = Report.query.filter_by(status='pending').count()
        total_subs = Subscription.query.count() if hasattr(Subscription, 'query') else 0

        # Recent pending jobs for quick approval
        recent_pending_jobs = Jobs.query.filter_by(status='pending').order_by(
            desc(Jobs.date_posted)
        ).limit(5).all()

        pending_jobs_list = []
        for j in recent_pending_jobs:
            comp = Company.query.get(j.company_id) if j.company_id else None
            pending_jobs_list.append({
                "id": j.id,
                "title": j.title,
                "company_id": j.company_id,
                "company_name": comp.company_english_name if comp else "Unknown Company",
                "company_logo": comp.company_logo if comp else None,
                "town": j.town,
                "job_type": j.job_type,
                "created_at": j.date_posted.isoformat() if j.date_posted else None
            })

        # Recent audit logs
        recent_logs = AuditLog.query.order_by(desc(AuditLog.created_at)).limit(10).all()
        logs_list = []
        for log in recent_logs:
            adm = Admin.query.get(log.admin_id) if log.admin_id else None
            logs_list.append({
                "id": log.id,
                "admin_name": adm.username if adm else "Admin",
                "action": log.action,
                "action_label": log.action_label,
                "target_type": log.target_type,
                "target_type_label": log.target_type_label,
                "target_id": log.target_id,
                "details": log.details_dict,
                "ip_address": log.ip_address,
                "created_at": log.created_at.isoformat() if log.created_at else None
            })

        # Recent reports
        recent_reports = Report.query.order_by(desc(Report.created_at)).limit(5).all()
        reports_list = []
        for r in recent_reports:
            reports_list.append({
                "id": r.id,
                "reporter_type": r.reporter_type,
                "reporter_id": r.reporter_id,
                "target_type": r.target_type,
                "target_id": r.target_id,
                "reason": r.reason,
                "status": r.status,
                "created_at": r.created_at.isoformat() if r.created_at else None
            })

        return jsonify({
            "success": True,
            "admin": {
                "id": admin.id,
                "username": admin.username,
                "email": admin.email,
                "role": admin.role,
                "role_label": ROLE_LABELS.get(admin.role, admin.role)
            },
            "stats": {
                "total_users": total_candidates + total_companies + total_universities,
                "total_candidates": total_candidates,
                "suspended_candidates": suspended_candidates,
                "total_companies": total_companies,
                "verified_companies": verified_companies,
                "pending_companies": pending_companies,
                "total_universities": total_universities,
                "total_teams": total_teams,
                "total_jobs": total_jobs,
                "active_jobs": active_jobs,
                "pending_jobs": pending_jobs,
                "total_reports": total_reports,
                "pending_reports": pending_reports,
                "total_subscriptions": total_subs
            },
            "pending_jobs": pending_jobs_list,
            "recent_logs": logs_list,
            "recent_reports": reports_list
        })
    except Exception as e:
        return jsonify({"success": False, "message": f"حدث خطأ أثناء جلب التحليلات: {str(e)}"}), 500


# ------------------------------------------------------------------------------
# 2. USER MANAGEMENT (Candidates, Companies, Universities, Admins)
# ------------------------------------------------------------------------------

@admin_v1_bp.route('/users', methods=['GET'])
@admin_api_required('users')
def list_users(admin):
    """Unified user listing with filtering by type, status, and search."""
    user_type = request.args.get('type', 'all')  # all | candidate | company | university | admin
    status_filter = request.args.get('status', 'all')  # all | active | suspended
    search = request.args.get('q', '').strip()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)

    users_list = []

    # 1. Candidates
    if user_type in ('all', 'candidate'):
        q_cand = Customers.query.filter(Customers.deleted_at.is_(None))
        if status_filter != 'all':
            q_cand = q_cand.filter(Customers.status == status_filter)
        if search:
            q_cand = q_cand.filter(
                or_(
                    Customers.fullname.ilike(f'%{search}%'),
                    Customers.email.ilike(f'%{search}%'),
                    Customers.mobile.ilike(f'%{search}%')
                )
            )
        for c in q_cand.limit(100).all():
            users_list.append({
                "id": c.id,
                "type": "candidate",
                "name": c.fullname,
                "email": c.email,
                "mobile": c.mobile,
                "location": f"{c.government or ''} {c.country or ''}".strip(),
                "status": c.status or 'active',
                "is_verified": bool(c.is_verified),
                "created_at": c.graduation_date.isoformat() if getattr(c, 'graduation_date', None) else None,
                "avatar": c.img
            })

    # 2. Companies
    if user_type in ('all', 'company'):
        q_comp = Company.query.filter(Company.deleted_at.is_(None))
        if status_filter != 'all':
            q_comp = q_comp.filter(Company.status == status_filter)
        if search:
            q_comp = q_comp.filter(
                or_(
                    Company.company_english_name.ilike(f'%{search}%'),
                    Company.company_arabic_name.ilike(f'%{search}%'),
                    Company.company_email.ilike(f'%{search}%')
                )
            )
        for comp in q_comp.limit(100).all():
            users_list.append({
                "id": comp.id,
                "type": "company",
                "name": comp.company_arabic_name or comp.company_english_name,
                "email": comp.company_email,
                "mobile": comp.company_mobile or comp.hr_mobile,
                "location": f"{comp.state or ''} {comp.country or ''}".strip(),
                "status": comp.status or 'active',
                "is_verified": bool(comp.is_verified),
                "created_at": comp.timestamp.isoformat() if comp.timestamp else None,
                "avatar": comp.company_logo
            })

    # 3. Universities
    if user_type in ('all', 'university'):
        q_uni = University.query
        if status_filter != 'all':
            q_uni = q_uni.filter(University.status == status_filter)
        if search:
            q_uni = q_uni.filter(
                or_(
                    University.name_ar.ilike(f'%{search}%'),
                    University.name_en.ilike(f'%{search}%'),
                    University.email.ilike(f'%{search}%')
                )
            )
        for u in q_uni.limit(50).all():
            users_list.append({
                "id": u.id,
                "type": "university",
                "name": u.name_ar or u.name_en,
                "email": u.email,
                "mobile": u.phone,
                "location": f"{u.location or ''} {u.country or ''}".strip(),
                "status": u.status or 'active',
                "is_verified": bool(u.is_verified),
                "created_at": u.timestamp.isoformat() if u.timestamp else None,
                "avatar": u.logo
            })

    # 4. Admins (Super Admin only can list all admins)
    if user_type in ('admin') or (user_type == 'all' and admin.role == ROLE_SUPER_ADMIN):
        q_adm = Admin.query
        if search:
            q_adm = q_adm.filter(
                or_(
                    Admin.username.ilike(f'%{search}%'),
                    Admin.email.ilike(f'%{search}%')
                )
            )
        for a in q_adm.all():
            users_list.append({
                "id": a.id,
                "type": "admin",
                "name": a.username,
                "email": a.email,
                "mobile": None,
                "location": "الإدارة العامة",
                "status": 'active' if a.is_active else 'suspended',
                "is_verified": True,
                "created_at": a.created_at.isoformat() if a.created_at else None,
                "avatar": a.photo,
                "admin_role": a.role,
                "admin_role_label": ROLE_LABELS.get(a.role, a.role)
            })

    # Manual slicing for pagination
    total_count = len(users_list)
    start_idx = (page - 1) * per_page
    end_idx = start_idx + per_page
    paginated_items = users_list[start_idx:end_idx]

    return jsonify({
        "success": True,
        "users": paginated_items,
        "total": total_count,
        "page": page,
        "per_page": per_page,
        "total_pages": (total_count + per_page - 1) // per_page if per_page else 1
    })


@admin_v1_bp.route('/users/<string:target_type>/<int:target_id>/status', methods=['PATCH'])
@admin_api_required('users.actions')
def update_user_status(admin, target_type, target_id):
    """Toggle user active / suspended status."""
    data = request.get_json() or {}
    new_status = data.get('status')
    reason = data.get('reason', '')

    if new_status not in ('active', 'suspended', 'banned'):
        return jsonify({"success": False, "message": "حالة غير صالحة"}), 400

    target_name = ""
    if target_type == 'candidate':
        user = Customers.query.get_or_404(target_id)
        user.status = new_status
        user.suspension_reason = reason if new_status != 'active' else None
        target_name = user.fullname
    elif target_type == 'company':
        user = Company.query.get_or_404(target_id)
        user.status = new_status
        user.suspension_reason = reason if new_status != 'active' else None
        target_name = user.company_english_name or user.company_arabic_name
    elif target_type == 'university':
        user = University.query.get_or_404(target_id)
        user.status = new_status
        target_name = user.name_ar or user.name_en
    elif target_type == 'admin':
        if admin.role != ROLE_SUPER_ADMIN:
            return jsonify({"success": False, "message": "المدير العام فقط يمكنه تغيير حالة المديرين"}), 403
        if target_id == admin.id:
            return jsonify({"success": False, "message": "لا يمكنك تعطيل حسابك الخاص"}), 400
        user = Admin.query.get_or_404(target_id)
        user.is_active = (new_status == 'active')
        target_name = user.username
    else:
        return jsonify({"success": False, "message": "نوع المستخدم غير معروف"}), 400

    db.session.commit()

    action_name = 'activate_user' if new_status == 'active' else 'suspend_user'
    log_action(
        admin=admin,
        action=action_name,
        target_type=target_type,
        target_id=target_id,
        details={"status": new_status, "name": target_name, "reason": reason}
    )

    return jsonify({
        "success": True,
        "message": f"تم تحديث حالة {target_name} إلى '{new_status}' بنجاح",
        "status": new_status
    })


@admin_v1_bp.route('/users/<string:target_type>/<int:target_id>/verify', methods=['PATCH'])
@admin_api_required('companies.verify')
def toggle_user_verification(admin, target_type, target_id):
    """Toggle employer / candidate / university verification badge."""
    data = request.get_json() or {}
    is_verified = bool(data.get('is_verified', True))

    target_name = ""
    if target_type == 'company':
        comp = Company.query.get_or_404(target_id)
        comp.is_verified = is_verified
        comp.verified_at = datetime.utcnow() if is_verified else None
        target_name = comp.company_english_name or comp.company_arabic_name
    elif target_type == 'candidate':
        cand = Customers.query.get_or_404(target_id)
        cand.is_verified = is_verified
        cand.verified_at = datetime.utcnow() if is_verified else None
        target_name = cand.fullname
    elif target_type == 'university':
        uni = University.query.get_or_404(target_id)
        uni.is_verified = is_verified
        uni.verified_at = datetime.utcnow() if is_verified else None
        target_name = uni.name_ar or uni.name_en
    else:
        return jsonify({"success": False, "message": "نوع المستخدم غير مدعوم للتوثيق"}), 400

    db.session.commit()

    log_action(
        admin=admin,
        action='verify_company' if target_type == 'company' else 'verify_user',
        target_type=target_type,
        target_id=target_id,
        details={"is_verified": is_verified, "name": target_name}
    )

    return jsonify({
        "success": True,
        "message": f"تم {'توثيق' if is_verified else 'إلغاء توثيق'} {target_name} بنجاح",
        "is_verified": is_verified
    })


@admin_v1_bp.route('/users/<string:target_type>/<int:target_id>', methods=['DELETE'])
@admin_api_required('users.crud')
def delete_user(admin, target_type, target_id):
    """Soft delete or remove a user record."""
    target_name = ""
    if target_type == 'candidate':
        cand = Customers.query.get_or_404(target_id)
        cand.deleted_at = datetime.utcnow()
        cand.status = 'suspended'
        target_name = cand.fullname
    elif target_type == 'company':
        comp = Company.query.get_or_404(target_id)
        comp.deleted_at = datetime.utcnow()
        comp.status = 'suspended'
        target_name = comp.company_english_name or comp.company_arabic_name
    elif target_type == 'university':
        uni = University.query.get_or_404(target_id)
        target_name = uni.name_ar or uni.name_en
        db.session.delete(uni)
    elif target_type == 'admin':
        if admin.role != ROLE_SUPER_ADMIN:
            return jsonify({"success": False, "message": "المدير العام فقط يمكنه حذف حسابات المديرين"}), 403
        if target_id == admin.id:
            return jsonify({"success": False, "message": "لا يمكنك حذف حسابك الحالي"}), 400
        adm = Admin.query.get_or_404(target_id)
        target_name = adm.username
        db.session.delete(adm)
    else:
        return jsonify({"success": False, "message": "نوع الكيان غير صالح للحذف"}), 400

    db.session.commit()

    log_action(
        admin=admin,
        action='delete_user',
        target_type=target_type,
        target_id=target_id,
        details={"name": target_name}
    )

    return jsonify({
        "success": True,
        "message": f"تم حذف {target_name} بنجاح"
    })


# ------------------------------------------------------------------------------
# 2.1 EXPLICIT COMPANY VERIFICATION ENDPOINT (/api/v1/admin/companies)
# ------------------------------------------------------------------------------

@admin_v1_bp.route('/companies', methods=['GET'])
@admin_api_required('companies.verify')
def list_companies_endpoint(admin):
    """Direct endpoint to list companies with pending/verified filters."""
    verified_filter = request.args.get('verified', 'all')
    search = request.args.get('q', '').strip()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 25, type=int)

    query = Company.query.filter(Company.deleted_at.is_(None))
    if verified_filter == 'true':
        query = query.filter(Company.is_verified.is_(True))
    elif verified_filter == 'false':
        query = query.filter(Company.is_verified.is_(False))

    if search:
        query = query.filter(
            or_(
                Company.company_english_name.ilike(f'%{search}%'),
                Company.company_arabic_name.ilike(f'%{search}%'),
                Company.company_email.ilike(f'%{search}%')
            )
        )

    pagination = query.order_by(desc(Company.timestamp)).paginate(
        page=page, per_page=per_page, error_out=False
    )

    companies_list = []
    for c in pagination.items:
        companies_list.append({
            "id": c.id,
            "name": c.company_arabic_name or c.company_english_name,
            "company_english_name": c.company_english_name,
            "company_arabic_name": c.company_arabic_name,
            "email": c.company_email,
            "mobile": c.company_mobile or c.hr_mobile,
            "location": f"{c.state or ''} {c.country or ''}".strip(),
            "status": c.status or 'active',
            "is_verified": bool(c.is_verified),
            "verified_at": c.verified_at.isoformat() if hasattr(c, 'verified_at') and c.verified_at else None,
            "created_at": c.timestamp.isoformat() if c.timestamp else None,
            "logo": c.company_logo
        })

    return jsonify({
        "success": True,
        "companies": companies_list,
        "total": pagination.total,
        "page": page,
        "per_page": per_page,
        "total_pages": pagination.pages
    })


@admin_v1_bp.route('/companies/<int:company_id>/verify', methods=['POST', 'PATCH'])
@admin_api_required('companies.verify')
def verify_company_direct(admin, company_id):
    """Direct endpoint to approve/verify a company."""
    comp = Company.query.get_or_404(company_id)
    data = request.get_json() or {}
    is_verified = bool(data.get('is_verified', True))

    comp.is_verified = is_verified
    comp.verified_at = datetime.utcnow() if is_verified else None
    db.session.commit()

    company_name = comp.company_english_name or comp.company_arabic_name
    log_action(
        admin=admin,
        action='verify_company',
        target_type='company',
        target_id=company_id,
        details={"is_verified": is_verified, "company_name": company_name}
    )

    return jsonify({
        "success": True,
        "message": f"تم {'توثيق' if is_verified else 'إلغاء توثيق'} شركة {company_name} بنجاح",
        "company_id": comp.id,
        "is_verified": comp.is_verified
    })


# ------------------------------------------------------------------------------
# 3. JOB POSTINGS MODERATION
# ------------------------------------------------------------------------------

@admin_v1_bp.route('/jobs', methods=['GET'])
@admin_api_required('jobs')
def list_jobs(admin):
    """List jobs with status filters (all, pending, approved, rejected, archived)."""
    status_filter = request.args.get('status', 'all')
    search = request.args.get('q', '').strip()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)

    query = Jobs.query
    if status_filter != 'all':
        query = query.filter(Jobs.status == status_filter)

    if search:
        query = query.filter(
            or_(
                Jobs.title.ilike(f'%{search}%'),
                Jobs.town.ilike(f'%{search}%'),
                Jobs.specialization.ilike(f'%{search}%')
            )
        )

    pagination = query.order_by(desc(Jobs.date_posted)).paginate(
        page=page, per_page=per_page, error_out=False
    )

    jobs_list = []
    for j in pagination.items:
        comp = Company.query.get(j.company_id) if j.company_id else None
        applicants_count = len(j.customers) if j.customers else 0

        jobs_list.append({
            "id": j.id,
            "title": j.title,
            "company_id": j.company_id,
            "company_name": comp.company_english_name if comp else (comp.company_arabic_name if comp else "Unknown"),
            "company_logo": comp.company_logo if comp else None,
            "job_type": j.job_type,
            "town": j.town,
            "specialization": j.specialization,
            "educational_qualification": j.educational_qualification,
            "skills_years": j.skills_years,
            "status": j.status or 'pending',
            "is_featured": bool(j.is_featured),
            "salary_min": j.salary_min,
            "salary_max": j.salary_max,
            "applicants_count": applicants_count,
            "created_at": j.date_posted.isoformat() if j.date_posted else None
        })

    return jsonify({
        "success": True,
        "jobs": jobs_list,
        "total": pagination.total,
        "page": page,
        "per_page": per_page,
        "total_pages": pagination.pages
    })


@admin_v1_bp.route('/jobs/<int:job_id>/status', methods=['PATCH'])
@admin_api_required('jobs.crud')
def update_job_status(admin, job_id):
    """Approve, reject, or archive a job posting."""
    job = Jobs.query.get_or_404(job_id)
    data = request.get_json() or {}
    new_status = data.get('status')
    note = data.get('note', '')

    if new_status not in ('approved', 'rejected', 'pending', 'archived', 'closed'):
        return jsonify({"success": False, "message": "حالة الوظيفة غير صالحة"}), 400

    job.status = new_status
    db.session.commit()

    action_map = {
        'approved': 'approve_job',
        'rejected': 'reject_job',
        'archived': 'delete_job'
    }
    action_name = action_map.get(new_status, 'edit_job')

    log_action(
        admin=admin,
        action=action_name,
        target_type='job',
        target_id=job.id,
        details={"status": new_status, "title": job.title, "note": note}
    )

    return jsonify({
        "success": True,
        "message": f"تم تغيير حالة وظيفة '{job.title}' إلى {new_status} بنجاح",
        "job": {
            "id": job.id,
            "status": job.status
        }
    })


@admin_v1_bp.route('/jobs/<int:job_id>', methods=['DELETE'])
@admin_api_required('jobs.crud')
def delete_job(admin, job_id):
    """Permanently delete a job posting."""
    job = Jobs.query.get_or_404(job_id)
    job_title = job.title

    db.session.delete(job)
    db.session.commit()

    log_action(
        admin=admin,
        action='delete_job',
        target_type='job',
        target_id=job_id,
        details={"title": job_title}
    )

    return jsonify({
        "success": True,
        "message": f"تم حذف وظيفة '{job_title}' نهائياً"
    })


# ------------------------------------------------------------------------------
# 4. AUDIT LOGS
# ------------------------------------------------------------------------------

@admin_v1_bp.route('/audit-logs', methods=['GET'])
@admin_v1_bp.route('/auditlogs', methods=['GET'])
@admin_api_required('audit_logs')
def list_audit_logs(admin):
    """List system audit logs with search and pagination."""
    action_filter = request.args.get('action', 'all')
    search = request.args.get('q', '').strip()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 25, type=int)

    query = AuditLog.query
    if action_filter != 'all':
        query = query.filter(AuditLog.action == action_filter)

    if search:
        query = query.filter(
            or_(
                AuditLog.action.ilike(f'%{search}%'),
                AuditLog.target_type.ilike(f'%{search}%'),
                AuditLog.ip_address.ilike(f'%{search}%'),
                AuditLog.details.ilike(f'%{search}%')
            )
        )

    pagination = query.order_by(desc(AuditLog.created_at)).paginate(
        page=page, per_page=per_page, error_out=False
    )

    logs_list = []
    for log in pagination.items:
        adm = Admin.query.get(log.admin_id) if log.admin_id else None
        logs_list.append({
            "id": log.id,
            "admin_name": adm.username if adm else "Admin",
            "admin_role": adm.role if adm else None,
            "action": log.action,
            "action_label": log.action_label,
            "target_type": log.target_type,
            "target_type_label": log.target_type_label,
            "target_id": log.target_id,
            "details": log.details_dict,
            "ip_address": log.ip_address,
            "created_at": log.created_at.isoformat() if log.created_at else None
        })

    return jsonify({
        "success": True,
        "logs": logs_list,
        "total": pagination.total,
        "page": page,
        "per_page": per_page,
        "total_pages": pagination.pages
    })


# ------------------------------------------------------------------------------
# 5. ABUSE REPORTS MODERATION
# ------------------------------------------------------------------------------

@admin_v1_bp.route('/reports', methods=['GET'])
@admin_api_required('reports')
def list_reports(admin):
    """List user reports with status filter."""
    status_filter = request.args.get('status', 'all')
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)

    query = Report.query
    if status_filter != 'all':
        query = query.filter(Report.status == status_filter)

    pagination = query.order_by(desc(Report.created_at)).paginate(
        page=page, per_page=per_page, error_out=False
    )

    reports_list = []
    for r in pagination.items:
        # Reporter Name
        reporter_name = f"{r.reporter_type} #{r.reporter_id}"
        if r.reporter_type == 'customer':
            c = Customers.query.get(r.reporter_id)
            if c: reporter_name = c.fullname
        elif r.reporter_type == 'company':
            comp = Company.query.get(r.reporter_id)
            if comp: reporter_name = comp.company_english_name or comp.company_arabic_name

        # Target Name
        target_name = f"{r.target_type} #{r.target_id}"
        if r.target_type == 'customer':
            c = Customers.query.get(r.target_id)
            if c: target_name = c.fullname
        elif r.target_type == 'company':
            comp = Company.query.get(r.target_id)
            if comp: target_name = comp.company_english_name or comp.company_arabic_name
        elif r.target_type == 'job':
            j = Jobs.query.get(r.target_id)
            if j: target_name = j.title

        reports_list.append({
            "id": r.id,
            "reporter_type": r.reporter_type,
            "reporter_id": r.reporter_id,
            "reporter_name": reporter_name,
            "target_type": r.target_type,
            "target_id": r.target_id,
            "target_name": target_name,
            "reason": r.reason,
            "reason_label": r.reason_label if hasattr(r, 'reason_label') else r.reason,
            "description": r.description,
            "status": r.status,
            "status_label": r.status_label if hasattr(r, 'status_label') else r.status,
            "admin_notes": r.admin_notes if hasattr(r, 'admin_notes') else None,
            "created_at": r.created_at.isoformat() if r.created_at else None
        })

    return jsonify({
        "success": True,
        "reports": reports_list,
        "total": pagination.total,
        "page": page,
        "per_page": per_page,
        "total_pages": pagination.pages
    })


@admin_v1_bp.route('/reports/<int:report_id>/status', methods=['PATCH'])
@admin_api_required('reports.resolve')
def update_report_status(admin, report_id):
    """Resolve or dismiss an abuse report."""
    report = Report.query.get_or_404(report_id)
    data = request.get_json() or {}
    new_status = data.get('status')
    notes = data.get('notes', '')

    if new_status not in ('pending', 'reviewing', 'resolved', 'dismissed'):
        return jsonify({"success": False, "message": "حالة البلاغ غير صالحة"}), 400

    report.status = new_status
    if hasattr(report, 'admin_notes'):
        report.admin_notes = notes
    if hasattr(report, 'resolved_by'):
        report.resolved_by = admin.id
    if hasattr(report, 'resolved_at'):
        report.resolved_at = datetime.utcnow()

    db.session.commit()

    log_action(
        admin=admin,
        action='resolve_report' if new_status == 'resolved' else 'dismiss_report',
        target_type='report',
        target_id=report.id,
        details={"status": new_status, "notes": notes}
    )

    return jsonify({
        "success": True,
        "message": f"تم تحديث حالة البلاغ إلى '{new_status}' بنجاح"
    })


# ------------------------------------------------------------------------------
# 6. SYSTEM SETTINGS
# ------------------------------------------------------------------------------

@admin_v1_bp.route('/settings', methods=['GET'])
@admin_api_required('settings')
def get_system_settings(admin):
    """Retrieve all configurable platform settings with current values."""
    db_settings = {s.key: s.value for s in SystemSetting.query.all()}

    settings_output = {}
    for key, spec in SETTING_KEYS.items():
        val = db_settings.get(key, spec.get('default', ''))
        settings_output[key] = {
            "key": key,
            "label": spec.get('label', key),
            "type": spec.get('type', 'text'),
            "value": val
        }

    return jsonify({
        "success": True,
        "settings": settings_output
    })


@admin_v1_bp.route('/settings', methods=['PUT'])
@admin_api_required('settings')
def update_system_settings(admin):
    """Update dynamic system settings."""
    data = request.get_json() or {}
    updates = data.get('settings', {})

    if not isinstance(updates, dict):
        return jsonify({"success": False, "message": "تنسيق البيانات غير صالح"}), 400

    updated_keys = []
    for key, val in updates.items():
        if key in SETTING_KEYS:
            setting = SystemSetting.query.filter_by(key=key).first()
            if not setting:
                setting = SystemSetting(key=key, value=str(val), updated_by=admin.id)
                db.session.add(setting)
            else:
                setting.value = str(val)
                setting.updated_by = admin.id
                setting.updated_at = datetime.utcnow()
            updated_keys.append(key)

    db.session.commit()

    log_action(
        admin=admin,
        action='update_settings',
        target_type='settings',
        target_id=None,
        details={"updated_keys": updated_keys}
    )

    return jsonify({
        "success": True,
        "message": f"تم حفظ {len(updated_keys)} من الإعدادات بنجاح",
        "updated_keys": updated_keys
    })


# ------------------------------------------------------------------------------
# 7. SUPPORT TICKETS
# ------------------------------------------------------------------------------

@admin_v1_bp.route('/tickets', methods=['GET'])
@admin_api_required('reports')
def list_tickets(admin):
    """List customer/company support tickets with status filter."""
    status_filter = request.args.get('status', 'all')
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)

    query = Ticket.query
    if status_filter != 'all':
        query = query.filter(Ticket.status == status_filter)

    pagination = query.order_by(desc(Ticket.created_at)).paginate(
        page=page, per_page=per_page, error_out=False
    )

    tickets_list = []
    for t in pagination.items:
        tickets_list.append({
            "id": t.id,
            "email": t.email,
            "subject": t.subject,
            "description": t.description,
            "status": t.status,
            "admin_reply": t.admin_reply,
            "created_at": t.created_at.isoformat() if t.created_at else None
        })

    return jsonify({
        "success": True,
        "tickets": tickets_list,
        "total": pagination.total,
        "page": page,
        "per_page": per_page,
        "total_pages": pagination.pages
    })


@admin_v1_bp.route('/tickets/<int:ticket_id>', methods=['PATCH'])
@admin_api_required('reports')
def update_ticket(admin, ticket_id):
    """Reply to support ticket or update status (open/closed)."""
    ticket = Ticket.query.get_or_404(ticket_id)
    data = request.get_json() or {}
    status = data.get('status')
    reply = data.get('admin_reply')

    if status and status in ('open', 'closed'):
        ticket.status = status
    if reply is not None:
        ticket.admin_reply = reply

    db.session.commit()

    log_action(
        admin=admin,
        action='reply_ticket',
        target_type='ticket',
        target_id=ticket.id,
        details={"status": ticket.status, "has_reply": bool(reply)}
    )

    return jsonify({
        "success": True,
        "message": "تم تحديث التذكرة بنجاح",
        "ticket": {
            "id": ticket.id,
            "status": ticket.status,
            "admin_reply": ticket.admin_reply
        }
    })


# ------------------------------------------------------------------------------
# 8. CATEGORIES & TAXONOMY (Job Categories, Cities, Job Types)
# ------------------------------------------------------------------------------

@admin_v1_bp.route('/categories', methods=['GET'])
@admin_api_required('jobs')
def list_categories(admin):
    """Retrieve all job categories, cities, and job types."""
    categories = JobCategory.get_all() if hasattr(JobCategory, 'get_all') else JobCategory.query.all()
    cities = City.query.order_by(desc(City.id)).all()
    job_types = JobType.query.order_by(desc(JobType.id)).all()

    cats_list = [{
        "id": c.id,
        "name_ar": c.name_ar,
        "name_en": c.name_en,
        "icon": c.icon,
        "is_active": c.is_active,
        "sort_order": c.sort_order
    } for c in categories]

    cities_list = [{
        "id": ci.id,
        "name_ar": ci.name_ar,
        "name_en": ci.name_en,
        "is_active": ci.is_active
    } for ci in cities]

    types_list = [{
        "id": jt.id,
        "name_ar": jt.name_ar,
        "name_en": jt.name_en,
        "is_active": jt.is_active
    } for jt in job_types]

    return jsonify({
        "success": True,
        "categories": cats_list,
        "cities": cities_list,
        "job_types": types_list
    })


@admin_v1_bp.route('/categories', methods=['POST'])
@admin_api_required('jobs.crud')
def create_category(admin):
    """Create a new job category, city, or job type."""
    data = request.get_json() or {}
    item_type = data.get('type', 'category') # category | city | job_type
    name_ar = (data.get('name_ar') or '').strip()
    name_en = (data.get('name_en') or '').strip()

    if not name_ar:
        return jsonify({"success": False, "message": "الاسم بالعربية مطلوب"}), 400

    if item_type == 'category':
        icon = data.get('icon', 'fas fa-briefcase')
        item = JobCategory(name_ar=name_ar, name_en=name_en or name_ar, icon=icon)
    elif item_type == 'city':
        item = City(name_ar=name_ar, name_en=name_en or None)
    elif item_type == 'job_type':
        item = JobType(name_ar=name_ar, name_en=name_en or None)
    else:
        return jsonify({"success": False, "message": "نوع العنصر غير صالح"}), 400

    db.session.add(item)
    db.session.commit()

    log_action(
        admin=admin,
        action=f'create_{item_type}',
        target_type=item_type,
        target_id=item.id,
        details={"name_ar": name_ar}
    )

    return jsonify({
        "success": True,
        "message": f"تمت إضافة '{name_ar}' بنجاح",
        "item": {
            "id": item.id,
            "name_ar": item.name_ar,
            "name_en": getattr(item, 'name_en', None),
            "is_active": item.is_active
        }
    })


@admin_v1_bp.route('/categories/<string:item_type>/<int:item_id>', methods=['DELETE'])
@admin_api_required('jobs.crud')
def delete_category(admin, item_type, item_id):
    """Delete a category, city, or job type item."""
    if item_type == 'category':
        item = JobCategory.query.get_or_404(item_id)
    elif item_type == 'city':
        item = City.query.get_or_404(item_id)
    elif item_type == 'job_type':
        item = JobType.query.get_or_404(item_id)
    else:
        return jsonify({"success": False, "message": "نوع العنصر غير صالح"}), 400

    item_name = item.name_ar
    db.session.delete(item)
    db.session.commit()

    log_action(
        admin=admin,
        action=f'delete_{item_type}',
        target_type=item_type,
        target_id=item_id,
        details={"name": item_name}
    )

    return jsonify({
        "success": True,
        "message": f"تم حذف '{item_name}' بنجاح"
    })


@admin_v1_bp.route('/categories/<string:item_type>/<int:item_id>/toggle', methods=['PATCH'])
@admin_api_required('jobs.crud')
def toggle_category(admin, item_type, item_id):
    """Toggle is_active on category, city, or job type."""
    if item_type == 'category':
        item = JobCategory.query.get_or_404(item_id)
    elif item_type == 'city':
        item = City.query.get_or_404(item_id)
    elif item_type == 'job_type':
        item = JobType.query.get_or_404(item_id)
    else:
        return jsonify({"success": False, "message": "نوع العنصر غير صالح"}), 400

    item.is_active = not item.is_active
    db.session.commit()

    return jsonify({
        "success": True,
        "message": f"تم {'تفعيل' if item.is_active else 'تعطيل'} '{item.name_ar}' بنجاح",
        "is_active": item.is_active
    })
