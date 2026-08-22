"""
test_candidate_api_suite.py — Isolated automated test suite for Candidate Workspace API v1.
Creates an isolated test account and cleans it up after testing.
"""
import requests
import json
import io
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(os.path.dirname(__file__))))
sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://127.0.0.1:5000"
TEST_EMAIL = "test_candidate_isolated@faeda.jobs"
TEST_PASSWORD = "TestPassword123!"

def setup_test_candidate():
    """Ensure clean isolated test candidate exists."""
    from app import create_app, db
    from services.customer import Customers, CustomerProject, CustomerCertification
    from services.skills import Skills

    app = create_app()
    with app.app_context():
        u = Customers.query.filter_by(email=TEST_EMAIL).first()
        if u:
            CustomerProject.query.filter_by(customer_id=u.id).delete()
            CustomerCertification.query.filter_by(customer_id=u.id).delete()
            Skills.query.filter_by(customer_id=u.id).delete()
            db.session.delete(u)
            db.session.commit()

        new_user = Customers(
            fullname="مرشح تجريبي معزول",
            email=TEST_EMAIL,
            password=TEST_PASSWORD,
            mobile="0599999999",
            user_id="TEST_CAND_01",
            country="المملكة العربية السعودية",
            visibility="employers_only",
            activated=True
        )
        db.session.add(new_user)
        db.session.commit()
        print(f"[SETUP] Created isolated test user: {new_user.email} (ID: {new_user.id})")

def cleanup_test_candidate():
    """Remove isolated test candidate after testing."""
    from app import create_app, db
    from services.customer import Customers, CustomerProject, CustomerCertification
    from services.skills import Skills

    app = create_app()
    with app.app_context():
        u = Customers.query.filter_by(email=TEST_EMAIL).first()
        if u:
            CustomerProject.query.filter_by(customer_id=u.id).delete()
            CustomerCertification.query.filter_by(customer_id=u.id).delete()
            Skills.query.filter_by(customer_id=u.id).delete()
            db.session.delete(u)
            db.session.commit()
            print("[CLEANUP] Deleted isolated test candidate and test records.")

