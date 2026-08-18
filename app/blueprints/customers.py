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
import csv
from werkzeug.utils import secure_filename
import random
import secrets
import re
from email.message import EmailMessage
import ssl
import smtplib
from services.teams import Teams , team_members_association
from ai_engine.ats_parser import parse_cv
from sqlalchemy import and_
from ai_engine.market_value_calculator import get_market_value_for_customer


import string
from services.admin import Admin
from datetime import datetime

from ai_engine.market_value_calculator import get_market_value_for_customer
from services.customer import CustomerProfileHistory

QS_UNIVERSITIES = []

def get_qs_universities():
    global QS_UNIVERSITIES
    if not QS_UNIVERSITIES:
        # current_app.root_path is typically app folder, so we go up to find ai_engine
        csv_path = os.path.join(current_app.root_path, '..', 'ai_engine', 'Data', 'qs_rankings_2025.csv')
        try:
            with open(csv_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                QS_UNIVERSITIES = [row['Institution Name'] for row in reader if row.get('Institution Name')]
        except Exception as e:
            print(f"Error loading QS dataset: {e}")
            QS_UNIVERSITIES = []
    return QS_UNIVERSITIES

def log_profile_update(customer_obj, event_desc):
    """Recalculates market value and logs it to history."""
    try:
        market_data = get_market_value_for_customer(customer_obj)
        new_history = CustomerProfileHistory(
            customer_id=customer_obj.id,
            score=market_data['total_score'],
            event_description=event_desc
        )
        db.session.add(new_history)
    except Exception as e:
        print(f"Failed to log profile update: {str(e)}")

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

@customer.route('/login')
def get_login():
    return render_template('/new_design/login.html')

@customer.route('/login', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')
    query = Customers.query.filter_by(email=email).first()  # noqa: F405
    query3 = Admin.get_by_email(email)

    # Admin login check
    if query3 and query3.check_password(password):
        if not query3.is_active:
            flash('حسابك معطّل. تواصل مع المدير العام.', 'error')
            return render_template('/new_design/login.html' , error = True)
            
        session['admin_id'] = query3.id
        session['admin_role'] = query3.role
        session['show_banner'] = True
        query3.last_login = datetime.utcnow()
        db.session.commit()
        flash(f'مرحباً {query3.username}!', 'success')
        return redirect(url_for('admin.admin_dashboard'))

    # Check if this email belongs to a company account - reject and redirect
    query2 = Company.query.filter_by(company_email=email).first() # noqa: F405
    if query2 is not None:
        flash('هذا البريد الإلكتروني مسجل كحساب منشأة. يرجى تسجيل الدخول من بوابة المنشآت.', 'warning')
        return redirect(url_for('company_panel.company_login'))

    # Customer login check
    if query is not None and query.password == password:
        if query.deleted_at is not None:
            return render_template('/new_design/login.html' , deleted_error = True)

        if query.status == 'suspended':
            session['suspended_email'] = query.email
            session['suspension_reason'] = query.suspension_reason or 'انتهاك شروط الاستخدام'
            return redirect(url_for('core.suspended_account'))
            
        # save session
        session['session_customer'] = True
        session['show_banner'] = True
        session['user_id'] = Customers.get_session_user_id(email=email)# noqa: F405
        session['email_session'] = email
        full_name = Customers.get_customer_fullname_by_user_email(email=email) # noqa: F405
        flash(f'مرحباً بك مجدداً {full_name}!', 'success')
        if query.activated == True:
            session['customer_activated'] = True
        return redirect('/')

    # No valid credentials found
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

    # Reject company registration from this form - companies must use their own portal
    if acc_type == "company":
        flash('لتسجيل حساب منشأة، يرجى استخدام بوابة تسجيل المنشآت.', 'warning')
        return redirect(url_for('company_panel.company_login'))

    # Validation check
    if not all([full_name, email, mobile, password, acc_type]):
        flash('يجب ملئ جميع الحقول ', 'error')
        return redirect('/register')

    if len(password) < 8 or not re.search(r'[!@#$&*]', password):
        flash('يجب أن تتكون كلمة المرور من 8 أحرف على الأقل وتحتوي على رمز خاص من (!@#$&*)', 'error')
        return render_template('/new_design/register.html', error=True)

    # Check if email is already registered (in both customers and companies tables)
    check_customer = Customers.get_by_email(email) # noqa: F405
    check_company = Company.get_by_email(company_email=email) # noqa: F405

    if check_customer or check_company:
        flash('عذرا هذا المستخدم موجود بالفعل', 'error')
        return render_template('/new_design/register.html' , error = True)

    try:
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
            reset_link = url_for('customer.reset_password', token=token, _external=True)

            # Render the email HTML template
            email_html_content = render_template('/new_design/email.html', reset_link=reset_link)

            # Email details
            # NOTE: Credentials have been moved to the .env file for security.
            email_sender = os.environ.get('SENDER_EMAIL', 'coursesforyo@gmail.com')
            email_password = os.environ.get('SENDER_PASSWORD')
            email_receiver = email
            subject = "Reset Your Password"
            em = EmailMessage()
            em['From'] = email_sender
            em['To'] = email_receiver
            em['Subject'] = subject
            em.set_content(email_html_content, subtype='html')

            # Send the email
            try:
                context = ssl.create_default_context()
                context.check_hostname = False
                context.verify_mode = ssl.CERT_NONE
                with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
                    if email_password:
                        smtp.login(email_sender, email_password)
                        smtp.sendmail(email_sender, email_receiver, em.as_string())
                    else:
                        print(f"Mock email sent to {email_receiver}. Set MAIL_PASSWORD to send real emails.")
            except Exception as e:
                print(f"Failed to send email: {e}")

            flash('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. الرجاء تفقد صندوق الوارد.', 'success')
            return redirect(url_for('customer.get_login'))
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
     return redirect('/job-list')
@customer.route('/searchjobresult')
def searchjobresult():
     return redirect('/job-list')

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
    personal_data = Customers.is_personal_not_null(id=customer_id) # noqa: F405
    if not personal_data:
        flash('عذرا يجب ملئ جميع البيانات')
        return redirect('/edit-profile/personal_data')
    job_data = Customers.is_job_data_not_null(id=customer_id) # noqa: F405
    if not job_data:
        flash('عذرا يجب ملئ جميع البيانات')
        return redirect('/edit-profile/job_data')
    educational_data = Customers.is_educational_datanot_null(id=customer_id) # noqa: F405
    if not educational_data:
        flash('عذرا يجب ملئ جميع البيانات')
        return redirect('/edit-profile/educational_data')
    team = request.form.get('type_team')
    if team:  # Assuming team name is part of the form
        type = "team"
        team_id = request.form.get('type_team')
    else:
        type = "individual"
        team_id = None
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
    status = Customers.get_job_status_by_customer_id(user_id, job_id)# noqa: F405

    if result:
        ################## Check if the customer has rejected for this job
        if status == "rejected":
            return render_template('new_design/unsuccessful_job.html')
            ################## Check if the customer has accepted for this job
        if status == "approved":
            return render_template('new_design/success_job.html')
            ################## Check if the customer has recommended or didnt review for this job
        return render_template('new_design/apply_before.html')

    else:
        # If the customer has not applied for the job, insert the application

        status = "Didn't reviewed"
        note = "didn't inserted"

        application = customer_jobs.insert().values(customer_id=user_id, job_id=job_id,status=status,note=note , type = type , team_id= team_id)# noqa: F405
        db.session.execute(application)# noqa: F405
        db.session.commit()# noqa: F405
        flash('You have successfully applied for the job.')

    # Redirect to some confirmation page or back to the job listings
    return render_template('new_design/apply_job.html')# replace 'customer.job_listings' with your actual job listings route

####################

# NOTE: Duplicate /my_job_applications route removed.
# The working route is /my-jobapplications (below at jobapplications_get).
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
            return render_template('new_design/error.html', error_message="Customer not found")

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
        return render_template('new_design/error.html', error_message=str(e))


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
            team_id=team.id, member_id=member_id, status='عضو'
        ))
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return f"Failed to add admin to team: {e}", 500

    return redirect('/my_team')

