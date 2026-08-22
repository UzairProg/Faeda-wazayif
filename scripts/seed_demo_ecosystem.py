"""
scripts/seed_demo_ecosystem.py
==============================================================================
FAEDA JOBS — COMPREHENSIVE MULTI-ROLE DEMO ECOSYSTEM SEED SCRIPT
==============================================================================
Populates a realistic, rich, interconnected demonstration database containing:
- 1 Super Admin
- 8 Diverse Candidates (100% complete, Incomplete/Onboarding, AI/ML, Frontend, Data, Mobile, PM, Student)
- 4 Verified Saudi Companies across industries (CloudScale, DeepVision AI, FinTech Oasis, NextGen Studio)
- 2 Premier Saudi Universities (King Saud University, King Fahd University of Petroleum & Minerals)
- 6 University Departments + Official Student Academic Verifications (Verified, Pending)
- 12 Active & Detailed Job Postings across domains and experience levels
- Multiple Job Applications in realistic pipeline states (Applied, Reviewing, Shortlisted, Interview, Offered, Rejected)
- Saved Job Bookmarks
- 3 Specialized Professional Squads with capability matrices & team invitations
- Professional Chat Threads (Candidate-Company, Company-Squad, Internal Squad) with messages & unread counters

Standard Demo Password for ALL seeded accounts: FaedaDemo123!
==============================================================================
"""

import os
import sys
from datetime import datetime, timedelta

# Ensure UTF-8 output on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Ensure project root is in sys.path
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, BASE_DIR)

from app import create_app, db
from services.customer import Customers, CustomerProject, CustomerCertification, CustomerProfileHistory, customer_jobs, customer_saved_jobs
from services.company import Company
from services.university import University, UniversityDepartment, AcademicVerification
from services.job import Jobs
from services.skills import Skills
from services.teams import Teams, team_members_association, TeamInvitation
from services.chat import Conversation, ConversationParticipant, ChatMessage
from services.admin import Admin

DEMO_PASSWORD = "FaedaDemo123!"

