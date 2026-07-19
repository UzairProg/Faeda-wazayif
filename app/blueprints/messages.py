# ==============================================================================
# الوظيفة الأساسية للملف: وحدة (Blueprint) لمعالجة إرسال الرسائل والتواصل.
# الروابط أو الميزات: مسارات لإرسال رسائل البريد الإلكتروني أو الرسائل الداخلية.
# المتطلبات الخاصة: يعتمد على مكتبات إرسال البريد (smtplib) ونماذج الرسائل (services.message).
# ==============================================================================
######### customers.py#######
from flask import Blueprint  , render_template , redirect , request ,  flash  , session
from services.customer import *
from services.message import *

from email.message import EmailMessage
import ssl
import smtplib

messages_routes = Blueprint('messages' , __name__)





@messages_routes.route('/send_message', methods=['POST'])
def send_email():
    sender_email = request.form.get('sender_email')
    subject = request.form.get('subject')    
    message_text = request.form.get('message_text')
    if 'user_id' in session:
        user_id = session['user_id']
    else:
        user_id= "Not login"



 
    ##
    import os
    email_sender = os.environ.get('MAIL_SENDER', 'coursesforyo@gmail.com')
    email_password = os.environ.get('MAIL_PASSWORD')
    email_receiver = sender_email
    subject =  request.form.get('subject')
    body =  request.form.get('message')
    em = EmailMessage()
    em['From'] = email_sender
    em['To'] = email_receiver
    em['Subject'] = subject
    em.set_content(" From " + str(sender_email) + "\n" + " Message is  :" + "\n" + str(body) + "\t \n" + "sender email is : \n" + str(sender_email))

    try:
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE
        with smtplib.SMTP_SSL('smtp.gmail.com',465,context=context) as smtp :
            if email_password:
                smtp.login(email_sender , email_password)
                smtp.sendmail(email_sender , email_receiver , em.as_string())
            else:
                print(f"Mock email sent to {email_receiver}. Set MAIL_PASSWORD to send real emails.")
    except Exception as e:
        print(f"Failed to send email: {e}")


    message=Message(sender_email=sender_email, subject=subject, message_text=message_text, customer_id=user_id)
    db.session.add(message)
    db.session.commit()
    flash("The message has been sent successfully , THANK YOU we will contact you as soon as possible")
    return redirect('/')