@customer.route('/edit_team/<int:team_id>', methods=['GET'])
def get_edit_team(team_id):
    if "session_customer" not in session:
        return redirect('/login')
    id = session['user_id']
    team = Teams.query.get(team_id)
    if not team or str(team.admin_id) != str(id):
        flash('ليس لديك صلاحية لتعديل هذا الفريق')
        return redirect('/my_team')
    return render_template('/panel/edit_team.html', team=team)

@customer.route('/edit_team/<int:team_id>', methods=['POST'])
def post_edit_team(team_id):
    if "session_customer" not in session:
        return redirect('/login')
    id = session['user_id']
    team = Teams.query.get(team_id)
    if not team or str(team.admin_id) != str(id):
        flash('ليس لديك صلاحية لتعديل هذا الفريق')
        return redirect('/my_team')

    team.team_name = request.form.get('team_name')
    team.about = request.form.get('team_about')
    team.achievements = request.form.get('achievement')
    team.general_program = request.form.get('general_specialization')
    team.semi_special_program = request.form.get('semi_special_program')
    team.special_program = request.form.get('special_program')

    new_image = request.files.get('new_image')
    if new_image and new_image.filename:
        upload_image_dir = current_app.config.get('UPLOAD_TEAM_IMAGES')
        os.makedirs(upload_image_dir, exist_ok=True)
        filename = secure_filename(new_image.filename)
        file_path = os.path.join(upload_image_dir, filename)
        new_image.save(file_path)
        team.img = filename

    try:
        db.session.commit()
        flash('تم تحديث بيانات الفريق بنجاح')
    except Exception as e:
        db.session.rollback()
        flash(f'حدث خطأ: {e}')
    return redirect(f'/profile_team/{team.id}')
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


