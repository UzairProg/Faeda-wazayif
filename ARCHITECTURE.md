# ARCHITECTURE.md: Faeda Jobs Platform

## 1. Project Overview & Core Mission
The **Faeda Jobs Platform** (منصة فائدة) is an enterprise digital recruitment platform owned by Faeda Commercial Services Company. It modernizes recruitment in Saudi Arabia and the region by combining traditional individual hiring with an innovative **Dual Recruitment Engine** that enables organizations to discover, evaluate, and recruit pre-formed, ready-to-work professional teams.

---

## 2. Technical Stack & Design System
- **Backend Framework:** Python 3.13 / Flask (Application Factory & Blueprint Pattern)
- **Database Layer:** SQLite (Development) / SQLAlchemy ORM 2.0
- **AI & Recommendation Engine:** Pandas, Scikit-learn (TF-IDF & Cosine Similarity), Feature Engineering pipelines
- **Authentication & Security:** Werkzeug PBKDF2 Password Hashing, Google OAuth 2.0, Flask Session Management, Role-Based Access Control (RBAC)
- **Frontend & UI/UX:** Bootstrap 5 (RTL Bundle), Jinja2 Templating, Almarai / Modern Arabic Typography, Custom CSS (`templates/new_design/` & `templates/panel/`)
- **Email & Communications:** Flask-Mail (SMTP/TLS) with branded HTML email templates

---

## 3. System Architecture & Components

```
                                  +-----------------------+
                                  |    HTTP / Client      |
                                  +-----------+-----------+
                                              |
                                              v
                                  +-----------------------+
                                  |    app.py (WSGI)      |
                                  +-----------+-----------+
                                              |
                                              v
                                  +-----------------------+
                                  |  Flask App Factory    |
                                  |   (app/__init__.py)   |
                                  +-----------+-----------+
                                              |
                  +---------------------------+---------------------------+
                  |                           |                           |
                  v                           v                           v
     +-------------------------+ +-------------------------+ +-------------------------+
     |   Modular Blueprints    | |   SQLAlchemy Models     | |   AI & Rec Engine       |
     |   (app/blueprints/)     | |       (/services)       | |      (/ai_engine)      |
     +-------------------------+ +-------------------------+ +-------------------------+
     | - core.py               | | - customer.py           | | - recommendation_model|
     | - customers.py          | | - company.py            | | - market_calculator   |
     | - companies.py          | | - job.py / job_filters  | | - market_updater      |
     | - jobs.py               | | - teams.py / team_offer | | - feature_engineering |
     | - messages.py           | | - admin.py / audit_log  | +-------------------------+
     | - admin.py              | | - subscription.py       |
     | - chat.py               | | - system_settings.py    |
     | - company_panel.py      | | - report.py / ticket.py |
     +-------------------------+ +-------------------------+
```

---

## 4. Comprehensive Directory Structure

