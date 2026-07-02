#### jobs.py############

from flask import Blueprint  , render_template , redirect , request , session , flash
from services.job import *# noqa: F403
from services.skills import *# noqa: F403
from services.company import *# noqa: F403
from services.teams import *# noqa: F403

from app import db

job = Blueprint('job' , __name__)



    #### register ######

@job.route('/add_new_job')
def add_job_GET():
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
    per_page = 6  # Adjust as needed
    application_count = 0
    paginated_jobs = Jobs.query.paginate(page=page, per_page=per_page, error_out=False)
    if"session_customer" in session:
        customer_id = session['session_customer']
        application_count = Customers.get_number_of_job_applications_by_customer_id(customer_id)
    return render_template("new_design/jobs.html", jobs=paginated_jobs,application_count = application_count)

@job.route('/read_job/<int:job_id>')
def read_job(job_id):
    application_count = 0
    if "user_id" in session:
        customer_id = session['user_id']
        application_count = Customers.get_number_of_job_applications_by_customer_id(customer_id)# noqa: F405
        cutomer_teams = Teams.get_teams_for_admin(admin_id = customer_id)# noqa: F405
        print(cutomer_teams)
        job = Jobs.get_by_id(id=job_id)  # noqa: F405
    else:
        application_count = ""
        cutomer_teams = ""
        job = Jobs.get_by_id(id=job_id)# noqa: F405


    return render_template('new_design/apply_order.html' , job=job,application_count = application_count,cutomer_teams = cutomer_teams)

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
    return render_template('edit-post.html', get_company_jobs=get_company_jobs , company=company)




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

    # Construct the base query
    query = Jobs.query

    # Apply filters if parameters are provided
    if job_type:
        query = query.filter(Jobs.job_type == job_type)
    if specialization:
        query = query.filter(Jobs.specialization == specialization)
    if city:
        query = query.filter(Jobs.town == city)

    per_page = 6  # Adjust as needed

    # Paginate the filtered jobs
    paginated_jobs = query.paginate(page=page, per_page=per_page, error_out=False)

    # Render the template with the paginated jobs
    return render_template('new_design/job_filter.html', jobs=paginated_jobs)
