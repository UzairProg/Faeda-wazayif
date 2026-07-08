# ==============================================================================
# الوظيفة الأساسية للملف: وحدة (Blueprint) للمسارات الأساسية والعامة في الموقع.
# الروابط أو الميزات: مسار الصفحة الرئيسية (/) ومسارات الصفحات العامة الأخرى.
# المتطلبات الخاصة: يعتمد على دوال render_template لعرض قوالب HTML.
# ==============================================================================
from flask import Blueprint, render_template

# Create a Blueprint named 'core'
core_bp = Blueprint('core', __name__)

@core_bp.route('/')
def home():
    return render_template('new_design/index.html')


@core_bp.route('/support')
def support():
    # هذا السطر هو الذي يقوم بجلب ملف الـ HTML الصحيح
    return render_template('new_design/support.html')
    
    # This assumes your home page template is index.html or similar. 
    # If the original home page was called something else (like 'new_design/index.html'), 
    # change the name below to match what you have in your templates folder!