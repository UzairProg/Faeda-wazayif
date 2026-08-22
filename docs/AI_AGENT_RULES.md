# 🤖 Faeda Platform AI Agent Governance & Rules

## 1. Core Identity & Architecture
- **Tech Stack:** Python (Flask), SQLite, SQLAlchemy, Bootstrap 5 (RTL), Jinja2.
- **Design Philosophy:** Clean, modern, enterprise-grade UI/UX adhering to the "Faeda" brand identity (`--primary-dark: #232E4C`, `--accent-red: #BF2A4A`, `--accent-yellow: #F0BF56`).
- **Structure Pattern:** Blueprint architecture. Keep frontend HTML files inside `templates/panel/` or `templates/new_design/` and backend logic separated into designated modules (`customers.py`, `jobs.py`, or `ai_engine/`).

---

## 2. Backend & Database Rules (Flask / SQLAlchemy)
- **Database Paths:** Always use relative paths with `os.path` to target `instance/database.db` safely from any nested folder (e.g., inside `ai_engine/`).
- **Data Integrity:** Never hardcode user states or queries. Ensure strict filtering:
  - `/controlled_teams`: Return teams where `Teams.admin_id == user_id` only.
  - `/my_team`: Return teams where the user is an admin OR an active member via association tables.
- **Error Handling:** Always wrap database and Pandas/Sklearn operations in `try-except-finally` blocks with proper connection closures (`conn.close()`).

---

## 3. Frontend & UI/UX Standards (Bootstrap 5 & RTL)
- **Base Templates:** All new panel or dashboard templates MUST inherit from `{% extends 'new_design/panel_base.html' %}`. Public pages use `base.html`.
- **Layout Banned Practices:** DO NOT use CSS Flexbox/Grid directly on the body, and avoid outdated Sneat layout wrappers where modern Bootstrap cards apply.
- **Data Presentation:** Convert raw HTML tables into modern, responsive Bootstrap tables (`table-hover shadow-sm`) with clean alignments.
- **Preservation of Variables:** Never modify or delete existing Jinja2 variables (`{{ team.team_name }}`, `{{ customer.fullname }}`, etc.) or backend loops (`{% for %}`) unless explicitly instructed.

---

## 4. AI & Data Science Integration (`ai_engine/`)
- **Data Pipelines:** Use `pandas` for dataframe extraction and clean text fields using regular expressions (`re`) to strip unwanted symbols, HTML artifacts, or `None` values.
- **Vectorization & Models:** When running TF-IDF or Cosine Similarity, ensure `stop_words='english'` is applied where appropriate, and handle missing matrix shapes gracefully.
- **Terminal Outputs:** Keep all Terminal log outputs and error messages in **English** to prevent character-flipping/RTL rendering bugs in Windows PowerShell/CMD.

---

## 5. Security Guidelines

### 5.1 Authentication & Session Management
- **Session Checks:** Always verify session tokens (`if 'user_id' not in session: return redirect(...)`) on **every** sensitive route, including AI recommendation endpoints and AJAX/API calls.
- **Role-Based Access Control (RBAC):** Enforce role checks (customer vs. company vs. admin) immediately after session validation. Never rely on frontend-only hiding of buttons/links for access control.
- **Session Configuration:**
  - Set `SESSION_COOKIE_HTTPONLY = True` to prevent JavaScript access to session cookies.
  - Set `SESSION_COOKIE_SAMESITE = 'Lax'` (or `'Strict'`) to mitigate CSRF via cookies.
  - Set `SESSION_COOKIE_SECURE = True` in production (HTTPS only).
  - Use `session.permanent = True` with a reasonable `PERMANENT_SESSION_LIFETIME` (e.g., 30 minutes for admin sessions, 7 days for customers).
