"""
FAEDA JOBS — ADVANCED API RATE LIMITING & DOS/BRUTE-FORCE PROTECTION ENGINE
===========================================================================
Implements enterprise-grade rate limiting compliant with OWASP API Security (API4).
Protects:
1. Authentication & Login: Against brute-force password guessing & credential stuffing.
2. Registration & Onboarding: Against automated registration bots & spam account creation.
3. Password Reset & Recovery: Against account enumeration & SMS/Email flooding.
4. Public & Heavy Search APIs: Against DoS attacks, scrapers, and resource exhaustion.
5. Global Default Guard: Broad threshold guarding all general endpoints against DoS.

Key Features:
- Reverse-proxy awareness (Cloudflare CF-Connecting-IP, X-Real-IP, X-Forwarded-For).
- Standardized RFC 6585 HTTP 429 Too Many Requests response with Retry-After header.
- Bilingual error payloads (Arabic & English) for SPA/mobile/JSON consumers.
- Graceful HTML error handling for standard browser form submissions.
- Flexible backend storage (in-memory default, Redis in production).
- Configurable per-environment via environment variables.
"""

import os
import logging
from typing import Optional, Dict, Any
from flask import request, jsonify, render_template, current_app
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_limiter.errors import RateLimitExceeded

logger = logging.getLogger("faeda.rate_limiter")


def get_client_ip() -> str:
    """
    Extract the real client IP address behind reverse proxies and CDNs.
    Priority order:
    1. CF-Connecting-IP (Cloudflare)
    2. X-Real-IP (Nginx / HAProxy / Envoy)
    3. X-Forwarded-For (First untrusted client IP in chain)
    4. request.remote_addr (Direct WSGI connection)
    """
    try:
        # 1. Cloudflare CDN connecting IP
        cf_ip = request.headers.get("CF-Connecting-IP")
        if cf_ip and cf_ip.strip():
            return cf_ip.strip().split(",")[0].strip()

        # 2. Standard X-Real-IP
        real_ip = request.headers.get("X-Real-IP")
        if real_ip and real_ip.strip():
            return real_ip.strip().split(",")[0].strip()

        # 3. Standard X-Forwarded-For (leftmost client IP)
        xff = request.headers.get("X-Forwarded-For")
        if xff and xff.strip():
            client_ip = xff.split(",")[0].strip()
            if client_ip:
                return client_ip

        # 4. Direct socket address
        return request.remote_addr or "127.0.0.1"
    except Exception:
        return "127.0.0.1"


# Configurable Rate Limits (overrideable via environment variables)
LIMIT_AUTH = os.environ.get("RATELIMIT_AUTH", "5 per minute, 30 per hour")
LIMIT_REGISTER = os.environ.get("RATELIMIT_REGISTER", "3 per minute, 15 per hour")
LIMIT_PASSWORD_RESET = os.environ.get("RATELIMIT_PASSWORD_RESET", "3 per minute, 10 per hour")
LIMIT_AUTH_STATE = os.environ.get("RATELIMIT_AUTH_STATE", "60 per minute")
LIMIT_PUBLIC_API = os.environ.get("RATELIMIT_PUBLIC_API", "60 per minute, 600 per hour")
LIMIT_COMPUTE_HEAVY = os.environ.get("RATELIMIT_COMPUTE_HEAVY", "10 per minute, 60 per hour")
LIMIT_DEFAULT = [
    os.environ.get("RATELIMIT_DEFAULT_MIN", "200 per minute"),
    os.environ.get("RATELIMIT_DEFAULT_HR", "2000 per hour"),
]

# Instantiate Limiter singleton with default limits and headers enabled
limiter = Limiter(
    key_func=get_client_ip,
    default_limits=LIMIT_DEFAULT,
    headers_enabled=True,
    strategy="moving-window",
    storage_uri=os.environ.get("RATELIMIT_STORAGE_URI", "memory://"),
)


# Reusable decorators for clean endpoint annotations
def auth_rate_limit(f=None):
    """Rate limit specifically tuned for authentication/login attempts."""
    dec = limiter.limit(LIMIT_AUTH, error_message="Too many login attempts")
    return dec(f) if f else dec


def register_rate_limit(f=None):
    """Rate limit specifically tuned for registration/signup attempts."""
    dec = limiter.limit(LIMIT_REGISTER, error_message="Too many registration attempts")
    return dec(f) if f else dec


def password_reset_rate_limit(f=None):
    """Rate limit specifically tuned for password reset / recovery."""
    dec = limiter.limit(LIMIT_PASSWORD_RESET, error_message="Too many password reset requests")
    return dec(f) if f else dec


