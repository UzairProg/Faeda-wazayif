"""
FAEDA JOBS — ADVANCED CSRF PROTECTION ENGINE
================================================
Implements OWASP-compliant Cross-Site Request Forgery (CSRF) protection.
Features:
- Subclasses Flask-WTF CSRFProtect with smart exemptions.
- Automatically exempts stateless API requests authenticated via Authorization: Bearer <token>.
- Protects all stateful session-based POST, PUT, DELETE, and PATCH requests.
- Accepts tokens via Form data (csrf_token), Headers (X-CSRFToken, X-CSRF-Token, X-CSRF-TOKEN, X-XSRF-TOKEN), or JSON body (csrf_token).
- Exposes generate_csrf and csrf_token Jinja globals for forms.
- Provides unified JSON error responses for API/AJAX requests and friendly error pages for browser forms.
"""

from flask import request, jsonify, current_app
from flask_wtf.csrf import CSRFProtect, CSRFError, generate_csrf, validate_csrf
import logging

logger = logging.getLogger(__name__)

csrf = None


class SmartCSRFProtect(CSRFProtect):
    def _is_exempt(self):
        # 1. Base Flask-WTF view/blueprint exemptions
        if super()._is_exempt():
            return True

        # 2. Authorization: Bearer <token> requests are stateless API calls immune to CSRF
        auth_header = request.headers.get('Authorization', '')
        if auth_header.strip().startswith('Bearer '):
            return True

        # 3. Stateless JSON API requests: Cross-origin JSON payloads require CORS preflight and cannot be forged via HTML forms
        if request.is_json and (request.path.startswith('/api/') or request.path in ['/login', '/register', '/api/v1/auth/login']):
            return True

        return False

    def _get_csrf_token(self):
        # 1. Standard form field & header checks from Flask-WTF
        token = super()._get_csrf_token()
        if token:
            return token

        # 2. Check JSON payload if request is application/json
        if request.is_json:
            try:
                data = request.get_json(silent=True)
                if isinstance(data, dict):
                    field_name = current_app.config.get("WTF_CSRF_FIELD_NAME", "csrf_token")
                    json_token = data.get(field_name)
                    if json_token:
                        return json_token
            except Exception:
                pass

        return None


def init_csrf(app):
    global csrf
    app.config.setdefault("WTF_CSRF_ENABLED", True)
    app.config.setdefault("WTF_CSRF_TIME_LIMIT", 86400)
    app.config.setdefault("WTF_CSRF_HEADERS", [
        "X-CSRFToken", "X-CSRF-Token", "X-CSRF-TOKEN", "X-XSRF-TOKEN"
    ])
    app.config.setdefault("WTF_CSRF_FIELD_NAME", "csrf_token")

    csrf = SmartCSRFProtect(app)

    @app.errorhandler(CSRFError)
    def handle_csrf_error(e):
        reason = getattr(e, 'description', str(e))
        logger.warning(f"[CSRF] Verification failed for {request.method} {request.path}: {reason}")

        # If API or AJAX or expecting JSON
        if request.is_json or request.path.startswith('/api/') or request.headers.get('Accept') == 'application/json':
            return jsonify({
                "error": "CSRF verification failed",
                "message": reason,
                "success": False
            }), 400

        # HTML browser form error
        return (
            f"<html><head><title>CSRF Verification Error</title></head>"
            f"<body style='font-family:sans-serif;text-align:center;padding:50px;'>"
            f"<h2 style='color:#dc3545;'>انتهت صلاحية الجلسة أو تعذر التحقق من أمان الطلب</h2>"
            f"<p style='color:#6c757d;'>CSRF Verification Error: {reason}</p>"
            f"<p><a href='/' style='color:#0d6efd;'>العودة إلى الصفحة الرئيسية</a></p>"
            f"</body></html>",
            400
        )

    return csrf
