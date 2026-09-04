# ==============================================================================
# الوظيفة الأساسية للملف: وحدة (Blueprint) تحتوي على جميع مسارات (Routes) لوحة تحكم الشركات.
# الروابط أو الميزات: مسارات إدارة ملف الشركة، متابعة المتقدمين للوظائف، والفرق (Teams).
# المتطلبات الخاصة: يعتمد على نماذج الشركة والعملاء (services.company, services.customer) وجلسات فلاسك.
# ==============================================================================
#### companies.py############
from flask import Blueprint, render_template, redirect, request, session, flash, current_app, url_for, send_from_directory, abort, jsonify
from services.company import *
from services.customer import *
from services.job import *
from werkzeug.utils import secure_filename
import os
from sqlalchemy import and_, extract
from services.teams import *  # Ensure Teams is correctly imported

from app import db


company = Blueprint('company' , __name__)


####### upload company logo ############
UPLOAD_company_logo ='static/uploads/company/logo'



ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

    #### register ######

@company.route('/applicants/<int:job_id>')
def job_applicants2(job_id):
    job = Jobs.query.get(job_id)

    if job is None:
        return "Job not found", 404

    applicants_individual = job.customers
    applicants_teams = job.teams if job.teams else []
    id = session['company_id']
    company = Company.query.get(id)
    return render_template(
        '/panel/company_panel/all_applicants.html',
        company = company,
        applicants_teams=applicants_teams,
        Teams=Teams,
        applicants=applicants_individual,
        job=job,
        applicants_individual=applicants_individual,
        Customers=Customers,
        jobid=job_id
    )

################## recommended ##################

@company.route('/applicants_recommended/<int:job_id>')
def job_applicants_recommended(job_id):
    # Query the database to get the job details
    job = Jobs.query.get(job_id)

    if job is None:
        return "Job not found", 404

    # Get the applicants with status "recommended" for this job
    recommended_applicants = db.session.query(Customers).\
        join(customer_jobs, Customers.user_id == customer_jobs.c.customer_id).\
        filter(customer_jobs.c.job_id == job_id, customer_jobs.c.status == "تم الترشيح قبل النهائي").\
        all()  # noqa: F405
    # Render a template to display the recommended applicants
    id = session['company_id']
    company = Company.query.get(id)
    return render_template('/panel/company_panel/all_applicants.html',company = company, job=job, applicants_recommend=recommended_applicants, Customers=Customers, jobid=job_id)
################################## approved ##############################

@company.route('/applicants_approved/<int:job_id>')
def job_applicants_approved(job_id):
    # Query the database to get the job details
    job = Jobs.query.get(job_id)

    if job is None:
        # Handle the case where the job doesn't exist
        return "Job not found", 404

    # Get the applicants with status "recommended" for this job
    recommended_applicants = db.session.query(Customers).\
        join(customer_jobs, Customers.user_id == customer_jobs.c.customer_id).\
        filter(customer_jobs.c.job_id == job_id, customer_jobs.c.status == "تم القبول النهائي").\
        all()
    id = session["company_id"]
    company = Company.query.get(id)
    # Render a template to display the recommended applicants
    return render_template('/panel/company_panel/all_applicants.html',company = company, job=job, applicants_accept=recommended_applicants, Customers=Customers, jobid=job_id)
#################################### rejected####################################
@company.route('/applicants_rejected/<int:job_id>')
def applicants_rejected(job_id):
    # Query the database to get the job details
    job = Jobs.query.get(job_id)

    if job is None:
        # Handle the case where the job doesn't exist
        return "Job not found", 404

    # Get the applicants with status "recommended" for this job
    recommended_applicants = db.session.query(Customers).\
        join(customer_jobs, Customers.user_id == customer_jobs.c.customer_id).\
        filter(customer_jobs.c.job_id == job_id, customer_jobs.c.status == "تم الرفض").\
        all()
    id = session["company_id"]
    company = Company.query.get(id)
    # Render a template to display the recommended applicants
    return render_template('/panel/company_panel/all_applicants.html',company = company, job=job, applicants_reject=recommended_applicants, Customers=Customers, jobid=job_id)

########################################################################
@company.route('/team_applicant/<int:job_id>/<int:team_id>')
def team_applicants(job_id, team_id):
    # استرجاع كائنات الفريق والوظيفة
    team = Teams.query.get_or_404(team_id, description=f"Team with ID {team_id} not found")
    job = Jobs.query.get_or_404(job_id, description=f"Job with ID {job_id} not found")

    # استرجاع معرفات أعضاء الفريق
    team_member_ids = Teams.get_member_ids_by_team_id(team_id=team_id)

    # التحقق من وجود أعضاء الفريق
    if not team_member_ids:
        abort(404, description=f"No members found for team with ID {team_id}")

    # استرجاع تفاصيل الأعضاء المتقدمين مع حالة الطلب
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
        Customers.user_id.in_(team_member_ids)
    ).all()
    id = session['company_id']
    company = Company.query.get(id)
    # عرض القالب مع معلومات الفريق والوظيفة والمتقدمين
    return render_template('/panel/company_panel/team_applicants.html',company = company, Customers=Customers, team=team, job=job, applicants=team_members)

########################################################################
@company.route('/update_status/<int:job_id>', methods=['POST'])
def update_status(job_id):
    if request.method == 'POST':
        selected_applicants = request.form.getlist('selected_applicants[]')
        print(selected_applicants)
        for applicant_id in selected_applicants:
            # Query the database to get the job applicant
            # لو كان المتقدم فردي
            applicant_nid = Customers.get_customer_id_by_user_id(applicant_id)
            applicant = Customers.query.get(applicant_nid)

            if applicant:
                # Handle form submission to update the applicant's status
                new_status = request.form.get(f'status_{applicant_id}')
                new_note = request.form.get(f'note_{applicant_id}')

                # Update the applicant's status and note in the association table
                customer_jobs_query = db.session.query(customer_jobs.c.id).filter(
                    customer_jobs.c.customer_id == applicant_id,
                    customer_jobs.c.job_id == job_id
                )

                # Fetch the id if the record exists
                customer_jobs_id = customer_jobs_query.scalar()
                if customer_jobs_id is not None:
                    # Now you can update the status for this record
                    db.session.query(customer_jobs).filter(
                        customer_jobs.c.id == customer_jobs_id
                    ).update({'status': new_status, 'note': new_note})
                    db.session.commit()
                else:
                    # Handle the case where no matching record was found
                    print(f"No matching record found for customer_id {applicant_id} and job_id {job_id}.")

        # Redirect back to the applicant details page after updating
        return redirect(f"/applicants/{job_id}")
    # For GET requests, render the form



@company.route('/download_cv/<string:cv_filename>')
def download_cv(cv_filename):
    cv_dir = current_app.config['UPLOAD_CUSTOMERS_CV']

    # Serve the CV file from the specified directory
    return send_from_directory(cv_dir, cv_filename, as_attachment=True)
# Define your route to display all applicants and handle filtering



