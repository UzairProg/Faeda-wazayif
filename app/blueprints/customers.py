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
from services.university import University
from datetime import datetime

from ai_engine.market_value_calculator import get_market_value_for_customer
from services.customer import CustomerProfileHistory
from services.auth_token import generate_auth_token

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




UPLOAD_CUSTOMERS_IMAGES = 'static/uploads/customers/images'
UPLOAD_TEAM_IMAGES = 'static/uploads/customers/teams/images'
UPLOAD_CUSTOMERS_CV = 'static/uploads/customers/cv'


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
    """
    Handle multi-tenant authentication for Candidates, Companies, Universities, and Admins.
    Supports both JSON API clients and standard HTML form submissions.
    """
    wants_json = request.is_json or request.headers.get('Accept') == 'application/json' or 'json' in request.headers.get('Accept', '').lower()

    if request.is_json:
        data = request.get_json() or {}
        email = data.get('email', '').strip()
        password = data.get('password', '')
    else:
        email = (request.form.get('email') or '').strip()
        password = request.form.get('password') or ''

    query = Customers.query.filter_by(email=email).first()  # noqa: F405
    query2 = Company.query.filter_by(company_email=email).first() # noqa: F405
    query3 = Admin.get_by_email(email)
    query4 = University.query.filter_by(email=email).first()

    # Admin login check
    if query3 and query3.check_password(password):
        if not query3.is_active:
            if wants_json:
                return jsonify({"success": False, "message": "حسابك معطّل. تواصل مع المدير العام."}), 403
            flash('حسابك معطّل. تواصل مع المدير العام.', 'error')
            return render_template('/new_design/login.html', error=True)
            
        session['admin_id'] = query3.id
        session['admin_role'] = query3.role
        session['show_banner'] = True
        query3.last_login = datetime.utcnow()
        db.session.commit()

        token = generate_auth_token({
            "id": query3.id,
            "user_id": query3.id,
            "email": query3.email,
            "role": "admin",
            "admin_role": query3.role
        })

        if wants_json:
            return jsonify({
                "success": True,
                "role": "admin",
                "token": token,
                "user": {
                    "id": query3.id,
                    "name": query3.username,
                    "email": query3.email,
                    "role": "admin"
                },
                "redirect_url": "/admin"
            })

        flash(f'مرحباً {query3.username}!', 'success')
        return redirect(url_for('admin.admin_dashboard'))

    # Candidate login check
    if query is not None and query.password == password:
        if getattr(query, 'deleted_at', None) is not None:
            if wants_json:
                return jsonify({"success": False, "message": "هذا الحساب تم حذفه سابقاً."}), 403
            return render_template('/new_design/login.html', deleted_error=True)

        if query.status == 'suspended':
            session['suspended_email'] = query.email
            session['suspension_reason'] = query.suspension_reason or 'انتهاك شروط الاستخدام'
            if wants_json:
                return jsonify({"success": False, "message": "حسابك معطل أو موقوف مؤقتاً."}), 403
            return redirect(url_for('core.suspended_account'))
            
        session['session_customer'] = True
        session['show_banner'] = True
        session['user_id'] = query.id
        session['email_session'] = email
        full_name = query.fullname or Customers.get_customer_fullname_by_user_email(email=email) or email.split('@')[0]
        if query.activated == True:
            session['customer_activated'] = True

        token = generate_auth_token({
            "id": query.id,
            "user_id": query.id,
            "user_string_id": query.user_id,
            "email": query.email,
            "role": "candidate"
        })

        if wants_json:
            return jsonify({
                "success": True,
                "role": "candidate",
                "token": token,
                "user": {
                    "id": query.id,
                    "user_id": query.user_id,
                    "name": full_name,
                    "email": query.email,
                    "role": "candidate"
                },
                "redirect_url": "/candidate/profile"
            })

        flash(f'مرحباً بك مجدداً {full_name}!', 'success')
        return redirect('/')

    # Company login check
    if query2 is not None and query2.login_password == password:
        if query2.status == 'suspended':
            session['suspended_email'] = query2.company_email
            session['suspension_reason'] = query2.suspension_reason or 'مخالفة سياسات المنصة'
            if wants_json:
                return jsonify({"success": False, "message": "حساب الشركة معطل أو موقوف مؤقتاً."}), 403
            return redirect(url_for('core.suspended_account'))
            
        session['session_company'] = True
        session['show_banner'] = True
        company_id = Company.get_company_id_by_email(company_email=email) # noqa: F405
        session['company_id'] = company_id
        session['company_email_session'] = email
        company_name = Company.get_company_english_name_by_company_id(company_id) or "شركة" # noqa: F405
        if query2.activated == True:
            session['company_activated'] = True

        token = generate_auth_token({
            "id": company_id,
            "user_id": company_id,
            "company_id": company_id,
            "email": query2.company_email,
            "role": "company"
        })

        if wants_json:
            return jsonify({
                "success": True,
                "role": "company",
                "token": token,
                "user": {
                    "id": company_id,
                    "name": company_name,
                    "email": query2.company_email,
                    "role": "company"
                },
                "redirect_url": "/company"
            })

        flash('<span class="h1-size">تم تسجيل الدخول بإسم شركة</span> <span class="h1-size">'  '</span>' '<span class="h1-size">   </span> <span class="h1-size">' + company_name + '</span>')
        return redirect('/')

    # University login check
    if query4 is not None and query4.password == password:
        if query4.status == 'suspended':
            session['suspended_email'] = query4.email
            session['suspension_reason'] = 'حساب المؤسسة الأكاديمية معطل مؤقتاً'
            if wants_json:
                return jsonify({"success": False, "message": "حساب الجامعة معطل أو موقوف مؤقتاً."}), 403
            return redirect(url_for('core.suspended_account'))

        session['session_university'] = True
        session['show_banner'] = True
        session['university_id'] = query4.id
        session['university_email'] = query4.email
        uni_name = query4.name_ar or query4.name_en or "جامعة"

        token = generate_auth_token({
            "id": query4.id,
            "user_id": query4.id,
            "university_id": query4.id,
            "email": query4.email,
            "role": "university"
        })

        if wants_json:
            return jsonify({
                "success": True,
                "role": "university",
                "token": token,
                "user": {
                    "id": query4.id,
                    "name": uni_name,
                    "email": query4.email,
                    "logo": query4.logo,
                    "role": "university"
                },
                "redirect_url": "/university"
            })

        flash(f'مرحباً بك {uni_name}!')
        return redirect('/university')

    # No valid credentials found
    if wants_json:
        return jsonify({"success": False, "message": "بيانات الدخول غير صحيحة. يرجى التأكد من البريد الإلكتروني وكلمة المرور."}), 401
    return render_template('/new_design/login.html', error=True)

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
    """
    Process new customer registration.
    Validates form data, password strength, and ensures the email is unique across the platform.
    """
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
    """
    Handle password reset requests.
    Generates a secure token and sends a reset link to the user's email address.
    """
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
    """
    Process a job application from a customer or a team.
    Ensures the user's profile is fully completed before allowing the application.
    """
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
    return send_from_directory('static/uploads/customers/images', filename)




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
        
        ip_evidence_dir = os.path.join('static', 'uploads', 'customers', 'ip_evidence')
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
        customer_obj = Customers.query.get(user_id) if user_id else None  # noqa: F405
        if not customer_obj:
            session.pop('session_customer', None)
            session.pop('user_id', None)
            flash('لم يتم العثور على حسابك، يرجى تسجيل الدخول مرة أخرى.')
            return redirect('/login')
        
        # Calculate market value for the dashboard
        market_data = get_market_value_for_customer(customer_obj)
        
        # Get history (last 6 events)
        history_records = CustomerProfileHistory.query.filter_by(customer_id=customer_obj.id).order_by(CustomerProfileHistory.created_at.desc()).limit(6).all()
        if history_records:
            history_records.reverse()  # chronological order for chart
        
        return render_template('panel/customer_panel.html', customer=customer_obj, market_data=market_data, history=history_records)
    elif 'session_company' in session:
        company_id = session.get('company_id')
        company_obj = Company.query.get(company_id) if company_id else None  # noqa: F405
        if not company_obj:
            session.pop('session_company', None)
            session.pop('company_id', None)
            flash('لم يتم العثور على حساب الشركة، يرجى تسجيل الدخول مرة أخرى.')
            return redirect('/login')
        return render_template('panel/company_panel/company_panel.html', company=company_obj)
    else:
        flash('يجب تسجيل الدخول أولاً')
        return redirect('/login')


@customer.route('/logout', methods=['GET', 'POST'])
def logout():
    """Clear all session data and redirect to home."""
    session.clear()
    if request.is_json or request.headers.get('Accept') == 'application/json':
        return jsonify({"success": True, "message": "تم تسجيل الخروج بنجاح"})
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


# ==============================================================================
# REST API v1 — CANDIDATE WORKSPACE & AUTH IDENTITY
# ==============================================================================

@customer.route('/api/v1/auth/me', methods=['GET'])
def api_auth_me():
    """Return authenticated user identity & active role."""
    if 'session_customer' in session and 'user_id' in session:
        cust = Customers.query.get(session['user_id'])
        if cust:
            token = generate_auth_token({
                "id": cust.id,
                "user_id": cust.id,
                "user_string_id": cust.user_id,
                "email": cust.email,
                "role": "candidate"
            })
            return jsonify({
                "authenticated": True,
                "role": "candidate",
                "token": token,
                "user": {
                    "id": cust.id,
                    "user_id": cust.user_id,
                    "email": cust.email,
                    "name": cust.fullname,
                    "img": cust.img,
                    "is_verified": bool(cust.is_verified)
                }
            })
    elif 'session_company' in session and 'company_id' in session:
        comp = Company.query.get(session['company_id'])
        if comp:
            token = generate_auth_token({
                "id": comp.id,
                "user_id": comp.id,
                "company_id": comp.id,
                "email": comp.company_email,
                "role": "company"
            })
            return jsonify({
                "authenticated": True,
                "role": "company",
                "token": token,
                "user": {
                    "id": comp.id,
                    "company_id": comp.id,
                    "email": comp.company_email,
                    "name": comp.company_english_name,
                    "logo": comp.company_logo,
                    "is_verified": bool(comp.is_verified)
                }
            })
    elif 'session_university' in session and 'university_id' in session:
        uni = University.query.get(session['university_id'])
        if uni:
            token = generate_auth_token({
                "id": uni.id,
                "user_id": uni.id,
                "university_id": uni.id,
                "email": uni.email,
                "role": "university"
            })
            return jsonify({
                "authenticated": True,
                "role": "university",
                "token": token,
                "user": {
                    "id": uni.id,
                    "university_id": uni.id,
                    "email": uni.email,
                    "name": uni.name_ar or uni.name_en,
                    "logo": uni.logo,
                    "is_verified": bool(uni.is_verified)
                }
            })
    elif 'admin_id' in session:
        adm = Admin.query.get(session['admin_id'])
        if adm:
            token = generate_auth_token({
                "id": adm.id,
                "user_id": adm.id,
                "email": adm.email,
                "role": "admin",
                "admin_role": adm.role
            })
            return jsonify({
                "authenticated": True,
                "role": "admin",
                "token": token,
                "user": {
                    "id": adm.id,
                    "email": adm.email,
                    "name": adm.username,
                    "role": adm.role
                }
            })

    return jsonify({
        "authenticated": False,
        "role": None,
        "user": None
    })


