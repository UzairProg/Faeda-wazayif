# ==============================================================================
# الوظيفة الأساسية للملف: وحدة (Blueprint) تحتوي على مسارات العملاء (الباحثين عن عمل).
# الروابط أو الميزات: مسارات التسجيل، تسجيل الدخول، تعديل الملف الشخصي، والتقديم على الوظائف.
# المتطلبات الخاصة: يعتمد على نماذج العملاء والوظائف وإدارة جلسات المستخدم.
# ==============================================================================
######### customers.py#######
from flask import Blueprint  , render_template , redirect , request , session , flash , jsonify , url_for , current_app , send_from_directory

from app import db

from services.customer import *  # noqa: F403
from services.company import *  # noqa: F403
from services.job import * # noqa: F403
from services.skills import * # noqa: F403
import os
from werkzeug.utils import secure_filename
import random
import secrets
from email.message import EmailMessage
import ssl
import smtplib
from services.teams import Teams , team_members_association

import string

existing_user_ids = set()

########### handle the suggesstions

customer = Blueprint('customer' , __name__)




UPLOAD_CUSTOMERS_IMAGES = 'mysite/static/uploads/customers/images'
UPLOAD_TEAM_IMAGES = 'mysite/static/uploads/customers/teams/images'
UPLOAD_CUSTOMERS_CV = 'mysite/static/uploads/customers/cv'


ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS






########## login ###########
# @customer.route('/login')
# def get_login():
#     return render_template('/login/colorlib-regform-17/images/tes/index.html')




@customer.route('/login')
def get_login():
    return render_template('/new_design/login.html')

@customer.route('/login', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')
    query = Customers.query.filter_by(email=email).first()  # noqa: F405
    query2 = Company.query.filter_by(company_email=email).first() # noqa: F405

    if query is not None and query.password == password:
    # save session
        session['session_customer'] = True
        session['user_id'] = Customers.get_session_user_id(email=email)# noqa: F405
        session['email_session'] = email
        full_name = Customers.get_customer_fullname_by_user_email(email=email) # noqa: F405
        flash('<span class="h1-size">مرحبا</span> <span class="h1-size">' + full_name + '</span>')
        if query.activated == True:
            session['customer_activated'] = True
        return redirect('/')
    if query2 is not None and query2.login_password == password:
        session['session_company'] = True
        company_id = Company.get_company_id_by_email(company_email=email) # noqa: F405
        session['company_id'] = company_id
        session['company_email_session'] = email
        company_name = Company.get_company_english_name_by_company_id(company_id) # noqa: F405

        flash('<span class="h1-size">تم تسجيل الدخول بإسم شركة</span> <span class="h1-size">'  '</span>' '<span class="h1-size">   </span> <span class="h1-size">' + company_name + '</span>')
        if query2.activated == True:
            session['company_activated'] = True
        return redirect('/')
    else:
        return render_template('/new_design/login.html' , error = True)

    #### register ######

@customer.route('/register')
def Get_reg_page():
        return render_template('/new_design/register.html')



############## registeration ###########


def generate_random_variable(length=8):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))

def generate_unique_user_id():
    while True:
        new_user_id = generate_random_variable()
        if new_user_id not in existing_user_ids:
            existing_user_ids.add(new_user_id)
            return new_user_id

@customer.route('/register', methods=['POST'])
def reg_page():
    f_name = request.form.get('fName')  # Ensure this matches your form field's name attribute
    l_name = request.form.get('lName') 
    full_name = f_name + l_name
    email = request.form.get('email')
    mobile = request.form.get('phoneNumber')
    password = request.form.get('password')
    acc_type = request.form.get('userrole')
    activated = False

    # Validation check
    if not all([full_name, email, mobile, password, acc_type]):
        flash('يجب ملئ جميع الحقول ', 'error')
        return redirect('/register')

    # Check if email is already registered
    check_customer = Customers.get_by_email(email) # noqa: F405
    check_company = Company.get_by_email(company_email=email) # noqa: F405

    if check_customer or check_company:
        flash('عذرا هذا المستخدم موجود بالفعل', 'error')
        return render_template('/new_design/register.html' , error = True)

    try:
        if acc_type == "customers":
            new_user_id = generate_unique_user_id()
            new_customer = Customers(# noqa: F405
                user_id=new_user_id,
                fullname=full_name,
                email=email,
                mobile=mobile,
                password=password,
                activated=activated,
            )
            db.session.add(new_customer) # noqa: F405

        elif acc_type == "company":
            new_company = Company( # noqa: F405
                company_english_name=full_name,
                company_email=email,
                company_mobile=mobile,
                login_password=password,
                activated=activated,
            )
            db.session.add(new_company) # noqa: F405

        db.session.commit() # noqa: F405
        flash('تم انشاء الحساب بنجاح', 'يرجى تسجيل الدخول للمتابعة')
    except Exception as e:
        db.session.rollback() # noqa: F405
        flash(f'حدث خطأ: {e}', 'error')

    return redirect("/login")

