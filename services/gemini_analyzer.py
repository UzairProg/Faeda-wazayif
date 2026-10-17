# ==============================================================================
# services/gemini_analyzer.py
# ==============================================================================
# Google Gemini 1.5 Flash AI Integration for Faeda Profile Audits
# Connects to Google Generative Language API with fallback resiliency.
# ==============================================================================

import os
import json
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "").strip()
GEMINI_MODELS = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"]


class GeminiAnalyzerService:
    """Invokes Google Gemini Generative AI for Faeda Profile analysis."""

    @classmethod
    def get_api_key(cls) -> str:
        return os.environ.get("GEMINI_API_KEY", GEMINI_API_KEY)

    @classmethod
    def analyze_with_gemini(
        cls,
        role: str,
        headline: str,
        about: str,
        skills: list,
        experience_years: int = 3,
        location: str = "Riyadh, Saudi Arabia"
    ) -> Optional[Dict[str, Any]]:
        """Call Gemini to generate tailored rewrites and personalized critique."""
        api_key = cls.get_api_key()
        if not api_key:
            return None

        prompt = f"""
You are an expert executive tech recruiter in Saudi Arabia and the GCC region specializing in Saudi Vision 2030 talent benchmarks.
Analyze the following candidate's Faeda profile:
- Target Role: {role}
- Current Headline: {headline}
- Current About Summary: {about}
- Verified Skills: {', '.join(skills)}
- Years of Experience: {experience_years}
- Target Location: {location}

Respond ONLY with valid, raw JSON (no markdown formatting, no code fences):
{{
  "overall_score": <number between 50 and 96>,
  "headline_score": <number between 40 and 96>,
  "headline_critique_ar": "<concise actionable advice in Arabic>",
  "headline_critique_en": "<concise actionable advice in English>",
  "about_score": <number between 40 and 96>,
  "about_critique_ar": "<concise actionable advice in Arabic>",
  "about_critique_en": "<concise actionable advice in English>",
  "rewritten_headlines": [
    {{
      "style": "Executive & Impact",
      "text_ar": "<headline in Arabic>",
      "text_en": "<headline in English>",
      "focus": "Executive leadership & business outcomes"
    }},
    {{
      "style": "Specialist & Tech Stack",
      "text_ar": "<headline in Arabic>",
      "text_en": "<headline in English>",
      "focus": "Deep technical credibility & ATS search optimization"
    }},
    {{
      "style": "Results & ROI Driven",
      "text_ar": "<headline in Arabic>",
      "text_en": "<headline in English>",
      "focus": "Proven business ROI and recruiter conversion"
    }}
  ],
  "rewritten_about_bio": {{
    "text_ar": "<3-paragraph compelling bio in Arabic with quantified achievements>",
    "text_en": "<3-paragraph compelling bio in English with quantified achievements>"
  }},
  "missing_skills_recommendations": [
    "<High-demand Saudi tech skill 1>",
    "<High-demand Saudi tech skill 2>",
    "<High-demand Saudi tech skill 3>"
  ]
}}
"""

        try:
            import urllib.request
            import urllib.error

            payload = json.dumps({
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.4,
                    "maxOutputTokens": 2048,
                    "responseMimeType": "application/json"
                }
            }).encode("utf-8")

            # Try models in order of speed and capability
            for model_name in GEMINI_MODELS:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
                req = urllib.request.Request(
                    url,
                    data=payload,
                    headers={"Content-Type": "application/json"}
                )

                try:
                    with urllib.request.urlopen(req, timeout=8) as response:
                        res_data = json.loads(response.read().decode("utf-8"))
                        candidates = res_data.get("candidates", [])
                        if candidates:
                            raw_text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                            # Clean possible code fence
                            cleaned = raw_text.strip()
                            if cleaned.startswith("```json"):
                                cleaned = cleaned[7:]
                            if cleaned.startswith("```"):
                                cleaned = cleaned[3:]
                            if cleaned.endswith("```"):
                                cleaned = cleaned[:-3]
                            parsed = json.loads(cleaned.strip())
                            parsed["model_used"] = model_name
                            parsed["is_gemini_live"] = True
                            return parsed
                except urllib.error.HTTPError as he:
                    logger.warning(f"Gemini HTTPError on {model_name}: {he.code}")
                    continue
                except Exception as inner_e:
                    logger.warning(f"Gemini error on {model_name}: {inner_e}")
                    continue

        except Exception as e:
            logger.warning(f"Gemini service exception: {e}")

        return None