@customer.route('/api/v1/candidate/profile', methods=['GET'])
def api_get_candidate_profile():
    """Return full structured profile for the current logged-in candidate."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "يجب تسجيل الدخول كمرشح للوصول إلى هذا الملف"}), 401
    
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"message": "لم يتم العثور على بيانات المرشح"}), 404
        
    return jsonify(cust.to_candidate_profile_dict())


@customer.route('/api/v1/candidate/profile/identity', methods=['PUT', 'POST'])
def api_update_candidate_identity():
    """Update candidate personal identity fields and optional profile avatar."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "غير مصرح"}), 401
    
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"message": "لم يتم العثور على المرشح"}), 404

    # Supports both JSON and multipart form-data
    if request.is_json:
        data = request.get_json() or {}
    else:
        data = request.form.to_dict()

    if 'fullname' in data and data['fullname']:
        cust.fullname = data['fullname'].strip()
    if 'about' in data:
        cust.about = data['about'].strip()
    if 'mobile' in data and data['mobile']:
        cust.mobile = data['mobile'].strip()
    if 'country' in data:
        cust.country = data['country'].strip()
    if 'government' in data:
        cust.government = data['government'].strip()
    if 'sex' in data:
        cust.sex = data['sex'].strip()

    # Handle avatar file upload
    if 'avatar' in request.files or 'img' in request.files:
        file = request.files.get('avatar') or request.files.get('img')
        if file and file.filename:
            upload_dir = current_app.config.get('UPLOAD_CUSTOMERS_IMAGES')
            os.makedirs(upload_dir, exist_ok=True)
            filename = secure_filename(f"user_{cust.id}_{int(datetime.utcnow().timestamp())}_{file.filename}")
            file_path = os.path.join(upload_dir, filename)
            file.save(file_path)
            cust.img = filename

    try:
        log_profile_update(cust, 'تحديث البيانات الشخصية')
        db.session.commit()
        return jsonify(cust.to_candidate_profile_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"حدث خطأ أثناء التحديث: {str(e)}"}), 500


@customer.route('/api/v1/candidate/profile/about', methods=['PUT'])
def api_update_candidate_about():
    """Update candidate professional summary/about."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "غير مصرح"}), 401
    
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"message": "لم يتم العثور على المرشح"}), 404

    data = request.get_json() or {}
    cust.about = data.get('about', '').strip()

    try:
        log_profile_update(cust, 'تحديث النبذة المهنية')
        db.session.commit()
        return jsonify(cust.to_candidate_profile_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"حدث خطأ: {str(e)}"}), 500


@customer.route('/api/v1/candidate/profile/skills', methods=['PUT'])
def api_update_candidate_skills():
    """Sync structured skills list for candidate."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "غير مصرح"}), 401
    
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"message": "لم يتم العثور على المرشح"}), 404

    data = request.get_json() or {}
    skills_list = data.get('skills', [])
    if not isinstance(skills_list, list):
        return jsonify({"message": "تنسيق المهارات غير صحيح"}), 400

    # Remove existing skills via session to keep relationships in sync
    for s in list(cust.skills or []):
        db.session.delete(s)

    # Deduplicate & add
    seen = set()
    for s in skills_list:
        clean_s = str(s).strip()
        if clean_s and clean_s.lower() not in seen:
            seen.add(clean_s.lower())
            new_skill = Skills(customer_id=cust.id, skill_name=clean_s)
            db.session.add(new_skill)

    try:
        log_profile_update(cust, 'تحديث المهارات المهنية')
        db.session.commit()
        db.session.refresh(cust)
        return jsonify(cust.to_candidate_profile_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"حدث خطأ: {str(e)}"}), 500


@customer.route('/api/v1/candidate/profile/experience', methods=['PUT'])
def api_update_candidate_experience():
    """Update experience level, years, and specialization."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "غير مصرح"}), 401
    
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"message": "لم يتم العثور على المرشح"}), 404

    data = request.get_json() or {}
    if 'years_of_skills' in data:
        cust.years_of_skills = str(data['years_of_skills']).strip()
    if 'preferred_field_of_work' in data:
        cust.preferred_field_of_work = str(data['preferred_field_of_work']).strip()
    if 'resume_text' in data:
        cust.resume_text = data['resume_text']

    try:
        log_profile_update(cust, 'تحديث الخبرة المهنية')
        db.session.commit()
        return jsonify(cust.to_candidate_profile_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"حدث خطأ: {str(e)}"}), 500


@customer.route('/api/v1/candidate/profile/education', methods=['PUT'])
def api_update_candidate_education():
    """Update candidate education qualifications."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "غير مصرح"}), 401
    
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"message": "لم يتم العثور على المرشح"}), 404

    data = request.get_json() or {}
    if 'educational_qualification' in data:
        cust.educational_qualification = data['educational_qualification']
    if 'university' in data:
        cust.university = data['university']
    if 'department_university' in data:
        cust.department_university = data['department_university']
    if 'gpa' in data:
        cust.gpa = data['gpa']
    if 'education_statue' in data:
        cust.education_statue = data['education_statue']
    if 'graduation_date' in data and data['graduation_date']:
        try:
            cust.graduation_date = datetime.strptime(data['graduation_date'][:10], '%Y-%m-%d').date()
        except Exception:
            pass

    try:
        log_profile_update(cust, 'تحديث المؤهلات التعليمية')
        db.session.commit()
        return jsonify(cust.to_candidate_profile_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"حدث خطأ: {str(e)}"}), 500


@customer.route('/api/v1/candidate/profile/projects', methods=['POST'])
def api_save_candidate_project():
    """Add or edit candidate project."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "غير مصرح"}), 401
    
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"message": "لم يتم العثور على المرشح"}), 404

    data = request.get_json() or {}
    project_id = data.get('id')
    project_name = data.get('project_name', '').strip()
    description = data.get('description', '').strip()
    project_url = data.get('project_url', '').strip()

    if not project_name:
        return jsonify({"message": "اسم المشروع مطلوب"}), 400

    if project_id:
        proj = CustomerProject.query.filter_by(id=project_id, customer_id=cust.id).first()
        if not proj:
            return jsonify({"message": "المشروع غير موجود"}), 404
        proj.project_name = project_name
        proj.description = description
        proj.project_url = project_url
    else:
        proj = CustomerProject(
            customer_id=cust.id,
            project_name=project_name,
            project_size='متوسط',
            description=description,
            project_url=project_url
        )
        db.session.add(proj)

    try:
        log_profile_update(cust, 'تحديث المشاريع')
        db.session.commit()
        db.session.refresh(cust)
        return jsonify(cust.to_candidate_profile_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"حدث خطأ: {str(e)}"}), 500


@customer.route('/api/v1/candidate/profile/projects/<int:project_id>', methods=['DELETE'])
def api_delete_candidate_project(project_id):
    """Delete a candidate project."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "غير مصرح"}), 401
    
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"message": "لم يتم العثور على المرشح"}), 404

    proj = CustomerProject.query.filter_by(id=project_id, customer_id=cust.id).first()
    if not proj:
        return jsonify({"message": "المشروع غير موجود"}), 404

    try:
        db.session.delete(proj)
        log_profile_update(cust, 'حذف مشروع')
        db.session.commit()
        db.session.refresh(cust)
        return jsonify(cust.to_candidate_profile_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"حدث خطأ: {str(e)}"}), 500


@customer.route('/api/v1/candidate/profile/certifications', methods=['POST'])
def api_save_candidate_certification():
    """Add or edit candidate certification."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "غير مصرح"}), 401
    
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"message": "لم يتم العثور على المرشح"}), 404

    data = request.get_json() or {}
    cert_id = data.get('id')
    cert_name = data.get('cert_name', '').strip()
    issuing_org = data.get('issuing_org', '').strip()
    issue_month = int(data['issue_month']) if data.get('issue_month') else None
    issue_year = int(data['issue_year']) if data.get('issue_year') else None
    expiry_month = int(data['expiry_month']) if data.get('expiry_month') else None
    expiry_year = int(data['expiry_year']) if data.get('expiry_year') else None
    no_expiry = bool(data.get('no_expiry', False))
    credential_id = data.get('credential_id', '').strip()
    credential_url = data.get('credential_url', '').strip()

    if not cert_name:
        return jsonify({"message": "اسم الشهادة مطلوب"}), 400

    if cert_id:
        cert = CustomerCertification.query.filter_by(id=cert_id, customer_id=cust.id).first()
        if not cert:
            return jsonify({"message": "الشهادة غير موجودة"}), 404
        cert.cert_name = cert_name
        cert.issuing_org = issuing_org
        cert.issue_month = issue_month
        cert.issue_year = issue_year
        cert.expiry_month = expiry_month
        cert.expiry_year = expiry_year
        cert.no_expiry = no_expiry
        cert.credential_id = credential_id
        cert.credential_url = credential_url
    else:
        cert = CustomerCertification(
            customer_id=cust.id,
            cert_name=cert_name,
            issuing_org=issuing_org,
            issue_month=issue_month,
            issue_year=issue_year,
            expiry_month=expiry_month,
            expiry_year=expiry_year,
            no_expiry=no_expiry,
            credential_id=credential_id,
            credential_url=credential_url
        )
        db.session.add(cert)

    try:
        # Sync legacy JSON field
        all_certs = CustomerCertification.query.filter_by(customer_id=cust.id).all()
        import json as _json
        cert_names = [c.cert_name for c in all_certs]
        if cert_name not in cert_names:
            cert_names.append(cert_name)
        cust.certifications = _json.dumps(cert_names)

        log_profile_update(cust, 'تحديث الشهادات المهنية')
        db.session.commit()
        db.session.refresh(cust)
        return jsonify(cust.to_candidate_profile_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"حدث خطأ: {str(e)}"}), 500


@customer.route('/api/v1/candidate/profile/certifications/<int:cert_id>', methods=['DELETE'])
def api_delete_candidate_certification(cert_id):
    """Delete a candidate certification."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "غير مصرح"}), 401
    
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"message": "لم يتم العثور على المرشح"}), 404

    cert = CustomerCertification.query.filter_by(id=cert_id, customer_id=cust.id).first()
    if not cert:
        return jsonify({"message": "الشهادة غير موجودة"}), 404

    try:
        db.session.delete(cert)
        # Resync legacy string
        all_certs = [c.cert_name for c in cust.certifications_list if c.id != cert_id]
        import json as _json
        cust.certifications = _json.dumps(all_certs) if all_certs else None
        log_profile_update(cust, 'حذف شهادة مهنية')
        db.session.commit()
        db.session.refresh(cust)
        return jsonify(cust.to_candidate_profile_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"حدث خطأ: {str(e)}"}), 500


@customer.route('/api/v1/candidate/profile/preferences', methods=['PUT'])
def api_update_candidate_preferences():
    """Update job search preferences."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "غير مصرح"}), 401
    
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"message": "لم يتم العثور على المرشح"}), 404

    data = request.get_json() or {}
    if 'preferred_field_of_work' in data:
        cust.preferred_field_of_work = data['preferred_field_of_work']
    if 'work_type' in data:
        cust.work_type = data['work_type']
    if 'work_style' in data:
        cust.work_style = data['work_style']
    if 'expected_salary' in data:
        cust.expected_salary = int(data['expected_salary']) if data['expected_salary'] else None
    if 'country' in data:
        cust.country = data['country']
    if 'government' in data:
        cust.government = data['government']

    try:
        log_profile_update(cust, 'تحديث تفضيلات العمل')
        db.session.commit()
        return jsonify(cust.to_candidate_profile_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"حدث خطأ: {str(e)}"}), 500


@customer.route('/api/v1/candidate/profile/visibility', methods=['PUT'])
def api_update_candidate_visibility():
    """Update profile visibility privacy level."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "غير مصرح"}), 401
    
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"message": "لم يتم العثور على المرشح"}), 404

    data = request.get_json() or {}
    visibility = data.get('visibility', 'employers_only')
    if visibility not in ['public', 'employers_only', 'private']:
        visibility = 'employers_only'

    cust.visibility = visibility

    try:
        db.session.commit()
        return jsonify(cust.to_candidate_profile_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"حدث خطأ: {str(e)}"}), 500