@customer.route('/api/search_user', methods=['GET'])
def search_user():
    q = request.args.get('q', '').strip()
    if not q:
        return jsonify({'error': 'Please provide an email or ID'}), 400
    
    # Try searching by user_id first, then by email
    customer_obj = Customers.query.filter_by(user_id=q).first()
    if not customer_obj:
        customer_obj = Customers.query.filter_by(email=q).first()
        
    if customer_obj:
        return jsonify({
            'user_id': customer_obj.user_id,
            'fullname': customer_obj.fullname,
            'email': customer_obj.email
        })
    else:
        return jsonify({'error': 'المستخدم غير موجود'}), 404


@customer.route('/add_members_to_team/<int:team_id>', methods=['POST'])
def add_members_to_team(team_id):
    member_ids = request.form.getlist('member_id')
    general_programs = request.form.getlist('general_prog')
    semi_special_programs = request.form.getlist('semi_special_prog')
    special_programs = request.form.getlist('special_prog')

    # Check if the team exists
    team = Teams.query.get(team_id)
    if team is None:
        flash('الفريق غير موجود', 'error')
        return redirect('/')

    # Check if the current user is an admin of the team
    user_id = session['user_id']
    admin_check = Teams.get_admin_id_by_id(id=team_id)

    if str(user_id) != str(admin_check):
        flash('ليس لديك الصلاحية لإضافة أعضاء', 'error')
        return redirect('/')

    for member_id, general_program, semi_special_program, special_program in zip(member_ids, general_programs, semi_special_programs, special_programs):
        # Check if the user exists
        user = Customers.query.filter_by(user_id=member_id).first()
        if user is None:
            flash("المستخدم غير موجود", 'error')
            return redirect(f'/add_member_to_team/{team_id}')

        # Check if the user is already a member of the team
        existing_membership = db.session.query(team_members_association).filter(and_(
            team_members_association.c.team_id == team_id,
            team_members_association.c.member_id == member_id
            )).first()
        if existing_membership:
            flash("المستخدم مضاف مسبقاً في هذا الفريق", 'error')
            return redirect(f'/add_member_to_team/{team_id}')

        # Add member to the team_members association table
        db.session.execute(team_members_association.insert().values(
            team_id=team_id,
            member_id=member_id,
            general_program=general_program,
            semi_special_program=semi_special_program,
            special_program=special_program
        ))

    db.session.commit()

    flash('تم إضافة العضو بنجاح')
    return redirect(f'/add_member_to_team/{team_id}')


