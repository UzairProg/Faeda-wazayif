# ==============================================================================
# app/blueprints/market_insights.py
# ==============================================================================
# REST API Endpoints for Talent & Market Insights Module
# Supports Job Seeker, Company, University, Trends, and Admin benchmark management.
# ==============================================================================

from flask import Blueprint, request, jsonify, session
from services.market_data_service import market_data_service
from services.market_insights import MarketInsight, CandidateMarketInsight
from services.customer import Customers
from app import db
import csv
import io
import json
from datetime import datetime

market_insights_bp = Blueprint('market_insights', __name__, url_prefix='/api/market-insights')


# ------------------------------------------------------------------------------
# 1. Salary Benchmarking API
# ------------------------------------------------------------------------------
@market_insights_bp.route('/salary', methods=['GET'])
def get_salary_benchmark():
    """
    Inputs: role, specialization, skills, experience, location, industry, employment_type
    Outputs: min, max, average, median salary, experience-wise, location-wise breakdowns
    """
    role = request.args.get('role', 'Full Stack Developer')
    specialization = request.args.get('specialization')
    skills_raw = request.args.get('skills', '')
    skills = [s.strip() for s in skills_raw.split(',') if s.strip()] if skills_raw else None
    
    try:
        experience = int(request.args.get('experience', 2))
    except ValueError:
        experience = 2

    location = request.args.get('location')
    industry = request.args.get('industry')

    data = market_data_service.get_salary_benchmark(
        role=role,
        specialization=specialization,
        skills=skills,
        experience=experience,
        location=location,
        industry=industry
    )

    return jsonify({"success": True, "data": data}), 200


# ------------------------------------------------------------------------------
# 2. Skill Market Analysis API
# ------------------------------------------------------------------------------
@market_insights_bp.route('/skills', methods=['GET'])
def get_skill_insights():
    """
    Inputs: skills (comma-separated query param)
    Outputs: List of skills with demand level, related job roles, salary benchmark, and market trend
    """
    skills_raw = request.args.get('skills', '')
    if skills_raw:
        skills = [s.strip() for s in skills_raw.split(',') if s.strip()]
    else:
        skills = ["React", "Node.js", "TypeScript", "Python", "Cloud (AWS)", "Cybersecurity"]

    data = market_data_service.get_skill_insights(skills)
    return jsonify({"success": True, "data": data}), 200


# ------------------------------------------------------------------------------
# 3. Roles Market Benchmark API
# ------------------------------------------------------------------------------
@market_insights_bp.route('/roles', methods=['GET'])
def get_role_insights():
    """
    Returns available job roles with demand metrics, salary bands, and market outlook
    """
    role = request.args.get('role')
    data = market_data_service.get_role_insights(role)
    return jsonify({"success": True, "data": data}), 200


# ------------------------------------------------------------------------------
# 4. Candidate Market Insights API (Job Seeker)
# ------------------------------------------------------------------------------
@market_insights_bp.route('/candidate/me', methods=['GET'])
def get_my_candidate_insights():
    """
    Returns market salary and talent profile insights for currently logged-in candidate
    """
    user_id = session.get('user_id')
    customer_id = session.get('customer_id') or session.get('account_id')

    # If session is empty, check query param or test header
    if not customer_id and not user_id:
        customer_id = request.args.get('candidate_id')

    data = market_data_service.get_candidate_insights(customer_id=customer_id, user_id=user_id)
    return jsonify({"success": True, "data": data}), 200


@market_insights_bp.route('/candidate/<id>', methods=['GET'])
def get_candidate_insights_by_id(id):
    """
    Returns market insights for specific candidate ID (protecting personal private details)
    """
    data = market_data_service.get_candidate_insights(customer_id=id)
    return jsonify({"success": True, "data": data}), 200


# ------------------------------------------------------------------------------
# 5. Company Hiring Market Insights API
# ------------------------------------------------------------------------------
@market_insights_bp.route('/company', methods=['GET'])
def get_company_hiring_insights():
    """
    Returns hiring market metrics, estimated hiring costs, and talent availability
    """
    company_id = session.get('company_id') or request.args.get('company_id')
    data = market_data_service.get_company_hiring_insights(company_id=company_id)
    return jsonify({"success": True, "data": data}), 200


@market_insights_bp.route('/company/talent-requirements', methods=['GET'])
def get_company_talent_requirements():
    """
    Returns company talent requirements: most requested skills, hard-to-find skills,
    experience distribution, and location-wise talent availability.
    """
    company_id = session.get('company_id') or request.args.get('company_id')
    full_data = market_data_service.get_company_hiring_insights(company_id=company_id)
    return jsonify({
        "success": True,
        "data": full_data.get("talent_requirements", {}),
        "data_source": full_data.get("data_source"),
        "data_date": full_data.get("data_date"),
        "last_updated": full_data.get("last_updated"),
        "is_demo": True
    }), 200