@customer.route('/api/v1/candidate/cv/upload', methods=['POST'])
def api_upload_candidate_cv():
    """Dedicated CV upload with ATS parsing and real score return."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "غير مصرح"}), 401
    
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"message": "لم يتم العثور على المرشح"}), 404

    if 'cv' not in request.files and 'file' not in request.files:
        return jsonify({"message": "لم يتم إرفاق ملف السيرة الذاتية"}), 400

    file = request.files.get('cv') or request.files.get('file')
    if not file or not file.filename:
        return jsonify({"message": "الملف غير صالح"}), 400

    allowed_exts = {'pdf', 'docx', 'doc', 'txt'}
    ext = file.filename.rsplit('.', 1)[-1].lower() if '.' in file.filename else ''
    if ext not in allowed_exts:
        return jsonify({"message": "صيغة الملف غير مدعومة. يرجى رفع ملف PDF أو DOCX"}), 400

    upload_cv_dir = current_app.config.get('UPLOAD_CUSTOMERS_CV')
    os.makedirs(upload_cv_dir, exist_ok=True)

    # Delete old CV if exists
    if cust.cv:
        old_path = os.path.join(upload_cv_dir, cust.cv)
        if os.path.exists(old_path):
            try:
                os.remove(old_path)
            except Exception:
                pass

    filename = secure_filename(f"cv_{cust.id}_{int(datetime.utcnow().timestamp())}_{file.filename}")
    file_path = os.path.join(upload_cv_dir, filename)
    file.save(file_path)
    cust.cv = filename

    # Run ATS parsing safely
    extracted_data = {}
    if ext == 'pdf':
        try:
            parsed = parse_cv(file_path)
            if parsed:
                extracted_data = parsed
                if parsed.get('university_en') and not cust.university:
                    cust.university = parsed['university_en']
                if parsed.get('educational_qualification') and not cust.educational_qualification:
                    cust.educational_qualification = parsed['educational_qualification']
                if parsed.get('years_of_experience') and not cust.years_of_skills:
                    cust.years_of_skills = f"{parsed['years_of_experience']} سنوات"
                if parsed.get('raw_text'):
                    cust.resume_text = parsed['raw_text']
        except Exception as err:
            current_app.logger.warning("ATS parsing failed: %s", err)

    try:
        log_profile_update(cust, 'رفع وتحليل السيرة الذاتية (ATS)')
        db.session.commit()
        
        profile_dict = cust.to_candidate_profile_dict()
        profile_dict['extracted_ats_data'] = {
            'university': extracted_data.get('university_en') or extracted_data.get('university_ar'),
            'qualification': extracted_data.get('educational_qualification'),
            'experience_years': extracted_data.get('years_of_experience'),
            'skills_found': extracted_data.get('skills')
        }
        return jsonify(profile_dict)
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"حدث خطأ أثناء حفظ السيرة الذاتية: {str(e)}"}), 500


@customer.route('/api/v1/candidate/cv/download', methods=['GET'])
def api_download_candidate_cv():
    """Allow logged-in candidate to download their own CV."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "غير مصرح"}), 401
    
    cust = Customers.query.get(session['user_id'])
    if not cust or not cust.cv:
        return jsonify({"message": "لا توجد سيرة ذاتية مرفوعة"}), 404

    upload_cv_dir = current_app.config.get('UPLOAD_CUSTOMERS_CV')
    return send_from_directory(upload_cv_dir, cust.cv, as_attachment=True)


def build_candidate_dashboard_dict(cust):
    """Construct complete, honest Career Command Center dashboard payload for an authenticated candidate."""
    profile_dict = cust.to_candidate_profile_dict()
    
    # 1. Market Value calculation
    market_raw = get_market_value_for_customer(cust)
    salary_range = market_raw.get('salary_range')
    total_score = market_raw.get('total_score', 0)
    percentile = market_raw.get('percentile_label')
    exp_tier = market_raw.get('experience_tier')
    specialization = market_raw.get('specialization')
    qs_rank_string = market_raw.get('qs_rank_string')

    has_market_value = bool(salary_range and salary_range.get('avg_salary'))
    estimated_value = salary_range.get('avg_salary') if has_market_value else None

    # Factors
    skills_count = len(profile_dict.get('skills', []))
    projects_count = len(profile_dict.get('projects', []))
    certs_count = len(profile_dict.get('certifications', []))
    has_cv = bool(cust.cv)
    has_edu = bool(cust.educational_qualification or cust.university)
    has_exp = bool(cust.years_of_skills and cust.preferred_field_of_work)
    has_prefs = bool(cust.work_type or cust.work_style or cust.expected_salary)
    
    factors = [
        {
            "key": "experience",
            "label_ar": "الخبرة والمسار المهني",
            "label_en": "Professional Experience",
            "status": "available" if cust.years_of_skills else "missing",
            "value": cust.years_of_skills if cust.years_of_skills else None
        },
        {
            "key": "education",
            "label_ar": "المؤهل الأكاديمي",
            "label_en": "Academic Qualification",
            "status": "available" if cust.educational_qualification else "missing",
            "value": cust.educational_qualification if cust.educational_qualification else None
        },
        {
            "key": "university",
            "label_ar": "الجامعة والتصنيف الدولي (QS)",
            "label_en": "University & Ranking",
            "status": "available" if cust.university else "missing",
            "value": f"{cust.university} ({qs_rank_string})" if cust.university and qs_rank_string and qs_rank_string != 'غير مصنفة' else cust.university
        },
        {
            "key": "skills",
            "label_ar": "المهارات المتخصصة",
            "label_en": "Specialized Skills",
            "status": "available" if skills_count > 0 else "missing",
            "value": f"{skills_count} مهارات" if skills_count > 0 else None
        },
        {
            "key": "projects",
            "label_ar": "المشاريع العملية والإنجازات",
            "label_en": "Practical Projects",
            "status": "available" if projects_count > 0 else "missing",
            "value": f"{projects_count} مشاريع" if projects_count > 0 else None
        },
        {
            "key": "certifications",
            "label_ar": "الشهادات والاعتمادات المهنية",
            "label_en": "Professional Certifications",
            "status": "available" if certs_count > 0 else "missing",
            "value": f"{certs_count} شهادات" if certs_count > 0 else None
        },
        {
            "key": "cv",
            "label_ar": "السيرة الذاتية (ATS)",
            "label_en": "Resume / CV (ATS)",
            "status": "available" if has_cv else "missing",
            "value": "مرفوعة وجاهزة" if has_cv else None
        }
    ]

    missing_factors = []
    if not cust.preferred_field_of_work or not cust.years_of_skills:
        missing_factors.append({
            "key": "experience",
            "label_ar": "حدد مجالك وسنوات الخبرة لضبط التقييم السوقي",
            "label_en": "Specify field and experience to unlock market benchmark",
            "section": "experience"
        })
    if not cust.educational_qualification:
        missing_factors.append({
            "key": "education",
            "label_ar": "أضف مؤهلك التعليمي والجامعة",
            "label_en": "Add your educational degree and university",
            "section": "education"
        })
    if projects_count == 0:
        missing_factors.append({
            "key": "projects",
            "label_ar": "أضف مشاريعك العملية لإثبات كفاءتك التنفيذية",
            "label_en": "Add practical projects to demonstrate execution capability",
            "section": "projects"
        })
    if certs_count == 0:
        missing_factors.append({
            "key": "certifications",
            "label_ar": "أضف الشهادات المهنية المعتمدة لتعزيز موثوقيتك",
            "label_en": "Add accredited certifications to improve credibility",
            "section": "certifications"
        })
    if not has_cv:
        missing_factors.append({
            "key": "cv",
            "label_ar": "ارفع سيرتك الذاتية لاحتساب جاهزية الـ ATS",
            "label_en": "Upload CV for ATS readiness and faster applications",
            "section": "cv"
        })

    # 2. Next Best Actions (prioritized by actual candidate profile status)
    next_actions = []
    if not has_cv:
        next_actions.append({
            "id": "upload_cv",
            "title_ar": "رفع السيرة الذاتية",
            "title_en": "Upload your CV",
            "desc_ar": "أضف سيرتك الذاتية لتفعيل تحليل ATS والتقديم السريع بضغطة زر.",
            "desc_en": "Upload your resume to activate ATS readiness and fast-track applications.",
            "action_label_ar": "رفع السيرة الذاتية",
            "action_label_en": "Upload CV",
            "action_url": "/candidate/profile?section=cv",
            "section": "cv",
            "priority": "urgent",
            "type": "cv"
        })
    if skills_count == 0:
        next_actions.append({
            "id": "add_skills",
            "title_ar": "إضافة المهارات المهنية",
            "title_en": "Add Professional Skills",
            "desc_ar": "أضف مهاراتك الأساسية والتقنية لتساعد محرك التوصيات في ترشيحك للفرص المناسبة.",
            "desc_en": "Add your core and technical skills to help match you with opportunities.",
            "action_label_ar": "إضافة مهارات",
            "action_label_en": "Add Skills",
            "action_url": "/candidate/profile?section=skills",
            "section": "skills",
            "priority": "high",
            "type": "skills"
        })
    if projects_count == 0:
        next_actions.append({
            "id": "add_projects",
            "title_ar": "استعراض المشاريع والإنجازات",
            "title_en": "Showcase Featured Projects",
            "desc_ar": "المشاريع العملية توضح قدراتك وتمنح الشركات ثقة أكبر في مهاراتك الفعلية.",
            "desc_en": "Practical projects prove your execution ability and give employers confidence.",
            "action_label_ar": "إضافة مشروع",
            "action_label_en": "Add Project",
            "action_url": "/candidate/profile?section=projects",
            "section": "projects",
            "priority": "medium",
            "type": "projects"
        })
    if not has_edu:
        next_actions.append({
            "id": "complete_education",
            "title_ar": "إكمال بيانات المؤهل العلمي",
            "title_en": "Complete Academic Qualifications",
            "desc_ar": "سجل درجتك العلمية والجامعة والمعدل لرفع دقة تقييم ملفك.",
            "desc_en": "Add degree, university and GPA to complete academic verification.",
            "action_label_ar": "تعديل المؤهلات",
            "action_label_en": "Edit Education",
            "action_url": "/candidate/profile?section=education",
            "section": "education",
            "priority": "medium",
            "type": "education"
        })
    if not has_exp:
        next_actions.append({
            "id": "set_experience",
            "title_ar": "تحديد سنوات الخبرة والمجال",
            "title_en": "Set Experience & Field",
            "desc_ar": "حدد سنوات خبرتك ومجالك المهني لاحتساب القيمة السوقية بدقة.",
            "desc_en": "Specify years of experience and field to benchmark your market value.",
            "action_label_ar": "تعديل الخبرة",
            "action_label_en": "Edit Experience",
            "action_url": "/candidate/profile?section=experience",
            "section": "experience",
            "priority": "medium",
            "type": "experience"
        })
    if not has_prefs:
        next_actions.append({
            "id": "set_preferences",
            "title_ar": "تحديد تفضيلات العمل والراتب",
            "title_en": "Set Job Preferences & Target Salary",
            "desc_ar": "حدد نوع العمل المفضل (حضوري، عن بعد، هجين) والراتب المتوقع.",
            "desc_en": "Set your preferred work style, job type, and target salary.",
            "action_label_ar": "تعديل التفضيلات",
            "action_label_en": "Edit Preferences",
            "action_url": "/candidate/profile?section=preferences",
            "section": "preferences",
            "priority": "low",
            "type": "preferences"
        })
    
    # Always include explore jobs action if profile is decent
    if profile_dict['completion']['percentage'] >= 70 or len(next_actions) < 3:
        next_actions.append({
            "id": "explore_jobs",
            "title_ar": "استكشاف الفرص المطابقة",
            "title_en": "Explore Matching Jobs",
            "desc_ar": "استكشف الفرص الوظيفية المتاحة في السوق السعودي والتي تناسب مهاراتك.",
            "desc_en": "Discover active opportunities in the Saudi market matching your background.",
            "action_label_ar": "تصفح الوظائف",
            "action_label_en": "Browse Jobs",
            "action_url": "/candidate/opportunities",
            "section": "jobs",
            "priority": "low",
            "type": "jobs"
        })

    # 3. Recommended Jobs (using real engine + fallback to approved jobs)
    recommended_jobs = []
    try:
        from ai_engine.recommendation_model import get_job_recommendations
        from app.blueprints.jobs import serialize_job_summary
        
        rec_ids_scores = {}
        if cust.user_id:
            recs = get_job_recommendations(cust.user_id, top_n=4)
            for r in recs:
                rec_ids_scores[r['job_id']] = r.get('match_score', 0)
        
        if rec_ids_scores:
            matched_jobs = Jobs.query.filter(Jobs.id.in_(list(rec_ids_scores.keys())), Jobs.status == 'approved').all()
            for j in matched_jobs:
                serialized = serialize_job_summary(j)
                score_val = rec_ids_scores.get(j.id, 0)
                if score_val and score_val > 0:
                    serialized['matchScore'] = score_val
                recommended_jobs.append(serialized)
        
        # If no recommendation from ML vectorizer, fallback to jobs matching user's field or latest approved
        if len(recommended_jobs) == 0:
            query = Jobs.query.filter_by(status='approved')
            if cust.preferred_field_of_work:
                field_jobs = query.filter(
                    db.or_(
                        Jobs.specialization.ilike(f"%{cust.preferred_field_of_work}%"),
                        Jobs.category.ilike(f"%{cust.preferred_field_of_work}%")
                    )
                ).order_by(Jobs.date_posted.desc()).limit(4).all()
                for j in field_jobs:
                    recommended_jobs.append(serialize_job_summary(j))
            
            if len(recommended_jobs) == 0:
                recent_jobs = query.order_by(Jobs.date_posted.desc()).limit(4).all()
                for j in recent_jobs:
                    recommended_jobs.append(serialize_job_summary(j))
    except Exception as e:
        current_app.logger.warning("Failed to fetch recommended jobs for dashboard: %s", e)

    # 4. Activity (Real records from profile history & applications)
    activity_items = []
    try:
        # Profile history
        history_records = CustomerProfileHistory.query.filter_by(customer_id=cust.id).order_by(CustomerProfileHistory.created_at.desc()).limit(4).all()
        for h in history_records:
            activity_items.append({
                "id": f"hist_{h.id}",
                "type": "profile_update",
                "title_ar": "تحديث الملف المهني",
                "title_en": "Profile Update",
                "desc_ar": h.event_description or "تم تحديث البيانات المهنية",
                "desc_en": h.event_description or "Professional profile updated",
                "timestamp": h.created_at.isoformat() if h.created_at else datetime.utcnow().isoformat()
            })

        # Applications
        if cust.user_id:
            app_entries = db.session.query(customer_jobs).filter_by(customer_id=cust.user_id).order_by(customer_jobs.c.timestamp.desc()).limit(4).all()
            for app_entry in app_entries:
                job_obj = Jobs.query.get(app_entry.job_id) if getattr(app_entry, 'job_id', None) else None
                job_title = job_obj.title if job_obj else "وظيفة"
                app_ts = getattr(app_entry, 'timestamp', None) or datetime.utcnow()
                activity_items.append({
                    "id": f"app_{getattr(app_entry, 'id', random.randint(100, 999))}",
                    "type": "job_application",
                    "title_ar": "تقديم على وظيفة",
                    "title_en": "Job Application Submitted",
                    "desc_ar": f"تم التقديم على {job_title}",
                    "desc_en": f"Applied for {job_title}",
                    "timestamp": app_ts.isoformat() if hasattr(app_ts, 'isoformat') else str(app_ts)
                })
        
        # Sort activity chronologically descending
        activity_items.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
        activity_items = activity_items[:6]
    except Exception as e:
        current_app.logger.warning("Failed to construct dashboard activity: %s", e)

    # 5. Quick Stats
    apps_count = 0
    try:
        if cust.user_id:
            apps_count = db.session.query(customer_jobs).filter_by(customer_id=cust.user_id).count()
    except Exception:
        apps_count = 0

    return {
        "candidate": {
            "id": cust.id,
            "user_id": cust.user_id,
            "name": cust.fullname or '',
            "headline": cust.about[:80] + "..." if cust.about and len(cust.about) > 80 else (cust.about or ''),
            "about": cust.about or '',
            "email": cust.email or '',
            "mobile": cust.mobile or '',
            "avatar": cust.img or '',
            "location": cust.government or cust.country or 'المملكة العربية السعودية',
            "country": cust.country or 'المملكة العربية السعودية',
            "government": cust.government or '',
            "verification": {
                "is_verified": bool(cust.is_verified),
                "verified_at": cust.verified_at.isoformat() if cust.verified_at else None
            },
            "visibility": getattr(cust, 'visibility', 'employers_only') or 'employers_only',
            "specialization": cust.preferred_field_of_work or '',
            "experience": cust.years_of_skills or '',
        },
        "profile_health": {
            "percentage": profile_dict['completion']['percentage'],
            "checklist": profile_dict['completion']['checklist'],
            "ats_score": profile_dict.get('ats_score'),
            "skills_count": skills_count,
            "projects_count": projects_count,
            "certifications_count": certs_count,
            "cv_uploaded": has_cv,
            "education_status": cust.educational_qualification or cust.education_statue or ''
        },
        "market_value": {
            "available": has_market_value,
            "value": estimated_value,
            "currency": "SAR",
            "period": "monthly",
            "score": total_score,
            "percentile_label": percentile,
            "experience_tier": exp_tier,
            "specialization": specialization,
            "range": salary_range,
            "qs_rank_string": qs_rank_string,
            "factors": factors,
            "missing_factors": missing_factors
        },
        "next_actions": next_actions,
        "recommended_jobs": recommended_jobs,
        "activity": activity_items,
        "quick_stats": {
            "applications_count": apps_count,
            "skills_count": skills_count,
            "projects_count": projects_count,
            "certifications_count": certs_count,
            "profile_views": None
        }
    }


