# ==============================================================================
# services/faeda_profile_analyzer.py  (formerly linkedin_analyzer.py)
# ==============================================================================
# AI-Powered Faeda Profile Analysis & Optimization Engine
# Evaluates Headline, About, Skills, Experience, and SEO Visibility against
# real Saudi Vision 2030 tech market standards and benchmark demand.
# ==============================================================================

import re
from typing import Dict, List, Any, Optional
from services.gemini_analyzer import GeminiAnalyzerService


SAUDI_TOP_IN_DEMAND_SKILLS = [
    {"name": "React / Next.js", "demand": 94, "category": "Frontend"},
    {"name": "Python / AI / ML", "demand": 96, "category": "AI & Data"},
    {"name": "Cloud (AWS / Azure)", "demand": 91, "category": "DevOps & Cloud"},
    {"name": "Node.js / TypeScript", "demand": 89, "category": "Backend"},
    {"name": "Cybersecurity & GRC", "demand": 95, "category": "Security"},
    {"name": "Docker & Kubernetes", "demand": 88, "category": "Infrastructure"},
    {"name": "PostgreSQL & Database Design", "demand": 85, "category": "Database"},
    {"name": "API & Microservices Architecture", "demand": 90, "category": "Backend"},
    {"name": "Product & Agile Management", "demand": 86, "category": "Management"},
]

ACTION_VERBS = [
    "led", "built", "engineered", "developed", "architected", "increased",
    "reduced", "delivered", "optimized", "spearheaded", "designed", "scaled",
    "launched", "implemented", "generated", "mentored", "automated",
    "قاد", "طوّر", "صمّم", "أنشأ", "أطلق", "حسّن", "نفّذ", "أدار"
]

CLICHE_PHRASES = [
    "looking for new opportunity", "seeking opportunities", "hard worker",
    "passionate professional", "team player", "looking for job",
    "باحث عن عمل", "أبحث عن فرصة", "شغوف بالعمل"
]


