# ==============================================================================
# الوظيفة الأساسية للملف: وحدة (Blueprint) تحتوي على جميع مسارات (Routes) لوحة تحكم الشركات.
# الروابط أو الميزات: مسارات إدارة ملف الشركة، متابعة المتقدمين للوظائف، والفرق (Teams).
# المتطلبات الخاصة: يعتمد على نماذج الشركة والعملاء (services.company, services.customer) وجلسات فلاسك.
# ==============================================================================
#### companies.py############
from flask import Blueprint, render_template, redirect, request, session, flash, current_app, url_for, send_from_directory, abort
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
UPLOAD_company_logo ='mysite/static/uploads/company/logo'



ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

    #### register ######

@company.route('/applicants/<int:job_id>')
def job_applicants2(job_id):
    """
    Display all applicants for a specific job.
    Retrieves both individual and team applicants for company review.
    """
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
    """
    Display applicants who have been recommended for a specific job.
    Filters applicants based on the 'recommended' status.
    """
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
    """
    Update the company's profile information.
    Handles the submission of contact details, descriptions, and file uploads (e.g., logo, commercial register).
    """
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