@customer.route('/api/v1/candidate/dashboard', methods=['GET'])
def api_get_candidate_dashboard():
    """Return complete aggregated dashboard data for the authenticated candidate."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "يجب تسجيل الدخول كمرشح للوصول إلى لوحة التحكم"}), 401
    
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"message": "لم يتم العثور على بيانات المرشح"}), 404
        
    dashboard_data = build_candidate_dashboard_dict(cust)
    return jsonify(dashboard_data)


@customer.route('/api/v1/candidate/recommendations', methods=['GET'])
@customer.route('/recommendations', methods=['GET'])
def api_get_candidate_recommendations():
    """Return recommended jobs for candidate (JSON endpoint)."""
    if 'session_customer' not in session or 'user_id' not in session:
        # If unauthenticated, return public featured jobs
        approved_jobs = Jobs.query.filter_by(status='approved').order_by(Jobs.date_posted.desc()).limit(6).all()
        from app.blueprints.jobs import serialize_job_summary
        return jsonify({"jobs": [serialize_job_summary(j) for j in approved_jobs]})
    
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"jobs": []})
        
    dashboard_data = build_candidate_dashboard_dict(cust)
    return jsonify({"jobs": dashboard_data.get('recommended_jobs', [])})


# ==============================================================================
# SECTION 3: CANDIDATE OPPORTUNITIES, JOB DETAIL, APPLY & APPLICATIONS APIs
# ==============================================================================

def normalize_application_status(raw_status):
    """Normalize raw DB application status string to standard key and bilingual labels."""
    raw = (raw_status or '').strip().lower()
    if any(s in raw for s in ['didn', 'لم يتم', 'جديد', 'applied', 'new', 'pending']):
        return {
            "key": "applied",
            "label_ar": "تم التقديم",
            "label_en": "Applied",
            "badge_color": "sky",
            "step_index": 1
        }
    elif any(s in raw for s in ['مراجعة', 'review', 'under']):
        return {
            "key": "under_review",
            "label_ar": "قيد المراجعة",
            "label_en": "Under Review",
            "badge_color": "amber",
            "step_index": 2
        }
    elif any(s in raw for s in ['ترشيح', 'shortlist', 'مؤهل']):
        return {
            "key": "shortlisted",
            "label_ar": "مرشح للمرحلة النهائية",
            "label_en": "Shortlisted",
            "badge_color": "indigo",
            "step_index": 3
        }
    elif any(s in raw for s in ['مقابلة', 'interview']):
        return {
            "key": "interview",
            "label_ar": "مقابلة شخصية",
            "label_en": "Interview",
            "badge_color": "purple",
            "step_index": 4
        }
    elif any(s in raw for s in ['قبول', 'accept', 'approved', 'مقبول']):
        return {
            "key": "accepted",
            "label_ar": "تم القبول النهائي",
            "label_en": "Accepted",
            "badge_color": "emerald",
            "step_index": 5
        }
    elif any(s in raw for s in ['رفض', 'reject', 'اعتذار', 'غير مناسب']):
        return {
            "key": "rejected",
            "label_ar": "تم الاعتذار",
            "label_en": "Not Selected",
            "badge_color": "rose",
            "step_index": 5
        }
    else:
        return {
            "key": "applied",
            "label_ar": raw_status or "تم التقديم",
            "label_en": raw_status or "Applied",
            "badge_color": "slate",
            "step_index": 1
        }


def serialize_candidate_job(j, cust_user_id=None, cust_id=None, match_score=None):
    """Serialize a job with candidate-specific interaction metadata (applied status, bookmark)."""
    from app.blueprints.jobs import serialize_job_summary
    base = serialize_job_summary(j)
    
    has_applied = False
    app_id = None
    app_status = None
    applied_at = None
    is_saved = False
    
    if cust_user_id:
        app_entry = db.session.query(customer_jobs).filter(
            customer_jobs.c.customer_id == cust_user_id,
            customer_jobs.c.job_id == j.id
        ).first()
        if app_entry:
            has_applied = True
            app_id = app_entry.id
            status_meta = normalize_application_status(app_entry.status)
            app_status = status_meta["label_ar"]
            applied_at = app_entry.timestamp.isoformat() if app_entry.timestamp else None
            
    if cust_id:
        saved_entry = db.session.query(customer_saved_jobs).filter(
            customer_saved_jobs.c.customer_id == cust_id,
            customer_saved_jobs.c.job_id == j.id
        ).first()
        if saved_entry:
            is_saved = True
            
    return {
        **base,
        "hasApplied": has_applied,
        "applicationId": app_id,
        "applicationStatus": app_status,
        "appliedAt": applied_at,
        "isSaved": is_saved,
        "matchScore": match_score if match_score is not None else base.get("matchScore")
    }


def serialize_candidate_application(entry, cust=None):
    """Serialize customer_jobs row into typed application detail."""
    job = Jobs.query.get(entry.job_id)
    company = Company.query.get(job.company_id) if job and job.company_id else None
    status_meta = normalize_application_status(entry.status)
    
    company_name = (company.company_arabic_name or company.company_english_name or company.company_name_on_faeda) if company else (job.company_about or "شركة معتمدة")
    company_logo = f"/download_image_company/{company.company_logo}" if (company and company.company_logo) else None
    company_location = (company.state or company.country) if company else (job.town if job else None)
    company_industry = (company.company_field or company.company_type) if company else None
    
    return {
        "id": entry.id,
        "jobId": entry.job_id,
        "job": {
            "id": job.id if job else entry.job_id,
            "title": job.title if job else "وظيفة شاغرة",
            "location": job.town if job else None,
            "workType": job.job_type if job else None,
            "workplace": job.workplace if job else None,
            "isRemote": "عن بعد" in (job.workplace or "") or "remote" in (job.workplace or "").lower() if job else False,
            "specialization": job.specialization if job else None,
            "salary": {
                "min": job.salary_min or 0,
                "max": job.salary_max or 0,
                "currency": "SAR",
                "isDisclosed": bool(job.salary_min or job.salary_max)
            } if (job and (job.salary_min or job.salary_max)) else None,
            "status": job.status if job else "unknown"
        } if job else None,
        "company": {
            "id": str(company.id) if company else "",
            "name": company_name,
            "logoUrl": company_logo,
            "location": company_location,
            "isVerified": company.is_verified if company else False,
            "industry": company_industry
        },
        "status": entry.status or "لم يتم المراجعة",
        "statusKey": status_meta["key"],
        "statusLabelAr": status_meta["label_ar"],
        "statusLabelEn": status_meta["label_en"],
        "badgeColor": status_meta["badge_color"],
        "stepIndex": status_meta["step_index"],
        "appliedAt": entry.timestamp.isoformat() if entry.timestamp else None,
        "type": entry.type or "individual",
        "note": entry.note if entry.note and entry.note != "didn't inserted" else None
    }


@customer.route('/api/v1/candidate/jobs', methods=['GET'])
def api_candidate_get_jobs():
    """Return approved jobs enriched with authenticated candidate status (hasApplied, isSaved)."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "يجب تسجيل الدخول كمرشح"}), 401
    
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"message": "بيانات المرشح غير متوفرة"}), 404
        
    q = request.args.get('q', '').strip()
    location = request.args.get('location', '').strip()
    category = request.args.get('category', '').strip()
    work_type_param = request.args.get('work_type', '').strip()
    experience_param = request.args.get('experience', '').strip()
    salary_disclosed = request.args.get('salary_disclosed', '').strip()
    saved_only = request.args.get('saved_only', '').strip().lower() == 'true'
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('page_size', 10))
    
    query = Jobs.query.filter_by(status='approved')
    
    if saved_only:
        saved_job_ids = [
            r[0] for r in db.session.query(customer_saved_jobs.c.job_id).filter_by(customer_id=cust.id).all()
        ]
        query = query.filter(Jobs.id.in_(saved_job_ids))
        
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
        
    if category:
        query = query.filter(Jobs.category.ilike(f"%{category}%"))
        
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
            
    if salary_disclosed == "true":
        query = query.filter(db.or_(Jobs.salary_min > 0, Jobs.salary_max > 0))
        
    paginated = query.order_by(Jobs.date_posted.desc()).paginate(page=page, per_page=page_size, error_out=False)
    
    return jsonify({
        "jobs": [serialize_candidate_job(j, cust_user_id=cust.user_id, cust_id=cust.id) for j in paginated.items],
        "total": paginated.total,
        "page": paginated.page,
        "pageSize": paginated.per_page,
        "totalPages": paginated.pages
    })


