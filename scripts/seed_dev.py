import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app, db
from services.company import Company
from services.job import Jobs
from services.customer import Customers
from services.teams import Teams
from services.admin import Admin

app = create_app()

with app.app_context():
    # 1. Super Admin
    if not Admin.query.filter_by(username='admin').first():
        admin = Admin(username='admin', email='admin@faida.com', role='super_admin')
        admin.is_active = True
        admin.set_password('admin123')
        db.session.add(admin)

    # 2. Sample Companies
    sample_companies = [
        {
            "company_english_name": "Digital Solutions Co.",
            "company_arabic_name": "شركة الحلول الرقمية",
            "company_email": "company@faeda.jobs",
            "company_mobile": "0501234567",
            "country": "المملكة العربية السعودية",
            "state": "الرياض",
            "company_type": "تقنية المعلومات",
            "company_size": "50-200 موظف",
            "company_field": "تطوير البرمجيات والحلول السحابية",
            "login_password": "Password123!",
            "activated": True,
            "company_website": "https://digitalsolutions.example.com",
            "about_company_arabic": "شركة رائدة في مجال تطوير البرمجيات والذكاء الاصطناعي وتقديم الحلول الرقمية المبتكرة."
        },
        {
            "company_english_name": "Advanced Tech Hub",
            "company_arabic_name": "مركز التقنية المتقدمة",
            "company_email": "techhub@faeda.jobs",
            "company_mobile": "0559876543",
            "country": "المملكة العربية السعودية",
            "state": "جدة",
            "company_type": "تقنية وبحث وتطوير",
            "company_size": "20-50 موظف",
            "company_field": "الذكاء الاصطناعي وتحليل البيانات",
            "login_password": "Password123!",
            "activated": True,
            "company_website": "https://techhub.example.com",
            "about_company_arabic": "نحن نبتكر الحلول الذكية ونقود التحول الرقمي للمؤسسات الكبرى."
        }
    ]

    created_companies = []
    for comp_data in sample_companies:
        comp = Company.query.filter_by(company_email=comp_data["company_email"]).first()
        if not comp:
            comp = Company(**comp_data)
            comp.status = "active"
            comp.is_verified = True
            db.session.add(comp)
            db.session.flush()
        created_companies.append(comp)

    db.session.commit()

    # 3. Sample Jobs
    if created_companies:
        target_company = created_companies[0]

        sample_jobs = [
            {
                "title": "مطور فرونت إند Senior React Developer",
                "job_type": "دوام كامل",
                "town": "الرياض",
                "company_about": "شركة الحلول الرقمية رائدة في الابتكار الرقمي وتطوير المنتجات العالية الكفاءة.",
                "job_description": "نبحث عن مطور فرونت إند محترف يمتلك خبرة عميقة في React 19, TypeScript, و Tailwind CSS لبناء واجهات مستخدم سلسة وعالية الأداء.",
                "specialization": "تقنية المعلومات والبرمجيات",
                "skills_years": "3 - 5 سنوات",
                "educational_qualification": "بكالوريوس علوم حاسب أو هندسة برمجيات",
                "workplace": "الرياض - أو عمل عن بعد",
                "company_id": target_company.id,
                "salary_min": 14000,
                "salary_max": 20000,
                "required_skills": "React, TypeScript, Tailwind CSS, REST APIs, Git",
                "preferred_work_style": "مرن / هجين"
            },
            {
                "title": "مهندس ذكاء اصطناعي وتعلم آلة AI Engineer",
                "job_type": "دوام كامل",
                "town": "جدة",
                "company_about": "مركز التقنية المتقدمة المتخصص في معالجة اللغات الطبيعية وبناء نماذج الذكاء الاصطناعي.",
                "job_description": "تطوير وبناء نماذج اللغات الضخمة LLMs ومعالجة البيانات والنصوص العربية بدقة عالية.",
                "specialization": "تقنية المعلومات والبرمجيات",
                "skills_years": "4 - 6 سنوات",
                "educational_qualification": "بكالوريوس / ماجستير ذكاء اصطناعي أو علوم حاسب",
                "workplace": "جدة",
                "company_id": target_company.id,
                "salary_min": 18000,
                "salary_max": 26000,
                "required_skills": "Python, PyTorch, Transformers, LLMs, LangChain",
                "preferred_work_style": "حضوري"
            },
            {
                "title": "مصمم واجهات وتجربة المستخدم UI/UX Designer",
                "job_type": "دوام كامل",
                "town": "الرياض",
                "company_about": "بيئة عمل إبداعية تهتم بالتفاصيل والتجربة الفريدة للمستخدم.",
                "job_description": "تصميم الرحلات الرقمية ونماذج Figma وصياغة لغة تصميم موحدة لمنتجاتنا.",
                "specialization": "التصميم والفنون",
                "skills_years": "2 - 4 سنوات",
                "educational_qualification": "بكالوريوس تصميم أو تخصص ذات صلة",
                "workplace": "الرياض",
                "company_id": target_company.id,
                "salary_min": 11000,
                "salary_max": 16000,
                "required_skills": "Figma, Wireframing, User Research, Prototyping",
                "preferred_work_style": "هجين"
            }
        ]

        for job_data in sample_jobs:
            existing_job = Jobs.query.filter_by(title=job_data["title"], company_id=job_data["company_id"]).first()
            if not existing_job:
                job = Jobs(**job_data)
                job.status = "approved"
                job.is_featured = True
                db.session.add(job)

        db.session.commit()

    # 4. Sample Candidates & Teams
    from services.teams import team_members_association

    sample_candidates = [
        {
            "user_id": "cand-101",
            "fullname": "أحمد المنصور",
            "email": "ahmed.almansour@example.com",
            "mobile": "0501112233",
            "password": "Password123!",
            "about": "مطور فرونت إند وتطبيقات ويب محترف بخبرة 5 سنوات في بناء واجهات المستخدم الحديثة.",
            "preferred_field_of_work": "تطوير البرمجيات والويب",
            "years_of_skills": "5 سنوات",
            "government": "الرياض",
            "country": "المملكة العربية السعودية",
            "activated": True,
            "status": "active"
        },
        {
            "user_id": "cand-102",
            "fullname": "سارة العتيبي",
            "email": "sara.otaibi@example.com",
            "mobile": "0502223344",
            "password": "Password123!",
            "about": "مصممة تجربة وواجهات مستخدم UI/UX متخصصة في أنظمة التصميم والتفاعلات البرمجية.",
            "preferred_field_of_work": "التصميم والفنون الرقمية",
            "years_of_skills": "4 سنوات",
            "government": "الرياض",
            "country": "المملكة العربية السعودية",
            "activated": True,
            "status": "active"
        },
        {
            "user_id": "cand-103",
            "fullname": "عمر الشمري",
            "email": "omar.shammari@example.com",
            "mobile": "0503334455",
            "password": "Password123!",
            "about": "مهندس أنظمة خلفية وحلول سحابية متخصص في Python, Node.js و Microservices.",
            "preferred_field_of_work": "هندسة البرمجيات والنظم",
            "years_of_skills": "6 سنوات",
            "government": "الرياض",
            "country": "المملكة العربية السعودية",
            "activated": True,
            "status": "active"
        },
        {
            "user_id": "cand-104",
            "fullname": "ريم الحارثي",
            "email": "reem.harthi@example.com",
            "mobile": "0504445566",
            "password": "Password123!",
            "about": "مهندسة ذكاء اصطناعي ومعالجة لغات طبيعية متخصصة في نماذج اللغات الضخمة LLMs.",
            "preferred_field_of_work": "الذكاء الاصطناعي وعلم البيانات",
            "years_of_skills": "4 سنوات",
            "government": "جدة",
            "country": "المملكة العربية السعودية",
            "activated": True,
            "status": "active"
        },
        {
            "user_id": "cand-105",
            "fullname": "فيصل القحطاني",
            "email": "faisal.qahtani@example.com",
            "mobile": "0505556677",
            "password": "Password123!",
            "about": "مهندس بيانات وبنية تحتية متمرس في بناء أنابيب البيانات وتحليل البيانات الضخمة.",
            "preferred_field_of_work": "هندسة البيانات",
            "years_of_skills": "3 سنوات",
            "government": "الظهران",
            "country": "المملكة العربية السعودية",
            "activated": True,
            "status": "active"
        }
    ]

    seeded_candidates = {}
    for c_data in sample_candidates:
        c = Customers.query.filter_by(user_id=c_data["user_id"]).first()
        if not c:
            c = Customers(**c_data)
            db.session.add(c)
            db.session.flush()
        seeded_candidates[c_data["user_id"]] = c

    db.session.commit()

    sample_teams = [
        {
            "team_name": "فريق المنتجات الرقمية (Digital Product Team)",
            "about": "فريق متكامل لبناء وتطوير المنتجات الرقمية وتطبيقات الويب والموبايل من الفكرة وحتى الإطلاق والتشغيل.",
            "general_program": "تطوير البرمجيات والمنتجات الرقمية",
            "semi_special_program": "تطبيقات الويب والموبايل السحابية",
            "special_program": "React, TypeScript, Node.js, Python, Figma, Cloud AWS",
            "achievements": "تطوير وإطلاق 8 منتجات رقمية عالية الجودة بنجاح",
            "admin_id": "cand-101",
            "members": ["cand-101", "cand-102", "cand-103"]
        },
        {
            "team_name": "مختبر الذكاء الاصطناعي والبيانات (AI & Data Science Lab)",
            "about": "تطوير نماذج الذكاء الاصطناعي، معالجة النصوص العربية، وبناء أنظمة التوصية وأنابيب البيانات الضخمة.",
            "general_program": "الذكاء الاصطناعي وعلم البيانات",
            "semi_special_program": "معالجة اللغات الطبيعية وتعلم الآلة",
            "special_program": "Python, PyTorch, Transformers, LLMs, LangChain, Big Data",
            "achievements": "تطوير نماذج ذكية معالجة للغة العربية وتحليلات سريعة",
            "admin_id": "cand-104",
            "members": ["cand-104", "cand-105"]
        },
        {
            "team_name": "استوديو تصميم تجربة المستخدم (UI/UX Design Studio)",
            "about": "نبتكر تجارب مستخدم فريدة، نصمم أنظمة التصميم الموحدة، ونقود أبحاث المستخدم للمنتجات الرقمية.",
            "general_program": "تصميم واجهات وتجربة المستخدم",
            "semi_special_program": "أنظمة التصميم وأبحاث المستخدم",
            "special_program": "Figma, User Research, Design Systems, Prototyping, Wireframing",
            "achievements": "بناء 5 أنظمة تصميم موحدة لمؤسسات تقنية رائدة",
            "admin_id": "cand-102",
            "members": ["cand-102"]
        }
    ]

    for t_data in sample_teams:
        existing_team = Teams.query.filter_by(team_name=t_data["team_name"]).first()
        if not existing_team:
            member_uids = t_data.pop("members")
            team = Teams(**t_data)
            db.session.add(team)
            db.session.flush()

            for uid in member_uids:
                cand = seeded_candidates.get(uid)
                if cand:
                    db.session.execute(team_members_association.insert().values(
                        team_id=team.id,
                        member_id=cand.user_id,
                        status='منضم',
                        general_program=t_data.get("general_program"),
                        special_program=t_data.get("special_program")
                    ))

    db.session.commit()

    print("Development data seeding complete successfully!")
