# ==============================================================================
# الوظيفة الأساسية للملف: وحدة (Blueprint) مخصصة لإدارة مسارات الوظائف (Jobs).
# الروابط أو الميزات: إضافة وظائف جديدة، تعديلها، عرض قوائم الوظائف وتفاصيلها.
# المتطلبات الخاصة: يعتمد على نماذج الوظائف والمهارات وقاعدة البيانات (db).
# ==============================================================================
#### jobs.py############

from flask import Blueprint, render_template, redirect, request, session, flash, abort, url_for, jsonify
from services.job import *# noqa: F403
from services.customer import *
from services.skills import *# noqa: F403
from services.company import *# noqa: F403
from services.teams import *# noqa: F403
from services.job_filters import City, JobType, Specialty
from services.job_category import JobCategory

from app import db

job = Blueprint('job' , __name__)
from ai_engine.recommendation_model import get_job_recommendations



    #### register ######

@job.route('/add_new_job')
def add_job_GET():
    """
    Render the page for adding a new job.
    Ensures that the company has completed public, contact, and commercial data before allowing job creation.
    """
    if "session_company" in session:
        ########## get all skills ########
        skill = Skills.query.all()  # noqa: F405
        id = session['company_id']
        company = Company.query.get(id)  # noqa: F405
        # public
        public_data_not_null = Company.is_public_not_null(id)  # noqa: F405
        if not public_data_not_null:
            flash('You have to compelete all missing data')
            return redirect('/company_editprofile/public')
            #contact_data

        contact_data_not_null = Company.is_contact_data_not_null(id)
        if not contact_data_not_null:
            flash('You have to compelete all missing data')
            return redirect('/company_editprofile/contact_data')
        #commercial_data
        data_not_null = Company.is_commercial_data_not_null(id)
        if not data_not_null:
            return redirect('/company_editprofile/commercial_data')
        return render_template('panel/company_panel/add_job.html', skills = skill , company=company)

    else:
        flash('you have to login frist')
        return redirect('/login')

@job.route('/add_new_job', methods=['POST'])
def add_job_post():
    """
    Process the submission of a new job post.
    Validates company profile completeness and required job fields before inserting into the database.
    """
    # Get form data
    id = session['company_id']
        # public
    public_data_not_null = Company.is_public_not_null(id)
    if not public_data_not_null:
        flash('You have to compelete all missing data')
        return redirect('/company_editprofile/public')
                #contact_data

    contact_data_not_null = Company.is_contact_data_not_null(id)
    if not contact_data_not_null:
        flash('You have to compelete all missing data')
        return redirect('/company_editprofile/contact_data')
        #commercial_data
    data_not_null = Company.is_commercial_data_not_null(id)
    if not data_not_null:
        return redirect('/company_editprofile/commercial_data')
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
    languages_string = ','.join(selected_languages)
    languages = languages_string
    work_hours = request.form.get('work_hours')





    # Validate required fields
    if not title or not town or not job_description or not job_type or not specialization or not company_about or not work_hours or not languages or not educational_qualification or not skills_years or not workplace or not workdays or not rest_days:
        flash('يرجى ملئ جميع الحقول.', 'error')
        return redirect("/add_new_job")

    company_id = session['company_id']

    # Create a new job listing
# Create a new job listing
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
        company_id=company_id
    )

# Add the new job to the database
    db.session.add(new_job)
    db.session.commit()

# Access the job_id after it has been assigned by the database


    flash('تهانينا! . تم نشر الوظيفة بنجاح')
    return redirect("/edit-post2")