@customer.route('/api/v1/candidate/jobs/<int:job_id>', methods=['GET'])
def api_candidate_get_job_detail(job_id):
    """Return full job detail for candidate with application readiness and status."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "يجب تسجيل الدخول كمرشح"}), 401
        
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"message": "بيانات المرشح غير متوفرة"}), 404
        
    job_obj = Jobs.query.get(job_id)
    if not job_obj or job_obj.status != 'approved':
        return jsonify({"message": "الوظيفة غير متاحة حالياً"}), 404
        
    from app.blueprints.jobs import serialize_job_detail
    detail = serialize_job_detail(job_obj)
    
    # Check application status
    app_entry = db.session.query(customer_jobs).filter(
        customer_jobs.c.customer_id == cust.user_id,
        customer_jobs.c.job_id == job_id
    ).first()
    
    has_applied = False
    app_id = None
    app_status_meta = None
    applied_at = None
    if app_entry:
        has_applied = True
        app_id = app_entry.id
        app_status_meta = normalize_application_status(app_entry.status)
        applied_at = app_entry.timestamp.isoformat() if app_entry.timestamp else None
        
    # Check saved status
    is_saved = bool(db.session.query(customer_saved_jobs).filter(
        customer_saved_jobs.c.customer_id == cust.id,
        customer_saved_jobs.c.job_id == job_id
    ).first())
    
    # Candidate readiness check
    profile_dict = cust.to_candidate_profile_dict()
    has_cv = bool(cust.cv)
    skills_count = len(profile_dict.get('skills', []))
    
    company_obj = Company.query.get(job_obj.company_id) if job_obj.company_id else None
    company_open_jobs = Jobs.query.filter_by(company_id=job_obj.company_id, status='approved').count() if job_obj.company_id else 1
    comp_about = (company_obj.about_company_arabic or company_obj.about_company_english) if company_obj else None
    comp_industry = (company_obj.company_field or company_obj.company_type) if company_obj else None

    return jsonify({
        **detail,
        "hasApplied": has_applied,
        "applicationId": app_id,
        "applicationStatus": app_status_meta["label_ar"] if app_status_meta else None,
        "applicationStatusKey": app_status_meta["key"] if app_status_meta else None,
        "appliedAt": applied_at,
        "isSaved": is_saved,
        "company": {
            **detail.get("company", {}),
            "about": comp_about,
            "industry": comp_industry,
            "openJobsCount": company_open_jobs
        },
        "candidateReadiness": {
            "isReady": has_cv or skills_count > 0,
            "profilePercentage": profile_dict.get('completion_percentage', 0),
            "hasCv": has_cv,
            "cvName": cust.cv,
            "skillsCount": skills_count,
            "fullName": cust.fullname,
            "email": cust.email,
            "phone": cust.mobile,
            "education": cust.educational_qualification or cust.university or "غير محدد"
        }
    })


@customer.route('/api/v1/candidate/jobs/recommended', methods=['GET'])
def api_candidate_get_recommended_jobs():
    """Return algorithmic job recommendations for authenticated candidate."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "يجب تسجيل الدخول كمرشح"}), 401
        
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"jobs": []})
        
    dashboard_data = build_candidate_dashboard_dict(cust)
    return jsonify({
        "jobs": dashboard_data.get('recommended_jobs', [])
    })


@customer.route('/api/v1/candidate/jobs/<int:job_id>/apply', methods=['POST'])
def api_candidate_apply_job(job_id):
    """Submit an application to an active job using authenticated candidate profile."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "يجب تسجيل الدخول كمرشح للتقديم"}), 401
        
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"message": "لم يتم العثور على ملف المرشح"}), 404
        
    job_obj = Jobs.query.get(job_id)
    if not job_obj or job_obj.status != 'approved':
        return jsonify({"message": "هذه الوظيفة غير متاحة حالياً للتقديم"}), 400
        
    # Check duplicate application
    existing_app = db.session.query(customer_jobs).filter(
        customer_jobs.c.customer_id == cust.user_id,
        customer_jobs.c.job_id == job_id
    ).first()
    
    if existing_app:
        status_meta = normalize_application_status(existing_app.status)
        return jsonify({
            "message": "لقد قمت بالتقديم على هذه الفرصة مسبقاً",
            "alreadyApplied": True,
            "applicationId": existing_app.id,
            "status": status_meta["label_ar"],
            "statusKey": status_meta["key"],
            "appliedAt": existing_app.timestamp.isoformat() if existing_app.timestamp else None
        }), 409
        
    # Insert new application row
    insert_stmt = customer_jobs.insert().values(
        customer_id=cust.user_id,
        job_id=job_id,
        type="individual",
        team_id=None,
        status="لم يتم المراجعة",
        note="",
        timestamp=datetime.utcnow()
    )
    result = db.session.execute(insert_stmt)
    db.session.commit()
    
    new_app_id = result.inserted_primary_key[0] if result.inserted_primary_key else None
    
    # Log to profile history
    try:
        score_val = 0.0
        try:
            score_val = float(get_market_value_for_customer(cust).get('total_score', 0.0))
        except Exception:
            score_val = 0.0
            
        db.session.add(CustomerProfileHistory(
            customer_id=cust.id,
            score=score_val,
            event_description=f"تقديم طلب توظيف على: {job_obj.title}"
        ))
        db.session.commit()
    except Exception as e:
        current_app.logger.warning(f"Failed to log profile history: {e}")
        
    return jsonify({
        "success": True,
        "message": "تم تقديم طلبك بنجاح باستخدام ملفك المهني على فائدة",
        "application": {
            "id": new_app_id,
            "jobId": job_id,
            "jobTitle": job_obj.title,
            "companyName": job_obj.company_about or "شركة معتمدة",
            "status": "تم التقديم",
            "statusKey": "applied",
            "appliedAt": datetime.utcnow().isoformat()
        }
    }), 201


@customer.route('/api/v1/candidate/applications', methods=['GET'])
def api_candidate_get_applications():
    """List all job applications belonging to the authenticated candidate."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "يجب تسجيل الدخول كمرشح"}), 401
        
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"message": "لم يتم العثور على المرشح"}), 404
        
    status_filter = request.args.get('status', 'all').strip().lower()
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('page_size', 10))
    
    # Query customer_jobs for candidate
    entries_query = db.session.query(customer_jobs).filter(
        customer_jobs.c.customer_id == cust.user_id
    ).order_by(customer_jobs.c.timestamp.desc())
    
    all_entries = entries_query.all()
    
    # Serialize and filter in-memory for exact status normalization
    serialized = [serialize_candidate_application(entry, cust) for entry in all_entries]
    
    if status_filter and status_filter != 'all':
        serialized = [a for a in serialized if a['statusKey'] == status_filter]
        
    total = len(serialized)
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    page_items = serialized[start_idx:end_idx]
    total_pages = (total + page_size - 1) // page_size if total > 0 else 1
    
    return jsonify({
        "applications": page_items,
        "total": total,
        "page": page,
        "pageSize": page_size,
        "totalPages": total_pages
    })


