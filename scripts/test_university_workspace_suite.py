#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
test_university_workspace_suite.py — Automated test suite for Section 6 (University Workspace).
Tests authentication, profile, dashboard metrics, student directory, academic verification, departments, and multi-tenant isolation.
"""
import os
import sys
import unittest
import json
from datetime import datetime

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import create_app, db
from services.university import University, UniversityDepartment, AcademicVerification
from services.customer import Customers, CustomerProject
from services.skills import Skills
from services.job import Jobs
from services.company import Company


class TestUniversityWorkspaceSuite(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.app.config['TESTING'] = True
        cls.app.config['WTF_CSRF_ENABLED'] = False
        cls.client = cls.app.test_client()

        with cls.app.app_context():
            db.create_all()

            # Ensure KSU University exists
            cls.ksu = University.query.filter_by(email="test_ksu@ksu.edu.sa").first()
            if not cls.ksu:
                cls.ksu = University(
                    name_ar="جامعة الملك سعود للعلوم",
                    name_en="King Saud University of Science",
                    email="test_ksu@ksu.edu.sa",
                    password="ksu_secure_pass_123",
                    description_ar="جامعة رائدة تسعى إلى الريادة العالمية والتميز الأكاديمي.",
                    location="الرياض",
                    country="المملكة العربية السعودية",
                    website="https://ksu.edu.sa",
                    institution_type="جامعة حكومية",
                    qs_rank="#203 عالمياً",
                    dean_name="د. محمد التميمي",
                    career_center_email="careers@ksu.edu.sa",
                    is_verified=True
                )
                db.session.add(cls.ksu)
                db.session.commit()

            # Ensure KFUPM University exists for isolation tests
            cls.kfupm = University.query.filter_by(email="test_kfupm@kfupm.edu.sa").first()
            if not cls.kfupm:
                cls.kfupm = University(
                    name_ar="جامعة الملك فهد للبترول",
                    name_en="King Fahd University Test",
                    email="test_kfupm@kfupm.edu.sa",
                    password="kfupm_secure_pass_123",
                    description_ar="صرح تعليمي وهندسي رائد.",
                    location="الظهران",
                    is_verified=True
                )
                db.session.add(cls.kfupm)
                db.session.commit()

            # Ensure a connected student candidate exists
            cls.cand = Customers.query.filter_by(email="ksu_student_test@example.com").first()
            if not cls.cand:
                cls.cand = Customers(
                    fullname="طارق محمد الدوسري",
                    email="ksu_student_test@example.com",
                    mobile="+966551234567",
                    password="cand_password_123",
                    educational_qualification="بكالوريوس",
                    university="جامعة الملك سعود للعلوم",
                    department_university="علوم الحاسب",
                    graduation_date=datetime(2024, 6, 1).date(),
                    education_statue="خريج",
                    gpa="4.90 / 5.0",
                    years_of_skills="2",
                    preferred_field_of_work="تطوير البرمجيات",
                    work_type="دوام كامل",
                    activated=True
                )
                cls.cand.user_id = "KSU_STUDENT_001"
                db.session.add(cls.cand)
                db.session.commit()

                # Add a skill and project
                sk = Skills(customer_id=cls.cand.id, skill_name="Python & Machine Learning")
                proj = CustomerProject(
                    customer_id=cls.cand.id,
                    project_name="نظام الفرز الأكاديمي الذكي",
                    project_size="كبير",
                    description="مشروع تخرج يعتمد على معالجة اللغات الطبيعية والتعلم الآلي.",
                    project_url="https://github.com/ksu-student/smart-grad"
                )
                db.session.add(sk)
                db.session.add(proj)
                db.session.commit()

            cls.cand_id = cls.cand.id

    def test_01_unauthenticated_guards(self):
        """Unauthenticated requests must be rejected with 401 Unauthorized."""
        endpoints = [
            ('/api/v1/university/me', 'GET'),
            ('/api/v1/university/profile', 'GET'),
            ('/api/v1/university/dashboard', 'GET'),
            ('/api/v1/university/students', 'GET'),
            ('/api/v1/university/verifications', 'GET'),
            ('/api/v1/university/departments', 'GET'),
            ('/api/v1/university/opportunities', 'GET'),
        ]

        for url, method in endpoints:
            with self.subTest(url=url):
                res = self.client.open(url, method=method)
                self.assertEqual(res.status_code, 401, f"{url} should return 401 when unauthenticated")
                data = res.get_json()
                self.assertIn("error", data)

    def test_02_university_auth_and_profile_flow(self):
        """University login, auth identity, profile retrieval, completeness score, and profile update."""
        # 1. Login with University credentials
        login_res = self.client.post('/login', json={
            "email": "test_ksu@ksu.edu.sa",
            "password": "ksu_secure_pass_123"
        })
        self.assertEqual(login_res.status_code, 200)
        login_data = login_res.get_json()
        self.assertTrue(login_data.get("success"))
        self.assertEqual(login_data.get("role"), "university")
        self.assertEqual(login_data["user"]["name"], "جامعة الملك سعود للعلوم")

        # 2. Verify /api/v1/auth/me
        me_res = self.client.get('/api/v1/auth/me')
        self.assertEqual(me_res.status_code, 200)
        me_data = me_res.get_json()
        self.assertTrue(me_data.get("authenticated"))
        self.assertEqual(me_data.get("role"), "university")

        # 3. Verify /api/v1/university/me
        uni_me_res = self.client.get('/api/v1/university/me')
        self.assertEqual(uni_me_res.status_code, 200)
        uni_me_data = uni_me_res.get_json()
        self.assertTrue(uni_me_data.get("authenticated"))
        self.assertIn("institution", uni_me_data)
        self.assertEqual(uni_me_data["institution"]["email"], "test_ksu@ksu.edu.sa")

        # 4. Get Profile with completeness
        prof_res = self.client.get('/api/v1/university/profile')
        self.assertEqual(prof_res.status_code, 200)
        prof_data = prof_res.get_json()
        self.assertTrue(prof_data.get("success"))
        comp = prof_data["profile"]["completeness"]
        self.assertGreaterEqual(comp["percentage"], 50)
        self.assertEqual(comp["total_factors"], 8)

        # 5. Update Profile
        upd_res = self.client.put('/api/v1/university/profile', json={
            "description_ar": "جامعة بحثية وطنية رائدة متخصصة في الذكاء الاصطناعي وعلوم المستقبل.",
            "location": "الرياض - الدرعية",
            "website": "https://ksu.edu.sa/portal"
        })
        self.assertEqual(upd_res.status_code, 200)
        upd_data = upd_res.get_json()
        self.assertTrue(upd_data.get("success"))
        self.assertEqual(upd_data["profile"]["location"], "الرياض - الدرعية")
        self.assertIn("الدرعية", upd_data["profile"]["location"])

    def test_03_dashboard_and_departments(self):
        """Dashboard aggregation metrics and department CRUD operations."""
        # Ensure session is active for KSU
        self.client.post('/login', json={
            "email": "test_ksu@ksu.edu.sa",
            "password": "ksu_secure_pass_123"
        })

        # 1. Dashboard metrics
        dash_res = self.client.get('/api/v1/university/dashboard')
        self.assertEqual(dash_res.status_code, 200)
        dash_data = dash_res.get_json()
        self.assertTrue(dash_data.get("success"))
        stats = dash_data["stats"]
        self.assertIn("total_students", stats)
        self.assertIn("graduates_count", stats)
        self.assertIn("verified_count", stats)
        self.assertIn("departments_count", stats)
        self.assertGreaterEqual(stats["total_students"], 1)

        # 2. Add Department
        dept_res = self.client.post('/api/v1/university/departments', json={
            "name_ar": "قسم هندسة الذكاء الاصطناعي",
            "name_en": "Department of AI Engineering",
            "faculty": "كلية علوم الحاسب",
            "degree_levels": "بكالوريوس, ماجستير",
            "description": "تخصص متقدم في خوارزميات التعلم العميق وهندسة البيانات."
        })
        self.assertEqual(dept_res.status_code, 201)
        dept_data = dept_res.get_json()
        dept_id = dept_data["department"]["id"]
        self.assertEqual(dept_data["department"]["name_ar"], "قسم هندسة الذكاء الاصطناعي")

        # 3. List Departments
        list_dept_res = self.client.get('/api/v1/university/departments')
        self.assertEqual(list_dept_res.status_code, 200)
        list_dept_data = list_dept_res.get_json()
        self.assertTrue(any(d["id"] == dept_id for d in list_dept_data["departments"]))

        # 4. Update Department
        edit_res = self.client.put(f'/api/v1/university/departments/{dept_id}', json={
            "name_ar": "قسم هندسة الذكاء الاصطناعي والروبوتات",
            "degree_levels": "بكالوريوس, ماجستير, دكتوراه"
        })
        self.assertEqual(edit_res.status_code, 200)

        # 5. Delete Department
        del_res = self.client.delete(f'/api/v1/university/departments/{dept_id}')
        self.assertEqual(del_res.status_code, 200)

    def test_04_students_directory_and_detail_and_privacy(self):
        """Student listing, filtering, deep dossier, and strict privacy protection."""
        self.client.post('/login', json={
            "email": "test_ksu@ksu.edu.sa",
            "password": "ksu_secure_pass_123"
        })

        # 1. List students
        st_res = self.client.get('/api/v1/university/students?q=طارق')
        self.assertEqual(st_res.status_code, 200)
        st_data = st_res.get_json()
        self.assertTrue(st_data.get("success"))
        self.assertGreaterEqual(len(st_data["students"]), 1)
        st = st_data["students"][0]
        self.assertEqual(st["fullname"], "طارق محمد الدوسري")
        self.assertEqual(st["department"], "علوم الحاسب")

        # 2. Get student detail
        detail_res = self.client.get(f'/api/v1/university/students/{self.cand_id}')
        self.assertEqual(detail_res.status_code, 200)
        detail_data = detail_res.get_json()
        student = detail_data["student"]

        self.assertEqual(student["fullname"], "طارق محمد الدوسري")
        self.assertEqual(student["academic_profile"]["degree"], "بكالوريوس")
        self.assertEqual(student["academic_profile"]["department"], "علوم الحاسب")
        self.assertGreaterEqual(len(student["projects"]), 1)
        self.assertEqual(student["projects"][0]["project_name"], "نظام الفرز الأكاديمي الذكي")
        self.assertIn("market_benchmark", student)
        self.assertIn("score", student["market_benchmark"])

        # 3. Privacy check: Ensure password, token, or private emails are never exposed
        raw_json_str = detail_res.get_data(as_text=True)
        self.assertNotIn("cand_password_123", raw_json_str)
        self.assertNotIn("token", raw_json_str)

    def test_05_academic_verification_workflow_and_multi_tenant_isolation(self):
        """Official verification creation, digital code issuance, and cross-university isolation."""
        # 1. KSU verifies the candidate
        self.client.post('/login', json={
            "email": "test_ksu@ksu.edu.sa",
            "password": "ksu_secure_pass_123"
        })

        verif_post_res = self.client.post(f'/api/v1/university/students/{self.cand_id}/verify', json={
            "degree": "بكالوريوس",
            "department": "علوم الحاسب",
            "graduation_year": "2024",
            "gpa": "4.90 / 5.0",
            "notes": "تم التحقق الرسمي من السجل الأكاديمي وشهادة التخرج."
        })
        self.assertEqual(verif_post_res.status_code, 200)
        verif_data = verif_post_res.get_json()
        self.assertTrue(verif_data.get("success"))
        code = verif_data.get("verification_code")
        self.assertTrue(code and code.startswith("FAEDA-VERIF-"))

        # 2. Get verifications queue
        q_res = self.client.get('/api/v1/university/verifications')
        self.assertEqual(q_res.status_code, 200)
        q_data = q_res.get_json()
        verif_item = next((v for v in q_data["verifications"] if v["customer_id"] == self.cand_id), None)
        self.assertIsNotNone(verif_item)
        self.assertEqual(verif_item["status"], "verified")
        verif_id = verif_item["id"]

        # 3. Multi-tenant Isolation: Login as KFUPM
        self.client.post('/login', json={
            "email": "test_kfupm@kfupm.edu.sa",
            "password": "kfupm_secure_pass_123"
        })

        # KFUPM cannot update KSU's verification request (must return 404)
        tamper_res = self.client.put(f'/api/v1/university/verifications/{verif_id}', json={
            "status": "rejected"
        })
        self.assertEqual(tamper_res.status_code, 404, "Cross-university verification modification must return 404")

        # KFUPM cannot access student belonging solely to KSU
        cross_student_res = self.client.get(f'/api/v1/university/students/{self.cand_id}')
        self.assertEqual(cross_student_res.status_code, 403, "Cross-university student access must return 403")


if __name__ == '__main__':
    unittest.main()