@job.route('/job-list', defaults={'page': 1})
@job.route('/job-list/<int:page>')
def job_list_get(page):
    """
    Retrieve and display a paginated list of available jobs.
    Integrates AI recommendations if a customer is logged in, displaying recommended jobs first.
    """
    per_page = request.args.get('per_page', 6, type=int)
    application_count = 0
    recommended_jobs = []
    recommended_ids = []
    
    if "session_customer" in session:
        # Get AI Recommendations
        if "user_id" in session:
            customer_id = session['user_id']
            application_count = Customers.get_number_of_job_applications_by_customer_id(customer_id)
            
            # Fetch recommendations (only on page 1 to avoid showing them on every page)
            if page == 1:
                customer_record = Customers.query.get(customer_id)
                target_string_id = customer_record.user_id if customer_record else None
                rec_dicts = get_job_recommendations(target_string_id) if target_string_id else []
                
                if rec_dicts:
                    recommended_ids = [r['job_id'] for r in rec_dicts]
                    # Fetch ORM objects for these IDs
                    rec_jobs_query = Jobs.query.filter(Jobs.id.in_(recommended_ids)).all()
                    rec_jobs_map = {j.id: j for j in rec_jobs_query}
                    
                    # Construct list in the order of recommendations with match scores
                    for r in rec_dicts:
                        j_obj = rec_jobs_map.get(r['job_id'])
                        if j_obj:
                            j_obj.match_score = r['match_score']
                            recommended_jobs.append(j_obj)
                            
    # Build main query excluding recommended jobs
    main_query = Jobs.query.filter_by(status='approved')
    if recommended_ids:
        main_query = main_query.filter(~Jobs.id.in_(recommended_ids))
        
    paginated_jobs = main_query.paginate(page=page, per_page=per_page, error_out=False)
        
    cities = City.get_active_cities()
    job_types = JobType.get_active_job_types()
    categories = JobCategory.get_active_categories()
    specialties = Specialty.get_active_specialties()
    
    return render_template("new_design/jobs.html", 
                           jobs=paginated_jobs,
                           recommended_jobs=recommended_jobs,
                           application_count=application_count, 
                           cities=cities, 
                           job_types=job_types, 
                           categories=categories, 
                           specialties=specialties)

@job.route('/read_job/<int:job_id>')
def read_job(job_id):
    application_count = 0
    cutomer_teams = ""
    is_company_viewer = False

    if "session_customer" in session and "user_id" in session:
        # Customer viewing a job - show apply options and teams
        customer_id = session['user_id']
        application_count = Customers.get_number_of_job_applications_by_customer_id(customer_id)# noqa: F405
        cutomer_teams = Teams.get_teams_for_admin(admin_id = customer_id)# noqa: F405
    elif "session_company" in session:
        # Company viewing a job - read-only view, no apply options
        is_company_viewer = True

    job = Jobs.get_by_id(id=job_id)  # noqa: F405

    if not job:
        abort(404)
        
    # Prevent unauthorized viewing of non-approved jobs
    is_job_owner = 'company_id' in session and session['company_id'] == job.company_id
    is_admin = 'admin_id' in session
    if job.status != 'approved' and not (is_job_owner or is_admin):
        flash('هذه الوظيفة غير متاحة حالياً', 'danger')
        return redirect(url_for('job.job_list_get'))


    return render_template('new_design/apply_order.html' , job=job, application_count=application_count, cutomer_teams=cutomer_teams, is_company_viewer=is_company_viewer)


@job.route('/edit-post')
def edit_post():
    company_id = session['company_id']
        # public
    public_data_not_null = Company.is_public_not_null(company_id)
    if not public_data_not_null:
        flash('You have to compelete all missing data')
        return redirect('/company_editprofile/public')
            #contact_data

    contact_data_not_null = Company.is_contact_data_not_null(company_id)
    if not contact_data_not_null:
        flash('You have to compelete all missing data')
        return redirect('/company_editprofile/contact_data')
        #commercial_data
    data_not_null = Company.is_commercial_data_not_null(company_id)
    if not data_not_null:
        return redirect('/company_editprofile/commercial_data')
    get_company_jobs = Jobs.query.filter_by(company_id=company_id).all()
    id = session['company_id']
    company = Company.query.get(id)
    return render_template('panel/company_panel/company_jobs.html', get_company_jobs=get_company_jobs , company=company)




@job.route('/edit-post2')
def edit_post2():
    company_id = session['company_id']
        # public
    public_data_not_null = Company.is_public_not_null(company_id)
    if not public_data_not_null:
        flash('You have to compelete all missing data')
        return redirect('/company_editprofile/public')
            #contact_data

    contact_data_not_null = Company.is_contact_data_not_null(company_id)
    if not contact_data_not_null:
        flash('You have to compelete all missing data')
        return redirect('/company_editprofile/contact_data')
        #commercial_data
    data_not_null = Company.is_commercial_data_not_null(company_id)
    if not data_not_null:
        return redirect('/company_editprofile/commercial_data')
    get_company_jobs = Jobs.query.filter_by(company_id=company_id).all()
    id = session['company_id']
    company = Company.query.get(id)
    return render_template('panel/company_panel/company_jobs.html', get_company_jobs=get_company_jobs , company=company)