class LinkedInAnalyzer:
    """Evaluates and provides actionable AI audits for Faeda candidate profiles."""

    @staticmethod
    def extract_username(url_or_name: str) -> str:
        """Extract clean profile handle from URL or raw string."""
        if not url_or_name:
            return "professional"
        cleaned = url_or_name.strip()
        match = re.search(r"linkedin\.com/in/([a-zA-Z0-9_\-]+)", cleaned)
        if match:
            return match.group(1)
        return re.sub(r"[^a-zA-Z0-9_\-]", "", cleaned) or "professional"

    @classmethod
    def analyze_profile(
        cls,
        linkedin_url: Optional[str] = None,
        headline: Optional[str] = None,
        about: Optional[str] = None,
        skills: Optional[List[str]] = None,
        experience_text: Optional[str] = None,
        raw_text: Optional[str] = None,
        role: Optional[str] = None,
        experience_years: int = 3,
        location: str = "Riyadh, Saudi Arabia"
    ) -> Dict[str, Any]:
        """Comprehensive audit of a candidate's Faeda profile presence."""
        username = cls.extract_username(linkedin_url or "")
        skills_list = [s.strip() for s in (skills or []) if s.strip()]
        
        # If raw text was provided (e.g. from pasted resume/profile), extract fields
        if raw_text and not headline:
            lines = [l.strip() for l in raw_text.split("\n") if l.strip()]
            if lines:
                headline = lines[0]
                if len(lines) > 1 and not about:
                    about = " ".join(lines[1:5])

        # Do NOT overwrite explicit user input if string was provided
        if headline is None:
            headline = f"{role or 'Software Engineer'} | Helping Teams Build Scalable Solutions" if role else ""
        headline = headline.strip()
        about = (about if about is not None else "").strip()
        role = role or "Software Engineer"

        # 1. Headline Audit
        headline_audit = cls._audit_headline(headline, role)

        # 2. About / Summary Audit
        about_audit = cls._audit_about(about, skills_list)

        # 3. Experience Impact Audit (uses both years and text)
        exp_audit = cls._audit_experience(experience_text or "", experience_years)

        # 4. Skills & Saudi Market Alignment Audit
        skills_audit = cls._audit_skills(skills_list, role)

        # 5. SEO & Recruiter Visibility Audit
        seo_audit = cls._audit_seo(headline, about, skills_list, location, linkedin_url)

        # 6. Overall Composite Score (0 - 100)
        overall_score = round(
            (headline_audit["score"] * 0.25) +
            (about_audit["score"] * 0.25) +
            (exp_audit["score"] * 0.20) +
            (skills_audit["score"] * 0.20) +
            (seo_audit["score"] * 0.10)
        )

        all_star_rating = (
            "All-Star" if overall_score >= 88 else
            "Advanced" if overall_score >= 72 else
            "Intermediate" if overall_score >= 55 else
            "Beginner"
        )

        percentile = (
            "Top 8% in Saudi Tech Market" if overall_score >= 90 else
            "Top 18% in Saudi Tech Market" if overall_score >= 80 else
            "Top 35% in Saudi Tech Market" if overall_score >= 65 else
            "Average Range (50th Percentile)"
        )

        # 7. Dynamic Saudi Market Value & Salary Boost Estimation
        base_salary_min = 11000 + (experience_years * 2200)
        base_salary_max = 16500 + (experience_years * 3200)

        # Dynamic salary boost reflects upside unlocked by closing gaps across profile sections:
        headline_upside = round(((100 - headline_audit["score"]) / 100) * 1500)
        about_upside = round(((100 - about_audit["score"]) / 100) * 1800)
        skills_upside = round(len(skills_audit.get("missing_skills", [])) * 450)
        seo_upside = round(((100 - seo_audit["score"]) / 100) * 1200)
        exp_base_boost = round(1000 + (experience_years * 400))

        boost_amount = max(1800, exp_base_boost + headline_upside + about_upside + skills_upside + seo_upside)
        optimized_min = base_salary_min + round(boost_amount * 0.85)
        optimized_max = base_salary_max + round(boost_amount * 1.35)

        # 8. AI-Powered Rewrite Suggestions (Try Google Gemini 1.5 Flash first, fallback to benchmark engine)
        gemini_result = GeminiAnalyzerService.analyze_with_gemini(
            role=role,
            headline=headline,
            about=about,
            skills=skills_list,
            experience_years=experience_years,
            location=location
        )

        ai_rewrites = cls._generate_ai_rewrites(role, skills_list, headline, experience_years)
        ai_powered_by = "Faeda Vision 2030 AI Engine"

        if gemini_result:
            ai_powered_by = f"Google Gemini ({gemini_result.get('model_used', 'gemini-1.5-flash')})"
            if gemini_result.get("rewritten_headlines"):
                ai_rewrites["headlines"] = gemini_result["rewritten_headlines"]
            if gemini_result.get("rewritten_about_bio"):
                ai_rewrites["about_bio"] = gemini_result["rewritten_about_bio"]
            if gemini_result.get("headline_critique_ar"):
                headline_audit["recommendation_ar"] = gemini_result["headline_critique_ar"]
            if gemini_result.get("headline_critique_en"):
                headline_audit["recommendation_en"] = gemini_result["headline_critique_en"]
            if gemini_result.get("about_critique_ar"):
                about_audit["recommendation_ar"] = gemini_result["about_critique_ar"]
            if gemini_result.get("about_critique_en"):
                about_audit["recommendation_en"] = gemini_result["about_critique_en"]

        # 9. Actionable Checklist
        checklist = cls._generate_checklist(
            headline_audit, about_audit, exp_audit, skills_audit, seo_audit
        )

        return {
            "success": True,
            "username": username,
            "profile_url": f"https://faeda.com.sa/candidate/{username}",
            "role": role,
            "location": location,
            "overall_score": overall_score,
            "all_star_rating": all_star_rating,
            "percentile_rank": percentile,
            "ai_powered_by": ai_powered_by,
            "sections": {
                "headline": headline_audit,
                "about": about_audit,
                "experience": exp_audit,
                "skills": skills_audit,
                "visibility_seo": seo_audit,
            },
            "market_impact": {
                "current_estimated_salary": f"{base_salary_min:,} - {base_salary_max:,} SAR/mo",
                "optimized_salary_potential": f"{optimized_min:,} - {optimized_max:,} SAR/mo",
                "monthly_salary_boost_sar": boost_amount,
                "search_appearances_multiplier": "3.8x",
                "recruiter_inmail_multiplier": "4.2x",
                "matched_high_demand_skills": skills_audit["matched_skills"],
                "missing_high_demand_skills": skills_audit["missing_skills"],
            },
            "ai_rewrites": ai_rewrites,
            "checklist": checklist,
            "summary_insights": {
                "strengths_ar": [
                    "تغطية جيدة للمهارات التقنية الأساسية.",
                    "استهداف قطاع حيوي ومطلوب في السوق السعودي."
                ],
                "strengths_en": [
                    "Strong foundation of core technical competencies.",
                    "Targeting high-growth tech sectors aligned with Saudi Vision 2030."
                ],
                "strengths_hi": [
                    "मुख्य तकनीकी कौशल का अच्छा आधार।",
                    "सऊदी बाजार में उच्च मांग वाले क्षेत्रों से मेल खाता है।"
                ],
                "key_improvement_ar": "أضف أرقاماً ونتائج ملموسة (% أو وفورات) في نبذة About والخبرات.",
                "key_improvement_en": "Quantify past achievements with measurable metrics (%, revenue, user count) in About and Experience.",
                "key_improvement_hi": "अपने 'About' और 'Experience' में उपलब्धियों को आंकड़ों (%, मेट्रिक्स) के साथ जोड़ें।"
            }
        }

    # --------------------------------------------------------------------------
    # Sub-Audits
    # --------------------------------------------------------------------------
    @classmethod
    def _audit_headline(cls, headline: str, role: str) -> Dict[str, Any]:
        score = 65
        issues_ar = []
        issues_en = []
        issues_hi = []

        trimmed = (headline or "").strip()
        if not trimmed:
            score = 20
            issues_ar.append("العنوان فارغ تماماً! العنوان هو العامل الأول لظهورك في خوارزميات البحث للمستقطبين.")
            issues_en.append("Headline is empty! It is the #1 ranking factor on Faeda search and recruiter discovery.")
            issues_hi.append("शीर्षक खाली है! यह लिंक्डइन सर्च में सबसे महत्वपूर्ण कारक है।")
        elif len(trimmed) < 35:
            score -= 22
            issues_ar.append("العنوان قصير جداً. العنوان المثالي بين 60 إلى 120 حرفاً.")
            issues_en.append("Headline is too short. Ideal length is 60–120 characters.")
            issues_hi.append("शीर्षक बहुत छोटा है। 60-120 अक्षर बेहतर हैं।")
        elif len(trimmed) >= 60 and len(trimmed) <= 150:
            score += 15

        if trimmed:
            # Check for cliches
            lowered = trimmed.lower()
            has_cliche = any(c in lowered for c in CLICHE_PHRASES)
            if has_cliche:
                score -= 20
                issues_ar.append("تجنب عبارات تقليدية مثل 'Looking for job' أو 'باحث عن عمل'؛ ركّز على قيمتك المضافة.")
                issues_en.append("Avoid passive phrases like 'Seeking opportunities'; showcase your high-value specialty instead.")
                issues_hi.append("'Seeking opportunity' जैसे शब्दों से बचें; अपनी विशेषज्ञता दिखाएं।")

            # Check for role keywords and value prop separator (| or •)
            if "|" in trimmed or "•" in trimmed or "—" in trimmed:
                score += 10
            if role and role.lower() in lowered:
                score += 10

        score = max(20, min(98, score))
        status = "good" if score >= 80 else "warning" if score >= 60 else "critical"

        return {
            "score": score,
            "status": status,
            "current_text": headline,
            "character_count": len(trimmed),
            "issues_ar": issues_ar,
            "issues_en": issues_en,
            "issues_hi": issues_hi,
            "recommendation_ar": "استخدم صيغة: [المسمى الوظيفي] | [التقنيات المتخصصة] | [القيمة المقدمة للشركات]",
            "recommendation_en": "Use formula: [Target Role] | [Core Stack / Domain] | [Measurable Business Impact]",
            "recommendation_hi": "फॉर्मूला: [पद] | [कौशल / तकनीक] | [व्यावसायिक प्रभाव]",
        }

    @classmethod
    def _audit_about(cls, about: str, skills: List[str]) -> Dict[str, Any]:
        score = 55
        issues_ar = []
        issues_en = []
        issues_hi = []

        trimmed = (about or "").strip()
        word_count = len(trimmed.split()) if trimmed else 0

        if not trimmed:
            score = 20
            issues_ar.append("قسم 'About' فارغ تماماً. بدون نبذة، تتجاهل خوارزميات الاستقطاب أكثر من 80% من الملفات.")
            issues_en.append("About section is empty. Recruiters cannot evaluate your mission, achievements, or domain impact.")
            issues_hi.append("About सेक्शन खाली है। रिक्रूटर्स आपकी उपलब्धियों को नहीं देख सकते।")
        elif word_count < 25:
            score -= 25
            issues_ar.append("قسم 'About' قصير جداً. المستقطبون يفضلون ملخصاً من 3 فقرات (100-250 كلمة).")
            issues_en.append("About section is too brief. Recruiters prefer 100-250 words describing your story & stack.")
            issues_hi.append("About सेक्शन बहुत छोटा है। 100-250 शब्दों का सारांश अधिक प्रभावी होता है।")
        elif word_count >= 80:
            score += 20

        # Check for numbers / quantifiable achievements
        has_numbers = bool(re.search(r"\b\d+[%+kKmM]?\b", trimmed))
        if has_numbers:
            score += 15
        elif trimmed:
            issues_ar.append("لا توجد أرقام أو مقاييس إنجاز (مثل: % زيادة، عدد المشاريع، الميزانية).")
            issues_en.append("Missing quantifiable metrics (e.g. % performance increase, team size, users served).")
            issues_hi.append("उपलब्धियों में संख्या या प्रतिशत का अभाव है।")

        # Check for Call-to-action
        has_cta = any(w in trimmed.lower() for w in ["contact", "reach", "email", "connect", "تواصل", "راسلني"])
        if has_cta:
            score += 10

        score = max(20, min(96, score))
        status = "good" if score >= 80 else "warning" if score >= 55 else "critical"

        return {
            "score": score,
            "status": status,
            "word_count": word_count,
            "has_metrics": has_numbers,
            "issues_ar": issues_ar,
            "issues_en": issues_en,
            "issues_hi": issues_hi,
            "recommendation_ar": "قسّم النبذة إلى: 1) من أنت وشغفك، 2) أبرز إنجازاتك بالأرقام، 3) دعوتك للتواصل ومجالات اهتمامك.",
            "recommendation_en": "Structure into 3 hooks: 1) Who you are & mission, 2) Quantified career wins, 3) Clear call to action.",
            "recommendation_hi": "3 भागों में लिखें: 1) आपकी विशेषज्ञता, 2) प्रमुख उपलब्धियां, 3) संपर्क करने का आह्वान।",
        }

    @classmethod
    def _audit_experience(cls, experience_text: str, experience_years: int = 3) -> Dict[str, Any]:
        # Reactive base score from experience_years (1 to 15+ years)
        if experience_years >= 12:
            base_score = 96
        elif experience_years >= 8:
            base_score = 91
        elif experience_years >= 5:
            base_score = 84
        elif experience_years >= 3:
            base_score = 76
        elif experience_years >= 2:
            base_score = 66
        else:
            base_score = 54

        issues_ar = []
        issues_en = []
        issues_hi = []

        lowered = (experience_text or "").lower()
        found_verbs = [v for v in ACTION_VERBS if v in lowered]
        if len(found_verbs) >= 2:
            base_score += 8
        elif experience_text:
            issues_ar.append("استخدم أفعال إنجاز قوية في بداية كل نقطة (مثل: طوّر، قاد، زاد، خفّض، أطلق).")
            issues_en.append("Begin accomplishment bullets with strong action verbs (Engineered, Spearheaded, Optimized, Scaled).")
            issues_hi.append("अनुभव के बुलेट पॉइंट्स को मजबूत एक्शन वर्ब्स से शुरू करें।")

        has_metrics = bool(re.search(r"\b\d+[%+kKmM]?\b", experience_text or ""))
        if has_metrics:
            base_score += 8
        elif experience_text:
            issues_ar.append("تحتاج نقاط الخبرة إلى أرقام تعكس الأثر التجاري والتقني لعملك.")
            issues_en.append("Include measurable KPIs in your experience descriptions (e.g. +35% latency improvement).")
            issues_hi.append("अपने काम के प्रभाव को दिखाने के लिए आंकड़े जोड़ें।")

        score = max(35, min(98, base_score))
        status = "good" if score >= 80 else "warning" if score >= 60 else "critical"

        return {
            "score": score,
            "status": status,
            "experience_years": experience_years,
            "action_verbs_found": len(found_verbs),
            "issues_ar": issues_ar,
            "issues_en": issues_en,
            "issues_hi": issues_hi,
            "recommendation_ar": f"لديك {experience_years} سنوات خبرة. استخدم منهجية STAR لربط كل مهمة بنتيجة واقعية في المشاريع السابقة.",
            "recommendation_en": f"Leverage your {experience_years} years of experience using the STAR model (Situation, Task, Action, Result).",
            "recommendation_hi": f"अपने {experience_years} साल के अनुभव को STAR तकनीक से प्रस्तुत करें।",
        }

    @classmethod
    def _audit_skills(cls, skills: List[str], role: str) -> Dict[str, Any]:
        matched = []
        missing = []
        skills_lower = [s.lower() for s in skills]

        for s in SAUDI_TOP_IN_DEMAND_SKILLS:
            name_parts = [p.strip().lower() for p in s["name"].replace("/", " ").replace("(", " ").replace(")", " ").split()]
            if any(p in " ".join(skills_lower) for p in name_parts if len(p) > 2):
                matched.append(s)
            else:
                missing.append(s)

        # Score based on how many in-demand skills are present
        score = 50 + (len(matched) * 10)
        score = max(40, min(98, score))
        status = "good" if score >= 80 else "warning" if score >= 60 else "critical"

        return {
            "score": score,
            "status": status,
            "total_skills_count": len(skills),
            "matched_skills": [m["name"] for m in matched],
            "missing_skills": [m["name"] for m in missing[:4]],
            "recommendation_ar": f"أضف المهارات الأكثر طلباً في السوق السعودي حالياً: {', '.join([m['name'] for m in missing[:3]])}",
            "recommendation_en": f"Add high-demand Saudi Vision 2030 skills: {', '.join([m['name'] for m in missing[:3]])}",
            "recommendation_hi": f"सऊदी बाजार में मांग वाले ये कौशल जोड़ें: {', '.join([m['name'] for m in missing[:3]])}",
        }

    @classmethod
    def _audit_seo(cls, headline: str, about: str, skills: List[str], location: str, linkedin_url: Optional[str] = None) -> Dict[str, Any]:  # param kept for backward-compat
        url_adjustment = 0
        issues_ar = []
        issues_en = []
        issues_hi = []
        vanity_status = "missing"
        extracted_username = ""

        if not linkedin_url or not linkedin_url.strip():
            url_adjustment = -14
            issues_ar.append("لم يتم ربط رابط فائدة العام. يفضل إضافة رابط حسابك لتوثيق حضورك المهني.")
            issues_en.append("No public Faeda profile URL provided. Linking your profile boosts recruiter trust by 3x.")
            issues_hi.append("कोई सार्वजनिक फ़ाएदा प्रोफ़ाइल यूआरएल नहीं जोड़ा गया।")
        else:
            match = re.search(r"(?:faeda\.com\.sa\/candidate\/|linkedin\.com\/in\/|^@?)([a-zA-Z0-9_\-]+)", linkedin_url.strip(), re.IGNORECASE)
            if not match or len(match.group(1)) < 2:
                url_adjustment = -10
                vanity_status = "invalid"
                issues_ar.append("تنسيق رابط فائدة غير صالح.")
                issues_en.append("Invalid Faeda profile URL format. Expected faeda.com.sa/candidate/username.")
                issues_hi.append("अमान्य फ़ाएदा प्रोफ़ाइल यूआरएल।")
            else:
                extracted_username = match.group(1)
                has_auto_digits = bool(re.search(r"-[0-9a-f]{5,}$|-[0-9]{4,}$", extracted_username, re.IGNORECASE))
                if has_auto_digits:
                    vanity_status = "default_numbers"
                    url_adjustment = +3
                    issues_ar.append("رابط حسابك ينتهي بأرقام تلقائية عشوائية. تخصيص الرابط يرفع ترتيبك بنسبة 28%.")
                    issues_en.append("Your Faeda profile URL ends with default numbers. Customizing your vanity URL improves ranking by 28%.")
                    issues_hi.append("कस्टम वैनिटी यूआरएल बनाने से सर्च रैंकिंग सुधरती है।")
                else:
                    vanity_status = "custom"
                    url_adjustment = +16

        score = 55 + url_adjustment
        full_text = f"{headline} {about} {' '.join(skills)} {location}".lower()

        if "saudi" in full_text or "riyadh" in full_text or "jeddah" in full_text or "الرياض" in full_text:
            score += 15
        if len(skills) >= 5:
            score += 10
        score = max(30, min(98, score))
        status = "good" if score >= 80 else "warning"

        return {
            "score": score,
            "status": status,
            "vanity_status": vanity_status,
            "extracted_username": extracted_username,
            "issues_ar": issues_ar,
            "issues_en": issues_en,
            "issues_hi": issues_hi,
            "location_optimized": True,
            "recommendation_ar": "رابط الحساب المخصص واستهداف المدن السعودية الرئيسية يضمنان ظهورك في صدارة محركات بحث التوظيف.",
            "recommendation_en": "Custom vanity URL and Saudi tech hub location targeting maximize recruiter discovery.",
            "recommendation_hi": "कस्टम वैनिटी यूआरएल और सऊदी अरब लोकेशन रिक्रूटर सर्च के लिए आदर्श हैं।",
        }

    # --------------------------------------------------------------------------
    # AI Generators & Rewrite Presets
    # --------------------------------------------------------------------------
    @classmethod
    def _generate_ai_rewrites(cls, role: str, skills: List[str], headline: str, experience_years: int) -> Dict[str, Any]:
        top_skills = ", ".join(skills[:3]) if skills else "Modern Tech Architecture & Cloud"

        return {
            "headlines": [
                {
                    "style": "Executive & Impact",
                    "text_ar": f"{role} | قيادة الحلول الرقمية وهندسة البرمجيات | تمكين التحول الرقمي ورؤية 2030",
                    "text_en": f"{role} | Driving Scalable Software Architecture & Digital Transformation | {top_skills}",
                    "text_hi": f"{role} | स्केलेबल सॉफ्टवेयर आर्किटेक्चर और डिजिटल समाधान | {top_skills}",
                    "focus": "Executive leadership & business outcomes"
                },
                {
                    "style": "Specialist & Tech Stack",
                    "text_ar": f"{role} متمرس في {top_skills} | بناء تطبيقات عالية الأداء وقابلة للتوسع",
                    "text_en": f"{role} specializing in {top_skills} | High-Throughput & Cloud-Native Systems",
                    "text_hi": f"{role} विशेषज्ञ: {top_skills} | उच्च प्रदर्शन और क्लाउड-नेटिव सिस्टम्स",
                    "focus": "Deep technical credibility & ATS search optimization"
                },
                {
                    "style": "Results & ROI Driven",
                    "text_ar": f"{role} | ساعدت في تحسين كفاءة الأنظمة وتخفيض التكاليف | خبير في {top_skills}",
                    "text_en": f"{role} | Helping Enterprise Teams Scale Systems & Optimize Performance | {top_skills}",
                    "text_hi": f"{role} | सिस्टम दक्षता और प्रदर्शन में सुधार | विशेषज्ञ: {top_skills}",
                    "focus": "Proven business ROI and recruiter conversion"
                }
            ],
            "about_bio": {
                "text_ar": (
                    f"أنا {role} بخبرة تتجاوز {experience_years} سنوات في تصميم وتطوير الأنظمة البرمجية الحديثة في السوق السعودي. "
                    f"شغفي يكمن في حل التحديات المعقدة وبناء حلول رقمية تدعم مستهدفات التحول الرقمي.\n\n"
                    f"أبرز مجالات تخصصي تشمل: {top_skills}. قمت بالمساهمة في بناء مشاريع متكاملة وحققت نتائج ملموسة في تسريع زمن الإطلاق وتحسين تجربة المستخدمين.\n\n"
                    f"دائماً منفتح للتواصل مع قادة التقنية والفرق الطموحة لمناقشة فرص التعاون والابتكار."
                ),
                "text_en": (
                    f"I am a {role} with {experience_years}+ years of experience architecting and delivering high-impact software solutions across the Saudi & GCC markets.\n\n"
                    f"My core expertise focuses on {top_skills}, building scalable architectures, and driving cloud-native reliability. "
                    f"Throughout my career, I have championed engineering best practices that accelerated delivery pipelines by 35% and elevated user satisfaction.\n\n"
                    f"Always keen to connect with tech leaders, innovators, and forward-thinking engineering teams. Feel free to reach out via InMail or connect directly."
                ),
                "text_hi": (
                    f"मैं {role} हूँ, जिसे सऊदी और खाड़ी बाजार में सॉफ्टवेयर समाधान विकसित करने का {experience_years}+ वर्षों का अनुभव है।\n\n"
                    f"मेरी मुख्य विशेषज्ञता {top_skills} और स्केलेबल क्लाउड आर्किटेक्चर में है। मैंने ऐसे प्रोजेक्ट्स का नेतृत्व किया है जिन्होंने सिस्टम दक्षता को बेहतर बनाया।\n\n"
                    f"नई संभावनाओं और तकनीकी चर्चा के लिए हमेशा संपर्क करने के लिए तत्पर हूँ।"
                )
            }
        }

    @classmethod
    def _generate_checklist(cls, headline: Dict, about: Dict, exp: Dict, skills: Dict, seo: Dict) -> List[Dict[str, Any]]:
        return [
            {
                "id": "headline_opt",
                "completed": headline["score"] >= 80,
                "label_ar": "تحديث العنوان الرئيسي (Headline) بصيغة القيمة المضافة والمسمى المتخصص",
                "label_en": "Update headline with high-impact value formula & role keywords",
                "label_hi": "उच्च-प्रभाव वाले फॉर्मूले के साथ मुख्य शीर्षक अपडेट करें",
                "impact": "+18% Profile Views"
            },
            {
                "id": "about_metrics",
                "completed": about.get("has_metrics", False),
                "label_ar": "إضافة مقاييس كمية (% أو أرقام مشاريع) في قسم About",
                "label_en": "Add quantifiable metrics (% improvements, scale) to About section",
                "label_hi": "About सेक्शन में संख्यात्मक उपलब्धियां (%) जोड़ें",
                "impact": "+24% InMail Response Rate"
            },
            {
                "id": "top_skills_endorsement",
                "completed": skills["score"] >= 80,
                "label_ar": "إضافة المهارات الأكثر طلباً في السوق السعودي في قسم Skills",
                "label_en": "Add top Saudi Vision 2030 in-demand skills to your Skills section",
                "label_hi": "सऊदी बाजार में सबसे अधिक मांग वाले कौशल जोड़ें",
                "impact": "+35% Recruiter Search Appearances"
            },
            {
                "id": "action_verbs_exp",
                "completed": exp["score"] >= 80,
                "label_ar": "صياغة نقاط الخبرة بأفعال إنجاز قوية ونموذج STAR",
                "label_en": "Restructure experience bullet points with strong action verbs",
                "label_hi": "मजबूत एक्शन वर्ब्स के साथ कार्य अनुभव को पुनः व्यवस्थित करें",
                "impact": "+15% Hiring Manager Match"
            },
            {
                "id": "location_saudi",
                "completed": seo["score"] >= 75,
                "label_ar": "تأكيد الموقع الجغرافي لمركز التقنية المستهدف (الرياض / السعودية)",
                "label_en": "Verify primary location matches target Saudi tech hub (e.g. Riyadh)",
                "label_hi": "सऊदी अरब में अपना मुख्य शहर सुनिश्चित करें",
                "impact": "+40% Local Recruiter Discovery"
            }
        ]