@company.route('/company_editprofile', methods=['POST'])
def company_editprofile():
    if 'company_id' in session:
        commercial_register = os.path.join(current_app.config['UPLOAD_COMPANY_COMMERCIAL_REGISTER'])
        company_logo = os.path.join(current_app.config['UPLOAD_company_logo'])

        # Create the directories if they don't exist
        os.makedirs(commercial_register, exist_ok=True)
        os.makedirs(company_logo, exist_ok=True)
        company_id = session['company_id']
        company = Company.query.get(company_id)

        company.company_arabic_name = request.form.get('arabic_name')
        company.company_english_name = request.form.get('english_name')
        company.company_email = request.form.get('company_email')
        company.country = request.form.get('country')
        company.state = request.form.get('state')
        company.english_adress = request.form.get('english_adress')
        company.company_type = request.form.get('company_type')
        company.company_size = request.form.get('company_size')
        company.company_field = request.form.get('company_field')
        company.hr_name = request.form.get('hr_name')
        company.hr_mobile = request.form.get('hr_mobile')
        company.hr_email = request.form.get('hr_email')
        company.about_company_arabic = request.form.get('ar_about_company')
        company.about_company_english = request.form.get('en_about_company')
        company.company_website = request.form.get('company_website')
        company.twitter_email = request.form.get('tweeter_email')
        company.instagram_email = request.form.get('instagram_email')
        company.company_name_on_faeda = request.form.get('faeda_company_name')

        company.commercial_register  =  Company.get_company_commercial_register_by_company_id(id=company_id)
        company.company_logo  =  Company.get_company_company_logo_by_company_id(id=company_id)



        if 'new_commercial_register' in request.files:
            file = request.files['new_commercial_register']

            # Check if a new CV file was provided
            if file and file.filename:
                # Delete the old CV file if it exists
                if company.commercial_register:
                    old_cv_path = os.path.join(commercial_register, company.commercial_register)
                    if os.path.exists(old_cv_path):
                        os.remove(old_cv_path)

                # Process and save the new CV
                filename = secure_filename(file.filename)
                file_path = os.path.join(current_app.config['UPLOAD_COMPANY_COMMERCIAL_REGISTER'], filename)
                file.save(file_path)
                new_cv = filename
                # Update the user's CV field with the new CV filename
                company.commercial_register = new_cv

            if 'new_company_logo' in request.files:
                file = request.files['new_company_logo']

                # Check if a new CV file was provided
                if file and file.filename:
                    # Delete the old CV file if it exists
                    if company.company_logo:
                        old_cv_path = os.path.join(commercial_register, company.company_logo)
                        if os.path.exists(old_cv_path):
                            os.remove(old_cv_path)

                    # Process and save the new CV
                    filename = secure_filename(file.filename)
                    file_path = os.path.join(current_app.config['UPLOAD_company_logo'], filename)
                    file.save(file_path)
                    new_cv = filename
                    # Update the user's CV field with the new CV filename
                    company.company_logo = new_cv


        # Commit the changes to the database
        db.session.commit()

        flash('تم تحديث البيانات بنجاح', 'success')
        return redirect('/')


    # Handle cases where the user is not logged in
    flash('You must be logged in to edit your profile.', 'warning')
    return redirect('/login')

'''

   * company_arabic_name
    *company_english_name

    *about_company_arabic
    *about_company_english
    *company_logo
    company_name_on_faeda
    country
    state
    english_adress



    company_email
    company_mobile
    company_website
    twitter_email
    instagram_email


    commercial_register
    company_type
    company_size
    company_field

    hr_name
    hr_mobile
    hr_email






'''
@company.route('/company_editprofile/public')
def get_company_editprofile_public():
    if 'company_id' in session:
        id = session['company_id']
        arabic_name = Company.get_company_arabic_name_by_company_id(id=id)
        english_name =  Company.get_company_english_name_by_company_id(id=id)
        company_logo = Company.get_company_company_logo_by_company_id(id=id)
        ar_about_company = Company.get_company_ar_about_company_by_company_id(id=id)
        en_about_company = Company.get_company_en_about_company_by_company_id(id=id)
        faeda_company_name = Company.get_company_faeda_company_name_by_company_id(id=id)
        country = Company.get_company_country_by_company_id(id=id)
        state = Company.get_company_state_by_company_id(id=id)
        english_adress = Company.get_company_english_adress_by_company_id(id=id)





        company = Company.query.get(id)

        return render_template("/panel/company_panel/public_company_info.html",faeda_company_name= faeda_company_name,company_logo=company_logo,user=company,en_about_company=en_about_company,ar_about_company = ar_about_company,english_adress = english_adress,arabic_name = arabic_name , english_name = english_name ,country = country, state=state)

@company.route('/company_editprofile/public', methods=['POST'])
def company_editprofile_public():
    if 'company_id' in session:
        company_logo = os.path.join(current_app.config['UPLOAD_company_logo'])

        # Create the directories if they don't exist
        os.makedirs(company_logo, exist_ok=True)
        company_id = session['company_id']
        company = Company.query.get(company_id)

        company.company_arabic_name = request.form.get('arabic_name')
        company.company_english_name = request.form.get('english_name')
        company.english_adress = request.form.get('english_adress')
        company.about_company_arabic = request.form.get('ar_about_company')
        company.about_company_english = request.form.get('en_about_company')
        company.company_name_on_faeda = request.form.get('faeda_company_name')
        company.country = request.form.get('country')
        company.state = request.form.get('state')
        company.company_logo  =  Company.get_company_company_logo_by_company_id(id=company_id)




            # Check if a new CV file was provided

        if 'new_company_logo' in request.files:
                file = request.files['new_company_logo']

                # Check if a new CV file was provided
                if file and file.filename:
                    # Delete the old CV file if it exists
                    if company.company_logo:
                        old_cv_path = os.path.join(company.company_logo)
                        if os.path.exists(old_cv_path):
                            os.remove(old_cv_path)

                    # Process and save the new CV
                    filename = secure_filename(file.filename)
                    file_path = os.path.join(current_app.config['UPLOAD_company_logo'], filename)
                    file.save(file_path)
                    new_cv = filename
                    # Update the user's CV field with the new CV filename
                    company.company_logo = new_cv


        # Commit the changes to the database
        db.session.commit()

        flash('تم تحديث البيانات بنجاح', 'success')
        return redirect('/company_editprofile/public')


    # Handle cases where the user is not logged in
    flash('You must be logged in to edit your profile.', 'warning')
    return redirect('/login')

@company.route('/company_editprofile/contact_data')
def get_company_editprofile_contact_data():
    if 'company_id' in session:
        id = session['company_id']
        company_email  = Company.get_company_company_email_by_company_id(id=id)
        company_website = Company.get_company_company_website_by_company_id(id=id)
        tweeter_email = Company.get_company_tweeter_email_by_company_id(id=id)
        instagram_email = Company.get_company_instagram_email_by_company_id(id=id)
        company = Company.query.get(id)

        return render_template("/panel/company_panel/company_contact_data.html",
                               instagram_email = instagram_email,
                               tweeter_email = tweeter_email,
                               company_website = company_website,
                               user=company,
                                company_email = company_email,
                                )


@company.route('/company_editprofile/contact_data', methods=['POST'])
def company_editprofile_contact_data():
    if 'company_id' in session:


        company_id = session['company_id']
        company = Company.query.get(company_id)



        company.company_website = request.form.get('company_website')
        company.twitter_email = request.form.get('tweeter_email')
        company.instagram_email = request.form.get('instagram_email')
        company.company_name_on_faeda = request.form.get('faeda_company_name')


        # Commit the changes to the database
        db.session.commit()

        flash('تم تحديث البيانات بنجاح', 'success')
        return redirect('/company_editprofile/contact_data')


    # Handle cases where the user is not logged in
    flash('You must be logged in to edit your profile.', 'warning')
    return redirect('/login')

@company.route('/see_teams')
def see_teams():
    if "company_id" in session:
            id = session["company_id"]
            company = Company.query.get(id)
            all_teams = Teams.query.all()
            for team in all_teams:
                team.num_members = len(team.members)
            return render_template("panel/company_panel/see_teams.html",company = company,all_teams = all_teams)
    else:
        flash("يجب تسجيل الدخول بحساب الشركة")
        return redirect("/login")

@company.route('/visit_team_profile/<int:team_id>')
def visit_team_profile(team_id):
    team_id = team_id
    id = session["company_id"]
    company = Teams.query.get(id) # noqa: F405
    
    team = Teams.query.get(team_id)
    
    
    
    
    # استرجاع معرفات أعضاء الفريق
    team_member_ids = Teams.get_member_ids_by_team_id(team_id=team_id)

    # التحقق من وجود أعضاء الفريق
    if not team_member_ids:
        abort(404, description=f"No members found for team with ID {team_id}")

    # استرجاع تفاصيل الأعضاء المتقدمين مع حالة الطلب
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
        Customers.user_id.in_(team_member_ids)
    ).all()
    id = session['company_id']
    company = Company.query.get(id)
    job = Jobs.query.get(1)
    return render_template('/panel/company_panel/visit_team.html',job =job,team =team , company=company, Customers = Customers  , applicants=team_members ) # noqa: F405



@company.route('/company_editprofile/commercial_data')
def get_company_editprofile_commercial_data():
    if 'company_id' in session:
        id = session['company_id']

        company_type = Company.get_company_company_type_by_company_id(id=id)

        company_size = Company.get_company_company_size_by_company_id(id=id)

        company_field = Company.get_company_company_field_by_company_id(id=id)

        hr_name = Company.get_company_hr_name_by_company_id(id=id)

        hr_mobile = Company.get_company_hr_mobile_by_company_id(id=id)

        hr_email = Company.get_company_hr_email_by_company_id(id=id)



        company = Company.query.get(id)

        return render_template("/panel/company_panel/company_commercial_data.html",

                               user=company,

                               hr_email= hr_email,
                               hr_mobile=hr_mobile,
                               hr_name = hr_name,
                               company_field = company_field,
                               company_size = company_size ,
                               company_type = company_type,
                               )