```text
mysite/
│
├── app/                        # Application Factory & Routing Layer
│   ├── __init__.py             # Flask App Factory, database init & blueprint registration
│   └── blueprints/             # Modular Blueprint Routes
│       ├── admin.py            # Admin dashboard, user management, audit logs, system settings
│       ├── chat.py             # Live chat & real-time messaging endpoints
│       ├── companies.py        # Company registration, profiles, and hiring workflows
│       ├── company_panel.py    # Dedicated company management dashboard
│       ├── core.py             # Public routes (Home, Support, About, Terms, Maintenance check)
│       ├── customers.py        # Job seeker profile management, team management, applications
│       ├── jobs.py             # Job listing, filtering, search, and application processing
│       └── messages.py         # Internal messaging system & notifications
│
├── services/                   # Data Access Layer & SQLAlchemy Database Models
│   ├── admin.py                # Admin account model & Role-Based Access Control (RBAC) definitions
│   ├── audit_log.py            # System audit logging for security and admin actions
│   ├── company.py              # Company profiles, verification, and commercial registration
│   ├── customer.py             # Job seeker profiles, CV metadata, and job applications
│   ├── following.py            # Company & seeker follower relationships
│   ├── job.py                  # Job posting schema, requirements, and status
│   ├── job_category.py         # Job categories and classification taxonomies
│   ├── job_filters.py          # Cities, Specialties, and Employment Type filters
│   ├── language.py             # User language proficiencies
│   ├── message.py              # Internal messages schema
│   ├── report.py               # User & content abuse reporting models
│   ├── skills.py               # Technical and professional skills taxonomies
│   ├── subscription.py         # Subscription plans, active customer plans, and payments
│   ├── system_settings.py      # Platform dynamic settings (e.g., Maintenance Mode)
│   ├── team_offer.py           # Company offers extended directly to pre-formed teams
│   ├── teams.py                # Team profiles, member roles, and team applications
│   └── ticket.py               # Support ticket tracking models
│
├── ai_engine/                  # AI & Data Science Engine
│   ├── recommendation_model.py # Cosine similarity & TF-IDF candidate/job matching algorithm
│   ├── market_value_calculator.py # Salary estimation & market value calculation
│   ├── market_data_updater.py  # Market benchmarking data pipeline
│   ├── feature_engineering.py  # Text pre-processing and feature extraction
│   └── generate_data.py        # Synthetic & training data generator
│
├── templates/                  # Jinja2 HTML Templates
│   ├── new_design/             # Modern active public interface (RTL Bootstrap 5)
│   │   ├── base.html           # Public master template
│   │   ├── panel_base.html     # User panel master template
│   │   ├── index.html          # Homepage
│   │   ├── support.html        # Support Center
│   │   └── ...                 # Public & authentication pages
│   └── panel/                  # Admin & User Dashboard Templates
│       ├── admin/              # Super Admin management control panel
│       ├── customer/           # Job seeker dashboard & team management
│       └── company/            # Company recruitment dashboard
│
├── static/                     # Web Assets
│   ├── css/ & js/              # Stylesheets, Bootstrap 5 RTL, and scripts
│   ├── images/                 # Brand assets and graphics
│   └── uploads/                # Media upload directories (CVs, Logos, Images)
│
├── scripts/                    # Maintenance & Database Seeding Scripts
│   ├── seed_admin.py           # Initial super-admin seed script
│   ├── seed_cities.py          # Saudi cities dataset seeder
│   ├── seed_job_filters.py     # Job types and specialties seeder
│   ├── seed_categories.py      # Job categories seeder
│   ├── seed_specialties.py     # Detailed specialties seeder
│   ├── create_team_offer_table.py # Team offers schema initializer
│   ├── migrate_db.py           # Database migration utilities
│   └── verify_db.py            # Database integrity checker
│
├── instance/                   # Runtime Database & Instance Files
│   └── database.db             # SQLite database file (git-ignored)
│
├── archive/                    # Deprecated scripts and historical backups
│
├── AI_AGENT_RULES.md           # AI Agent Governance, Security & Architectural Rules
├── ARCHITECTURE.md            # System Architecture & Technical Specifications (This Document)
├── CHATBOT_GUIDE.md            # Chatbot & LLM Integration Guidelines
├── TODO.md                     # Roadmap and pending feature tracking
├── app.py                      # Main WSGI Entry Point (`python app.py`)
├── main.py                     # Legacy configuration helper (Flask-Mail & Sessions)
├── config.py                   # Development and Production configuration settings
├── googleAuth.py               # Google OAuth 2.0 integration helper
├── cities_data.json            # Reference JSON dataset for Saudi cities
├── requirements.txt            # Python dependencies manifest
└── .env.example                # Template environment variables manifest
```

---

## 5. Security, Privacy & Compliance Architecture
- **Saudi PDPL Compliance:** Strict data minimization and explicit consent handling for personal data. Sensitive documents (CVs, Commercial Registers) are stored in restricted paths.
- **Role-Based Access Control (RBAC):** `Admin` model enforces granular permissions across Super Admin, Support Moderator, Content Moderator, and Finance Admin roles.
- **Audit Logging:** Administrative operations are logged to `AuditLog` records containing timestamp, admin ID, module target, and action description.
- **Session & CSRF Security:** Cookie flags set (`HttpOnly`, `SameSite=Lax`), PBKDF2 password hashing, and token-based CSRF protection on forms and stateful endpoints.
- **Maintenance Mode:** System-wide toggle via `SystemSetting` allows admins to put non-critical routes into maintenance mode with 503 response.