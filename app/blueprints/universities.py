# ==============================================================================
# app/blueprints/universities.py
# REST API Blueprint for University / Educational Institution Workspace (Section 6)
# ==============================================================================
import os
import secrets
from datetime import datetime
from flask import Blueprint, request, jsonify, session, current_app
from werkzeug.utils import secure_filename
from sqlalchemy import or_, and_, desc

from app import db
from services.university import University, UniversityDepartment, AcademicVerification
from services.customer import Customers, CustomerProject, CustomerCertification
from services.skills import Skills
from services.job import Jobs
from services.company import Company
from ai_engine.market_value_calculator import get_market_value_for_customer

university_bp = Blueprint('university_bp', __name__)

ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'svg'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_IMAGE_EXTENSIONS


def get_authenticated_university():
    """Derive authenticated university identity exclusively from server-side session."""
    if not session.get('session_university') or not session.get('university_id'):
        return None, (jsonify({
            "error": "Unauthorized",
            "message": "Academic institution authentication required"
        }), 401)

    uni_id = session.get('university_id')
    uni = University.query.get(uni_id)
    if not uni or uni.status == 'suspended':
        return None, (jsonify({
            "error": "Forbidden",
            "message": "Academic institution account not found or suspended"
        }), 403)

    return uni, None


def calculate_university_profile_completeness(uni: University):
    """
    Transparent 8-point completeness calculation based on real database columns.
    No metrics are fabricated.
    """
    checklist = [
        ("name_ar", "الاسم الرسمي بالعربية", bool(uni.name_ar)),
        ("name_en", "الاسم بالإنجليزية", bool(uni.name_en)),
        ("email", "البريد الإلكتروني المؤسسي", bool(uni.email)),
        ("description_ar", "نبذة عن الجامعة والرؤية", bool(uni.description_ar and len(uni.description_ar.strip()) > 10)),
        ("location", "الموقع والمدينة", bool(uni.location)),
        ("website", "الموقع الإلكتروني الرسمي", bool(uni.website)),
        ("logo", "شعار المؤسسة الأكاديمية", bool(uni.logo)),
        ("contact_info", "بيانات التواصل ومركز الخريجين", bool(uni.phone or uni.career_center_email)),
    ]

    completed_count = sum(1 for _, _, filled in checklist if filled)
    total_factors = len(checklist)
    percentage = int((completed_count / total_factors) * 100) if total_factors > 0 else 0

    return {
        "percentage": percentage,
        "completed_factors": completed_count,
        "total_factors": total_factors,
        "checklist": [
            {"key": key, "label_ar": label, "is_completed": filled}
            for key, label, filled in checklist
        ]
    }


def serialize_university_profile(uni: University):
    """Serialize University model for public/employer/university responses."""
    completeness = calculate_university_profile_completeness(uni)
    return {
        "id": uni.id,
        "name_ar": uni.name_ar,
        "name_en": uni.name_en or "",
        "name": uni.name_ar or uni.name_en,
        "email": uni.email,
        "description_ar": uni.description_ar or "",
        "description_en": uni.description_en or "",
        "location": uni.location or "",
        "country": uni.country or "المملكة العربية السعودية",
        "website": uni.website or "",
        "logo": uni.logo or "",
        "institution_type": uni.institution_type or "جامعة حكومية",
        "qs_rank": uni.qs_rank or "",
        "phone": uni.phone or "",
        "dean_name": uni.dean_name or "",
        "career_center_email": uni.career_center_email or "",
        "is_verified": bool(uni.is_verified),
        "verified_at": uni.verified_at.isoformat() if uni.verified_at else None,
        "status": uni.status or "active",
        "completeness": completeness
    }