@company.route('/company_editprofile/commercial_data', methods=['POST'])
def company_editprofile_commercial_data():
    if 'company_id' in session:
        commercial_register = os.path.join(current_app.config['UPLOAD_COMPANY_COMMERCIAL_REGISTER'])

        # Create the directories if they don't exist
        os.makedirs(commercial_register, exist_ok=True)
        company_id = session['company_id']
        company = Company.query.get(company_id)


        company.company_type = request.form.get('company_type')
        company.company_size = request.form.get('company_size')
        company.company_field = request.form.get('company_field')
        company.hr_name = request.form.get('hr_name')
        company.hr_mobile = request.form.get('hr_mobile')
        company.hr_email = request.form.get('hr_email')


        company.commercial_register  =  Company.get_company_commercial_register_by_company_id(id=company_id)



        if 'new_commercial_register' in request.files:
            file = request.files['new_commercial_register']

            # Check if a new CV file was provided
            if file and file.filename:
                # Delete the old CV file if it exists
                if company.commercial_register:
                    old_cv_path = os.path.join(commercial_register, company.commercial_register)
                    if os.path.exists(old_cv_path):
                        os.remove(old_cv_path)

                # Process and save the new CV
                filename = secure_filename(file.filename)
                file_path = os.path.join(current_app.config['UPLOAD_COMPANY_COMMERCIAL_REGISTER'], filename)
                file.save(file_path)
                new_cv = filename
                # Update the user's CV field with the new CV filename
                company.commercial_register = new_cv

        # Commit the changes to the database
        db.session.commit()

        flash('تم تحديث البيانات بنجاح', 'success')
        return redirect('/company_editprofile/commercial_data')


    # Handle cases where the user is not logged in
    session.clear()
    flash('يجب تسجيل الدخول اولا لتتمكن من تعديل البيانات', 'warning')
    return redirect('/login')


# ==============================================================================
# JSON REST API ENDPOINTS FOR FRONTEND PUBLIC COMPANIES MODULE
# ==============================================================================

def serialize_company_summary(c):
    open_jobs_count = Jobs.query.filter_by(company_id=c.id, status='approved').count()

    name = c.company_arabic_name or c.company_english_name or c.company_name_on_faeda or f"شركة #{c.id}"
    desc = c.about_company_arabic or c.about_company_english or ""
    location = c.state or c.country or c.english_adress or "السعودية"

    return {
        "id": str(c.id),
        "name": name,
        "arabicName": c.company_arabic_name,
        "englishName": c.company_english_name,
        "faedaName": c.company_name_on_faeda,
        "logoUrl": c.company_logo if c.company_logo else None,
        "description": desc,
        "location": location,
        "country": c.country or "المملكة العربية السعودية",
        "companyType": c.company_type,
        "companySize": c.company_size,
        "companyField": c.company_field,
        "website": c.company_website,
        "twitter": c.twitter_email,
        "instagram": c.instagram_email,
        "isVerified": bool(c.is_verified),
        "verifiedAt": c.verified_at.isoformat() if c.verified_at else None,
        "openJobsCount": open_jobs_count,
        "createdAt": c.timestamp.isoformat() if c.timestamp else None,
    }


def serialize_company_detail(c):
    from app.blueprints.jobs import serialize_job_summary
    base = serialize_company_summary(c)
    approved_jobs = Jobs.query.filter_by(company_id=c.id, status='approved').order_by(Jobs.date_posted.desc()).all()
    serialized_jobs = [serialize_job_summary(j) for j in approved_jobs]

    return {
        **base,
        "jobs": serialized_jobs,
    }


@company.route('/api/v1/companies/suggestions')
def api_get_company_suggestions():
    q = request.args.get('q', '').strip()

    if not q or len(q) < 2:
        return jsonify({"suggestions": []})

    companies = Company.query.filter(
        db.or_(Company.status == 'active', Company.status.is_(None)),
        db.or_(
            Company.company_arabic_name.ilike(f"%{q}%"),
            Company.company_english_name.ilike(f"%{q}%"),
            Company.company_name_on_faeda.ilike(f"%{q}%"),
            Company.company_field.ilike(f"%{q}%")
        )
    ).limit(8).all()

    suggestions = []
    for comp in companies:
        name = comp.company_arabic_name or comp.company_english_name or comp.company_name_on_faeda
        location = comp.state or comp.country or "السعودية"
        suggestions.append({
            "id": str(comp.id),
            "label": name,
            "subLabel": comp.company_field or location,
            "category": "شركة",
            "value": name,
            "location": location,
        })

    return jsonify({"suggestions": suggestions})


@company.route('/api/v1/companies')
def api_get_companies():
    q = request.args.get('q', '').strip()
    location = request.args.get('location', '').strip()
    verified_param = request.args.get('verified', '').strip().lower()
    has_jobs_param = request.args.get('has_jobs', '').strip().lower()
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('page_size', 12))

    query = Company.query.filter(
        db.or_(Company.status == 'active', Company.status.is_(None))
    )

    if q:
        query = query.filter(
            db.or_(
                Company.company_arabic_name.ilike(f"%{q}%"),
                Company.company_english_name.ilike(f"%{q}%"),
                Company.company_name_on_faeda.ilike(f"%{q}%"),
                Company.company_field.ilike(f"%{q}%"),
                Company.about_company_arabic.ilike(f"%{q}%"),
                Company.about_company_english.ilike(f"%{q}%")
            )
        )

    if location:
        query = query.filter(
            db.or_(
                Company.state.ilike(f"%{location}%"),
                Company.country.ilike(f"%{location}%"),
                Company.english_adress.ilike(f"%{location}%")
            )
        )

    if verified_param == 'true':
        query = query.filter(Company.is_verified == True)

    if has_jobs_param == 'true':
        # Subquery for companies with at least one approved job
        subq = db.session.query(Jobs.company_id).filter(Jobs.status == 'approved').subquery()
        query = query.filter(Company.id.in_(subq))

    paginated = query.order_by(Company.is_verified.desc(), Company.id.desc()).paginate(page=page, per_page=page_size, error_out=False)

    return jsonify({
        "companies": [serialize_company_summary(c) for c in paginated.items],
        "total": paginated.total,
        "page": paginated.page,
        "pageSize": paginated.per_page,
        "totalPages": paginated.pages,
    })


@company.route('/api/v1/companies/<int:company_id>')
def api_get_company_detail(company_id):
    comp = Company.query.get(company_id)
    if not comp or (comp.status and comp.status != 'active'):
        return jsonify({"message": "الشركة غير موجودة"}), 404

    return jsonify(serialize_company_detail(comp))


# ==============================================================================
# AUTHENTICATED COMPANY WORKSPACE REST APIS (SECTION 5)
# ==============================================================================

STATUS_MAP_API_TO_DB = {
    'applied': 'تم التقديم',
    'under_review': 'قيد المراجعة',
    'shortlisted': 'تم الترشيح قبل النهائي',
    'interview': 'مقابلة',
    'accepted': 'تم القبول النهائي',
    'rejected': 'تم الرفض',
}

STATUS_MAP_DB_TO_API = {
    'تم التقديم': 'applied',
    'جديد': 'applied',
    'قيد المراجعة': 'under_review',
    'تم الترشيح قبل النهائي': 'shortlisted',
    'مرشح': 'shortlisted',
    'مقابلة': 'interview',
    'قيد المقابلة': 'interview',
    'تم القبول النهائي': 'accepted',
    'مقبول': 'accepted',
    'تم الرفض': 'rejected',
    'مرفوض': 'rejected',
}

def normalize_db_status_to_api(status_str):
    if not status_str:
        return 'applied'
    return STATUS_MAP_DB_TO_API.get(status_str.strip(), 'under_review')

def normalize_api_status_to_db(status_str):
    if not status_str:
        return 'قيد المراجعة'
    return STATUS_MAP_API_TO_DB.get(status_str.strip().lower(), status_str)


