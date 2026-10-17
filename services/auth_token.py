# ==============================================================================
# services/auth_token.py
# ==============================================================================
# Cryptographically signed, stateless Bearer token utility for Faeda Jobs API.
# Enables robust cross-origin authentication immune to browser cookie restrictions.
# ==============================================================================

import os
from flask import current_app, session, request
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature

TOKEN_MAX_AGE = 86400 * 30  # 30 days validity in seconds


def get_serializer():
    """
    Retrieve serializer initialized with application SECRET_KEY.
    Hardcoded secret fallbacks have been removed; production strictly requires
    an explicit, secure SECRET_KEY environment variable.
    """
    secret = None
    try:
        if current_app:
            secret = current_app.config.get('SECRET_KEY')
    except Exception:
        pass

    if not secret:
        secret = os.environ.get('SECRET_KEY')

    # Guard against insecure/default secrets in production environments
    is_prod = False
    try:
        if current_app and not current_app.config.get('DEBUG', False) and not current_app.config.get('TESTING', False):
            is_prod = True
    except Exception:
        pass
    if os.environ.get('FLASK_ENV') == 'production' or os.environ.get('ENV') == 'production':
        is_prod = True

    insecure_keys = {'default-secret-key-for-dev', 'faeda-jobs-secret-key-2026', 'your_secret_key_here', ''}
    if is_prod and (not secret or secret in insecure_keys):
        raise RuntimeError(
            "CRITICAL SECURITY CONFIGURATION ERROR: Production deployment requires an explicit, "
            "cryptographically secure SECRET_KEY set in the environment variables."
        )

    if not secret:
        secret = 'default-secret-key-for-dev'

    return URLSafeTimedSerializer(secret)


def generate_auth_token(payload: dict) -> str:
    """Generate a tamper-proof signed Bearer token."""
    s = get_serializer()
    return s.dumps(payload)


def decode_auth_token(token: str) -> dict | None:
    """Decode and cryptographically verify an auth token."""
    if not token or token in ('cookie-session-active', 'null', 'undefined'):
        return None

    # Demo bypass tokens are strictly forbidden in production
    if token.startswith('demo-') or token == 'demo-token':
        is_prod = False
        try:
            if current_app and not current_app.config.get('DEBUG', False) and not current_app.config.get('TESTING', False):
                is_prod = True
        except Exception:
            pass
        if os.environ.get('FLASK_ENV') == 'production':
            is_prod = True
        if is_prod:
            return None

        role = token.replace('demo-', '').replace('-token', '').strip()
        if not role or role == 'demo':
            try:
                role = request.headers.get('X-Persona-Role', 'candidate')
            except Exception:
                role = 'candidate'
        return {'role': role, 'user_id': 1}

    s = get_serializer()
    try:
        data = s.loads(token, max_age=TOKEN_MAX_AGE)
        return data
    except (SignatureExpired, BadSignature, Exception):
        return None


def process_request_auth():
    """
    Middleware hook invoked on every incoming request.
    If an Authorization: Bearer <token> header is supplied, validates it and
    automatically populates the active Flask session for the request lifecycle.
    """
    auth_header = request.headers.get('Authorization', '')
    token = None
    if auth_header.startswith('Bearer '):
        token = auth_header[7:].strip()
    elif auth_header and not auth_header.startswith('Basic '):
        token = auth_header.strip()

    payload = None
    if token and token not in ('cookie-session-active', 'null', 'undefined'):
        payload = decode_auth_token(token)

    if not payload or not isinstance(payload, dict):
        return

    role = payload.get('role')
    user_id = payload.get('user_id') or payload.get('id')
    email = payload.get('email')

    if role == 'candidate' and user_id:
        session['session_customer'] = True
        session['user_id'] = user_id
        if email:
            session['email_session'] = email
    elif role == 'company' and user_id:
        session['session_company'] = True
        session['company_id'] = user_id
        if email:
            session['company_email_session'] = email
    elif role == 'university' and user_id:
        session['session_university'] = True
        session['university_id'] = user_id
        if email:
            session['university_email'] = email
    elif role == 'admin' and user_id:
        session['admin_id'] = user_id
        session['admin_role'] = payload.get('admin_role', 'admin')