@customer.route('/accept_team_invetation')
def accept_team_invetation():
    flash('تمت العملية بنجاح')
    return redirect('/teams_invites')

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

    pending_requests_count = 0
    if str(user.id) == str(team.admin_id):
        pending_requests_count = db.session.query(team_members_association).filter(
            team_members_association.c.team_id == team_id,
            team_members_association.c.status == 'طلب انضمام'
        ).count()

    return render_template('/panel/profile_team.html',user = user,team = team,team_id=team_id , team_members = team_members, pending_requests_count=pending_requests_count)

@customer.route('/edit-profile/personal_data', methods=['GET'])
def get_edit_profile_personal_data():
    if 'user_id' not in session:
        flash('You must be logged in to edit your profile.', 'warning')
        return redirect('/login')
    user_id = session['user_id']
    user = Customers.query.get(user_id)# noqa: F405
    if not user:
        flash('User not found.', 'error')
        return redirect('/login')
    return render_template('panel/customer_account_personal.html', user=user)


@customer.route('/edit-profile/job_data', methods=['GET'])
def get_edit_profile_job_data():
    if 'user_id' not in session:
        flash('You must be logged in to edit your profile.', 'warning')
        return redirect('/login')
    user_id = session['user_id']
    user = Customers.query.get(user_id)# noqa: F405
    if not user:
        flash('User not found.', 'error')
        return redirect('/login')
    return render_template('panel/customer_account_job_data.html', user=user,
                           years_of_skills=user.years_of_skills,
                           preferred_field_of_work=user.preferred_field_of_work,
                           work_type=user.work_type)