- **Google OAuth Security:** Never hardcode `GOOGLE_CLIENT_ID` in source code; load from environment variables via `.env`. Remove `OAUTHLIB_INSECURE_TRANSPORT = "1"` in production. Always validate the `state` parameter in the OAuth callback to prevent CSRF attacks.
- **Password Hashing:** Always hash passwords using `werkzeug.security.generate_password_hash()` with `method='pbkdf2:sha256'`. Never store plain-text passwords.
- **Logout:** Destroy the entire session on logout (`session.clear()`), not just individual keys.

### 5.2 Input Validation & Injection Prevention
- **SQL Injection:** Always use SQLAlchemy ORM queries or parameterized queries. **Never** concatenate user input into raw SQL strings.
- **XSS (Cross-Site Scripting):** Jinja2 auto-escapes by default—never disable it with `| safe` on user-supplied content. Sanitize any user-generated HTML (e.g., job descriptions) with a whitelist library like `bleach` before storage.
- **CSRF Protection:** Enable Flask-WTF CSRF protection globally. Every `POST`/`PUT`/`DELETE` form must include `{{ csrf_token() }}`. AJAX calls must send the CSRF token in headers.
- **Input Length & Type:** Validate all incoming data (forms, query params, JSON bodies) for expected type, length, and format on the **server side**. Client-side validation is UX only, not security.

### 5.3 Authorization & Object-Level Access
- **Object Ownership Checks:** Before any edit/delete operation, verify the requesting user owns the resource (e.g., `job.company_id == session['company_id']`). Never trust client-supplied IDs alone.
- **Public vs Private Views:** Public or visiting profiles (`/visit_customer_profile/<id>`) must be strictly **Read-Only** (no edit/delete buttons rendered, AND the backend must reject modification attempts on those routes).
- **Admin Panel:** All admin routes must check `admin_id` in session AND verify the admin exists in the `Admin` table. Log every admin action via `AuditLog.log_action()`.

### 5.4 Rate Limiting & Abuse Prevention
- **API Endpoints:** Apply rate limiting (e.g., via `flask-limiter`) to login, registration, password-reset, and AI recommendation endpoints to prevent brute-force and abuse.
- **Report/Message Flooding:** Limit how many reports or messages a user can send per hour to prevent spam abuse.

### 5.5 Secrets Management
- **Environment Variables:** Store all secrets (`SECRET_KEY`, `GROQ_API_KEY`, `MAIL_PASSWORD`, `GOOGLE_CLIENT_ID`, OAuth client secrets) in `.env`. **Never** commit `.env` to version control.
- **Default Key Override:** The fallback `'default-secret-key-for-dev'` in `config.py` must **never** be used in production. Add a startup check that aborts if `SECRET_KEY` is the default value and `DEBUG=False`.
- **Key Rotation:** Document a procedure for rotating `SECRET_KEY` (which invalidates all sessions) and API keys.

### 5.6 HTTPS & Transport Security
- **Production HTTPS:** Enforce HTTPS in production. Set `SESSION_COOKIE_SECURE = True` and add `Strict-Transport-Security` headers.
- **Redirect HTTP → HTTPS:** Use `flask-talisman` or a reverse proxy (nginx) to force HTTPS and set secure headers (`X-Content-Type-Options`, `X-Frame-Options`, `Content-Security-Policy`).

### 5.7 CORS (Cross-Origin Resource Sharing)
- **Restrictive CORS:** If enabling CORS for API endpoints, whitelist only known origins. Never use `Access-Control-Allow-Origin: *` on authenticated endpoints.

---

## 6. Privacy & Data Protection

### 6.1 Compliance Framework
- **Saudi PDPL (Personal Data Protection Law):** Ensure all personal data processing complies with PDPL. Obtain explicit consent before collecting personal data beyond what's needed for the core service.
- **Data Minimization:** Collect only the personal data strictly necessary for the feature. For example, do not require a phone number if email suffices for the flow.

