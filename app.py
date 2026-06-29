######### START FLASK APP.py ####################
from flask import Flask, render_template, redirect, session, request, flash  , url_for,jsonify , json

from email.message import EmailMessage
import ssl
import smtplib
import random

##### import data ####

from services.teams import Teams, team_members_association

from services.company import * # noqa: F403

from services.customer import Customers

from services.message import *  # noqa: F403

from services.following import *  # noqa: F403

###############
from flask_cors import CORS
import os
### separated files #####
from jobs import job_routes
from customers import customer_routes
from companies import company_routes
from messages import messages_routes

PORT = 5500
DB_FILENAME = 'database.db'
INIT_DB = True  # to create db file

def create_app():

    # create flask app
    app = Flask(__name__, static_folder='static')

    # create database extension
    app.secret_key = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '').replace(
        'postgres://', 'postgresql://') or 'sqlite:///' + DB_FILENAME

    print(app.config['SQLALCHEMY_DATABASE_URI'])

    # Set the 'UPLOAD_CUSTOMERS_IMAGES' configuration variable
    app.config['UPLOAD_CUSTOMERS_IMAGES'] = 'mysite/static/uploads/customers/images'


    # Set the 'UPLOAD_TEAM_IMAGES' configuration variable
    app.config['UPLOAD_TEAM_IMAGES'] = 'mysite/static/uploads/customers/teams/images'

    # Set the 'UPLOAD_CUSTOMERS_IMAGES' configuration variable
    app.config['UPLOAD_CUSTOMERS_CV'] = 'mysite/static/uploads/customers/cv'
    ##### config compay logo #########

    app.config['UPLOAD_COMPANY_COMMERCIAL_REGISTER'] = 'mysite/static/uploads/companies/commercial_register'
    app.config['UPLOAD_company_logo'] = 'mysite/static/uploads/companies/logo'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
    db.init_app(app)

    # create flask cors extension
    CORS(app)
    with app.app_context():
        db.create_all()
    return app, db

# create flask app
app, db = create_app()
##### link separated files ##########
app.register_blueprint(job_routes)
app.register_blueprint(customer_routes)  # Adjust the prefix as needed.
app.register_blueprint(company_routes)
app.register_blueprint(messages_routes)

################################ START ROUTES ##################


# @app.route('/')
# def index():

#     get_customer = "Faeda"  # Default value for get_customer
#     get_company = "Faeda"   # Default value for get_company

#     if "email_session" in session:
#         email = session['email_session']
#         id = session['user_id']
#         name = Customers.get_customer_name_by_user_id(id=id)
#         get_customer = Customers.get_by_id(id=id)
#         if "customer_activated" not in session :
#             return redirect('/sendcode')
#     elif "session_company" in session:
#         id = session['company_id']
#         email = session['company_email_session']
#         name = Company.get_company_english_name_by_company_id(id=id)  # noqa: F405
#         get_company = Company.get_by_id(id=id) # noqa: F405
#         if "company_activated" not in session :
#             return redirect('/sendcode')
#     else:
#         email = "Faeda@gmail.com"
#         name = "Faeda"

#     return render_template('/langing/index.html', username=email, name=name, customer=get_customer, company=get_company)


#    #######################################################################################logout##############################################

@app.route("/tstpg")
def te():
    return render_template('/new_design/email.html')

@app.route('/')
def index():

    get_customer = "Faeda"  # Default value for get_customer
    get_company = "Faeda"   # Default value for get_company

    if "email_session" in session:
        email = session['email_session']
        id = session['user_id']
        name = Customers.get_customer_name_by_user_id(id=id)
        get_customer = Customers.get_by_id(id=id)

        is_logged = True
        pic = Customers.get_customer_image_by_user_id(id=id)
        if "customer_activated" not in session :
            return redirect('/sendcode')
    elif "session_company" in session:
        id = session['company_id']
        email = session['company_email_session']
        name = Company.get_company_english_name_by_company_id(id=id)  # noqa: F405
        get_company = Company.get_by_id(id=id) # noqa: F405

        is_logged = True
        pic = Company.get_company_company_logo_by_company_id(id=id)
        if "company_activated" not in session :
            return redirect('/sendcode')
    else:
        email = "Faeda@gmail.com"
        name = "Faeda"
        is_logged = False
        pic = None
    return render_template('/new_design/index.html',email = email, username=email, name=name, customer=get_customer, company=get_company, picture=pic, logged=is_logged)

   #######################################################################################logout##############################################




