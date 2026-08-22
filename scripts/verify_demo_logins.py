import requests
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

accounts = [
    ("Candidate 1 (Ahmed - Complete)", "ahmed.mansoor@faeda.demo", "FaedaDemo123!", "candidate", "/candidate/profile"),
    ("Candidate 2 (Sarah - Incomplete)", "sarah.otaibi@faeda.demo", "FaedaDemo123!", "candidate", "/candidate/profile"),
    ("Candidate 3 (Tariq - AI)", "tariq.zahrani@faeda.demo", "FaedaDemo123!", "candidate", "/candidate/profile"),
    ("Candidate 4 (Reem - Frontend)", "reem.ghamdi@faeda.demo", "FaedaDemo123!", "candidate", "/candidate/profile"),
    ("Candidate 5 (Faisal - Data)", "faisal.harbi@faeda.demo", "FaedaDemo123!", "candidate", "/candidate/profile"),
    ("Candidate 6 (Lina - Mobile)", "lina.dosari@faeda.demo", "FaedaDemo123!", "candidate", "/candidate/profile"),
    ("Candidate 7 (Khaled - PM)", "khaled.shehri@faeda.demo", "FaedaDemo123!", "candidate", "/candidate/profile"),
    ("Candidate 8 (Noura - Student)", "noura.husseini@faeda.demo", "FaedaDemo123!", "candidate", "/candidate/profile"),
    ("Company 1 (CloudScale)", "cloudscale@faeda.demo", "FaedaDemo123!", "company", "/company"),
    ("Company 2 (DeepVision AI)", "deepvision@faeda.demo", "FaedaDemo123!", "company", "/company"),
    ("Company 3 (FinTech Oasis)", "fintechoasis@faeda.demo", "FaedaDemo123!", "company", "/company"),
    ("Company 4 (NextGen Studio)", "nextgen@faeda.demo", "FaedaDemo123!", "company", "/company"),
    ("University 1 (KSU)", "ksu@faeda.demo", "FaedaDemo123!", "university", "/university"),
    ("University 2 (KFUPM)", "kfupm@faeda.demo", "FaedaDemo123!", "university", "/university")
]

print("==================================================")
print("🔑 VERIFYING DEMO ACCOUNTS LOGIN FLOW (14 Accounts)")
print("==================================================")

all_passed = True
for label, email, pwd, exp_role, exp_redirect in accounts:
    sess = requests.Session()
    res = sess.post(
        "http://127.0.0.1:5000/login",
        json={"email": email, "password": pwd},
        headers={"Accept": "application/json"}
    )
    if res.status_code == 200:
        data = res.json()
        role = data.get("role")
        redirect = data.get("redirect_url")
        assert role == exp_role, f"Expected role {exp_role}, got {role}"
        assert redirect == exp_redirect, f"Expected redirect {exp_redirect}, got {redirect}"
        
        # Test /api/v1/auth/me
        me_res = sess.get("http://127.0.0.1:5000/api/v1/auth/me")
        assert me_res.status_code == 200
        me_data = me_res.json()
        assert me_data.get("authenticated") is True
        print(f"✅ {label:35} | Role: {role:12} | Redirect: {redirect:18} | OK")
    else:
        all_passed = False
        print(f"❌ {label:35} | FAILED ({res.status_code}): {res.text}")

print("==================================================")
if all_passed:
    print("🎉 ALL 14 DEMO ACCOUNTS LOGGED IN & VERIFIED 100%!")
else:
    print("❌ SOME LOGINS FAILED")
print("==================================================")