@market_insights_bp.route('/company/candidates-by-skill', methods=['GET'])
def get_candidates_by_skill():
    """
    Allows employer to click a skill (e.g. React, Node.js) and see matching candidates.
    Personal contact info is protected.
    """
    skill = request.args.get('skill', 'React')
    candidates = market_data_service.get_matching_candidates_for_skill(skill)
    return jsonify({
        "success": True,
        "skill": skill,
        "candidates": candidates,
        "count": len(candidates)
    }), 200


# ------------------------------------------------------------------------------
# 6. University Graduate Employment Insights API
# ------------------------------------------------------------------------------
@market_insights_bp.route('/university', methods=['GET'])
def get_university_graduate_insights():
    """
    Aggregated & anonymized graduate employment outcomes for University dashboard.
    Strictly protects individual student salary data.
    """
    university_id = session.get('university_id') or request.args.get('university_id')
    data = market_data_service.get_university_graduate_insights(university_id=university_id)
    return jsonify({"success": True, "data": data}), 200


# ------------------------------------------------------------------------------
# 7. Market Trends API
# ------------------------------------------------------------------------------
@market_insights_bp.route('/trends', methods=['GET'])
def get_market_trends():
    """
    Multi-filter trends endpoint:
    country, city, industry, role, experience, skill, date_range
    """
    filters = {
        "country": request.args.get('country', 'Saudi Arabia'),
        "city": request.args.get('city', 'All'),
        "industry": request.args.get('industry', 'All'),
        "role": request.args.get('role', 'All'),
        "experience": request.args.get('experience', 'All'),
        "skill": request.args.get('skill', 'All'),
        "date_range": request.args.get('date_range', 'Last 12 Months')
    }
    data = market_data_service.get_market_trends(filters)
    return jsonify({"success": True, "data": data, "filters_applied": filters}), 200


# ------------------------------------------------------------------------------
# 8. Admin Panel: Market Data Management Endpoints
# ------------------------------------------------------------------------------
@market_insights_bp.route('/admin/data', methods=['GET'])
def admin_get_market_data():
    """
    Admin: List all market insight benchmarks with pagination and search
    """
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 20))
    search = request.args.get('search', '').strip()

    query = MarketInsight.query
    if search:
        query = query.filter(
            (MarketInsight.role.ilike(f"%{search}%")) |
            (MarketInsight.specialization.ilike(f"%{search}%")) |
            (MarketInsight.industry.ilike(f"%{search}%")) |
            (MarketInsight.location.ilike(f"%{search}%"))
        )

    pagination = query.order_by(MarketInsight.last_updated.desc()).paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        "success": True,
        "items": [item.to_dict() for item in pagination.items],
        "total": pagination.total,
        "page": pagination.page,
        "pages": pagination.pages,
        "per_page": pagination.per_page,
        "data_status": "Demo Benchmarks Loaded" if any(i.is_demo for i in pagination.items) else "Live Data Synchronized"
    }), 200


@market_insights_bp.route('/admin/data', methods=['POST'])
def admin_add_market_data():
    """
    Admin: Add a new benchmark entry
    """
    data = request.get_json() or {}
    role = data.get('role')
    if not role:
        return jsonify({"success": False, "message": "Role is required"}), 400

    skills = data.get('skills', [])
    skills_json = json.dumps(skills) if isinstance(skills, list) else str(skills)

    row = MarketInsight(
        role=role,
        specialization=data.get('specialization', 'General'),
        skills=skills_json,
        industry=data.get('industry', 'Information Technology'),
        location=data.get('location', 'Riyadh'),
        experience_min=int(data.get('experience_min', 1)),
        experience_max=int(data.get('experience_max', 5)),
        salary_min=float(data.get('salary_min', 10000)),
        salary_max=float(data.get('salary_max', 18000)),
        average_salary=float(data.get('average_salary', 14000)),
        median_salary=float(data.get('median_salary', 13500)),
        currency=data.get('currency', 'SAR'),
        demand_level=data.get('demand_level', 'High'),
        talent_availability=data.get('talent_availability', 'Moderate'),
        hiring_competition=data.get('hiring_competition', 'Medium'),
        source=data.get('source', 'Admin Manual Entry'),
        source_url=data.get('source_url'),
        is_demo=bool(data.get('is_demo', False)),
        data_date=data.get('data_date', datetime.utcnow().strftime('%Y-%m-%d'))
    )

    db.session.add(row)
    db.session.commit()

    return jsonify({"success": True, "message": "Market data benchmark added successfully", "item": row.to_dict()}), 201