@job.route('/delpost/<int:job_id>')
def delete_post(job_id):
    company_id = session['company_id']
    if Jobs.delete_by_id(job_id, company_id):
        # Redirect to a success page or back to the list of jobs
        return redirect('/edit-post')
    else:
        # Handle error: the job does not exist or does not belong to the logged-in company
        return "Sorry, there was an error!", 404

@job.route('/edit_posted_jobs/<int:job_id>')
def edit_posted_jobs(job_id):
    company_id = session['company_id']
    company = Company.query.get(company_id)
    job_to_edit = Jobs.query.filter_by(id=job_id, company_id=company_id).first()

    if not job_to_edit:

        return "Error: Job not found or not authorized to edit", 403
    job = Jobs.get_by_id(id=job_id)
    selected_languages = job.languages.split(',') if job.languages else []

    return render_template('panel/company_panel/edit_added_jobs.html',job_id=job_id,job = job,selected_languages=selected_languages ,company = company)


@job.route('/editmypost/<int:job_id>')
def editmypost_get(job_id):
    company_id = session['company_id']
    company = Company.query.get(company_id)
    job_to_edit = Jobs.query.filter_by(id=job_id, company_id=company_id).first()

    if not job_to_edit:

        return "Error: Job not found or not authorized to edit", 403
    job = Jobs.get_by_id(id=job_id)
    selected_languages = job.languages.split(',') if job.languages else []

    return render_template('edit_job.html',job_id=job_id,job = job,selected_languages=selected_languages ,company = company)


@job.route('/editmypost/<int:job_id>', methods=['POST'])
def post_edit_job(job_id):
        # Get form data
    job = Jobs.get_by_id(id=job_id)

    job.job_type = request.form.get('job_type')
    job.title = request.form.get('title')
    job.town = request.form.get('city')
    job.company_about = request.form.get('company_about')
    job.job_description = request.form.get('job_description')
    job.specialization = request.form.get('specialization')
    job.skills_years = request.form.get('skills_years')
    job.educational_qualification = request.form.get('educational_qualification')
    job.workplace = request.form.get('workplace')
    job.workdays = request.form.get('workdays')
    job.rest_days = request.form.get('rest_days')
    selected_languages = request.form.getlist('languages')
    languages_string = ','.join(selected_languages)
    job.languages = languages_string
    job.work_hours = request.form.get('work_hours')






    db.session.commit()
    return "all done"

































def paginate(items, page, per_page):
    start = (page - 1) * per_page
    end = start + per_page
    return items[start:end]