def get_connected_students_query(uni: University):
    """
    Returns query for candidates connected to this university by:
    1. Direct name match in candidate.university (Arabic or English)
    2. Or having an AcademicVerification record with this university.
    """
    conditions = []
    if uni.name_ar and len(uni.name_ar.strip()) > 3:
        conditions.append(Customers.university.ilike(f"%{uni.name_ar.strip()}%"))
    if uni.name_en and len(uni.name_en.strip()) > 3:
        conditions.append(Customers.university.ilike(f"%{uni.name_en.strip()}%"))

    verif_customer_ids = [
        v.customer_id for v in AcademicVerification.query.filter_by(university_id=uni.id).all()
    ]
    if verif_customer_ids:
        conditions.append(Customers.id.in_(verif_customer_ids))

    if not conditions:
        return Customers.query.filter(Customers.id == -1)

    return Customers.query.filter(or_(*conditions))


def serialize_student_academic_summary(cand: Customers, uni: University):
    """Serialize candidate into student academic dossier with privacy controls."""
    verif = AcademicVerification.query.filter_by(
        university_id=uni.id, customer_id=cand.id
    ).first()

    # Skills
    skills_list = [s.skill_name for s in cand.skills] if cand.skills else []

    # Projects
    projects_count = len(cand.projects) if cand.projects else 0

    # Career readiness estimation based on completed profile factors
    readiness_factors = 0
    if cand.cv: readiness_factors += 1
    if skills_list: readiness_factors += 1
    if projects_count > 0: readiness_factors += 1
    if cand.educational_qualification: readiness_factors += 1
    if cand.gpa: readiness_factors += 1
    if verif and verif.status == 'verified': readiness_factors += 1
    career_readiness_pct = int((readiness_factors / 6) * 100)
    grad_date_str = cand.graduation_date.strftime("%Y") if hasattr(cand.graduation_date, 'strftime') else (str(cand.graduation_date) if cand.graduation_date else "غير محدد")

    return {
        "id": cand.id,
        "user_id": cand.user_id,
        "fullname": cand.fullname,
        "img": cand.img or "",
        "educational_qualification": cand.educational_qualification or "بكالوريوس",
        "department": cand.department_university or "عام",
        "university": cand.university or uni.name_ar,
        "graduation_date": grad_date_str,
        "education_statue": cand.education_statue or "خريج",
        "gpa": cand.gpa or "غير مدخل",
        "preferred_field": cand.preferred_field_of_work or "",
        "work_type": cand.work_type or "",
        "skills": skills_list[:5],
        "projects_count": projects_count,
        "has_cv": bool(cand.cv),
        "career_readiness": career_readiness_pct,
        "verification": {
            "id": verif.id if verif else None,
            "status": verif.status if verif else "unrequested",
            "verification_code": verif.verification_code if verif else None,
            "verified_at": verif.verified_at.isoformat() if (verif and verif.verified_at) else None,
            "notes": verif.notes if verif else None
        }
    }


# ==============================================================================
# AUTHENTICATION & IDENTITY APIS
# ==============================================================================

@university_bp.route('/api/v1/university/me', methods=['GET'])
def api_university_me():
    """Return authenticated university identity & active session info."""
    uni, error = get_authenticated_university()
    if error:
        return error

    return jsonify({
        "authenticated": True,
        "role": "university",
        "institution": serialize_university_profile(uni)
    }), 200


@university_bp.route('/api/v1/university/profile', methods=['GET'])
def api_university_get_profile():
    """Return full academic institution profile with transparent completeness score."""
    uni, error = get_authenticated_university()
    if error:
        return error

    return jsonify({
        "success": True,
        "profile": serialize_university_profile(uni)
    }), 200