@customer.route('/api/v1/candidate/applications/<int:application_id>', methods=['GET'])
def api_candidate_get_application_detail(application_id):
    """Return application detail ONLY if it belongs to authenticated candidate (No IDOR)."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "يجب تسجيل الدخول كمرشح"}), 401
        
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"message": "لم يتم العثور على المرشح"}), 404
        
    entry = db.session.query(customer_jobs).filter(
        customer_jobs.c.id == application_id
    ).first()
    
    if not entry or entry.customer_id != cust.user_id:
        return jsonify({"message": "طلب التقديم غير موجود أو لا تملك صلاحية الوصول إليه"}), 404
        
    app_data = serialize_candidate_application(entry, cust)
    
    # Candidate profile snapshot
    profile_dict = cust.to_candidate_profile_dict()
    
    # Timeline events
    timeline = [
        {
            "step": "applied",
            "title_ar": "تم تقديم الطلب",
            "title_en": "Application Submitted",
            "date": entry.timestamp.isoformat() if entry.timestamp else None,
            "isCompleted": True,
            "isCurrent": app_data["statusKey"] == "applied"
        }
    ]
    
    if app_data["statusKey"] in ["under_review", "shortlisted", "interview", "accepted", "rejected"]:
        timeline.append({
            "step": "under_review",
            "title_ar": "مراجعة ملف الترشيح",
            "title_en": "Under Review",
            "date": None,
            "isCompleted": True,
            "isCurrent": app_data["statusKey"] == "under_review"
        })
        
    if app_data["statusKey"] in ["shortlisted", "interview", "accepted"]:
        timeline.append({
            "step": "shortlisted",
            "title_ar": "الترشيح الأولي",
            "title_en": "Shortlisted",
            "date": None,
            "isCompleted": True,
            "isCurrent": app_data["statusKey"] == "shortlisted"
        })
        
    if app_data["statusKey"] in ["accepted", "rejected"]:
        timeline.append({
            "step": app_data["statusKey"],
            "title_ar": app_data["statusLabelAr"],
            "title_en": app_data["statusLabelEn"],
            "date": None,
            "isCompleted": True,
            "isCurrent": True
        })
        
    return jsonify({
        **app_data,
        "timeline": timeline,
        "candidateSnapshot": {
            "name": cust.fullname,
            "email": cust.email,
            "mobile": cust.mobile,
            "education": cust.educational_qualification or cust.university,
            "skills": [s.get('name') for s in profile_dict.get('skills', []) if isinstance(s, dict)],
            "cvFile": cust.cv
        }
    })


@customer.route('/api/v1/candidate/jobs/<int:job_id>/save', methods=['POST'])
def api_candidate_save_job(job_id):
    """Save/bookmark a job for candidate."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "يجب تسجيل الدخول كمرشح"}), 401
        
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"message": "لم يتم العثور على المرشح"}), 404
        
    job_obj = Jobs.query.get(job_id)
    if not job_obj:
        return jsonify({"message": "الوظيفة غير موجودة"}), 404
        
    existing = db.session.query(customer_saved_jobs).filter(
        customer_saved_jobs.c.customer_id == cust.id,
        customer_saved_jobs.c.job_id == job_id
    ).first()
    
    if not existing:
        stmt = customer_saved_jobs.insert().values(
            customer_id=cust.id,
            job_id=job_id,
            created_at=datetime.utcnow()
        )
        db.session.execute(stmt)
        db.session.commit()
        
    return jsonify({"success": True, "isSaved": True, "message": "تم حفظ الوظيفة في قائمتك"})


@customer.route('/api/v1/candidate/jobs/<int:job_id>/save', methods=['DELETE'])
def api_candidate_unsave_job(job_id):
    """Remove a saved/bookmarked job."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "يجب تسجيل الدخول كمرشح"}), 401
        
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"message": "لم يتم العثور على المرشح"}), 404
        
    delete_stmt = customer_saved_jobs.delete().where(
        customer_saved_jobs.c.customer_id == cust.id,
        customer_saved_jobs.c.job_id == job_id
    )
    db.session.execute(delete_stmt)
    db.session.commit()
    
    return jsonify({"success": True, "isSaved": False, "message": "تمت إزالة الوظيفة من المحفوظات"})


@customer.route('/api/v1/candidate/saved-jobs', methods=['GET'])
def api_candidate_get_saved_jobs():
    """List all saved jobs for authenticated candidate."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "يجب تسجيل الدخول كمرشح"}), 401
        
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"message": "لم يتم العثور على المرشح"}), 404
        
    saved_rows = db.session.query(customer_saved_jobs).filter(
        customer_saved_jobs.c.customer_id == cust.id
    ).order_by(customer_saved_jobs.c.created_at.desc()).all()
    
    job_ids = [r.job_id for r in saved_rows]
    if not job_ids:
        return jsonify({"jobs": [], "total": 0, "page": 1, "pageSize": 10, "totalPages": 1})
        
    jobs_objs = Jobs.query.filter(Jobs.id.in_(job_ids)).all()
    job_map = {j.id: j for j in jobs_objs}
    
    saved_jobs_ordered = [job_map[jid] for jid in job_ids if jid in job_map]
    
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('page_size', 10))
    total = len(saved_jobs_ordered)
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    page_items = saved_jobs_ordered[start_idx:end_idx]
    total_pages = (total + page_size - 1) // page_size if total > 0 else 1
    
    return jsonify({
        "jobs": [serialize_candidate_job(j, cust_user_id=cust.user_id, cust_id=cust.id) for j in page_items],
        "total": total,
        "page": page,
        "pageSize": page_size,
        "totalPages": total_pages
    })


# ══════════════════════════════════════════════════════════════════════════════
# SECTION 4: CANDIDATE TEAMS API (CREATE, JOIN, MANAGE, CAPABILITIES, INVITES)
# ══════════════════════════════════════════════════════════════════════════════

from services.teams import TeamInvitation


def serialize_candidate_team_summary(team, current_cust):
    """Serialize team summary for candidate workspace."""
    is_owner = str(team.admin_id) in [str(current_cust.user_id), str(current_cust.id)]
    
    # Get active members
    member_rows = db.session.query(team_members_association).filter(
        team_members_association.c.team_id == team.id,
        team_members_association.c.status.in_(['منضم', 'عضو', 'قائد'])
    ).all()
    
    member_user_ids = [r.member_id for r in member_rows]
    if team.admin_id and team.admin_id not in member_user_ids:
        member_user_ids.append(team.admin_id)
        
    int_ids = [int(x) for x in member_user_ids if str(x).isdigit()]
    cust_filters = [Customers.user_id.in_(member_user_ids)]
    if int_ids:
        cust_filters.append(Customers.id.in_(int_ids))
    members_custs = Customers.query.filter(db.or_(*cust_filters)).all()
    
    # Extract capabilities
    all_member_skills = []
    for m in members_custs:
        p_dict = m.to_candidate_profile_dict()
        all_member_skills.extend(p_dict.get('skills', []))
        if m.preferred_field_of_work and m.preferred_field_of_work not in all_member_skills:
            all_member_skills.append(m.preferred_field_of_work)
            
    unique_member_skills = list(dict.fromkeys([s.strip() for s in all_member_skills if s and s.strip()]))
    
    declared_caps = []
    if team.special_program:
        declared_caps.append(team.special_program)
    if team.semi_special_program and team.semi_special_program not in declared_caps:
        declared_caps.append(team.semi_special_program)
    if team.general_program and team.general_program not in declared_caps:
        declared_caps.append(team.general_program)
        
    combined_caps = list(dict.fromkeys(declared_caps + unique_member_skills))[:12]
    
    # Opportunities count
    open_opps_count = 0
    if team.special_program or team.general_program:
        clauses = []
        if team.special_program:
            clauses.append(Jobs.specialization.ilike(f"%{team.special_program}%"))
        if team.general_program:
            clauses.append(Jobs.job_description.ilike(f"%{team.general_program}%"))
        if clauses:
            open_opps_count = Jobs.query.filter_by(status='approved').filter(db.or_(*clauses)).count()

    logo_url = f"/download_image_team/{team.img}" if team.img else None

    return {
        "id": str(team.id),
        "name": team.team_name,
        "about": team.about or "",
        "achievements": team.achievements or "",
        "specialization": team.special_program or team.general_program or "تطوير رقمي",
        "generalProgram": team.general_program,
        "semiSpecialProgram": team.semi_special_program,
        "specialProgram": team.special_program,
        "logoUrl": logo_url,
        "memberCount": max(len(members_custs), 1),
        "role": "owner" if is_owner else "member",
        "isOwner": is_owner,
        "capabilities": combined_caps,
        "memberDerivedCapabilities": unique_member_skills[:8],
        "openOpportunitiesCount": open_opps_count,
        "creationDate": team.creation_date.isoformat() if team.creation_date else None,
    }


def serialize_candidate_team_detail(team, current_cust):
    """Serialize full team detail with members, capabilities breakdown, gap suggestions, and opportunities."""
    is_owner = str(team.admin_id) in [str(current_cust.user_id), str(current_cust.id)]
    
    member_rows = db.session.query(team_members_association).filter(
        team_members_association.c.team_id == team.id,
        team_members_association.c.status.in_(['منضم', 'عضو', 'قائد'])
    ).all()
    
    member_map = {r.member_id: r for r in member_rows}
    all_member_keys = list(member_map.keys())
    if team.admin_id and team.admin_id not in all_member_keys:
        all_member_keys.append(team.admin_id)
        
    int_keys = [int(x) for x in all_member_keys if str(x).isdigit()]
    cust_filters = [Customers.user_id.in_(all_member_keys)]
    if int_keys:
        cust_filters.append(Customers.id.in_(int_keys))
    members_custs = Customers.query.filter(db.or_(*cust_filters)).all()
    
    serialized_members = []
    all_member_skills = []
    
    for m in members_custs:
        p_dict = m.to_candidate_profile_dict()
        m_skills = p_dict.get('skills', [])
        all_member_skills.extend(m_skills)
        if m.preferred_field_of_work:
            all_member_skills.append(m.preferred_field_of_work)
            
        m_is_owner = str(m.user_id) == str(team.admin_id) or str(m.id) == str(team.admin_id)
        m_role = "قائد ومؤسس الفريق" if m_is_owner else (m.preferred_field_of_work or m.about or "عضو متخصص")
        m_entry = member_map.get(m.user_id) or member_map.get(m.id)
        
        serialized_members.append({
            "id": str(m.id),
            "userId": m.user_id,
            "name": m.fullname or "عضو فريق",
            "headline": m.preferred_field_of_work or m.about or "محترف متخصص",
            "avatarUrl": f"/download_image/{m.img}" if m.img else None,
            "role": m_role,
            "isOwner": m_is_owner,
            "skills": m_skills,
            "experience": m.years_of_skills or "خبرة عملية",
            "joinedAt": m_entry.date_of_addition.isoformat() if m_entry and getattr(m_entry, 'date_of_addition', None) else (team.creation_date.isoformat() if team.creation_date else None)
        })
        
    unique_member_skills = list(dict.fromkeys([s.strip() for s in all_member_skills if s and s.strip()]))
    
    declared_caps = []
    if team.special_program:
        declared_caps.append(team.special_program)
    if team.semi_special_program and team.semi_special_program not in declared_caps:
        declared_caps.append(team.semi_special_program)
    if team.general_program and team.general_program not in declared_caps:
        declared_caps.append(team.general_program)
        
    combined_caps = list(dict.fromkeys(declared_caps + unique_member_skills))
    
    # Calculate complementary potential gaps
    potential_gaps = []
    lower_skills = [s.lower() for s in combined_caps]
    
    track_definitions = [
        {"track": "Frontend", "track_ar": "تطوير واجهات المستخدم (Frontend)", "skills": ["React", "TypeScript", "Next.js", "Vue"], "check": ["react", "vue", "frontend", "angular", "html", "javascript", "typescript"]},
        {"track": "Backend", "track_ar": "تطوير الأنظمة الخلفية (Backend)", "skills": ["Python", "Node.js", "FastAPI", "PostgreSQL"], "check": ["backend", "python", "node", "django", "fastapi", "sql", "postgresql", "api"]},
        {"track": "UI/UX Design", "track_ar": "تصميم تجربة وواجهة المستخدم (UI/UX)", "skills": ["Figma", "UI/UX", "User Research", "Wireframing"], "check": ["ui", "ux", "figma", "design", "تصميم"]},
        {"track": "AI & Data Science", "track_ar": "الذكاء الاصطناعي وهندسة البيانات (AI/ML)", "skills": ["Machine Learning", "Data Analysis", "LLMs", "Python"], "check": ["ai", "machine learning", "data", "بيانات", "ذكاء اصطناعي", "deep learning"]},
        {"track": "DevOps & Cloud", "track_ar": "السحابة وهندسة العمليات (DevOps)", "skills": ["Docker", "Kubernetes", "AWS", "CI/CD"], "check": ["devops", "docker", "cloud", "aws", "kubernetes", "سحابة"]},
        {"track": "Mobile Development", "track_ar": "تطوير تطبيقات الجوال (Mobile)", "skills": ["Flutter", "React Native", "iOS", "Android"], "check": ["flutter", "mobile", "ios", "android", "جوال"]}
    ]
    
    for t_def in track_definitions:
        has_track = any(any(c in s for c in t_def["check"]) for s in lower_skills)
        if not has_track:
            potential_gaps.append({
                "track": t_def["track"],
                "trackAr": t_def["track_ar"],
                "suggestedSkills": t_def["skills"],
                "reasonAr": f"تعزيز الفريق بقدرات {t_def['track_ar']} لتنفيذ مشاريع متكاملة."
            })
            
    # Compatible opportunities
    from app.blueprints.jobs import serialize_job_summary
    matching_jobs = []
    clauses = []
    if team.special_program:
        clauses.append(Jobs.specialization.ilike(f"%{team.special_program}%"))
    if team.general_program:
        clauses.append(Jobs.job_description.ilike(f"%{team.general_program}%"))
    if clauses:
        matching_jobs = Jobs.query.filter_by(status='approved').filter(db.or_(*clauses)).limit(6).all()
    else:
        matching_jobs = Jobs.query.filter_by(status='approved').limit(6).all()
    
    serialized_opps = [serialize_job_summary(j) for j in matching_jobs]
    
    # Pending invitations (for owner)
    pending_invites = []
    if is_owner:
        inv_rows = TeamInvitation.query.filter_by(team_id=team.id, status='pending').order_by(TeamInvitation.created_at.desc()).all()
        for inv in inv_rows:
            cand = inv.candidate
            if cand:
                pending_invites.append({
                    "id": inv.id,
                    "candidateId": cand.id,
                    "candidateUserId": cand.user_id,
                    "candidateName": cand.fullname,
                    "candidateHeadline": cand.preferred_field_of_work or cand.about or "مرشح",
                    "avatarUrl": f"/download_image/{cand.img}" if cand.img else None,
                    "role": inv.role or "عضو فريق",
                    "message": inv.message,
                    "createdAt": inv.created_at.isoformat() if inv.created_at else None
                })
                
    logo_url = f"/download_image_team/{team.img}" if team.img else None

    return {
        "id": str(team.id),
        "name": team.team_name,
        "about": team.about or "",
        "achievements": team.achievements or "",
        "specialization": team.special_program or team.general_program or "تطوير رقمي",
        "generalProgram": team.general_program,
        "semiSpecialProgram": team.semi_special_program,
        "specialProgram": team.special_program,
        "logoUrl": logo_url,
        "memberCount": len(serialized_members),
        "isOwner": is_owner,
        "currentMemberRole": "owner" if is_owner else "member",
        "members": serialized_members,
        "capabilities": combined_caps,
        "memberDerivedCapabilities": unique_member_skills,
        "potentialGaps": potential_gaps[:3],
        "opportunities": serialized_opps,
        "pendingInvitations": pending_invites,
        "creationDate": team.creation_date.isoformat() if team.creation_date else None,
    }