############# reset password#################





@customer.route('/forgot_password', methods=['GET', 'POST'])
def post_reset_pass():
    if request.method == 'POST':
        email = request.form.get("email")
        user = Customers.query.filter_by(email=email).first() # noqa: F405
        if user:
            # Generate a random token
            token = secrets.token_urlsafe(16)
            user.token = token
            db.session.commit() # noqa: F405

            # Create the reset link
            reset_link = "https://www.faeda.site/reset_password?token=" + token

            # Render the email HTML template
            email_html_content = render_template('/new_design/email.html', reset_link=reset_link)

            # Email details
            email_sender = 'coursesforyo@gmail.com'
            email_password = 'hvvw frjd qqqf edrx'
            email_receiver = email
            subject = "Reset Your Password"
            em = EmailMessage()
            em['From'] = email_sender
            em['To'] = email_receiver
            em['Subject'] = subject
            em.set_content(email_html_content, subtype='html')

            # Send the email
            context = ssl.create_default_context()
            with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
                smtp.login(email_sender, email_password)
                smtp.sendmail(email_sender, email_receiver, em.as_string())

            return "check your email"
        else:
            return render_template('/new_design/forget_password.html', error='Email not found.')
    else:
        return render_template('/new_design/forget_password.html')


@customer.route('/reset_password', methods=['GET', 'POST'])
def reset_password():
    token = request.args.get('token')
    user = Customers.query.filter_by(token=token).first()# noqa: F405
    if token is None: # noqa: F405
        return render_template('/new_design/password_confirm.html')
    if not user:
        return render_template('/new_design/password_confirm.html', error='Invalid token.')
    if request.method == 'POST':
        password1 = request.form['password1']
        password2 = request.form['password2']
        if password1 != password2 :
            return render_template('/new_design/password_confirm.html' ,token = token, error = True , errorMsg = "كلمة المرور غير متطابقة")
        if len(password1) < 8:
            return  render_template('/new_design/password_confirm.html' , error = True ,token = token, errorMsg = "كلمة المرور يجب ان تكون اكثر من 8 احرف ")
        user.password = password1
        user.token = None
        db.session.commit()# noqa: F405
        flash("مبروك, تم تغيير كلمة المرور بنجاح")
        return redirect('/login')
    else:
        return render_template('/new_design/password_confirm.html', token=token)

#################### search a job ##############

@customer.route('/searchjob')
def searchjob():
     return render_template('search_job.html')
@customer.route('/searchjobresult')
def searchjobresult():
     return render_template('search_results.html')

@customer.route('/searchjobb', methods=['GET'])
def searchjobb():
    query = request.args.get('query')
    filter_by = request.args.get('filter', 'title')  # Default to searching by title

    if filter_by == 'title':
        jobs = Jobs.query.filter(Jobs.title.like(f'%{query}%')).all() # noqa: F405
    elif filter_by == 'town':
        jobs = Jobs.query.filter(Jobs.town.like(f'%{query}%')).all() # noqa: F405
    elif filter_by == 'discription':
        jobs = Jobs.query.filter(Jobs.discription.like(f'%{query}%')).all() # noqa: F405
    else:
        return jsonify([])  # Return an empty list if the filter is invalid

    results = [
        {
            'title': job.title,
            'town': job.town,
            'discription': job.discription,
            'id': job.id  # Corrected the key to 'id'
        }
        for job in jobs
    ]

    return jsonify(results)


