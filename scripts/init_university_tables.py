#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
init_university_tables.py — Initializes University tables and seeds initial academic institutions.
"""
import os
import sys
from datetime import datetime

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import create_app, db
from services.university import University, UniversityDepartment, AcademicVerification
from services.customer import Customers

def init_universities():
    app = create_app()
    with app.app_context():
        print("[*] Creating university database tables...")
        db.create_all()

        # Seed King Saud University (KSU)
        ksu = University.query.filter_by(email="careers@ksu.edu.sa").first()
        if not ksu:
            print("[+] Seeding King Saud University...")
            ksu = University(
                name_ar="جامعة الملك سعود",
                name_en="King Saud University",
                email="careers@ksu.edu.sa",
                password="ksu_password_123",
                description_ar="جامعة رائدة تسعى إلى الريادة العالمية والتميز في بناء مجتمع المعرفة والشراكة المهنية.",
                description_en="Premier research university in Saudi Arabia dedicated to academic excellence.",
                location="الرياض",
                country="المملكة العربية السعودية",
                website="https://ksu.edu.sa",
                institution_type="جامعة حكومية",
                qs_rank="#203 عالمياً (الأولى محلياً)",
                phone="+966114670000",
                dean_name="د. محمد بن فهد التميمي",
                career_center_email="career-hub@ksu.edu.sa",
                is_verified=True,
                status="active"
            )
            db.session.add(ksu)
            db.session.commit()

            # Add Departments
            depts = [
                UniversityDepartment(
                    university_id=ksu.id,
                    name_ar="علوم الحاسب",
                    name_en="Computer Science",
                    faculty="كلية علوم الحاسب والمعلومات",
                    degree_levels="بكالوريوس, ماجستير, دكتوراه",
                    description="قسم علوم الحاسب يغطي هندسة الخوارزميات، الذكاء الاصطناعي، ومعمارية البرمجيات."
                ),
                UniversityDepartment(
                    university_id=ksu.id,
                    name_ar="هندسة البرمجيات",
                    name_en="Software Engineering",
                    faculty="كلية علوم الحاسب والمعلومات",
                    degree_levels="بكالوريوس, ماجستير",
                    description="تطوير الأنظمة السحابية الموزعة وجودة البرمجيات الحديثة."
                ),
                UniversityDepartment(
                    university_id=ksu.id,
                    name_ar="نظم المعلومات",
                    name_en="Information Systems",
                    faculty="كلية علوم الحاسب والمعلومات",
                    degree_levels="بكالوريوس, ماجستير",
                    description="تحليل البيانات، التحول الرقمي، وحلول الأعمال المؤسسية."
                ),
                UniversityDepartment(
                    university_id=ksu.id,
                    name_ar="الذكاء الاصطناعي وعلم البيانات",
                    name_en="Artificial Intelligence & Data Science",
                    faculty="كلية علوم الحاسب والمعلومات",
                    degree_levels="بكالوريوس, ماجستير, دكتوراه",
                    description="نماذج التعلم العميق، الرؤية الحاسوبية، ومعالجة اللغات الطبيعية."
                ),
                UniversityDepartment(
                    university_id=ksu.id,
                    name_ar="الأمن السيبراني",
                    name_en="Cybersecurity",
                    faculty="كلية علوم الحاسب والمعلومات",
                    degree_levels="بكالوريوس, ماجستير",
                    description="أمن البنى التحتية، الاستجابة للحوادث، واختبار الاختراق."
                ),
            ]
            for d in depts:
                db.session.add(d)
            db.session.commit()

        # Seed King Fahd University (KFUPM)
        kfupm = University.query.filter_by(email="careers@kfupm.edu.sa").first()
        if not kfupm:
            print("[+] Seeding KFUPM...")
            kfupm = University(
                name_ar="جامعة الملك فهد للبترول والمعادن",
                name_en="King Fahd University of Petroleum and Minerals",
                email="careers@kfupm.edu.sa",
                password="kfupm_password_123",
                description_ar="صرح تعليمي وهندسي رائد في إعداد الكفاءات التخصصية والبحث العلمي المتقدم.",
                description_en="Leading science and engineering university renowned for technical excellence.",
                location="الظهران",
                country="المملكة العربية السعودية",
                website="https://kfupm.edu.sa",
                institution_type="جامعة حكومية",
                qs_rank="#160 عالمياً",
                phone="+966138600000",
                dean_name="د. خالد بن سلطان العتيبي",
                career_center_email="careers@kfupm.edu.sa",
                is_verified=True,
                status="active"
            )
            db.session.add(kfupm)
            db.session.commit()

            kfupm_depts = [
                UniversityDepartment(
                    university_id=kfupm.id,
                    name_ar="علوم وهندسة الحاسب الآلي",
                    name_en="Computer Science & Engineering",
                    faculty="كلية هندسة وعلوم الحاسب",
                    degree_levels="بكالوريوس, ماجستير, دكتوراه",
                    description="هندسة الأنظمة المدمجة، الحوسبة السحابية، والبرمجيات المتقدمة."
                ),
                UniversityDepartment(
                    university_id=kfupm.id,
                    name_ar="الهندسة الكهربائية",
                    name_en="Electrical Engineering",
                    faculty="كلية العلوم الهندسية",
                    degree_levels="بكالوريوس, ماجستير, دكتوراه",
                    description="الشبكات الذكية، الاتصالات، ومعالجة الإشارات."
                ),
            ]
            for d in kfupm_depts:
                db.session.add(d)
            db.session.commit()

        # Connect any existing candidate with university="جامعة الملك سعود" to AcademicVerification
        cand = Customers.query.filter(
            (Customers.university.ilike("%سعود%")) | (Customers.university.ilike("%King Saud%"))
        ).first()
        if cand and ksu:
            verif = AcademicVerification.query.filter_by(university_id=ksu.id, customer_id=cand.id).first()
            if not verif:
                print(f"[+] Creating verified academic record for candidate: {cand.user_id}...")
                verif = AcademicVerification(
                    university_id=ksu.id,
                    customer_id=cand.id,
                    degree=cand.educational_qualification or "بكالوريوس",
                    department=cand.department_university or "علوم الحاسب",
                    graduation_year=cand.graduation_date or "2024",
                    gpa=cand.gpa or "4.85 / 5.0",
                    status="verified",
                    notes="تم التحقق من السجل الأكاديمي والوثيقة الرسمية من خلال عمادة القبول والتسجيل."
                )
                verif.verified_at = datetime.utcnow()
                verif.verified_by = "د. محمد بن فهد التميمي"
                db.session.add(verif)
                db.session.commit()

        print("[OK] University tables and initial seed data created successfully!")

if __name__ == '__main__':
    init_universities()