@market_insights_bp.route('/admin/data/<int:id>', methods=['PUT'])
def admin_edit_market_data(id):
    """
    Admin: Edit an existing benchmark entry
    """
    row = MarketInsight.query.get(id)
    if not row:
        return jsonify({"success": False, "message": "Benchmark not found"}), 404

    data = request.get_json() or {}
    if 'role' in data:
        row.role = data['role']
    if 'specialization' in data:
        row.specialization = data['specialization']
    if 'skills' in data:
        skills = data['skills']
        row.skills = json.dumps(skills) if isinstance(skills, list) else str(skills)
    if 'industry' in data:
        row.industry = data['industry']
    if 'location' in data:
        row.location = data['location']
    if 'salary_min' in data:
        row.salary_min = float(data['salary_min'])
    if 'salary_max' in data:
        row.salary_max = float(data['salary_max'])
    if 'average_salary' in data:
        row.average_salary = float(data['average_salary'])
    if 'median_salary' in data:
        row.median_salary = float(data['median_salary'])
    if 'currency' in data:
        row.currency = data['currency']
    if 'demand_level' in data:
        row.demand_level = data['demand_level']
    if 'talent_availability' in data:
        row.talent_availability = data['talent_availability']
    if 'source' in data:
        row.source = data['source']
    if 'is_demo' in data:
        row.is_demo = bool(data['is_demo'])

    row.last_updated = datetime.utcnow()
    db.session.commit()

    return jsonify({"success": True, "message": "Benchmark updated successfully", "item": row.to_dict()}), 200


@market_insights_bp.route('/admin/data/<int:id>', methods=['DELETE'])
def admin_delete_market_data(id):
    """
    Admin: Delete a benchmark entry
    """
    row = MarketInsight.query.get(id)
    if not row:
        return jsonify({"success": False, "message": "Benchmark not found"}), 404

    db.session.delete(row)
    db.session.commit()

    return jsonify({"success": True, "message": "Benchmark deleted successfully"}), 200


@market_insights_bp.route('/admin/import-csv', methods=['POST'])
def admin_import_csv():
    """
    Admin: Import CSV of market benchmarks
    Expected headers: role, specialization, skills, industry, location, experience_min, experience_max, salary_min, salary_max, average_salary, source
    """
    if 'file' not in request.files:
        return jsonify({"success": False, "message": "No file uploaded"}), 400

    file = request.files['file']
    if not file.filename.endswith('.csv'):
        return jsonify({"success": False, "message": "Please upload a valid .csv file"}), 400

    stream = io.StringIO(file.stream.read().decode("utf-8-sig"), newline=None)
    reader = csv.DictReader(stream)

    imported_count = 0
    for row in reader:
        try:
            skills = [s.strip() for s in row.get('skills', '').split(';') if s.strip()]
            new_benchmark = MarketInsight(
                role=row.get('role', 'Unknown Role').strip(),
                specialization=row.get('specialization', 'General').strip(),
                skills=json.dumps(skills),
                industry=row.get('industry', 'Information Technology').strip(),
                location=row.get('location', 'Riyadh').strip(),
                experience_min=int(row.get('experience_min', 1)),
                experience_max=int(row.get('experience_max', 5)),
                salary_min=float(row.get('salary_min', 10000)),
                salary_max=float(row.get('salary_max', 18000)),
                average_salary=float(row.get('average_salary', 14000)),
                median_salary=float(row.get('median_salary', 13500)),
                currency=row.get('currency', 'SAR').strip(),
                demand_level=row.get('demand_level', 'High').strip(),
                talent_availability=row.get('talent_availability', 'Moderate').strip(),
                hiring_competition=row.get('hiring_competition', 'Medium').strip(),
                source=row.get('source', 'CSV Import').strip(),
                is_demo=False,
                data_date=datetime.utcnow().strftime('%Y-%m-%d')
            )
            db.session.add(new_benchmark)
            imported_count += 1
        except Exception:
            continue

    db.session.commit()
    return jsonify({"success": True, "message": f"Successfully imported {imported_count} benchmark records", "count": imported_count}), 200


@market_insights_bp.route('/admin/providers', methods=['GET'])
def admin_get_providers():
    """
    Admin: Inspect data provider status, configuration, and data freshness
    """
    return jsonify({
        "success": True,
        "providers": [
            {
                "id": "demo_benchmarks",
                "name": "Demo Salary Data Provider (Internal Regional Benchmarks)",
                "type": "Internal Curated Dataset",
                "status": "Active (Demo Mode)",
                "data_date": "2026-10-02",
                "last_updated": "2026-10-02",
                "record_count": MarketInsight.query.count(),
                "enabled": True,
                "description": "Standardized Vision 2030 talent benchmarks with experience-scaled ranges."
            },
            {
                "id": "external_api",
                "name": "External Market Salary API (GOSI / Ministry / Industry Feeds)",
                "type": "External Enterprise API",
                "status": "Configured / Standby (Awaiting Production Credentials)",
                "data_date": "N/A",
                "last_updated": "N/A",
                "record_count": 0,
                "enabled": False,
                "description": "Enterprise feed integration interface. Ready for live API credentials."
            }
        ]
    }), 200


@market_insights_bp.route('/admin/refresh', methods=['POST'])
def admin_refresh_data():
    """
    Admin: Trigger background or immediate refresh of candidate salary benchmarks
    """
    market_data_service.clear_cache()
    return jsonify({
        "success": True,
        "message": "Market data cache cleared and benchmarks successfully refreshed",
        "refreshed_at": datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
    }), 200