### 6.2 User Data Handling
- **CV & Document Storage:** User-uploaded CVs (`UPLOAD_CUSTOMERS_CV`) and Intellectual Property evidence files (`ip_evidence`) contain highly sensitive PII and confidential information. Store them outside the publicly-accessible `static/` folder in production, or serve them through an authenticated route that checks ownership.
- **Profile Visibility:** Give users control over what profile fields are visible to companies vs. the public. Default to minimal exposure.
- **Data Retention:** Define and enforce retention periods. Delete or anonymize inactive accounts and their data after a documented period (e.g., 2 years of inactivity).
- **Right to Deletion:** Provide a mechanism for users to request full account and data deletion. Cascade properly across all related tables (`Teams`, `Messages`, `Applications`, `Reports`, etc.).

### 6.3 AI & Recommendation Engine Privacy
- **Data Anonymization:** When passing user data to TF-IDF / Cosine Similarity models or external APIs (e.g., Groq), strip or anonymize PII (names, emails, phone numbers) unless it's strictly needed for the feature.
- **No External Leakage:** Never send raw user CVs, messages, or personal profiles to third-party AI APIs. Send only the minimal, anonymized feature vectors or text snippets required.
- **Model Storage:** Do not store trained model artifacts that embed raw user data. If caching recommendation results, ensure they expire and do not persist indefinitely.

### 6.4 Email & Communication Privacy
- **Password Resets / Emails:** Use secure inline-CSS and table-based layouts for email templates (`email.html`). Never include JavaScript inside email templates.
- **Email Content:** Never include full passwords, sensitive personal data, or session tokens in emails. Password-reset links must be one-time-use, time-limited (e.g., 1 hour), and tied to a cryptographically random token.
- **Unsubscribe:** All marketing or notification emails should include an unsubscribe link.

---

## 7. File Upload & Media Security

- **Allowed Extensions:** Strictly whitelist allowed file extensions per upload type:
  - Profile images: `.jpg`, `.jpeg`, `.png`, `.webp` only.
  - CVs: `.pdf`, `.docx` only.
  - Company logos / commercial registers: `.jpg`, `.jpeg`, `.png`, `.pdf` only.
- **File Size Limits:** Enforce `MAX_CONTENT_LENGTH` in Flask config (e.g., 5 MB for images, 10 MB for CVs).
- **Filename Sanitization:** Use `werkzeug.utils.secure_filename()` on all uploaded filenames. Additionally, rename files with a UUID to prevent path-traversal attacks and filename collisions.
- **MIME Type Validation:** Verify the file's actual MIME type (using `python-magic` or file header inspection), not just the extension.
- **Serve via Authenticated Routes:** In production, do not serve user-uploaded files directly from `static/`. Use a Flask route that checks authentication and ownership before streaming the file.
- **Image Processing:** If resizing or thumbnailing images, use `Pillow` and re-encode the image to strip any embedded malicious payloads (e.g., polyglot JPEG/JS files).

---

## 8. API & Third-Party Integration Rules

### 8.1 Groq API / LLM Integration
- **API Key Security:** Load `GROQ_API_KEY` from `.env` only. Never log or expose it in error messages or frontend responses.
- **Prompt Injection Defense:** Sanitize and validate all user-supplied text before including it in LLM prompts. Use system-level prompt instructions to constrain the model's behavior.
- **Response Validation:** Never trust raw LLM output. Validate, sanitize, and escape AI-generated content before rendering it in HTML or storing it in the database.
- **Timeouts & Fallbacks:** Set reasonable timeouts (e.g., 30s) on all external API calls. Provide graceful fallbacks (cached results, error messages) when the API is unreachable.
- **Cost Control:** Log API usage (tokens, calls) and set up alerts or hard limits to prevent runaway costs.

### 8.2 Google OAuth
- **Scopes:** Request only the minimum OAuth scopes needed (`userinfo.profile`, `userinfo.email`, `openid`). Never request broader scopes.
- **Token Storage:** Do not store OAuth access/refresh tokens in the session or database unless absolutely necessary. If stored, encrypt them at rest.
- **Redirect URI Validation:** Hardcode allowed redirect URIs. Never accept a user-supplied redirect URI.