######################
@customer.route('/applyjob/<int:job_id>' , methods=['GET','POST'])
def apply_for_job(job_id):
    ##### it has to be in session and compeleted data profile##########
    if "session_customer" not in session:
        session.clear()
        return redirect('/login')
    customer_id = session['user_id']
    user_id = Customers.get_user_id_by_id(customer_id) # noqa: F405
    data_not_null = Customers.is_not_null(customer_id) # noqa: F405
    if not data_not_null:
        return redirect('/edit-profile')
    team = request.form.get('type_team')
    if team:  # Assuming team name is part of the form
        type = "team"
        user_id = "admin_id"
        team_id = request.form.get('type_team')
    else:
        type = "individual"
        team_id = "0"
# لو كان التقديم الحالي ك فريق
# نتأكد ان الوظيفة لم يتم التقديم عليها من نفس الفريق اكثر من مرة
    if team :
        query = customer_jobs.select().where( # noqa: F405
        and_(customer_jobs.c.customer_id == user_id,# noqa: F405
            customer_jobs.c.type == "team",# noqa: F405
            customer_jobs.c.team_id == team_id,# noqa: F405
            customer_jobs.c.job_id == job_id)# noqa: F405
            )


# لو كان التقديم الحالي فردي
# نتأكد ان الوظيفة لم يتم التقديم عليها من قبل
    else:
        query = customer_jobs.select().where(# noqa: F405
            and_(customer_jobs.c.customer_id == user_id,# noqa: F405
                customer_jobs.c.type == "individual",# noqa: F405
                customer_jobs.c.job_id == job_id)# noqa: F405
                )

    # Check if the customer has already applied for this job

    result = db.session.execute(query).fetchone()# noqa: F405
    status = Customers.get_job_status_by_customer_id(customer_id, job_id)# noqa: F405

    if result:
        ################## Check if the customer has rejected for this job
        if status == "rejected":
            return render_template('unsuccessful_job.html')
            ################## Check if the customer has accepted for this job
        if status == "approved":
            return render_template('success_job.html')
            ################## Check if the customer has recommended or didnt review for this job
        return render_template('apply_before.html')

    else:
        # If the customer has not applied for the job, insert the application

        status = "Didn't reviewed"
        note = "didn't inserted"

        application = customer_jobs.insert().values(customer_id=user_id, job_id=job_id,status=status,note=note , type = type , team_id= team_id)# noqa: F405
        db.session.execute(application)# noqa: F405
        db.session.commit()# noqa: F405
        flash('You have successfully applied for the job.')

    # Redirect to some confirmation page or back to the job listings
    return render_template('apply_job.html')# replace 'customer.job_listings' with your actual job listings route

####################


@customer.route('/my_job_applications')
def show_job_applications():
    try:
        # Fetch the customer based on the customer_id
        customer_id = session.get('user_id')  # Use get() to handle None case
        customer = Customers.query.get(customer_id)# noqa: F405

        # Fetch all job applications associated with the customer
        job_applications = []

        # Replace this with actual logic to fetch job applications for the customer
        # For example, you can loop through customer's jobs relationship
        for job in customer.jobs:
            job_id = job.id
            status = Customers.get_job_status_by_customer_id(customer_id, job_id)# noqa: F405
            note = Customers.get_job_note_by_customer_id(customer_id, job_id)# noqa: F405
            job_applications.append({"job": job, "status": status, "note": note})

        return render_template('job_applications.html', customer=customer, job_applications=job_applications , status = status , note = note)
    except Exception as e:
        return str(e)
#####################################################################################################################################


# ...




# Route to serve user images
@customer.route('/download_image/<filename>')
def download_image(filename):
    return send_from_directory('mysite/static/uploads/customers/images', filename)




################################ recommendations ######################

