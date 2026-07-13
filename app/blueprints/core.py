# ==============================================================================
# الوظيفة الأساسية للملف: وحدة (Blueprint) للمسارات الأساسية والعامة في الموقع.
# الروابط أو الميزات: مسار الصفحة الرئيسية (/) ومسارات الصفحات العامة الأخرى.
# المتطلبات الخاصة: يعتمد على دوال render_template لعرض قوالب HTML.
# ==============================================================================
import os
import json
from flask import Blueprint, render_template, jsonify, current_app, request, flash, redirect, url_for, session
from app import db
from services.ticket import Ticket

# Create a Blueprint named 'core'
core_bp = Blueprint('core', __name__)

@core_bp.route('/')
def home():
    return render_template('new_design/index.html')


@core_bp.route('/support')
def support():
    return render_template('new_design/support.html')

@core_bp.route('/support/ticket', methods=['GET', 'POST'])
def support_ticket():
    if request.method == 'POST':
        email = request.form.get('email')
        subject = request.form.get('subject')
        description = request.form.get('description')
        
        if not all([email, subject, description]):
            flash('يرجى ملء جميع الحقول المطلوبة', 'error')
            return redirect(url_for('core.support_ticket'))
            
        new_ticket = Ticket(email=email, subject=subject, description=description)
        db.session.add(new_ticket)
        db.session.commit()
        
        flash('تم إرسال تذكرتك بنجاح، سيقوم الدعم الفني بالتواصل معك قريباً ويمكنك متابعتها باستخدام بريدك الإلكتروني.', 'success')
        # Clear suspension session data if exists
        session.pop('suspended_email', None)
        session.pop('suspension_reason', None)
        return redirect(url_for('core.home'))
        
    return render_template('new_design/ticket_form.html')

@core_bp.route('/support/track', methods=['GET', 'POST'])
def track_ticket():
    tickets = None
    if request.method == 'POST':
        email = request.form.get('email')
        
        if email:
            tickets = Ticket.query.filter_by(email=email).order_by(Ticket.created_at.desc()).all()
            if not tickets:
                flash('لم يتم العثور على أي تذاكر مرتبطة بهذا البريد الإلكتروني.', 'error')
        else:
            flash('يرجى إدخال البريد الإلكتروني.', 'error')
            
    return render_template('new_design/track_ticket.html', tickets=tickets)

@core_bp.route('/report', methods=['POST'])
def submit_report():
    from services.report import Report
    target_type = request.form.get('target_type')
    target_id = request.form.get('target_id')
    reason = request.form.get('reason')
    description = request.form.get('description')
    
    reporter_type = None
    reporter_id = None
    
    if session.get('session_customer'):
        reporter_type = 'customer'
        reporter_id = session.get('user_id')
    elif session.get('session_company'):
        reporter_type = 'company'
        reporter_id = session.get('company_id')
        
    if not reporter_type:
        flash('يجب تسجيل الدخول لتقديم بلاغ.', 'error')
        return redirect(request.referrer or url_for('core.home'))
        
    new_report = Report(
        reporter_type=reporter_type,
        reporter_id=reporter_id,
        target_type=target_type,
        target_id=target_id,
        reason=reason,
        description=description
    )
    db.session.add(new_report)
    db.session.commit()
    
    flash('تم إرسال البلاغ بنجاح وهو بانتظار المراجعة.', 'success')
    return redirect(request.referrer or url_for('core.home'))

@core_bp.route('/suspended')
def suspended_account():
    email = session.get('suspended_email')
    reason = session.get('suspension_reason')
    
    if not email:
        return redirect(url_for('customer.login'))
        
    return render_template('new_design/suspended.html', email=email, reason=reason)


@core_bp.route('/faeda-details')
def faeda_details():
    return render_template('new_design/faeda_details.html')

@core_bp.route('/api/countries')
def api_countries():
    file_path = os.path.join(current_app.root_path, '..', 'data', 'countries.json')
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            countries = json.load(f)
        return jsonify(countries)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@core_bp.route('/api/cities/<country>')
def api_cities(country):
    file_path = os.path.join(current_app.root_path, '..', 'data', 'cities.json')
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            cities_data = json.load(f)
        cities = cities_data.get(country, [])
        return jsonify(cities)
    except Exception as e:
        return jsonify({"error": str(e)}), 500