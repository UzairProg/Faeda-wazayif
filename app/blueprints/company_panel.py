from flask import Blueprint, render_template, redirect, request, session, flash, url_for, abort, current_app, send_from_directory
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
from sqlalchemy import and_, extract
from app import db
import re

# Import existing models
from services.company import Company
from services.customer import Customers, customer_jobs
from services.job import Jobs
from services.teams import Teams
from services.team_offer import TeamOffer
from ai_engine.market_value_calculator import get_market_value_for_customer

company_panel_bp = Blueprint('company_panel', __name__)

# ─────────────────────────────────────────────────────────────
# Company Authentication & Decorators
# ─────────────────────────────────────────────────────────────

def company_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'company_id' not in session or not session.get('session_company'):
            flash('يرجى تسجيل الدخول بحساب شركة أولاً', 'warning')
            return redirect(url_for('company_panel.company_login'))
        return f(*args, **kwargs)
    return decorated_function

def get_current_company():
    if 'company_id' in session:
        return Company.query.get(session['company_id'])
    return None

@company_panel_bp.context_processor
def inject_company_context():
    return dict(current_company=get_current_company())

@company_panel_bp.route('/company/login', methods=['GET', 'POST'])
def company_login():
    if 'company_id' in session and session.get('session_company'):
        return redirect(url_for('company_panel.company_dashboard'))
        
    if request.method == 'POST':
        email = request.form.get('email', '').strip()
        password = request.form.get('password', '')
        comp = Company.query.filter_by(company_email=email).first()
        
        # Check against plain text (legacy) or hashed password
        if comp and (comp.login_password == password or check_password_hash(comp.login_password or '', password)):
            session['session_company'] = True
            session['company_id'] = comp.id
            session['company_email_session'] = email
            if comp.activated:
                session['company_activated'] = True
            flash(f'مرحباً بك في بوابة المنشآت: {comp.company_english_name}', 'success')
            return redirect(url_for('company_panel.company_dashboard'))
        else:
            flash('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'danger')
            
    return render_template('company/auth/login.html')

@company_panel_bp.route('/company/teams', methods=['GET'])
@company_required
def browse_teams():
    all_teams = Teams.query.all()
    for team in all_teams:
        team.num_members = len(team.members)
    return render_template('company/browse_teams.html', teams=all_teams)

@company_panel_bp.route('/company/teams/<int:team_id>', methods=['GET'])
@company_required
def team_details(team_id):
    team = Teams.query.get_or_404(team_id)
    
    # Retrieve team members
    from services.teams import team_members_association
    team_members = db.session.query(
        Customers.id,
        Customers.fullname,
        Customers.email,
        Customers.user_id,
        Customers.cv,
        team_members_association.c.status
    ).join(
        team_members_association,
        team_members_association.c.member_id == Customers.user_id
    ).filter(
        team_members_association.c.team_id == team_id,
        team_members_association.c.status == 'منضم'
    ).all()
    
    return render_template('company/team_details.html', team=team, members=team_members)

@company_panel_bp.route('/company/teams/<int:team_id>/offer', methods=['POST'])
@company_required
def make_offer(team_id):
    team = Teams.query.get_or_404(team_id)
    company_id = session.get('company_id')
    message = request.form.get('message', '').strip()
    job_id = request.form.get('job_id')
    
    if not message:
        flash('يجب كتابة رسالة العرض', 'danger')
        return redirect(url_for('company_panel.browse_teams'))
        
    offer = TeamOffer(
        company_id=company_id,
        team_id=team_id,
        message=message,
        job_id=job_id if job_id else None
    )
    db.session.add(offer)
    db.session.commit()
    flash(f'تم إرسال العرض إلى مجموعة {team.team_name} بنجاح!', 'success')
    return redirect(url_for('company_panel.browse_teams'))

@company_panel_bp.route('/company/register', methods=['GET', 'POST'])
def company_register():
    if 'company_id' in session and session.get('session_company'):
        return redirect(url_for('company_panel.company_dashboard'))
        
    if request.method == 'POST':
        company_name = request.form.get('company_name', '').strip()
        email = request.form.get('email', '').strip()
        password = request.form.get('password', '')
        
        if len(password) < 8 or not re.search(r'[!@#$&*]', password):
            flash('يجب أن تتكون كلمة المرور من 8 أحرف على الأقل وتحتوي على رمز خاص من (!@#$&*)', 'danger')
            return render_template('company/auth/register.html')
        
        if Company.query.filter_by(company_email=email).first():
            flash('البريد الإلكتروني مسجل بالفعل', 'danger')
        else:
            new_comp = Company(
                company_english_name=company_name,
                company_email=email,
                login_password=generate_password_hash(password),
                activated=True
            )
            db.session.add(new_comp)
            db.session.commit()
            
            # Auto login
            session['session_company'] = True
            session['company_id'] = new_comp.id
            session['company_email_session'] = email
            session['company_activated'] = True
            
            flash('تم إنشاء حساب المنشأة بنجاح', 'success')
            return redirect(url_for('company_panel.company_dashboard'))
            
    return render_template('company/auth/register.html')

# ─────────────────────────────────────────────────────────────
# Company Portal Routes
# ─────────────────────────────────────────────────────────────

@company_panel_bp.route('/company/dashboard')
@company_required
def company_dashboard():
    comp_id = session['company_id']
    comp = Company.query.get(comp_id)
    
    active_jobs = Jobs.query.filter_by(company_id=comp_id, status='approved').count()
    total_jobs = Jobs.query.filter_by(company_id=comp_id).count()
    
    # Calculate total applicants by joining jobs
    total_applicants = db.session.query(customer_jobs).join(Jobs, Jobs.id == customer_jobs.c.job_id).filter(Jobs.company_id == comp_id).count()
    
    from services.team_offer import TeamOffer
    total_offers = TeamOffer.query.filter_by(company_id=comp_id).count()
    
    # Calculate Market Value dynamically (100 Points System)
    points = 0.0
    
    # 1. Success Rate (Max 20 pts) - 1% = 0.2 pts
    success = getattr(comp, 'success_rate', 0.0) or 0.0
    points += min(success * 0.2, 20.0)
    
    # 2. Profit Percentage (Max 15 pts) - 1% = 0.15 pts
    profit = getattr(comp, 'profit_percentage', 0.0) or 0.0
    points += min(profit * 0.15, 15.0)
    
    # 3. Number of Projects (Max 15 pts) - 1 project = 1 pt
    projects = getattr(comp, 'number_of_projects', 0) or 0
    points += min(projects * 1.0, 15.0)
    
    # 4. Intellectual Property (Max 10 pts) - 1 IP = 2 pts
    ip = getattr(comp, 'intellectual_property', 0) or 0
    points += min(ip * 2.0, 10.0)
    
    # 5. Reputation (Max 10 pts)
    rep = (getattr(comp, 'reputation', '') or '').strip().upper()
    if 'A+' in rep: points += 10.0
    elif 'A' in rep: points += 8.0
    elif 'B' in rep: points += 6.0
    elif 'C' in rep: points += 4.0
    
    # 6. Social Impact (Max 5 pts)
    social = (getattr(comp, 'social_impact', '') or '').strip().upper()
    if 'HIGH' in social: points += 5.0
    elif 'MEDIUM' in social: points += 3.0
    elif 'LOW' in social: points += 1.0
        
    # 7. Services Provided (Max 5 pts)
    services = (getattr(comp, 'services_provided', '') or '').strip()
    if services and services != 'N/A': points += 5.0
        
    # 8. Project Size (Max 20 pts) - 10 size units = 1 pt (or 1M = 1pt depending on scale)
    size = getattr(comp, 'project_size', 0) or 0
    points += min(size * 0.1, 20.0)
    
    market_value = round(points, 1)
    
    return render_template('company/dashboard.html', 
                           active_jobs=active_jobs, 
                           total_jobs=total_jobs, 
                           total_applicants=total_applicants,
                           total_offers=total_offers,
                           market_value=market_value)

@company_panel_bp.route('/company/profile', methods=['GET', 'POST'])
@company_required
def company_profile():
    comp_id = session['company_id']
    company = Company.query.get(comp_id)
    
    if request.method == 'POST':
        company.company_english_name = request.form.get('english_name')
        company.company_arabic_name = request.form.get('arabic_name')
        company.company_field = request.form.get('industry')
        company.about_company_arabic = request.form.get('about_ar')
        company.about_company_english = request.form.get('about_en')
        company.company_email = request.form.get('email')
        company.company_mobile = request.form.get('mobile')
        
        # Save the 8 new metrics fields
        try:
            company.project_size = int(request.form.get('project_size') or 0)
            company.number_of_projects = int(request.form.get('number_of_projects') or 0)
            company.success_rate = float(request.form.get('success_rate') or 0.0)
            company.profit_percentage = float(request.form.get('profit_percentage') or 0.0)
            company.intellectual_property = int(request.form.get('intellectual_property') or 0)
        except ValueError:
            pass
        company.reputation = request.form.get('reputation', 'N/A')
        company.services_provided = request.form.get('services_provided', 'N/A')
        company.social_impact = request.form.get('social_impact', 'N/A')
        
        # Handle Logo Upload
        if 'logo' in request.files:
            file = request.files['logo']
            if file and file.filename:
                logo_dir = current_app.config.get('UPLOAD_company_logo', 'static/uploads/company/logo')
                os.makedirs(logo_dir, exist_ok=True)
                
                # Delete old logo if exists
                if company.company_logo:
                    old_logo_path = os.path.join(logo_dir, company.company_logo)
                    if os.path.exists(old_logo_path):
                        try:
                            os.remove(old_logo_path)
                        except:
                            pass
                            
                filename = secure_filename(file.filename)
                file_path = os.path.join(logo_dir, filename)
                file.save(file_path)
                company.company_logo = filename
                
        db.session.commit()
        flash('تم تحديث ملف المنشأة بنجاح', 'success')
        return redirect(url_for('company_panel.company_profile'))
        
    return render_template('company/profile.html', company=company)

@company_panel_bp.route('/company/settings', methods=['GET', 'POST'])
@company_required
def company_settings():
    comp_id = session['company_id']
    company = Company.query.get(comp_id)
    
    if request.method == 'POST':
        # Example for password update or email notifications
        new_password = request.form.get('new_password')
        if new_password:
            company.login_password = generate_password_hash(new_password)
            flash('تم تغيير كلمة المرور بنجاح', 'success')
            db.session.commit()
        else:
            flash('تم حفظ الإعدادات بنجاح', 'success')
            
        return redirect(url_for('company_panel.company_settings'))
        
    return render_template('company/settings.html', company=company)

@company_panel_bp.route('/company/jobs')
@company_required
def company_jobs_list():
    comp_id = session['company_id']
    jobs = Jobs.query.filter_by(company_id=comp_id).order_by(Jobs.date_posted.desc()).all()
    return render_template('company/jobs.html', jobs=jobs)

@company_panel_bp.route('/company/jobs/add', methods=['GET', 'POST'])
@company_required
def add_job():
    comp_id = session['company_id']
    company = Company.query.get(comp_id)
    
    if request.method == 'POST':
        # Ensure company has completed basic profile fields before adding job
        if not (company.company_english_name and company.company_email and company.company_mobile and company.company_field):
            flash('يجب عليك إكمال جميع بيانات المنشأة الأساسية (الاسم، الإيميل، الجوال، والمجال) قبل نشر وظيفة', 'error')
            return redirect(url_for('company_panel.company_profile'))
            
        job_type = request.form.get('job_type')
        title = request.form.get('title')
        town = request.form.get('city')
        company_about = request.form.get('company_about')
        job_description = request.form.get('job_description')
        specialization = request.form.get('specialization')
        skills_years = request.form.get('skills_years')
        educational_qualification = request.form.get('educational_qualification')
        workplace = request.form.get('workplace')
        workdays = request.form.get('workdays')
        rest_days = request.form.get('rest_days')
        selected_languages = request.form.getlist('languages')
        languages = ','.join(selected_languages) if selected_languages else request.form.get('languages')
        work_hours = request.form.get('work_hours')

        # Validate required fields
        if not title or not town or not job_description or not job_type or not specialization or not company_about or not work_hours or not languages or not educational_qualification or not skills_years or not workplace or not workdays or not rest_days:
            flash('يرجى ملئ جميع الحقول.', 'error')
            return redirect(url_for('company_panel.add_job'))

        # Create a new job listing with status='pending' by default
        new_job = Jobs(
            job_type=job_type,
            title=title,
            town=town,
            company_about=company_about,
            job_description=job_description,
            specialization=specialization,
            skills_years=skills_years,
            educational_qualification=educational_qualification,
            workplace=workplace,
            workdays=workdays,
            rest_days=rest_days,
            work_hours=work_hours,
            languages=languages,
            company_id=comp_id
        )

        db.session.add(new_job)
        db.session.commit()

        flash('تم نشر طلب الوظيفة بنجاح. سيتم مراجعته من قبل الإدارة قريباً.', 'success')
        return redirect(url_for('company_panel.company_jobs_list'))

    return render_template('company/add_job.html', company=company)


@company_panel_bp.route('/company/applicants')
@company_required
def company_applicants_list():
    comp_id = session['company_id']
    
    # Query all applicants for jobs posted by this company
    raw_applicants = db.session.query(
        customer_jobs.c.id.label('app_id'),
        customer_jobs.c.status.label('app_status'),
        customer_jobs.c.timestamp.label('applied_at'),
        Customers,
        Jobs
    ).join(
        Customers, Customers.user_id == customer_jobs.c.customer_id
    ).join(
        Jobs, Jobs.id == customer_jobs.c.job_id
    ).filter(
        Jobs.company_id == comp_id
    ).all()
    
    # Process market value and sort
    processed_applicants = []
    for row in raw_applicants:
        app_id, app_status, applied_at, customer_obj, job_obj = row
        mv_data = get_market_value_for_customer(customer_obj)
        # Store data dynamically on the customer object for template access
        customer_obj.market_value_data = mv_data
        customer_obj.market_value_score = mv_data.get('total_score', 0)
        processed_applicants.append((app_id, app_status, applied_at, customer_obj, job_obj))
        
    # Sort descending by market_value_score
    processed_applicants.sort(key=lambda x: x[3].market_value_score, reverse=True)
    
    return render_template('company/applicants.html', applicants=processed_applicants)

@company_panel_bp.route('/company/update_applicant_status/<int:app_id>', methods=['POST'])
@company_required
def update_applicant_status_api(app_id):
    action = request.form.get('action') # 'accept', 'reject', 'review'
    comp_id = session['company_id']
    
    # Verify this application belongs to a job of this company
    app_record = db.session.query(customer_jobs, Jobs).join(
        Jobs, Jobs.id == customer_jobs.c.job_id
    ).filter(
        customer_jobs.c.id == app_id,
        Jobs.company_id == comp_id
    ).first()
    
    if not app_record:
        abort(403)
        
    if action == 'accept':
        new_status = 'تم القبول النهائي'
    elif action == 'reject':
        new_status = 'تم الرفض'
    else:
        new_status = 'قيد المراجعة'
        
    stmt = customer_jobs.update().where(customer_jobs.c.id == app_id).values(status=new_status)
    db.session.execute(stmt)
    db.session.commit()
    
    flash(f'تم تحديث حالة الطلب', 'success')
    return redirect(url_for('company_panel.company_applicants_list'))

@company_panel_bp.route('/company/download_cv/<string:cv_filename>')
@company_required
def download_cv(cv_filename):
    cv_dir = current_app.config.get('UPLOAD_CUSTOMERS_CV', 'static/uploads/customers/cv')
    return send_from_directory(cv_dir, cv_filename, as_attachment=True)

@company_panel_bp.route('/company/view_cv/<string:cv_filename>')
@company_required
def view_cv(cv_filename):
    cv_dir = current_app.config.get('UPLOAD_CUSTOMERS_CV', 'static/uploads/customers/cv')
    return send_from_directory(cv_dir, cv_filename, as_attachment=False)
