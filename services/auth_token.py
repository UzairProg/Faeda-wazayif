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
    """Retrieve serializer initialized with application SECRET_KEY."""
    try:
        secret = current_app.config.get('SECRET_KEY') or os.environ.get('SECRET_KEY', 'faeda-jobs-secret-key-2026')
    except Exception:
        secret = os.environ.get('SECRET_KEY', 'faeda-jobs-secret-key-2026')
    return URLSafeTimedSerializer(secret)


def generate_auth_token(payload: dict) -> str:
    """Generate a tamper-proof signed Bearer token."""
    s = get_serializer()
    return s.dumps(payload)


def decode_auth_token(token: str) -> dict | None:
    """Decode and cryptographically verify an auth token."""
    if not token or token in ('cookie-session-active', 'null', 'undefined'):
        return None
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

    if not token or token in ('cookie-session-active', 'null', 'undefined'):
        return

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