@customer.route('/edit-profile/educational_data', methods=['GET'])
def get_edit_profile_educational_data():
    if 'user_id' not in session:
        flash('You must be logged in to edit your profile.', 'warning')
        return redirect('/login')
    user_id = session['user_id']
    user = Customers.query.get(user_id)# noqa: F405
    if not user:
        flash('User not found.', 'error')
        return redirect('/login')
    return render_template('panel/customer_account_educational_data.html', user=user,
                           education_statue=user.education_statue,
                           educational_qualification=user.educational_qualification,
                           university=user.university,
                           department_university=user.department_university,
                           gpa=user.gpa,
                           universities=get_qs_universities())


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

            new_mobile = request.form.get('new_mobile') or request.form.get('phoneNumber')
            if new_mobile:
                user.mobile = new_mobile.strip()

            user.about = request.form.get('about', '').strip()
            new_sex = request.form.get('new_sex')
            if new_sex:
                user.sex = new_sex.strip()
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
                log_profile_update(user, 'تحديث البيانات الشخصية')
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
        # Handle Professional Certifications (LinkedIn-style)
        cert_names = request.form.getlist('cert_name[]')
        cert_orgs = request.form.getlist('cert_org[]')
        cert_issue_months = request.form.getlist('cert_issue_month[]')
        cert_issue_years = request.form.getlist('cert_issue_year[]')
        cert_expiry_months = request.form.getlist('cert_expiry_month[]')
        cert_expiry_years = request.form.getlist('cert_expiry_year[]')
        cert_no_expiry = request.form.getlist('cert_no_expiry[]')
        cert_credential_ids = request.form.getlist('cert_credential_id[]')
        cert_credential_urls = request.form.getlist('cert_credential_url[]')

        CustomerCertification.query.filter_by(customer_id=user_id).delete()
        saved_cert_names = []
        for i in range(len(cert_names)):
            if cert_names[i].strip() and cert_orgs[i].strip() if i < len(cert_orgs) else False:
                new_cert = CustomerCertification(
                    customer_id=user_id,
                    cert_name=cert_names[i].strip(),
                    issuing_org=cert_orgs[i].strip() if i < len(cert_orgs) else '',
                    issue_month=int(cert_issue_months[i]) if i < len(cert_issue_months) and cert_issue_months[i] else None,
                    issue_year=int(cert_issue_years[i]) if i < len(cert_issue_years) and cert_issue_years[i] else None,
                    expiry_month=int(cert_expiry_months[i]) if i < len(cert_expiry_months) and cert_expiry_months[i] else None,
                    expiry_year=int(cert_expiry_years[i]) if i < len(cert_expiry_years) and cert_expiry_years[i] else None,
                    no_expiry=str(i) in cert_no_expiry,
                    credential_id=cert_credential_ids[i].strip() if i < len(cert_credential_ids) and cert_credential_ids[i].strip() else None,
                    credential_url=cert_credential_urls[i].strip() if i < len(cert_credential_urls) and cert_credential_urls[i].strip() else None,
                )
                db.session.add(new_cert)
                saved_cert_names.append(cert_names[i].strip())

        # Auto-sync legacy certifications string field for market value calculator
        import json as _json
        user.certifications = _json.dumps(saved_cert_names) if saved_cert_names else None

        # Handle Projects
        project_names = request.form.getlist('project_name[]')
        project_descs = request.form.getlist('project_desc[]')
        project_urls = request.form.getlist('project_url[]')
        
        CustomerProject.query.filter_by(customer_id=user_id).delete()
        for i in range(len(project_names)):
            if project_names[i].strip():
                new_proj = CustomerProject(
                    customer_id=user_id,
                    project_name=project_names[i],
                    description=project_descs[i] if i < len(project_descs) else None,
                    project_url=project_urls[i] if i < len(project_urls) else None
                )
                db.session.add(new_proj)

        # Handle IP Contributions
        ip_names = request.form.getlist('ip_name[]')
        patent_numbers = request.form.getlist('patent_number[]')
        ip_credential_urls = request.form.getlist('ip_credential_url[]')
        existing_ip_evidences = request.form.getlist('existing_ip_evidence[]')

        CustomerIPContribution.query.filter_by(customer_id=user_id).delete()
        
        ip_evidence_dir = os.path.join('mysite/static/uploads/customers/ip_evidence')
        os.makedirs(ip_evidence_dir, exist_ok=True)
        
        for i in range(len(ip_names)):
            if ip_names[i].strip():
                filename = existing_ip_evidences[i] if i < len(existing_ip_evidences) else None
                
                # Check for new file upload for this IP
                evidence_file = request.files.get(f'ip_evidence_file_{i}')
                if evidence_file and evidence_file.filename:
                    filename = secure_filename(evidence_file.filename)
                    file_path = os.path.join(ip_evidence_dir, filename)
                    evidence_file.save(file_path)

                new_ip = CustomerIPContribution(
                    customer_id=user_id,
                    ip_name=ip_names[i],
                    patent_number=patent_numbers[i] if i < len(patent_numbers) else None,
                    credential_url=ip_credential_urls[i] if i < len(ip_credential_urls) else None,
                    evidence_file=filename
                )
                db.session.add(new_ip)

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
                user.cv = filename

                # -----------------------------------------------------------
                # ATS Parsing: extract professional data from the uploaded CV.
                # CRITICAL SAFETY: wrapped in try-except so the app never
                # crashes if the PDF is malformed or the translator times out.
                # All log messages are in English per AI_AGENT_RULES.md §4.
                # -----------------------------------------------------------
                try:
                    parsed_data = parse_cv(file_path)

                    # Update university with the English-translated name (for
                    # accurate QS Ranking dataset matching).
                    if parsed_data.get('university_en'):
                        user.university = parsed_data['university_en']

                    # Update educational qualification extracted from the CV.
                    if parsed_data.get('educational_qualification'):
                        user.educational_qualification = parsed_data['educational_qualification']

                    # Update years of experience extracted from the CV.
                    if parsed_data.get('years_of_experience') is not None:
                        user.years_of_skills = parsed_data['years_of_experience']

                    current_app.logger.info(
                        "ATS: CV parsed successfully for user_id=%s — "
                        "university_en='%s', qualification='%s', experience='%s'",
                        user_id,
                        parsed_data.get('university_en'),
                        parsed_data.get('educational_qualification'),
                        parsed_data.get('years_of_experience'),
                    )

                except Exception as ats_error:
                    # Log the error in English and continue seamlessly.
                    current_app.logger.error(
                        "ATS: CV parsing failed for user_id=%s, file='%s'. "
                        "Profile update will proceed without ATS data. Error: %s",
                        user_id,
                        file_path,
                        str(ats_error),
                    )

                
        log_profile_update(user, 'تحديث البيانات المهنية والسيرة الذاتية')
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
        log_profile_update(user, 'تحديث المؤهلات العلمية')
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

        log_profile_update(user, 'تحديث شامل للملف الشخصي')
 # Commit the changes to the database
        db.session.commit()# noqa: F405

        flash('تم تحديث البيانات بنجاح', 'success')
        return redirect('/edit-profile')


    # Handle cases where the user is not logged in
    flash('You must be logged in to edit your profile.', 'warning')
    return redirect('/login')