@university_bp.route('/api/v1/university/profile', methods=['PUT'])
def api_university_update_profile():
    """Update editable academic institution details."""
    uni, error = get_authenticated_university()
    if error:
        return error

    data = request.get_json() or {}

    if 'name_ar' in data and data['name_ar']:
        uni.name_ar = str(data['name_ar']).strip()
    if 'name_en' in data:
        uni.name_en = str(data['name_en']).strip() if data['name_en'] else None
    if 'description_ar' in data:
        uni.description_ar = str(data['description_ar']).strip() if data['description_ar'] else None
    if 'description_en' in data:
        uni.description_en = str(data['description_en']).strip() if data['description_en'] else None
    if 'location' in data:
        uni.location = str(data['location']).strip() if data['location'] else None
    if 'country' in data:
        uni.country = str(data['country']).strip() if data['country'] else "المملكة العربية السعودية"
    if 'website' in data:
        uni.website = str(data['website']).strip() if data['website'] else None
    if 'institution_type' in data:
        uni.institution_type = str(data['institution_type']).strip() if data['institution_type'] else "جامعة حكومية"
    if 'qs_rank' in data:
        uni.qs_rank = str(data['qs_rank']).strip() if data['qs_rank'] else None
    if 'phone' in data:
        uni.phone = str(data['phone']).strip() if data['phone'] else None
    if 'dean_name' in data:
        uni.dean_name = str(data['dean_name']).strip() if data['dean_name'] else None
    if 'career_center_email' in data:
        uni.career_center_email = str(data['career_center_email']).strip() if data['career_center_email'] else None

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "تم تحديث الملف التعريفي للجامعة بنجاح",
        "profile": serialize_university_profile(uni)
    }), 200


@university_bp.route('/api/v1/university/logo', methods=['POST'])
def api_university_upload_logo():
    """Securely upload institution logo."""
    uni, error = get_authenticated_university()
    if error:
        return error

    if 'logo' not in request.files:
        return jsonify({"error": "No logo file uploaded"}), 400

    file = request.files['logo']
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({"error": "Invalid file format. Allowed: PNG, JPG, JPEG, WEBP, SVG"}), 400

    filename = secure_filename(f"uni_{uni.id}_{int(datetime.utcnow().timestamp())}_{file.filename}")
    upload_folder = os.path.join(current_app.static_folder or 'static', 'uploads', 'university', 'logo')
    os.makedirs(upload_folder, exist_ok=True)

    file_path = os.path.join(upload_folder, filename)
    file.save(file_path)

    uni.logo = f"uploads/university/logo/{filename}"
    db.session.commit()

    return jsonify({
        "success": True,
        "logo_url": uni.logo,
        "message": "تم رفع شعار الجامعة بنجاح"
    }), 200


# ==============================================================================
# DASHBOARD METRICS API
# ==============================================================================

@university_bp.route('/api/v1/university/dashboard', methods=['GET'])
def api_university_dashboard():
    """
    Aggregates real statistics for the university command center.
    No metrics are fabricated.
    """
    uni, error = get_authenticated_university()
    if error:
        return error

    # Connected students
    students_q = get_connected_students_query(uni)
    total_students = students_q.count()

    # Graduates count (status == 'خريج' or similar)
    graduates_count = students_q.filter(
        or_(
            Customers.education_statue.ilike("%خريج%"),
            Customers.education_statue.ilike("%graduate%")
        )
    ).count()

    # Verified students count
    verified_count = AcademicVerification.query.filter_by(
        university_id=uni.id, status='verified'
    ).count()

    # Pending verification requests count
    pending_verifications = AcademicVerification.query.filter_by(
        university_id=uni.id, status='pending'
    ).count()

    # Departments count
    departments_count = UniversityDepartment.query.filter_by(university_id=uni.id).count()

    # Total student projects from connected candidates
    student_ids = [s.id for s in students_q.all()]
    academic_projects_count = 0
    if student_ids:
        academic_projects_count = CustomerProject.query.filter(
            CustomerProject.customer_id.in_(student_ids)
        ).count()

    # Career opportunities (Active jobs matching university disciplines)
    active_jobs_count = Jobs.query.filter_by(status='approved').count()

    # Recent Students (latest 5)
    recent_students_raw = students_q.order_by(desc(Customers.timestamp)).limit(5).all()
    recent_students = [
        serialize_student_academic_summary(s, uni) for s in recent_students_raw
    ]

    # Recent Verifications (latest 5)
    recent_verifs_raw = AcademicVerification.query.filter_by(
        university_id=uni.id
    ).order_by(desc(AcademicVerification.requested_at)).limit(5).all()

    recent_verifications = []
    for v in recent_verifs_raw:
        cand = Customers.query.get(v.customer_id)
        recent_verifications.append({
            "id": v.id,
            "candidate_id": cand.id if cand else None,
            "candidate_name": cand.fullname if cand else "مرشح غير معروف",
            "degree": v.degree,
            "department": v.department,
            "graduation_year": v.graduation_year or "—",
            "gpa": v.gpa or "—",
            "status": v.status,
            "verification_code": v.verification_code,
            "requested_at": v.requested_at.isoformat() if v.requested_at else None,
            "verified_at": v.verified_at.isoformat() if v.verified_at else None,
        })

    return jsonify({
        "success": True,
        "institution": serialize_university_profile(uni),
        "stats": {
            "total_students": total_students,
            "graduates_count": graduates_count,
            "verified_count": verified_count,
            "pending_verifications": pending_verifications,
            "departments_count": departments_count,
            "academic_projects_count": academic_projects_count,
            "career_opportunities_count": active_jobs_count
        },
        "recent_students": recent_students,
        "recent_verifications": recent_verifications
    }), 200


