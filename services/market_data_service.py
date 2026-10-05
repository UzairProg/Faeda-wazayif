# ==============================================================================
# services/market_data_service.py
# ==============================================================================
# Data Service / API Architecture for Talent & Market Insights:
# - Decouples frontend and controllers from concrete salary providers.
# - SalaryDataProvider: Pluggable provider interface.
# - DemoSalaryDataProvider: Clean benchmark data service with transparent labels.
# - MarketDataService: Facade providing caching, candidate profiling, employer analytics.
# ==============================================================================

import json
from datetime import datetime
from typing import Dict, List, Any, Optional
from app import db
from services.market_insights import MarketInsight, CandidateMarketInsight


# Default seed benchmarks for regional tech, engineering, and digital roles
DEFAULT_BENCHMARKS = [
    {
        "role": "Full Stack Developer",
        "specialization": "Software Engineering",
        "skills": ["React", "Node.js", "TypeScript", "Python", "PostgreSQL"],
        "industry": "Information Technology",
        "location": "Riyadh",
        "experience_min": 1,
        "experience_max": 4,
        "salary_min": 12000,
        "salary_max": 20000,
        "average_salary": 16000,
        "median_salary": 15500,
        "currency": "SAR",
        "demand_level": "High",
        "talent_availability": "Moderate",
        "hiring_competition": "High",
        "source": "Saudi Tech Salary Survey 2026",
        "source_url": "https://faeda.sa/benchmarks/tech-2026",
        "data_date": "2026-10-02",
        "is_demo": True
    },
    {
        "role": "React Developer",
        "specialization": "Frontend Engineering",
        "skills": ["React", "JavaScript", "TypeScript", "TailwindCSS", "Next.js"],
        "industry": "Information Technology",
        "location": "Riyadh",
        "experience_min": 2,
        "experience_max": 5,
        "salary_min": 11000,
        "salary_max": 18500,
        "average_salary": 14500,
        "median_salary": 14000,
        "currency": "SAR",
        "demand_level": "High",
        "talent_availability": "High",
        "hiring_competition": "Medium",
        "source": "Market Salary Dataset",
        "source_url": "https://faeda.sa/benchmarks/frontend-2026",
        "data_date": "2026-10-02",
        "is_demo": True
    },
    {
        "role": "Cloud Solutions Architect",
        "specialization": "Cloud & DevOps",
        "skills": ["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD"],
        "industry": "Cloud Computing & Telecom",
        "location": "Eastern Province",
        "experience_min": 3,
        "experience_max": 7,
        "salary_min": 20000,
        "salary_max": 35000,
        "average_salary": 27000,
        "median_salary": 26000,
        "currency": "SAR",
        "demand_level": "Critical",
        "talent_availability": "Scarce",
        "hiring_competition": "High",
        "source": "Vision 2030 Cloud Infrastructure Survey",
        "source_url": "https://faeda.sa/benchmarks/cloud-2026",
        "data_date": "2026-10-02",
        "is_demo": True
    },
    {
        "role": "Cybersecurity Specialist",
        "specialization": "Information Security",
        "skills": ["Network Security", "Penetration Testing", "SIEM", "NCA Standards", "Incident Response"],
        "industry": "Banking & Defense",
        "location": "Riyadh",
        "experience_min": 2,
        "experience_max": 6,
        "salary_min": 16000,
        "salary_max": 28000,
        "average_salary": 22000,
        "median_salary": 21000,
        "currency": "SAR",
        "demand_level": "Critical",
        "talent_availability": "Very Scarce",
        "hiring_competition": "High",
        "source": "National Cybersecurity Benchmark",
        "source_url": "https://faeda.sa/benchmarks/cyber-2026",
        "data_date": "2026-10-02",
        "is_demo": True
    },
    {
        "role": "AI & Machine Learning Engineer",
        "specialization": "Artificial Intelligence & Data Science",
        "skills": ["Python", "PyTorch", "LLMs", "RAG", "Data Pipelines"],
        "industry": "Artificial Intelligence & R&D",
        "location": "Riyadh",
        "experience_min": 2,
        "experience_max": 5,
        "salary_min": 18000,
        "salary_max": 30000,
        "average_salary": 24000,
        "median_salary": 23500,
        "currency": "SAR",
        "demand_level": "Critical",
        "talent_availability": "Scarce",
        "hiring_competition": "High",
        "source": "SDAIA Regional AI Talent Index",
        "source_url": "https://faeda.sa/benchmarks/ai-2026",
        "data_date": "2026-10-02",
        "is_demo": True
    },
    {
        "role": "UI/UX Product Designer",
        "specialization": "Product Design",
        "skills": ["Figma", "Design Systems", "User Research", "Prototyping", "UI Design"],
        "industry": "Fintech & Digital Services",
        "location": "Jeddah",
        "experience_min": 1,
        "experience_max": 4,
        "salary_min": 10000,
        "salary_max": 17000,
        "average_salary": 13500,
        "median_salary": 13000,
        "currency": "SAR",
        "demand_level": "High",
        "talent_availability": "Moderate",
        "hiring_competition": "Medium",
        "source": "Fintech Design Talent Index",
        "source_url": "https://faeda.sa/benchmarks/design-2026",
        "data_date": "2026-10-02",
        "is_demo": True
    },
    {
        "role": "ERP & Business Systems Consultant",
        "specialization": "MIS & Enterprise Systems",
        "skills": ["SAP", "Oracle ERP", "Supply Chain", "Business Process Mapping", "SQL"],
        "industry": "Supply Chain & Manufacturing",
        "location": "Eastern Province",
        "experience_min": 2,
        "experience_max": 6,
        "salary_min": 14000,
        "salary_max": 24000,
        "average_salary": 19000,
        "median_salary": 18500,
        "currency": "SAR",
        "demand_level": "High",
        "talent_availability": "Moderate",
        "hiring_competition": "Medium",
        "source": "Manufacturing Enterprise Benchmark",
        "source_url": "https://faeda.sa/benchmarks/erp-2026",
        "data_date": "2026-10-02",
        "is_demo": True
    }
]