######################################################################
# ============== NEW ROUTES (Audit Fixes) ==============
######################################################################

@customer.route('/redirects')
def redirects():
    """Dashboard router: redirects customer or company to their panel."""
    if 'session_customer' in session:
        user_id = session.get('user_id')
        customer_obj = Customers.query.get(user_id)  # noqa: F405
        
        # Calculate market value for the dashboard
        market_data = get_market_value_for_customer(customer_obj)
        
        # Get history (last 6 events)
        history_records = CustomerProfileHistory.query.filter_by(customer_id=customer_obj.id).order_by(CustomerProfileHistory.created_at.desc()).limit(6).all()
        history_records.reverse()  # chronological order for chart
        
        return render_template('panel/customer_panel.html', customer=customer_obj, market_data=market_data, history=history_records)
    elif 'session_company' in session:
        return redirect(url_for('company_panel.company_dashboard'))
    else:
        flash('يجب تسجيل الدخول أولاً')
        return redirect('/login')


@customer.route('/logout')
def logout():
    """Clear all session data and redirect to home."""
    session.clear()
    flash('تم تسجيل الخروج بنجاح')
    return redirect('/')


@customer.route('/my_profile')
def my_profile():
    """Display the current user's own profile page."""
    if 'session_customer' in session:
        user_id = session.get('user_id')
        customer_obj = Customers.query.get(user_id)  # noqa: F405
        if not customer_obj:
            flash('لم يتم العثور على المستخدم', 'error')
            return redirect('/login')
            
        return render_template('panel/profile.html', customer=customer_obj)
    elif 'session_company' in session:
        return redirect(url_for('company_panel.company_profile'))
    else:
        flash('يجب تسجيل الدخول أولاً')
        return redirect('/login')


@customer.route('/my_team')
def my_team():
    """List all teams that the current user is a member of."""
    if 'session_customer' not in session:
        flash('يجب تسجيل الدخول أولاً')
        return redirect('/login')
    user_id = session.get('user_id')
    customer_obj = Customers.query.get(user_id)  # noqa: F405
    user_id_str = customer_obj.user_id if customer_obj else None
    
    # Get all teams where the user is admin
    admin_teams = Teams.query.filter_by(admin_id=user_id).all()
    
    # Get all teams where the user is a member
    member_teams = Teams.query.join(
        team_members_association,
        team_members_association.c.team_id == Teams.id
    ).filter(
        team_members_association.c.member_id == user_id_str
    ).all()
    
    # Combine uniquely
    my_teams_dict = {team.id: team for team in admin_teams}
    for team in member_teams:
        my_teams_dict[team.id] = team
    my_teams = list(my_teams_dict.values())
    
    return render_template('panel/team.html', my_teams=my_teams, customer=customer_obj)


@customer.route('/controlled_teams')
def controlled_teams():
    """List all teams that the current user is an admin of."""
    if 'session_customer' not in session:
        flash('يجب تسجيل الدخول أولاً')
        return redirect('/login')
    user_id = session.get('user_id')
    customer_obj = Customers.query.get(user_id)  # noqa: F405
    admin_teams = Teams.query.filter_by(admin_id=user_id).all()
    
    from services.team_offer import TeamOffer
    offers = TeamOffer.query.join(Teams).filter(Teams.admin_id == user_id).order_by(TeamOffer.created_at.desc()).all()
    
    return render_template('panel/controlled_teams.html', teams=admin_teams, customer=customer_obj, offers=offers)