@customer.route('/api/v1/candidate/teams', methods=['GET'])
def api_candidate_get_teams():
    """Return all teams owned or joined by the authenticated candidate."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "يجب تسجيل الدخول كمرشح"}), 401
        
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"message": "بيانات المرشح غير متوفرة"}), 404
        
    # Teams owned
    owned_teams = Teams.query.filter(
        (Teams.admin_id == cust.user_id) | (Teams.admin_id == str(cust.id))
    ).order_by(Teams.creation_date.desc()).all()
    
    # Teams joined (member but not admin)
    joined_memberships = db.session.query(team_members_association.c.team_id).filter(
        team_members_association.c.member_id == cust.user_id,
        team_members_association.c.status.in_(['منضم', 'عضو', 'قائد'])
    ).all()
    joined_team_ids = [r[0] for r in joined_memberships]
    
    owned_ids = {t.id for t in owned_teams}
    joined_teams_only_ids = [tid for tid in joined_team_ids if tid not in owned_ids]
    
    joined_teams = Teams.query.filter(Teams.id.in_(joined_teams_only_ids)).order_by(Teams.creation_date.desc()).all() if joined_teams_only_ids else []
    
    # Pending invitations count
    pending_invites_count = TeamInvitation.query.filter_by(candidate_id=cust.id, status='pending').count()
    
    return jsonify({
        "ownedTeams": [serialize_candidate_team_summary(t, cust) for t in owned_teams],
        "joinedTeams": [serialize_candidate_team_summary(t, cust) for t in joined_teams],
        "pendingInvitationsCount": pending_invites_count,
        "totalTeams": len(owned_teams) + len(joined_teams)
    })


@customer.route('/api/v1/candidate/teams/<int:team_id>', methods=['GET'])
def api_candidate_get_team_detail(team_id):
    """Return detailed team information, member matrix, capabilities and opportunities."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "يجب تسجيل الدخول كمرشح"}), 401
        
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"message": "بيانات المرشح غير متوفرة"}), 404
        
    team = Teams.query.get(team_id)
    if not team:
        return jsonify({"message": "الفريق غير موجود"}), 404
        
    return jsonify(serialize_candidate_team_detail(team, cust))


@customer.route('/api/v1/candidate/teams', methods=['POST'])
def api_candidate_create_team():
    """Create a new professional team with authenticated candidate as owner."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "يجب تسجيل الدخول كمرشح"}), 401
        
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"message": "لم يتم العثور على ملف المرشح"}), 404
        
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    about = (data.get('description') or data.get('about') or '').strip()
    specialization = (data.get('specialization') or data.get('specialProgram') or '').strip()
    general_prog = (data.get('generalProgram') or '').strip()
    semi_special = (data.get('semiSpecialProgram') or '').strip()
    achievements = (data.get('achievements') or '').strip()
    
    if not name or len(name) < 2:
        return jsonify({"message": "يرجى كتابة اسم الفريق بشكل صحيح (حرفين على الأقل)"}), 400
        
    new_team = Teams(
        team_name=name,
        about=about,
        achievements=achievements,
        general_program=general_prog or "تقنية وتطوير",
        semi_special_program=semi_special,
        special_program=specialization or "فريق رقمي متكامل",
        admin_id=cust.user_id,
        creation_date=datetime.utcnow()
    )
    db.session.add(new_team)
    db.session.commit()
    
    # Add creator as owner member in team_members
    try:
        db.session.execute(team_members_association.insert().values(
            team_id=new_team.id,
            member_id=cust.user_id,
            status='قائد',
            general_program=general_prog,
            special_program=specialization,
            date_of_addition=datetime.utcnow()
        ))
        db.session.commit()
    except Exception as e:
        current_app.logger.warning(f"Error adding admin to team_members: {e}")
        
    # Log to history
    try:
        score_val = 0.0
        try:
            score_val = float(get_market_value_for_customer(cust).get('total_score', 0.0))
        except Exception:
            score_val = 0.0
        db.session.add(CustomerProfileHistory(
            customer_id=cust.id,
            score=score_val,
            event_description=f"تأسيس فريق مهني جديد: {name}"
        ))
        db.session.commit()
    except Exception as e:
        current_app.logger.warning(f"Failed to log team creation history: {e}")
        
    return jsonify({
        "success": True,
        "teamId": new_team.id,
        "message": "تم تأسيس الفريق بنجاح وبدء مساحة العمل المهنية",
        "team": serialize_candidate_team_detail(new_team, cust)
    }), 201


@customer.route('/api/v1/candidate/teams/<int:team_id>', methods=['PUT'])
def api_candidate_update_team(team_id):
    """Update team information (Owner only)."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "يجب تسجيل الدخول كمرشح"}), 401
        
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"message": "لم يتم العثور على المرشح"}), 404
        
    team = Teams.query.get(team_id)
    if not team:
        return jsonify({"message": "الفريق غير موجود"}), 404
        
    # Security: Verify ownership
    if str(team.admin_id) not in [str(cust.user_id), str(cust.id)]:
        return jsonify({"message": "غير مصرح لك بتعديل بيانات هذا الفريق (صلاحية القائد فقط)"}), 403
        
    data = request.get_json() or {}
    if 'name' in data:
        name = data['name'].strip()
        if len(name) >= 2:
            team.team_name = name
    if 'description' in data:
        team.about = data['description'].strip()
    elif 'about' in data:
        team.about = data['about'].strip()
    if 'specialization' in data:
        team.special_program = data['specialization'].strip()
    if 'generalProgram' in data:
        team.general_program = data['generalProgram'].strip()
    if 'semiSpecialProgram' in data:
        team.semi_special_program = data['semiSpecialProgram'].strip()
    if 'achievements' in data:
        team.achievements = data['achievements'].strip()
        
    db.session.commit()
    return jsonify({
        "success": True,
        "message": "تم تحديث بيانات الفريق بنجاح",
        "team": serialize_candidate_team_detail(team, cust)
    })


@customer.route('/api/v1/candidate/teams/<int:team_id>', methods=['DELETE'])
def api_candidate_delete_team(team_id):
    """Disband / delete a team (Owner only)."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "يجب تسجيل الدخول كمرشح"}), 401
        
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"message": "لم يتم العثور على المرشح"}), 404
        
    team = Teams.query.get(team_id)
    if not team:
        return jsonify({"message": "الفريق غير موجود"}), 404
        
    if str(team.admin_id) not in [str(cust.user_id), str(cust.id)]:
        return jsonify({"message": "غير مصرح لك بحل هذا الفريق (صلاحية القائد فقط)"}), 403
        
    # Clean up associations
    db.session.execute(team_members_association.delete().where(team_members_association.c.team_id == team.id))
    TeamInvitation.query.filter_by(team_id=team.id).delete()
    db.session.delete(team)
    db.session.commit()
    
    return jsonify({"success": True, "message": "تم حل الفريق بنجاح"})


@customer.route('/api/v1/candidate/teams/<int:team_id>/leave', methods=['POST'])
def api_candidate_leave_team(team_id):
    """Leave a team as a member."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "يجب تسجيل الدخول كمرشح"}), 401
        
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"message": "لم يتم العثور على المرشح"}), 404
        
    team = Teams.query.get(team_id)
    if not team:
        return jsonify({"message": "الفريق غير موجود"}), 404
        
    if str(team.admin_id) in [str(cust.user_id), str(cust.id)]:
        return jsonify({"message": "لا يمكن لقائد ومؤسس الفريق المغادرة مباشرة. يمكنك إدارة الفريق أو حله من الإعدادات."}), 400
        
    db.session.execute(team_members_association.delete().where(
        and_(
            team_members_association.c.team_id == team.id,
            team_members_association.c.member_id == cust.user_id
        )
    ))
    db.session.commit()
    
    return jsonify({"success": True, "message": "تمت مغادرة الفريق بنجاح"})