@app.route('/logout')
def logout():
    session.clear()
    return redirect("/")

@app.route('/customer_serves')
def customer_serves():
    session.clear()
    return render_template("/new_design/support.html")


@app.route('/about_us')
def about_us():
    return render_template('/new_design/faeda_details.html')

@app.route('/redirects')
def redirects():
    if "session_customer" in session:
        customer_id = session['user_id']
        customer = Customers.get_by_id(customer_id)
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

        user_id = Customers.get_user_id_by_id(customer_id)
        # Fetch all job applications associated with the customer
        job_applications = []

        # Loop through customer's jobs relationship
        for job in customer.jobs:
            job_id = job.id
            status = Customers.get_job_status_by_customer_id(customer_id, job_id)
            note = Customers.get_job_note_by_customer_id(customer_id, job_id)
            type = Customers.get_application_type_by_customer_id(user_id , job_id)
            job_applications.append({"job": job, "status": status, "note": note,"type":type})

        if not job_applications:
            return render_template('panel/customer_panel.html', application_count=0, customer=customer, job_applications=[])
        application_count = len(job_applications)

        return render_template('panel/customer_panel.html', application_count=application_count, customer=customer, job_applications=job_applications , status=status)

    if "session_company" in session:
        id = session['company_id']
        company = Company.query.get(id) # noqa: F405
        # public
        public_data_not_null = Company.is_public_not_null(id) # noqa: F405
        if not public_data_not_null:
            flash('You have to compelete all missing data')
            return redirect('/company_editprofile/public')
                #contact_data

        contact_data_not_null = Company.is_contact_data_not_null(id) # noqa: F405
        if not contact_data_not_null:
            flash('You have to compelete all missing data')
            return redirect('/company_editprofile/contact_data')
        #commercial_data
        data_not_null = Company.is_commercial_data_not_null(id) # noqa: F405
        if not data_not_null:
            return redirect('/company_editprofile/commercial_data')
        return render_template("/panel/company_panel/company_panel.html" , company = company, is_company = True )
    else:
        return redirect('/login')























@app.route('/edit-profile/personal_data')
def edit_profile2():
    if "user_id" in session :
        email = session['email_session']
        id = session['user_id']
        customer = Customers.query.get(id)
        ### get customer data ################################################

        name = Customers.get_customer_name_by_user_id(id=id)

        about = Customers.get_customer_about_by_user_id(id=id)

        mobile = Customers.get_customer_mobile_by_user_id(id=id)

        sex = Customers.get_customer_sex_by_user_id(id=id)

        country = Customers.get_customer_country_by_user_id(id=id)

        government = Customers.get_customer_government_by_user_id(id=id)

        user = Customers.query.get(id)
        customer_id = session['session_customer']
        application_count = Customers.get_number_of_job_applications_by_customer_id(customer_id)
        return render_template("panel/customer_account_personal.html" ,customer = customer,about=about,application_count = application_count,country=country,government=government, email = email , name = name,mobile = mobile,sex=sex,user=user)

    else:
        return "you dont have access"


