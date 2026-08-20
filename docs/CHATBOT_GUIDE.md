# Faeda Jobs — AI Chatbot: Developer Guide

> **For developers joining this project.**
> This document explains exactly how the AI chatbot works, where every relevant file lives, how to run it locally, and how to modify or extend it.

---

## 1. How It Works (Quick Overview)

```
User types a message in the browser
        ↓
chat_widget.html  →  POST /api/chat  (fetch request, JSON)
        ↓
app/blueprints/chat.py  →  Groq REST API  (llama-3.3-70b-versatile)
        ↓
Groq returns AI reply  →  { "reply": "..." }  →  displayed in the widget
```

The browser **never talks directly to Groq**. All requests go through our Flask backend, which holds the API key securely on the server.

---

## 2. File Map

| File | Role |
|---|---|
| `app.py` | Entry point. Loads `.env` then calls `create_app()` |
| `app/__init__.py` | App factory. Registers all blueprints including `chat_bp` |
| `app/blueprints/chat.py` | **The chatbot logic lives here** |
| `templates/new_design/chat_widget.html` | Frontend widget (HTML + CSS + JS, included via Jinja `{% include %}`) |
| `.env` | Secret file — holds `GROQ_API_KEY`. Never committed to git |
| `.gitignore` | Excludes `.env` and `.venv` from version control |
| `requirements.txt` | Python dependencies |

---

## 3. Backend — `app/blueprints/chat.py`

This is the only file you need to touch for most AI-related changes.

### Key constants at the top of the file

```python
# The personality / role of the AI — edit this to change how it behaves
SYSTEM_INSTRUCTION = "You are a helpful assistant for Faeda Jobs ..."

# Groq API endpoint (OpenAI-compatible)
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# Active model — swap this string to change the model
GROQ_MODEL = "llama-3.3-70b-versatile"
```

### The route

```
POST /api/chat
Request body:  { "message": "user text here" }
Response body: { "reply": "AI response text" }
Error body:    { "error": "description" }
```

### What the route does (step by step)

1. Reads `GROQ_API_KEY` from environment variables (set via `.env`)
2. Validates that `message` is present and not empty
3. Builds an OpenAI-compatible payload with `system` + `user` messages
4. Sends a `POST` request to Groq with `Authorization: Bearer <key>`
5. Extracts the reply from `result['choices'][0]['message']['content']`
6. Returns `{ "reply": "..." }` as JSON

---

## 4. Frontend — `chat_widget.html`

This file is a self-contained HTML partial (CSS + HTML + JS in one file).
It is included in the base template via Jinja:

```html
{% include 'new_design/chat_widget.html' %}
```

### How the JS sends a message

```javascript
const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: message })
});
const data = await response.json();
// data.reply holds the AI text
```

### Widget features

- **Toggle open/close** — `toggleChatWidget()` called by the floating button
- **Loading indicator** — three animated dots while waiting for Groq
- **Resizable window** — drag the top-left corner handle (mouse + touch)
- **RTL layout** — user bubbles align right, bot bubbles align left
- **Error handling** — shows an Arabic error message if the request fails

---

## 5. Environment Setup (First Time)

### Step 1 — Install dependencies

```bash
pip install flask flask-sqlalchemy flask-cors python-dotenv requests
```

### Step 2 — Create your `.env` file

The file already exists in the project root with a placeholder:

```
# .env
GROQ_API_KEY=your_groq_api_key_here
```

Replace the placeholder with your real key from [console.groq.com](https://console.groq.com).

> ⚠️ **`.env` is in `.gitignore` and must never be committed to git.**
> If a teammate needs to run the project locally, they create their own `.env` file.

### Step 3 — Run the server

```bash
python app.py
```

`load_dotenv()` in `app.py` automatically reads `.env` before Flask starts, so the key is available at `os.environ.get('GROQ_API_KEY')`.

---

## 6. Changing the AI Model

Open `app/blueprints/chat.py` and change the `GROQ_MODEL` constant.

**Available Groq models (as of 2025):**

| Model | Speed | Best for |
|---|---|---|
| `llama-3.3-70b-versatile` | Fast | General use ✅ current |
| `llama-3.1-8b-instant` | Very fast | Low-latency responses |
| `mixtral-8x7b-32768` | Fast | Long conversations |
| `gemma2-9b-it` | Fast | Lightweight tasks |

No other file needs to change when you swap the model.

---

## 7. Changing the System Instruction (AI Personality)

Edit the `SYSTEM_INSTRUCTION` string in `app/blueprints/chat.py`:

```python
SYSTEM_INSTRUCTION = (
    "You are a helpful and professional AI assistant for Faeda Jobs, ..."
)
```

This string is sent as the `system` role in every request, so it applies to all conversations. Restart the Flask server after editing.

---

## 8. Switching to a Different AI Provider

Because the frontend only calls `/api/chat`, you only need to edit `chat.py`.

### Example: Switch to OpenAI

```python
# 1. Change the URL
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

# 2. Change the model
MODEL = "gpt-4o"

# 3. Change the env var name (and update .env)
api_key = os.environ.get('OPENAI_API_KEY')

# The payload shape is identical (OpenAI-compatible) — no other changes needed
```

The `chat_widget.html` frontend requires **zero changes**.

---

## 9. Common Errors & Fixes

| Error | Cause | Fix |
|---|---|---|
| `500 GROQ_API_KEY environment variable is not set` | `.env` missing or key is placeholder | Add real key to `.env` and restart server |
| `ModuleNotFoundError: No module named 'dotenv'` | `python-dotenv` not installed | `pip install python-dotenv` |
| `ModuleNotFoundError: No module named 'requests'` | `requests` not installed | `pip install requests` |
| `502 Groq API request failed` | Bad API key or Groq is down | Verify key at console.groq.com |
| `504 Request timed out` | Groq slow / no internet | Check connection; retry |
| Widget shows Arabic error message | `fetch` to `/api/chat` failed | Open browser DevTools → Network tab to see the actual HTTP error |

---

## 10. Project Notes

- **No conversation history is stored.** Each message is a fresh, single-turn request. To add multi-turn memory, pass previous messages in the `messages[]` array in `chat.py`.
- **Rate limits (Groq free tier):** 30 requests/minute, 14,400 requests/day for Llama 3.3 70B. Check [console.groq.com/settings/limits](https://console.groq.com/settings/limits) for current limits.
- **The widget is RTL-aware.** User bubbles use `align-self: flex-start` (which is right in RTL) and bot bubbles use `align-self: flex-end` (left in RTL).
