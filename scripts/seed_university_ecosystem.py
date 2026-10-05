#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
seed_university_ecosystem.py
Seeds King Faisal University (Al-Ahsa), Monsha'at Incubator Ventures, Thesis Campaigns,
and Cooperative Training & Professor Supervision data.
"""
import os
import sys
from datetime import datetime

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import create_app, db
from services.university import (
    University, UniversityDepartment, AcademicVerification,
    UniversityThesisCampaign, UniversityIncubatorVenture,
    CoopTrainingSupervision, ProfessorSupervisionSchedule
)
from services.customer import Customers

def seed_ecosystem():
    app = create_app()
    with app.app_context():
        print("[*] Creating all database tables...")
        db.create_all()

        # 1. Seed King Faisal University in Al-Ahsa
        kfu = University.query.filter_by(email="careers@kfu.edu.sa").first()
        if not kfu:
            print("[+] Seeding King Faisal University (Al-Ahsa)...")
            kfu = University(
                name_ar="جامعة الملك فيصل",
                name_en="King Faisal University",
                email="careers@kfu.edu.sa",
                password="kfu_password_123",
                description_ar="صرح أكاديمي وبحثي رائد في محافظة الأحساء، متميز في تحقيق الأمن الغذائي والاستدامة البيئية، وحاضن لأولى حاضنات منشآت لريادة الأعمال الجامعية بالمملكة.",
                description_en="Leading university in Al-Ahsa dedicated to food security, environmental sustainability, and entrepreneurship innovation.",
                location="الأحساء",
                country="المملكة العربية السعودية",
                website="https://kfu.edu.sa",
                institution_type="جامعة حكومية",
                qs_rank="#350 عالمياً (الرائدة في الزراعة والتقنية)",
                phone="+966135890000",
                dean_name="أ.د. عبد الله بن خالد الدوسري",
                career_center_email="graduates@kfu.edu.sa",
                is_verified=True,
                status="active"
            )
            db.session.add(kfu)
            db.session.commit()

            # Add Departments
            depts = [
                UniversityDepartment(
                    university_id=kfu.id,
                    name_ar="علوم الحاسب وتقنية المعلومات",
                    name_en="Computer Science & Information Technology",
                    faculty="كلية علوم الحاسب وتقنية المعلومات",
                    degree_levels="بكالوريوس, ماجستير, دكتوراه",
                    description="الذكاء الاصطناعي، إنترنت الأشياء، والأنظمة الموزعة."
                ),
                UniversityDepartment(
                    university_id=kfu.id,
                    name_ar="هندسة البرمجيات",
                    name_en="Software Engineering",
                    faculty="كلية علوم الحاسب وتقنية المعلومات",
                    degree_levels="بكالوريوس, ماجستير",
                    description="معمارية البرمجيات السحابية، الجودة واختبار الأنظمة."
                ),
                UniversityDepartment(
                    university_id=kfu.id,
                    name_ar="العلوم الزراعية وهندسة الأغذية",
                    name_en="Agricultural & Food Sciences",
                    faculty="كلية العلوم الزراعية والأغذية",
                    degree_levels="بكالوريوس, ماجستير, دكتوراه",
                    description="التقنيات الزراعية الذكية (AgTech) واستدامة المحاصيل والأمن الغذائي."
                ),
                UniversityDepartment(
                    university_id=kfu.id,
                    name_ar="إدارة الأعمال ونظم المعلومات الإدارية",
                    name_en="Business & Management Information Systems",
                    faculty="كلية إدارة الأعمال",
                    degree_levels="بكالوريوس, ماجستير",
                    description="التحول الرقمي، ريادة الأعمال، وإدارة سلاسل الإمداد."
                ),
                UniversityDepartment(
                    university_id=kfu.id,
                    name_ar="الأمن السيبراني والتحري الرقمي",
                    name_en="Cybersecurity & Digital Forensics",
                    faculty="كلية علوم الحاسب وتقنية المعلومات",
                    degree_levels="بكالوريوس, ماجستير",
                    description="حماية البنى التحتية الحيوية وأمن الأنظمة السحابية."
                ),
            ]
            for d in depts:
                db.session.add(d)
            db.session.commit()
        else:
            print("[i] King Faisal University already exists.")

        # Ensure KSU also exists
        ksu = University.query.filter((University.name_ar.ilike("%سعود%")) | (University.email == "careers@ksu.edu.sa")).first()

        target_uni = kfu or ksu

        # 2. Seed University Thesis & Innovation Marketing Campaigns
        if target_uni:
            camp_count = UniversityThesisCampaign.query.filter_by(university_id=target_uni.id).count()
            if camp_count == 0:
                print(f"[+] Seeding University Thesis & Innovation Marketing Campaigns for {target_uni.name_ar}...")
                c1 = UniversityThesisCampaign(
                    university_id=target_uni.id,
                    researcher_name="م. سارة بنت عبد العزيز العتيبي",
                    researcher_title="باحثة ماجستير في الذكاء الاصطناعي وهندسة البيانات",
                    researcher_email="sara.otaibi@alumni.kfu.edu.sa",
                    researcher_img="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
                    thesis_title="خوارزمية هجينة لترشيد الري الذكي واستدامة واحات الأحساء الزراعية باستخدام إنترنت الأشياء والتعلم العميق",
                    thesis_type="رسالة ماجستير",
                    department="كلية علوم الحاسب وتقنية المعلومات - قسم الذكاء الاصطناعي",
                    supervisor_name="أ.د. عبد الله بن خالد الدوسري",
                    summary="قدمت هذه الرسالة نموذجاً حسابياً مبتكراً يدمج بيانات استشعار رطوبة التربة عبر إنترنت الأشياء مع صور الأقمار الصناعية لتوجيه الري الدقيق لنخيل التمر في واحة الأحساء. أثبتت التجارب الميدانية خفض استهلاك المياه الجوفية بنسبة 38.4% وزيادة إنتاجية المحصول بنسبة 14.2% مقارنة بالطرق التقليدية.",
                    commercial_readiness_level="TRL 7 - نموذج صناعي مجرب ميدانياً",
                    target_audience="استثمار صناعي / ترخيص تجاري لبراءة الاختراع",
                    tags="IoT, Deep Learning, AgTech, Al-Ahsa Oasis, Water Sustainability, Vision 2030",
                    banner_url="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1200&h=500&fit=crop",
                    university_logo_endorsed=True,
                    endorsement_text="معتمد رسمياً من وكالة الجامعة للدراسات العليا والبحث العلمي - جامعة الملك فيصل",
                    views_count=1840,
                    inquiries_count=46,
                    sponsorship_leads=9,
                    status="active"
                )

                c2 = UniversityThesisCampaign(
                    university_id=target_uni.id,
                    researcher_name="د. عبد الله بن خالد الدوسري وم. فيصل الحليبي",
                    researcher_title="فريق الابتكار وحاضنة التقنيات الحيوية",
                    researcher_email="innovation-team@kfu.edu.sa",
                    researcher_img="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
                    thesis_title="نظام كشف مبكر عن سوسة النخيل الحمراء باستخدام الطائرات المسيّرة (الدرونز) وتحليل الأطياف الضوئية",
                    thesis_type="براءة اختراع وابتكار جامعي",
                    department="مركز التميز البحثي في النخيل والتمور",
                    supervisor_name="وكالة الجامعة للبحث والابتكار",
                    summary="ابتكار تقني مسجل كبراءة اختراع وطنية يتيح مسح مساحات شاسعة من مزارع النخيل بدقة متناهية عبر كاميرات متعددة الأطياف محمولة جواً، واكتشاف الإصابات في المراحل الأولى قبل ظهور الأعراض الخارجية بدقة تجاوزت 96.3%.",
                    commercial_readiness_level="TRL 8 - نظام تجاري جاهز للترخيص",
                    target_audience="شراكة بحث وتطوير R&D مع الشركات الزراعية الكبرى",
                    tags="Drones, Computer Vision, Red Palm Weevil, Agro-Security, Spectral Analysis",
                    banner_url="https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1200&h=500&fit=crop",
                    university_logo_endorsed=True,
                    endorsement_text="براءة اختراع معتمدة ومسجلة برعاية جامعة الملك فيصل",
                    views_count=2420,
                    inquiries_count=62,
                    sponsorship_leads=14,
                    status="active"
                )

                c3 = UniversityThesisCampaign(
                    university_id=target_uni.id,
                    researcher_name="م. عمر بن خالد المنصور",
                    researcher_title="باحث ماجستير في هندسة البرمجيات السحابية",
                    researcher_email="omar.mansoor@alumni.kfu.edu.sa",
                    researcher_img="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
                    thesis_title="معمارية حوسبة سحابية موزعة لترميز وتتبع أصول سلاسل الإمداد الغذائي والتمور بتقنية البلوكشين",
                    thesis_type="رسالة ماجستير",
                    department="كلية علوم الحاسب وتقنية المعلومات",
                    supervisor_name="د. خالد بن إبراهيم السليمان",
                    summary="تصميم بنية تحتية سحابية لامركزية عالية الأداء لتوثيق جودة المحاصيل وشهادات الزراعة العضوية من المزرعة إلى موائد المستهلك النهائي دولياً مع تقليل زمن الاستجابة بنسبة 60%.",
                    commercial_readiness_level="TRL 6 - نموذج أولي تجريبي",
                    target_audience="استقطاب كفاءات بحثية وتوظيف الباحث / استثمار أولي",
                    tags="Blockchain, Cloud Architecture, Supply Chain, Microservices, Smart Contracts",
                    banner_url="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=500&fit=crop",
                    university_logo_endorsed=True,
                    endorsement_text="معتمد رسمياً من كلية علوم الحاسب وتقنية المعلومات",
                    views_count=1350,
                    inquiries_count=32,
                    sponsorship_leads=7,
                    status="active"
                )

                db.session.add_all([c1, c2, c3])
                db.session.commit()
                print("[OK] Seeded 3 Thesis/Innovation Marketing Campaigns!")

        # 3. Seed Monsha'at Incubator Ventures at King Faisal University (Al-Ahsa)
        if target_uni:
            vent_count = UniversityIncubatorVenture.query.filter_by(university_id=target_uni.id).count()
            if vent_count == 0:
                print(f"[+] Seeding Monsha'at Incubator Ventures for {target_uni.name_ar}...")
                v1 = UniversityIncubatorVenture(
                    university_id=target_uni.id,
                    incubator_name="حاضنة منشآت - جامعة الملك فيصل بالأحساء",
                    company_name_ar="شركة نخيل وهكتار للتقنية الزراعية (Hectare AgTech)",
                    company_name_en="Hectare AgTech Solutions",
                    logo="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&h=150&fit=crop",
                    founder_name="م. عبد العزيز بن سعد الحليبي",
                    founder_major="نظم المعلومات الإدارية والتقنية",
                    founder_graduation_year="2023",
                    graduation_cohort="الدفعة الرابعة - حاضنة منشآت 2024",
                    business_activity="التقنية الزراعية المتقدمة وإنترنت الأشياء (AgTech)",
                    products_and_services="محطات رصد مناخي وتربة ذكية، منصة رقمية لإدارة الري المؤتمت لمزارع النخيل بواحة الأحساء، وحلول توفير المياه والسماد بنسبة 40%.",
                    status="خريج حاضنة - شركة نشطة ومستثمر بها",
                    jobs_created=14,
                    funding_raised_sar=1850000,
                    university_criteria_connection="معيار الاعتماد الأكاديمي 7.4 (الابتكار والتنمية الإقليمية): مساهمة مخرجات الحاضنة في مبادرة السعودية الخضراء واستدامة واحة الأحساء.",
                    academic_material_updates="تم إدراج دراسة حالة حية عن الشركة في مقرر 'ريادة الأعمال التكنولوجية (ENT-302)' لطلاب كليتي الحاسب والزراعة."
                )

                v2 = UniversityIncubatorVenture(
                    university_id=target_uni.id,
                    incubator_name="حاضنة منشآت - جامعة الملك فيصل بالأحساء",
                    company_name_ar="منصة تمور الأحساء الرقمية (AhsaDates Direct)",
                    company_name_en="AhsaDates Direct Platform",
                    logo="https://images.unsplash.com/photo-1542744094-24638eff58bb?w=150&h=150&fit=crop",
                    founder_name="نورة بنت عبد الرحمن العبد القادر",
                    founder_major="إدارة الأعمال والتسويق الدولي",
                    founder_graduation_year="2024",
                    graduation_cohort="الدفعة الخامسة - حاضنة منشآت 2025",
                    business_activity="التجارة الإلكترونية الموثقة وسلاسل الإمداد المبرد",
                    products_and_services="منصة رقمية موحدة للربط المباشر بين مزارعي الأحساء والمشترين الدوليين، مع فحص الجودة المخبري الرقمي وتتبع المنشأ الجغرافي المعتمد.",
                    status="خريج حاضنة - في مرحلة التوسع والنمو",
                    jobs_created=9,
                    funding_raised_sar=950000,
                    university_criteria_connection="معيار الشراكة المجتمعية 5.1: تمكين صغار المزارعين وخريجي الجامعة من النفاذ للأسواق العالمية وزيادة المحتوى المحلي.",
                    academic_material_updates="تحديث مقرر 'التجارة الإلكترونية والتسويق الرقمي (MKT-410)' بنموذج عمل المنصة وآليات التسعير الديناميكي."
                )

                v3 = UniversityIncubatorVenture(
                    university_id=target_uni.id,
                    incubator_name="حاضنة منشآت - جامعة الملك فيصل بالأحساء",
                    company_name_ar="شركة واحة لوجستيك لحلول الذكاء الاصطناعي (Waha AI Logistics)",
                    company_name_en="Waha AI Logistics",
                    logo="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=150&h=150&fit=crop",
                    founder_name="م. طارق بن سليمان العيسى",
                    founder_major="علوم الحاسب وهندسة البرمجيات",
                    founder_graduation_year="2023",
                    graduation_cohort="الدفعة الثالثة - حاضنة منشآت 2023",
                    business_activity="الخدمات اللوجستية الذكية وخوارزميات توجيه الأساطيل",
                    products_and_services="محرك تنبؤي لتوجيه شاحنات التبريد وسلاسل الإمداد اللوجستي في المنطقة الشرقية باستخدام الذكاء الاصطناعي وخفض انبعاثات الكربون.",
                    status="خريج حاضنة - شركة نشطة تجارياً",
                    jobs_created=11,
                    funding_raised_sar=1400000,
                    university_criteria_connection="معيار مواءمة مخرجات التعلم مع الثورة الصناعية الرابعة ومتطلبات الهيئة الوطنية للتقويم والاعتماد الأكاديمي (NCAAA).",
                    academic_material_updates="استضافة مؤسس الشركة سنوياً كمحاضر صناعي زائر في مقرر 'مشاريع التخرج والذكاء الاصطناعي'."
                )

                db.session.add_all([v1, v2, v3])
                db.session.commit()
                print("[OK] Seeded 3 Monsha'at Incubator Ventures!")

        # 4. Seed Cooperative Training (التدريب التعاوني) & Professor Supervision Portal
        if target_uni:
            coop_count = CoopTrainingSupervision.query.filter_by(university_id=target_uni.id).count()
            if coop_count == 0:
                print(f"[+] Seeding Cooperative Training & Professor Supervision for {target_uni.name_ar}...")
                
                prof_id = "prof_khalid_sulaiman"
                prof_name = "د. خالد بن إبراهيم السليمان"
                prof_email = "k.sulaiman@kfu.edu.sa"
                prof_dept = "كلية علوم الحاسب وتقنية المعلومات"

                s1 = CoopTrainingSupervision(
                    university_id=target_uni.id,
                    professor_id=prof_id,
                    professor_name=prof_name,
                    professor_title="أستاذ مشارك - المشرف الأكاديمي للتدريب التعاوني",
                    professor_email=prof_email,
                    professor_department=prof_dept,
                    student_name="عمر بن خالد المنصور",
                    student_id_number="220108342",
                    student_major="هندسة البرمجيات والأنظمة الموزعة",
                    company_name="شركة أرامكو السعودية - مركز الابتكار الرقمي بالأحساء",
                    company_location="الأحساء - طريق الظهران، مجمع واحة الابتكار",
                    trainer_name="م. فيصل بن طارق الشمري",
                    trainer_specialization="كبير مهندسي السحابة وحلول DevOps",
                    trainer_phone="+966551234567",
                    trainer_email="faisal.shammari@aramco.com",
                    training_start_date="2026-06-01",
                    training_end_date="2026-10-30",
                    total_required_hours=400,
                    completed_hours=340,
                    midterm_score=29,
                    final_score=None,
                    status="تدريب نشط - بانتظار التقييم النهائي",
                    notes="أداء متميز في تطوير واجهات برمجة التطبيقات (APIs) الموزعة، وتقارير أسبوعية منتظمة."
                )

                s2 = CoopTrainingSupervision(
                    university_id=target_uni.id,
                    professor_id=prof_id,
                    professor_name=prof_name,
                    professor_title="أستاذ مشارك - المشرف الأكاديمي للتدريب التعاوني",
                    professor_email=prof_email,
                    professor_department=prof_dept,
                    student_name="سلمان بن عبد الله الدوسري",
                    student_id_number="220105419",
                    student_major="الذكاء الاصطناعي وعلم البيانات",
                    company_name="شركة عِلم (Elm) - قطاع الحلول الحكومية",
                    company_location="الخبر - مجمع أبراج السروات للتقنية والابتكار",
                    trainer_name="د. مشاعل بنت ناصر القحطاني",
                    trainer_specialization="رئيسة فرق خوارزميات التعلم الآلي والبيانات الضخمة",
                    trainer_phone="+966558765432",
                    trainer_email="mashael.qahtani@elm.sa",
                    training_start_date="2026-06-15",
                    training_end_date="2026-11-15",
                    total_required_hours=400,
                    completed_hours=310,
                    midterm_score=28,
                    final_score=None,
                    status="تدريب نشط",
                    notes="يعمل ضمن فريق بناء النماذج التنبؤية، ملتزم بالحضور والمناقشات الفنية."
                )

                s3 = CoopTrainingSupervision(
                    university_id=target_uni.id,
                    professor_id=prof_id,
                    professor_name=prof_name,
                    professor_title="أستاذ مشارك - المشرف الأكاديمي للتدريب التعاوني",
                    professor_email=prof_email,
                    professor_department=prof_dept,
                    student_name="ريم بنت فهد الحليبي",
                    student_id_number="220109981",
                    student_major="الأمن السيبراني والتحري الرقمي",
                    company_name="شركة stc حلول (Solutions by stc)",
                    company_location="الدمام - برج حلول للاتصالات وتقنية المعلومات",
                    trainer_name="م. تركي بن سعد العتيبي",
                    trainer_specialization="مدير مركز العمليات الأمنية السيبرانية (SOC Manager)",
                    trainer_phone="+966559876543",
                    trainer_email="turki.otaibi@solutions.com.sa",
                    training_start_date="2026-05-15",
                    training_end_date="2026-09-30",
                    total_required_hours=400,
                    completed_hours=400,
                    midterm_score=30,
                    final_score=68,
                    status="مكتمل وناجح - تقييم ممتاز",
                    notes="أكملت الساعات المطلوبة بنجاح باهر وقدمت عرضاً نهائياً أمام لجنة التقييم المشتركة."
                )

                s4 = CoopTrainingSupervision(
                    university_id=target_uni.id,
                    professor_id=prof_id,
                    professor_name=prof_name,
                    professor_title="أستاذ مشارك - المشرف الأكاديمي للتدريب التعاوني",
                    professor_email=prof_email,
                    professor_department=prof_dept,
                    student_name="أحمد بن عبد الرحمن الملحم",
                    student_id_number="220107223",
                    student_major="نظم المعلومات الإدارية والتحول الرقمي",
                    company_name="شركة المراعي - قطاع الأتمتة وسلاسل الإمداد",
                    company_location="الهفوف، الأحساء - المنطقة الصناعية الأولى",
                    trainer_name="أ. ماجد بن عبد العزيز التميمي",
                    trainer_specialization="خبير أنظمة ERP والتحول الرقمي المؤسسي",
                    trainer_phone="+966554321987",
                    trainer_email="majed.tamimi@almarai.com",
                    training_start_date="2026-06-01",
                    training_end_date="2026-10-31",
                    total_required_hours=400,
                    completed_hours=290,
                    midterm_score=27,
                    final_score=None,
                    status="تدريب نشط",
                    notes="مشارك فاعل في مشروع ترقية نظام SAP بالمستودعات الذكية بالأحساء."
                )

                s5 = CoopTrainingSupervision(
                    university_id=target_uni.id,
                    professor_id=prof_id,
                    professor_name=prof_name,
                    professor_title="أستاذ مشارك - المشرف الأكاديمي للتدريب التعاوني",
                    professor_email=prof_email,
                    professor_department=prof_dept,
                    student_name="منى بنت عيسى الغنام",
                    student_id_number="220103114",
                    student_major="علوم الحاسب - هندسة واجهات وتجربة المستخدم",
                    company_name="مصرف الإنماء - الإدارة الرقمية وتقنية المعلومات",
                    company_location="الرياض - طريق الملك فهد، المركز المالي",
                    trainer_name="م. ريان بن خالد السيف",
                    trainer_specialization="رئيس فرق التصميم وتجربة المستخدم الرقمية (Head of UX)",
                    trainer_phone="+966556543210",
                    trainer_email="rayan.seif@alinma.com",
                    training_start_date="2026-06-01",
                    training_end_date="2026-10-30",
                    total_required_hours=400,
                    completed_hours=360,
                    midterm_score=29,
                    final_score=None,
                    status="تدريب نشط",
                    notes="أبدعت في تصميم تدفقات الخدمات المصرفية المفتوحة ووثقت نتائج اختبارات المستخدمين."
                )

                db.session.add_all([s1, s2, s3, s4, s5])
                db.session.commit()

                # Seed Professor Supervision Schedule
                sch1 = ProfessorSupervisionSchedule(
                    university_id=target_uni.id,
                    supervision_id=s1.id,
                    professor_id=prof_id,
                    date_time="2026-10-06 10:30 ص",
                    event_type="زيارة إشرافية ميدانية للشركة",
                    student_name=s1.student_name,
                    company_name=s1.company_name,
                    location=s1.company_location,
                    status="مجدولة",
                    notes="زيارة ميدانية رسمية لمقر أرامكو بالأحساء للاجتماع مع المدرب الميداني م. فيصل الشمري."
                )

                sch2 = ProfessorSupervisionSchedule(
                    university_id=target_uni.id,
                    supervision_id=s2.id,
                    professor_id=prof_id,
                    date_time="2026-10-08 01:00 م",
                    event_type="جلسة متابعة افتراضية عبر المنصة",
                    student_name=s2.student_name,
                    company_name=s2.company_name,
                    location="اتصال مرئي مباشر (Microsoft Teams)",
                    status="مجدولة",
                    notes="مراجعة تقدم نموذج الذكاء الاصطناعي والتحقق من التقرير الدوري الخامس."
                )

                sch3 = ProfessorSupervisionSchedule(
                    university_id=target_uni.id,
                    supervision_id=s4.id,
                    professor_id=prof_id,
                    date_time="2026-10-12 11:00 ص",
                    event_type="زيارة إشرافية ميدانية لمقر جهة التدريب",
                    student_name=s4.student_name,
                    company_name=s4.company_name,
                    location=s4.company_location,
                    status="مجدولة",
                    notes="الاطلاع على تطبيق الطالب لمفاهيم نظم المعلومات في مستودعات المراعي بالهفوف."
                )

                sch4 = ProfessorSupervisionSchedule(
                    university_id=target_uni.id,
                    supervision_id=s3.id,
                    professor_id=prof_id,
                    date_time="2026-10-15 02:30 م",
                    event_type="مناقشة التقرير الفني النهائي والتقييم الختامي",
                    student_name=s3.student_name,
                    company_name=s3.company_name,
                    location="قاعة السمينار 204 - كلية علوم الحاسب وتقنية المعلومات",
                    status="مجدولة",
                    notes="مناقشة حضورية للتقرير النهائي بحضور ممثل من شركة stc حلول."
                )

                db.session.add_all([sch1, sch2, sch3, sch4])
                db.session.commit()
                print("[OK] Seeded Cooperative Training Students & Professor Supervision Schedule!")

        print("\n[SUCCESS] Ecosystem seeding completed successfully!")

if __name__ == '__main__':
    seed_ecosystem()