@job.route('/update-list', methods=['GET'], defaults={'page': 1})
@job.route('/update-list/<int:page>')
def update_list(page):
    # Retrieve query parameters
    job_type = request.args.get('ttype')
    specialization = request.args.get('study')
    city = request.args.get('city')
    title = request.args.get('title')

    # Construct the base query
    query = Jobs.query.filter_by(status='approved')

    # Apply filters if parameters are provided
    if title:
        query = query.filter(Jobs.title.ilike(f'%{title}%'))

    if job_type:
        jt_obj = JobType.query.filter_by(name_ar=job_type).first()
        if jt_obj and jt_obj.name_en:
            query = query.filter(Jobs.job_type.ilike(f'%{jt_obj.name_en}%'))
        else:
            query = query.filter(Jobs.job_type == job_type)

    if specialization:
        spec_obj = Specialty.query.filter_by(name_ar=specialization).first()
        if spec_obj and spec_obj.name_en:
            # name_en might contain multiple English equivalents separated by | (e.g. 'Finance|Accounting')
            if '|' in spec_obj.name_en:
                from sqlalchemy import or_
                conditions = [Jobs.specialization.ilike(f'%{s}%') for s in spec_obj.name_en.split('|')]
                query = query.filter(or_(*conditions))
            else:
                query = query.filter(Jobs.specialization.ilike(f'%{spec_obj.name_en}%'))
        else:
            query = query.filter(Jobs.specialization == study)

    if city:
        if city == 'الرياض': query = query.filter(Jobs.town.ilike('%Riyadh%'))
        elif city == 'جدة': query = query.filter(Jobs.town.ilike('%Jeddah%') | Jobs.town.ilike('%Jiddah%'))
        elif city == 'الدمام': query = query.filter(Jobs.town.ilike('%Dammam%'))
        elif city == 'الظهران': query = query.filter(Jobs.town.ilike('%Dhahran%'))
        elif city == 'الخبر': query = query.filter(Jobs.town.ilike('%Khobar%'))
        elif city == 'مكة المكرمة' or city == 'مكة': query = query.filter(Jobs.town.ilike('%Mecca%') | Jobs.town.ilike('%Makkah%'))
        elif city == 'المدينة المنورة': query = query.filter(Jobs.town.ilike('%Medina%') | Jobs.town.ilike('%Madinah%'))
        else: query = query.filter(Jobs.town.in_(city.split('|')) | (Jobs.town == city))

    recommended_jobs = []
    recommended_ids = []
    
    if page == 1 and "user_id" in session:
        customer_id = session['user_id']
        try:
            # Get recommendations
            customer_record = Customers.query.get(customer_id)
            target_string_id = customer_record.user_id if customer_record else None
            rec_dicts = get_job_recommendations(target_string_id) if target_string_id else []
            if rec_dicts:
                # Extract IDs
                recommended_ids = [r['job_id'] for r in rec_dicts]
                # Fetch ORM objects for these IDs
                rec_jobs_query = Jobs.query.filter(Jobs.id.in_(recommended_ids)).all()
                rec_jobs_map = {j.id: j for j in rec_jobs_query}
                
                # Construct list in the order of recommendations with match scores
                for r in rec_dicts:
                    j_obj = rec_jobs_map.get(r['job_id'])
                    if j_obj:
                        j_obj.match_score = r['match_score']
                        recommended_jobs.append(j_obj)
        except Exception as e:
            print("Error getting AI recommendations:", e)
            
    if recommended_ids:
        query = query.filter(~Jobs.id.in_(recommended_ids))

    per_page = request.args.get('per_page', 6, type=int)

    # Paginate the filtered jobs
    paginated_jobs = query.paginate(page=page, per_page=per_page, error_out=False)

    cities = City.get_active_cities()
    job_types = JobType.get_active_job_types()
    categories = JobCategory.get_active_categories()
    specialties = Specialty.get_active_specialties()

    # Render the template with the paginated jobs
    return render_template('new_design/jobs.html', 
                           jobs=paginated_jobs, 
                           recommended_jobs=recommended_jobs,
                           cities=cities, 
                           job_types=job_types, 
                           categories=categories, 
                           specialties=specialties)


# ==============================================================================
# JSON REST API ENDPOINTS FOR FRONTEND JOBS MODULE
# ==============================================================================

def serialize_job_summary(j):
    company = j.company
    company_name = (company.company_arabic_name or company.company_english_name) if company else "جهة توظيف"
    company_logo = company.company_logo if company else None
    
    skills_list = []
    if j.required_skills:
        skills_list = [s.strip() for s in j.required_skills.split(",") if s.strip()]
    elif j.specialization:
        skills_list = [j.specialization]

    excerpt = j.job_description[:160] + "..." if j.job_description and len(j.job_description) > 160 else j.job_description

    work_type = "full_time"
    if j.job_type:
        jt_lower = j.job_type.lower()
        if "جزئي" in jt_lower or "part" in jt_lower:
            work_type = "part_time"
        elif "عن بعد" in jt_lower or "remote" in jt_lower:
            work_type = "remote"
        elif "هجين" in jt_lower or "hybrid" in jt_lower:
            work_type = "hybrid"
        elif "عقد" in jt_lower or "contract" in jt_lower:
            work_type = "contract"

    exp_level = "mid"
    if j.skills_years:
        if "1" in j.skills_years or "مبتدئ" in j.skills_years:
            exp_level = "entry"
        elif "5" in j.skills_years or "خبير" in j.skills_years or "Senior" in j.title:
            exp_level = "senior"

    return {
        "id": str(j.id),
        "title": j.title,
        "company": {
            "id": str(j.company_id),
            "name": company_name,
            "logoUrl": company_logo,
            "location": company.state if company else j.town,
            "isVerified": company.is_verified if company else False,
        },
        "location": j.town,
        "isRemote": "عن بعد" in (j.workplace or "") or "remote" in (j.workplace or "").lower(),
        "workType": work_type,
        "experienceLevel": exp_level,
        "skills": skills_list,
        "salary": {
            "min": j.salary_min or 0,
            "max": j.salary_max or 0,
            "currency": "SAR",
            "period": "monthly",
            "isDisclosed": bool(j.salary_min or j.salary_max)
        } if (j.salary_min or j.salary_max) else None,
        "postedAt": j.date_posted.isoformat() if j.date_posted else datetime.utcnow().isoformat(),
        "updatedAt": j.date_posted.isoformat() if j.date_posted else datetime.utcnow().isoformat(),
        "status": "published" if j.status == "approved" else j.status,
        "isTeamFriendly": True,
        "excerpt": excerpt,
    }