@customer.route('/recommendations')
def recommendations():
    customer_id = session.get('user_id')  # Use session.get() to avoid KeyError
    if customer_id is None:
        # Handle the case where the user is not logged in, for example, by redirecting to a login page.
        return redirect('/login')  # Replace '/login' with the actual login route

    # Assuming customer_id is the ID of the logged-in customer
    customer_skills = Skills.query.filter_by(customer_id=customer_id).all()# noqa: F405

    # Extract skill names from customer_skills
    skill_names = [skill.skill_name for skill in customer_skills]

    # Find jobs that require any of the customer's skills
    matched_jobs = Jobs.query.filter(Jobs.skills.in_(skill_names)).all()# noqa: F405

    # Convert matched_jobs to a list of dictionaries
    job_list = [
        {
            'id': job.id,
            'title': job.title,
            'town': job.town,
            # Add other job fields as needed
        }
        for job in matched_jobs
    ]

    # Return the job_list as JSON
    return jsonify(job_list)




@customer.route('/my-jobapplications')
def jobapplications_get():
    # Check if customer is in session
    if "session_customer" not in session:
        return redirect('/login')

    try:
        # Fetch the customer based on the customer_id
        customer_id = session['user_id']


        personal_data = Customers.is_personal_not_null(id=customer_id)
        educational_data = Customers.is_educational_datanot_null(id=customer_id)
        job_data = Customers.is_job_data_not_null(id = customer_id)
        if not personal_data:
            flash(' عذرا يجب ملئ جميع البيانات')
            return redirect('/edit-profile/personal_data')
        if not job_data :
            flash('عذرا يجب ملئ جميع البيانات')
            return redirect('/edit-profile/job_data')

        if not educational_data :
            flash('عذرا يجب ملئ جميع البيانات')
            return redirect('/edit-profile/educational_data')
        customer = Customers.query.get(customer_id)# noqa: F405

        if not customer:
            return render_template('error.html', error_message="Customer not found")

        user_id = customer.user_id

        # Fetch all job applications associated with the customer
        job_applications = []

        # Get all customer_jobs entries for the given customer_id
        customer_jobs_entries = db.session.query(customer_jobs).filter_by(customer_id=user_id).all()# noqa: F405

        for entry in customer_jobs_entries:
            job_id = entry.job_id
            job = Jobs.query.get(job_id)# noqa: F405  # Assuming Jobs is your job model

            if job:
                status = entry.status
                note = entry.note
                application_type = entry.type
                team_id = entry.team_id
                team_name = None

                # Fetch the team name if the team_id is present
                if team_id:
                    team = Teams.query.get(team_id)
                    if team:
                        team_name = team.team_name

                job_applications.append({
                    "job": job,
                    "status": status,
                    "note": note,
                    "type": application_type,
                    "team_name": team_name
                })

        application_count = len(job_applications)

        # Render template with job applications
        return render_template('panel/customer_jobs.html', application_count=application_count, customer=customer, job_applications=job_applications)
    except Exception as e:
        # Handle exceptions in a user-friendly way
        return render_template('error.html', error_message=str(e))


@customer.route('/create_team', methods=['GET'])
def get_create_team():
    if "session_customer" not in session:
        return redirect('/login')
    id = session['user_id']
    customer = Customers.query.get(id)# noqa: F405

    personal_data = Customers.is_personal_not_null(id=id)
    educational_data = Customers.is_educational_datanot_null(id=id)
    job_data = Customers.is_job_data_not_null(id = id)
    if not personal_data:
        flash(' عذرا يجب ملئ جميع البيانات')
        return redirect('/edit-profile/personal_data')
    if not job_data :
        flash('عذرا يجب ملئ جميع البيانات')
        return redirect('/edit-profile/job_data')

    if not educational_data :
        flash('عذرا يجب ملئ جميع البيانات')
        return redirect('/edit-profile/educational_data')

    return render_template('/panel/create_team.html' , customer = customer)