def public_api_rate_limit(f=None):
    """Rate limit for public search / jobs / insights APIs to prevent scraping & DoS."""
    dec = limiter.limit(LIMIT_PUBLIC_API, error_message="Public API rate limit reached")
    return dec(f) if f else dec


def compute_heavy_rate_limit(f=None):
    """Rate limit for resource-intensive operations (AI optimization, data sync)."""
    dec = limiter.limit(LIMIT_COMPUTE_HEAVY, error_message="Resource intensive operation rate limit reached")
    return dec(f) if f else dec


def init_rate_limiter(app):
    """
    Initialize and bind rate limiting to the Flask application.
    Configures error handlers, exemptions, and logging.
    """
    # Exemption filter for static assets and health checks
    @limiter.request_filter
    def exempt_static_and_health():
        path = request.path
        if path.startswith("/static/"):
            return True
        if path in ("/health", "/healthz", "/ping", "/favicon.ico"):
            return True
        return False

    # Initialize Flask-Limiter with app
    limiter.init_app(app)

    # Register centralized 429 Too Many Requests error handler
    @app.errorhandler(RateLimitExceeded)
    def handle_rate_limit_exceeded(e: RateLimitExceeded):
        client_ip = get_client_ip()
        logger.warning(
            f"[RateLimiter] 429 Exceeded: IP={client_ip} Path={request.path} "
            f"Method={request.method} Limit={e.description}"
        )

        wants_json = (
            request.is_json
            or request.path.startswith("/api/")
            or request.headers.get("Accept") == "application/json"
            or "application/json" in request.headers.get("Accept", "").lower()
            or request.headers.get("X-Requested-With") == "XMLHttpRequest"
        )

        retry_after = getattr(e, "retry_after", 60) or 60

        if wants_json:
            response = jsonify({
                "success": False,
                "error": "Too Many Requests",
                "status_code": 429,
                "message": "تم تجاوز الحد المسموح به من الطلبات للحماية من الهجمات. يرجى الانتظار والمحاولة لاحقاً.",
                "message_en": "Rate limit exceeded. Please wait before retrying.",
                "retry_after_seconds": retry_after,
                "limit": str(e.description)
            })
            response.status_code = 429
            return response

        # Standard browser HTML form submission error
        return (
            f"<!doctype html>"
            f"<html lang='ar' dir='rtl'>"
            f"<head>"
            f"<meta charset='utf-8'>"
            f"<title>429 — تجاوز الحد المسموح به</title>"
            f"<style>"
            f"body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }}"
            f".card {{ background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 36px; max-width: 480px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }}"
            f"h1 {{ color: #f43f5e; margin-bottom: 12px; font-size: 24px; }}"
            f"p {{ color: #94a3b8; font-size: 15px; line-height: 1.6; margin-bottom: 24px; }}"
            f"a {{ display: inline-block; background: #2563eb; color: #fff; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; }}"
            f"a:hover {{ background: #1d4ed8; }}"
            f"</style>"
            f"</head>"
            f"<body>"
            f"<div class='card'>"
            f"<h1>تم تجاوز الحد المسموح به من الطلبات</h1>"
            f"<p>لحماية حسابك ومنصة فائدة وظائف من الهجمات الآلية، تم تقييد المحاولات مؤقتاً.<br>يرجى الانتظار قليلاً ({retry_after} ثانية) ثم إعادة المحاولة.</p>"
            f"<a href='/login'>العودة لصفحة الدخول</a>"
            f"</div>"
            f"</body>"
            f"</html>",
            429
        )

    logger.info(
        f"[+] API Rate Limiting initialized: Strategy={app.config.get('RATELIMIT_STRATEGY', 'moving-window')}, "
        f"Storage={app.config.get('RATELIMIT_STORAGE_URI', 'memory://')}, HeadersEnabled=True"
    )
    return limiter


def get_rate_limiter_status() -> Dict[str, Any]:
    """Inspect active rate limiting rules and policies for security audit / diagnostics."""
    return {
        "enabled": current_app.config.get("RATELIMIT_ENABLED", True) if current_app else True,
        "strategy": "moving-window",
        "storage": current_app.config.get("RATELIMIT_STORAGE_URI", "memory://") if current_app else "memory://",
        "headers_enabled": True,
        "policies": {
            "auth_login": LIMIT_AUTH,
            "registration": LIMIT_REGISTER,
            "password_reset": LIMIT_PASSWORD_RESET,
            "auth_state": LIMIT_AUTH_STATE,
            "public_apis": LIMIT_PUBLIC_API,
            "compute_heavy": LIMIT_COMPUTE_HEAVY,
            "global_default": LIMIT_DEFAULT,
        }
    }