def serialize_job_detail(j):
    base = serialize_job_summary(j)

    requirements = []
    if j.educational_qualification:
        requirements.append(f"المؤهل التعليمي: {j.educational_qualification}")
    if j.skills_years:
        requirements.append(f"خبرة مطلوبة: {j.skills_years}")
    if j.languages:
        requirements.append(f"اللغات: {j.languages}")

    responsibilities = [
        "إدارة وتنفيذ المهمة اليومية المطلوبة بكفاءة عالية وبما يضمن تحقيق الجودة.",
        "التنسيق مع أعضاء الفريق وأصحاب المصلحة وتحديث التقارير الدورية.",
    ]

    return {
        **base,
        "description": j.job_description or "",
        "responsibilities": responsibilities,
        "requirements": requirements if requirements else ["إتقان المهارات التقنية الواردة في تفاصيل الوظيفة."],
        "applicationDeadline": None,
        "applicationCount": None,
    }


@job.route('/api/v1/jobs')
def api_get_jobs():
    q = request.args.get('q', '').strip()
    location = request.args.get('location', '').strip()
    work_type_param = request.args.get('work_type', '').strip()
    experience_param = request.args.get('experience', '').strip()
    salary_disclosed = request.args.get('salary_disclosed', '').strip()
    category_param = request.args.get('category', '').strip()
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('page_size', 10))

    query = Jobs.query.filter_by(status='approved')

    if q:
        query = query.filter(
            db.or_(
                Jobs.title.ilike(f"%{q}%"),
                Jobs.job_description.ilike(f"%{q}%"),
                Jobs.specialization.ilike(f"%{q}%"),
                Jobs.required_skills.ilike(f"%{q}%")
            )
        )

    if location:
        query = query.filter(
            db.or_(
                Jobs.town.ilike(f"%{location}%"),
                Jobs.workplace.ilike(f"%{location}%")
            )
        )

    if category_param:
        query = query.filter(Jobs.category.ilike(f"%{category_param}%"))

    if work_type_param:
        types = [t.strip().lower() for t in work_type_param.split(',') if t.strip()]
        type_clauses = []
        for t in types:
            if t == "full_time":
                type_clauses.append(Jobs.job_type.ilike("%كامل%") | Jobs.job_type.ilike("%full%"))
            elif t == "part_time":
                type_clauses.append(Jobs.job_type.ilike("%جزئي%") | Jobs.job_type.ilike("%part%"))
            elif t == "remote":
                type_clauses.append(Jobs.job_type.ilike("%عن بعد%") | Jobs.job_type.ilike("%remote%") | Jobs.workplace.ilike("%عن بعد%"))
            elif t == "hybrid":
                type_clauses.append(Jobs.job_type.ilike("%هجين%") | Jobs.job_type.ilike("%hybrid%"))
            elif t == "contract":
                type_clauses.append(Jobs.job_type.ilike("%عقد%") | Jobs.job_type.ilike("%contract%"))
            else:
                type_clauses.append(Jobs.job_type.ilike(f"%{t}%"))
        if type_clauses:
            query = query.filter(db.or_(*type_clauses))

    if experience_param:
        exps = [e.strip().lower() for e in experience_param.split(',') if e.strip()]
        exp_clauses = []
        for e in exps:
            if e == "entry":
                exp_clauses.append(Jobs.skills_years.ilike("%1%") | Jobs.skills_years.ilike("%مبتدئ%") | Jobs.title.ilike("%junior%"))
            elif e == "senior":
                exp_clauses.append(Jobs.skills_years.ilike("%5%") | Jobs.skills_years.ilike("%خبير%") | Jobs.title.ilike("%senior%"))
            elif e == "mid":
                exp_clauses.append(Jobs.skills_years.ilike("%2%") | Jobs.skills_years.ilike("%3%") | Jobs.skills_years.ilike("%4%") | Jobs.skills_years.ilike("%متوسط%"))
        if exp_clauses:
            query = query.filter(db.or_(*exp_clauses))

    if salary_disclosed.lower() == "true":
        query = query.filter(db.or_(Jobs.salary_min > 0, Jobs.salary_max > 0))

    paginated = query.order_by(Jobs.date_posted.desc()).paginate(page=page, per_page=page_size, error_out=False)

    return jsonify({
        "jobs": [serialize_job_summary(j) for j in paginated.items],
        "total": paginated.total,
        "page": paginated.page,
        "pageSize": paginated.per_page,
        "totalPages": paginated.pages,
    })


