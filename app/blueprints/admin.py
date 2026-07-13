# ==============================================================================
# الوظيفة الأساسية للملف: مسارات (Blueprint) لوحة تحكم المدير بالكامل.
# الروابط أو الميزات: تسجيل دخول المدير، لوحة التحليلات، إدارة المستخدمين والشركات والمجموعات والوظائف والبلاغات والاشتراكات والإعدادات.
# المتطلبات الخاصة: يعتمد على Flask Blueprints ونظام الصلاحيات RBAC.
# ==============================================================================
from functools import wraps
from datetime import datetime, timedelta

from flask import (
    Blueprint, render_template, request, redirect, url_for,
    session, flash, jsonify, abort, current_app
)
import os
from werkzeug.utils import secure_filename
from app import db
from services.admin import (
    Admin, ROLE_SUPER_ADMIN, ROLE_SUPPORT_MODERATOR,
    ROLE_CONTENT_MODERATOR, ROLE_FINANCE_ADMIN, ROLE_PERMISSIONS, ROLE_LABELS, ALL_ROLES
)
from services.customer import Customers, customer_jobs
from services.company import Company
from services.job import Jobs
from services.teams import Teams, team_members_association
from services.report import Report, REPORT_STATUSES, REPORT_STATUS_LABELS, REPORT_REASONS, REPORT_PRIORITIES
from services.audit_log import AuditLog
from services.subscription import SubscriptionPlan, Subscription, Payment
from services.system_settings import SystemSetting, SETTING_KEYS
from services.job_category import JobCategory
from werkzeug.security import generate_password_hash


admin_bp = Blueprint('admin', __name__, url_prefix='/admin')


# ─────────────────────────────────────────────────────────────
# Authentication & Authorization Decorators
# ─────────────────────────────────────────────────────────────