def get_authenticated_company():
    """Retrieve the currently authenticated company model instance or None."""
    if 'session_company' not in session or 'company_id' not in session:
        return None
    comp_id = session.get('company_id')
    if not comp_id:
        return None
    return Company.query.get(comp_id)


def calculate_company_profile_completeness(comp):
    """Calculates a transparent completeness score based on real company fields."""
    checklist = [
        {
            "id": "name",
            "title_ar": "اسم المنشأة بالعربية والإنجليزية",
            "title_en": "Company Name (AR & EN)",
            "isCompleted": bool(comp.company_arabic_name and comp.company_english_name),
            "weight": 15,
        },
        {
            "id": "description",
            "title_ar": "نبذة تعريفية عن المنشأة وأنشطتها",
            "title_en": "Company Overview & Description",
            "isCompleted": bool(comp.about_company_arabic or comp.about_company_english),
            "weight": 15,
        },
        {
            "id": "industry",
            "title_ar": "مجال العمل والتصنيف",
            "title_en": "Industry & Company Field",
            "isCompleted": bool(comp.company_field),
            "weight": 15,
        },
        {
            "id": "location",
            "title_ar": "المقر الجغرافي والمدينة",
            "title_en": "Location & City",
            "isCompleted": bool(comp.country and (comp.state or comp.english_adress)),
            "weight": 15,
        },
        {
            "id": "company_size",
            "title_ar": "حجم المنشأة ونوعها",
            "title_en": "Company Size & Type",
            "isCompleted": bool(comp.company_size and comp.company_type),
            "weight": 10,
        },
        {
            "id": "contact_hr",
            "title_ar": "بيانات التواصل ومسؤول التوظيف",
            "title_en": "Contact & HR Info",
            "isCompleted": bool(comp.company_email or comp.hr_name or comp.hr_email),
            "weight": 10,
        },
        {
            "id": "logo",
            "title_ar": "شعار المنشأة الرسمي",
            "title_en": "Official Company Logo",
            "isCompleted": bool(comp.company_logo),
            "weight": 10,
        },
        {
            "id": "digital_presence",
            "title_ar": "الموقع الإلكتروني والشبكات",
            "title_en": "Website & Social Links",
            "isCompleted": bool(comp.company_website or comp.twitter_email or comp.instagram_email),
            "weight": 10,
        },
    ]

    total_weight = sum(item["weight"] for item in checklist)
    earned_weight = sum(item["weight"] for item in checklist if item["isCompleted"])
    percentage = int(round((earned_weight / total_weight) * 100)) if total_weight > 0 else 0

    return {
        "percentage": percentage,
        "isComplete": percentage >= 85,
        "items": checklist,
        "completedCount": sum(1 for item in checklist if item["isCompleted"]),
        "totalCount": len(checklist),
    }


def serialize_company_authenticated_profile(comp):
    """Returns safe authenticated company profile with completeness and real business metrics."""
    completeness = calculate_company_profile_completeness(comp)
    name = comp.company_arabic_name or comp.company_english_name or comp.company_name_on_faeda or f"شركة #{comp.id}"

    return {
        "id": comp.id,
        "name": name,
        "arabicName": comp.company_arabic_name or "",
        "englishName": comp.company_english_name or "",
        "faedaName": comp.company_name_on_faeda or "",
        "email": comp.company_email or "",
        "mobile": comp.company_mobile or "",
        "descriptionAr": comp.about_company_arabic or "",
        "descriptionEn": comp.about_company_english or "",
        "country": comp.country or "المملكة العربية السعودية",
        "state": comp.state or "",
        "location": comp.state or comp.country or comp.english_adress or "المملكة العربية السعودية",
        "englishAddress": comp.english_adress or "",
        "companyType": comp.company_type or "",
        "companySize": comp.company_size or "",
        "companyField": comp.company_field or "",
        "hrName": comp.hr_name or "",
        "hrMobile": comp.hr_mobile or "",
        "hrEmail": comp.hr_email or "",
        "website": comp.company_website or "",
        "twitter": comp.twitter_email or "",
        "instagram": comp.instagram_email or "",
        "logoUrl": f"/static/uploads/company/logo/{comp.company_logo}" if comp.company_logo and not comp.company_logo.startswith('http') and not comp.company_logo.startswith('/') else comp.company_logo,
        "isVerified": bool(comp.is_verified),
        "verifiedAt": comp.verified_at.isoformat() if comp.verified_at else None,
        "status": comp.status or "active",
        "createdAt": comp.timestamp.isoformat() if comp.timestamp else None,
        "completeness": completeness,
        "metrics": {
            "projectSize": getattr(comp, 'project_size', 0) or 0,
            "numberOfProjects": getattr(comp, 'number_of_projects', 0) or 0,
            "successRate": getattr(comp, 'success_rate', 0.0) or 0.0,
            "profitPercentage": getattr(comp, 'profit_percentage', 0.0) or 0.0,
            "intellectualProperty": getattr(comp, 'intellectual_property', 0) or 0,
            "reputation": getattr(comp, 'reputation', 'N/A') or 'N/A',
            "servicesProvided": getattr(comp, 'services_provided', 'N/A') or 'N/A',
            "socialImpact": getattr(comp, 'social_impact', 'N/A') or 'N/A',
        }
    }


def serialize_company_job_item(j):
    """Serializes a single company job with real application counts."""
    app_count = db.session.query(customer_jobs).filter(customer_jobs.c.job_id == j.id).count()
    shortlisted_count = db.session.query(customer_jobs).filter(
        customer_jobs.c.job_id == j.id,
        customer_jobs.c.status == 'تم الترشيح قبل النهائي'
    ).count()
    interview_count = db.session.query(customer_jobs).filter(
        customer_jobs.c.job_id == j.id,
        customer_jobs.c.status.in_(['مقابلة', 'قيد المقابلة'])
    ).count()
    accepted_count = db.session.query(customer_jobs).filter(
        customer_jobs.c.job_id == j.id,
        customer_jobs.c.status.in_(['تم القبول النهائي', 'مقبول'])
    ).count()

    skills_list = [s.strip() for s in j.required_skills.split(',')] if j.required_skills else []
    languages_list = [l.strip() for l in j.languages.split(',')] if j.languages else []

    return {
        "id": j.id,
        "title": j.title,
        "jobType": j.job_type,
        "town": j.town,
        "location": j.town or "الرياض",
        "companyAbout": j.company_about,
        "description": j.job_description,
        "specialization": j.specialization,
        "skillsYears": j.skills_years,
        "educationalQualification": j.educational_qualification,
        "workplace": j.workplace,
        "workdays": j.workdays,
        "restDays": j.rest_days,
        "workHours": j.work_hours,
        "languages": languages_list,
        "salary": {
            "min": j.salary_min,
            "max": j.salary_max,
            "isDisclosed": bool(j.salary_min or j.salary_max),
            "currency": "SAR"
        },
        "requiredSkills": skills_list,
        "preferredWorkStyle": j.preferred_work_style,
        "status": j.status or "approved",
        "category": j.category or j.specialization,
        "isFeatured": bool(j.is_featured),
        "datePosted": j.date_posted.isoformat() if j.date_posted else None,
        "applicantsCount": app_count,
        "shortlistedCount": shortlisted_count,
        "interviewCount": interview_count,
        "acceptedCount": accepted_count,
    }