@customer.route('/create_team', methods=['POST'])
def create_team():
    # Check if the user is logged in
    if "session_customer" not in session:
        return redirect(url_for('login'))  # Redirect to login page if not logged in

    # Get the team name and members from the form data
    team_name = request.form.get('team_name')
    team_about = request.form.get('team_about')
    achievement = request.form.get('achievement')
    general_specialization = request.form.get('general_specialization')
    semi_special_program = request.form.get('semi_special_program')
    special_program = request.form.get('special_program')
    admin_id = session.get('user_id')

    # Ensure UPLOAD_TEAM_IMAGES is configured
    upload_image_dir = current_app.config.get('UPLOAD_TEAM_IMAGES')
    os.makedirs(upload_image_dir, exist_ok=True)
    if not upload_image_dir:
        return "Upload directory is not configured", 500

    # Handle image upload
    new_image = request.files.get('new_image')
    file_path = None
    if new_image and new_image.filename:
        filename = secure_filename(new_image.filename)
        file_path = os.path.join(upload_image_dir, filename)
        try:
            new_image.save(file_path)
        except Exception as e:
            return f"Failed to upload image: {e}", 500
    else:
        filename = None
    # Create the team
    team = Teams(
        team_name=team_name,
        img=filename,  # Save the file path in the database
        about=team_about,
        achievements=achievement,
        general_program=general_specialization,
        semi_special_program=semi_special_program,
        special_program=special_program,
        admin_id=admin_id
    )

    # Add the team to the database session
    db.session.add(team)

    # Commit changes to the database
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return f"Failed to create team: {e}", 500

    # Add admin to the team
    try:
        member_id = Customers.get_user_id_by_id(admin_id)
        db.session.execute(team_members_association.insert().values(
            team_id=team.id, member_id=member_id, status='منضم'
        ))
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return f"Failed to add admin to team: {e}", 500

    return redirect('/my_team')
@customer.route('/add_member_to_team/<int:team_id>', methods=['get'])
def get_add_member(team_id):
    if "user_id" not in session:
        return redirect('/login')
    else:
        user_id = session['user_id']
        customer = Customers.query.get(user_id)# noqa: F405
        admin_id = Teams.get_admin_id_by_id(id = team_id)
        team = Teams.query.get(team_id)
        team_members = db.session.query(# noqa: F405
            Customers.id, # noqa: F405
            Customers.fullname, # noqa: F405
            Customers.email,# noqa: F405
            Customers.user_id,# noqa: F405
            Customers.cv,# noqa: F405
            team_members_association.c.status
        ).join(
            team_members_association,
            team_members_association.c.member_id == Customers.user_id# noqa: F405
        ).filter(
            team_members_association.c.team_id == team_id
        ).all()


        if  str(user_id) == str(admin_id):
            return render_template('/panel/add_members_to_team.html' ,customer = customer,team_id=team_id , team_members = team_members , team = team)
        else:
            return "sorry You cannot access that page"


@customer.route('/add_members_to_team/<int:team_id>', methods=['POST'])
def add_members_to_team(team_id):
    member_ids = request.form.getlist('member_id')
    general_programs = request.form.getlist('general_prog')
    semi_special_programs = request.form.getlist('semi_special_prog')
    special_programs = request.form.getlist('special_prog')

    # Check if the team exists
    team = Teams.query.get(team_id)
    if team is None:
        return "Team not found", 404

    # Check if the current user is an admin of the team
    user_id = session['user_id']
    admin_check = Teams.get_admin_id_by_id(id=team_id)

    if str(user_id) != str(admin_check):
        return "You do not have permission to add members to this team", 403

    for member_id, general_program, semi_special_program, special_program in zip(member_ids, general_programs, semi_special_programs, special_programs):
        # Check if the user exists
        user = Customers.query.filter_by(user_id=member_id).first()
        if user is None:
            return f"User with id {member_id} not found", 404

        # Check if the user is already a member of the team
        existing_membership = db.session.query(team_members_association).filter(and_(
            team_members_association.c.team_id == team_id,
            team_members_association.c.member_id == member_id
            )).first()
        if existing_membership:
            return jsonify({'message': f'User with id {member_id} is already a member of this team'}), 400

        # Add member to the team_members association table
        db.session.execute(team_members_association.insert().values(
            team_id=team_id,
            member_id=member_id,
            general_program=general_program,
            semi_special_program=semi_special_program,
            special_program=special_program
        ))

    db.session.commit()

    return jsonify({'message': 'Members added to the team successfully'}), 200


@customer.route('/accept_team_invetation')
def accept_team_invetation():
    return "ok"