def admin_login_required(f):
    """Decorator: redirects to admin login if not authenticated."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'admin_id' not in session:
            flash('يرجى تسجيل الدخول أولاً', 'warning')
            return redirect('/login')
        admin = Admin.get_by_id(session['admin_id'])
        if not admin or not admin.is_active:
            session.pop('admin_id', None)
            flash('حسابك غير نشط أو غير موجود', 'danger')
            return redirect('/login')
        return f(*args, **kwargs)
    return decorated_function


def require_permission(*permissions):
    """Decorator: checks if logged-in admin has ANY of the given permissions."""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'admin_id' not in session:
                return redirect('/login')
            admin = Admin.get_by_id(session['admin_id'])
            if not admin:
                return redirect('/login')
            if not any(admin.has_permission(p) for p in permissions):
                flash('ليس لديك صلاحية للوصول إلى هذه الصفحة', 'danger')
                return redirect(url_for('admin.admin_dashboard'))
            return f(*args, **kwargs)
        return decorated_function
    return decorator


def get_current_admin():
    """Helper: get the currently logged-in admin object."""
    if 'admin_id' in session:
        return Admin.get_by_id(session['admin_id'])
    return None


def log_admin_action(action, target_type=None, target_id=None, details=None):
    """Helper: create an audit log entry for the current admin."""
    admin = get_current_admin()
    if admin:
        AuditLog.log_action(
            admin_id=admin.id,
            action=action,
            target_type=target_type,
            target_id=target_id,
            details=details,
            ip_address=request.remote_addr,
        )


# ─────────────────────────────────────────────────────────────
# Context Processor — inject admin data into all admin templates
# ─────────────────────────────────────────────────────────────

@admin_bp.context_processor
def inject_admin_context():
    admin = get_current_admin()
    return {
        'current_admin': admin,
        'ROLE_LABELS': ROLE_LABELS,
        'ROLE_PERMISSIONS': ROLE_PERMISSIONS,
    }


# ─────────────────────────────────────────────────────────────
# Auth Routes
# ─────────────────────────────────────────────────────────────

@admin_bp.route('/login', methods=['GET', 'POST'])
def admin_login():
    if 'admin_id' in session:
        return redirect(url_for('admin.admin_dashboard'))

    if request.method == 'POST':
        email = request.form.get('email', '').strip()
        password = request.form.get('password', '')

        admin = Admin.get_by_email(email)
        if admin and admin.check_password(password):
            if not admin.is_active:
                flash('حسابك معطّل. تواصل مع المدير العام.', 'danger')
                return render_template('admin/login.html')

            session['admin_id'] = admin.id
            session['admin_role'] = admin.role
            admin.last_login = datetime.utcnow()
            db.session.commit()
            flash(f'مرحباً {admin.username}!', 'success')
            return redirect(url_for('admin.admin_dashboard'))
        else:
            flash('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'danger')

    return render_template('admin/login.html')


@admin_bp.route('/logout')
def admin_logout():
    session.pop('admin_id', None)
    session.pop('admin_role', None)
    flash('تم تسجيل الخروج بنجاح', 'success')
    return redirect('/login')


# ─────────────────────────────────────────────────────────────
# Dashboard
# ─────────────────────────────────────────────────────────────

@admin_bp.route('/')
@admin_login_required
@require_permission('dashboard')
def admin_dashboard():
    # Gather key metrics
    total_users = Customers.query.count()
    total_companies = Company.query.count()
    total_jobs = Jobs.query.count()
    total_teams = Teams.query.count()
    pending_reports = Report.query.filter_by(status='pending').count()
    
    from services.ticket import Ticket
    pending_tickets = Ticket.query.filter_by(status='open').count()
    
    active_jobs = Jobs.query.filter(Jobs.status.in_(['approved', 'pending'])).count()

    # New registrations (last 7 days)
    week_ago = datetime.utcnow() - timedelta(days=7)
    new_users_week = Customers.query.filter(Customers.timestamp >= week_ago).count()
    new_companies_week = Company.query.filter(Company.timestamp >= week_ago).count()

    # Recent reports for alert feed
    recent_reports = Report.query.order_by(Report.created_at.desc()).limit(5).all()

    # Recent audit logs
    recent_logs = AuditLog.query.order_by(AuditLog.created_at.desc()).limit(5).all()

    return render_template('admin/dashboard.html',
                           total_users=total_users,
                           total_companies=total_companies,
                           total_jobs=total_jobs,
                           total_teams=total_teams,
                           pending_reports=pending_reports,
                           pending_tickets=pending_tickets,
                           active_jobs=active_jobs,
                           new_users_week=new_users_week,
                           new_companies_week=new_companies_week,
                           recent_reports=recent_reports,
                           recent_logs=recent_logs)


@admin_bp.route('/api/stats')
@admin_login_required
@require_permission('dashboard')
def api_stats():
    """JSON endpoint for dashboard metric cards."""
    total_users = Customers.query.count()
    total_companies = Company.query.count()
    total_jobs = Jobs.query.count()
    total_teams = Teams.query.count()
    pending_reports = Report.query.filter_by(status='pending').count()
    active_subs = Subscription.get_active_count()
    total_revenue = Payment.get_total_revenue()

    return jsonify({
        'total_users': total_users,
        'total_companies': total_companies,
        'total_jobs': total_jobs,
        'total_teams': total_teams,
        'pending_reports': pending_reports,
        'active_subscriptions': active_subs,
        'total_revenue': total_revenue,
    })

@admin_bp.route('/jobs/pending')
@admin_login_required
@require_permission('dashboard')
def pending_jobs():
    jobs = Jobs.query.filter_by(status='pending').order_by(Jobs.date_posted.desc()).all()
    return render_template('admin/pending_jobs.html', jobs=jobs)

@admin_bp.route('/tickets')
@admin_login_required
@require_permission('dashboard')
def tickets():
    from services.ticket import Ticket
    all_tickets = Ticket.query.order_by(Ticket.created_at.desc()).all()
    return render_template('admin/tickets.html', tickets=all_tickets)

@admin_bp.route('/tickets/<int:ticket_id>/reply', methods=['POST'])
@admin_login_required
@require_permission('dashboard')
def reply_ticket(ticket_id):
    from services.ticket import Ticket
    ticket = Ticket.query.get_or_404(ticket_id)
    reply = request.form.get('admin_reply')
    status = request.form.get('status')
    
    if reply:
        ticket.admin_reply = reply
    if status:
        ticket.status = status
        
    db.session.commit()
    flash('تم تحديث التذكرة بنجاح', 'success')
    return redirect(url_for('admin.tickets'))



@admin_bp.route('/api/chart/users')
@admin_login_required
@require_permission('dashboard')
def api_chart_users():
    """JSON endpoint for user growth line chart (last 30 days)."""
    labels = []
    data_customers = []
    data_companies = []

    for i in range(29, -1, -1):
        day = datetime.utcnow() - timedelta(days=i)
        day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)

        labels.append(day_start.strftime('%m/%d'))
        data_customers.append(Customers.query.filter(
            Customers.timestamp >= day_start, Customers.timestamp < day_end
        ).count())
        data_companies.append(Company.query.filter(
            Company.timestamp >= day_start, Company.timestamp < day_end
        ).count())

    return jsonify({
        'labels': labels,
        'datasets': [
            {'label': 'باحثون عن عمل', 'data': data_customers, 'borderColor': '#6C5CE7', 'fill': False},
            {'label': 'شركات', 'data': data_companies, 'borderColor': '#00B894', 'fill': False},
        ]
    })


@admin_bp.route('/api/chart/roles')
@admin_login_required
@require_permission('dashboard')
def api_chart_roles():
    """JSON endpoint for user role distribution pie chart."""
    customers_count = Customers.query.count()
    companies_count = Company.query.count()

    return jsonify({
        'labels': ['باحثون عن عمل', 'شركات'],
        'data': [customers_count, companies_count],
        'colors': ['#6C5CE7', '#00B894'],
    })


# ─────────────────────────────────────────────────────────────
# User Management
# ─────────────────────────────────────────────────────────────

@admin_bp.route('/users')
@admin_login_required
@require_permission('users')
def list_users():
    page = request.args.get('page', 1, type=int)
    per_page = 20
    search = request.args.get('search', '').strip()
    status_filter = request.args.get('status', '')
    verified_filter = request.args.get('verified', '')

    query = Customers.query

    if search:
        query = query.filter(
            db.or_(
                Customers.fullname.ilike(f'%{search}%'),
                Customers.email.ilike(f'%{search}%'),
                Customers.mobile.ilike(f'%{search}%'),
            )
        )
    if status_filter:
        query = query.filter_by(status=status_filter)
    if verified_filter == 'yes':
        query = query.filter_by(is_verified=True)
    elif verified_filter == 'no':
        query = query.filter_by(is_verified=False)

    query = query.order_by(Customers.timestamp.desc())
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    return render_template('admin/users/list.html',
                           users=pagination.items,
                           pagination=pagination,
                           search=search,
                           status_filter=status_filter,
                           verified_filter=verified_filter)


@admin_bp.route('/users/<int:id>')
@admin_login_required
@require_permission('users')
def view_user(id):
    user = Customers.query.get_or_404(id)
    from services.skills import Skills
    from services.language import Lang

    user_skills = Skills.query.filter_by(customer_id=user.id).all()
    user_languages = Lang.query.filter_by(customer_id=user.id).all()

    # Count job applications
    job_app_count = db.session.query(customer_jobs).filter(
        customer_jobs.c.customer_id == user.user_id
    ).count()

    # Teams membership
    user_teams = user.teams if hasattr(user, 'teams') else []

    return render_template('admin/users/view.html',
                           user=user,
                           user_skills=user_skills,
                           user_languages=user_languages,
                           job_app_count=job_app_count,
                           user_teams=user_teams)


@admin_bp.route('/users/create', methods=['GET', 'POST'])
@admin_login_required
@require_permission('users.crud')
def create_user():
    if request.method == 'POST':
        fullname = request.form.get('fullname', '').strip()
        email = request.form.get('email', '').strip()
        mobile = request.form.get('mobile', '').strip()
        password = request.form.get('password', '')

        if not all([fullname, email, mobile, password]):
            flash('جميع الحقول المطلوبة يجب ملؤها', 'danger')
            return render_template('admin/users/create.html')

        if Customers.get_by_email(email):
            flash('البريد الإلكتروني مسجل بالفعل', 'danger')
            return render_template('admin/users/create.html')

        user = Customers(
            fullname=fullname,
            email=email,
            mobile=mobile,
            password=generate_password_hash(password),
            activated=True,
        )
        user.user_id = mobile  # Using mobile as user_id per existing pattern
        db.session.add(user)
        db.session.commit()

        log_admin_action('create_user', 'customer', user.id, {'fullname': fullname, 'email': email})
        flash('تم إنشاء المستخدم بنجاح', 'success')
        return redirect(url_for('admin.list_users'))

    return render_template('admin/users/create.html')


@admin_bp.route('/users/<int:id>/edit', methods=['GET', 'POST'])
@admin_login_required
@require_permission('users.crud')
def edit_user(id):
    user = Customers.query.get_or_404(id)

    if request.method == 'POST':
        user.fullname = request.form.get('fullname', user.fullname)
        user.email = request.form.get('email', user.email)
        user.mobile = request.form.get('mobile', user.mobile)
        user.sex = request.form.get('sex', user.sex)
        user.country = request.form.get('country', user.country)
        user.government = request.form.get('government', user.government)
        user.education_statue = request.form.get('education_statue', user.education_statue)
        user.educational_qualification = request.form.get('educational_qualification', user.educational_qualification)
        user.university = request.form.get('university', user.university)
        user.department_university = request.form.get('department_university', user.department_university)
        user.years_of_skills = request.form.get('years_of_skills', user.years_of_skills)
        user.preferred_field_of_work = request.form.get('preferred_field_of_work', user.preferred_field_of_work)
        user.work_type = request.form.get('work_type', user.work_type)
        user.about = request.form.get('about', user.about)

        db.session.commit()
        log_admin_action('edit_user', 'customer', user.id, {'fullname': user.fullname})
        flash('تم تحديث بيانات المستخدم بنجاح', 'success')
        return redirect(url_for('admin.view_user', id=user.id))

    return render_template('admin/users/edit.html', user=user)


@admin_bp.route('/users/<int:id>/delete', methods=['POST'])
@admin_login_required
@require_permission('users.crud')
def delete_user(id):
    user = Customers.query.get_or_404(id)
    fullname = user.fullname
    db.session.delete(user)
    db.session.commit()
    log_admin_action('delete_user', 'customer', id, {'fullname': fullname})
    flash(f'تم حذف المستخدم: {fullname}', 'success')
    return redirect(url_for('admin.list_users'))


@admin_bp.route('/users/<int:id>/action', methods=['POST'])
@admin_login_required
@require_permission('users.actions')
def user_action(id):
    user = Customers.query.get_or_404(id)
    action = request.form.get('action')
    reason = request.form.get('reason', '')

    admin = get_current_admin()

    if action == 'suspend':
        user.status = 'suspended'
        user.suspension_reason = reason
        log_admin_action('suspend_user', 'customer', user.id, {'reason': reason})
        flash(f'تم إيقاف حساب {user.fullname}', 'warning')

    elif action == 'ban':
        if admin.role == ROLE_SUPPORT_MODERATOR:
            flash('ليس لديك صلاحية الحظر. يمكنك التحذير فقط.', 'danger')
            return redirect(url_for('admin.view_user', id=user.id))
        user.status = 'banned'
        user.suspension_reason = reason
        log_admin_action('ban_user', 'customer', user.id, {'reason': reason})
        flash(f'تم حظر حساب {user.fullname}', 'danger')

    elif action == 'warn':
        user.warnings_count = (user.warnings_count or 0) + 1
        user.status = 'warned'
        log_admin_action('warn_user', 'customer', user.id, {'reason': reason, 'count': user.warnings_count})
        flash(f'تم تحذير {user.fullname} (التحذير رقم {user.warnings_count})', 'warning')

    elif action == 'activate':
        user.status = 'active'
        user.suspension_reason = None
        log_admin_action('activate_user', 'customer', user.id)
        flash(f'تم تفعيل حساب {user.fullname}', 'success')

    elif action == 'verify':
        user.is_verified = True
        user.verified_at = datetime.utcnow()
        log_admin_action('verify_user', 'customer', user.id)
        flash(f'تم توثيق حساب {user.fullname} ✓', 'success')

    elif action == 'unverify':
        user.is_verified = False
        user.verified_at = None
        log_admin_action('verify_user', 'customer', user.id, {'action': 'unverify'})
        flash(f'تم إلغاء توثيق حساب {user.fullname}', 'info')

    db.session.commit()
    return redirect(url_for('admin.view_user', id=user.id))


@admin_bp.route('/users/<int:id>/reset-password', methods=['POST'])
@admin_login_required
@require_permission('users.crud')
def reset_password(id):
    user = Customers.query.get_or_404(id)
    new_password = request.form.get('new_password', '')
    if len(new_password) < 6:
        flash('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'danger')
        return redirect(url_for('admin.view_user', id=user.id))

    user.password = generate_password_hash(new_password)
    db.session.commit()
    log_admin_action('reset_password', 'customer', user.id)
    flash(f'تم إعادة تعيين كلمة مرور {user.fullname}', 'success')
    return redirect(url_for('admin.view_user', id=user.id))


# ─────────────────────────────────────────────────────────────
# Company Management
# ─────────────────────────────────────────────────────────────

@admin_bp.route('/companies')
@admin_login_required
@require_permission('companies')
def list_companies():
    page = request.args.get('page', 1, type=int)
    search = request.args.get('search', '').strip()
    verified_filter = request.args.get('verified', '')

    query = Company.query

    if search:
        query = query.filter(
            db.or_(
                Company.company_arabic_name.ilike(f'%{search}%'),
                Company.company_english_name.ilike(f'%{search}%'),
                Company.company_email.ilike(f'%{search}%'),
            )
        )
    if verified_filter == 'yes':
        query = query.filter_by(is_verified=True)
    elif verified_filter == 'no':
        query = query.filter_by(is_verified=False)

    query = query.order_by(Company.timestamp.desc())
    pagination = query.paginate(page=page, per_page=20, error_out=False)

    return render_template('admin/companies/list.html',
                           companies=pagination.items,
                           pagination=pagination,
                           search=search,
                           verified_filter=verified_filter)


@admin_bp.route('/companies/<int:id>')
@admin_login_required
@require_permission('companies')
def view_company(id):
    company = Company.query.get_or_404(id)
    company_jobs = Jobs.query.filter_by(company_id=company.id).all()
    return render_template('admin/companies/view.html',
                           company=company,
                           company_jobs=company_jobs)


@admin_bp.route('/companies/<int:id>/verify', methods=['POST'])
@admin_login_required
@require_permission('companies.verify')
def verify_company(id):
    company = Company.query.get_or_404(id)
    action = request.form.get('action', 'verify')

    if action == 'verify':
        company.is_verified = True
        company.verified_at = datetime.utcnow()
        log_admin_action('verify_company', 'company', company.id, {'name': company.company_english_name})
        flash(f'تم توثيق شركة {company.company_english_name} ✓', 'success')
    elif action == 'unverify':
        company.is_verified = False
        company.verified_at = None
        log_admin_action('verify_company', 'company', company.id, {'action': 'unverify'})
        flash(f'تم إلغاء توثيق شركة {company.company_english_name}', 'info')

    db.session.commit()
    return redirect(url_for('admin.view_company', id=company.id))

@admin_bp.route('/companies/<int:id>/edit', methods=['GET', 'POST'])
@admin_login_required
@require_permission('companies')
def edit_company(id):
    company = Company.query.get_or_404(id)

    if request.method == 'POST':
        company.company_arabic_name = request.form.get('company_arabic_name', company.company_arabic_name)
        company.company_english_name = request.form.get('company_english_name', company.company_english_name)
        company.company_field = request.form.get('company_field', company.company_field)
        company.about_company_arabic = request.form.get('about_company_arabic', company.about_company_arabic)
        company.about_company_english = request.form.get('about_company_english', company.about_company_english)
        company.company_email = request.form.get('company_email', company.company_email)
        company.company_mobile = request.form.get('company_mobile', company.company_mobile)
        company.company_website = request.form.get('company_website', company.company_website)
        company.country = request.form.get('country', company.country)
        company.state = request.form.get('state', company.state)
        
        # New fields added
        company.english_adress = request.form.get('english_adress', company.english_adress)
        company.company_type = request.form.get('company_type', company.company_type)
        company.company_size = request.form.get('company_size', company.company_size)
        company.hr_name = request.form.get('hr_name', company.hr_name)
        company.hr_mobile = request.form.get('hr_mobile', company.hr_mobile)
        company.hr_email = request.form.get('hr_email', company.hr_email)
        company.twitter_email = request.form.get('twitter_email', company.twitter_email)
        company.instagram_email = request.form.get('instagram_email', company.instagram_email)
        company.company_name_on_faeda = request.form.get('company_name_on_faeda', company.company_name_on_faeda)
        
        new_password = request.form.get('login_password', '').strip()
        if new_password:
            company.login_password = generate_password_hash(new_password)
            
        company.activated = request.form.get('activated') == 'on'
        company.is_verified = request.form.get('is_verified') == 'on'
        
        status = request.form.get('status')
        if status in ['active', 'suspended', 'banned']:
            company.status = status

        upload_logo_dir = current_app.config.get('UPLOAD_company_logo')
        if upload_logo_dir:
            os.makedirs(upload_logo_dir, exist_ok=True)
            logo_file = request.files.get('company_logo')
            if logo_file and logo_file.filename:
                filename = secure_filename(logo_file.filename)
                file_path = os.path.join(upload_logo_dir, filename)
                try:
                    logo_file.save(file_path)
                    if company.company_logo:
                        old_logo_path = os.path.join(upload_logo_dir, company.company_logo)
                        if os.path.exists(old_logo_path):
                            os.remove(old_logo_path)
                    company.company_logo = filename
                except Exception as e:
                    flash(f'حدث خطأ أثناء رفع الشعار: {e}', 'danger')

        upload_cr_dir = current_app.config.get('UPLOAD_COMPANY_COMMERCIAL_REGISTER')
        if upload_cr_dir:
            os.makedirs(upload_cr_dir, exist_ok=True)
            cr_file = request.files.get('commercial_register')
            if cr_file and cr_file.filename:
                filename = secure_filename(cr_file.filename)
                file_path = os.path.join(upload_cr_dir, filename)
                try:
                    cr_file.save(file_path)
                    if company.commercial_register:
                        old_cr_path = os.path.join(upload_cr_dir, company.commercial_register)
                        if os.path.exists(old_cr_path):
                            os.remove(old_cr_path)
                    company.commercial_register = filename
                except Exception as e:
                    flash(f'حدث خطأ أثناء رفع السجل التجاري: {e}', 'danger')

        db.session.commit()
        log_admin_action('edit_company', 'company', company.id, {'name': company.company_english_name})
        flash('تم تحديث بيانات الشركة بنجاح', 'success')
        return redirect(url_for('admin.view_company', id=company.id))

    return render_template('admin/companies/edit.html', company=company)


# ─────────────────────────────────────────────────────────────
# Team/Group Management
# ─────────────────────────────────────────────────────────────

@admin_bp.route('/teams')
@admin_login_required
@require_permission('teams')
def list_teams():
    page = request.args.get('page', 1, type=int)
    search = request.args.get('search', '').strip()

    query = Teams.query
    if search:
        query = query.filter(Teams.team_name.ilike(f'%{search}%'))

    query = query.order_by(Teams.creation_date.desc())
    pagination = query.paginate(page=page, per_page=20, error_out=False)

    # Calculate member counts
    team_stats = {}
    for team in pagination.items:
        member_count = db.session.query(team_members_association).filter_by(
            team_id=team.id, status='عضو'
        ).count()
        team_stats[team.id] = {'member_count': member_count}

    return render_template('admin/teams/list.html',
                           teams=pagination.items,
                           pagination=pagination,
                           team_stats=team_stats,
                           search=search)


@admin_bp.route('/teams/<int:id>')
@admin_login_required
@require_permission('teams')
def view_team(id):
    team = Teams.query.get_or_404(id)

    # Get members with their status
    members_query = db.session.query(
        Customers, team_members_association.c.status, team_members_association.c.date_of_addition
    ).join(
        team_members_association, Customers.user_id == team_members_association.c.member_id
    ).filter(team_members_association.c.team_id == team.id).all()

    # Get team admin
    team_admin = Customers.query.filter_by(user_id=team.admin_id).first()

    # Pending join requests
    pending_count = db.session.query(team_members_association).filter_by(
        team_id=team.id, status='مدعو'
    ).count()

    return render_template('admin/teams/view.html',
                           team=team,
                           members=members_query,
                           team_admin=team_admin,
                           pending_count=pending_count)


@admin_bp.route('/teams/<int:id>/delete', methods=['POST'])
@admin_login_required
@require_permission('teams.crud')
def delete_team(id):
    team = Teams.query.get_or_404(id)
    team_name = team.team_name
    db.session.delete(team)
    db.session.commit()
    log_admin_action('delete_team', 'team', id, {'team_name': team_name})
    flash(f'تم حذف المجموعة: {team_name}', 'success')
    return redirect(url_for('admin.list_teams'))


@admin_bp.route('/teams/<int:id>/transfer', methods=['POST'])
@admin_login_required
@require_permission('teams.crud')
def transfer_ownership(id):
    team = Teams.query.get_or_404(id)
    new_admin_user_id = request.form.get('new_admin_user_id', '').strip()

    if not new_admin_user_id:
        flash('يرجى تحديد المالك الجديد', 'danger')
        return redirect(url_for('admin.view_team', id=team.id))

    new_admin = Customers.query.filter_by(user_id=new_admin_user_id).first()
    if not new_admin:
        flash('المستخدم غير موجود', 'danger')
        return redirect(url_for('admin.view_team', id=team.id))

    old_admin_id = team.admin_id
    team.admin_id = new_admin_user_id
    db.session.commit()
    log_admin_action('transfer_team', 'team', team.id, {
        'old_admin': old_admin_id, 'new_admin': new_admin_user_id
    })
    flash(f'تم نقل ملكية المجموعة إلى {new_admin.fullname}', 'success')
    return redirect(url_for('admin.view_team', id=team.id))


# ─────────────────────────────────────────────────────────────
# Job Board Management
# ─────────────────────────────────────────────────────────────

@admin_bp.route('/jobs')
@admin_login_required
@require_permission('jobs')
def list_jobs():
    page = request.args.get('page', 1, type=int)
    search = request.args.get('search', '').strip()
    status_filter = request.args.get('status', '')
    category_filter = request.args.get('category', '')

    query = Jobs.query

    if search:
        query = query.filter(
            db.or_(
                Jobs.title.ilike(f'%{search}%'),
                Jobs.specialization.ilike(f'%{search}%'),
            )
        )
    if status_filter:
        query = query.filter_by(status=status_filter)
    if category_filter:
        query = query.filter_by(category=category_filter)

    query = query.order_by(Jobs.date_posted.desc())
    pagination = query.paginate(page=page, per_page=20, error_out=False)

    categories = JobCategory.get_active_categories()

    return render_template('admin/jobs/list.html',
                           jobs=pagination.items,
                           pagination=pagination,
                           categories=categories,
                           search=search,
                           status_filter=status_filter,
                           category_filter=category_filter)


@admin_bp.route('/jobs/<int:id>')
@admin_login_required
@require_permission('jobs')
def view_job(id):
    job = Jobs.query.get_or_404(id)
    company = Company.query.get(job.company_id)

    # Applicants count
    applicants_count = db.session.query(customer_jobs).filter(
        customer_jobs.c.job_id == job.id
    ).count()

    return render_template('admin/jobs/view.html',
                           job=job,
                           company=company,
                           applicants_count=applicants_count)


@admin_bp.route('/jobs/<int:id>/edit', methods=['GET', 'POST'])
@admin_login_required
@require_permission('jobs.crud')
def edit_job(id):
    job = Jobs.query.get_or_404(id)

    if request.method == 'POST':
        job.title = request.form.get('title', job.title)
        job.job_type = request.form.get('job_type', job.job_type)
        job.town = request.form.get('town', job.town)
        job.job_description = request.form.get('job_description', job.job_description)
        job.specialization = request.form.get('specialization', job.specialization)
        job.skills_years = request.form.get('skills_years', job.skills_years)
        job.educational_qualification = request.form.get('educational_qualification', job.educational_qualification)
        job.workplace = request.form.get('workplace', job.workplace)
        job.category = request.form.get('category', job.category)
        job.is_featured = request.form.get('is_featured') == 'on'

        db.session.commit()
        log_admin_action('edit_job', 'job', job.id, {'title': job.title})
        flash('تم تحديث الوظيفة بنجاح', 'success')
        return redirect(url_for('admin.view_job', id=job.id))

    categories = JobCategory.get_active_categories()
    return render_template('admin/jobs/edit.html', job=job, categories=categories)


@admin_bp.route('/jobs/<int:id>/approve', methods=['POST'])
@admin_login_required
@require_permission('jobs.crud')
def approve_job(id):
    job = Jobs.query.get_or_404(id)
    job.status = 'approved'
    db.session.commit()
    log_admin_action('approve_job', 'job', job.id, {'title': job.title})
    flash(f'تم قبول الوظيفة: {job.title}', 'success')
    return redirect(url_for('admin.view_job', id=job.id))


@admin_bp.route('/jobs/<int:id>/reject', methods=['POST'])
@admin_login_required
@require_permission('jobs.crud')
def reject_job(id):
    job = Jobs.query.get_or_404(id)
    job.status = 'rejected'
    db.session.commit()
    log_admin_action('reject_job', 'job', job.id, {'title': job.title})
    flash(f'تم رفض الوظيفة: {job.title}', 'warning')
    return redirect(url_for('admin.view_job', id=job.id))


@admin_bp.route('/jobs/<int:id>/delete', methods=['POST'])
@admin_login_required
@require_permission('jobs.crud')
def delete_job(id):
    job = Jobs.query.get_or_404(id)
    title = job.title
    db.session.delete(job)
    db.session.commit()
    log_admin_action('delete_job', 'job', id, {'title': title})
    flash(f'تم حذف الوظيفة: {title}', 'success')
    return redirect(url_for('admin.list_jobs'))


@admin_bp.route('/categories', methods=['GET', 'POST'])
@admin_login_required
@require_permission('jobs.crud')
def manage_categories():
    if request.method == 'POST':
        action = request.form.get('action')

        if action == 'create':
            name_ar = request.form.get('name_ar', '').strip()
            name_en = request.form.get('name_en', '').strip()
            icon = request.form.get('icon', '').strip()
            if name_ar and name_en:
                cat = JobCategory(name_ar=name_ar, name_en=name_en, icon=icon)
                db.session.add(cat)
                db.session.commit()
                log_admin_action('create_category', 'category', cat.id, {'name_ar': name_ar})
                flash(f'تم إنشاء التصنيف: {name_ar}', 'success')

        elif action == 'edit':
            cat_id = request.form.get('category_id', type=int)
            cat = JobCategory.get_by_id(cat_id)
            if cat:
                cat.name_ar = request.form.get('name_ar', cat.name_ar)
                cat.name_en = request.form.get('name_en', cat.name_en)
                cat.icon = request.form.get('icon', cat.icon)
                cat.is_active = request.form.get('is_active') == 'on'
                db.session.commit()
                log_admin_action('edit_category', 'category', cat.id, {'name_ar': cat.name_ar})
                flash('تم تحديث التصنيف', 'success')

        elif action == 'delete':
            cat_id = request.form.get('category_id', type=int)
            cat = JobCategory.get_by_id(cat_id)
            if cat:
                name = cat.name_ar
                db.session.delete(cat)
                db.session.commit()
                log_admin_action('delete_category', 'category', cat_id, {'name_ar': name})
                flash(f'تم حذف التصنيف: {name}', 'success')

        return redirect(url_for('admin.manage_categories'))

    categories = JobCategory.get_all()
    return render_template('admin/jobs/categories.html', categories=categories)


# ─────────────────────────────────────────────────────────────
# Content Moderation & Support (Reports)
# ─────────────────────────────────────────────────────────────

@admin_bp.route('/reports')
@admin_login_required
@require_permission('reports')
def list_reports():
    page = request.args.get('page', 1, type=int)
    status_filter = request.args.get('status', '')
    priority_filter = request.args.get('priority', '')
    target_type_filter = request.args.get('target_type', '')

    query = Report.query

    if status_filter:
        query = query.filter_by(status=status_filter)
    if priority_filter:
        query = query.filter_by(priority=priority_filter)
    if target_type_filter:
        query = query.filter_by(target_type=target_type_filter)

    query = query.order_by(Report.created_at.desc())
    pagination = query.paginate(page=page, per_page=20, error_out=False)

    return render_template('admin/reports/list.html',
                           reports=pagination.items,
                           pagination=pagination,
                           status_filter=status_filter,
                           priority_filter=priority_filter,
                           target_type_filter=target_type_filter,
                           REPORT_STATUSES=REPORT_STATUSES,
                           REPORT_STATUS_LABELS=REPORT_STATUS_LABELS,
                           REPORT_PRIORITIES=REPORT_PRIORITIES,
                           REPORT_REASONS=REPORT_REASONS)


@admin_bp.route('/reports/<int:id>')
@admin_login_required
@require_permission('reports')
def view_report(id):
    report = Report.query.get_or_404(id)

    # Resolve target details
    target = None
    if report.target_type == 'customer':
        target = Customers.query.get(report.target_id)
    elif report.target_type == 'company':
        target = Company.query.get(report.target_id)
    elif report.target_type == 'team':
        target = Teams.query.get(report.target_id)
    elif report.target_type == 'job':
        target = Jobs.query.get(report.target_id)

    # Resolve reporter
    reporter = None
    if report.reporter_type == 'customer':
        reporter = Customers.query.get(report.reporter_id)
    elif report.reporter_type == 'company':
        reporter = Company.query.get(report.reporter_id)

    return render_template('admin/reports/view.html',
                           report=report,
                           target=target,
                           reporter=reporter,
                           REPORT_STATUS_LABELS=REPORT_STATUS_LABELS)


@admin_bp.route('/reports/<int:id>/resolve', methods=['POST'])
@admin_login_required
@require_permission('reports.resolve')
def resolve_report(id):
    report = Report.query.get_or_404(id)
    action = request.form.get('action')
    note = request.form.get('resolution_note', '')

    admin = get_current_admin()

    if action == 'resolve':
        report.status = 'resolved'
        report.resolution_note = note
        report.resolved_at = datetime.utcnow()
        report.assigned_admin_id = admin.id
        log_admin_action('resolve_report', 'report', report.id, {'note': note})
        flash('تم حل البلاغ بنجاح', 'success')

    elif action == 'dismiss':
        report.status = 'dismissed'
        report.resolution_note = note
        report.resolved_at = datetime.utcnow()
        report.assigned_admin_id = admin.id
        log_admin_action('dismiss_report', 'report', report.id, {'note': note})
        flash('تم رفض البلاغ', 'info')

    elif action == 'reviewing':
        report.status = 'reviewing'
        report.assigned_admin_id = admin.id
        log_admin_action('assign_report', 'report', report.id)
        flash('تم تعيين البلاغ قيد المراجعة', 'info')

    db.session.commit()
    return redirect(url_for('admin.view_report', id=report.id))


# ─────────────────────────────────────────────────────────────
# Audit Logs
# ─────────────────────────────────────────────────────────────

@admin_bp.route('/audit-logs')
@admin_login_required
@require_permission('audit_logs')
def audit_logs():
    page = request.args.get('page', 1, type=int)
    admin_filter = request.args.get('admin_id', '', type=str)
    action_filter = request.args.get('action', '')

    query = AuditLog.query

    if admin_filter:
        query = query.filter_by(admin_id=int(admin_filter))
    if action_filter:
        query = query.filter_by(action=action_filter)

    query = query.order_by(AuditLog.created_at.desc())
    pagination = query.paginate(page=page, per_page=30, error_out=False)

    admins = Admin.query.all()

    return render_template('admin/audit/logs.html',
                           logs=pagination.items,
                           pagination=pagination,
                           admins=admins,
                           admin_filter=admin_filter,
                           action_filter=action_filter)


# ─────────────────────────────────────────────────────────────
# Billing & Subscriptions
# ─────────────────────────────────────────────────────────────

@admin_bp.route('/billing')
@admin_login_required
@require_permission('billing')
def billing_dashboard():
    total_revenue = Payment.get_total_revenue()
    active_subs = Subscription.get_active_count()
    total_subs = Subscription.query.count()
    total_payments = Payment.query.count()
    plans = SubscriptionPlan.get_active_plans()

    # Revenue this month
    month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    monthly_revenue = db.session.query(db.func.sum(Payment.amount)).filter(
        Payment.status == 'completed',
        Payment.created_at >= month_start,
    ).scalar() or 0.0

    recent_payments = Payment.query.order_by(Payment.created_at.desc()).limit(10).all()

    return render_template('admin/billing/dashboard.html',
                           total_revenue=total_revenue,
                           active_subs=active_subs,
                           total_subs=total_subs,
                           total_payments=total_payments,
                           monthly_revenue=monthly_revenue,
                           plans=plans,
                           recent_payments=recent_payments)


@admin_bp.route('/billing/plans', methods=['GET', 'POST'])
@admin_login_required
@require_permission('billing.crud')
def manage_plans():
    if request.method == 'POST':
        name_ar = request.form.get('name_ar', '').strip()
        name_en = request.form.get('name_en', '').strip()
        price = request.form.get('price', 0, type=float)
        billing_cycle = request.form.get('billing_cycle', 'monthly')
        max_jobs = request.form.get('max_jobs', 5, type=int)
        max_teams = request.form.get('max_teams', 3, type=int)
        description_ar = request.form.get('description_ar', '')
        description_en = request.form.get('description_en', '')
        features_raw = request.form.get('features', '')
        features = [f.strip() for f in features_raw.split('\n') if f.strip()]

        plan = SubscriptionPlan(
            name_ar=name_ar, name_en=name_en, price=price,
            billing_cycle=billing_cycle, max_jobs=max_jobs, max_teams=max_teams,
            description_ar=description_ar, description_en=description_en,
            features=features,
        )
        db.session.add(plan)
        db.session.commit()
        log_admin_action('create_plan', 'plan', plan.id, {'name_ar': name_ar, 'price': price})
        flash('تم إنشاء خطة الاشتراك بنجاح', 'success')
        return redirect(url_for('admin.manage_plans'))

    plans = SubscriptionPlan.query.order_by(SubscriptionPlan.sort_order).all()
    return render_template('admin/billing/plans.html', plans=plans)


@admin_bp.route('/billing/plans/<int:id>/edit', methods=['GET', 'POST'])
@admin_login_required
@require_permission('billing.crud')
def edit_plan(id):
    plan = SubscriptionPlan.query.get_or_404(id)

    if request.method == 'POST':
        plan.name_ar = request.form.get('name_ar', plan.name_ar)
        plan.name_en = request.form.get('name_en', plan.name_en)
        plan.price = request.form.get('price', plan.price, type=float)
        plan.billing_cycle = request.form.get('billing_cycle', plan.billing_cycle)
        plan.max_jobs = request.form.get('max_jobs', plan.max_jobs, type=int)
        plan.max_teams = request.form.get('max_teams', plan.max_teams, type=int)
        plan.description_ar = request.form.get('description_ar', plan.description_ar)
        plan.description_en = request.form.get('description_en', plan.description_en)
        plan.is_active = request.form.get('is_active') == 'on'
        features_raw = request.form.get('features', '')
        import json
        plan.features = json.dumps([f.strip() for f in features_raw.split('\n') if f.strip()], ensure_ascii=False)

        db.session.commit()
        log_admin_action('edit_plan', 'plan', plan.id, {'name_ar': plan.name_ar})
        flash('تم تحديث خطة الاشتراك', 'success')
        return redirect(url_for('admin.manage_plans'))

    return render_template('admin/billing/edit_plan.html', plan=plan)


@admin_bp.route('/billing/subscriptions')
@admin_login_required
@require_permission('billing')
def list_subscriptions():
    page = request.args.get('page', 1, type=int)
    status_filter = request.args.get('status', '')

    query = Subscription.query
    if status_filter:
        query = query.filter_by(status=status_filter)

    query = query.order_by(Subscription.created_at.desc())
    pagination = query.paginate(page=page, per_page=20, error_out=False)

    return render_template('admin/billing/subscriptions.html',
                           subscriptions=pagination.items,
                           pagination=pagination,
                           status_filter=status_filter)


@admin_bp.route('/billing/payments')
@admin_login_required
@require_permission('billing')
def payment_history():
    page = request.args.get('page', 1, type=int)
    status_filter = request.args.get('status', '')

    query = Payment.query
    if status_filter:
        query = query.filter_by(status=status_filter)

    query = query.order_by(Payment.created_at.desc())
    pagination = query.paginate(page=page, per_page=20, error_out=False)

    return render_template('admin/billing/payments.html',
                           payments=pagination.items,
                           pagination=pagination,
                           status_filter=status_filter)


# ─────────────────────────────────────────────────────────────
# System Settings
# ─────────────────────────────────────────────────────────────

@admin_bp.route('/settings', methods=['GET', 'POST'])
@admin_login_required
@require_permission('settings')
def system_settings():
    if request.method == 'POST':
        admin = get_current_admin()
        for key in SETTING_KEYS:
            value = request.form.get(key, '')
            # Boolean fields
            if SETTING_KEYS[key].get('type') == 'boolean':
                value = 'true' if request.form.get(key) == 'on' else 'false'
            SystemSetting.set_value(key, value, admin_id=admin.id)

        log_admin_action('update_settings', 'settings')
        flash('تم تحديث إعدادات النظام', 'success')
        return redirect(url_for('admin.system_settings'))

    settings = SystemSetting.get_all_settings()
    return render_template('admin/settings/general.html',
                           settings=settings,
                           SETTING_KEYS=SETTING_KEYS)


@admin_bp.route('/settings/admins')
@admin_login_required
@require_permission('settings.admins')
def manage_admins():
    admins = Admin.query.order_by(Admin.created_at.desc()).all()
    return render_template('admin/settings/admins.html', admins=admins, ALL_ROLES=ALL_ROLES, ROLE_LABELS=ROLE_LABELS)


@admin_bp.route('/settings/admins/create', methods=['GET', 'POST'])
@admin_login_required
@require_permission('settings.admins')
def create_admin():
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        email = request.form.get('email', '').strip()
        password = request.form.get('password', '')
        role = request.form.get('role', ROLE_SUPPORT_MODERATOR)

        if not all([username, email, password]):
            flash('جميع الحقول المطلوبة يجب ملؤها', 'danger')
            return render_template('admin/settings/admin_form.html', mode='create', ALL_ROLES=ALL_ROLES, ROLE_LABELS=ROLE_LABELS)

        if Admin.get_by_email(email):
            flash('البريد الإلكتروني مسجل بالفعل', 'danger')
            return render_template('admin/settings/admin_form.html', mode='create', ALL_ROLES=ALL_ROLES, ROLE_LABELS=ROLE_LABELS)

        if Admin.get_by_username(username):
            flash('اسم المستخدم مسجل بالفعل', 'danger')
            return render_template('admin/settings/admin_form.html', mode='create', ALL_ROLES=ALL_ROLES, ROLE_LABELS=ROLE_LABELS)

        new_admin = Admin(username=username, email=email, password=password, role=role)
        db.session.add(new_admin)
        db.session.commit()

        log_admin_action('create_admin', 'admin', new_admin.id, {'username': username, 'role': role})
        flash(f'تم إنشاء حساب المدير: {username}', 'success')
        return redirect(url_for('admin.manage_admins'))

    return render_template('admin/settings/admin_form.html', mode='create', ALL_ROLES=ALL_ROLES, ROLE_LABELS=ROLE_LABELS)


@admin_bp.route('/settings/admins/<int:id>/edit', methods=['GET', 'POST'])
@admin_login_required
@require_permission('settings.admins')
def edit_admin(id):
    target_admin = Admin.query.get_or_404(id)

    if request.method == 'POST':
        target_admin.username = request.form.get('username', target_admin.username)
        target_admin.email = request.form.get('email', target_admin.email)
        target_admin.role = request.form.get('role', target_admin.role)
        target_admin.is_active = request.form.get('is_active') == 'on'

        new_password = request.form.get('password', '').strip()
        if new_password:
            target_admin.set_password(new_password)

        db.session.commit()
        log_admin_action('edit_admin', 'admin', target_admin.id, {'username': target_admin.username, 'role': target_admin.role})
        flash('تم تحديث حساب المدير', 'success')
        return redirect(url_for('admin.manage_admins'))

    return render_template('admin/settings/admin_form.html', mode='edit', admin=target_admin, ALL_ROLES=ALL_ROLES, ROLE_LABELS=ROLE_LABELS)


@admin_bp.route('/settings/admins/<int:id>/delete', methods=['POST'])
@admin_login_required
@require_permission('settings.admins')
def delete_admin(id):
    target_admin = Admin.query.get_or_404(id)
    current = get_current_admin()

    if target_admin.id == current.id:
        flash('لا يمكنك حذف حسابك الخاص', 'danger')
        return redirect(url_for('admin.manage_admins'))

    username = target_admin.username
    db.session.delete(target_admin)
    db.session.commit()
    log_admin_action('delete_admin', 'admin', id, {'username': username})
    flash(f'تم حذف حساب المدير: {username}', 'success')
    return redirect(url_for('admin.manage_admins'))
