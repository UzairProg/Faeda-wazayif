"""
scripts/update_demo_names.py
==============================================================================
Updates demo accounts from 'ahmed' to 'uzair' (Uzair Mohammad)
and one to 'ali' (Ali Al-Zahrani).
==============================================================================
"""

import sys
import os

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, BASE_DIR)

from app import create_app, db
from services.customer import Customers

def update_names():
    app = create_app()
    with app.app_context():
        # 1. Update Candidate 1 (Ahmed -> Uzair Mohammad)
        c1 = Customers.query.filter(
            (Customers.email == 'ahmed.mansoor@faeda.demo') | 
            (Customers.email == 'uzair.mohammad@faeda.demo') |
            (Customers.user_id == 'DEMO_CAND_01')
        ).first()

        if c1:
            c1.email = 'uzair.mohammad@faeda.demo'
            c1.fullname = 'عزير محمد'
            c1.about = 'مهندس برمجيات أول وحلول سحابية بخبرة تتجاوز 5 سنوات في بناء المنصات الموزعة وتطوير واجهات React وخدمات الباك إند السحابية الموثوقة.'
            print(f"[OK] Candidate 1 updated: ID={c1.id}, Email={c1.email}, Name={c1.fullname}")
        else:
            print("[WARN] Candidate 1 not found by email or user_id")

        # 2. Update Candidate 3 (Tariq -> Ali Al-Zahrani)
        c3 = Customers.query.filter(
            (Customers.email == 'tariq.zahrani@faeda.demo') |
            (Customers.email == 'ali.zahrani@faeda.demo') |
            (Customers.user_id == 'DEMO_CAND_03')
        ).first()

        if c3:
            c3.email = 'ali.zahrani@faeda.demo'
            c3.fullname = 'علي الزهراني'
            print(f"[OK] Candidate 3 updated: ID={c3.id}, Email={c3.email}, Name={c3.fullname}")
        else:
            print("[WARN] Candidate 3 not found by email or user_id")

        db.session.commit()
        print("\n*** Database committed successfully! ***")

if __name__ == '__main__':
    update_names()