@app.route('/edit-profile/job_data')
def job_data():
    if "email_session" in session :
        email = session['email_session']
        id = session['user_id']
        customer = Customers.query.get(id)
        ### get customer data ################################################
        name = Customers.get_customer_name_by_user_id(id=id)
        about = Customers.get_customer_about_by_user_id(id=id)
        mobile = Customers.get_customer_mobile_by_user_id(id=id)
        sex = Customers.get_customer_sex_by_user_id(id=id)
        education_statue = Customers.get_customer_education_status_by_user_id(id=id)
        educational_qualification = Customers.get_customer_educational_qualification_by_user_id(id=id)
        university = Customers.get_customer_university_by_user_id(id=id)
        department_university = Customers.get_customer_department_university_by_user_id(id=id)
        graduation_date = Customers.get_customer_graduation_date_by_user_id(id=id)
        gpa = Customers.get_customer_gpa_by_user_id(id=id)
        years_of_skills = Customers.get_customer_years_of_skills_by_user_id(id=id)
        preferred_field_of_work = Customers.get_customer_preferred_field_of_work_by_user_id(id=id)
        work_type = Customers.get_customer_work_type_by_user_id(id=id)
        country = Customers.get_customer_country_by_user_id(id=id)
        government = Customers.get_customer_government_by_user_id(id=id)
        user = Customers.query.get(id)
        customer_id = session['session_customer']
        application_count = Customers.get_number_of_job_applications_by_customer_id(customer_id)

    else:
        application_count,email,mobile , sex,about , education_statue,educational_qualification,university,department_university,graduation_date,gpa,years_of_skills,preferred_field_of_work,work_type = "Moustafa"

    return render_template("panel/customer_account_job_data.html" ,customer = customer,about=about,application_count = application_count,country=country,government=government, email = email , name = name,mobile = mobile,sex=sex,education_statue = education_statue,educational_qualification = educational_qualification,university = university, department_university = department_university, graduation_date = graduation_date,gpa=gpa,years_of_skills = years_of_skills,preferred_field_of_work = preferred_field_of_work,work_type =work_type,user=user)


@app.route('/edit-profile/educational_data')
def edit_proficustomer_account_educational_datale2():
    if "email_session" in session :
        id = session['user_id']
        customer = Customers.query.get(id)
        ### get customer data ################################################
        education_statue = Customers.get_customer_education_status_by_user_id(id=id)
        educational_qualification = Customers.get_customer_educational_qualification_by_user_id(id=id)
        university = Customers.get_customer_university_by_user_id(id=id)
        department_university = Customers.get_customer_department_university_by_user_id(id=id)
        graduation_date = Customers.get_customer_graduation_date_by_user_id(id=id)
        gpa = Customers.get_customer_gpa_by_user_id(id=id)

        user = Customers.query.get(id)
        customer_id = session['session_customer']
        application_count = Customers.get_number_of_job_applications_by_customer_id(customer_id)

    else:
        application_count, education_statue,educational_qualification,university,department_university,graduation_date,gpa = "Moustafa"

    return render_template("panel/customer_account_educational_data.html",customer = customer ,application_count = application_count,education_statue = education_statue,educational_qualification = educational_qualification,university = university, department_university = department_university, graduation_date = graduation_date,gpa=gpa,user=user)


@app.route('/edit-profile')
def edit_profile():
    if "email_session" in session :
        email = session['email_session']
        id = session['user_id']
        ### get customer data ################################################
        name = Customers.get_customer_name_by_user_id(id=id)
        about = Customers.get_customer_about_by_user_id(id=id)
        mobile = Customers.get_customer_mobile_by_user_id(id=id)
        sex = Customers.get_customer_sex_by_user_id(id=id)
        education_statue = Customers.get_customer_education_status_by_user_id(id=id)
        educational_qualification = Customers.get_customer_educational_qualification_by_user_id(id=id)
        university = Customers.get_customer_university_by_user_id(id=id)
        department_university = Customers.get_customer_department_university_by_user_id(id=id)
        graduation_date = Customers.get_customer_graduation_date_by_user_id(id=id)
        gpa = Customers.get_customer_gpa_by_user_id(id=id)
        years_of_skills = Customers.get_customer_years_of_skills_by_user_id(id=id)
        preferred_field_of_work = Customers.get_customer_preferred_field_of_work_by_user_id(id=id)
        work_type = Customers.get_customer_work_type_by_user_id(id=id)
        country = Customers.get_customer_country_by_user_id(id=id)
        government = Customers.get_customer_government_by_user_id(id=id)
        user = Customers.query.get(id)
        customer_id = session['session_customer']
        application_count = Customers.get_number_of_job_applications_by_customer_id(customer_id)

    else:
        application_count,email,mobile , sex,about , education_statue,educational_qualification,university,department_university,graduation_date,gpa,years_of_skills,preferred_field_of_work,work_type = "Moustafa"

    return render_template("edit-profile.html" ,about=about,application_count = application_count,country=country,government=government, email = email , name = name,mobile = mobile,sex=sex,education_statue = education_statue,educational_qualification = educational_qualification,university = university, department_university = department_university, graduation_date = graduation_date,gpa=gpa,years_of_skills = years_of_skills,preferred_field_of_work = preferred_field_of_work,work_type =work_type,user=user)