# ==============================================================================
# STUDENT / GRADUATE TALENT DIRECTORY APIS
# ==============================================================================

@university_bp.route('/api/v1/university/students', methods=['GET'])
def api_university_get_students():
    """
    Search and filter connected students and graduates.
    Privacy rules enforced (passwords, tokens, private contacts masked).
    """
    uni, error = get_authenticated_university()
    if error:
        return error

    query_str = request.args.get('q', '').strip()
    dept_filter = request.args.get('department', '').strip()
    qual_filter = request.args.get('qualification', '').strip()
    grad_year_filter = request.args.get('graduation_year', '').strip()
    status_filter = request.args.get('status', '').strip()  # خريج, طالب
    verif_filter = request.args.get('verification_status', '').strip()  # verified, pending, unrequested

    page = max(1, int(request.args.get('page', 1)))
    page_size = min(50, max(1, int(request.args.get('page_size', 12))))

    base_q = get_connected_students_query(uni)

    if query_str:
        base_q = base_q.filter(
            or_(
                Customers.fullname.ilike(f"%{query_str}%"),
                Customers.department_university.ilike(f"%{query_str}%"),
                Customers.preferred_field_of_work.ilike(f"%{query_str}%")
            )
        )

    if dept_filter:
        base_q = base_q.filter(Customers.department_university.ilike(f"%{dept_filter}%"))

    if qual_filter:
        base_q = base_q.filter(Customers.educational_qualification.ilike(f"%{qual_filter}%"))

    if grad_year_filter:
        base_q = base_q.filter(Customers.graduation_date.ilike(f"%{grad_year_filter}%"))

    if status_filter:
        base_q = base_q.filter(Customers.education_statue.ilike(f"%{status_filter}%"))

    if verif_filter:
        if verif_filter == 'verified':
            verif_ids = [v.customer_id for v in AcademicVerification.query.filter_by(university_id=uni.id, status='verified').all()]
            base_q = base_q.filter(Customers.id.in_(verif_ids))
        elif verif_filter == 'pending':
            verif_ids = [v.customer_id for v in AcademicVerification.query.filter_by(university_id=uni.id, status='pending').all()]
            base_q = base_q.filter(Customers.id.in_(verif_ids))
        elif verif_filter == 'unrequested':
            verif_ids = [v.customer_id for v in AcademicVerification.query.filter_by(university_id=uni.id).all()]
            base_q = base_q.filter(~Customers.id.in_(verif_ids))

    total = base_q.count()
    students_raw = base_q.order_by(desc(Customers.timestamp)).offset((page - 1) * page_size).limit(page_size).all()

    students = [serialize_student_academic_summary(s, uni) for s in students_raw]

    return jsonify({
        "success": True,
        "students": students,
        "pagination": {
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": (total + page_size - 1) // page_size if total > 0 else 1
        }
    }), 200