@job.route('/api/v1/jobs/<int:job_id>')
def api_get_job_detail(job_id):
    job_obj = Jobs.query.get(job_id)
    if not job_obj or job_obj.status != 'approved':
        return jsonify({"message": "الوظيفة غير متاحة حالياً"}), 404

    return jsonify(serialize_job_detail(job_obj))


@job.route('/api/v1/jobs/suggestions')
def api_get_job_suggestions():
    q = request.args.get('q', '').strip()
    sug_type = request.args.get('type', 'all').strip().lower()

    if not q or len(q) < 2:
        return jsonify({"suggestions": []})

    suggestions = []

    # 1. Location / City Suggestions
    if sug_type in ['all', 'location']:
        cities = City.query.filter(
            City.is_active == True,
            db.or_(
                City.name_ar.ilike(f"%{q}%"),
                City.name_en.ilike(f"%{q}%")
            )
        ).limit(5).all()

        for c in cities:
            suggestions.append({
                "type": "city",
                "id": f"city-{c.id}",
                "label": c.name_ar,
                "category": "مدينة",
                "filterType": "location",
                "value": c.name_ar
            })

    # 2. Keyword / Company / Job / Skill Suggestions
    if sug_type in ['all', 'keyword']:
        # Companies
        companies = Company.query.filter(
            db.or_(
                Company.company_arabic_name.ilike(f"%{q}%"),
                Company.company_english_name.ilike(f"%{q}%")
            )
        ).limit(4).all()

        for comp in companies:
            c_name = comp.company_arabic_name or comp.company_english_name
            suggestions.append({
                "type": "company",
                "id": f"comp-{comp.id}",
                "label": c_name,
                "subLabel": comp.state or "السعودية",
                "category": "شركة",
                "filterType": "keyword",
                "value": c_name
            })

        # Jobs
        job_records = Jobs.query.filter(
            Jobs.status == 'approved',
            db.or_(
                Jobs.title.ilike(f"%{q}%"),
                Jobs.specialization.ilike(f"%{q}%")
            )
        ).limit(5).all()

        for j in job_records:
            comp_name = (j.company.company_arabic_name or j.company.company_english_name) if j.company else None
            suggestions.append({
                "type": "job",
                "id": f"job-{j.id}",
                "label": j.title,
                "subLabel": comp_name,
                "category": "وظيفة",
                "filterType": "keyword",
                "value": j.title
            })

        # Unique skills matching from Jobs
        all_jobs_with_skills = Jobs.query.filter(
            Jobs.status == 'approved',
            Jobs.required_skills.ilike(f"%{q}%")
        ).limit(10).all()

        seen_skills = set()
        for j in all_jobs_with_skills:
            if j.required_skills:
                for s in j.required_skills.split(','):
                    s_clean = s.strip()
                    if s_clean and q.lower() in s_clean.lower() and s_clean.lower() not in seen_skills:
                        seen_skills.add(s_clean.lower())
                        suggestions.append({
                            "type": "skill",
                            "id": f"skill-{s_clean}",
                            "label": s_clean,
                            "category": "مهارة",
                            "filterType": "keyword",
                            "value": s_clean
                        })
                        if len(seen_skills) >= 3:
                            break

    return jsonify({"suggestions": suggestions})