@customer.route('/profile_team/<int:team_id>')
def profile_team(team_id):
    id = session['user_id']
    user = Customers.query.get(id)
    team =  Teams.query.get(team_id)
    # هنا احنامحتاجين نعرض الفريق واعضاء الفريق وحالاتهم لانهاهتتعرض للمستخدمين
    team_members = db.session.query(# noqa: F405
            Customers.id, # noqa: F405
            Customers.fullname, # noqa: F405
            Customers.email,# noqa: F405
            Customers.user_id,# noqa: F405
            Customers.cv,# noqa: F405
            team_members_association.c.status
        ).join(
            team_members_association,
            team_members_association.c.member_id == Customers.user_id# noqa: F405
        ).filter(
            team_members_association.c.team_id == team_id
        ).all()

    return render_template('/panel/profile_team.html',user = user,team = team,team_id=team_id , team_members = team_members  )


@customer.route('/edit-profile/personal_data', methods=['POST'])
def edit_profile_personal_data():
    if 'user_id' in session:
        user_id = session['user_id']
        user = Customers.query.get(user_id)# noqa: F405
        upload_image_dir = os.path.join(current_app.config['UPLOAD_CUSTOMERS_IMAGES'])
        if user:
            upload_image_dir = current_app.config.get('UPLOAD_CUSTOMERS_IMAGES')
            if not upload_image_dir:
                flash('Upload directory configuration is missing.', 'error')
                return redirect('/')


            user.fullname = request.form.get('name', '').strip()

            user.mobile = request.form.get('new_mobile', '').strip()
            user.about = request.form.get('about', '').strip()
            user.sex = request.form.get('new_sex', '').strip()
            user.country = request.form.get('country', '').strip()
            user.government = request.form.get('state', '').strip()

            # Handle profile image
            new_image = request.files.get('new_image')
            if new_image and new_image.filename:
                filename = secure_filename(new_image.filename)
                file_path = os.path.join(upload_image_dir, filename)
                new_image.save(file_path)
                # Remove old image if exists
                if user.img:
                    old_image_path = os.path.join(upload_image_dir, user.img)
                    if os.path.exists(old_image_path):
                        os.remove(old_image_path)
                user.img = filename

            # Commit changes to the database
            try:
                db.session.commit()# noqa: F405
                flash('تم تحديث البيانات بنجاح', 'success')
                return redirect('/edit-profile/personal_data')
            except Exception as e:
                flash(f'Error updating profile: {str(e)}', 'error')

        else:
            flash('User not found.', 'error')
    else:
        flash('You must be logged in to edit your profile.', 'warning')
    return redirect('/login')





@customer.route('/edit-profile/job_data', methods=['POST'])
def edit_profile_job_data():

    if 'user_id' in session:
        upload_cv_dir = os.path.join(current_app.config['UPLOAD_CUSTOMERS_CV'])
        # Create the directories if they don't exist
        os.makedirs(upload_cv_dir, exist_ok=True)
        user_id = session['user_id']
        user = Customers.query.get(user_id)# noqa: F405




        user.years_of_skills = request.form.get('new_years_of_skills')
        user.preferred_field_of_work = request.form.get('new_preferred_field_of_work')
        user.work_type = request.form.get('new_work_type')

        user.cv  =  Customers.get_customer_cv_by_user_id(id=user_id)# noqa: F405



        if 'new_cv' in request.files:
            file = request.files['new_cv']

            # Check if a new CV file was provided
            if file and file.filename:
                # Delete the old CV file if it exists
                if user.cv:
                    old_cv_path = os.path.join(upload_cv_dir, user.cv)
                    if os.path.exists(old_cv_path):
                        os.remove(old_cv_path)

                # Process and save the new CV
                filename = secure_filename(file.filename)
                file_path = os.path.join(current_app.config['UPLOAD_CUSTOMERS_CV'], filename)
                file.save(file_path)
                new_cv = filename
                # Update the user's CV field with the new CV filename
                user.cv = new_cv
 # Commit the changes to the database
        db.session.commit()# noqa: F405

        flash('تم تحديث البيانات بنجاح', 'success')
        return redirect('/edit-profile/job_data')


    # Handle cases where the user is not logged in
    flash('You must be logged in to edit your profile.', 'warning')
    return redirect('/login')