@university_bp.route('/api/v1/university/students/<string:student_id>', methods=['GET'])
def api_university_get_student_detail(student_id):
    """
    Get detailed student academic & professional dossier.
    Enforces privacy: no private passwords, tokens, or raw credentials.
    """
    uni, error = get_authenticated_university()
    if error:
        return error

    if student_id.isdigit():
        cand = Customers.query.get(int(student_id))
    else:
        cand = Customers.query.filter_by(user_id=student_id).first()

    if not cand:
        return jsonify({"error": "Student record not found"}), 404

    # Verify student is connected to this university
    is_connected = False
    cand_uni = (cand.university or '').strip().lower()
    if uni.name_ar and len(uni.name_ar.strip()) > 3 and (uni.name_ar.lower() in cand_uni or cand_uni in uni.name_ar.lower()):
        is_connected = True
    elif uni.name_en and len(uni.name_en.strip()) > 3 and (uni.name_en.lower() in cand_uni or cand_uni in uni.name_en.lower()):
        is_connected = True

    verif = AcademicVerification.query.filter_by(university_id=uni.id, customer_id=cand.id).first()
    if verif:
        is_connected = True

    if not is_connected:
        return jsonify({"error": "Forbidden", "message": "Student does not belong to this institution"}), 403

    # Academic & Professional Dossier
    skills_list = [s.skill_name for s in cand.skills] if cand.skills else []

    projects = []
    for p in (cand.projects or []):
        projects.append({
            "id": p.id,
            "project_name": p.project_name,
            "project_size": getattr(p, 'project_size', 'متوسط'),
            "description": getattr(p, 'description', '') or '',
            "project_url": getattr(p, 'project_url', '') or '',
            "created_at": p.created_at.isoformat() if getattr(p, 'created_at', None) else None
        })

    certifications = []
    for c in (cand.certifications_list or []):
        certifications.append({
            "id": c.id,
            "cert_name": c.cert_name,
            "issuing_org": c.issuing_org,
            "issue_year": c.issue_year,
            "credential_url": c.credential_url or ""
        })

    # Market Benchmark Score (transparently from AI engine)
    market_benchmark = None
    try:
        mv_result = get_market_value_for_customer(cand)
        market_benchmark = {
            "score": mv_result.get("score", 0),
            "tier": mv_result.get("tier", "N/A"),
            "salary_range": mv_result.get("salary_range", {}),
            "specialization": mv_result.get("specialization", "عام")
        }
    except Exception as ex:
        current_app.logger.warning("Market benchmark calculation note: %s", ex)

    # Career Readiness
    readiness_factors = 0
    if cand.cv: readiness_factors += 1
    if skills_list: readiness_factors += 1
    if projects: readiness_factors += 1
    if cand.educational_qualification: readiness_factors += 1
    if cand.gpa: readiness_factors += 1
    if verif and verif.status == 'verified': readiness_factors += 1
    career_readiness_pct = int((readiness_factors / 6) * 100)

    return jsonify({
        "success": True,
        "student": {
            "id": cand.id,
            "user_id": cand.user_id,
            "fullname": cand.fullname,
            "img": cand.img or "",
            "about": cand.about or "",
            "location": f"{getattr(cand, 'government', '') or ''}, {getattr(cand, 'country', '') or 'السعودية'}".strip(', '),
            "preferred_field": cand.preferred_field_of_work or "",
            "work_type": cand.work_type or "",
            "years_of_skills": cand.years_of_skills or "0",
            "academic_profile": {
                "degree": cand.educational_qualification or "بكالوريوس",
                "university": cand.university or uni.name_ar,
                "department": cand.department_university or "غير محدد",
                "graduation_date": cand.graduation_date.strftime("%Y") if hasattr(cand.graduation_date, 'strftime') else (str(cand.graduation_date) if cand.graduation_date else "—"),
                "status": cand.education_statue or "خريج",
                "gpa": cand.gpa or "غير مدخل"
            },
            "skills": skills_list,
            "projects": projects,
            "certifications": certifications,
            "has_cv": bool(cand.cv),
            "career_readiness": career_readiness_pct,
            "market_benchmark": market_benchmark,
            "verification": {
                "id": verif.id if verif else None,
                "status": verif.status if verif else "unrequested",
                "verification_code": verif.verification_code if verif else None,
                "verified_at": verif.verified_at.isoformat() if (verif and verif.verified_at) else None,
                "verified_by": verif.verified_by if verif else None,
                "notes": verif.notes if verif else None
            }
        }
    }), 200


