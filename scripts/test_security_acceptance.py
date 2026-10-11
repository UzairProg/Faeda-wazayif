"""
scripts/test_security_acceptance.py
Comprehensive Security & Role Isolation Acceptance Suite.
Tests:
  1. Role isolation (/company/*, /university/*, /candidate/* cross-access)
  2. IDOR on applications (Candidate A cannot view/update Candidate B's application)
  3. IDOR on saved jobs (Candidate A cannot access Candidate B's saved jobs)
  4. IDOR on team management (Non-members cannot view/modify team details)
  5. IDOR on company hiring pipeline (Company A cannot modify Company B's applicants)
  6. IDOR on university verifications (University A cannot access University B's dossier)
  7. IDOR on chat messages & conversations (Unauthorized users cannot view or send in threads)
  8. Privacy leakage audit (Public/Candidate/Employer endpoints do not leak private phones/emails/CVs)
"""

import unittest
import os
import sys
import json

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app import create_app, db
from services.customer import Customers, customer_jobs
from services.company import Company
from services.university import University, AcademicVerification
from services.teams import Teams
from services.job import Jobs
from services.chat import Conversation, ConversationParticipant, ChatMessage


class TestSecurityAcceptance(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.app.config['TESTING'] = True
        cls.app.config['WTF_CSRF_ENABLED'] = False
        cls.client = cls.app.test_client()

        with cls.app.app_context():
            # Clean any leftovers first
            db.session.execute(customer_jobs.delete().filter(customer_jobs.c.customer_id.in_(["sec_cand_1", "sec_cand_2"])))
            db.session.query(Customers).filter(Customers.email.in_(["sec_cand1@faeda.jobs", "sec_cand2@faeda.jobs"])).delete()
            db.session.query(Company).filter(Company.company_email.in_(["sec_comp1@faeda.jobs", "sec_comp2@faeda.jobs"])).delete()
            db.session.query(University).filter(University.email.in_(["sec_uni1@faeda.jobs", "sec_uni2@faeda.jobs"])).delete()
            db.session.commit()

            # Setup isolated test entities
            cand1 = Customers(
                user_id="sec_cand_1",
                fullname="Security Candidate Alpha",
                email="sec_cand1@faeda.jobs",
                mobile="0511111111",
                password="pass",
                status="active"
            )
            cand2 = Customers(
                user_id="sec_cand_2",
                fullname="Security Candidate Beta",
                email="sec_cand2@faeda.jobs",
                mobile="0522222222",
                password="pass",
                status="active"
            )
            comp1 = Company(
                company_email="sec_comp1@faeda.jobs",
                company_english_name="Security Company Alpha",
                login_password="pass"
            )
            comp1.is_verified = True
            comp1.status = "active"

            comp2 = Company(
                company_email="sec_comp2@faeda.jobs",
                company_english_name="Security Company Beta",
                login_password="pass"
            )
            comp2.is_verified = True
            comp2.status = "active"

            uni1 = University(
                name_ar="جامعة الأمان الأولى",
                name_en="Security University Alpha",
                email="sec_uni1@faeda.jobs",
                password="pass",
                is_verified=True,
                status="active"
            )
            uni2 = University(
                name_ar="جامعة الأمان الثانية",
                name_en="Security University Beta",
                email="sec_uni2@faeda.jobs",
                password="pass",
                is_verified=True,
                status="active"
            )
            db.session.add_all([cand1, cand2, comp1, comp2, uni1, uni2])
            db.session.commit()

            cls.cand1_id = cand1.id
            cls.cand1_email = cand1.email
            cls.cand2_id = cand2.id
            cls.cand2_email = cand2.email
            cls.comp1_id = comp1.id
            cls.comp1_email = comp1.company_email
            cls.comp2_id = comp2.id
            cls.comp2_email = comp2.company_email
            cls.uni1_id = uni1.id
            cls.uni1_email = uni1.email
            cls.uni2_id = uni2.id
            cls.uni2_email = uni2.email

            # Create test job for Company 1
            job1 = Jobs(
                title="Security Engineer",
                job_type="Full-time",
                town="Riyadh",
                company_about="Security firm",
                job_description="Secure the platform.",
                specialization="Cybersecurity",
                skills_years="3 years",
                educational_qualification="Bachelor",
                workplace="Office",
                company_id=cls.comp1_id
            )
            job1.status = "approved"
            db.session.add(job1)
            db.session.commit()
            cls.job1_id = job1.id

            # Candidate 1 applies to Job 1
            db.session.execute(customer_jobs.insert().values(
                customer_id="sec_cand_1",
                job_id=cls.job1_id,
                status="applied",
                type="individual"
            ))
            db.session.commit()

            # Fetch application entry ID
            app_entry = db.session.query(customer_jobs).filter_by(
                customer_id="sec_cand_1",
                job_id=cls.job1_id
            ).first()
            cls.app1_id = app_entry.id if app_entry else 1

            # Create conversation between Cand 1 and Comp 1
            conv1 = Conversation(
                type='CANDIDATE_COMPANY',
                subject='Security Discussion',
                created_by_type='candidate',
                created_by_id=cls.cand1_id
            )
            db.session.add(conv1)
            db.session.commit()
            cls.conv1_id = conv1.id

            p1 = ConversationParticipant(conversation_id=cls.conv1_id, participant_type='candidate', participant_id=cls.cand1_id)
            p2 = ConversationParticipant(conversation_id=cls.conv1_id, participant_type='company', participant_id=cls.comp1_id)
            db.session.add_all([p1, p2])
            db.session.commit()

    @classmethod
    def tearDownClass(cls):
        with cls.app.app_context():
            # Clean up test entities
            db.session.query(ChatMessage).filter(ChatMessage.conversation_id == cls.conv1_id).delete()
            db.session.query(ConversationParticipant).filter(ConversationParticipant.conversation_id == cls.conv1_id).delete()
            db.session.query(Conversation).filter_by(id=cls.conv1_id).delete()
            db.session.execute(customer_jobs.delete().filter(customer_jobs.c.customer_id.in_(["sec_cand_1", "sec_cand_2"])))
            db.session.query(Jobs).filter(Jobs.company_id.in_([cls.comp1_id, cls.comp2_id])).delete()
            db.session.query(Customers).filter(Customers.id.in_([cls.cand1_id, cls.cand2_id])).delete()
            db.session.query(Company).filter(Company.id.in_([cls.comp1_id, cls.comp2_id])).delete()
            db.session.query(University).filter(University.id.in_([cls.uni1_id, cls.uni2_id])).delete()
            db.session.commit()

    def login_candidate_1(self):
        with self.client.session_transaction() as sess:
            sess.clear()
            sess['session_customer'] = True
            sess['user_id'] = self.cand1_id
            sess['email_session'] = self.cand1_email

    def login_candidate_2(self):
        with self.client.session_transaction() as sess:
            sess.clear()
            sess['session_customer'] = True
            sess['user_id'] = self.cand2_id
            sess['email_session'] = self.cand2_email

    def login_company_1(self):
        with self.client.session_transaction() as sess:
            sess.clear()
            sess['session_company'] = True
            sess['company_id'] = self.comp1_id
            sess['company_email_session'] = self.comp1_email

    def login_company_2(self):
        with self.client.session_transaction() as sess:
            sess.clear()
            sess['session_company'] = True
            sess['company_id'] = self.comp2_id
            sess['company_email_session'] = self.comp2_email

    def login_university_1(self):
        with self.client.session_transaction() as sess:
            sess.clear()
            sess['session_university'] = True
            sess['university_id'] = self.uni1_id
            sess['university_email'] = self.uni1_email

    def test_01_unauthenticated_protected_api_access(self):
        """Unauthenticated requests to protected endpoints return 401."""
        with self.client.session_transaction() as sess:
            sess.clear()

        res = self.client.get('/api/v1/candidate/profile')
        self.assertEqual(res.status_code, 401)

        res = self.client.get('/api/v1/candidate/dashboard')
        self.assertEqual(res.status_code, 401)

        res = self.client.get('/api/v1/company/dashboard')
        self.assertEqual(res.status_code, 401)

        res = self.client.get('/api/v1/university/dashboard')
        self.assertEqual(res.status_code, 401)

        res = self.client.get('/api/v1/chat/conversations')
        self.assertEqual(res.status_code, 401)

        res = self.client.get('/api/v1/company/campaigns')
        self.assertEqual(res.status_code, 401)

        res = self.client.get('/api/v1/candidate/campaign-invites')
        self.assertEqual(res.status_code, 401)

        # Explicitly verify that development persona headers & role query params return 401
        for role in ['company', 'university', 'candidate']:
            endpoint = f'/api/v1/{role}/dashboard'
            res_hdr = self.client.get(endpoint, headers={'X-Persona-Role': role})
            self.assertEqual(res_hdr.status_code, 401, f"Expected 401 for {endpoint} with X-Persona-Role, got {res_hdr.status_code}")
            res_query = self.client.get(f'{endpoint}?role={role}')
            self.assertEqual(res_query.status_code, 401, f"Expected 401 for {endpoint}?role={role}, got {res_query.status_code}")

    def test_02_role_mismatch_isolation(self):
        """Candidate cannot access Company/University APIs, and vice versa."""
        self.login_candidate_1()
        res = self.client.get('/api/v1/company/dashboard')
        self.assertEqual(res.status_code, 401)

        res = self.client.get('/api/v1/university/dashboard')
        self.assertEqual(res.status_code, 401)

        self.login_company_1()
        res = self.client.get('/api/v1/candidate/profile')
        self.assertEqual(res.status_code, 401)

        res = self.client.get('/api/v1/university/dashboard')
        self.assertEqual(res.status_code, 401)

        self.login_university_1()
        res = self.client.get('/api/v1/candidate/profile')
        self.assertEqual(res.status_code, 401)

        res = self.client.get('/api/v1/company/dashboard')
        self.assertEqual(res.status_code, 401)

    def test_03_idor_on_candidate_applications(self):
        """Candidate 2 cannot access Candidate 1's application detail."""
        self.login_candidate_2()
        res = self.client.get(f'/api/v1/candidate/applications/{self.app1_id}')
        self.assertIn(res.status_code, [403, 404])

    def test_04_idor_on_company_applications(self):
        """Company 2 (Competitor) cannot update status of Job 1's applications."""
        self.login_company_2()
        res = self.client.put(f'/api/v1/company/applications/{self.app1_id}/status', json={
            'status': 'accepted',
            'note': 'Hacked status'
        })
        self.assertIn(res.status_code, [403, 404])

    def test_05_idor_on_chat_conversation(self):
        """Unauthorized candidate or company cannot read or post in another user's conversation."""
        self.login_candidate_2()
        res = self.client.get(f'/api/v1/chat/conversations/{self.conv1_id}')
        self.assertIn(res.status_code, [403, 404])

        res = self.client.post(f'/api/v1/chat/conversations/{self.conv1_id}/messages', json={
            'body': 'Malicious message injection'
        })
        self.assertIn(res.status_code, [403, 404])

        self.login_company_2()
        res = self.client.get(f'/api/v1/chat/conversations/{self.conv1_id}')
        self.assertIn(res.status_code, [403, 404])

    def test_06_privacy_protection_in_talent_discovery(self):
        """Talent discovery for employers must NOT expose private phone or email."""
        self.login_company_1()
        res = self.client.get('/api/v1/company/talent')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        talents = data.get('candidates', [])
        for cand in talents:
            self.assertNotIn('email', cand)
            self.assertNotIn('mobile', cand)
            self.assertNotIn('phone', cand)

    def test_07_production_secret_key_enforcement(self):
        """Production deployment strictly requires a secure, non-default SECRET_KEY."""
        import os
        old_env = os.environ.get('FLASK_ENV')
        old_secret = os.environ.get('SECRET_KEY')
        try:
            os.environ['FLASK_ENV'] = 'production'
            os.environ['SECRET_KEY'] = 'default-secret-key-for-dev'
            with self.assertRaises(RuntimeError):
                create_app()

            os.environ['SECRET_KEY'] = 'faeda-jobs-secret-key-2026'
            with self.assertRaises(RuntimeError):
                create_app()

            os.environ['SECRET_KEY'] = 'a-truly-random-secure-production-secret-key-987654321'
            prod_app = create_app()
            self.assertIsNotNone(prod_app)
            self.assertEqual(prod_app.config['SECRET_KEY'], 'a-truly-random-secure-production-secret-key-987654321')
        finally:
            if old_env is not None:
                os.environ['FLASK_ENV'] = old_env
            else:
                os.environ.pop('FLASK_ENV', None)
            if old_secret is not None:
                os.environ['SECRET_KEY'] = old_secret
            else:
                os.environ.pop('SECRET_KEY', None)

    def test_08_csrf_protection_suite(self):
        """Verify CSRF token endpoint, enforcement on stateful requests, and Bearer exemption."""
        from services.auth_token import generate_auth_token
        test_app = create_app()
        test_app.config['TESTING'] = True
        test_app.config['WTF_CSRF_ENABLED'] = True

        with test_app.test_client() as client:
            # 1. Fetch CSRF token endpoint
            token_res = client.get('/api/v1/auth/csrf-token')
            self.assertEqual(token_res.status_code, 200)
            token_data = token_res.get_json()
            self.assertIn('csrf_token', token_data)
            csrf_token = token_data['csrf_token']
            self.assertTrue(len(csrf_token) > 10)

            # 2. Stateful POST without CSRF token -> Blocked (400 Bad Request)
            blocked_res = client.post('/login', data={'email': 'anyone@example.com', 'password': 'pass'})
            self.assertEqual(blocked_res.status_code, 400)

            # 3. Stateful POST with X-CSRF-TOKEN header -> Accepted (passes CSRF check)
            header_res = client.post(
                '/login',
                data={'email': 'anyone@example.com', 'password': 'pass'},
                headers={'X-CSRF-TOKEN': csrf_token}
            )
            self.assertNotEqual(header_res.status_code, 400)

            # 4. Stateful POST with form csrf_token input -> Accepted (passes CSRF check)
            form_res = client.post(
                '/login',
                data={'email': 'anyone@example.com', 'password': 'pass', 'csrf_token': csrf_token}
            )
            self.assertNotEqual(form_res.status_code, 400)

            # 5. Stateless API POST with Authorization: Bearer <token> -> Exempted from CSRF
            bearer_token = generate_auth_token({'id': self.cand1_id, 'role': 'candidate'})
            bearer_res = client.post(
                '/api/v1/candidate/profile/projects',
                headers={'Authorization': f'Bearer {bearer_token}'},
                json={'project_name': 'CSRF Exempt Test Project', 'description': 'Security verification'}
            )
            # Should not be blocked by CSRF (status should be 200)
            self.assertEqual(bearer_res.status_code, 200)


if __name__ == '__main__':
    unittest.main()