@customer.route('/api/v1/candidate/teams/<int:team_id>/members/<string:member_user_id>', methods=['DELETE'])
def api_candidate_remove_team_member(team_id, member_user_id):
    """Remove a member from team (Owner only)."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "يجب تسجيل الدخول كمرشح"}), 401
        
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"message": "لم يتم العثور على المرشح"}), 404
        
    team = Teams.query.get(team_id)
    if not team:
        return jsonify({"message": "الفريق غير موجود"}), 404
        
    if str(team.admin_id) not in [str(cust.user_id), str(cust.id)]:
        return jsonify({"message": "صلاحية استبعاد الأعضاء متاحة لقائد الفريق فقط"}), 403
        
    if member_user_id in [cust.user_id, str(cust.id), team.admin_id]:
        return jsonify({"message": "لا يمكن إزالة قائد الفريق من قائمة الأعضاء"}), 400
        
    db.session.execute(team_members_association.delete().where(
        and_(
            team_members_association.c.team_id == team.id,
            team_members_association.c.member_id == member_user_id
        )
    ))
    db.session.commit()
    
    return jsonify({"success": True, "message": "تمت إزالة العضو من الفريق بنجاح"})


@customer.route('/api/v1/candidate/teams/candidates/search', methods=['GET'])
def api_candidate_search_for_teams():
    """Search candidates to invite to professional teams with complementary skills."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "يجب تسجيل الدخول كمرشح"}), 401
        
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"candidates": []})
        
    q = request.args.get('q', '').strip()
    skill = request.args.get('skill', '').strip()
    field = request.args.get('field', '').strip()
    location = request.args.get('location', '').strip()
    team_id = request.args.get('team_id', type=int)
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('page_size', 10))
    
    query = Customers.query.filter(
        Customers.id != cust.id,
        Customers.status == 'active'
    )
    
    if team_id:
        existing_member_user_ids = [
            r[0] for r in db.session.query(team_members_association.c.member_id).filter_by(team_id=team_id).all()
        ]
        team_obj = Teams.query.get(team_id)
        if team_obj:
            existing_member_user_ids.append(team_obj.admin_id)
            
        pending_invited_ids = [
            inv.candidate_id for inv in TeamInvitation.query.filter_by(team_id=team_id, status='pending').all()
        ]
        
        query = query.filter(
            ~Customers.user_id.in_(existing_member_user_ids),
            ~Customers.id.in_(pending_invited_ids)
        )
        
    if q:
        query = query.filter(
            db.or_(
                Customers.fullname.ilike(f"%{q}%"),
                Customers.preferred_field_of_work.ilike(f"%{q}%"),
                Customers.about.ilike(f"%{q}%")
            )
        )
        
    if skill:
        query = query.filter(
            db.or_(
                Customers.preferred_field_of_work.ilike(f"%{skill}%"),
                Customers.about.ilike(f"%{skill}%")
            )
        )
        
    if field:
        query = query.filter(Customers.preferred_field_of_work.ilike(f"%{field}%"))
        
    if location:
        query = query.filter(
            db.or_(
                Customers.government.ilike(f"%{location}%"),
                Customers.country.ilike(f"%{location}%")
            )
        )
        
    paginated = query.order_by(Customers.id.desc()).paginate(page=page, per_page=page_size, error_out=False)
    
    results = []
    for c in paginated.items:
        p_dict = c.to_candidate_profile_dict()
        results.append({
            "id": c.id,
            "userId": c.user_id,
            "name": c.fullname or "مرشح متخصص",
            "headline": c.preferred_field_of_work or c.about or "محترف رقمي",
            "location": c.government or c.country or "المملكة العربية السعودية",
            "experience": c.years_of_skills or "1-3 سنوات",
            "skills": p_dict.get('skills', []),
            "avatarUrl": f"/download_image/{c.img}" if c.img else None,
            "specialization": c.preferred_field_of_work
        })
        
    return jsonify({
        "candidates": results,
        "total": paginated.total,
        "page": paginated.page,
        "pageSize": paginated.per_page,
        "totalPages": paginated.pages
    })


@customer.route('/api/v1/candidate/teams/<int:team_id>/invite', methods=['POST'])
def api_candidate_invite_to_team(team_id):
    """Invite a candidate to join a professional team (Owner only)."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "يجب تسجيل الدخول كمرشح"}), 401
        
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"message": "لم يتم العثور على المرشح"}), 404
        
    team = Teams.query.get(team_id)
    if not team:
        return jsonify({"message": "الفريق غير موجود"}), 404
        
    if str(team.admin_id) not in [str(cust.user_id), str(cust.id)]:
        return jsonify({"message": "إرسال الدعوات متاح فقط لقائد الفريق"}), 403
        
    data = request.get_json() or {}
    target_cand_id = data.get('candidateId')
    target_user_id = data.get('candidateUserId')
    role = data.get('role') or "عضو متخصص"
    message = data.get('message') or f"يدعوك {cust.fullname} للانضمام إلى فريق {team.team_name}"
    
    target_cand = None
    if target_cand_id:
        target_cand = Customers.query.get(target_cand_id)
    elif target_user_id:
        target_cand = Customers.query.filter_by(user_id=target_user_id).first()
        
    if not target_cand:
        return jsonify({"message": "المرشح المطلوب دعوته غير موجود"}), 404
        
    if target_cand.id == cust.id:
        return jsonify({"message": "لا يمكنك دعوة نفسك للفريق"}), 400
        
    # Check already member
    is_already_member = db.session.query(team_members_association).filter(
        team_members_association.c.team_id == team.id,
        team_members_association.c.member_id == target_cand.user_id,
        team_members_association.c.status.in_(['منضم', 'عضو', 'قائد'])
    ).first()
    if is_already_member:
        return jsonify({"message": "هذا المرشح عضو بالفعل في الفريق"}), 409
        
    # Check pending invitation
    existing_inv = TeamInvitation.query.filter_by(
        team_id=team.id,
        candidate_id=target_cand.id,
        status='pending'
    ).first()
    if existing_inv:
        return jsonify({"message": "توجد دعوة معلقة مرسلة لهذا المرشح مسبقاً"}), 409
        
    new_inv = TeamInvitation(
        team_id=team.id,
        candidate_id=target_cand.id,
        invited_by_id=cust.id,
        status='pending',
        role=role,
        message=message,
        created_at=datetime.utcnow()
    )
    db.session.add(new_inv)
    
    # Also add or update row in team_members with status 'مدعو'
    existing_member_row = db.session.query(team_members_association).filter(
        team_members_association.c.team_id == team.id,
        team_members_association.c.member_id == target_cand.user_id
    ).first()
    if not existing_member_row:
        db.session.execute(team_members_association.insert().values(
            team_id=team.id,
            member_id=target_cand.user_id,
            status='مدعو',
            special_program=role,
            date_of_addition=datetime.utcnow()
        ))
    db.session.commit()
    
    return jsonify({
        "success": True,
        "invitationId": new_inv.id,
        "message": f"تم إرسال دعوة الانضمام للمرشح {target_cand.fullname} بنجاح"
    }), 201


@customer.route('/api/v1/candidate/teams/invitations', methods=['GET'])
def api_candidate_get_invitations():
    """List pending team invitations received by authenticated candidate."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "يجب تسجيل الدخول كمرشح"}), 401
        
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"invitations": []})
        
    invitations = TeamInvitation.query.filter_by(
        candidate_id=cust.id,
        status='pending'
    ).order_by(TeamInvitation.created_at.desc()).all()
    
    results = []
    for inv in invitations:
        team = inv.team
        inviter = inv.invited_by
        if team:
            results.append({
                "id": inv.id,
                "teamId": team.id,
                "teamName": team.team_name,
                "teamSpecialization": team.special_program or team.general_program or "فريق عمل رقمي",
                "teamAbout": team.about or "",
                "teamLogoUrl": f"/download_image_team/{team.img}" if team.img else None,
                "inviterName": inviter.fullname if inviter else "قائد الفريق",
                "role": inv.role or "عضو متخصص",
                "message": inv.message,
                "createdAt": inv.created_at.isoformat() if inv.created_at else None
            })
            
    return jsonify({"invitations": results})


@customer.route('/api/v1/candidate/teams/invitations/<int:invitation_id>/respond', methods=['POST'])
def api_candidate_respond_invitation(invitation_id):
    """Accept or reject a received team invitation."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "يجب تسجيل الدخول كمرشح"}), 401
        
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"message": "لم يتم العثور على المرشح"}), 404
        
    inv = TeamInvitation.query.get(invitation_id)
    if not inv or inv.candidate_id != cust.id:
        return jsonify({"message": "الدعوة غير موجودة أو غير مصرح لك بالرد عليها"}), 404
        
    if inv.status != 'pending':
        return jsonify({"message": "تم الرد على هذه الدعوة مسبقاً"}), 400
        
    data = request.get_json() or {}
    action = data.get('action', '').strip().lower()
    
    if action == 'accept':
        inv.status = 'accepted'
        inv.responded_at = datetime.utcnow()
        
        # Add / update candidate in team_members with status 'منضم'
        existing_row = db.session.query(team_members_association).filter(
            team_members_association.c.team_id == inv.team_id,
            team_members_association.c.member_id == cust.user_id
        ).first()
        
        if existing_row:
            db.session.execute(
                team_members_association.update().where(
                    and_(
                        team_members_association.c.team_id == inv.team_id,
                        team_members_association.c.member_id == cust.user_id
                    )
                ).values(status='منضم', date_of_addition=datetime.utcnow())
            )
        else:
            db.session.execute(team_members_association.insert().values(
                team_id=inv.team_id,
                member_id=cust.user_id,
                status='منضم',
                special_program=inv.role or "عضو متخصص",
                date_of_addition=datetime.utcnow()
            ))
            
        db.session.commit()
        return jsonify({
            "success": True,
            "action": "accepted",
            "message": "تم قبول الدعوة بنجاح والانضمام للفريق"
        })
        
    elif action == 'reject' or action == 'decline':
        inv.status = 'rejected'
        inv.responded_at = datetime.utcnow()
        
        # Remove from team_members if was 'مدعو'
        db.session.execute(team_members_association.delete().where(
            and_(
                team_members_association.c.team_id == inv.team_id,
                team_members_association.c.member_id == cust.user_id,
                team_members_association.c.status == 'مدعو'
            )
        ))
        db.session.commit()
        return jsonify({
            "success": True,
            "action": "rejected",
            "message": "تم رفض الدعوة بنجاح"
        })
    else:
        return jsonify({"message": "إجراء غير صالح (يرجى تحديد accept أو reject)"}), 400


@customer.route('/api/v1/candidate/teams/invitations/<int:invitation_id>', methods=['DELETE'])
def api_candidate_cancel_invitation(invitation_id):
    """Cancel a pending team invitation (Team owner only)."""
    if 'session_customer' not in session or 'user_id' not in session:
        return jsonify({"message": "يجب تسجيل الدخول كمرشح"}), 401
        
    cust = Customers.query.get(session['user_id'])
    if not cust:
        return jsonify({"message": "لم يتم العثور على المرشح"}), 404
        
    inv = TeamInvitation.query.get(invitation_id)
    if not inv:
        return jsonify({"message": "الدعوة غير موجودة"}), 404
        
    team = inv.team
    if not team or str(team.admin_id) not in [str(cust.user_id), str(cust.id)]:
        return jsonify({"message": "إلغاء الدعوات متاح فقط لقائد الفريق"}), 403
        
    inv.status = 'cancelled'
    
    # Remove from team_members if was 'مدعو'
    target_cand = inv.candidate
    if target_cand:
        db.session.execute(team_members_association.delete().where(
            and_(
                team_members_association.c.team_id == team.id,
                team_members_association.c.member_id == target_cand.user_id,
                team_members_association.c.status == 'مدعو'
            )
        ))
        
    db.session.commit()
    return jsonify({"success": True, "message": "تم إلغاء الدعوة بنجاح"})