def serialize_employer_talent_item(cust, full_details=False):
    """Employer-safe serialization of candidate talent without exposing private contacts."""
    import json
    from ai_engine.market_value_calculator import get_market_value_for_customer

    skills_list = []
    try:
        from services.skills import Skills
        cand_skills = Skills.query.filter_by(customer_id=cust.id).all()
        if cand_skills:
            skills_list = [s.skill_name for s in cand_skills if s.skill_name]
    except Exception:
        skills_list = []

    if not skills_list and cust.preferred_field_of_work:
        skills_list = [cust.preferred_field_of_work]

    # Calculate market value benchmark
    market_benchmark = None
    try:
        mv = get_market_value_for_customer(cust)
        if mv:
            market_benchmark = {
                "score": mv.get("total_score", 0),
                "tier": mv.get("tier_label", "متوسط"),
                "salaryMin": mv.get("salary_range", {}).get("min", 0),
                "salaryMax": mv.get("salary_range", {}).get("max", 0),
                "averageSalary": mv.get("salary_range", {}).get("avg", 0),
                "currency": "SAR",
            }
    except Exception:
        market_benchmark = None

    # Parse projects if available in resume_text JSON
    projects_list = []
    certifications_list = []
    if cust.resume_text:
        try:
            parsed = json.loads(cust.resume_text)
            if isinstance(parsed, dict):
                projects_list = parsed.get("projects", [])
                certifications_list = parsed.get("certifications", [])
        except Exception:
            pass

    if not certifications_list and cust.certifications:
        certifications_list = [c.strip() for c in cust.certifications.split(',') if c.strip()]

    headline = cust.preferred_field_of_work or (cust.about[:80] + "..." if cust.about and len(cust.about) > 80 else cust.about) or "كفاءة مهنية متخصصة"

    item = {
        "id": cust.id,
        "userId": cust.user_id,
        "name": cust.fullname,
        "headline": headline,
        "about": cust.about or "",
        "avatarUrl": cust.img if cust.img else None,
        "location": cust.government or cust.country or "المملكة العربية السعودية",
        "country": cust.country or "السعودية",
        "city": cust.government or "",
        "yearsOfExperience": cust.years_of_skills or "0",
        "education": {
            "qualification": cust.educational_qualification or "",
            "status": cust.education_statue or "",
            "university": cust.university or "",
            "department": cust.department_university or "",
            "graduationDate": cust.graduation_date.isoformat() if cust.graduation_date else None,
            "gpa": cust.gpa or "",
        },
        "workType": cust.work_type or "دوام كامل",
        "workStyle": cust.work_style or "حضوري",
        "skills": skills_list,
        "isVerified": bool(cust.is_verified),
        "visibility": cust.visibility or "employers_only",
        "marketBenchmark": market_benchmark,
        "projectsCount": len(projects_list),
        "certificationsCount": len(certifications_list),
    }

    if full_details:
        item["projects"] = projects_list
        item["certifications"] = certifications_list
        item["cvUrl"] = f"/company/download_cv/{cust.cv}" if cust.cv else None

    return item


@company.route('/api/v1/company/me', methods=['GET'])
def api_company_me():
    """Verify company session and return identity."""
    comp = get_authenticated_company()
    if not comp:
        return jsonify({
            "authenticated": False,
            "role": None,
            "company": None
        }), 401

    name = comp.company_arabic_name or comp.company_english_name or comp.company_name_on_faeda or f"شركة #{comp.id}"
    return jsonify({
        "authenticated": True,
        "role": "company",
        "company": {
            "id": comp.id,
            "name": name,
            "arabicName": comp.company_arabic_name,
            "englishName": comp.company_english_name,
            "email": comp.company_email,
            "logoUrl": comp.company_logo,
            "isVerified": bool(comp.is_verified),
            "status": comp.status or "active"
        }
    })


@company.route('/api/v1/company/profile', methods=['GET'])
def api_get_company_profile():
    """Retrieve full safe authenticated company profile."""
    comp = get_authenticated_company()
    if not comp:
        return jsonify({"message": "يجب تسجيل الدخول كشركة للوصول إلى هذا الملف"}), 401

    return jsonify(serialize_company_authenticated_profile(comp))


@company.route('/api/v1/company/profile', methods=['PUT'])
def api_update_company_profile():
    """Update authenticated company profile fields safely."""
    comp = get_authenticated_company()
    if not comp:
        return jsonify({"message": "يجب تسجيل الدخول كشركة لتحديث البيانات"}), 401

    data = request.get_json() or {}

    if 'arabicName' in data:
        comp.company_arabic_name = data['arabicName'].strip()
    if 'englishName' in data:
        comp.company_english_name = data['englishName'].strip()
    if 'faedaName' in data:
        comp.company_name_on_faeda = data['faedaName'].strip()
    if 'descriptionAr' in data:
        comp.about_company_arabic = data['descriptionAr'].strip()
    if 'descriptionEn' in data:
        comp.about_company_english = data['descriptionEn'].strip()
    if 'country' in data:
        comp.country = data['country'].strip()
    if 'state' in data:
        comp.state = data['state'].strip()
    if 'englishAddress' in data:
        comp.english_adress = data['englishAddress'].strip()
    if 'companyType' in data:
        comp.company_type = data['companyType'].strip()
    if 'companySize' in data:
        comp.company_size = data['companySize'].strip()
    if 'companyField' in data:
        comp.company_field = data['companyField'].strip()
    if 'hrName' in data:
        comp.hr_name = data['hrName'].strip()
    if 'hrMobile' in data:
        comp.hr_mobile = data['hrMobile'].strip()
    if 'hrEmail' in data:
        comp.hr_email = data['hrEmail'].strip()
    if 'website' in data:
        comp.company_website = data['website'].strip()
    if 'twitter' in data:
        comp.twitter_email = data['twitter'].strip()
    if 'instagram' in data:
        comp.instagram_email = data['instagram'].strip()

    # Metrics updates if provided
    if 'metrics' in data and isinstance(data['metrics'], dict):
        m = data['metrics']
        if 'projectSize' in m:
            try: comp.project_size = int(m['projectSize'])
            except: pass
        if 'numberOfProjects' in m:
            try: comp.number_of_projects = int(m['numberOfProjects'])
            except: pass
        if 'successRate' in m:
            try: comp.success_rate = float(m['successRate'])
            except: pass
        if 'profitPercentage' in m:
            try: comp.profit_percentage = float(m['profitPercentage'])
            except: pass
        if 'intellectualProperty' in m:
            try: comp.intellectual_property = int(m['intellectualProperty'])
            except: pass
        if 'reputation' in m:
            comp.reputation = str(m['reputation']).strip()
        if 'servicesProvided' in m:
            comp.services_provided = str(m['servicesProvided']).strip()
        if 'socialImpact' in m:
            comp.social_impact = str(m['socialImpact']).strip()

    db.session.commit()
    return jsonify({
        "success": True,
        "message": "تم تحديث ملف المنشأة بنجاح",
        "company": serialize_company_authenticated_profile(comp)
    })


@company.route('/api/v1/company/logo', methods=['POST'])
def api_upload_company_logo():
    """Upload official company logo."""
    comp = get_authenticated_company()
    if not comp:
        return jsonify({"message": "يجب تسجيل الدخول كشركة لتحديث الشعار"}), 401

    if 'logo' not in request.files:
        return jsonify({"message": "لم يتم إرسال ملف الشعار"}), 400

    file = request.files['logo']
    if not file or not file.filename:
        return jsonify({"message": "ملف الشعار غير صالح"}), 400

    if not allowed_file(file.filename):
        return jsonify({"message": "نوع الملف غير مدعوم. الصيغ المسموحة: png, jpg, jpeg, gif"}), 400

    logo_dir = current_app.config.get('UPLOAD_company_logo', 'static/uploads/company/logo')
    os.makedirs(logo_dir, exist_ok=True)

    # Clean old logo if exist
    if comp.company_logo:
        old_path = os.path.join(logo_dir, os.path.basename(comp.company_logo))
        if os.path.exists(old_path):
            try: os.remove(old_path)
            except: pass

    filename = f"comp_{comp.id}_{int(datetime.utcnow().timestamp())}_{secure_filename(file.filename)}"
    file_path = os.path.join(logo_dir, filename)
    file.save(file_path)

    comp.company_logo = filename
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "تم رفع وتحديث شعار المنشأة بنجاح",
        "logoUrl": f"/static/uploads/company/logo/{filename}"
    })