'''
@app.errorhandler(404)
def page_not_found(e):
    # You can use a dedicated template for error pages if you like
    return render_template('under_pro.html'), 404

'''
      ##############testroutes#########


@app.route('/my_profile')
def my_profile_get():
    if "session_customer" in session:
        id = session['user_id']
        user_id = Customers.get_user_id_by_id(id=id)
        customer  = Customers.query.get(id)
        return render_template('panel/profile.html' , customer = customer , user_id = user_id)
    if "session_company" in session:
        id = session['company_id']
        company  = Company.query.get(id)

        return render_template('panel/company_panel/profile.html' , company = company , user_id = id)
    else:
        return redirect('/login')







@app.route('/visit_customer_profile/<user_id>')
def visit_customer_profile(user_id):
    #لو الزيارة من حساب فرد
    if 'user_id' in session :
        current_user_id = session['user_id']
        current_user = Customers.query.get(current_user_id)

    elif "company_id" in session :
        current_user_id = session['company_id']
        current_user = Company.query.get(current_user_id) 
    customer = Customers.query.filter_by(user_id=user_id).first()
    if customer:
        return render_template('panel/visit_profile.html', customer=customer ,current_user = current_user)
    else:
        return "no customer"


@app.route('/my_team')
def my_team():
    id = session['user_id']
    customer = Customers.query.get(id)
    my_id = Customers.get_user_id_by_id(id=id)
    # Query the team_ids that the user has joined
    team_ids = db.session.query(team_members_association.c.team_id)\
                         .filter(team_members_association.c.member_id == my_id)\
                         .all()

    # Extract the team names using the team_ids
    my_teams = Teams.query.filter(Teams.id.in_([team_id[0] for team_id in team_ids])).all()
    return render_template('/panel/team.html', my_teams=my_teams , customer = customer)


@app.route('/controlled_teams')
def teams_controlled():
    admin_id = session['user_id']
    customer = Customers.query.get(admin_id)
    my_teams = Teams.query.filter_by(admin_id=admin_id).all()
    return render_template('/panel/controlled_teams.html', teams=my_teams , customer = customer)

@app.route('/team_members/<int:team_id>')
def team_members(team_id):
    # Retrieve the team details based on the provided team_id
    team = Teams.query.get(team_id)

    # Debugging: Print the team details to check if the team is retrieved successfully
    print("Team:", team)

    # Retrieve team members along with their statuses
    team_members = db.session.query(Customers.user_id, Customers.fullname, team_members_association.c.status)\
                               .join(team_members_association, team_members_association.c.member_id == Customers.user_id)\
                               .filter(team_members_association.c.team_id == team_id).all()

    # Debugging: Print team members and their statuses
    print("Team Members:", team_members)

    # Render the template with the team details and team members
    return render_template('team_members.html', team=team, team_members=team_members)





def get_teams_for_user(user_id):
    # Query to retrieve teams joined by the user with status "مدعو"
    teams = db.session.query(Teams).join(
        team_members_association,
        Teams.id == team_members_association.c.team_id
    ).filter(
        team_members_association.c.member_id == user_id,
        team_members_association.c.status == "مدعو"
    ).all()

    return teams