@customer.route('/team_offer/<int:offer_id>/<action>', methods=['POST'])
def handle_team_offer(offer_id, action):
    if 'user_id' not in session:
        return redirect('/login')
    
    from services.team_offer import TeamOffer
    offer = TeamOffer.query.get_or_404(offer_id)
    
    # Check authorization
    if str(offer.team.admin_id) != str(session.get('user_id')):
        flash('غير مصرح لك باتخاذ هذا الإجراء', 'danger')
        return redirect(url_for('customer.controlled_teams'))
        
    if action == 'accept':
        offer.status = 'accepted'
        flash('تم قبول العرض بنجاح', 'success')
    elif action == 'reject':
        offer.status = 'rejected'
        flash('تم رفض العرض', 'info')
        
    db.session.commit()
    return redirect(url_for('customer.controlled_teams'))


@customer.route('/teams_invites', methods=['GET', 'POST'])
def teams_invites():
    """Show pending team invitations and handle accept/decline."""
    if 'session_customer' not in session:
        flash('يجب تسجيل الدخول أولاً')
        return redirect('/login')
    user_id = session.get('user_id')
    customer_obj = Customers.query.get(user_id)  # noqa: F405
    user_id_str = customer_obj.user_id if customer_obj else None

    if request.method == 'POST':
        team_id = request.form.get('team_id')
        action = request.form.get('action')
        if action == 'accept':
            db.session.query(team_members_association).filter(
                and_(
                    team_members_association.c.team_id == team_id,
                    team_members_association.c.member_id == user_id_str
                )
            ).update({'status': 'عضو'})
            db.session.commit()
            flash('تم قبول الدعوة بنجاح')
        elif action == 'decline':
            db.session.query(team_members_association).filter(
                and_(
                    team_members_association.c.team_id == team_id,
                    team_members_association.c.member_id == user_id_str
                )
            ).delete()
            db.session.commit()
            flash('تم رفض الدعوة')
        return redirect('/teams_invites')

    # GET: Show pending invitations
    pending_teams = Teams.query.join(
        team_members_association,
        team_members_association.c.team_id == Teams.id
    ).filter(
        team_members_association.c.member_id == user_id_str,
        team_members_association.c.status == 'مدعو'
    ).all()

    # Get incoming requests for teams where the current user is admin
    admin_teams_ids = [t.id for t in Teams.query.filter_by(admin_id=user_id).all()]
    incoming_requests = []
    if admin_teams_ids:
        incoming_requests = db.session.query(
            Customers, team_members_association.c.date_of_addition, Teams
        ).join(
            team_members_association,
            Customers.user_id == team_members_association.c.member_id
        ).join(
            Teams, Teams.id == team_members_association.c.team_id
        ).filter(
            team_members_association.c.team_id.in_(admin_teams_ids),
            team_members_association.c.status == 'طلب انضمام'
        ).all()

    return render_template('panel/invites.html', teams=pending_teams, incoming_requests=incoming_requests, customer=customer_obj, user_id=user_id)

@customer.route('/visit_customer_profile/<string:user_id>')
def visit_customer_profile(user_id):
    """View another user's public profile."""
    customer_obj = Customers.query.filter_by(user_id=user_id).first()  # noqa: F405
    if not customer_obj:
        flash('لم يتم العثور على المستخدم', 'error')
        return redirect('/')
    return render_template('panel/visit_profile.html', customer=customer_obj)

@customer.route('/request_join_team/<int:team_id>', methods=['POST'])
def request_join_team(team_id):
    if 'user_id' not in session:
        flash('يجب تسجيل الدخول أولاً', 'warning')
        return redirect('/login')
    
    user_id = session['user_id']
    customer_obj = Customers.query.get(user_id)  # noqa: F405
    
    # Check if already requested or member
    existing_membership = db.session.query(team_members_association).filter(
        and_(
            team_members_association.c.team_id == team_id,
            team_members_association.c.member_id == customer_obj.user_id
        )
    ).first()
    
    if existing_membership:
        flash('لقد قمت بإرسال طلب مسبقاً أو أنك عضو بالفعل في هذا الفريق', 'info')
    else:
        db.session.execute(team_members_association.insert().values(
            team_id=team_id, member_id=customer_obj.user_id, status='طلب انضمام'
        ))
        db.session.commit()
        flash('تم إرسال طلب الانضمام بنجاح، في انتظار موافقة قائد الفريق', 'success')
        
    return redirect(url_for('customer.profile_team', team_id=team_id))