@company.route('/api/v1/company/dashboard', methods=['GET'])
def api_get_company_dashboard():
    """Retrieve full aggregated dashboard metrics for the authenticated company."""
    comp = get_authenticated_company()
    if not comp:
        return jsonify({"message": "يجب تسجيل الدخول كشركة للوصول إلى لوحة التحكم"}), 401

    comp_id = comp.id

    # Real job metrics
    total_jobs = Jobs.query.filter_by(company_id=comp_id).count()
    active_jobs = Jobs.query.filter_by(company_id=comp_id, status='approved').count()
    pending_jobs = Jobs.query.filter_by(company_id=comp_id, status='pending').count()
    draft_jobs = Jobs.query.filter_by(company_id=comp_id, status='draft').count()
    closed_jobs = Jobs.query.filter(Jobs.company_id == comp_id, Jobs.status.in_(['closed', 'archived', 'rejected'])).count()

    # Real applicant metrics joined with Jobs
    base_apps_query = db.session.query(customer_jobs).join(Jobs, Jobs.id == customer_jobs.c.job_id).filter(Jobs.company_id == comp_id)
    total_applicants = base_apps_query.count()
    shortlisted_count = base_apps_query.filter(customer_jobs.c.status == 'تم الترشيح قبل النهائي').count()
    interview_count = base_apps_query.filter(customer_jobs.c.status.in_(['مقابلة', 'قيد المقابلة'])).count()
    accepted_count = base_apps_query.filter(customer_jobs.c.status.in_(['تم القبول النهائي', 'مقبول'])).count()
    rejected_count = base_apps_query.filter(customer_jobs.c.status.in_(['تم الرفض', 'مرفوض'])).count()
    under_review_count = base_apps_query.filter(customer_jobs.c.status.in_(['قيد المراجعة', 'تم التقديم', 'جديد'])).count()

    # Team offers if table exists
    total_team_offers = 0
    try:
        from services.team_offer import TeamOffer
        total_team_offers = TeamOffer.query.filter_by(company_id=comp_id).count()
    except Exception:
        total_team_offers = 0

    # Recent applications (last 6)
    recent_apps_records = db.session.query(
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
    ).order_by(customer_jobs.c.timestamp.desc()).limit(6).all()

    recent_applications = []
    for app_id, app_status, applied_at, cust, j in recent_apps_records:
        recent_applications.append({
            "id": app_id,
            "status": normalize_db_status_to_api(app_status),
            "statusRaw": app_status or "تم التقديم",
            "appliedAt": applied_at.isoformat() if applied_at else None,
            "job": {
                "id": j.id,
                "title": j.title,
            },
            "candidate": {
                "id": cust.id,
                "userId": cust.user_id,
                "name": cust.fullname,
                "headline": cust.preferred_field_of_work or "كفاءة مهنية",
                "avatarUrl": cust.img if cust.img else None,
                "isVerified": bool(cust.is_verified),
            }
        })

    # Recent company jobs (last 4)
    recent_jobs_records = Jobs.query.filter_by(company_id=comp_id).order_by(Jobs.date_posted.desc()).limit(4).all()
    recent_jobs = [serialize_company_job_item(j) for j in recent_jobs_records]

    completeness = calculate_company_profile_completeness(comp)

    return jsonify({
        "company": serialize_company_summary(comp),
        "profileCompleteness": completeness,
        "stats": {
            "totalJobs": total_jobs,
            "activeJobs": active_jobs,
            "pendingJobs": pending_jobs,
            "draftJobs": draft_jobs,
            "closedJobs": closed_jobs,
            "totalApplicants": total_applicants,
            "underReview": under_review_count,
            "shortlisted": shortlisted_count,
            "interview": interview_count,
            "accepted": accepted_count,
            "rejected": rejected_count,
            "teamOffers": total_team_offers,
        },
        "recentApplications": recent_applications,
        "recentJobs": recent_jobs,
    })


@company.route('/api/v1/company/jobs', methods=['GET'])
def api_get_company_jobs():
    """Retrieve paginated jobs posted by the authenticated company."""
    comp = get_authenticated_company()
    if not comp:
        return jsonify({"message": "يجب تسجيل الدخول كشركة لاستعراض الوظائف"}), 401

    status_filter = request.args.get('status', '').strip().lower()
    q = request.args.get('q', '').strip()
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('page_size', 10))

    query = Jobs.query.filter_by(company_id=comp.id)

    if status_filter and status_filter != 'all':
        query = query.filter(Jobs.status == status_filter)

    if q:
        query = query.filter(
            db.or_(
                Jobs.title.ilike(f"%{q}%"),
                Jobs.specialization.ilike(f"%{q}%"),
                Jobs.town.ilike(f"%{q}%"),
                Jobs.job_description.ilike(f"%{q}%")
            )
        )

    paginated = query.order_by(Jobs.date_posted.desc()).paginate(page=page, per_page=page_size, error_out=False)

    return jsonify({
        "jobs": [serialize_company_job_item(j) for j in paginated.items],
        "total": paginated.total,
        "page": paginated.page,
        "pageSize": paginated.per_page,
        "totalPages": paginated.pages,
    })


@company.route('/api/v1/company/jobs', methods=['POST'])
def api_create_company_job():
    """Create a new job listing belonging to the authenticated company."""
    comp = get_authenticated_company()
    if not comp:
        return jsonify({"message": "يجب تسجيل الدخول كشركة لنشر وظيفة جديدة"}), 401

    data = request.get_json() or {}

    title = data.get('title', '').strip()
    job_description = data.get('description', '').strip() or data.get('job_description', '').strip()
    specialization = data.get('specialization', '').strip() or data.get('field', '').strip() or "عام"
    job_type = data.get('jobType', '').strip() or data.get('job_type', '').strip() or "دوام كامل"
    town = data.get('town', '').strip() or data.get('location', '').strip() or comp.state or "الرياض"
    company_about = data.get('companyAbout', '').strip() or comp.about_company_arabic or comp.about_company_english or "عن الشركة"
    skills_years = str(data.get('skillsYears', data.get('experienceYears', '1-3 سنوات')))
    educational_qualification = data.get('educationalQualification', '').strip() or data.get('education', '').strip() or "بكالوريوس"
    workplace = data.get('workplace', '').strip() or data.get('workStyle', 'حضوري')

    if not title or not job_description:
        return jsonify({"message": "يرجى تعبئة عنوان الوظيفة والوصف الوظيفي"}), 400

    # Optional fields
    workdays = data.get('workdays', 'الأحد - الخميس')
    rest_days = data.get('restDays', 'الجمعة والسبت')
    work_hours = data.get('workHours', '8 ساعات')

    languages_val = data.get('languages', 'العربية')
    if isinstance(languages_val, list):
        languages_val = ','.join(languages_val)

    required_skills_val = data.get('requiredSkills', '')
    if isinstance(required_skills_val, list):
        required_skills_val = ','.join(required_skills_val)

    salary_min = data.get('salaryMin')
    salary_max = data.get('salaryMax')
    category = data.get('category', specialization)
    status = data.get('status', 'approved')  # Default to approved or pending

    new_job = Jobs(
        title=title,
        job_type=job_type,
        town=town,
        company_about=company_about,
        job_description=job_description,
        specialization=specialization,
        skills_years=skills_years,
        educational_qualification=educational_qualification,
        workplace=workplace,
        company_id=comp.id,
        workdays=workdays,
        rest_days=rest_days,
        work_hours=work_hours,
        languages=languages_val,
        salary_min=int(salary_min) if salary_min is not None and str(salary_min).isdigit() else None,
        salary_max=int(salary_max) if salary_max is not None and str(salary_max).isdigit() else None,
        required_skills=required_skills_val,
        preferred_work_style=workplace
    )
    new_job.category = category
    new_job.status = status
    new_job.date_posted = datetime.utcnow()

    db.session.add(new_job)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "تم إنشاء الفرصة الوظيفية بنجاح",
        "job": serialize_company_job_item(new_job)
    }), 201


@company.route('/api/v1/company/jobs/<int:job_id>', methods=['GET'])
def api_get_company_job_detail(job_id):
    """Retrieve full company job details with applicant stats (Strictly checking ownership)."""
    comp = get_authenticated_company()
    if not comp:
        return jsonify({"message": "يجب تسجيل الدخول كشركة"}), 401

    job = Jobs.query.get(job_id)
    if not job or job.company_id != comp.id:
        return jsonify({"message": "الوظيفة غير موجودة أو ليس لديك صلاحية الوصول إليها"}), 404

    return jsonify(serialize_company_job_item(job))


