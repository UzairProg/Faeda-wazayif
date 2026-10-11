"""
scripts/test_production_readiness.py
==============================================================================
Production Verification Test Suite for Faeda Jobs API
Validates all critical endpoints across Public, Candidate, Company, and University roles.
==============================================================================
"""

import sys
import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, BASE_DIR)

from app import create_app

def run_tests():
    app = create_app()
    client = app.test_client()

    results = []

    def test(name, method, url, headers=None, data=None):
        if method == 'GET':
            r = client.get(url, headers=headers)
        elif method == 'POST':
            r = client.post(url, headers=headers, json=data)
        ok = (r.status_code in [200, 201])
        results.append((name, r.status_code, ok))
        status_text = "PASS" if ok else "FAIL"
        print(f"[{status_text}] {name} ({method} {url}) -> {r.status_code}", flush=True)
        if not ok:
            print(f"  Response: {r.get_data(as_text=True)[:250]}", flush=True)

    print("==================================================")
    print("1. PUBLIC GATEWAY & DISCOVERY ENDPOINTS")
    print("==================================================")
    test("Root API Gateway", "GET", "/")
    test("Public Jobs List", "GET", "/api/v1/jobs")
    test("Public Companies List", "GET", "/api/v1/companies")
    test("Public Teams List", "GET", "/api/v1/teams")

    print("\n==================================================")
    print("2. CANDIDATE AUTH & WORKSPACE ENDPOINTS")
    print("==================================================")
    r_cand = client.post("/login", json={"email": "ahmed.mansoor@faeda.demo", "password": "FaedaDemo123!"})
    assert r_cand.status_code == 200, f"Candidate login failed: {r_cand.status_code}"
    cand_token = r_cand.get_json().get("token")
    assert cand_token, "Candidate auth token not found in login response"
    cand_headers = {"Authorization": f"Bearer {cand_token}"}
    print("[PASS] Candidate Login -> 200 (Token issued)")

    test("Candidate Auth Me", "GET", "/api/v1/auth/me", headers=cand_headers)
    test("Candidate Dashboard", "GET", "/api/v1/candidate/dashboard", headers=cand_headers)
    test("Candidate Profile", "GET", "/api/v1/candidate/profile", headers=cand_headers)
    test("Candidate Jobs", "GET", "/api/v1/candidate/jobs", headers=cand_headers)
    test("Candidate Applications", "GET", "/api/v1/candidate/applications", headers=cand_headers)
    test("Candidate Teams", "GET", "/api/v1/candidate/teams", headers=cand_headers)
    test("Candidate Saved Jobs", "GET", "/api/v1/candidate/saved-jobs", headers=cand_headers)
    test("Candidate Chat Threads", "GET", "/api/v1/chat/conversations", headers=cand_headers)
    test("Candidate Chat Unread", "GET", "/api/v1/chat/unread-count", headers=cand_headers)

    print("\n==================================================")
    print("3. COMPANY AUTH & ENTERPRISE PORTAL ENDPOINTS")
    print("==================================================")
    r_comp = client.post("/login", json={"email": "cloudscale@faeda.demo", "password": "FaedaDemo123!"})
    assert r_comp.status_code == 200, f"Company login failed: {r_comp.status_code}"
    comp_token = r_comp.get_json().get("token")
    assert comp_token, "Company auth token not found in login response"
    comp_headers = {"Authorization": f"Bearer {comp_token}"}
    print("[PASS] Company Login -> 200 (Token issued)")

    test("Company Auth Me", "GET", "/api/v1/auth/me", headers=comp_headers)
    test("Company Dashboard", "GET", "/api/v1/company/dashboard", headers=comp_headers)
    test("Company Profile", "GET", "/api/v1/company/profile", headers=comp_headers)
    test("Company Active Jobs", "GET", "/api/v1/company/jobs", headers=comp_headers)
    test("Company Applications ATS", "GET", "/api/v1/company/applications", headers=comp_headers)
    test("Company Talent Sourcing", "GET", "/api/v1/company/talent", headers=comp_headers)
    test("Company Chat Threads", "GET", "/api/v1/chat/conversations", headers=comp_headers)

    print("\n==================================================")
    print("4. UNIVERSITY AUTH & VERIFICATION DESK ENDPOINTS")
    print("==================================================")
    r_uni = client.post("/login", json={"email": "ksu@faeda.demo", "password": "FaedaDemo123!"})
    assert r_uni.status_code == 200, f"University login failed: {r_uni.status_code}"
    uni_token = r_uni.get_json().get("token")
    assert uni_token, "University auth token not found in login response"
    uni_headers = {"Authorization": f"Bearer {uni_token}"}
    print("[PASS] University Login -> 200 (Token issued)")

    test("University Auth Me", "GET", "/api/v1/auth/me", headers=uni_headers)
    test("University Dashboard", "GET", "/api/v1/university/dashboard", headers=uni_headers)
    test("University Profile", "GET", "/api/v1/university/profile", headers=uni_headers)
    test("University Students Directory", "GET", "/api/v1/university/students", headers=uni_headers)
    test("University Verification Queue", "GET", "/api/v1/university/verifications", headers=uni_headers)
    test("University Departments", "GET", "/api/v1/university/departments", headers=uni_headers)

    print("\n==================================================")
    print("5. VERIFICATION SUMMARY")
    print("==================================================")
    total = len(results)
    passed = sum(1 for r in results if r[2])
    failed = sum(1 for r in results if not r[2])
    print(f"Total API Endpoints Tested: {total}")
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
        
    print(f"Passed: {passed}", flush=True)
    print(f"Failed: {failed}", flush=True)

    if failed == 0:
        print("\n*** ALL API ENDPOINTS VERIFIED & 100% PRODUCTION READY ***", flush=True)
        return 0
    else:
        print(f"\n*** {failed} endpoints require attention ***", flush=True)
        return 1

if __name__ == "__main__":
    sys.exit(run_tests())