@app.route('/teams_invites', methods=['GET', 'POST'])
def invites():
    user_id = session['user_id']



    personal_data = Customers.is_personal_not_null(id=user_id)
    educational_data = Customers.is_educational_datanot_null(id=user_id)
    job_data = Customers.is_job_data_not_null(id = user_id)
    if not personal_data:
        flash(' عذرا يجب ملئ جميع البيانات')
        return redirect('/edit-profile/personal_data')
    if not job_data :
        flash('عذرا يجب ملئ جميع البيانات')
        return redirect('/edit-profile/job_data')

    if not educational_data :
        flash('عذرا يجب ملئ جميع البيانات')
        return redirect('/edit-profile/educational_data')
    customer = Customers.query.get(user_id)
    # Retrieve the user's new ID from the Customers service
    user_new_id = Customers.get_user_id_by_id(user_id)

    # Get teams and status for the user
    teams = get_teams_for_user(user_new_id)

    if request.method == 'POST':
        team_id = request.form['team_id']
        action = request.form['action']

        if action == 'accept':
            # Update status to 'منضم'
            db.session.execute(
                team_members_association.update()
                .where(team_members_association.c.team_id == team_id)
                .where(team_members_association.c.member_id == user_new_id)
                .values(status='منضم')
            )
            db.session.commit()
        elif action == 'decline':
            # Delete the entry from team_members table
            db.session.execute(
                team_members_association.delete()
                .where(team_members_association.c.team_id == team_id)
                .where(team_members_association.c.member_id == user_new_id)
            )
            db.session.commit()

        return redirect(url_for('invites', user_id=user_id))

    return render_template('/panel/invites.html', teams=teams, user_id=user_id , customer = customer)















activation_code = random.randint(10000, 99999)
@app.route('/sendcode')
def post_active_code():
 if "user_id" in session:
    name = "Faeda website"
    ##
    email_sender = 'coursesforyo@gmail.com'
    email_password = 'hthaynywgefenetz'
    emaill =  session['email_session']
    email_receiver =emaill
    subject =  "No subject"
    body = f'Subject: Activation Code\n\nYour activation code is {activation_code}.'
    em = EmailMessage()
    em['From'] = email_sender
    em['To'] = email_receiver
    em['Subject'] = subject
    em.set_content(" From "+ name +"\n"+" Message is  :"+"\n" + body+"\t \n")
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL('smtp.gmail.com',465,context=context) as smtp :
        smtp.login(email_sender , email_password)
        smtp.sendmail(email_sender , email_receiver , em.as_string())
    return render_template('/login/colorlib-regform-17/images/tes/activate.html')



 elif "company_id" in session:
    name = "Faeda website"
    ##
    email_sender = 'coursesforyo@gmail.com'
    email_password = 'hthaynywgefenetz'
    emaill =  session['company_email_session']
    email_receiver =emaill
    subject =  "No subject"
    body = f'Subject: Activation Code\n\nYour activation code is {activation_code}.'
    em = EmailMessage()
    em['From'] = email_sender
    em['To'] = email_receiver
    em['Subject'] = subject
    em.set_content(" From "+ name +"\n"+" Message is  :"+"\n" + body+"\t \n")
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL('smtp.gmail.com',465,context=context) as smtp :
        smtp.login(email_sender , email_password)
        smtp.sendmail(email_sender , email_receiver , em.as_string())
    return render_template('/login/colorlib-regform-17/images/tes/activate.html')

 else:
    return redirect('/login' )


@app.route('/activate', methods=['POST'])
def verify():
 if "user_id" in session:

    # get the activation code from the form data
    entered_code = request.form['activation_code']
    email = session['email_session']
    # check if the entered code matches the generated code
    if entered_code == str(activation_code):
        Customers.active(email=email)
        session['customer_activated'] = True
        flash('Your Account Activated')
        return redirect('/')
    else:
        flash('Wrong Code')
        return redirect('/activate')

 if "company_id" in session:

    # get the activation code from the form data
    entered_code = request.form['activation_code']
    email = session['company_email_session']
    # check if the entered code matches the generated code
    if entered_code == str(activation_code):
        Company.activate(email=email)
        session['company_activated'] = True
        flash('Your Account Activated')
        return redirect('/')
    else:
        flash('Wrong Code')
        return redirect('/activate')
 else:
        return redirect('/login' )
 









@app.route('/api/countries')
def get_countries():
    with open('data/countries.json', 'r', encoding='utf-8') as f:
        countries = json.load(f)
    return jsonify(countries)

@app.route('/api/cities/<country_code>')
def get_cities(country_code):
    with open('data/cities.json', 'r', encoding='utf-8') as f:
        cities = json.load(f)
    return jsonify(cities.get(country_code, []))










#########################################################to run the website####################################################################
if __name__ == "__main__":
    app.run(debug=True, port=PORT, host='0.0.0.0')