@company.route('/api/v1/company/jobs/<int:job_id>', methods=['PUT'])
def api_update_company_job(job_id):
    """Update a job listing (Strictly checking ownership)."""
    comp = get_authenticated_company()
    if not comp:
        return jsonify({"message": "يجب تسجيل الدخول كشركة"}), 401

    job = Jobs.query.get(job_id)
    if not job or job.company_id != comp.id:
        return jsonify({"message": "الوظيفة غير موجودة أو ليس لديك صلاحية لتعديلها"}), 404

    data = request.get_json() or {}

    if 'title' in data:
        job.title = data['title'].strip()
    if 'description' in data:
        job.job_description = data['description'].strip()
    if 'job_description' in data:
        job.job_description = data['job_description'].strip()
    if 'specialization' in data:
        job.specialization = data['specialization'].strip()
    if 'jobType' in data:
        job.job_type = data['jobType'].strip()
    if 'town' in data:
        job.town = data['town'].strip()
    if 'location' in data:
        job.town = data['location'].strip()
    if 'companyAbout' in data:
        job.company_about = data['companyAbout'].strip()
    if 'skillsYears' in data:
        job.skills_years = str(data['skillsYears'])
    if 'educationalQualification' in data:
        job.educational_qualification = data['educationalQualification'].strip()
    if 'workplace' in data:
        job.workplace = data['workplace'].strip()
    if 'workdays' in data:
        job.workdays = data['workdays'].strip()
    if 'restDays' in data:
        job.rest_days = data['restDays'].strip()
    if 'workHours' in data:
        job.work_hours = data['workHours'].strip()
    if 'category' in data:
        job.category = data['category'].strip()
    if 'status' in data:
        job.status = data['status'].strip()

    if 'languages' in data:
        langs = data['languages']
        job.languages = ','.join(langs) if isinstance(langs, list) else langs

    if 'requiredSkills' in data:
        skills = data['requiredSkills']
        job.required_skills = ','.join(skills) if isinstance(skills, list) else skills

    if 'salaryMin' in data:
        val = data['salaryMin']
        job.salary_min = int(val) if val is not None and str(val).isdigit() else None
    if 'salaryMax' in data:
        val = data['salaryMax']
        job.salary_max = int(val) if val is not None and str(val).isdigit() else None

    db.session.commit()
    return jsonify({
        "success": True,
        "message": "تم تحديث بيانات الوظيفة بنجاح",
        "job": serialize_company_job_item(job)
    })


@company.route('/api/v1/company/jobs/<int:job_id>', methods=['DELETE'])
def api_delete_company_job(job_id):
    """Delete or archive a job listing (Strictly checking ownership)."""
    comp = get_authenticated_company()
    if not comp:
        return jsonify({"message": "يجب تسجيل الدخول كشركة"}), 401

    job = Jobs.query.get(job_id)
    if not job or job.company_id != comp.id:
        return jsonify({"message": "الوظيفة غير موجودة أو ليس لديك صلاحية لحذفها"}), 404

    # Delete applications on this job or delete job
    db.session.query(customer_jobs).filter(customer_jobs.c.job_id == job.id).delete(synchronize_session=False)
    db.session.delete(job)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "تم حذف الفرصة الوظيفية بنجاح"
    })


@company.route('/api/v1/company/applications', methods=['GET'])
def api_get_company_applications():
    """Retrieve paginated applications for jobs belonging to the authenticated company."""
    comp = get_authenticated_company()
    if not comp:
        return jsonify({"message": "يجب تسجيل الدخول كشركة لاستعراض المتقدمين"}), 401

    job_id = request.args.get('job_id', type=int)
    status_filter = request.args.get('status', '').strip().lower()
    q = request.args.get('q', '').strip()
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('page_size', 10))

    query = db.session.query(
        customer_jobs.c.id.label('app_id'),
        customer_jobs.c.status.label('app_status'),
        customer_jobs.c.note.label('app_note'),
        customer_jobs.c.timestamp.label('applied_at'),
        Customers,
        Jobs
    ).join(
        Customers, Customers.user_id == customer_jobs.c.customer_id
    ).join(
        Jobs, Jobs.id == customer_jobs.c.job_id
    ).filter(
        Jobs.company_id == comp.id
    )

    if job_id:
        query = query.filter(Jobs.id == job_id)

    if status_filter and status_filter != 'all':
        db_status = normalize_api_status_to_db(status_filter)
        query = query.filter(customer_jobs.c.status == db_status)

    if q:
        query = query.filter(
            db.or_(
                Customers.fullname.ilike(f"%{q}%"),
                Customers.preferred_field_of_work.ilike(f"%{q}%"),
                Jobs.title.ilike(f"%{q}%")
            )
        )

    total_count = query.count()
    offset = (page - 1) * page_size
    items = query.order_by(customer_jobs.c.timestamp.desc()).offset(offset).limit(page_size).all()
    total_pages = (total_count + page_size - 1) // page_size if total_count > 0 else 1

    applications = []
    for app_id, app_status, app_note, applied_at, cust, j in items:
        applications.append({
            "id": app_id,
            "status": normalize_db_status_to_api(app_status),
            "statusRaw": app_status or "تم التقديم",
            "note": app_note or "",
            "appliedAt": applied_at.isoformat() if applied_at else None,
            "job": {
                "id": j.id,
                "title": j.title,
                "specialization": j.specialization,
                "town": j.town,
                "workplace": j.workplace,
            },
            "candidate": serialize_employer_talent_item(cust, full_details=False)
        })

    return jsonify({
        "applications": applications,
        "total": total_count,
        "page": page,
        "pageSize": page_size,
        "totalPages": total_pages,
    })


@company.route('/api/v1/company/applications/<int:app_id>', methods=['GET'])
def api_get_company_application_detail(app_id):
    """Retrieve full application detail with full candidate snapshot (Strictly checking company ownership)."""
    comp = get_authenticated_company()
    if not comp:
        return jsonify({"message": "يجب تسجيل الدخول كشركة"}), 401

    record = db.session.query(
        customer_jobs.c.id.label('app_id'),
        customer_jobs.c.status.label('app_status'),
        customer_jobs.c.note.label('app_note'),
        customer_jobs.c.timestamp.label('applied_at'),
        Customers,
        Jobs
    ).join(
        Customers, Customers.user_id == customer_jobs.c.customer_id
    ).join(
        Jobs, Jobs.id == customer_jobs.c.job_id
    ).filter(
        customer_jobs.c.id == app_id,
        Jobs.company_id == comp.id
    ).first()

    if not record:
        return jsonify({"message": "طلب التقديم غير موجود أو ليس لديك صلاحية للاطلاع عليه"}), 404

    app_id, app_status, app_note, applied_at, cust, j = record

    return jsonify({
        "id": app_id,
        "status": normalize_db_status_to_api(app_status),
        "statusRaw": app_status or "تم التقديم",
        "note": app_note or "",
        "appliedAt": applied_at.isoformat() if applied_at else None,
        "job": serialize_company_job_item(j),
        "candidate": serialize_employer_talent_item(cust, full_details=True)
    })


@company.route('/api/v1/company/applications/<int:app_id>/status', methods=['PUT'])
def api_update_company_application_status(app_id):
    """Update candidate application status in the recruitment pipeline."""
    comp = get_authenticated_company()
    if not comp:
        return jsonify({"message": "يجب تسجيل الدخول كشركة لتعديل حالة المتقدم"}), 401

    data = request.get_json() or {}
    status_input = data.get('status', '').strip()
    note_input = data.get('note', '').strip()

    if not status_input:
        return jsonify({"message": "يرجى تحديد الحالة الجديدة"}), 400

    db_status = normalize_api_status_to_db(status_input)

    # Verify ownership of job
    app_check = db.session.query(customer_jobs.c.id, customer_jobs.c.customer_id, Jobs.id.label('job_id'), Jobs.title).join(
        Jobs, Jobs.id == customer_jobs.c.job_id
    ).filter(
        customer_jobs.c.id == app_id,
        Jobs.company_id == comp.id
    ).first()

    if not app_check:
        return jsonify({"message": "طلب التقديم غير موجود أو ليس لديك صلاحية لتعديله"}), 404

    update_vals = {'status': db_status}
    if note_input:
        update_vals['note'] = note_input

    stmt = customer_jobs.update().where(customer_jobs.c.id == app_id).values(**update_vals)
    db.session.execute(stmt)

    # Log to CustomerProfileHistory if candidate exists
    try:
        cand_user_id = app_check.customer_id
        cand_obj = Customers.query.filter_by(user_id=cand_user_id).first()
        if cand_obj:
            hist = CustomerProfileHistory(
                customer_id=cand_obj.id,
                score=0.0,
                event_description=f"تحديث حالة التقديم على وظيفة ({app_check.title}): {db_status}"
            )
            db.session.add(hist)
    except Exception:
        pass

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "تم تحديث حالة طلب التقديم بنجاح",
        "status": normalize_db_status_to_api(db_status),
        "statusRaw": db_status
    })


