# ==============================================================================
# الوظيفة الأساسية للملف: Blueprint لمسار /api/chat الذي يربط رسائل المستخدم بـ Groq AI.
# الروابط أو الميزات: يُستخدم من قِبل الـ chat widget في الواجهة الأمامية.
# المتطلبات الخاصة: يتطلب تعيين متغير البيئة GROQ_API_KEY في ملف .env قبل تشغيل الخادم.
# ==============================================================================
import os
import requests
from flask import Blueprint, request, jsonify

chat_bp = Blueprint('chat', __name__)

# ---------------------------------------------------------------------------
# Company context injected as a system instruction so the model always knows
# it is acting as a Faeda Jobs assistant.
# ---------------------------------------------------------------------------
SYSTEM_INSTRUCTION = (
    "You are a helpful and professional AI assistant for Faeda Jobs, "
    "a leading online recruitment platform in Saudi Arabia that connects "
    "job seekers with top employers. "
    "Your role is to assist users with questions about job searching, "
    "CV tips, interview preparation, company listings, and how to use the "
    "Faeda Jobs platform. "
    "Always respond in a friendly, concise, and professional manner. "
    "If a question is unrelated to jobs or the platform, politely redirect "
    "the conversation back to Faeda Jobs topics."
)

# Groq uses the OpenAI-compatible chat completions endpoint.
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# Model to use — change to any Groq-supported model (e.g. llama-3.3-70b-versatile,
# mixtral-8x7b-32768, gemma2-9b-it, etc.)
GROQ_MODEL = "llama-3.3-70b-versatile"


@chat_bp.route('/api/chat', methods=['POST'])
def chat():
    """
    POST /api/chat
    Expects JSON body: { "message": "<user text>" }
    Returns JSON:      { "reply": "<AI response text>" }
    """
    from services.system_settings import SystemSetting

    if SystemSetting.get_value('ai_assistant_active', 'true') != 'true':
        return jsonify({'error': 'المساعد الذكي معطل حالياً من قبل الإدارة.'}), 403

    api_key = os.environ.get('GROQ_API_KEY')
    if not api_key:
        return jsonify({'error': 'GROQ_API_KEY environment variable is not set.'}), 500

    data = request.get_json(silent=True)
    if not data or not data.get('message'):
        return jsonify({'error': 'Missing "message" field in request body.'}), 400

    user_message = str(data['message']).strip()
    if not user_message:
        return jsonify({'error': '"message" must not be empty.'}), 400

    # Build the OpenAI-compatible payload for Groq.
    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_INSTRUCTION},
            {"role": "user",   "content": user_message}
        ],
        "temperature": 0.7,
        "max_tokens": 1024
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(
            GROQ_API_URL,
            headers=headers,
            json=payload,
            timeout=30
        )
        response.raise_for_status()
    except requests.exceptions.Timeout:
        return jsonify({'error': 'Request to Groq API timed out.'}), 504
    except requests.exceptions.RequestException as exc:
        return jsonify({'error': f'Groq API request failed: {str(exc)}'}), 502

    result = response.json()

    try:
        reply_text = result['choices'][0]['message']['content']
    except (KeyError, IndexError, TypeError):
        return jsonify({'error': 'Unexpected response structure from Groq API.', 'raw': result}), 502

    return jsonify({'reply': reply_text})