class SalaryDataProvider:
    """Abstract Base Class / Provider Interface for salary and market data sources."""

    def get_salary_benchmark(self, role: str, specialization: Optional[str] = None,
                             skills: Optional[List[str]] = None, experience: int = 2,
                             location: Optional[str] = None, industry: Optional[str] = None) -> Dict[str, Any]:
        raise NotImplementedError

    def get_skill_insights(self, skills: List[str]) -> List[Dict[str, Any]]:
        raise NotImplementedError

    def get_role_insights(self, role: Optional[str] = None) -> List[Dict[str, Any]]:
        raise NotImplementedError

    def get_market_trends(self, filters: Dict[str, Any]) -> Dict[str, Any]:
        raise NotImplementedError


class DemoSalaryDataProvider(SalaryDataProvider):
    """
    Transparent sample & internal benchmark data provider.
    Never invents real-time data; clearly labels datasets as 'Demo Data' / 'Sample Benchmark'.
    Uses database records from MarketInsight when present, falling back to curated Vision 2030 benchmarks.
    """

    def __init__(self):
        self.provider_name = "Market Salary Dataset (Demo Benchmark)"
        self.provider_status = "active_demo"
        self.is_demo = True
        self.data_date = "2026-10-02"
        self.last_updated = "2026-10-02"

    def _ensure_seed_data(self):
        """Seed default benchmarks if database table is empty."""
        try:
            if MarketInsight.query.count() == 0:
                for b in DEFAULT_BENCHMARKS:
                    row = MarketInsight(
                        role=b["role"],
                        specialization=b["specialization"],
                        skills=json.dumps(b["skills"]),
                        industry=b["industry"],
                        location=b["location"],
                        experience_min=b["experience_min"],
                        experience_max=b["experience_max"],
                        salary_min=b["salary_min"],
                        salary_max=b["salary_max"],
                        average_salary=b["average_salary"],
                        median_salary=b["median_salary"],
                        currency=b["currency"],
                        demand_level=b["demand_level"],
                        talent_availability=b["talent_availability"],
                        hiring_competition=b["hiring_competition"],
                        source=b["source"],
                        source_url=b["source_url"],
                        is_demo=True,
                        data_date=b["data_date"]
                    )
                    db.session.add(row)
                db.session.commit()
        except Exception:
            db.session.rollback()

    def get_salary_benchmark(self, role: str, specialization: Optional[str] = None,
                             skills: Optional[List[str]] = None, experience: int = 2,
                             location: Optional[str] = None, industry: Optional[str] = None) -> Dict[str, Any]:
        self._ensure_seed_data()

        # Attempt to query matching record from database
        query = MarketInsight.query
        if role:
            query = query.filter(MarketInsight.role.ilike(f"%{role}%"))
        if specialization:
            query = query.filter(MarketInsight.specialization.ilike(f"%{specialization}%"))
        if location and location.lower() != 'all':
            query = query.filter(MarketInsight.location.ilike(f"%{location}%"))

        match = query.first()

        # Fallback to closest default benchmark
        if not match:
            match = MarketInsight.query.filter(
                (MarketInsight.role.ilike("%Software%")) |
                (MarketInsight.role.ilike("%Developer%"))
            ).first()

        base_min = match.salary_min if match else 12000
        base_max = match.salary_max if match else 20000
        base_avg = match.average_salary if match else 16000
        base_med = match.median_salary if match else 15500
        currency = match.currency if match else "SAR"

        # Apply experience multiplier (not a person's worth; purely market tenure distribution)
        exp_factor = 1.0 + (max(0, experience - 2) * 0.12)
        salary_min = round(base_min * exp_factor, -2)
        salary_max = round(base_max * exp_factor, -2)
        avg_salary = round(base_avg * exp_factor, -2)
        med_salary = round(base_med * exp_factor, -2)

        # Experience-wise breakdown
        experience_breakdown = [
            {"tier": "Entry (0–1 Yrs)", "min": round(base_min * 0.8), "avg": round(base_avg * 0.8), "max": round(base_max * 0.8)},
            {"tier": "Mid (2–4 Yrs)", "min": base_min, "avg": base_avg, "max": base_max},
            {"tier": "Senior (5–8 Yrs)", "min": round(base_min * 1.35), "avg": round(base_avg * 1.35), "max": round(base_max * 1.35)},
            {"tier": "Lead / Expert (8+ Yrs)", "min": round(base_min * 1.7), "avg": round(base_avg * 1.7), "max": round(base_max * 1.7)},
        ]

        # Location-wise breakdown
        location_breakdown = [
            {"location": "Riyadh", "avg_salary": round(avg_salary * 1.08), "difference_pct": "+8%", "cost_of_living_index": "High"},
            {"location": "Eastern Province (Dhahran/Khobar)", "avg_salary": round(avg_salary * 1.02), "difference_pct": "+2%", "cost_of_living_index": "Medium-High"},
            {"location": "Jeddah / Western Province", "avg_salary": round(avg_salary * 0.98), "difference_pct": "-2%", "cost_of_living_index": "Medium"},
            {"location": "Remote / Flexible", "avg_salary": round(avg_salary * 0.95), "difference_pct": "-5%", "cost_of_living_index": "Flexible"},
        ]

        return {
            "role": role or (match.role if match else "Full Stack Developer"),
            "specialization": specialization or (match.specialization if match else "Software Engineering"),
            "salary_min": salary_min,
            "salary_max": salary_max,
            "average_salary": avg_salary,
            "median_salary": med_salary,
            "currency": currency,
            "experience_years": experience,
            "experience_breakdown": experience_breakdown,
            "location_breakdown": location_breakdown,
            "demand_level": match.demand_level if match else "High",
            "talent_availability": match.talent_availability if match else "Moderate",
            "hiring_competition": match.hiring_competition if match else "Medium",
            "data_source": match.source if match else self.provider_name,
            "source_url": match.source_url if match else "https://faeda.sa/benchmarks",
            "data_date": match.data_date if match else self.data_date,
            "last_updated": match.last_updated.strftime("%Y-%m-%d") if match and match.last_updated else self.last_updated,
            "is_demo": True,
            "disclaimer": "Sample / Demo Benchmark Dataset. Clearly labeled for demonstration purposes."
        }

    def get_skill_insights(self, skills: List[str]) -> List[Dict[str, Any]]:
        """Detailed market analysis for each skill."""
        SKILL_CATALOG = {
            "react": {
                "skill": "React",
                "demand_level": "High",
                "related_roles": ["Frontend Engineer", "Full Stack Developer", "UI Tech Lead"],
                "salary_benchmark": "SAR 13,000 – 21,000",
                "salary_inr": "₹7 LPA – ₹14 LPA",
                "skill_match": "High",
                "market_trend": "+18% YoY Growth",
                "talent_count": 1420
            },
            "node.js": {
                "skill": "Node.js",
                "demand_level": "High",
                "related_roles": ["Backend Developer", "Full Stack Developer", "API Architect"],
                "salary_benchmark": "SAR 14,000 – 22,500",
                "salary_inr": "₹8 LPA – ₹15 LPA",
                "skill_match": "High",
                "market_trend": "+22% YoY Growth",
                "talent_count": 980
            },
            "typescript": {
                "skill": "TypeScript",
                "demand_level": "High",
                "related_roles": ["Full Stack Engineer", "Senior Web Architect"],
                "salary_benchmark": "SAR 15,000 – 23,000",
                "salary_inr": "₹8.5 LPA – ₹16 LPA",
                "skill_match": "High",
                "market_trend": "+28% YoY Growth",
                "talent_count": 890
            },
            "python": {
                "skill": "Python",
                "demand_level": "Critical",
                "related_roles": ["AI / ML Engineer", "Data Scientist", "Backend Developer"],
                "salary_benchmark": "SAR 16,000 – 27,000",
                "salary_inr": "₹9 LPA – ₹18 LPA",
                "skill_match": "Critical",
                "market_trend": "+35% YoY Growth",
                "talent_count": 1650
            },
            "docker": {
                "skill": "Docker",
                "demand_level": "High",
                "related_roles": ["DevOps Engineer", "Cloud Infrastructure Engineer"],
                "salary_benchmark": "SAR 17,000 – 26,000",
                "salary_inr": "₹9 LPA – ₹17 LPA",
                "skill_match": "High",
                "market_trend": "+24% YoY Growth",
                "talent_count": 760
            },
            "aws": {
                "skill": "AWS",
                "demand_level": "Critical",
                "related_roles": ["Cloud Solutions Architect", "DevOps Lead"],
                "salary_benchmark": "SAR 20,000 – 34,000",
                "salary_inr": "₹12 LPA – ₹24 LPA",
                "skill_match": "Critical",
                "market_trend": "+32% YoY Growth",
                "talent_count": 620
            },
            "cybersecurity": {
                "skill": "Cybersecurity",
                "demand_level": "Critical",
                "related_roles": ["Security Analyst", "Penetration Tester", "SOC Lead"],
                "salary_benchmark": "SAR 18,000 – 30,000",
                "salary_inr": "₹10 LPA – ₹22 LPA",
                "skill_match": "Critical",
                "market_trend": "+40% YoY Growth",
                "talent_count": 320
            },
            "mongodb": {
                "skill": "MongoDB",
                "demand_level": "Medium",
                "related_roles": ["NoSQL Data Engineer", "Backend Developer"],
                "salary_benchmark": "SAR 12,000 – 18,500",
                "salary_inr": "₹6 LPA – ₹11 LPA",
                "skill_match": "Medium",
                "market_trend": "+12% YoY Growth",
                "talent_count": 810
            },
            "sql": {
                "skill": "SQL & Relational DBs",
                "demand_level": "High",
                "related_roles": ["Database Administrator", "Data Analyst", "Backend Engineer"],
                "salary_benchmark": "SAR 12,500 – 19,000",
                "salary_inr": "₹6.5 LPA – ₹12 LPA",
                "skill_match": "High",
                "market_trend": "+15% YoY Growth",
                "talent_count": 1890
            },
            "ui/ux": {
                "skill": "UI/UX & Figma",
                "demand_level": "High",
                "related_roles": ["Product Designer", "UX Researcher", "Interaction Lead"],
                "salary_benchmark": "SAR 11,500 – 18,000",
                "salary_inr": "₹6 LPA – ₹12 LPA",
                "skill_match": "High",
                "market_trend": "+19% YoY Growth",
                "talent_count": 710
            }
        }

        insights = []
        for raw_s in skills:
            k = raw_s.strip().lower()
            # Match directly or fuzzily
            matched = None
            for key, val in SKILL_CATALOG.items():
                if key in k or k in key:
                    matched = val
                    break
            if not matched:
                matched = {
                    "skill": raw_s.strip(),
                    "demand_level": "Medium",
                    "related_roles": ["Specialized Developer", "Technical Analyst"],
                    "salary_benchmark": "SAR 12,000 – 19,000",
                    "salary_inr": "₹6 LPA – ₹11 LPA",
                    "skill_match": "Medium",
                    "market_trend": "+10% YoY Growth",
                    "talent_count": 450
                }
            insights.append({
                **matched,
                "data_source": self.provider_name,
                "data_date": self.data_date,
                "last_updated": self.last_updated,
                "is_demo": True
            })

        return insights

    def get_role_insights(self, role: Optional[str] = None) -> List[Dict[str, Any]]:
        self._ensure_seed_data()
        query = MarketInsight.query
        if role:
            query = query.filter(MarketInsight.role.ilike(f"%{role}%"))
        results = query.limit(20).all()
        return [r.to_dict() for r in results]

    def get_market_trends(self, filters: Dict[str, Any]) -> Dict[str, Any]:
        """Aggregate market trends across roles, experience, location, and emerging skills."""
        return {
            "salary_trends_by_role": [
                {
                    "role": "AI & ML Engineer",
                    "salary_2024": 19000, "salary_2025": 21500, "salary_2026": 24000,
                    "growth_rate": "+26.3%",
                    "y2024": 19000, "y2025": 21500, "y2026": 24000, "growth_pct": "+26.3%"
                },
                {
                    "role": "Cloud Solutions Architect",
                    "salary_2024": 22000, "salary_2025": 24500, "salary_2026": 27000,
                    "growth_rate": "+22.7%",
                    "y2024": 22000, "y2025": 24500, "y2026": 27000, "growth_pct": "+22.7%"
                },
                {
                    "role": "Cybersecurity Specialist",
                    "salary_2024": 18000, "salary_2025": 20000, "salary_2026": 22000,
                    "growth_rate": "+22.2%",
                    "y2024": 18000, "y2025": 20000, "y2026": 22000, "growth_pct": "+22.2%"
                },
                {
                    "role": "Full Stack Developer",
                    "salary_2024": 13500, "salary_2025": 14800, "salary_2026": 16000,
                    "growth_rate": "+18.5%",
                    "y2024": 13500, "y2025": 14800, "y2026": 16000, "growth_pct": "+18.5%"
                },
                {
                    "role": "UI/UX Product Designer",
                    "salary_2024": 11500, "salary_2025": 12500, "salary_2026": 13500,
                    "growth_rate": "+17.4%",
                    "y2024": 11500, "y2025": 12500, "y2026": 13500, "growth_pct": "+17.4%"
                },
            ],
            "salary_trends_by_experience": [
                {
                    "experience": "0–1 Yrs",
                    "salary_sar": 10000, "average_salary": 10000,
                    "salary_lpa": "₹5.4 LPA", "range": "SAR 8,000 – 12,000", "currency": "SAR"
                },
                {
                    "experience": "2–3 Yrs",
                    "salary_sar": 14500, "average_salary": 14500,
                    "salary_lpa": "₹7.8 LPA", "range": "SAR 12,000 – 17,500", "currency": "SAR"
                },
                {
                    "experience": "4–6 Yrs",
                    "salary_sar": 21000, "average_salary": 21000,
                    "salary_lpa": "₹11.3 LPA", "range": "SAR 17,000 – 25,000", "currency": "SAR"
                },
                {
                    "experience": "7–9 Yrs",
                    "salary_sar": 29000, "average_salary": 29000,
                    "salary_lpa": "₹15.6 LPA", "range": "SAR 24,000 – 35,000", "currency": "SAR"
                },
                {
                    "experience": "10+ Yrs",
                    "salary_sar": 38000, "average_salary": 38000,
                    "salary_lpa": "₹20.5 LPA", "range": "SAR 30,000 – 48,000", "currency": "SAR"
                },
            ],
            "salary_trends_by_location": [
                {
                    "location": "Riyadh Capital", "city": "Riyadh",
                    "index": 118, "avg_salary_sar": 18500, "average_salary": 18500
                },
                {
                    "location": "Eastern Province (Dhahran/Khobar)", "city": "Eastern Province",
                    "index": 110, "avg_salary_sar": 17200, "average_salary": 17200
                },
                {
                    "location": "Jeddah & Western Province", "city": "Jeddah",
                    "index": 100, "avg_salary_sar": 15600, "average_salary": 15600
                },
                {
                    "location": "Madinah & North", "city": "Madinah",
                    "index": 88, "avg_salary_sar": 13800, "average_salary": 13800
                },
                {
                    "location": "Southern Region", "city": "Southern Region",
                    "index": 84, "avg_salary_sar": 13100, "average_salary": 13100
                },
            ],
            "skill_demand_trends": [
                {"skill": "React & TypeScript", "demand_index": 94, "trend": "Surging", "yoy_change": "+28%"},
                {"skill": "Cloud Security & NCA", "demand_index": 96, "trend": "Critical", "yoy_change": "+34%"},
                {"skill": "LLM Orchestration & RAG", "demand_index": 98, "trend": "Explosive", "yoy_change": "+52%"},
                {"skill": "Kubernetes & DevOps", "demand_index": 89, "trend": "High Demand", "yoy_change": "+21%"},
                {"skill": "Python & Data Engineering", "demand_index": 91, "trend": "High Demand", "yoy_change": "+25%"},
            ],
            "emerging_skills": [
                {"skill": "Generative AI Agents & RAG", "category": "Artificial Intelligence", "surge_multiplier": "3.4x Demand Growth"},
                {"skill": "NCA Cyber Compliance & Zero Trust", "category": "Information Security", "surge_multiplier": "2.8x Demand Growth"},
                {"skill": "FinOps & Cloud Cost Optimization", "category": "Cloud Infrastructure", "surge_multiplier": "2.5x Demand Growth"},
                {"skill": "Rust for High-Frequency Systems", "category": "Systems Programming", "surge_multiplier": "2.1x Demand Growth"},
            ],
            "industry_demand": [
                {"industry": "Fintech & Digital Banking", "hiring_share": 28, "growth": "+31% YoY"},
                {"industry": "Government Digital Transformation (Vision 2030)", "hiring_share": 26, "growth": "+26% YoY"},
                {"industry": "Cloud & Enterprise Software", "hiring_share": 20, "growth": "+22% YoY"},
                {"industry": "Energy & Industrial Automation", "hiring_share": 16, "growth": "+15% YoY"},
                {"industry": "Healthcare Tech & Logistics", "hiring_share": 10, "growth": "+18% YoY"},
            ],
            "applied_filters": filters,
            "data_source": "Market Salary Dataset",
            "data_date": "2026-10-02",
            "last_updated": "02 Oct 2026",
            "is_demo": True
        }