@company.route('/api/v1/company/talent', methods=['GET'])
def api_company_discover_talent():
    """Discover candidate talent respecting privacy and visibility settings."""
    comp = get_authenticated_company()
    if not comp:
        return jsonify({"message": "يجب تسجيل الدخول كشركة لاستكشاف الكفاءات"}), 401

    q = request.args.get('q', '').strip()
    skill_filter = request.args.get('skill', '').strip()
    field_filter = request.args.get('field', '').strip()
    location_filter = request.args.get('location', '').strip()
    experience_filter = request.args.get('experience', '').strip()
    education_filter = request.args.get('education', '').strip()
    verified_only = request.args.get('verified', '').strip().lower() == 'true'
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('page_size', 12))

    # Exclude candidates with visibility == 'private' or non-active accounts
    query = Customers.query.filter(
        db.or_(Customers.visibility != 'private', Customers.visibility.is_(None)),
        db.or_(Customers.status == 'active', Customers.status.is_(None))
    )

    if q:
        query = query.filter(
            db.or_(
                Customers.fullname.ilike(f"%{q}%"),
                Customers.preferred_field_of_work.ilike(f"%{q}%"),
                Customers.about.ilike(f"%{q}%"),
                Customers.educational_qualification.ilike(f"%{q}%")
            )
        )

    if field_filter:
        query = query.filter(Customers.preferred_field_of_work.ilike(f"%{field_filter}%"))

    if location_filter:
        query = query.filter(
            db.or_(
                Customers.government.ilike(f"%{location_filter}%"),
                Customers.country.ilike(f"%{location_filter}%")
            )
        )

    if experience_filter:
        query = query.filter(Customers.years_of_skills.ilike(f"%{experience_filter}%"))

    if education_filter:
        query = query.filter(Customers.educational_qualification.ilike(f"%{education_filter}%"))

    if verified_only:
        query = query.filter(Customers.is_verified == True)

    if skill_filter:
        from services.skills import Skills
        subq = db.session.query(Skills.customer_id).filter(Skills.skill_name.ilike(f"%{skill_filter}%")).subquery()
        query = query.filter(Customers.id.in_(subq))

    paginated = query.order_by(Customers.is_verified.desc(), Customers.id.desc()).paginate(page=page, per_page=page_size, error_out=False)

    return jsonify({
        "talent": [serialize_employer_talent_item(c, full_details=False) for c in paginated.items],
        "total": paginated.total,
        "page": paginated.page,
        "pageSize": paginated.per_page,
        "totalPages": paginated.pages,
    })


@company.route('/api/v1/company/talent/<string:candidate_id>', methods=['GET'])
def api_company_get_talent_detail(candidate_id):
    """Retrieve employer-safe candidate profile detail."""
    comp = get_authenticated_company()
    if not comp:
        return jsonify({"message": "يجب تسجيل الدخول كشركة للاطلاع على الملف"}), 401

    # Support lookup by int id or string user_id
    if candidate_id.isdigit():
        cust = Customers.query.get(int(candidate_id))
    else:
        cust = Customers.query.filter_by(user_id=candidate_id).first()

    if not cust or (cust.status and cust.status != 'active'):
        return jsonify({"message": "المرشح غير موجود"}), 404

    # If candidate is explicitly private, only allow if they applied to this company
    if cust.visibility == 'private':
        has_applied = db.session.query(customer_jobs).join(
            Jobs, Jobs.id == customer_jobs.c.job_id
        ).filter(
            customer_jobs.c.customer_id == cust.user_id,
            Jobs.company_id == comp.id
        ).first()

        if not has_applied:
            return jsonify({"message": "ملف المرشح خاص وغير متاح للاستكشاف العام"}), 403

    return jsonify(serialize_employer_talent_item(cust, full_details=True))


def serialize_employer_team_item(t):
    """Serialize professional team for employer discovery and evaluation."""
    from services.skills import Skills
    from services.teams import team_members_association

    member_rows = db.session.query(team_members_association).filter(
        team_members_association.c.team_id == t.id,
        team_members_association.c.status.in_(['منضم', 'عضو', 'قائد'])
    ).all()

    member_user_ids = [r.member_id for r in member_rows]
    if t.admin_id and t.admin_id not in member_user_ids:
        member_user_ids.append(t.admin_id)

    int_ids = [int(x) for x in member_user_ids if str(x).isdigit()]
    cust_filters = [Customers.user_id.in_(member_user_ids)]
    if int_ids:
        cust_filters.append(Customers.id.in_(int_ids))
    members_custs = Customers.query.filter(db.or_(*cust_filters)).all()

    all_member_skills = []
    for m in members_custs:
        try:
            cand_skills = Skills.query.filter_by(customer_id=m.id).all()
            for s in cand_skills:
                if s.skill_name:
                    all_member_skills.append(s.skill_name)
        except Exception:
            pass
        if m.preferred_field_of_work:
            all_member_skills.append(m.preferred_field_of_work)

    unique_member_skills = list(dict.fromkeys([s.strip() for s in all_member_skills if s and s.strip()]))

    declared_caps = []
    if t.special_program:
        declared_caps.append(t.special_program)
    if getattr(t, 'semi_special_program', None) and t.semi_special_program not in declared_caps:
        declared_caps.append(t.semi_special_program)
    if t.general_program and t.general_program not in declared_caps:
        declared_caps.append(t.general_program)

    combined_caps = list(dict.fromkeys(declared_caps + unique_member_skills))[:12]

    # Members preview
    members_preview = []
    for m in members_custs:
        members_preview.append({
            "id": m.id,
            "name": m.fullname,
            "headline": m.preferred_field_of_work or "عضو متخصص",
            "avatarUrl": m.img if m.img else None,
            "yearsOfExperience": m.years_of_skills or "0",
            "education": m.educational_qualification or "",
            "isVerified": bool(m.is_verified)
        })

    logo_url = f"/download_image_team/{t.img}" if getattr(t, 'img', None) else None

    return {
        "id": t.id,
        "name": t.team_name,
        "about": getattr(t, 'about', '') or getattr(t, 'about_team', '') or "",
        "achievements": getattr(t, 'achievements', '') or "",
        "specialization": t.special_program or t.general_program or "فريق مهني متكامل",
        "generalProgram": t.general_program,
        "specialProgram": t.special_program,
        "logoUrl": logo_url,
        "memberCount": max(len(members_custs), 1),
        "capabilities": combined_caps,
        "memberDerivedCapabilities": unique_member_skills[:8],
        "members": members_preview,
        "creationDate": t.creation_date.isoformat() if getattr(t, 'creation_date', None) else None,
    }


@company.route('/api/v1/company/teams', methods=['GET'])
def api_company_discover_teams():
    """Discover professional teams with combined capabilities."""
    comp = get_authenticated_company()
    if not comp:
        return jsonify({"message": "يجب تسجيل الدخول كشركة لاستكشاف الفرق المهنية"}), 401

    q = request.args.get('q', '').strip()
    specialization = request.args.get('specialization', '').strip()
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('page_size', 10))

    query = Teams.query

    if q:
        query = query.filter(
            db.or_(
                Teams.team_name.ilike(f"%{q}%"),
                Teams.special_program.ilike(f"%{q}%"),
                Teams.general_program.ilike(f"%{q}%")
            )
        )

    if specialization:
        query = query.filter(
            db.or_(
                Teams.special_program.ilike(f"%{specialization}%"),
                Teams.general_program.ilike(f"%{specialization}%")
            )
        )

    paginated = query.order_by(Teams.id.desc()).paginate(page=page, per_page=page_size, error_out=False)

    return jsonify({
        "teams": [serialize_employer_team_item(t) for t in paginated.items],
        "total": paginated.total,
        "page": paginated.page,
        "pageSize": paginated.per_page,
        "totalPages": paginated.pages,
    })


@company.route('/api/v1/company/teams/<int:team_id>', methods=['GET'])
def api_company_get_team_detail(team_id):
    """Retrieve full professional team details for employer evaluation."""
    comp = get_authenticated_company()
    if not comp:
        return jsonify({"message": "يجب تسجيل الدخول كشركة"}), 401

    team = Teams.query.get(team_id)
    if not team:
        return jsonify({"message": "الفريق غير موجود"}), 404

    return jsonify(serialize_employer_team_item(team))