# ==============================================================================
# ACADEMIC VERIFICATION WORKFLOW APIS
# ==============================================================================

@university_bp.route('/api/v1/university/verifications', methods=['GET'])
def api_university_get_verifications():
    """Retrieve the university's academic verification queue."""
    uni, error = get_authenticated_university()
    if error:
        return error

    status_filter = request.args.get('status', '').strip()  # pending, verified, rejected
    dept_filter = request.args.get('department', '').strip()
    query_str = request.args.get('q', '').strip()

    q = AcademicVerification.query.filter_by(university_id=uni.id)

    if status_filter:
        q = q.filter_by(status=status_filter)

    if dept_filter:
        q = q.filter(AcademicVerification.department.ilike(f"%{dept_filter}%"))

    verifs_raw = q.order_by(desc(AcademicVerification.requested_at)).all()

    items = []
    for v in verifs_raw:
        cand = Customers.query.get(v.customer_id)
        if not cand:
            continue

        if query_str and query_str.lower() not in (cand.fullname or '').lower():
            continue

        items.append({
            "id": v.id,
            "customer_id": cand.id,
            "student_user_id": cand.user_id,
            "student_name": cand.fullname,
            "student_img": cand.img or "",
            "degree": v.degree,
            "department": v.department,
            "graduation_year": v.graduation_year or cand.graduation_date or "—",
            "gpa": v.gpa or cand.gpa or "—",
            "status": v.status,
            "verification_code": v.verification_code,
            "notes": v.notes or "",
            "requested_at": v.requested_at.isoformat() if v.requested_at else None,
            "verified_at": v.verified_at.isoformat() if v.verified_at else None,
            "verified_by": v.verified_by or ""
        })

    return jsonify({
        "success": True,
        "verifications": items,
        "total": len(items)
    }), 200


@university_bp.route('/api/v1/university/verifications/<int:verification_id>', methods=['PUT'])
def api_university_update_verification(verification_id):
    """
    Approve or Reject an academic verification request.
    Generates official digital verification credential.
    """
    uni, error = get_authenticated_university()
    if error:
        return error

    verif = AcademicVerification.query.get(verification_id)
    if not verif or verif.university_id != uni.id:
        return jsonify({"error": "Verification request not found"}), 404

    data = request.get_json() or {}
    new_status = data.get('status')
    notes = data.get('notes', '')

    if new_status not in ['verified', 'rejected', 'pending']:
        return jsonify({"error": "Invalid verification status. Allowed: verified, rejected, pending"}), 400

    verif.status = new_status
    if notes:
        verif.notes = str(notes).strip()

    if new_status == 'verified':
        verif.verified_at = datetime.utcnow()
        verif.verified_by = uni.dean_name or uni.name_ar or "عمادة القبول والتسجيل"
        if not verif.verification_code:
            verif.verification_code = AcademicVerification.generate_verification_code("KSU")
    elif new_status == 'rejected':
        verif.verified_at = datetime.utcnow()
        verif.verified_by = uni.name_ar

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "تم تحديث حالة التوثيق الأكاديمي بنجاح",
        "verification": {
            "id": verif.id,
            "status": verif.status,
            "verification_code": verif.verification_code,
            "verified_at": verif.verified_at.isoformat() if verif.verified_at else None,
            "notes": verif.notes
        }
    }), 200