@customer.route('/team_join_requests/<int:team_id>', methods=['GET'])
def team_join_requests(team_id):
    if 'user_id' not in session:
        return redirect('/login')
        
    user_id = session['user_id']
    customer_obj = Customers.query.get(user_id)  # noqa: F405
    team = Teams.query.get_or_404(team_id)
    
    if str(team.admin_id) != str(user_id):
        flash('غير مصرح لك بمشاهدة هذه الصفحة', 'error')
        return redirect('/')
        
    # Get users who requested to join
    requests = db.session.query(
        Customers, team_members_association.c.date_of_addition
    ).join(
        team_members_association,
        Customers.user_id == team_members_association.c.member_id
    ).filter(
        team_members_association.c.team_id == team_id,
        team_members_association.c.status == 'طلب انضمام'
    ).all()
    
    return render_template('new_design/team_join_requests.html', team=team, requests=requests, customer=customer_obj)

@customer.route('/handle_join_request/<int:team_id>', methods=['POST'])
def handle_join_request(team_id):
    if 'user_id' not in session:
        return redirect('/login')
        
    user_id = session['user_id']
    team = Teams.query.get_or_404(team_id)
    
    if str(team.admin_id) != str(user_id):
        flash('غير مصرح لك بإدارة هذا الفريق', 'error')
        return redirect('/')
        
    member_id = request.form.get('member_id')
    action = request.form.get('action')
    
    if action == 'accept':
        db.session.query(team_members_association).filter(
            and_(
                team_members_association.c.team_id == team_id,
                team_members_association.c.member_id == member_id
            )
        ).update({'status': 'عضو'})
        flash('تم قبول طلب الانضمام بنجاح', 'success')
    elif action == 'reject':
        db.session.query(team_members_association).filter(
            and_(
                team_members_association.c.team_id == team_id,
                team_members_association.c.member_id == member_id
            )
        ).delete()
        flash('تم رفض طلب الانضمام', 'info')
        
    db.session.commit()
    return redirect(url_for('customer.team_join_requests', team_id=team_id))

@customer.route('/remove_team_member/<int:team_id>', methods=['POST'])
def remove_team_member(team_id):
    if 'user_id' not in session:
        return redirect('/login')
        
    user_id = session['user_id']
    team = Teams.query.get_or_404(team_id)
    
    if str(team.admin_id) != str(user_id):
        flash('غير مصرح لك بإدارة هذا الفريق', 'error')
        return redirect('/')
        
    member_id = request.form.get('member_id')
    
    db.session.query(team_members_association).filter(
        and_(
            team_members_association.c.team_id == team_id,
            team_members_association.c.member_id == member_id
        )
    ).delete()
    
    db.session.commit()
    flash('تم إزالة العضو من الفريق بنجاح', 'success')
    return redirect(url_for('customer.profile_team', team_id=team_id))

@customer.route('/leave_team/<int:team_id>', methods=['POST'])
def leave_team(team_id):
    if 'user_id' not in session:
        return redirect('/login')
        
    user_id = session['user_id']
    customer_obj = Customers.query.get(user_id)  # noqa: F405
    
    db.session.query(team_members_association).filter(
        and_(
            team_members_association.c.team_id == team_id,
            team_members_association.c.member_id == customer_obj.user_id
        )
    ).delete()
    
    db.session.commit()
    flash('لقد قمت بمغادرة الفريق بنجاح', 'success')
    return redirect(url_for('customer.profile_team', team_id=team_id))

@customer.route('/browse_teams', methods=['GET'])
def browse_teams():
    """Browse all teams."""
    customer_obj = None
    if 'user_id' in session:
        user_id = session.get('user_id')
        customer_obj = Customers.query.get(user_id)  # noqa: F405
    
    teams = Teams.query.all()
    return render_template('new_design/browse_teams.html', teams=teams, customer=customer_obj)
