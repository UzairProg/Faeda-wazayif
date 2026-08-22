import os
import sys
import traceback

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import create_app, db
from services.university import University

app = create_app()
app.config['TESTING'] = True

with app.app_context():
    client = app.test_client()
    login_res = client.post('/login', json={
        "email": "test_ksu@ksu.edu.sa",
        "password": "ksu_secure_pass_123"
    })
    print("Login:", login_res.status_code)
    try:
        dash_res = client.get('/api/v1/university/dashboard')
        print("Dashboard status:", dash_res.status_code)
        if dash_res.status_code != 200:
            print("Dashboard response:", dash_res.get_json())
    except Exception as e:
        print("Exception:", e)
        traceback.print_exc()
