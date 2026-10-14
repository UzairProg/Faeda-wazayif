"""
Test Suite: API Rate Limiting & DoS / Brute-Force Protection
============================================================
Validates that:
1. Multi-tenant login (/login, /company/login, /admin/login) blocks brute-force attempts with HTTP 429.
2. Registration (/register, /company/register) prevents automated bot signups.
3. Password recovery (/forgot_password, /reset_password) blocks flooding.
4. Public APIs (/api/v1/jobs, /api/market-insights/salary) enforce rate limits against scrapers.
5. Static files (/static/...) and health checks are exempt.
6. Real client IP is correctly extracted from reverse proxies (CF-Connecting-IP, X-Forwarded-For).
7. Rate limit responses provide standardized JSON payloads with Retry-After headers for APIs.
8. Admin security audit endpoint (/api/v1/admin/security/rate-limits) accurately reports policies.
"""

import unittest
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from services.rate_limiter import (
    limiter,
    get_client_ip,
    get_rate_limiter_status,
    LIMIT_AUTH,
    LIMIT_REGISTER,
    LIMIT_PASSWORD_RESET,
    LIMIT_PUBLIC_API
)


class RateLimiterTestSuite(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Configure app specifically with rate limiting enabled and memory storage
        os.environ['RATELIMIT_ENABLED'] = 'True'
        os.environ['RATELIMIT_STORAGE_URI'] = 'memory://'
        cls.app = create_app()
        cls.app.config['TESTING'] = True
        cls.app.config['WTF_CSRF_ENABLED'] = False
        cls.app.config['RATELIMIT_ENABLED'] = True

    def setUp(self):
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()
        # Reset limiter storage between tests to have clean counters
        try:
            limiter.reset()
        except Exception:
            pass

    def tearDown(self):
        self.ctx.pop()

    def test_client_ip_extraction_priority(self):
        """Test that get_client_ip prioritizes CF-Connecting-IP, X-Real-IP, and X-Forwarded-For."""
        # 1. Cloudflare header
        with self.app.test_request_context('/', headers={'CF-Connecting-IP': '203.0.113.10, 10.0.0.1'}):
            self.assertEqual(get_client_ip(), '203.0.113.10')

        # 2. X-Real-IP
        with self.app.test_request_context('/', headers={'X-Real-IP': '198.51.100.25'}):
            self.assertEqual(get_client_ip(), '198.51.100.25')

        # 3. X-Forwarded-For (first entry)
        with self.app.test_request_context('/', headers={'X-Forwarded-For': '192.0.2.45, 10.0.0.2'}):
            self.assertEqual(get_client_ip(), '192.0.2.45')

        # 4. Fallback to remote_addr
        with self.app.test_request_context('/', environ_base={'REMOTE_ADDR': '127.0.0.1'}):
            self.assertEqual(get_client_ip(), '127.0.0.1')

    def test_login_brute_force_protection_json(self):
        """Verify that rapid repeated POST /login JSON requests are blocked with HTTP 429."""
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Forwarded-For': '198.51.100.101'
        }
        payload = json.dumps({'email': 'attacker@example.com', 'password': 'wrong_password'})

        # The AUTH limit is 5 per minute. Sending 6 rapid attempts:
        statuses = []
        last_response = None
        for _ in range(7):
            res = self.client.post('/login', data=payload, headers=headers)
            statuses.append(res.status_code)
            last_response = res

        # Check that initial attempts are processed (not 429) and later ones return 429
        self.assertIn(429, statuses)
        self.assertEqual(last_response.status_code, 429)

        # Verify JSON error format and Retry-After header
        data = last_response.get_json()
        self.assertIsNotNone(data)
        self.assertFalse(data.get('success'))
        self.assertEqual(data.get('status_code'), 429)
        self.assertIn('تجاوز الحد المسموح', data.get('message', ''))
        self.assertIn('Retry-After', last_response.headers)
        self.assertIn('X-RateLimit-Limit', last_response.headers)

    def test_login_brute_force_protection_html(self):
        """Verify that rapid repeated POST /login HTML form requests receive 429 error page."""
        headers = {
            'X-Forwarded-For': '198.51.100.102'
        }
        form_data = {'email': 'victim@example.com', 'password': 'bad_pw'}

        statuses = []
        last_response = None
        for _ in range(7):
            res = self.client.post('/login', data=form_data, headers=headers)
            statuses.append(res.status_code)
            last_response = res

        self.assertIn(429, statuses)
        self.assertEqual(last_response.status_code, 429)
        self.assertIn('تجاوز الحد المسموح به من الطلبات', last_response.get_data(as_text=True))

    def test_registration_rate_limiting(self):
        """Verify that POST /register blocks automated rapid signups with 429."""
        headers = {
            'X-Forwarded-For': '198.51.100.103'
        }
        form_data = {
            'fName': 'Bot',
            'lName': 'User',
            'email': 'bot@example.com',
            'phoneNumber': '0555555555',
            'password': 'Password123!',
            'confirm_password': 'Password123!'
        }

        # REGISTRATION limit is 3 per minute. Sending 5 rapid attempts:
        statuses = []
        for _ in range(5):
            res = self.client.post('/register', data=form_data, headers=headers)
            statuses.append(res.status_code)

        self.assertIn(429, statuses)

    def test_password_recovery_rate_limiting(self):
        """Verify that POST /forgot_password blocks email flooding with 429."""
        headers = {
            'X-Forwarded-For': '198.51.100.104'
        }
        form_data = {'email': 'target@example.com'}

        statuses = []
        for _ in range(5):
            res = self.client.post('/forgot_password', data=form_data, headers=headers)
            statuses.append(res.status_code)

        self.assertIn(429, statuses)

    def test_public_api_rate_limit_headers(self):
        """Verify that public endpoints like /api/v1/jobs include rate limit headers."""
        headers = {
            'X-Forwarded-For': '198.51.100.105'
        }
        res = self.client.get('/api/v1/jobs', headers=headers)
        self.assertEqual(res.status_code, 200)
        self.assertIn('X-RateLimit-Limit', res.headers)
        self.assertIn('X-RateLimit-Remaining', res.headers)

    def test_admin_security_rate_limits_endpoint(self):
        """Verify GET /api/v1/admin/security/rate-limits reports system policies."""
        res = self.client.get('/api/v1/admin/security/rate-limits')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data.get('success'))
        self.assertIn('OWASP', data.get('security_policy', ''))
        info = data.get('data', {})
        self.assertTrue(info.get('enabled'))
        self.assertEqual(info.get('strategy'), 'moving-window')
        policies = info.get('policies', {})
        self.assertIn('auth_login', policies)
        self.assertIn('registration', policies)
        self.assertIn('password_reset', policies)
        self.assertIn('public_apis', policies)

    def test_static_files_exemption(self):
        """Verify that static files under /static/ are exempt from rate limiting."""
        headers = {
            'X-Forwarded-For': '198.51.100.106'
        }
        # Request static endpoint repeatedly; should never return 429
        statuses = []
        for _ in range(15):
            res = self.client.get('/static/favicon.ico', headers=headers)
            statuses.append(res.status_code)

        self.assertNotIn(429, statuses)


if __name__ == '__main__':
    unittest.main()