class MarketDataService:
    """
    Main Service Facade for Market Intelligence.
    Interacts with active provider (Demo/Internal or External API),
    computes candidate profile positioning, employer hiring costs, and university employment KPIs.
    """

    def __init__(self, provider: Optional[SalaryDataProvider] = None):
        self._provider = provider or DemoSalaryDataProvider()

    def set_provider(self, provider: SalaryDataProvider):
        self._provider = provider

    def get_provider_status(self) -> Dict[str, Any]:
        return {
            "provider_name": getattr(self._provider, "provider_name", "Demo Provider"),
            "provider_status": getattr(self._provider, "provider_status", "active"),
            "is_demo": getattr(self._provider, "is_demo", True),
            "data_date": getattr(self._provider, "data_date", "2026-10-02"),
            "last_updated": getattr(self._provider, "last_updated", "2026-10-02"),
            "external_api_configured": False,
            "available_providers": [
                {"id": "demo_internal", "name": "Internal / Demo Benchmark Dataset", "active": True},
                {"id": "external_api", "name": "External Market Salary API (Payscale / Radford)", "active": False}
            ]
        }

    def get_salary_benchmark(self, **kwargs) -> Dict[str, Any]:
        return self._provider.get_salary_benchmark(
            role=kwargs.get("role", "Software Engineer"),
            specialization=kwargs.get("specialization"),
            skills=kwargs.get("skills"),
            experience=int(kwargs.get("experience", 2)),
            location=kwargs.get("location"),
            industry=kwargs.get("industry")
        )

    def get_skill_insights(self, skills: List[str]) -> List[Dict[str, Any]]:
        return self._provider.get_skill_insights(skills)

    def get_market_trends(self, filters: Dict[str, Any]) -> Dict[str, Any]:
        return self._provider.get_market_trends(filters)

    def calculate_candidate_insights(self, candidate) -> Dict[str, Any]:
        """
        Derives market position and salary benchmark from candidate's existing profile attributes:
        name, job role, specialization, skills, education, experience, certifications, location, expected salary.
        """
        # 1. Extract Profile Data
        role = getattr(candidate, 'preferred_field_of_work', None) or "Software Engineer"
        specialization = getattr(candidate, 'department_university', None) or "Computer Science"
        location = getattr(candidate, 'government', None) or getattr(candidate, 'city', None) or "Riyadh"

        # Experience years parsing
        years_raw = getattr(candidate, 'years_of_skills', None) or "2"
        try:
            experience_years = int(''.join(filter(str.isdigit, str(years_raw))) or 2)
        except Exception:
            experience_years = 2

        # Extract candidate skills
        cand_skills = []
        if hasattr(candidate, 'skills') and candidate.skills:
            for s in candidate.skills:
                cand_skills.append(getattr(s, 'skill_name', str(s)))
        if not cand_skills:
            cand_skills = ["React", "TypeScript", "Node.js", "Python", "SQL"]

        # 2. Get Benchmark
        benchmark = self._provider.get_salary_benchmark(
            role=role,
            specialization=specialization,
            skills=cand_skills,
            experience=experience_years,
            location=location
        )

        # 3. Calculate Profile Strength & Skill Match Percentage
        base_match = 75.0
        # Education bonus
        qual = getattr(candidate, 'educational_qualification', '') or ''
        if 'ماجستير' in qual or 'master' in qual.lower():
            base_match += 8.0
        elif 'بكالوريوس' in qual or 'bachelor' in qual.lower():
            base_match += 5.0

        # Certifications bonus
        certs_count = 0
        if hasattr(candidate, 'certifications_list') and candidate.certifications_list:
            certs_count = len(candidate.certifications_list)
            base_match += min(10.0, certs_count * 3.5)

        # Projects bonus
        if hasattr(candidate, 'projects') and candidate.projects:
            base_match += min(8.0, len(candidate.projects) * 2.0)

        # Skill count bonus
        base_match += min(7.0, len(cand_skills) * 1.2)

        skill_match_pct = min(96.0, round(base_match, 1))

        # 4. Matching Roles
        matching_roles = [
            role,
            f"Senior {role}" if experience_years >= 4 else f"Junior {role}",
            "Full Stack Developer" if "react" in str(cand_skills).lower() else "Software Consultant",
            "Cloud Solutions Specialist" if "aws" in str(cand_skills).lower() or "docker" in str(cand_skills).lower() else "Systems Analyst"
        ]

        # 5. Skill Analysis breakdown
        skill_analysis = self._provider.get_skill_insights(cand_skills[:6])

        # 6. Market Position
        if skill_match_pct >= 90:
            market_position = "Top Tier (Top 10% in Market)"
        elif skill_match_pct >= 82:
            market_position = "Competitive (Top 25% in Market)"
        else:
            market_position = "Standard Market Alignment"

        # 7. Recommended Skills to Learn
        all_skills_lower = [s.lower() for s in cand_skills]
        recommended_skills = []
        recommendation_catalog = [
            {"skill": "AWS Cloud Architecture", "impact": "+15% Salary Benchmark", "demand": "Critical", "key": "aws"},
            {"skill": "Docker & Kubernetes DevOps", "impact": "+12% Salary Benchmark", "demand": "High", "key": "docker"},
            {"skill": "Generative AI & LLMs", "impact": "+18% Salary Benchmark", "demand": "Critical", "key": "ai"},
            {"skill": "Cybersecurity Compliance (NCA)", "impact": "+14% Salary Benchmark", "demand": "Critical", "key": "cyber"},
            {"skill": "TypeScript & Next.js", "impact": "+10% Salary Benchmark", "demand": "High", "key": "typescript"},
        ]
        for item in recommendation_catalog:
            if not any(item["key"] in s for s in all_skills_lower):
                recommended_skills.append({
                    "skill": item["skill"],
                    "impact": item["impact"],
                    "demand_level": item["demand"]
                })
        if not recommended_skills:
            recommended_skills.append({"skill": "Enterprise Cloud Architecture", "impact": "+15% Benchmark", "demand_level": "Critical"})

        # Record or update CandidateMarketInsight in database
        try:
            cand_id_str = str(getattr(candidate, 'user_id', None) or getattr(candidate, 'id', 'user_default'))
            existing = CandidateMarketInsight.query.filter_by(candidate_id=cand_id_str).first()
            if not existing:
                existing = CandidateMarketInsight(candidate_id=cand_id_str, estimated_salary_min=benchmark["salary_min"],
                                                 estimated_salary_max=benchmark["salary_max"], average_salary=benchmark["average_salary"])
                db.session.add(existing)

            existing.estimated_salary_min = benchmark["salary_min"]
            existing.estimated_salary_max = benchmark["salary_max"]
            existing.average_salary = benchmark["average_salary"]
            existing.currency = benchmark["currency"]
            existing.matching_roles = json.dumps(matching_roles)
            existing.skill_match_percentage = skill_match_pct
            existing.skill_demand = benchmark["demand_level"]
            existing.industry_demand = "High"
            existing.market_position = market_position
            existing.profile_strength = int(skill_match_pct)
            existing.data_source = benchmark["data_source"]
            existing.is_demo = True
            existing.last_updated = datetime.utcnow()
            db.session.commit()
        except Exception:
            db.session.rollback()

        # Build INR equivalent representation for multi-currency display (e.g. ₹6 LPA - ₹10 LPA)
        # Approximate conversion: 1 SAR = 22 INR. Annual SAR 192k = ~42 Lakhs INR or localized equivalent brackets
        sar_min = benchmark["salary_min"]
        sar_max = benchmark["salary_max"]
        sar_avg = benchmark["average_salary"]

        lpa_min = round((sar_min * 12 * 0.045), 1)  # scaled bracket
        lpa_max = round((sar_max * 12 * 0.045), 1)
        lpa_avg = round((sar_avg * 12 * 0.045), 1)

        return {
            "candidate_name": getattr(candidate, 'fullname', 'Candidate'),
            "job_role": role,
            "specialization": specialization,
            "location": location,
            "experience_years": experience_years,
            "estimated_market_salary": {
                "min": sar_min,
                "max": sar_max,
                "average": sar_avg,
                "currency": benchmark["currency"],
                "period": "Monthly",
                "annual_min": sar_min * 12,
                "annual_max": sar_max * 12,
                "annual_average": sar_avg * 12,
                "formatted_sar": f"{sar_min:,.0f} – {sar_max:,.0f} SAR",
                "formatted_lpa": f"₹{lpa_min} LPA – ₹{lpa_max} LPA",
                "formatted_average_sar": f"{sar_avg:,.0f} SAR",
                "formatted_average_lpa": f"₹{lpa_avg} LPA"
            },
            "skill_demand": benchmark["demand_level"],
            "industry_demand": "High",
            "matching_roles": matching_roles,
            "profile_strength": int(skill_match_pct),
            "skill_match_percentage": skill_match_pct,
            "market_position": market_position,
            "skill_analysis": skill_analysis,
            "salary_by_experience": benchmark["experience_breakdown"],
            "salary_by_location": benchmark["location_breakdown"],
            "recommended_skills": recommended_skills,
            "data_source": benchmark["data_source"],
            "data_date": benchmark["data_date"],
            "last_updated": benchmark["last_updated"],
            "is_demo": True,
            "disclaimer": "Estimated market salary range based on sample benchmark datasets. Not a fixed person valuation."
        }

    def get_company_hiring_insights(self, company_id: int) -> Dict[str, Any]:
        """
        Analyzes company's existing job openings or requirements and generates hiring market intelligence:
        Openings, Estimated Salary Range, Talent Availability, Skill Demand, Hiring Competition, Estimated Hiring Cost.
        """
        from services.job import Jobs
        from services.customer import Customers

        # Fetch company's active jobs
        jobs = Jobs.query.filter_by(company_id=company_id).all() if company_id else []

        hiring_roles = []
        if jobs:
            for j in jobs:
                req_skills = [s.strip() for s in (j.required_skills or "React, JavaScript, TypeScript").split(",") if s.strip()]
                bench = self._provider.get_salary_benchmark(
                    role=j.title,
                    specialization=j.specialization or "Technology",
                    skills=req_skills,
                    location=j.town or "Riyadh"
                )
                annual_cost = bench["average_salary"] * 12 * 1.15  # Includes 15% onboarding & benefits factor

                hiring_roles.append({
                    "job_id": j.id,
                    "job_role": j.title,
                    "specialization": j.specialization,
                    "required_skills": req_skills,
                    "experience_required": j.skills_years or "2–4 Years",
                    "location": j.town or "Riyadh",
                    "openings": 3,
                    "salary_min": bench["salary_min"],
                    "salary_max": bench["salary_max"],
                    "average_salary": bench["average_salary"],
                    "currency": bench["currency"],
                    "talent_availability": bench["talent_availability"],
                    "skill_demand": bench["demand_level"],
                    "hiring_competition": bench["hiring_competition"],
                    "estimated_annual_hiring_cost": round(annual_cost, -2),
                    "formatted_salary_sar": f"{bench['salary_min']:,.0f} – {bench['salary_max']:,.0f} SAR",
                    "formatted_salary_lpa": f"₹{round(bench['salary_min']*12*0.045, 1)} – ₹{round(bench['salary_max']*12*0.045, 1)} LPA",
                    "data_source": bench["data_source"],
                    "last_updated": bench["last_updated"],
                    "is_demo": True
                })
        else:
            # Default representative roles for company dashboard
            default_roles = [
                {"title": "React & Full Stack Developer", "skills": ["React", "JavaScript", "TypeScript"], "exp": "2–4 Years", "town": "Riyadh", "openings": 5},
                {"title": "Cloud & DevOps Engineer", "skills": ["AWS", "Docker", "Kubernetes"], "exp": "3–5 Years", "town": "Eastern Province", "openings": 3},
                {"title": "AI & Data Engineer", "skills": ["Python", "PyTorch", "SQL"], "exp": "2–5 Years", "town": "Riyadh", "openings": 2}
            ]
            for r in default_roles:
                bench = self._provider.get_salary_benchmark(role=r["title"], skills=r["skills"], location=r["town"])
                annual_cost = bench["average_salary"] * 12 * 1.15 * r["openings"]
                hiring_roles.append({
                    "job_id": None,
                    "job_role": r["title"],
                    "specialization": "Information Technology",
                    "required_skills": r["skills"],
                    "experience_required": r["exp"],
                    "location": r["town"],
                    "openings": r["openings"],
                    "salary_min": bench["salary_min"],
                    "salary_max": bench["salary_max"],
                    "average_salary": bench["average_salary"],
                    "currency": bench["currency"],
                    "talent_availability": bench["talent_availability"],
                    "skill_demand": bench["demand_level"],
                    "hiring_competition": bench["hiring_competition"],
                    "estimated_annual_hiring_cost": round(annual_cost, -2),
                    "formatted_salary_sar": f"{bench['salary_min']:,.0f} – {bench['salary_max']:,.0f} SAR",
                    "formatted_salary_lpa": f"₹{round(bench['salary_min']*12*0.045, 1)} – ₹{round(bench['salary_max']*12*0.045, 1)} LPA",
                    "data_source": bench["data_source"],
                    "last_updated": bench["last_updated"],
                    "is_demo": True
                })

        # Company Talent Pool & Requirements
        total_candidates = Customers.query.count() or 4200
        talent_requirements = {
            "most_requested_skills": [
                {"skill": "React", "count": 1250, "demand": "High", "availability": "High"},
                {"skill": "Node.js", "count": 980, "demand": "High", "availability": "Moderate"},
                {"skill": "TypeScript", "count": 890, "demand": "High", "availability": "Moderate"},
                {"skill": "Python & Data", "count": 1420, "demand": "Critical", "availability": "Moderate"},
                {"skill": "AWS Cloud", "count": 620, "demand": "Critical", "availability": "Scarce"},
            ],
            "hard_to_find_skills": [
                {"skill": "Cybersecurity & NCA Audit", "count": 320, "scarcity": "Very High", "rec_action": "Early Internship / University Partnership"},
                {"skill": "Kubernetes & Cloud FinOps", "count": 410, "scarcity": "High", "rec_action": "Competitive Signing Compensation"},
                {"skill": "Deep Learning & Generative Models", "count": 280, "scarcity": "Very High", "rec_action": "Academic Research Collaboration"}
            ],
            "candidate_experience_distribution": [
                {"tier": "Junior (0–2 Yrs)", "percentage": 42, "candidate_count": round(total_candidates * 0.42)},
                {"tier": "Mid-level (3–5 Yrs)", "percentage": 36, "candidate_count": round(total_candidates * 0.36)},
                {"tier": "Senior (6–8 Yrs)", "percentage": 15, "candidate_count": round(total_candidates * 0.15)},
                {"tier": "Lead & Architect (9+ Yrs)", "percentage": 7, "candidate_count": round(total_candidates * 0.07)},
            ],
            "location_wise_talent": [
                {"location": "Riyadh", "candidate_count": round(total_candidates * 0.48), "percentage": 48},
                {"location": "Eastern Province (Dhahran/Al-Ahsa)", "candidate_count": round(total_candidates * 0.28), "percentage": 28},
                {"location": "Jeddah & Western Province", "candidate_count": round(total_candidates * 0.18), "percentage": 18},
                {"location": "Other / Remote", "candidate_count": round(total_candidates * 0.06), "percentage": 6},
            ]
        }

        return {
            "hiring_roles": hiring_roles,
            "talent_requirements": talent_requirements,
            "total_openings": sum(r["openings"] for r in hiring_roles),
            "data_source": self._provider.provider_name,
            "data_date": self._provider.data_date,
            "last_updated": self._provider.last_updated,
            "is_demo": True
        }

    def get_matching_candidates_for_skill(self, skill: str) -> List[Dict[str, Any]]:
        """Returns matching candidates with skill for company modal/drawer."""
        from services.customer import Customers
        candidates = Customers.query.filter(
            (Customers.preferred_field_of_work.ilike(f"%{skill}%")) |
            (Customers.skills.any())
        ).limit(10).all()

        results = []
        if candidates:
            for c in candidates:
                results.append({
                    "id": c.id,
                    "fullname": c.fullname,
                    "user_id": c.user_id,
                    "job_role": c.preferred_field_of_work or "Software Engineer",
                    "specialization": c.department_university or "Computer Science",
                    "experience_years": c.years_of_skills or "2",
                    "location": c.government or c.city or "Riyadh",
                    "is_verified": bool(c.is_verified),
                    "educational_qualification": c.educational_qualification or "Bachelor",
                    "avatar": c.img or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
                })
        else:
            # Clean demo candidates matching skill
            demo_cand = [
                {"id": 101, "fullname": "عمر بن خالد المنصور", "user_id": "cand_omar", "job_role": f"{skill} Specialist", "specialization": "هندسة البرمجيات", "experience_years": "3", "location": "الظهران", "is_verified": True, "educational_qualification": "بكالوريوس", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"},
                {"id": 102, "fullname": "سارة بنت منصور العتيبي", "user_id": "cand_sara", "job_role": f"Lead {skill} Developer", "specialization": "علوم الحاسب والبيانات", "experience_years": "4", "location": "الرياض", "is_verified": True, "educational_qualification": "ماجستير", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"},
                {"id": 103, "fullname": "ريم بنت فهد الحليبي", "user_id": "cand_reem", "job_role": f"{skill} Engineer", "specialization": "الأمن السيبراني والبرمجيات", "experience_years": "2", "location": "الدمام", "is_verified": True, "educational_qualification": "بكالوريوس", "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop"},
            ]
            results = demo_cand

        return results

    def get_university_graduate_insights(self, university_id: Optional[int] = None) -> Dict[str, Any]:
        """
        Aggregated, anonymized graduate employment insights for academic leadership and career centers.
        Strictly protects individual candidate privacy; never exposes personal compensation publicly.
        """
        return {
            "university_name": "جامعة الملك فيصل (King Faisal University)",
            "graduate_employment_rate": {
                "overall_rate": 87.6,
                "in_field_employment": 74.2,
                "out_of_field_employment": 13.4,
                "benchmark_vision_2030": 78.0,
                "performance_status": "+9.6% Above Vision 2030 National Target"
            },
            "common_job_roles": [
                {"role": "Software & DevOps Engineer", "graduates_count": 184, "employment_rate": 92.4, "avg_starting_salary": "SAR 14,500"},
                {"role": "Cybersecurity & SOC Analyst", "graduates_count": 112, "employment_rate": 95.1, "avg_starting_salary": "SAR 16,000"},
                {"role": "Data & AI Associate", "graduates_count": 96, "employment_rate": 88.5, "avg_starting_salary": "SAR 15,200"},
                {"role": "ERP & MIS Consultant", "graduates_count": 82, "employment_rate": 84.0, "avg_starting_salary": "SAR 13,000"},
                {"role": "Agricultural Tech Specialist", "graduates_count": 78, "employment_rate": 81.5, "avg_starting_salary": "SAR 12,500"},
            ],
            "average_salary_ranges": [
                {"bracket": "Under SAR 8,000", "percentage": 8.2, "count": 48},
                {"bracket": "SAR 8,000 – 11,000", "percentage": 24.5, "count": 145},
                {"bracket": "SAR 11,000 – 15,000", "percentage": 46.8, "count": 278},
                {"bracket": "Above SAR 15,000", "percentage": 20.5, "count": 124},
            ],
            "top_hiring_industries": [
                {"industry": "Technology & Software Solutions", "percentage": 34, "hires": 202},
                {"industry": "Energy, Oil & Petrochemicals", "percentage": 26, "hires": 154},
                {"industry": "Banking, Fintech & Insurance", "percentage": 18, "hires": 107},
                {"industry": "Government & Defense Entities", "percentage": 14, "hires": 83},
                {"industry": "Modern Agriculture & Food Processing", "percentage": 8, "hires": 49},
            ],
            "top_hiring_companies": [
                {"company": "Saudi Aramco", "graduates_hired": 58, "sector": "Energy & Digital R&D"},
                {"company": "Solutions by stc", "graduates_hired": 44, "sector": "Telecom & Cloud"},
                {"company": "Elm (علم)", "graduates_hired": 36, "sector": "Digital Services & AI"},
                {"company": "Almarai (المراعي)", "graduates_hired": 28, "sector": "Supply Chain & Automation"},
                {"company": "Alinma Bank (مصرف الإنماء)", "graduates_hired": 22, "sector": "Fintech & Banking"},
            ],
            "most_demanded_skills": [
                {"skill": "React & Modern Web Systems", "hiring_mentions": 142, "demand_level": "High"},
                {"skill": "Cloud Infrastructure (AWS / Azure)", "hiring_mentions": 128, "demand_level": "Critical"},
                {"skill": "Cybersecurity & Incident Response", "hiring_mentions": 98, "demand_level": "Critical"},
                {"skill": "Python, Machine Learning & SQL", "hiring_mentions": 92, "demand_level": "Critical"},
                {"skill": "Enterprise ERP & Process Mapping", "hiring_mentions": 76, "demand_level": "High"},
            ],
            "placement_trends": {
                "avg_time_to_hire_months": 3.4,
                "internship_to_job_conversion_rate": 68.5,
                "accredited_partner_companies": 48
            },
            "location_wise_employment": [
                {"city": "Eastern Province (Al-Ahsa, Dhahran, Dammam)", "percentage": 58},
                {"city": "Riyadh Capital Region", "percentage": 32},
                {"city": "Other Regions & Remote", "percentage": 10},
            ],
            "data_source": self._provider.provider_name,
            "data_date": self._provider.data_date,
            "last_updated": self._provider.last_updated,
            "privacy_compliance": "Fully anonymized and aggregated. Zero individual candidate salary exposure.",
            "is_demo": True
        }


# Singleton instance
market_data_service = MarketDataService()