@customer.route('/edit-profile/educational_data', methods=['POST'])
def edit_profile_educational_data():

    if 'user_id' in session:
        # Create the directories if they don't exist
        user_id = session['user_id']
        user = Customers.query.get(user_id)# noqa: F405
        user.graduation_date = datetime.strptime(request.form.get('new_graduation_date'), '%Y-%m-%d')# noqa: F405
        user.education_statue = request.form.get('new_education_statue')
        user.educational_qualification = request.form.get('new_educational_qualification')
        user.university = request.form.get('new_university')
        user.department_university = request.form.get('new_department_university')
        user.gpa = request.form.get('new_gpa')
        user.img  =  Customers.get_customer_image_by_user_id(id=user_id)# noqa: F405
        db.session.commit()# noqa: F405
        flash('تم تحديث البيانات بنجاح', 'success')
        return redirect('/edit-profile/educational_data')
    # Handle cases where the user is not logged in
    flash('You must be logged in to edit your profile.', 'warning')
    return redirect('/login')




@customer.route('/edit-profile', methods=['POST'])
def edit_profile():

    if 'user_id' in session:
        upload_cv_dir = os.path.join(current_app.config['UPLOAD_CUSTOMERS_CV'])
        upload_image_dir = os.path.join(current_app.config['UPLOAD_CUSTOMERS_IMAGES'])
        # Create the directories if they don't exist
        os.makedirs(upload_cv_dir, exist_ok=True)
        user_id = session['user_id']
        user = Customers.query.get(user_id)# noqa: F405

        user.fullname = request.form.get('new_fullname')

        user.graduation_date = datetime.strptime(request.form.get('new_graduation_date'), '%Y-%m-%d')# noqa: F405



        user.mobile = request.form.get('new_mobile')
        user.about = request.form.get('about')
        user.sex = request.form.get('new_sex')
        user.education_statue = request.form.get('new_education_statue')
        user.educational_qualification = request.form.get('new_educational_qualification')
        user.university = request.form.get('new_university')
        user.department_university = request.form.get('new_department_university')
        user.gpa = request.form.get('new_gpa')
        user.years_of_skills = request.form.get('new_years_of_skills')
        user.preferred_field_of_work = request.form.get('new_preferred_field_of_work')
        user.work_type = request.form.get('new_work_type')
        user.country = request.form.get('country')
        user.government = request.form.get('state')

        user.cv  =  Customers.get_customer_cv_by_user_id(id=user_id)# noqa: F405
        user.img  =  Customers.get_customer_image_by_user_id(id=user_id)# noqa: F405



        if 'new_cv' in request.files:
            file = request.files['new_cv']

            # Check if a new CV file was provided
            if file and file.filename:
                # Delete the old CV file if it exists
                if user.cv:
                    old_cv_path = os.path.join(upload_cv_dir, user.cv)
                    if os.path.exists(old_cv_path):
                        os.remove(old_cv_path)

                # Process and save the new CV
                filename = secure_filename(file.filename)
                file_path = os.path.join(current_app.config['UPLOAD_CUSTOMERS_CV'], filename)
                file.save(file_path)
                new_cv = filename
                # Update the user's CV field with the new CV filename
                user.cv = new_cv
            if 'new_image' in request.files:
                file = request.files['new_image']

                # Check if a new CV file was provided
                if file and file.filename:
                    # Delete the old CV file if it exists
                    if user.img:
                        old_cv_path = os.path.join(upload_image_dir, user.img)
                        if os.path.exists(old_cv_path):
                            os.remove(old_cv_path)

                    # Process and save the new CV
                    filename = secure_filename(file.filename)
                    file_path = os.path.join(current_app.config['UPLOAD_CUSTOMERS_IMAGES'], filename)
                    file.save(file_path)
                    new_cv = filename
                    # Update the user's CV field with the new CV filename
                    user.img = new_cv

 # Commit the changes to the database
        db.session.commit()# noqa: F405

        flash('تم تحديث البيانات بنجاح', 'success')
        return redirect('/edit-profile')


    # Handle cases where the user is not logged in
    flash('You must be logged in to edit your profile.', 'warning')
    return redirect('/login')