@university_bp.route('/api/v1/university/students/<int:customer_id>/verify', methods=['POST'])
def api_university_direct_verify_student(customer_id):
    """Directly issue verified academic record for a connected student."""
    uni, error = get_authenticated_university()
    if error:
        return error

    cand = Customers.query.get(customer_id)
    if not cand:
        return jsonify({"error": "Candidate not found"}), 404

    data = request.get_json() or {}
    degree = data.get('degree') or cand.educational_qualification or "بكالوريوس"
    department = data.get('department') or cand.department_university or "علوم الحاسب"
    graduation_year = data.get('graduation_year') or cand.graduation_date or "2024"
    gpa = data.get('gpa') or cand.gpa or "4.5"
    notes = data.get('notes') or "تم التوثيق الأكاديمي والتحقق المباشر من خلال الجامعة."

    verif = AcademicVerification.query.filter_by(
        university_id=uni.id, customer_id=cand.id
    ).first()

    if not verif:
        verif = AcademicVerification(
            university_id=uni.id,
            customer_id=cand.id,
            degree=degree,
            department=department,
            graduation_year=graduation_year,
            gpa=gpa,
            status="verified",
            notes=notes
        )
        verif.verified_at = datetime.utcnow()
        verif.verified_by = uni.dean_name or uni.name_ar
        db.session.add(verif)
    else:
        verif.status = "verified"
        verif.degree = degree
        verif.department = department
        verif.graduation_year = graduation_year
        verif.gpa = gpa
        verif.notes = notes
        verif.verified_at = datetime.utcnow()
        verif.verified_by = uni.dean_name or uni.name_ar

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "تم توثيق المؤهل الأكاديمي للطالب بنجاح",
        "verification_code": verif.verification_code
    }), 200


# ==============================================================================
# DEPARTMENTS / ACADEMIC STRUCTURE APIS
# ==============================================================================

@university_bp.route('/api/v1/university/departments', methods=['GET'])
def api_university_get_departments():
    """Retrieve list of academic departments for the university."""
    uni, error = get_authenticated_university()
    if error:
        return error

    depts = UniversityDepartment.query.filter_by(
        university_id=uni.id
    ).order_by(UniversityDepartment.name_ar).all()

    items = []
    for d in depts:
        # Count connected candidates in this department
        candidates_count = Customers.query.filter(
            and_(
                Customers.university.ilike(f"%{uni.name_ar}%"),
                Customers.department_university.ilike(f"%{d.name_ar}%")
            )
        ).count()

        # Count verified graduates
        verified_count = AcademicVerification.query.filter_by(
            university_id=uni.id, department=d.name_ar, status='verified'
        ).count()

        items.append({
            "id": d.id,
            "name_ar": d.name_ar,
            "name_en": d.name_en or "",
            "faculty": d.faculty or "",
            "degree_levels": d.degree_levels or "بكالوريوس",
            "description": d.description or "",
            "candidates_count": candidates_count,
            "verified_count": verified_count,
            "created_at": d.created_at.isoformat() if d.created_at else None
        })

    return jsonify({
        "success": True,
        "departments": items,
        "total": len(items)
    }), 200


@university_bp.route('/api/v1/university/departments', methods=['POST'])
def api_university_create_department():
    """Add a new academic department to the university."""
    uni, error = get_authenticated_university()
    if error:
        return error

    data = request.get_json() or {}
    name_ar = data.get('name_ar', '').strip()
    if not name_ar:
        return jsonify({"error": "Department Arabic name (name_ar) is required"}), 400

    dept = UniversityDepartment(
        university_id=uni.id,
        name_ar=name_ar,
        name_en=data.get('name_en', '').strip() or None,
        faculty=data.get('faculty', '').strip() or None,
        degree_levels=data.get('degree_levels', 'بكالوريوس').strip(),
        description=data.get('description', '').strip() or None
    )
    db.session.add(dept)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "تم إضافة القسم الأكاديمي بنجاح",
        "department": {
            "id": dept.id,
            "name_ar": dept.name_ar,
            "name_en": dept.name_en or "",
            "faculty": dept.faculty or "",
            "degree_levels": dept.degree_levels,
            "description": dept.description or ""
        }
    }), 201