### 8.3 Flask-Mail / SMTP
- **Credentials:** Load `MAIL_USERNAME` / `MAIL_PASSWORD` / `SENDER_EMAIL` / `SENDER_PASSWORD` from `.env`. Never hardcode.
- **TLS:** Always use `MAIL_USE_TLS = True`. Never fall back to plain SMTP in production.
- **Error Handling:** Wrap all email-sending logic in `try-except`. Log failures but never expose SMTP errors to end users.

---

## 9. Error Handling & Logging Best Practices

### 9.1 Exception Handling
- **Granular Catches:** Catch specific exceptions (`sqlalchemy.exc.IntegrityError`, `FileNotFoundError`, `json.JSONDecodeError`) rather than bare `except:` or `except Exception:`.
- **Resource Cleanup:** Always use `try-except-finally` with proper connection closures (`conn.close()`) for raw DB connections and Pandas operations. Prefer context managers (`with`) where possible.
- **Custom Error Pages:** Register Flask error handlers for `404`, `403`, `500` that render user-friendly, branded error pages instead of default stack traces.
- **No Stack Traces in Production:** Set `DEBUG = False` in production. Never expose stack traces, SQL queries, or internal paths to end users.

### 9.2 Logging
- **Structured Logging:** Use Python's `logging` module with consistent format: `[timestamp] [level] [module] message`. Do not use bare `print()` statements in production code.
- **Sensitive Data:** Never log passwords, API keys, session tokens, full credit card numbers, or personal identifiers. Mask or redact sensitive fields.
- **Audit Trail:** Use the existing `AuditLog` model for all admin actions. Extend it to log failed login attempts with IP addresses for security monitoring.
- **Log Levels:** Use `DEBUG` for development details, `INFO` for routine operations, `WARNING` for recoverable issues, `ERROR` for failures, `CRITICAL` for system-breaking events.

---

## 10. Testing & Code Quality

### 10.1 Testing Standards
- **Unit Tests:** Write unit tests for all service-layer functions (especially `services/*.py` model methods and `ai_engine/` pipeline stages).
- **Route Tests:** Test all Flask routes for correct HTTP status codes, authentication enforcement, and role-based access.
- **Edge Cases:** Test with empty datasets, missing fields, Arabic/Unicode text, extremely long inputs, and concurrent requests.
- **Test Database:** Use a separate SQLite test database (`:memory:` or `test_database.db`). Never run tests against the production database.

### 10.2 Code Style & Documentation
- **Docstrings:** Every Python function and class must have a docstring explaining its purpose, parameters, and return value.
- **File Headers:** Maintain the existing Arabic comment block at the top of each file describing purpose, features, and dependencies.
- **Naming Conventions:** Use `snake_case` for Python variables/functions, `PascalCase` for classes, `UPPER_SNAKE_CASE` for constants. Keep variable names in English.
- **Type Hints:** Use Python type hints on function signatures for clarity and IDE support.
- **DRY Principle:** Extract repeated logic into helper functions or shared utilities. Do not duplicate query patterns across blueprints.

---

## 11. Deployment & Environment Configuration

### 11.1 Environment Separation
- **Config Classes:** Use `DevelopmentConfig` for local work (`DEBUG=True`) and `ProductionConfig` for deployment (`DEBUG=False`). Never deploy with `DevelopmentConfig`.
- **`.env` Files:** Maintain `.env.example` as a template (committed to git). The real `.env` must be in `.gitignore` and never committed.
- **Database Migrations:** When modifying models, use `Flask-Migrate` (Alembic) to generate and apply migrations. Never modify the production database schema by hand.

### 11.2 Production Hardening
- **WSGI Server:** Run Flask behind a production WSGI server (`gunicorn`, `waitress`) and a reverse proxy (`nginx`). Never use the built-in `app.run()` development server in production.
- **Static Files:** Serve `static/` assets through nginx or a CDN, not through Flask, for performance and security.
- **Backup Strategy:** Schedule automated daily backups of `instance/database.db`. Store backups in a secure, off-site location. Test restores periodically.
- **Health Check Endpoint:** Implement a `/health` route that returns `200 OK` when the app and database are operational, for use by load balancers and monitoring.