def run_tests():
    setup_test_candidate()
    session = requests.Session()
    print("==================================================")
    print("FAEDA JOBS — ISOLATED CANDIDATE API V1 TEST SUITE")
    print("==================================================")

    try:
        # 1. Test Login as Candidate (JSON POST)
        print("\n[1] Testing Candidate Login (JSON POST)...")
        login_res = session.post(
            f"{BASE_URL}/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD},
            headers={"Accept": "application/json"}
        )
        print(f"Login Response Status: {login_res.status_code}")
        login_data = login_res.json()
        print(f"Login Data: {json.dumps(login_data, ensure_ascii=False)}")
        assert login_res.status_code == 200
        assert login_data.get("success") is True
        assert login_data.get("role") == "candidate"

        # 2. Test /api/v1/auth/me
        print("\n[2] Testing GET /api/v1/auth/me...")
        me_res = session.get(f"{BASE_URL}/api/v1/auth/me")
        print(f"Auth Me Status: {me_res.status_code}")
        me_data = me_res.json()
        print(f"Auth Me Data: {json.dumps(me_data, ensure_ascii=False)}")
        assert me_data.get("authenticated") is True
        assert me_data.get("role") == "candidate"

        # 3. Test GET /api/v1/candidate/profile
        print("\n[3] Testing GET /api/v1/candidate/profile...")
        profile_res = session.get(f"{BASE_URL}/api/v1/candidate/profile")
        print(f"Profile Status: {profile_res.status_code}")
        profile = profile_res.json()
        print(f"Fullname: {profile.get('fullname')}, Email: {profile.get('email')}, Visibility: {profile.get('visibility')}")
        print(f"Initial Completion percentage: {profile.get('completion', {}).get('percentage')}%")
        assert profile_res.status_code == 200
        assert profile.get("completion", {}).get("percentage") == 15

        # 4. Test PUT /api/v1/candidate/profile/identity
        print("\n[4] Testing PUT /api/v1/candidate/profile/identity...")
        identity_res = session.put(
            f"{BASE_URL}/api/v1/candidate/profile/identity",
            json={
                "fullname": "مرشح تجريبي معزول محدث",
                "about": "مهندس برمجيات ومطور واجهات أمامية بخبرة عملية في React وTypeScript وPython في السوق السعودي.",
                "mobile": "0501234567",
                "government": "الرياض",
                "country": "المملكة العربية السعودية",
                "sex": "ذكر"
            }
        )
        print(f"Identity Status: {identity_res.status_code}")
        updated_profile = identity_res.json()
        print(f"Updated Name: {updated_profile.get('fullname')}, About: {updated_profile.get('about')[:40]}...")
        assert identity_res.status_code == 200
        assert updated_profile.get("fullname") == "مرشح تجريبي معزول محدث"

        # 5. Test PUT /api/v1/candidate/profile/skills
        print("\n[5] Testing PUT /api/v1/candidate/profile/skills...")
        test_skills = ["React", "TypeScript", "Python", "Flask", "Docker", "SQL", "Tailwind CSS"]
        skills_res = session.put(
            f"{BASE_URL}/api/v1/candidate/profile/skills",
            json={"skills": test_skills}
        )
        print(f"Skills Status: {skills_res.status_code}")
        updated_profile = skills_res.json()
        print(f"Saved Skills: {updated_profile.get('skills')}")
        assert skills_res.status_code == 200
        assert "React" in updated_profile.get("skills", [])

        # 6. Test PUT /api/v1/candidate/profile/experience
        print("\n[6] Testing PUT /api/v1/candidate/profile/experience...")
        exp_res = session.put(
            f"{BASE_URL}/api/v1/candidate/profile/experience",
            json={
                "years_of_skills": "4 سنوات",
                "preferred_field_of_work": "تطوير البرمجيات وهندسة الواجهات"
            }
        )
        print(f"Experience Status: {exp_res.status_code}")
        updated_profile = exp_res.json()
        print(f"Years: {updated_profile.get('years_of_skills')}, Field: {updated_profile.get('preferred_field_of_work')}")
        assert exp_res.status_code == 200

        # 7. Test PUT /api/v1/candidate/profile/education
        print("\n[7] Testing PUT /api/v1/candidate/profile/education...")
        edu_res = session.put(
            f"{BASE_URL}/api/v1/candidate/profile/education",
            json={
                "educational_qualification": "بكالوريوس",
                "university": "جامعة الملك فهد للبترول والمعادن",
                "department_university": "علوم الحاسب الآلي",
                "graduation_date": "2023-06-15",
                "gpa": "3.85 / 4.0",
                "education_statue": "خريج"
            }
        )
        print(f"Education Status: {edu_res.status_code}")
        updated_profile = edu_res.json()
        print(f"Degree: {updated_profile.get('educational_qualification')}, Uni: {updated_profile.get('university')}")
        assert edu_res.status_code == 200

        # 8. Test POST & DELETE /api/v1/candidate/profile/projects
        print("\n[8] Testing POST /api/v1/candidate/profile/projects...")
        proj_res = session.post(
            f"{BASE_URL}/api/v1/candidate/profile/projects",
            json={
                "project_name": "منصة التوظيف الذكية (فائدة)",
                "description": "تطوير منظومة مساحة المرشح بنظام ATS.",
                "project_url": "https://github.com/faeda-jobs/candidate-workspace"
            }
        )
        print(f"Project Create Status: {proj_res.status_code}")
        updated_profile = proj_res.json()
        projects = updated_profile.get("projects", [])
        assert proj_res.status_code == 200
        assert len(projects) == 1
        proj_id = projects[0]["id"]

        # Delete project test
        print(f"\n[8b] Testing DELETE /api/v1/candidate/profile/projects/{proj_id}...")
        del_proj_res = session.delete(f"{BASE_URL}/api/v1/candidate/profile/projects/{proj_id}")
        assert del_proj_res.status_code == 200
        assert len(del_proj_res.json().get("projects", [])) == 0
        print("Project deleted cleanly.")

        # 9. Test POST & DELETE /api/v1/candidate/profile/certifications
        print("\n[9] Testing POST /api/v1/candidate/profile/certifications...")
        cert_res = session.post(
            f"{BASE_URL}/api/v1/candidate/profile/certifications",
            json={
                "cert_name": "AWS Certified Solutions Architect",
                "issuing_org": "Amazon Web Services",
                "issue_month": 3,
                "issue_year": 2025,
                "no_expiry": True,
                "credential_id": "AWS-SA-2025-9988",
                "credential_url": "https://aws.amazon.com/verify"
            }
        )
        print(f"Cert Create Status: {cert_res.status_code}")
        updated_profile = cert_res.json()
        certs = updated_profile.get("certifications", [])
        assert cert_res.status_code == 200
        assert len(certs) == 1
        cert_id = certs[0]["id"]

        # Delete cert test
        print(f"\n[9b] Testing DELETE /api/v1/candidate/profile/certifications/{cert_id}...")
        del_cert_res = session.delete(f"{BASE_URL}/api/v1/candidate/profile/certifications/{cert_id}")
        assert del_cert_res.status_code == 200
        assert len(del_cert_res.json().get("certifications", [])) == 0
        print("Certification deleted cleanly.")

        # 10. Test PUT /api/v1/candidate/profile/preferences
        print("\n[10] Testing PUT /api/v1/candidate/profile/preferences...")
        pref_res = session.put(
            f"{BASE_URL}/api/v1/candidate/profile/preferences",
            json={
                "preferred_field_of_work": "تطوير البرمجيات",
                "work_type": "دوام كامل",
                "work_style": "مرن",
                "expected_salary": 18500,
                "government": "الرياض"
            }
        )
        print(f"Preferences Status: {pref_res.status_code}")
        assert pref_res.status_code == 200

        # 11. Test PUT /api/v1/candidate/profile/visibility
        print("\n[11] Testing PUT /api/v1/candidate/profile/visibility...")
        vis_res = session.put(
            f"{BASE_URL}/api/v1/candidate/profile/visibility",
            json={"visibility": "public"}
        )
        print(f"Visibility Status: {vis_res.status_code}")
        assert vis_res.status_code == 200
        assert vis_res.json().get("visibility") == "public"

        # 12. Test Logout
        print("\n[12] Testing Logout...")
        logout_res = session.post(f"{BASE_URL}/logout", headers={"Accept": "application/json"})
        print(f"Logout Status: {logout_res.status_code}")
        assert logout_res.status_code == 200

        # Verify session is cleared
        check_after_logout = session.get(f"{BASE_URL}/api/v1/auth/me")
        print(f"Auth Me after logout: {check_after_logout.json()}")
        assert check_after_logout.json().get("authenticated") is False

        print("\n==================================================")
        print("ALL ISOLATED TESTS PASSED 100% WITHOUT TOUCHING USER DATA!")
        print("==================================================")
    finally:
        cleanup_test_candidate()

if __name__ == "__main__":
    run_tests()