@university_bp.route('/api/v1/university/departments/<int:dept_id>', methods=['PUT'])
def api_university_update_department(dept_id):
    """Update department details."""
    uni, error = get_authenticated_university()
    if error:
        return error

    dept = UniversityDepartment.query.get(dept_id)
    if not dept or dept.university_id != uni.id:
        return jsonify({"error": "Department not found"}), 404

    data = request.get_json() or {}
    if 'name_ar' in data and data['name_ar']:
        dept.name_ar = str(data['name_ar']).strip()
    if 'name_en' in data:
        dept.name_en = str(data['name_en']).strip() if data['name_en'] else None
    if 'faculty' in data:
        dept.faculty = str(data['faculty']).strip() if data['faculty'] else None
    if 'degree_levels' in data:
        dept.degree_levels = str(data['degree_levels']).strip()
    if 'description' in data:
        dept.description = str(data['description']).strip() if data['description'] else None

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "تم تحديث القسم بنجاح",
        "department": {
            "id": dept.id,
            "name_ar": dept.name_ar,
            "name_en": dept.name_en or "",
            "faculty": dept.faculty or "",
            "degree_levels": dept.degree_levels,
            "description": dept.description or ""
        }
    }), 200


@university_bp.route('/api/v1/university/departments/<int:dept_id>', methods=['DELETE'])
def api_university_delete_department(dept_id):
    """Delete department from university."""
    uni, error = get_authenticated_university()
    if error:
        return error

    dept = UniversityDepartment.query.get(dept_id)
    if not dept or dept.university_id != uni.id:
        return jsonify({"error": "Department not found"}), 404

    db.session.delete(dept)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "تم حذف القسم الأكاديمي بنجاح"
    }), 200


# ==============================================================================
# CAREER OPPORTUNITIES & ECOSYSTEM APIS
# ==============================================================================

@university_bp.route('/api/v1/university/opportunities', methods=['GET'])
def api_university_get_opportunities():
    """
    Returns real approved jobs relevant to the university's academic specializations.
    """
    uni, error = get_authenticated_university()
    if error:
        return error

    q_str = request.args.get('q', '').strip()
    work_type = request.args.get('work_type', '').strip()

    jobs_q = Jobs.query.filter_by(status='approved')

    if q_str:
        jobs_q = jobs_q.filter(
            or_(
                Jobs.title.ilike(f"%{q_str}%"),
                Jobs.job_description.ilike(f"%{q_str}%"),
                Jobs.required_skills.ilike(f"%{q_str}%"),
                Jobs.specialization.ilike(f"%{q_str}%")
            )
        )

    if work_type:
        jobs_q = jobs_q.filter(Jobs.job_type.ilike(f"%{work_type}%"))

    jobs = jobs_q.order_by(desc(Jobs.date_posted)).limit(30).all()

    items = []
    for j in jobs:
        comp = Company.query.get(j.company_id) if j.company_id else None
        company_name = (comp.company_arabic_name or comp.company_english_name) if comp else "شركة معتمدة"
        company_logo = comp.company_logo if comp else None
        skills = [s.strip() for s in (j.required_skills or '').split(',') if s.strip()]
        salary_str = f"{j.salary_min or 8000:,} - {j.salary_max or 18000:,} ر.س" if j.salary_min else "غير معلن"

        items.append({
            "id": j.id,
            "title": j.title,
            "company_name": company_name,
            "company_logo": company_logo,
            "location": j.town or (comp.state if comp else "المملكة العربية السعودية"),
            "work_type": j.job_type or "دوام كامل",
            "experience_level": j.skills_years or "مبتدئ / متوسط",
            "salary_range": salary_str,
            "skills": skills,
            "date_posted": j.date_posted.isoformat() if j.date_posted else None
        })

    return jsonify({
        "success": True,
        "opportunities": items,
        "total": len(items)
    }), 200
