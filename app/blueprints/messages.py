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
import os

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
    # Asynchronous background email delivery
    try:
        from services.email_service import email_service
        email_service.send_contact_message_email(
            sender_email=sender_email,
            subject=subject or "Inquiry",
            message_text=message_text or ""
        )
    except Exception as e:
        # Never break user form submission if email enqueue encounters an issue
        pass


    message=Message(sender_email=sender_email, subject=subject, message_text=message_text, customer_id=user_id)
    db.session.add(message)
    db.session.commit()
    flash("The message has been sent successfully , THANK YOU we will contact you as soon as possible")
    return redirect('/')