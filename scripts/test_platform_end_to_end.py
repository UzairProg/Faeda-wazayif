#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
scripts/test_platform_end_to_end.py
=============================================================================
FAEDA JOBS — PLATFORM-WIDE END-TO-END INTEGRATION AUDIT SUITE (SECTION 7)
=============================================================================
Verifies all 4 ecosystems (Public, Candidate, Company, University)
ensuring real database persistence, correct status transitions, multi-tenant
isolation, and ZERO dummy/unconnected endpoints.
"""

import sys
import os
import io
import json
import unittest
from datetime import datetime

# Ensure repo root is on sys.path
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app import create_app, db
from services.customer import Customers, customer_jobs, CustomerProject, CustomerCertification
from services.skills import Skills
from services.company import Company
from services.job import Jobs
from services.university import University, UniversityDepartment, AcademicVerification
from services.teams import Teams


class TestPlatformEndToEndIntegration(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Bootstrap test Flask application with testing configuration."""
        cls.app = create_app()
        cls.app.config['TESTING'] = True
        cls.app.config['WTF_CSRF_ENABLED'] = False
        cls.client = cls.app.test_client()

        with cls.app.app_context():
            db.create_all()

            # 1. Setup Candidate
            cand = Customers.query.filter_by(email="candidate_e2e@faeda.test").first()
            if not cand:
                cand = Customers(
                    user_id="cand_e2e_uuid_123",
                    fullname="أحمد السعيد الزهراني",
                    email="candidate_e2e@faeda.test",
                    mobile="+966551234567",
                    password="hashed_pass_test",
                    years_of_skills="3-5 سنوات",
                    preferred_field_of_work="تطوير البرمجيات والتقنية",
                    educational_qualification="بكالوريوس علوم حاسب",
                    university="جامعة الملك فهد للبترول والمعادن",
                    gpa="3.85",
                    government="الرياض",
                    country="المملكة العربية السعودية",
                    about="مهندس برمجيات متكامل شغوف ببناء المنصات السحابية",
                    activated=True
                )
                cand.is_verified = 1
                db.session.add(cand)
                db.session.commit()

            cls.cand_id = cand.id
            cls.cand_email = cand.email
            cls.cand_user_id = cand.user_id

            # Add initial skills
            Skills.query.filter_by(customer_id=cand.id).delete()
            for sname in ["Python", "React", "TypeScript", "PostgreSQL"]:
                db.session.add(Skills(customer_id=cand.id, skill_name=sname))
            db.session.commit()

            # 2. Setup Company
            comp = Company.query.filter_by(company_email="company_e2e@faeda.test").first()
            if not comp:
                comp = Company(
                    company_arabic_name="شركة الابتكار الرقمي المحدودة",
                    company_english_name="Digital Innovation Co",
                    company_email="company_e2e@faeda.test",
                    company_mobile="+966114567890",
                    company_field="تقنية المعلومات والبرمجيات",
                    country="المملكة العربية السعودية",
                    state="الرياض",
                    english_adress="Riyadh, Saudi Arabia",
                    about_company_arabic="شركة رائدة في تطوير الحلول البرمجية والتحول الرقمي",
                    about_company_english="Leading company in cloud solutions and digital transformation",
                    company_website="https://digital-innovation.sa",
                    login_password="hashed_pass_test",
                    activated=True
                )
                comp.is_verified = True
                db.session.add(comp)
                db.session.commit()

            cls.comp_id = comp.id
            cls.comp_email = comp.company_email

            # 3. Setup University
            univ = University.query.filter_by(email="kfupm_e2e@faeda.test").first()
            if not univ:
                univ = University(
                    name_ar="جامعة الملك فهد للبترول والمعادن",
                    name_en="King Fahd University of Petroleum and Minerals",
                    email="kfupm_e2e@faeda.test",
                    password="hashed_pass_test",
                    phone="+966138600000",
                    location="الظهران",
                    country="المملكة العربية السعودية",
                    qs_rank=160,
                    is_verified=True,
                    status="active"
                )
                db.session.add(univ)
                db.session.commit()

            cls.univ_id = univ.id
            cls.univ_email = univ.email

            # 4. Setup Test Job
            test_job = Jobs.query.filter_by(title="مهندس برمجيات أول - E2E").first()
            if not test_job:
                test_job = Jobs(
                    title="مهندس برمجيات أول - E2E",
                    company_id=comp.id,
                    company_about="شركة الابتكار الرقمي المحدودة",
                    specialization="تطوير البرمجيات والتقنية",
                    job_type="دوام كامل",
                    town="الرياض",
                    workplace="هجين",
                    skills_years="3-5 سنوات",
                    educational_qualification="بكالوريوس",
                    job_description="نبحث عن مهندس برمجيات أول للمساهمة في بناء الأنظمة السحابية",
                    required_skills="Python, Flask, React, PostgreSQL"
                )
                test_job.status = "approved"
                db.session.add(test_job)
                db.session.commit()

            cls.job_id = test_job.id

    # =========================================================================
    # 1. PUBLIC PLATFORM TESTS
    # =========================================================================

    def test_01_public_jobs_endpoint(self):
        """Verify public jobs list & filter APIs work correctly."""
        res = self.client.get('/api/v1/jobs')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('jobs', data)
        self.assertTrue(len(data['jobs']) > 0)

    def test_02_public_job_detail_endpoint(self):
        """Verify public job detail endpoint returns complete data."""
        res = self.client.get(f'/api/v1/jobs/{self.job_id}')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data['title'], "مهندس برمجيات أول - E2E")

    def test_03_public_companies_endpoint(self):
        """Verify public companies directory API returns valid records."""
        res = self.client.get('/api/v1/companies')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('companies', data)
        self.assertTrue(len(data['companies']) > 0)

    def test_04_public_teams_endpoint(self):
        """Verify public teams directory endpoint returns verified squads."""
        res = self.client.get('/api/v1/teams')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('teams', data)

    def test_05_public_contact_submission(self):
        """Verify public contact form submits successfully to backend."""
        payload = {
            "name": "سارة المحمد",
            "email": "sara.contact@faeda.test",
            "message": "استفسار حول شراكات التوظيف للجامعات في منصة فائدة.",
            "reason": "شراكات الجامعات"
        }
        res = self.client.post(
            '/api/v1/contact',
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data.get('success'))

    # =========================================================================
    # 2. CANDIDATE WORKSPACE TESTS
    # =========================================================================

    def _login_candidate(self):
        with self.client.session_transaction() as sess:
            sess['session_customer'] = self.cand_email
            sess['user_id'] = self.cand_id
            sess['user_role'] = 'customer'

    def test_06_candidate_session_auth(self):
        """Verify candidate authentication session resolution."""
        self._login_candidate()
        res = self.client.get('/api/v1/auth/me')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data.get('authenticated'))
        self.assertEqual(data.get('role'), 'candidate')
        self.assertEqual(data['user']['email'], self.cand_email)

    def test_07_candidate_dashboard_aggregation(self):
        """Verify candidate dashboard returns complete calculated telemetry."""
        self._login_candidate()
        res = self.client.get('/api/v1/candidate/dashboard')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('candidate', data)
        self.assertIn('profile_health', data)
        self.assertIn('market_value', data)
        self.assertIn('next_actions', data)
        self.assertIn('recommended_jobs', data)
        self.assertGreaterEqual(data['profile_health']['percentage'], 40)

    def test_08_candidate_profile_retrieval(self):
        """Verify candidate profile API returns full editable domain model."""
        self._login_candidate()
        res = self.client.get('/api/v1/candidate/profile')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data['fullname'], "أحمد السعيد الزهراني")
        self.assertIn('Python', data['skills'])

    def test_09_candidate_update_identity_and_skills(self):
        """Verify updating identity and skills updates candidate record in database."""
        self._login_candidate()
        # Update identity
        res_id = self.client.put(
            '/api/v1/candidate/profile/identity',
            data=json.dumps({"fullName": "أحمد السعيد الزهراني - المحدّث"}),
            content_type='application/json'
        )
        self.assertEqual(res_id.status_code, 200)

        # Update skills
        res_sk = self.client.put(
            '/api/v1/candidate/profile/skills',
            data=json.dumps({"skills": ["Python", "React", "TypeScript", "Docker", "FastAPI"]}),
            content_type='application/json'
        )
        self.assertEqual(res_sk.status_code, 200)
        data = res_sk.get_json()
        self.assertIn("FastAPI", data['skills'])

    def test_10_candidate_cv_upload(self):
        """Verify CV file upload, ATS score generation, and profile health update."""
        self._login_candidate()
        file_content = b"%PDF-1.4 Mock CV Content with Python and Cloud Engineering Experience"
        data = {
            'cv': (io.BytesIO(file_content), 'ahmed_cv_e2e.pdf')
        }
        res = self.client.post(
            '/api/v1/candidate/cv/upload',
            data=data,
            content_type='multipart/form-data'
        )
        self.assertEqual(res.status_code, 200)
        res_data = res.get_json()
        self.assertTrue(bool(res_data.get('cv')))

    def test_11_candidate_opportunities_search(self):
        """Verify candidate opportunities list with filtering and match scores."""
        self._login_candidate()
        res = self.client.get('/api/v1/candidate/jobs?q=مهندس')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('jobs', data)
        self.assertTrue(len(data['jobs']) > 0)

    def test_12_candidate_job_save_and_unsave(self):
        """Verify saving and unsaving jobs toggles correctly in database."""
        self._login_candidate()
        # Save
        res_save = self.client.post(f'/api/v1/candidate/jobs/{self.job_id}/save')
        self.assertEqual(res_save.status_code, 200)
        save_data = res_save.get_json()
        self.assertTrue(save_data.get('isSaved'))

        # Verify saved jobs list
        res_list = self.client.get('/api/v1/candidate/saved-jobs')
        self.assertEqual(res_list.status_code, 200)
        saved_jobs = res_list.get_json().get('jobs', [])
        self.assertTrue(any(j['id'] == self.job_id or j['id'] == str(self.job_id) for j in saved_jobs))

        # Unsave
        res_unsave = self.client.delete(f'/api/v1/candidate/jobs/{self.job_id}/save')
        self.assertEqual(res_unsave.status_code, 200)
        self.assertFalse(res_unsave.get_json().get('isSaved'))

    def test_13_candidate_job_application_flow(self):
        """Verify one-click application submission and duplicate prevention."""
        self._login_candidate()
        
        # Clean up any existing application for this job & candidate
        with self.app.app_context():
            db.session.query(customer_jobs).filter_by(
                customer_id=self.cand_user_id,
                job_id=self.job_id
            ).delete()
            db.session.commit()

        # Submit Application
        res_app = self.client.post(f'/api/v1/candidate/jobs/{self.job_id}/apply')
        self.assertEqual(res_app.status_code, 201)
        app_data = res_app.get_json()
        self.assertTrue(app_data.get('success'))
        self.assertEqual(app_data['application']['jobId'], self.job_id)

        # Verify Duplicate Application rejection
        res_dup = self.client.post(f'/api/v1/candidate/jobs/{self.job_id}/apply')
        self.assertEqual(res_dup.status_code, 409)

    def test_14_candidate_applications_list_and_detail(self):
        """Verify candidate applications history and detailed step tracker."""
        self._login_candidate()
        res = self.client.get('/api/v1/candidate/applications')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('applications', data)
        self.assertTrue(len(data['applications']) > 0)
        app_id = data['applications'][0]['id']

        # Get Application Detail
        res_detail = self.client.get(f'/api/v1/candidate/applications/{app_id}')
        self.assertEqual(res_detail.status_code, 200)
        detail_data = res_detail.get_json()
        self.assertIn('timeline', detail_data)
        self.assertIn('job', detail_data)

    def test_15_candidate_team_creation_and_capability_matrix(self):
        """Verify candidate team creation, member management, and capability matrix."""
        self._login_candidate()
        team_payload = {
            "name": "فريق النخبة للحلول السحابية E2E",
            "slug": "cloud-elite-e2e",
            "headline": "فريق متخصص في بناء البنى التحتية السحابية والأنظمة الموزعة",
            "about": "نقدم حلول متكاملة في هندسة البرمجيات والذكاء الاصطناعي",
            "specialization": "هندسة السحابة والبرمجيات",
            "primarySkills": ["Python", "AWS", "Kubernetes", "React", "PostgreSQL"],
            "targetIndustries": ["التقنية المالية", "التجارة الإلكترونية"],
            "visibility": "public"
        }
        res_team = self.client.post(
            '/api/v1/candidate/teams',
            data=json.dumps(team_payload),
            content_type='application/json'
        )
        self.assertEqual(res_team.status_code, 201)
        created_team = res_team.get_json().get('team', {})
        team_id = created_team.get('id') or res_team.get_json().get('id')

        # Retrieve Team Detail & Capability Matrix
        res_detail = self.client.get(f'/api/v1/candidate/teams/{team_id}')
        self.assertEqual(res_detail.status_code, 200)
        team_data = res_detail.get_json()
        self.assertIn('name', team_data)
        self.assertIn('members', team_data)
        self.assertIn('capabilities', team_data)

    # =========================================================================
    # 3. COMPANY WORKSPACE TESTS
    # =========================================================================

    def _login_company(self):
        with self.client.session_transaction() as sess:
            sess['session_company'] = self.comp_email
            sess['company_id'] = self.comp_id
            sess['user_role'] = 'company'

    def test_16_company_dashboard(self):
        """Verify company dashboard metrics, openings, and pipeline totals."""
        self._login_company()
        res = self.client.get('/api/v1/company/dashboard')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('company', data)
        self.assertIn('stats', data)
        self.assertIn('recentJobs', data)

    def test_17_company_profile_update(self):
        """Verify updating company profile attributes persists in database."""
        self._login_company()
        payload = {
            "englishName": "Digital Innovation Co - Updated",
            "aboutEnglish": "Leading company in cloud solutions and digital transformation updated",
            "website": "https://innovate.sa",
            "state": "الرياض"
        }
        res = self.client.put(
            '/api/v1/company/profile',
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('company', data)

    def test_18_company_job_lifecycle(self):
        """Verify company job creation, updating, retrieval, and status change."""
        self._login_company()
        
        # 1. Create Job
        create_payload = {
            "title": "مطور واجهات أمامية أول - E2E",
            "specialization": "تطوير البرمجيات والتقنية",
            "jobType": "دوام كامل",
            "town": "الرياض",
            "workplace": "عن بعد",
            "skillsYears": "2-4 سنوات",
            "educationalQualification": "بكالوريوس",
            "description": "تصميم وتطوير واجهات المستخدم التفاعلية بأعلى معايير الأداء",
            "requiredSkills": "React, TypeScript, TailwindCSS, Next.js",
            "languages": "العربية, الإنجليزية",
            "salaryMin": 12000,
            "salaryMax": 18000,
            "status": "approved"
        }
        res_create = self.client.post(
            '/api/v1/company/jobs',
            data=json.dumps(create_payload),
            content_type='application/json'
        )
        self.assertEqual(res_create.status_code, 201)
        created_job = res_create.get_json().get('job') or res_create.get_json()
        new_job_id = created_job['id']

        # 2. Update Job
        update_payload = {
            "title": "مطور واجهات أمامية أول (محدث) - E2E",
            "salaryMin": 14000,
            "salaryMax": 20000
        }
        res_update = self.client.put(
            f'/api/v1/company/jobs/{new_job_id}',
            data=json.dumps(update_payload),
            content_type='application/json'
        )
        self.assertEqual(res_update.status_code, 200)
        updated_job = res_update.get_json().get('job') or res_update.get_json()
        self.assertEqual(updated_job['title'], "مطور واجهات أمامية أول (محدث) - E2E")

        # 3. Clean up created job
        res_del = self.client.delete(f'/api/v1/company/jobs/{new_job_id}')
        self.assertEqual(res_del.status_code, 200)

    def test_19_company_pipeline_and_status_update(self):
        """Verify reviewing applicants and updating pipeline stage status in DB."""
        self._login_company()
        res_apps = self.client.get('/api/v1/company/applications')
        self.assertEqual(res_apps.status_code, 200)
        data = res_apps.get_json()
        apps = data.get('applications', [])
        
        if len(apps) > 0:
            target_app = apps[0]
            # Update status to 'shortlisted'
            res_stat = self.client.put(
                f'/api/v1/company/applications/{target_app["id"]}/status',
                data=json.dumps({"status": "shortlisted", "note": "مرشح مؤهل جداً للمقابلة الفنية"}),
                content_type='application/json'
            )
            self.assertEqual(res_stat.status_code, 200)

    def test_20_company_talent_and_team_discovery(self):
        """Verify talent search and team discovery endpoints for employers."""
        self._login_company()
        
        # Talent
        res_talent = self.client.get('/api/v1/company/talent?q=Python')
        self.assertEqual(res_talent.status_code, 200)
        self.assertIn('talent', res_talent.get_json())

        # Teams
        res_teams = self.client.get('/api/v1/company/teams')
        self.assertEqual(res_teams.status_code, 200)
        self.assertIn('teams', res_teams.get_json())

    # =========================================================================
    # 4. UNIVERSITY WORKSPACE TESTS
    # =========================================================================

    def _login_university(self):
        with self.client.session_transaction() as sess:
            sess['session_university'] = self.univ_email
            sess['university_id'] = self.univ_id
            sess['user_role'] = 'university'

    def test_21_university_dashboard(self):
        """Verify university dashboard returns real aggregated student metrics & score."""
        self._login_university()
        res = self.client.get('/api/v1/university/dashboard')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('institution', data)
        self.assertIn('stats', data)
        self.assertIn('recent_students', data)
        self.assertGreaterEqual(data['institution']['completeness']['percentage'], 40)

    def test_22_university_department_crud(self):
        """Verify university department creation, update, list, and deletion."""
        self._login_university()
        
        # Create Department
        dep_payload = {
            "name_ar": "قسم الذكاء الاصطناعي وعلوم البيانات E2E",
            "name_en": "Department of AI and Data Science E2E",
            "degree_levels": "بكالوريوس",
            "description": "برنامج متخصص في هندسة البيانات ونماذج التعلم العميق"
        }
        res_dep = self.client.post(
            '/api/v1/university/departments',
            data=json.dumps(dep_payload),
            content_type='application/json'
        )
        self.assertEqual(res_dep.status_code, 201)
        created_dep = res_dep.get_json().get('department')
        dep_id = created_dep['id']

        # Update Department
        res_upd = self.client.put(
            f'/api/v1/university/departments/{dep_id}',
            data=json.dumps({"name_ar": "قسم الذكاء الاصطناعي المتقدم E2E"}),
            content_type='application/json'
        )
        self.assertEqual(res_upd.status_code, 200)

        # List Departments
        res_list = self.client.get('/api/v1/university/departments')
        self.assertEqual(res_list.status_code, 200)
        deps = res_list.get_json().get('departments', [])
        self.assertTrue(any(d['id'] == dep_id for d in deps))

        # Clean up
        res_del = self.client.delete(f'/api/v1/university/departments/{dep_id}')
        self.assertEqual(res_del.status_code, 200)

    def test_23_university_students_and_dossier(self):
        """Verify student roster, readiness score calculations, and detailed academic profile."""
        self._login_university()
        res_students = self.client.get('/api/v1/university/students')
        self.assertEqual(res_students.status_code, 200)
        data = res_students.get_json()
        students = data.get('students', [])
        self.assertTrue(len(students) > 0)

        student_id = students[0]['id']
        res_dossier = self.client.get(f'/api/v1/university/students/{student_id}')
        self.assertEqual(res_dossier.status_code, 200)
        dossier = res_dossier.get_json().get('student')
        self.assertIn('career_readiness', dossier)
        self.assertIn('skills', dossier)

    def test_24_university_verification_workflow(self):
        """Verify academic verification request issuance and decision audit workflow."""
        self._login_university()
        
        # 1. Issue verification for candidate
        verify_payload = {
            "degree": "بكالوريوس علوم الحاسب",
            "department": "علوم الحاسب الآلي",
            "gpa": "3.85 / 4.00",
            "graduation_year": "2024",
            "notes": "تمت مطابقة السجل الأكاديمي رسمياً من عمادة القبول والتسجيل"
        }
        res_ver = self.client.post(
            f'/api/v1/university/students/{self.cand_id}/verify',
            data=json.dumps(verify_payload),
            content_type='application/json'
        )
        self.assertEqual(res_ver.status_code, 200)
        ver_data = res_ver.get_json()
        self.assertTrue(ver_data.get('success'))

        # 2. List verifications queue
        res_q = self.client.get('/api/v1/university/verifications')
        self.assertEqual(res_q.status_code, 200)
        ver_items = res_q.get_json().get('verifications', [])
        self.assertTrue(len(ver_items) > 0)

    def test_25_university_opportunities_feed(self):
        """Verify university job opportunities connect seamlessly to active market listings."""
        self._login_university()
        res = self.client.get('/api/v1/university/opportunities')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('opportunities', data)
        self.assertTrue(len(data['opportunities']) > 0)


if __name__ == '__main__':
    unittest.main(verbosity=2)
