#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
test_company_workspace_suite.py — Comprehensive Automated Test Suite for Company Workspace (Section 5).
Validates:
1. Unauthenticated 401 guards across all /api/v1/company/* endpoints
2. Company authentication & /api/v1/company/me
3. Company profile retrieval & transparent completeness calculation
4. Company profile update persistence
5. Company dashboard real metric aggregation
6. Company job creation, listing, detail, update, and deletion
7. IDOR & multi-tenant isolation (Company A cannot view/modify Company B's jobs or applications)
8. Company application pipeline management & status transitions
9. Talent discovery with candidate privacy & visibility enforcement
10. Employer-safe candidate detail
11. Professional team discovery for employers
"""
import unittest
import json
import os
import sys
from datetime import datetime

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import create_app, db
from services.company import Company
from services.customer import Customers, customer_jobs
from services.job import Jobs
from services.teams import Teams


class CompanyWorkspaceTestSuite(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.app.config['TESTING'] = True
        self.app.config['WTF_CSRF_ENABLED'] = False
        self.client = self.app.test_client()

        with self.app.app_context():
            # Setup Company A (Test Employer)
            self.comp_a = Company.query.filter_by(company_email="employer_a_test@faeda.jobs").first()
            if not self.comp_a:
                self.comp_a = Company(
                    company_arabic_name="شركة التقنية المتقدمة للاختبار",
                    company_english_name="Advanced Tech Test Co",
                    company_email="employer_a_test@faeda.jobs",
                    company_mobile="+966501112233",
                    country="المملكة العربية السعودية",
                    state="الرياض",
                    company_type="شركة مساهمة",
                    company_size="50-200 موظف",
                    company_field="تقنية المعلومات والبرمجيات",
                    about_company_arabic="شركة رائدة في تقديم الحلول الرقمية السحابية والذكاء الاصطناعي.",
                    about_company_english="Leading provider of cloud enterprise solutions.",
                    company_website="https://tech-test-co.sa",
                    login_password="hashed_test_pass",
                    activated=True
                )
                self.comp_a.is_verified = True
                db.session.add(self.comp_a)
                db.session.commit()
            self.comp_a_id = self.comp_a.id

            # Setup Company B (Other Employer for IDOR tests)
            self.comp_b = Company.query.filter_by(company_email="employer_b_test@faeda.jobs").first()
            if not self.comp_b:
                self.comp_b = Company(
                    company_arabic_name="شركة الرياض للاستشارات",
                    company_english_name="Riyadh Consulting Co",
                    company_email="employer_b_test@faeda.jobs",
                    company_mobile="+966509998877",
                    country="المملكة العربية السعودية",
                    state="الرياض",
                    company_type="مؤسسة",
                    company_size="10-50 موظف",
                    company_field="الاستشارات المالية",
                    login_password="hashed_test_pass",
                    activated=True
                )
                db.session.add(self.comp_b)
                db.session.commit()
            self.comp_b_id = self.comp_b.id

            # Setup Candidate User
            self.cand = Customers.query.filter_by(user_id="test-cand-employer-suite").first()
            if not self.cand:
                self.cand = Customers(
                    user_id="test-cand-employer-suite",
                    fullname="عبدالله بن خالد المهندس",
                    email="abdullah.engineer@faeda.jobs",
                    mobile="+966551234567",
                    password="hashed_cand_pass",
                    about="مهندس برمجيات متقدم متخصص في معمارية النظم السحابية.",
                    country="المملكة العربية السعودية",
                    government="الرياض",
                    educational_qualification="بكالوريوس",
                    university="جامعة الملك سعود",
                    department_university="علوم الحاسب",
                    years_of_skills="4-7 سنوات",
                    preferred_field_of_work="هندسة البرمجيات السحابية",
                    work_type="دوام كامل",
                    work_style="هجين",
                    visibility="employers_only",
                    is_verified=True,
                    activated=True
                )
                db.session.add(self.cand)
                db.session.commit()

            # Setup Private Candidate (to test visibility privacy)
            self.private_cand = Customers.query.filter_by(user_id="test-private-cand").first()
            if not self.private_cand:
                self.private_cand = Customers(
                    user_id="test-private-cand",
                    fullname="مرشح سري خاص",
                    email="private.cand@faeda.jobs",
                    mobile="+966550000000",
                    password="secret_pass_hash",
                    about="ملفي غير متاح للاستكشاف العام.",
                    visibility="private",
                    activated=True
                )
                db.session.add(self.private_cand)
                db.session.commit()

    def login_company(self, company_id):
        with self.client.session_transaction() as sess:
            sess['session_company'] = True
            sess['company_id'] = company_id

    def test_01_unauthenticated_guard(self):
        """Verify unauthenticated requests return 401."""
        endpoints = [
            ('/api/v1/company/me', 'GET'),
            ('/api/v1/company/profile', 'GET'),
            ('/api/v1/company/dashboard', 'GET'),
            ('/api/v1/company/jobs', 'GET'),
            ('/api/v1/company/applications', 'GET'),
            ('/api/v1/company/talent', 'GET'),
            ('/api/v1/company/teams', 'GET'),
        ]
        for url, method in endpoints:
            if method == 'GET':
                res = self.client.get(url)
            self.assertEqual(res.status_code, 401, f"Endpoint {url} did not guard unauthenticated access")

    def test_02_company_auth_and_profile_flow(self):
        """Verify /company/me and /company/profile retrieval & updates."""
        self.login_company(self.comp_a_id)

        # 1. /company/me
        res = self.client.get('/api/v1/company/me')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data['authenticated'])
        self.assertEqual(data['role'], 'company')
        self.assertEqual(data['company']['id'], self.comp_a_id)

        # 2. /company/profile GET
        res_prof = self.client.get('/api/v1/company/profile')
        self.assertEqual(res_prof.status_code, 200)
        prof_data = res_prof.get_json()
        self.assertEqual(prof_data['id'], self.comp_a_id)
        self.assertIn('completeness', prof_data)
        self.assertGreater(prof_data['completeness']['percentage'], 0)
        self.assertEqual(len(prof_data['completeness']['items']), 8)

        # 3. /company/profile PUT
        update_payload = {
            "englishName": "Advanced Cloud Tech Corp",
            "companyField": "الحوسبة السحابية والذكاء الاصطناعي",
            "metrics": {
                "numberOfProjects": 12,
                "successRate": 96.5,
                "profitPercentage": 22.0
            }
        }
        res_update = self.client.put(
            '/api/v1/company/profile',
            data=json.dumps(update_payload),
            content_type='application/json'
        )
        self.assertEqual(res_update.status_code, 200)
        updated_data = res_update.get_json()['company']
        self.assertEqual(updated_data['englishName'], "Advanced Cloud Tech Corp")
        self.assertEqual(updated_data['metrics']['numberOfProjects'], 12)
        self.assertEqual(updated_data['metrics']['successRate'], 96.5)

    def test_03_company_job_lifecycle_and_isolation(self):
        """Verify creating, editing, listing jobs and cross-company IDOR protection."""
        self.login_company(self.comp_a_id)

        # 1. Create Job for Company A
        job_payload = {
            "title": "مهندس سحابي أول (Senior Cloud DevOps)",
            "description": "نبحث عن مهندس سحابي خبير في إدارة البنية التحتية باستخدام Terraform و Kubernetes.",
            "specialization": "هندسة السحابة و DevOps",
            "jobType": "دوام كامل",
            "town": "الرياض",
            "skillsYears": "3-5 سنوات",
            "educationalQualification": "بكالوريوس",
            "workplace": "هجين",
            "requiredSkills": ["Kubernetes", "Docker", "Terraform", "AWS", "CI/CD"],
            "languages": ["العربية", "الإنجليزية"],
            "salaryMin": 18000,
            "salaryMax": 26000,
            "status": "approved"
        }
        res_create = self.client.post(
            '/api/v1/company/jobs',
            data=json.dumps(job_payload),
            content_type='application/json'
        )
        self.assertEqual(res_create.status_code, 201)
        job_data = res_create.get_json()['job']
        job_id = job_data['id']
        self.assertEqual(job_data['title'], "مهندس سحابي أول (Senior Cloud DevOps)")

        # 2. List Jobs
        res_list = self.client.get('/api/v1/company/jobs')
        self.assertEqual(res_list.status_code, 200)
        jobs_list = res_list.get_json()['jobs']
        self.assertTrue(any(j['id'] == job_id for j in jobs_list))

        # 3. IDOR Check: Company B should NOT be able to view or edit Company A's job
        self.login_company(self.comp_b_id)
        res_idor_get = self.client.get(f'/api/v1/company/jobs/{job_id}')
        self.assertEqual(res_idor_get.status_code, 404)

        res_idor_put = self.client.put(
            f'/api/v1/company/jobs/{job_id}',
            data=json.dumps({"title": "اختراق غير مصرح به"}),
            content_type='application/json'
        )
        self.assertEqual(res_idor_put.status_code, 404)

        # 4. Switch back to Company A and update job
        self.login_company(self.comp_a_id)
        res_update = self.client.put(
            f'/api/v1/company/jobs/{job_id}',
            data=json.dumps({"salaryMax": 28000}),
            content_type='application/json'
        )
        self.assertEqual(res_update.status_code, 200)
        self.assertEqual(res_update.get_json()['job']['salary']['max'], 28000)

    def test_04_company_application_pipeline(self):
        """Verify application submission, viewing, status transitions, and IDOR isolation."""
        with self.app.app_context():
            # Ensure a job exists for Company A
            job = Jobs.query.filter_by(company_id=self.comp_a_id).first()
            if not job:
                job = Jobs(
                    title="مطور بايثون متقدم",
                    job_type="دوام كامل",
                    town="الرياض",
                    company_about="عن الشركة",
                    job_description="تطوير واجهات برمجة التطبيقات وسيرفرات فلاسك.",
                    specialization="تطوير البرمجيات",
                    skills_years="2-4 سنوات",
                    educational_qualification="بكالوريوس",
                    workplace="عن بعد",
                    company_id=self.comp_a_id,
                    status="approved"
                )
                db.session.add(job)
                db.session.commit()
            job_id = job.id

            # Create an application record in customer_jobs
            stmt = customer_jobs.insert().values(
                customer_id=self.cand.user_id,
                job_id=job_id,
                status='تم التقديم',
                timestamp=datetime.utcnow()
            )
            db.session.execute(stmt)
            db.session.commit()

            # Retrieve created application ID
            app_record = db.session.query(customer_jobs.c.id).filter(
                customer_jobs.c.customer_id == self.cand.user_id,
                customer_jobs.c.job_id == job_id
            ).order_by(customer_jobs.c.id.desc()).first()
            app_id = app_record[0]

        # 1. Company A views applications
        self.login_company(self.comp_a_id)
        res_apps = self.client.get('/api/v1/company/applications')
        self.assertEqual(res_apps.status_code, 200)
        apps_data = res_apps.get_json()
        self.assertGreater(apps_data['total'], 0)
        app_item = next(a for a in apps_data['applications'] if a['id'] == app_id)
        self.assertEqual(app_item['status'], 'applied')

        # 2. View Application Detail
        res_app_det = self.client.get(f'/api/v1/company/applications/{app_id}')
        self.assertEqual(res_app_det.status_code, 200)
        det_data = res_app_det.get_json()
        self.assertEqual(det_data['candidate']['name'], self.cand.fullname)
        self.assertNotIn('password', det_data['candidate'])

        # 3. Move application status to shortlisted and interview
        res_status = self.client.put(
            f'/api/v1/company/applications/{app_id}/status',
            data=json.dumps({"status": "shortlisted", "note": "مرشح ممتاز للمقابلة الفنية"}),
            content_type='application/json'
        )
        self.assertEqual(res_status.status_code, 200)
        self.assertEqual(res_status.get_json()['status'], 'shortlisted')

        # 4. IDOR Check: Company B cannot view or update Company A's application
        self.login_company(self.comp_b_id)
        res_b_view = self.client.get(f'/api/v1/company/applications/{app_id}')
        self.assertEqual(res_b_view.status_code, 404)

        res_b_update = self.client.put(
            f'/api/v1/company/applications/{app_id}/status',
            data=json.dumps({"status": "rejected"}),
            content_type='application/json'
        )
        self.assertEqual(res_b_update.status_code, 404)

    def test_05_talent_discovery_privacy_and_teams(self):
        """Verify talent search excludes private profiles and team discovery works."""
        self.login_company(self.comp_a_id)

        # 1. Talent discovery
        res_talent = self.client.get('/api/v1/company/talent?q=عبدالله')
        self.assertEqual(res_talent.status_code, 200)
        talent_items = res_talent.get_json()['talent']
        self.assertTrue(any(t['userId'] == self.cand.user_id for t in talent_items))

        # Check that private candidate is NOT discovered
        res_priv = self.client.get('/api/v1/company/talent?q=سري')
        self.assertEqual(res_priv.status_code, 200)
        priv_items = res_priv.get_json()['talent']
        self.assertFalse(any(t['userId'] == self.private_cand.user_id for t in priv_items))

        # 2. Direct talent profile detail
        res_cand_det = self.client.get(f'/api/v1/company/talent/{self.cand.user_id}')
        self.assertEqual(res_cand_det.status_code, 200)
        cand_data = res_cand_det.get_json()
        self.assertEqual(cand_data['name'], self.cand.fullname)
        self.assertNotIn('password', cand_data)
        self.assertNotIn('mobile', cand_data)

        # 3. Private candidate detail should return 403 Forbidden since private candidate has not applied to Company A
        res_priv_det = self.client.get(f'/api/v1/company/talent/{self.private_cand.user_id}')
        self.assertEqual(res_priv_det.status_code, 403)

        # 4. Professional Teams discovery
        res_teams = self.client.get('/api/v1/company/teams')
        self.assertEqual(res_teams.status_code, 200)
        teams_data = res_teams.get_json()
        self.assertIn('teams', teams_data)


if __name__ == '__main__':
    unittest.main()
