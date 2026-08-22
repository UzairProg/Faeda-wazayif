import unittest
import json
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from services.customer import Customers, CustomerProfileHistory, CustomerProject, CustomerCertification, customer_jobs
from services.job import Jobs
from ai_engine.market_value_calculator import get_market_value_for_customer, calculate_market_value

class CandidateDashboardTestSuite(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()

        # Retrieve or find candidate
        self.candidate = Customers.query.filter_by(status='active').first()
        if not self.candidate:
            self.candidate = Customers.query.first()
        
        self.candidate_id = self.candidate.id
        self.candidate_email = self.candidate.email
        self.candidate_user_id = self.candidate.user_id

    def tearDown(self):
        self.ctx.pop()

    def test_unauthenticated_dashboard_returns_401(self):
        res = self.client.get('/api/v1/candidate/dashboard')
        self.assertEqual(res.status_code, 401)

    def test_authenticated_dashboard_returns_200_and_valid_structure(self):
        with self.client.session_transaction() as sess:
            sess['session_customer'] = self.candidate_email
            sess['user_id'] = self.candidate_id
            sess['role'] = 'candidate'

        res = self.client.get('/api/v1/candidate/dashboard')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()

        # Top level keys
        self.assertIn('candidate', data)
        self.assertIn('profile_health', data)
        self.assertIn('market_value', data)
        self.assertIn('next_actions', data)
        self.assertIn('recommended_jobs', data)
        self.assertIn('activity', data)
        self.assertIn('quick_stats', data)

        # Candidate identity
        self.assertEqual(data['candidate']['id'], self.candidate_id)
        self.assertIsNotNone(data['candidate']['name'])

        # Profile health
        self.assertGreaterEqual(data['profile_health']['percentage'], 0)
        self.assertLessEqual(data['profile_health']['percentage'], 100)

        # Market value structure
        mv = data['market_value']
        self.assertIn('available', mv)
        self.assertIn('currency', mv)
        self.assertEqual(mv['currency'], 'SAR')
        self.assertIn('factors', mv)
        self.assertIsInstance(mv['factors'], list)

        # Next actions
        self.assertIsInstance(data['next_actions'], list)
        for act in data['next_actions']:
            self.assertIn('id', act)
            self.assertIn('title_ar', act)
            self.assertIn('title_en', act)
            self.assertIn('action_url', act)

    def test_market_value_calculator_with_complete_profile(self):
        sample = {
            'educational_qualification': 'بكالوريوس',
            'university': 'جامعة الملك سعود',
            'years_of_skills': '3-5 سنوات',
            'gpa': '4.5',
            'certifications': ['AWS Certified Solutions Architect', 'PMP'],
            'preferred_field_of_work': 'تقنية المعلومات'
        }
        res = calculate_market_value(sample)
        self.assertGreater(res['total_score'], 0)
        self.assertIsNotNone(res['salary_range'])
        self.assertEqual(res['salary_range']['min_salary'], 13000)
        self.assertEqual(res['salary_range']['avg_salary'], 18500)
        self.assertEqual(res['salary_range']['max_salary'], 25000)

    def test_recommendations_endpoint(self):
        with self.client.session_transaction() as sess:
            sess['session_customer'] = self.candidate_email
            sess['user_id'] = self.candidate_id
            sess['role'] = 'candidate'

        res = self.client.get('/api/v1/candidate/recommendations')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('jobs', data)
        self.assertIsInstance(data['jobs'], list)

    def test_candidate_jobs_list_and_detail(self):
        with self.client.session_transaction() as sess:
            sess['session_customer'] = self.candidate_email
            sess['user_id'] = self.candidate_id
            sess['role'] = 'candidate'

        res = self.client.get('/api/v1/candidate/jobs')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('jobs', data)
        self.assertIn('total', data)

        if len(data['jobs']) > 0:
            first_job_id = data['jobs'][0]['id']
            res_detail = self.client.get(f'/api/v1/candidate/jobs/{first_job_id}')
            self.assertEqual(res_detail.status_code, 200)
            detail_data = res_detail.get_json()
            self.assertIn('candidateReadiness', detail_data)
            self.assertIn('company', detail_data)
            self.assertIn('hasApplied', detail_data)
            self.assertIn('isSaved', detail_data)

    def test_candidate_save_and_unsave_job(self):
        with self.client.session_transaction() as sess:
            sess['session_customer'] = self.candidate_email
            sess['user_id'] = self.candidate_id
            sess['role'] = 'candidate'

        job = Jobs.query.filter_by(status='approved').first()
        if not job:
            return

        # Save job
        res_save = self.client.post(f'/api/v1/candidate/jobs/{job.id}/save')
        self.assertEqual(res_save.status_code, 200)
        self.assertTrue(res_save.get_json()['isSaved'])

        # Check saved list
        res_saved = self.client.get('/api/v1/candidate/saved-jobs')
        self.assertEqual(res_saved.status_code, 200)
        saved_jobs = res_saved.get_json()['jobs']
        self.assertTrue(any(str(j['id']) == str(job.id) for j in saved_jobs))

        # Unsave job
        res_unsave = self.client.delete(f'/api/v1/candidate/jobs/{job.id}/save')
        self.assertEqual(res_unsave.status_code, 200)
        self.assertFalse(res_unsave.get_json()['isSaved'])

    def test_candidate_apply_flow_and_applications_list(self):
        with self.client.session_transaction() as sess:
            sess['session_customer'] = self.candidate_email
            sess['user_id'] = self.candidate_id
            sess['role'] = 'candidate'

        job = Jobs.query.filter_by(status='approved').first()
        if not job:
            return

        # Apply to job
        res_apply = self.client.post(f'/api/v1/candidate/jobs/{job.id}/apply')
        self.assertIn(res_apply.status_code, [201, 409])
        
        # Test duplicate apply protection
        res_dup = self.client.post(f'/api/v1/candidate/jobs/{job.id}/apply')
        self.assertEqual(res_dup.status_code, 409)
        self.assertTrue(res_dup.get_json()['alreadyApplied'])

        # Get applications list
        res_apps = self.client.get('/api/v1/candidate/applications')
        self.assertEqual(res_apps.status_code, 200)
        apps_data = res_apps.get_json()
        self.assertIn('applications', apps_data)
        self.assertGreater(len(apps_data['applications']), 0)

        # Get application detail
        app_id = apps_data['applications'][0]['id']
        res_app_detail = self.client.get(f'/api/v1/candidate/applications/{app_id}')
        self.assertEqual(res_app_detail.status_code, 200)
        app_detail = res_app_detail.get_json()
        self.assertEqual(app_detail['id'], app_id)
        self.assertIn('timeline', app_detail)
        self.assertIn('candidateSnapshot', app_detail)

if __name__ == '__main__':
    unittest.main()