---

## 12. Performance Best Practices

- **Database Queries:** Avoid N+1 queries. Use `joinedload()` or `subqueryload()` for related models when listing entities. Always paginate list endpoints.
- **Indexing:** Add database indexes on frequently queried columns (`customer.email`, `job.status`, `job.company_id`, `teams.admin_id`).
- **Caching:** Cache expensive or rarely-changing queries (e.g., active subscription plans, job categories) using `flask-caching` or a simple in-memory dict with TTL.
- **AI Pipeline:** Pre-compute TF-IDF matrices on a schedule (not per-request) and cache them. Invalidate and rebuild when the underlying job data changes significantly.
- **Lazy Loading:** Load heavy resources (Pandas, Sklearn) only in the modules that need them, not at application startup.
- **Asset Optimization:** Minify CSS/JS for production. Use compressed images (WebP) where supported.

---

## 13. Accessibility & Internationalization (a11y + i18n)

- **RTL First:** All layouts, text alignment, and directional CSS must be RTL-aware. Use Bootstrap 5 RTL bundle (`bootstrap.rtl.min.css`). Test every page in an Arabic-locale browser.
- **Semantic HTML:** Use `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>` appropriately. Avoid `<div>` soup.
- **ARIA Labels:** Add `aria-label` or `aria-labelledby` to all interactive elements (buttons, modals, dropdowns, forms) for screen reader support.
- **Color Contrast:** Ensure text-to-background contrast ratios meet WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text), especially with the Faeda dark palette.
- **Keyboard Navigation:** All interactive elements must be reachable and operable via keyboard (Tab, Enter, Escape).
- **Bilingual Support:** UI labels and error messages should support both Arabic and English. Use a translation dictionary or i18n framework rather than hardcoded strings in templates.
- **Terminal Outputs:** Keep all terminal log outputs and error messages in **English** to prevent character-flipping/RTL rendering bugs in Windows PowerShell/CMD (retained from Section 4).

---

## 14. Version Control & Collaboration

- **Branch Strategy:** Use `main` for stable/production code. Develop features on `feature/<name>` branches. Merge via pull requests with at least one review.
- **Commit Messages:** Use clear, descriptive commit messages in English. Format: `<type>(<scope>): <description>` (e.g., `fix(auth): validate OAuth state parameter`).
- **`.gitignore` Enforcement:** Ensure the following are **never** committed: `.env`, `instance/database.db`, `__pycache__/`, `.venv/`, `keys.txt`, `client_secret.json`, `*.pyc`, `node_modules/`.
- **Sensitive Files Audit:** Periodically check git history for accidentally committed secrets. Use `git-secrets` or similar tools to prevent future leaks.
- **Code Reviews:** All changes to `services/`, `blueprints/`, `ai_engine/`, and `config.py` require code review before merging.

---

## 15. Incident Response & Monitoring

- **Error Monitoring:** Integrate an error tracking service (e.g., Sentry) to capture and alert on production exceptions in real time.
- **Security Incidents:** If a data breach or unauthorized access is suspected:
  1. Immediately rotate all affected secrets (`SECRET_KEY`, API keys, OAuth credentials).
  2. Invalidate all active sessions.
  3. Review `AuditLog` entries for suspicious admin activity.
  4. Notify affected users as required by Saudi PDPL.
- **Uptime Monitoring:** Monitor the `/health` endpoint and set up alerts for downtime exceeding 5 minutes.
- **Dependency Updates:** Regularly update Python dependencies (`pip list --outdated`). Monitor for known CVEs in Flask, SQLAlchemy, Jinja2, and other libraries using `pip-audit` or `safety`.

---

## 16. AI Agent Guidelines

- **Temporary Scripts:** Whenever the AI agent creates any temporary script or file for execution (e.g., database migration script, debugging script), it MUST explicitly delete that file immediately after execution is complete to keep the workspace clean, without needing explicit reminders from the user.