def seed_database():
    app = create_app()
    with app.app_context():
        print("==================================================")
        print("🌱 SEEDING FAEDA JOBS REALISTIC DEMO ECOSYSTEM...")
        print("==================================================")

        # ---------------------------------------------------------------------
        # 1. SUPER ADMIN
        # ---------------------------------------------------------------------
        admin = Admin.query.filter((Admin.username == "admin") | (Admin.email == "admin@faeda.jobs")).first()
        if not admin:
            admin = Admin(username="admin", email="admin@faeda.jobs", role="super_admin")
            admin.is_active = True
            admin.set_password(DEMO_PASSWORD)
            db.session.add(admin)
            print("✅ Created Super Admin: admin@faeda.jobs")
        else:
            admin.set_password(DEMO_PASSWORD)
            admin.email = "admin@faeda.jobs"
            print("✅ Updated Super Admin password: admin@faeda.jobs")

        # ---------------------------------------------------------------------
        # 2. UNIVERSITIES & DEPARTMENTS
        # ---------------------------------------------------------------------
        print("\n🏛️ Seeding Universities & Academic Departments...")
        
        # University 1: KSU
        ksu = University.query.filter_by(email="ksu@faeda.demo").first()
        if not ksu:
            ksu = University(
                name_ar="جامعة الملك سعود",
                name_en="King Saud University",
                email="ksu@faeda.demo",
                password=DEMO_PASSWORD,
                description_ar="جامعة الملك سعود أول جامعة في المملكة العربية السعودية وأحد أبرز الصروح الأكاديمية الرائدة في التعليم والبحث والابتكار.",
                description_en="King Saud University is the premier public university in Riyadh, Saudi Arabia, dedicated to world-class research and academic excellence.",
                location="الرياض",
                country="المملكة العربية السعودية",
                website="https://ksu.edu.sa",
                institution_type="جامعة حكومية",
                qs_rank="Top 200 Globally",
                phone="0114670000",
                dean_name="د. محمد القحطاني",
                career_center_email="career@ksu.edu.sa",
                is_verified=True,
                status="active"
            )
            db.session.add(ksu)
            db.session.flush()

            # KSU Departments
            ksu_depts = [
                UniversityDepartment(university_id=ksu.id, name_ar="علوم الحاسب", name_en="Computer Science", faculty="كلية علوم الحاسب والمعلومات", degree_levels="بكالوريوس، ماجستير، دكتوراه", description="برنامج علوم الحاسب المعتمد عالمياً لتأهيل مهندسي ومطوري البرمجيات والذكاء الاصطناعي."),
                UniversityDepartment(university_id=ksu.id, name_ar="هندسة البرمجيات", name_en="Software Engineering", faculty="كلية علوم الحاسب والمعلومات", degree_levels="بكالوريوس، ماجستير", description="تأهيل المهندسين في هندسة النظم البرمجية المعقدة وإدارة الجودة وأمن البرمجيات."),
                UniversityDepartment(university_id=ksu.id, name_ar="الذكاء الاصطناعي وعلوم البيانات", name_en="Artificial Intelligence & Data Science", faculty="كلية علوم الحاسب والمعلومات", degree_levels="بكالوريوس، ماجستير", description="تخصص متقدم في تعلم الآلة، معالجة اللغات الطبيعية، وتحليل البيانات الضخمة."),
                UniversityDepartment(university_id=ksu.id, name_ar="نظم المعلومات", name_en="Information Systems", faculty="كلية علوم الحاسب والمعلومات", degree_levels="بكالوريوس", description="إدارة النظم المعلوماتية المؤسسية وحلول الأعمال الرقمية.")
            ]
            db.session.add_all(ksu_depts)
            print(f"✅ Created University: {ksu.name_ar} with {len(ksu_depts)} departments")
        
        # University 2: KFUPM
        kfupm = University.query.filter_by(email="kfupm@faeda.demo").first()
        if not kfupm:
            kfupm = University(
                name_ar="جامعة الملك فهد للبترول والمعادن",
                name_en="King Fahd University of Petroleum & Minerals",
                email="kfupm@faeda.demo",
                password=DEMO_PASSWORD,
                description_ar="جامعة الملك فهد للبترول والمعادن صرح أكاديمي رائد عالمياً في العلوم والهندسة والتقنيات المتقدمة.",
                description_en="KFUPM is a world-renowned leading institution in science, engineering, and advanced computational technologies.",
                location="الظهران",
                country="المملكة العربية السعودية",
                website="https://kfupm.edu.sa",
                institution_type="جامعة حكومية",
                qs_rank="Rank 101 Globally",
                phone="0138600000",
                dean_name="د. فهد الدوسري",
                career_center_email="careers@kfupm.edu.sa",
                is_verified=True,
                status="active"
            )
            db.session.add(kfupm)
            db.session.flush()

            # KFUPM Departments
            kfupm_depts = [
                UniversityDepartment(university_id=kfupm.id, name_ar="علوم وهندسة الحاسب الآلي", name_en="Computer Science & Engineering", faculty="كلية الحوسبة والرياضيات", degree_levels="بكالوريوس، ماجستير، دكتوراه", description="برامج هندسة الحاسب والأنظمة المدمجة وهندسة البرمجيات السحابية."),
                UniversityDepartment(university_id=kfupm.id, name_ar="الهندسة الصناعية وهندسة النظم", name_en="Industrial & Systems Engineering", faculty="كلية الهندسة", degree_levels="بكالوريوس، ماجستير", description="تأهيل قادة إدارة العمليات والمنتجات وسلاسل الإمداد الرقمية.")
            ]
            db.session.add_all(kfupm_depts)
            print(f"✅ Created University: {kfupm.name_ar} with {len(kfupm_depts)} departments")

        db.session.commit()

        # ---------------------------------------------------------------------
        # 3. COMPANIES
        # ---------------------------------------------------------------------
        print("\n🏢 Seeding Realistic Companies...")
        companies_seed_data = [
            {
                "company_arabic_name": "شركة حلول النطاق السحابي",
                "company_english_name": "CloudScale Solutions",
                "company_email": "cloudscale@faeda.demo",
                "company_mobile": "0501112233",
                "country": "المملكة العربية السعودية",
                "state": "الرياض",
                "english_adress": "King Fahd Road, Al-Olaya, Riyadh",
                "company_type": "شركة مساهمة مقفلة",
                "company_size": "100-500 موظف",
                "company_field": "تقنية المعلومات والبرمجيات",
                "hr_name": "سلطان العتيبي",
                "hr_email": "hr@cloudscale.sa",
                "about_company_arabic": "شركة حلول النطاق السحابي رائدة في بناء وتطوير المنصات المؤسسية الكبرى وحلول الحوسبة السحابية وهندسة البيانات بالمملكة.",
                "about_company_english": "CloudScale Solutions is a premier Saudi enterprise cloud solutions and full-stack software development company.",
                "commercial_register": "1010887766",
                "company_website": "https://cloudscale.demo.sa",
                "login_password": DEMO_PASSWORD,
                "activated": True,
                "is_verified": True,
                "transparency_score": 94,
                "diversity_ratio": 38,
                "response_rate": 96,
                "avg_response_time_days": 2,
                "retention_rate": 92,
                "saudi_national_ratio": 72,
                "remote_flexibility_score": 85,
                "wellness_score": 90
            },
            {
                "company_arabic_name": "شركة الرؤية العميقة للذكاء الاصطناعي",
                "company_english_name": "DeepVision AI Technologies",
                "company_email": "deepvision@faeda.demo",
                "company_mobile": "0504445566",
                "country": "المملكة العربية السعودية",
                "state": "الرياض",
                "english_adress": "Digital City, Riyadh",
                "company_type": "شركة ذات مسؤولية محدودة",
                "company_size": "20-50 موظف",
                "company_field": "الذكاء الاصطناعي وتحليل البيانات",
                "hr_name": "نورة المنصور",
                "hr_email": "talent@deepvision.ai",
                "about_company_arabic": "مختبر رائد في أبحاث وتطوير نماذج الذكاء الاصطناعي التوليدي ومعالجة اللغات الطبيعية (NLP) الموجهة للسوق العربي.",
                "about_company_english": "DeepVision AI is an advanced AI research and engineering company developing Arabic LLMs and computer vision products.",
                "commercial_register": "1010998877",
                "company_website": "https://deepvision.demo.ai",
                "login_password": DEMO_PASSWORD,
                "activated": True,
                "is_verified": True,
                "transparency_score": 91,
                "diversity_ratio": 42,
                "response_rate": 94,
                "avg_response_time_days": 1,
                "retention_rate": 95,
                "saudi_national_ratio": 80,
                "remote_flexibility_score": 95,
                "wellness_score": 88
            },
            {
                "company_arabic_name": "واحة التقنية المالية",
                "company_english_name": "FinTech Oasis Saudi",
                "company_email": "fintechoasis@faeda.demo",
                "company_mobile": "0507778899",
                "country": "المملكة العربية السعودية",
                "state": "جدة",
                "english_adress": "Al-Andalus District, Jeddah",
                "company_type": "شركة مساهمة مقفلة",
                "company_size": "50-200 موظف",
                "company_field": "التقنية المالية والمدفوعات",
                "hr_name": "عبدالرحمن الزهراني",
                "hr_email": "careers@fintechoasis.sa",
                "about_company_arabic": "منصة المدفوعات والحلول المصرفية المفتوحة الرائدة والمرخصة لتوفير تجارب مالية رقمية فائقة السرعة والأمان.",
                "about_company_english": "FinTech Oasis provides next-generation open banking and payment infrastructure across Saudi Arabia.",
                "commercial_register": "4030112233",
                "company_website": "https://fintechoasis.demo.sa",
                "login_password": DEMO_PASSWORD,
                "activated": True,
                "is_verified": True,
                "transparency_score": 88,
                "diversity_ratio": 35,
                "response_rate": 90,
                "avg_response_time_days": 3,
                "retention_rate": 89,
                "saudi_national_ratio": 75,
                "remote_flexibility_score": 75,
                "wellness_score": 85
            },
            {
                "company_arabic_name": "استوديو الابتكار الرقمي",
                "company_english_name": "NextGen Saudi Product Studio",
                "company_email": "nextgen@faeda.demo",
                "company_mobile": "0503334455",
                "country": "المملكة العربية السعودية",
                "state": "الخبر",
                "english_adress": "Prince Turki St, Al-Khobar",
                "company_type": "مؤسسة فردية ريادية",
                "company_size": "10-30 موظف",
                "company_field": "تصميم وتطوير المنتجات الرقمية",
                "hr_name": "سارة الخالدي",
                "hr_email": "hello@nextgenstudio.sa",
                "about_company_arabic": "استوديو متخصص في ابتكار وتصميم المنتجات الرقمية وتطبيقات الهواتف الذكية وتجارب المستخدم الاستثنائية.",
                "about_company_english": "NextGen is a dynamic product studio crafting world-class digital products and mobile apps for ambitious startups.",
                "commercial_register": "2050991122",
                "company_website": "https://nextgenstudio.demo.sa",
                "login_password": DEMO_PASSWORD,
                "activated": True,
                "is_verified": True,
                "transparency_score": 85,
                "diversity_ratio": 45,
                "response_rate": 92,
                "avg_response_time_days": 2,
                "retention_rate": 90,
                "saudi_national_ratio": 70,
                "remote_flexibility_score": 90,
                "wellness_score": 82
            }
        ]

        seeded_companies = {}
        for c_data in companies_seed_data:
            comp = Company.query.filter_by(company_email=c_data["company_email"]).first()
            extra_fields = {
                "is_verified": c_data.pop("is_verified", True),
                "transparency_score": c_data.pop("transparency_score", 90),
                "diversity_ratio": c_data.pop("diversity_ratio", 40),
                "response_rate": c_data.pop("response_rate", 95),
                "avg_response_time_days": c_data.pop("avg_response_time_days", 2),
                "retention_rate": c_data.pop("retention_rate", 90),
                "saudi_national_ratio": c_data.pop("saudi_national_ratio", 75),
                "remote_flexibility_score": c_data.pop("remote_flexibility_score", 85),
                "wellness_score": c_data.pop("wellness_score", 88)
            }
            if not comp:
                comp = Company(**c_data)
                comp.status = "active"
                for k, v in extra_fields.items():
                    setattr(comp, k, v)
                db.session.add(comp)
                db.session.flush()
            else:
                comp.login_password = DEMO_PASSWORD
                comp.activated = True
                for k, v in extra_fields.items():
                    setattr(comp, k, v)
            seeded_companies[comp.company_english_name] = comp
            print(f"✅ Company: {comp.company_arabic_name} ({comp.company_email})")

        db.session.commit()

        # ---------------------------------------------------------------------
        # 4. CANDIDATES (8 Distinct Profiles)
        # ---------------------------------------------------------------------
        print("\n👤 Seeding Realistic Candidates with Varied States...")
        
        candidates_seed_data = [
            # Candidate 1: 100% Complete Senior Full-Stack
            {
                "user_id": "DEMO_CAND_01",
                "fullname": "أحمد المنصور",
                "email": "ahmed.mansoor@faeda.demo",
                "mobile": "0501230001",
                "password": DEMO_PASSWORD,
                "about": "مهندس برمجيات أول وحلول سحابية بخبرة تتجاوز 5 سنوات في بناء المنصات الموزعة وتطوير واجهات React وخدمات الباك إند السحابية الموثوقة.",
                "sex": "ذكر",
                "country": "المملكة العربية السعودية",
                "government": "الرياض",
                "education_statue": "خريج",
                "educational_qualification": "بكالوريوس",
                "university": "جامعة الملك فهد للبترول والمعادن",
                "department_university": "هندسة البرمجيات",
                "graduation_date": datetime(2021, 6, 15).date(),
                "gpa": "4.85",
                "years_of_skills": "3-5 سنوات",
                "preferred_field_of_work": "تقنية المعلومات",
                "work_type": "دوام كامل",
                "work_style": "مرن / هجين",
                "expected_salary": 18000,
                "visibility": "public",
                "is_verified": True,
                "status": "active",
                "skills": ["React", "TypeScript", "Python", "Flask", "PostgreSQL", "Docker", "AWS", "FastAPI", "Tailwind CSS"],
                "projects": [
                    {
                        "project_name": "منصة مطابقة السير الذاتية والتوظيف الذكي Smart ATS",
                        "project_size": "كبير",
                        "description": "بناء محرك متقدم لتحليل السير الذاتية باللغتين العربية والإنجليزية واستخراج المهارات وربطها مع الوظائف بنظام مطابقة آلي.",
                        "project_url": "https://github.com/demo/smart-ats-platform"
                    },
                    {
                        "project_name": "بوابة تسوية المدفوعات السحابية Cloud FinTech Engine",
                        "project_size": "متوسط",
                        "description": "تطوير واجهات برمجية آمنة لمعالجة المدفوعات والتحويلات اللحظية مع الامتثال لمعايير الأمان PCI-DSS.",
                        "project_url": "https://github.com/demo/fintech-payment-engine"
                    }
                ],
                "certifications": [
                    {
                        "cert_name": "AWS Certified Solutions Architect – Professional",
                        "issuing_org": "Amazon Web Services (AWS)",
                        "issue_month": 3,
                        "issue_year": 2023,
                        "no_expiry": True,
                        "credential_id": "AWS-PSA-994821"
                    },
                    {
                        "cert_name": "Professional Scrum Master I (PSM I)",
                        "issuing_org": "Scrum.org",
                        "issue_month": 9,
                        "issue_year": 2022,
                        "no_expiry": True,
                        "credential_id": "PSM-881203"
                    }
                ]
            },
            # Candidate 2: Incomplete Candidate (for testing "Complete Now" / Onboarding)
            {
                "user_id": "DEMO_CAND_02",
                "fullname": "سارة العتيبي",
                "email": "sarah.otaibi@faeda.demo",
                "mobile": "0501230002",
                "password": DEMO_PASSWORD,
                "about": "خريجة جديدة في علوم الحاسب شغوفة بتعلم تقنيات الويب الحديثة والذكاء الاصطناعي.",
                "sex": "أنثى",
                "country": "المملكة العربية السعودية",
                "government": "الرياض",
                "education_statue": "خريج",
                "educational_qualification": "بكالوريوس",
                "university": "جامعة الملك سعود",
                "department_university": "علوم الحاسب",
                "graduation_date": datetime(2025, 5, 20).date(),
                "gpa": "4.20",
                "years_of_skills": "0-2 سنوات",
                "preferred_field_of_work": "تقنية المعلومات",
                "work_type": "دوام كامل",
                "visibility": "employers_only",
                "is_verified": False,
                "status": "active",
                "skills": ["Python", "HTML", "CSS"],
                "projects": [],
                "certifications": []
            },
            # Candidate 3: AI / ML Engineer
            {
                "user_id": "DEMO_CAND_03",
                "fullname": "طارق الزهراني",
                "email": "tariq.zahrani@faeda.demo",
                "mobile": "0501230003",
                "password": DEMO_PASSWORD,
                "about": "مهندس ذكاء اصطناعي ونماذج لغوية متخصص في تدريب ونشر نماذج LLMs ومعالجة اللغات الطبيعية وتطوير نظم التوصيات الذكية.",
                "sex": "ذكر",
                "country": "المملكة العربية السعودية",
                "government": "الرياض",
                "education_statue": "خريج",
                "educational_qualification": "ماجستير",
                "university": "جامعة الملك سعود",
                "department_university": "الذكاء الاصطناعي وعلوم البيانات",
                "graduation_date": datetime(2022, 1, 10).date(),
                "gpa": "4.92",
                "years_of_skills": "3-5 سنوات",
                "preferred_field_of_work": "تقنية المعلومات",
                "work_type": "دوام كامل",
                "work_style": "عن بعد",
                "expected_salary": 22000,
                "visibility": "public",
                "is_verified": True,
                "status": "active",
                "skills": ["Python", "PyTorch", "TensorFlow", "FastAPI", "Docker", "SQL", "LangChain", "Machine Learning"],
                "projects": [
                    {
                        "project_name": "محرك معالجة وتلخيص النصوص العربية Arabic NLP Summarizer",
                        "project_size": "كبير",
                        "description": "تدريب نموذج لغوي متخصص في فهم واستخلاص الأفكار الرئيسية من الوثائق والتقارير الحكومية العربية بدقة فائقة.",
                        "project_url": "https://github.com/demo/arabic-nlp-engine"
                    }
                ],
                "certifications": [
                    {
                        "cert_name": "TensorFlow Developer Certificate",
                        "issuing_org": "Google Cloud",
                        "issue_month": 6,
                        "issue_year": 2023,
                        "no_expiry": False,
                        "expiry_year": 2026,
                        "credential_id": "TF-DEV-55421"
                    }
                ]
            },
            # Candidate 4: Lead Frontend & UI Engineer
            {
                "user_id": "DEMO_CAND_04",
                "fullname": "ريم الغامدي",
                "email": "reem.ghamdi@faeda.demo",
                "mobile": "0501230004",
                "password": DEMO_PASSWORD,
                "about": "مهندسة واجهات أمامية متقدمة وتصميم تجارب المستخدم بخبرة 4 سنوات في React وTypeScript وTailwind CSS وتطوير أنظمة التصميم الشاملة.",
                "sex": "أنثى",
                "country": "المملكة العربية السعودية",
                "government": "الرياض",
                "education_statue": "خريج",
                "educational_qualification": "بكالوريوس",
                "university": "جامعة الأميرة نورة بنت عبدالرحمن",
                "department_university": "تقنية المعلومات",
                "graduation_date": datetime(2022, 6, 20).date(),
                "gpa": "4.70",
                "years_of_skills": "3-5 سنوات",
                "preferred_field_of_work": "تقنية المعلومات",
                "work_type": "دوام كامل",
                "work_style": "مرن / هجين",
                "expected_salary": 16000,
                "visibility": "public",
                "is_verified": True,
                "status": "active",
                "skills": ["React", "TypeScript", "Tailwind CSS", "Next.js", "Figma", "Redux", "GraphQL"],
                "projects": [
                    {
                        "project_name": "نظام التصميم الرقمي الموحد Enterprise Design System",
                        "project_size": "كبير",
                        "description": "بناء وتوثيق مكتبة مكونات تفاعلية متوافقة مع متطلبات إمكانية الوصول WCAG 2.1 ودعم RTL الأصلي.",
                        "project_url": "https://github.com/demo/enterprise-design-system"
                    }
                ],
                "certifications": [
                    {
                        "cert_name": "Meta Front-End Developer Certificate",
                        "issuing_org": "Meta",
                        "issue_month": 4,
                        "issue_year": 2023,
                        "no_expiry": True,
                        "credential_id": "META-FE-77219"
                    }
                ]
            },
            # Candidate 5: Big Data Engineer
            {
                "user_id": "DEMO_CAND_05",
                "fullname": "فيصل الحربي",
                "email": "faisal.harbi@faeda.demo",
                "mobile": "0501230005",
                "password": DEMO_PASSWORD,
                "about": "مهندس بيانات متخصص في بناء خطوط معالجة البيانات الضخمة (ETL/ELT Pipelines) وتخزين البيانات السحابي ونمذجة المستودعات التحليلية.",
                "sex": "ذكر",
                "country": "المملكة العربية السعودية",
                "government": "جدة",
                "education_statue": "خريج",
                "educational_qualification": "بكالوريوس",
                "university": "جامعة الملك عبدالعزيز",
                "department_university": "علوم الحاسب",
                "graduation_date": datetime(2021, 5, 30).date(),
                "gpa": "4.60",
                "years_of_skills": "3-5 سنوات",
                "preferred_field_of_work": "تقنية المعلومات",
                "work_type": "دوام كامل",
                "work_style": "حضوري أو هجين",
                "expected_salary": 17500,
                "visibility": "public",
                "is_verified": True,
                "status": "active",
                "skills": ["Python", "SQL", "Apache Spark", "PostgreSQL", "Airflow", "Docker", "Data Engineering"],
                "projects": [
                    {
                        "project_name": "منصة التحليلات اللحظية للمعاملات البنكية Realtime Analytics",
                        "project_size": "كبير",
                        "description": "معالجة أكثر من 100 ألف معاملة في الدقيقة باستخدام Spark Streaming وتخزينها في مستودع بيانات مهيكل.",
                        "project_url": "https://github.com/demo/realtime-spark-analytics"
                    }
                ],
                "certifications": []
            },
            # Candidate 6: Mobile & Flutter Engineer
            {
                "user_id": "DEMO_CAND_06",
                "fullname": "لينا الدوسري",
                "email": "lina.dosari@faeda.demo",
                "mobile": "0501230006",
                "password": DEMO_PASSWORD,
                "about": "مطورة تطبيقات جوال متقدمة باستخدام Flutter وDart مع خبرة في بناء تطبيقات التجارة الإلكترونية والخدمات اللوجستية.",
                "sex": "أنثى",
                "country": "المملكة العربية السعودية",
                "government": "الدمام",
                "education_statue": "خريج",
                "educational_qualification": "بكالوريوس",
                "university": "جامعة الإمام عبدالرحمن بن فيصل",
                "department_university": "نظم المعلومات الحاسوبية",
                "graduation_date": datetime(2022, 6, 10).date(),
                "gpa": "4.65",
                "years_of_skills": "3-5 سنوات",
                "preferred_field_of_work": "تقنية المعلومات",
                "work_type": "دوام كامل",
                "work_style": "مرن / هجين",
                "expected_salary": 15000,
                "visibility": "public",
                "is_verified": True,
                "status": "active",
                "skills": ["Flutter", "Dart", "Firebase", "REST APIs", "Mobile UI", "Git"],
                "projects": [
                    {
                        "project_name": "تطبيق إدارة التوصيل السريع Delivery Express App",
                        "project_size": "متوسط",
                        "description": "تطبيق متكامل لتتبع الشحنات والخرائط التفاعلية وإشعارات التوصيل اللحظية عبر Firebase Cloud Messaging.",
                        "project_url": "https://github.com/demo/flutter-delivery-app"
                    }
                ],
                "certifications": []
            },
            # Candidate 7: Senior Product Manager
            {
                "user_id": "DEMO_CAND_07",
                "fullname": "خالد الشهري",
                "email": "khaled.shehri@faeda.demo",
                "mobile": "0501230007",
                "password": DEMO_PASSWORD,
                "about": "مدير منتجات تقنية أول بخبرة 6 سنوات في قيادة استراتيجيات المنتجات الرقمية وبناء خارطة الطريق وإدارة فرق الهندسة الرشيقة.",
                "sex": "ذكر",
                "country": "المملكة العربية السعودية",
                "government": "الرياض",
                "education_statue": "خريج",
                "educational_qualification": "بكالوريوس",
                "university": "جامعة الملك فهد للبترول والمعادن",
                "department_university": "الهندسة الصناعية",
                "graduation_date": datetime(2019, 5, 25).date(),
                "gpa": "4.75",
                "years_of_skills": "5+ سنوات",
                "preferred_field_of_work": "إدارة المنتجات والمشاريع",
                "work_type": "دوام كامل",
                "work_style": "حضوري",
                "expected_salary": 25000,
                "visibility": "public",
                "is_verified": True,
                "status": "active",
                "skills": ["Product Strategy", "Agile / Scrum", "Jira", "User Research", "Data Analysis", "Roadmapping"],
                "projects": [
                    {
                        "project_name": "منصة المدفوعات الرقمية للشركات B2B FinTech Portal",
                        "project_size": "كبير",
                        "description": "قيادة إطلاق المنتج من مرحلة البحث حتى التوسع، وتحقيق نمو في حجم المعاملات بنسبة 140%.",
                        "project_url": "https://github.com/demo/product-case-study"
                    }
                ],
                "certifications": [
                    {
                        "cert_name": "Certified Scrum Product Owner (CSPO)",
                        "issuing_org": "Scrum Alliance",
                        "issue_month": 11,
                        "issue_year": 2021,
                        "no_expiry": True,
                        "credential_id": "CSPO-119283"
                    }
                ]
            },
            # Candidate 8: University Student (Pending Verification)
            {
                "user_id": "DEMO_CAND_08",
                "fullname": "نورة الحسيني",
                "email": "noura.husseini@faeda.demo",
                "mobile": "0501230008",
                "password": DEMO_PASSWORD,
                "about": "طالبة سنة أخيرة في هندسة البرمجيات بجامعة الملك سعود، مهتمة بتطوير البرمجيات الحديثة وأبحاث جودة الكود.",
                "sex": "أنثى",
                "country": "المملكة العربية السعودية",
                "government": "الرياض",
                "education_statue": "طالب",
                "educational_qualification": "بكالوريوس",
                "university": "جامعة الملك سعود",
                "department_university": "هندسة البرمجيات",
                "graduation_date": datetime(2026, 6, 30).date(),
                "gpa": "4.80",
                "years_of_skills": "0-2 سنوات",
                "preferred_field_of_work": "تقنية المعلومات",
                "work_type": "تدريب تعاوني / دوام كامل",
                "visibility": "employers_only",
                "is_verified": False,
                "status": "active",
                "skills": ["Java", "Python", "SQL", "Software Testing", "Git"],
                "projects": [
                    {
                        "project_name": "نظام إدارة الاختبارات الأكاديمية الذكي University Exam Hub",
                        "project_size": "صغير",
                        "description": "مشروع تخرج لتنظيم وجدولة الاختبارات الأكاديمية والتحقق من الحضور.",
                        "project_url": "https://github.com/demo/exam-hub"
                    }
                ],
                "certifications": []
            }
        ]

        seeded_candidates = {}
        for c_data in candidates_seed_data:
            cust = Customers.query.filter_by(email=c_data["email"]).first()
            if not cust:
                skills_list = c_data.pop("skills", [])
                projects_list = c_data.pop("projects", [])
                certs_list = c_data.pop("certifications", [])

                cust = Customers(**c_data)
                db.session.add(cust)
                db.session.flush()

                # Add Skills
                for sk in skills_list:
                    skill_obj = Skills(customer_id=cust.id, skill_name=sk)
                    db.session.add(skill_obj)

                # Add Projects
                for p_dict in projects_list:
                    proj = CustomerProject(customer_id=cust.id, **p_dict)
                    db.session.add(proj)

                # Add Certifications
                for cert_dict in certs_list:
                    cert = CustomerCertification(customer_id=cust.id, **cert_dict)
                    db.session.add(cert)

                # Log Profile History
                hist = CustomerProfileHistory(customer_id=cust.id, score=85.0, event_description="إنشاء وتفعيل الحساب المهني")
                db.session.add(hist)
            else:
                cust.password = DEMO_PASSWORD

            seeded_candidates[c_data["email"]] = cust
            print(f"✅ Candidate: {cust.fullname} ({cust.email}) - ID: {cust.id}")

        db.session.commit()

        # ---------------------------------------------------------------------
        # 5. ACADEMIC VERIFICATIONS (Linking Universities & Candidates)
        # ---------------------------------------------------------------------
        print("\n🎓 Seeding University Academic Verifications...")
        
        # Ahmed Al-Mansoor -> KFUPM (Verified)
        c1 = seeded_candidates["ahmed.mansoor@faeda.demo"]
        v1 = AcademicVerification.query.filter_by(customer_id=c1.id, university_id=kfupm.id).first()
        if not v1:
            v1 = AcademicVerification(
                university_id=kfupm.id,
                customer_id=c1.id,
                degree="بكالوريوس",
                department="هندسة البرمجيات",
                graduation_year="2021",
                gpa="4.85 / 5.0",
                status="verified",
                notes="تم التحقق والمصادقة على السجل الأكاديمي رسمياً من عمادة القبول والتسجيل.",
                verified_at=datetime.utcnow() - timedelta(days=60),
                verified_by="عمادة القبول والتسجيل - جامعة الملك فهد"
            )
            db.session.add(v1)
            c1.is_verified = True

        # Tariq Al-Zahrani -> KSU (Verified)
        c3 = seeded_candidates["tariq.zahrani@faeda.demo"]
        v3 = AcademicVerification.query.filter_by(customer_id=c3.id, university_id=ksu.id).first()
        if not v3:
            v3 = AcademicVerification(
                university_id=ksu.id,
                customer_id=c3.id,
                degree="ماجستير",
                department="الذكاء الاصطناعي وعلوم البيانات",
                graduation_year="2022",
                gpa="4.92 / 5.0",
                status="verified",
                notes="معتمد رسمياً من كلية علوم الحاسب والمعلومات بجامعة الملك سعود.",
                verified_at=datetime.utcnow() - timedelta(days=45),
                verified_by="إدارة الدراسات العليا - جامعة الملك سعود"
            )
            db.session.add(v3)
            c3.is_verified = True

        # Noura Al-Husseini -> KSU (Pending Verification)
        c8 = seeded_candidates["noura.husseini@faeda.demo"]
        v8 = AcademicVerification.query.filter_by(customer_id=c8.id, university_id=ksu.id).first()
        if not v8:
            v8 = AcademicVerification(
                university_id=ksu.id,
                customer_id=c8.id,
                degree="بكالوريوس",
                department="هندسة البرمجيات",
                graduation_year="2026",
                gpa="4.80 / 5.0",
                status="pending",
                notes="طلب تحقق أكاديمي قيد المراجعة والتدقيق من قبل مرشد الكلية."
            )
            db.session.add(v8)

        # Sarah Al-Otaibi -> KSU (Verified)
        c2 = seeded_candidates["sarah.otaibi@faeda.demo"]
        v2 = AcademicVerification.query.filter_by(customer_id=c2.id, university_id=ksu.id).first()
        if not v2:
            v2 = AcademicVerification(
                university_id=ksu.id,
                customer_id=c2.id,
                degree="بكالوريوس",
                department="علوم الحاسب",
                graduation_year="2025",
                gpa="4.20 / 5.0",
                status="verified",
                notes="سجل أكاديمي موثق.",
                verified_at=datetime.utcnow() - timedelta(days=10),
                verified_by="عمادة شؤون الطلاب"
            )
            db.session.add(v2)

        db.session.commit()
        print("✅ Academic verification records populated.")

        # ---------------------------------------------------------------------
        # 6. JOB POSTINGS (12 Varied Listings)
        # ---------------------------------------------------------------------
        print("\n💼 Seeding Realistic Job Postings...")
        comp_cloudscale = seeded_companies["CloudScale Solutions"]
        comp_deepvision = seeded_companies["DeepVision AI Technologies"]
        comp_fintech = seeded_companies["FinTech Oasis Saudi"]
        comp_nextgen = seeded_companies["NextGen Saudi Product Studio"]

        jobs_seed_data = [
            # CloudScale Jobs
            {
                "title": "مطور أول واجهات أمامية Senior React Engineer",
                "job_type": "دوام كامل",
                "town": "الرياض",
                "company_about": "شركة حلول النطاق السحابي رائدة في الحلول الرقمية السحابية بالمملكة.",
                "job_description": "نبحث عن مهندس واجهات أمامية محترف لقيادة وتطوير البوابة السحابية الموزعة باستخدام React 19, TypeScript, و Tailwind CSS.",
                "specialization": "تقنية المعلومات",
                "skills_years": "3-5 سنوات",
                "educational_qualification": "بكالوريوس علوم حاسب أو هندسة برمجيات",
                "workplace": "الرياض - هجين",
                "company_id": comp_cloudscale.id,
                "salary_min": 15000,
                "salary_max": 22000,
                "required_skills": "React, TypeScript, Tailwind CSS, REST APIs, Git, UI/UX",
                "preferred_work_style": "مرن / هجين"
            },
            {
                "title": "مهندس حلول سحابية وباك إند Senior Backend Cloud Engineer",
                "job_type": "دوام كامل",
                "town": "الرياض",
                "company_about": "حلول سحابية متقدمة للبنية التحتية والأنظمة الموزعة.",
                "job_description": "تصميم وبناء الخدمات المصغرة Microservices ومعالجة البيانات وقواعد البيانات الموزعة باستخدام Python, Flask, PostgreSQL و Docker.",
                "specialization": "تقنية المعلومات",
                "skills_years": "3-5 سنوات",
                "educational_qualification": "بكالوريوس",
                "workplace": "الرياض",
                "company_id": comp_cloudscale.id,
                "salary_min": 16000,
                "salary_max": 24000,
                "required_skills": "Python, Flask, PostgreSQL, Docker, AWS, Microservices",
                "preferred_work_style": "حضوري أو هجين"
            },
            {
                "title": "مهندس ديف أوبس وبنية تحتية DevOps & Cloud Platform Engineer",
                "job_type": "دوام كامل",
                "town": "الرياض",
                "company_about": "شركة رائدة في البنية السحابية وأنظمة الأتمتة.",
                "job_description": "إدارة خطوط النشر الآلي CI/CD والحاويات Kubernetes وتهيئة البنية التحتية ككود (Terraform).",
                "specialization": "تقنية المعلومات",
                "skills_years": "3-5 سنوات",
                "educational_qualification": "بكالوريوس",
                "workplace": "الرياض - عن بعد",
                "company_id": comp_cloudscale.id,
                "salary_min": 17000,
                "salary_max": 25000,
                "required_skills": "Docker, Kubernetes, AWS, CI/CD, Terraform, Linux",
                "preferred_work_style": "عن بعد"
            },
            {
                "title": "مدير منتجات تقنية سحابية Cloud Technical Product Manager",
                "job_type": "دوام كامل",
                "town": "الرياض",
                "company_about": "حلول رقمية مبتكرة.",
                "job_description": "قيادة استراتيجية المنتجات السحابية وتحليل متطلبات العملاء المؤسسيين وإدارة دورة حياة المنتجات التقنية.",
                "specialization": "إدارة المنتجات والمشاريع",
                "skills_years": "5+ سنوات",
                "educational_qualification": "بكالوريوس",
                "workplace": "الرياض",
                "company_id": comp_cloudscale.id,
                "salary_min": 22000,
                "salary_max": 30000,
                "required_skills": "Product Strategy, Agile / Scrum, Jira, Cloud Architecture",
                "preferred_work_style": "حضوري"
            },
            # DeepVision AI Jobs
            {
                "title": "مهندس ذكاء اصطناعي ونماذج لغوية AI & LLM Engineer",
                "job_type": "دوام كامل",
                "town": "الرياض",
                "company_about": "مختبر الرؤية العميقة المتخصص في الذكاء الاصطناعي التوليدي.",
                "job_description": "بناء وتدريب نماذج الذكاء الاصطناعي ومعالجة النصوص العربية وتطوير واجهات FastAPI عالية السرعة.",
                "specialization": "تقنية المعلومات",
                "skills_years": "3-5 سنوات",
                "educational_qualification": "بكالوريوس / ماجستير",
                "workplace": "الرياض - هجين",
                "company_id": comp_deepvision.id,
                "salary_min": 18000,
                "salary_max": 28000,
                "required_skills": "Python, PyTorch, TensorFlow, NLP, FastAPI, LangChain",
                "preferred_work_style": "مرن / هجين"
            },
            {
                "title": "عالم بيانات وتحليلات متقدمة Senior Data Scientist",
                "job_type": "دوام كامل",
                "town": "الرياض",
                "company_about": "حلول متقدمة في النمذجة التنبؤية وتحليل البيانات الكبيرة.",
                "job_description": "استخراج الأنماط وبناء النماذج الإحصائية وتطوير خوارزميات التنبؤ لقطاعات الأعمال.",
                "specialization": "تقنية المعلومات",
                "skills_years": "3-5 سنوات",
                "educational_qualification": "بكالوريوس / ماجستير",
                "workplace": "الرياض",
                "company_id": comp_deepvision.id,
                "salary_min": 16000,
                "salary_max": 23000,
                "required_skills": "Python, SQL, Machine Learning, Data Science, Statistics",
                "preferred_work_style": "هجين"
            },
            {
                "title": "مهندس عمليات تعلم الآلة MLOps Platform Specialist",
                "job_type": "دوام كامل",
                "town": "الرياض",
                "company_about": "أتمتة ونشر نماذج الذكاء الاصطناعي على نطاق واسع.",
                "job_description": "بناء وتأمين خطوط تدريب ونشر ومراقبة نماذج الـ AI والـ ML في بيئات الإنتاج الحية.",
                "specialization": "تقنية المعلومات",
                "skills_years": "2-4 سنوات",
                "educational_qualification": "بكالوريوس",
                "workplace": "عن بعد",
                "company_id": comp_deepvision.id,
                "salary_min": 17000,
                "salary_max": 24000,
                "required_skills": "Python, Docker, Kubernetes, MLOps, CI/CD, Cloud",
                "preferred_work_style": "عن بعد"
            },
            # FinTech Oasis Jobs
            {
                "title": "مطور Full Stack للحلول المالية FinTech Full Stack Developer",
                "job_type": "دوام كامل",
                "town": "جدة",
                "company_about": "واحة التقنية المالية الرائدة في حلول المدفوعات والخدمات المصرفية المفتوحة.",
                "job_description": "بناء وتطوير واجهات المستخدم ولوحات تحكم المدفوعات وتكامل الـ APIs المصرفية الآمنة.",
                "specialization": "تقنية المعلومات",
                "skills_years": "3-5 سنوات",
                "educational_qualification": "بكالوريوس",
                "workplace": "جدة - هجين",
                "company_id": comp_fintech.id,
                "salary_min": 16000,
                "salary_max": 23000,
                "required_skills": "React, TypeScript, Python, Flask, PostgreSQL, REST APIs",
                "preferred_work_style": "مرن / هجين"
            },
            {
                "title": "مهندس بيانات مالية FinTech Data Engineer",
                "job_type": "دوام كامل",
                "town": "جدة",
                "company_about": "منصة التقنية المالية للمدفوعات الرقمية.",
                "job_description": "تصميم خطوط معالجة المعاملات المالية اللحظية وبناء مستودعات البيانات والتحليلات الآمنة.",
                "specialization": "تقنية المعلومات",
                "skills_years": "3-5 سنوات",
                "educational_qualification": "بكالوريوس",
                "workplace": "جدة",
                "company_id": comp_fintech.id,
                "salary_min": 17000,
                "salary_max": 25000,
                "required_skills": "Python, SQL, Apache Spark, Airflow, PostgreSQL, Data Pipelines",
                "preferred_work_style": "حضوري"
            },
            {
                "title": "محلل أمن سيبراني ومعلومات Cyber Security Analyst",
                "job_type": "دوام كامل",
                "town": "جدة",
                "company_about": "أعلى معايير الحماية والأمان المالي.",
                "job_description": "حماية البنية التحتية المالية ومراقبة التهديدات والامتثال لمعايير البنك المركزي السعودي SAMA.",
                "specialization": "تقنية المعلومات",
                "skills_years": "3-5 سنوات",
                "educational_qualification": "بكالوريوس",
                "workplace": "جدة",
                "company_id": comp_fintech.id,
                "salary_min": 18000,
                "salary_max": 26000,
                "required_skills": "Cybersecurity, Network Security, SAMA Compliance, SIEM, Firewalls",
                "preferred_work_style": "حضوري"
            },
            # NextGen Studio Jobs
            {
                "title": "مطور تطبيقات جوال أول Senior Flutter Mobile Developer",
                "job_type": "دوام كامل",
                "town": "الخبر",
                "company_about": "استوديو الابتكار الرقمي لتصميم وتطوير التطبيقات الرائدة.",
                "job_description": "تطوير تطبيقات هواتف ذكية عصرية وفائقة السرعة باستخدام Flutter لنظامي iOS و Android مع دعم RTL كامل.",
                "specialization": "تقنية المعلومات",
                "skills_years": "3-5 سنوات",
                "educational_qualification": "بكالوريوس",
                "workplace": "الخبر - هجين",
                "company_id": comp_nextgen.id,
                "salary_min": 14000,
                "salary_max": 20000,
                "required_skills": "Flutter, Dart, Firebase, REST APIs, Mobile UI/UX",
                "preferred_work_style": "مرن / هجين"
            },
            {
                "title": "مصمم واجهات وتجربة مستخدم Lead UI/UX Product Designer",
                "job_type": "دوام كامل",
                "town": "الخبر",
                "company_about": "استوديو ريادي في بناء التجارب الرقمية الفريدة.",
                "job_description": "تصميم رحلات المستخدم، بناء النماذج التفاعلية التنافسية، وإنشاء أنظمة التصميم الاحترافية في Figma.",
                "specialization": "تصميم وتجربة المستخدم",
                "skills_years": "3-5 سنوات",
                "educational_qualification": "بكالوريوس أو دبلوم",
                "workplace": "عن بعد",
                "company_id": comp_nextgen.id,
                "salary_min": 13000,
                "salary_max": 19000,
                "required_skills": "Figma, UI/UX, Design Systems, User Research, Prototyping",
                "preferred_work_style": "عن بعد"
            }
        ]

        seeded_jobs = []
        for j_data in jobs_seed_data:
            job_obj = Jobs.query.filter_by(title=j_data["title"], company_id=j_data["company_id"]).first()
            if not job_obj:
                job_obj = Jobs(**j_data)
                job_obj.status = "approved"
                job_obj.is_featured = True
                db.session.add(job_obj)
                db.session.flush()
            else:
                job_obj.status = "approved"
            seeded_jobs.append(job_obj)

        db.session.commit()
        print(f"✅ Populated {len(seeded_jobs)} active job postings.")

        # ---------------------------------------------------------------------
        # 7. JOB APPLICATIONS & SAVED JOBS (Diverse Pipeline States)
        # ---------------------------------------------------------------------
        print("\n📋 Seeding Realistic Job Applications & Saved Jobs...")
        
        c4 = seeded_candidates["reem.ghamdi@faeda.demo"]
        c5 = seeded_candidates["faisal.harbi@faeda.demo"]
        c6 = seeded_candidates["lina.dosari@faeda.demo"]
        c7 = seeded_candidates["khaled.shehri@faeda.demo"]
        c8 = seeded_candidates["noura.husseini@faeda.demo"]

        # Candidate 1 (Ahmed) -> Applications
        j_react = seeded_jobs[0] # Senior React
        j_backend = seeded_jobs[1] # Senior Backend
        j_fintech = seeded_jobs[7] # FinTech Full Stack

        app_specs = [
            (c1.user_id, j_react.id, "interview", "تم اجتياز الفحص الأولي بنجاح وتحديد موعد المقابلة الفنية."),
            (c1.user_id, j_backend.id, "shortlisted", "ملف مرشح قوي ومطابق لمتطلبات الباك إند."),
            (c1.user_id, j_fintech.id, "reviewing", "قيد المراجعة والتدقيق من الفريق التقني."),
            # Candidate 3 (Tariq) -> AI Job (Offered)
            (c3.user_id, seeded_jobs[4].id, "offered", "تم تقديم عرض وظيفي رسمي بناءً على نتيجة المقابلة المتميزة."),
            # Candidate 4 (Reem) -> Frontend Jobs
            (c4.user_id, j_react.id, "applied", "تم التقديم بنجاح."),
            # Candidate 6 (Lina) -> Mobile Job
            (c6.user_id, seeded_jobs[10].id, "interview", "دعوة لمقابلة تقنية لمناقشة مشاريع Flutter السابقة."),
            # Candidate 7 (Khaled) -> PM Job
            (c7.user_id, seeded_jobs[3].id, "rejected", "تم الاكتفاء بالعدد المطلوب لهذه الدفعة مع حفظ السيرة الذاتية.")
        ]

        for uid, jid, st, nt in app_specs:
            exists = db.session.query(customer_jobs).filter_by(customer_id=uid, job_id=jid).first()
            if not exists:
                db.session.execute(customer_jobs.insert().values(
                    customer_id=uid,
                    job_id=jid,
                    status=st,
                    note=nt,
                    type="individual",
                    timestamp=datetime.utcnow() - timedelta(days=2)
                ))

        # Saved Jobs
        saved_specs = [
            (c1.id, seeded_jobs[2].id),
            (c1.id, seeded_jobs[4].id),
            (c3.id, seeded_jobs[5].id),
            (c4.id, seeded_jobs[11].id),
            (c6.id, seeded_jobs[0].id)
        ]

        for cid, jid in saved_specs:
            exists = db.session.query(customer_saved_jobs).filter_by(customer_id=cid, job_id=jid).first()
            if not exists:
                db.session.execute(customer_saved_jobs.insert().values(
                    customer_id=cid,
                    job_id=jid,
                    created_at=datetime.utcnow() - timedelta(days=3)
                ))

        db.session.commit()
        print("✅ Applications and Saved Jobs successfully populated.")

        # ---------------------------------------------------------------------
        # 8. SQUADS / TEAMS & INVITATIONS
        # ---------------------------------------------------------------------
        print("\n👥 Seeding Professional Teams & Squads...")
        
        # Squad 1: Apex Digital Squad (Ahmed leader, Reem member, Faisal member)
        team1 = Teams.query.filter_by(team_name="فريق أبيكس للحلول الرقمية Apex Digital Squad").first()
        if not team1:
            team1 = Teams(
                name="فريق أبيكس للحلول الرقمية Apex Digital Squad",
                admin_id=c1.user_id,
                about="فريق هندسي متكامل يجمع بين خبرات الباك إند السحابي والواجهات الأمامية وهندسة البيانات لتنفيذ المشاريع المعقدة بجودة استثنائية.",
                achievements="تنفيذ منصات تجارة إلكترونية سحابية وبوابات دفع بنكية معتمدة.",
                general_program="تطوير البرمجيات والحلول السحابية",
                special_program="Full Stack & Cloud Architecture",
                creation_date=datetime.utcnow() - timedelta(days=30)
            )
            db.session.add(team1)
            db.session.flush()

            # Add Members
            db.session.execute(team_members_association.insert().values(
                team_id=team1.id, member_id=c1.user_id, status="قائد", date_of_addition=datetime.utcnow()
            ))
            db.session.execute(team_members_association.insert().values(
                team_id=team1.id, member_id=seeded_candidates["reem.ghamdi@faeda.demo"].user_id, status="منضم", date_of_addition=datetime.utcnow()
            ))
            db.session.execute(team_members_association.insert().values(
                team_id=team1.id, member_id=seeded_candidates["faisal.harbi@faeda.demo"].user_id, status="منضم", date_of_addition=datetime.utcnow()
            ))

            # Team Invitation (to Lina)
            inv1 = TeamInvitation(
                team_id=team1.id,
                candidate_id=seeded_candidates["lina.dosari@faeda.demo"].id,
                invited_by_id=c1.id,
                status="pending",
                role="Mobile Application Lead",
                message="يسعدنا دعوتك للانضمام إلى فريق أبيكس لقيادة تطوير تطبيقات الجوال في مشاريعنا القادمة."
            )
            db.session.add(inv1)
            print(f"✅ Created Squad: {team1.name}")

        # Squad 2: Neural Minds AI Lab (Tariq leader, Faisal member)
        team2 = Teams.query.filter_by(team_name="مختبر العقول العصبية للذكاء الاصطناعي Neural Minds AI Lab").first()
        if not team2:
            team2 = Teams(
                name="مختبر العقول العصبية للذكاء الاصطناعي Neural Minds AI Lab",
                admin_id=c3.user_id,
                about="فريق بحثي وهندسي متخصص في بناء ونشر نماذج الذكاء الاصطناعي التوليدي، معالجة اللغات الطبيعية، وأنظمة البيانات الضخمة.",
                achievements="تطوير نموذج تلخيص مستندات قانونية عربية بدقة 94%.",
                general_program="الذكاء الاصطناعي وعلوم البيانات",
                special_program="AI & Big Data Engineering",
                creation_date=datetime.utcnow() - timedelta(days=20)
            )
            db.session.add(team2)
            db.session.flush()

            # Add Members
            db.session.execute(team_members_association.insert().values(
                team_id=team2.id, member_id=c3.user_id, status="قائد", date_of_addition=datetime.utcnow()
            ))
            db.session.execute(team_members_association.insert().values(
                team_id=team2.id, member_id=seeded_candidates["faisal.harbi@faeda.demo"].user_id, status="منضم", date_of_addition=datetime.utcnow()
            ))
            print(f"✅ Created Squad: {team2.name}")

        # Squad 3: OmniMobile Innovations (Lina leader, Reem member)
        team3 = Teams.query.filter_by(team_name="فريق أومني لتطبيقات الجوال OmniMobile Innovations").first()
        if not team3:
            team3 = Teams(
                name="فريق أومني لتطبيقات الجوال OmniMobile Innovations",
                admin_id=seeded_candidates["lina.dosari@faeda.demo"].user_id,
                about="فريق متخصص في بناء تطبيقات الهواتف الذكية وتجارب الاستخدام الرقمية فائقة السرعة على Flutter وiOS وAndroid.",
                achievements="إطلاق 4 تطبيقات تجارة وتوصيل على متجري App Store وGoogle Play.",
                general_program="تطبيقات الجوال وتجربة المستخدم",
                special_program="Mobile & Cross-Platform Development",
                creation_date=datetime.utcnow() - timedelta(days=15)
            )
            db.session.add(team3)
            db.session.flush()

            # Add Members
            db.session.execute(team_members_association.insert().values(
                team_id=team3.id, member_id=seeded_candidates["lina.dosari@faeda.demo"].user_id, status="قائد", date_of_addition=datetime.utcnow()
            ))
            db.session.execute(team_members_association.insert().values(
                team_id=team3.id, member_id=seeded_candidates["reem.ghamdi@faeda.demo"].user_id, status="منضم", date_of_addition=datetime.utcnow()
            ))
            print(f"✅ Created Squad: {team3.name}")

        db.session.commit()

        # ---------------------------------------------------------------------
        # 9. CHAT CONVERSATIONS & MESSAGES
        # ---------------------------------------------------------------------
        print("\n💬 Seeding Professional Chat Conversations...")
        
        # Thread 1: Candidate (Ahmed) <-> Company (CloudScale Solutions)
        conv1 = Conversation.query.filter_by(
            type="CANDIDATE_COMPANY",
            context_type="job_application",
            context_id=str(j_react.id)
        ).first()

        if not conv1:
            conv1 = Conversation(
                type="CANDIDATE_COMPANY",
                subject=f"بخصوص طلب التقديم على وظيفة: {j_react.title}",
                context_type="job_application",
                context_id=str(j_react.id),
                created_by_type="company",
                created_by_id=comp_cloudscale.id,
                created_at=datetime.utcnow() - timedelta(days=2),
                updated_at=datetime.utcnow() - timedelta(hours=3)
            )
            db.session.add(conv1)
            db.session.flush()

            # Participants
            p1 = ConversationParticipant(
                conversation_id=conv1.id, participant_type="company", participant_id=comp_cloudscale.id,
                last_read_at=datetime.utcnow()
            )
            p2 = ConversationParticipant(
                conversation_id=conv1.id, participant_type="candidate", participant_id=c1.id,
                last_read_at=datetime.utcnow()
            )
            db.session.add_all([p1, p2])

            # Messages
            m1 = ChatMessage(
                conversation_id=conv1.id,
                sender_type="company",
                sender_id=comp_cloudscale.id,
                body="السلام عليكم أستاذ أحمد، اطلعنا على سيرتك الذاتية ومشاريعك السحابية المتميزة، ونود دعوتك لإجراء مقابلة تقنية هذا الأسبوع.",
                created_at=datetime.utcnow() - timedelta(days=2)
            )
            m2 = ChatMessage(
                conversation_id=conv1.id,
                sender_type="candidate",
                sender_id=c1.id,
                body="وعليكم السلام ورحمة الله، شكراً جزيلاً لتواصلكم واهتمامكم. يسعدني ذلك، وأنا متاح يوم الأربعاء بعد الساعة 2:00 ظهراً.",
                created_at=datetime.utcnow() - timedelta(days=1)
            )
            m3 = ChatMessage(
                conversation_id=conv1.id,
                sender_type="company",
                sender_id=comp_cloudscale.id,
                body="ممتاز جداً، تم جدولة المقابلة يوم الأربعاء الساعة 3:00 مساءً عبر الفيديو، وسنرسل لك رابط الاجتماع مباشرة.",
                created_at=datetime.utcnow() - timedelta(hours=3)
            )
            db.session.add_all([m1, m2, m3])
            print("✅ Created Chat Thread: CloudScale <-> Ahmed Al-Mansoor")

        # Thread 2: Company (FinTech Oasis) <-> Team (Apex Digital Squad)
        conv2 = Conversation.query.filter_by(
            type="TEAM_COMPANY",
            context_type="team",
            context_id=str(team1.id)
        ).first()

        if not conv2:
            conv2 = Conversation(
                type="TEAM_COMPANY",
                subject="استفسار بخصوص التعاقد مع فريق أبيكس لمشروع بوابة المدفوعات",
                context_type="team",
                context_id=str(team1.id),
                created_by_type="company",
                created_by_id=comp_fintech.id,
                created_at=datetime.utcnow() - timedelta(days=1),
                updated_at=datetime.utcnow() - timedelta(hours=1)
            )
            db.session.add(conv2)
            db.session.flush()

            # Participants
            p3 = ConversationParticipant(
                conversation_id=conv2.id, participant_type="company", participant_id=comp_fintech.id,
                last_read_at=datetime.utcnow()
            )
            p4 = ConversationParticipant(
                conversation_id=conv2.id, participant_type="team", participant_id=team1.id,
                last_read_at=datetime.utcnow() - timedelta(hours=2) # Unread message!
            )
            db.session.add_all([p3, p4])

            # Messages
            m4 = ChatMessage(
                conversation_id=conv2.id,
                sender_type="company",
                sender_id=comp_fintech.id,
                body="مرحباً بفريق أبيكس، لدينا مشروع لتطوير بوابة مدفوعات متكاملة ونرغب في التعاقد مع فريقكم المكتمل لتنفيذ المشروع.",
                created_at=datetime.utcnow() - timedelta(days=1)
            )
            m5 = ChatMessage(
                conversation_id=conv2.id,
                sender_type="candidate",
                sender_id=c1.id, # Team leader
                body="أهلاً بكم، اطلعنا على المتطلبات ونحن على أتم الاستعداد بتواجد مطوري الواجهات والباك إند ومهندس البيانات.",
                created_at=datetime.utcnow() - timedelta(hours=4)
            )
            m6 = ChatMessage(
                conversation_id=conv2.id,
                sender_type="company",
                sender_id=comp_fintech.id,
                body="رائع! هل يمكننا عقد اجتماع تمهيدي لمناقشة نطاق العمل والميزانية المحددة غداً؟",
                created_at=datetime.utcnow() - timedelta(hours=1)
            )
            db.session.add_all([m4, m5, m6])
            print("✅ Created Chat Thread: FinTech Oasis <-> Apex Digital Squad (with unread message)")

        db.session.commit()

        # ---------------------------------------------------------------------
        # 10. GENERATE ATS DEMO CV FOR AHMED AL-MANSOOR
        # ---------------------------------------------------------------------
        print("\n📄 Ensuring Demo CV & ATS Parsing Artifact for Ahmed...")
        cv_dir = os.path.join(BASE_DIR, "static", "uploads", "customers", "cv")
        os.makedirs(cv_dir, exist_ok=True)
        cv_filename = f"cv_{c1.id}_demo_ahmed_al_mansoor.txt"
        cv_path = os.path.join(cv_dir, cv_filename)
        
        cv_content = f"""
======================================================================
AHMED AL-MANSOOR | أحمد المنصور
Senior Full Stack & Cloud Software Engineer
Email: ahmed.mansoor@faeda.demo | Phone: +966 50 123 0001 | Riyadh, Saudi Arabia
LinkedIn: linkedin.com/in/ahmed-mansoor-demo | GitHub: github.com/demo
======================================================================

EXECUTIVE SUMMARY:
High-performing Senior Software Engineer with 5+ years of experience specializing in React, TypeScript, Python, Flask, and AWS cloud architecture. Proven track record of designing and scaling robust distributed platforms and leading agile engineering squads.

EDUCATION:
- Bachelor of Science in Software Engineering, King Fahd University of Petroleum & Minerals (KFUPM)
  GPA: 4.85 / 5.0 (First Class Honors) | Graduation: June 2021

CORE COMPETENCIES & TECHNICAL SKILLS:
- Languages: TypeScript, JavaScript, Python, SQL, HTML5, CSS3
- Frontend: React 19, Next.js, Tailwind CSS, Redux Toolkit, Framer Motion
- Backend & Cloud: Python Flask, FastAPI, PostgreSQL, Docker, AWS (ECS, S3, RDS), RESTful APIs
- Methodology: Agile / Scrum, CI/CD pipelines, Test-Driven Development (TDD)

PROFESSIONAL EXPERIENCE:
Senior Full Stack Developer | Enterprise Cloud Systems (2021 - Present)
- Engineered scalable microservices architecture serving 200,000+ monthly active users.
- Reduced API latency by 45% through PostgreSQL query optimization and Redis caching.
- Spearheaded the design system migration to React and Tailwind CSS.

FEATURED PROJECTS:
1. Smart ATS AI Platform: Automated resume matching and parsing engine with Arabic & English support.
2. Cloud FinTech Gateway: Secure PCI-DSS compliant payment reconciliation API.

CERTIFICATIONS:
- AWS Certified Solutions Architect – Professional (Amazon Web Services)
- Professional Scrum Master I (Scrum.org)
======================================================================
"""
        with open(cv_path, "w", encoding="utf-8") as f:
            f.write(cv_content.strip())
            
        c1.cv = cv_filename
        c1.resume_text = cv_content
        db.session.commit()
        print("✅ Demo CV generated and attached.")

        print("\n==================================================")
        print("🎉 DEMO ECOSYSTEM SEEDING COMPLETED SUCCESSFULLY!")
        print("==================================================")

if __name__ == "__main__":
    seed_database()
