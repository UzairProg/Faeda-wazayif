# Faeda AI-Driven ATS Platform

![Python](https://img.shields.io/badge/Python-3.13-blue?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-Web_Framework-lightgrey?style=for-the-badge&logo=flask&logoColor=black)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![AI-Powered](https://img.shields.io/badge/AI--Powered-Machine_Learning-brightgreen?style=for-the-badge&logo=scikitlearn&logoColor=white)
![Production Ready](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)

## 📖 Project Overview

**Faeda** is a state-of-the-art, AI-powered Applicant Tracking System (ATS) and professional networking platform designed specifically for the Saudi Arabian job market. It seamlessly bridges the gap between top-tier talent and leading enterprises by leveraging advanced machine learning algorithms, real-time market data pipelines, and a highly scalable web architecture.

The platform provides intelligent resume parsing, automated market value calculation based on industry benchmarks, and AI-driven job recommendations to ensure the perfect fit for both job seekers and employers.

---

## 🏛️ Architecture

The application follows the robust **Flask Application Factory** pattern, utilizing **Blueprints** to maintain a modular, scalable, and maintainable codebase.

- **`app/blueprints/`**: Contains the core route handlers separated by domain.
  - `core.py`: Main entry points and general pages (Home, News, Support).
  - `customers.py`: Job seeker profiles, authentication, CV upload, and job application flows.
  - `companies.py`: Employer dashboards, job postings, and applicant tracking interfaces.
  - `jobs.py`: Job listings, filtering, and detailed views.
  - `admin.py` & `company_panel.py`: Administrative and management panels.
- **`services/`**: Encapsulates the business logic and SQLAlchemy ORM models (e.g., `job.py`, `customer.py`, `company.py`).
- **`ai_engine/`**: The intelligence hub of the platform, containing standalone modules for parsing, calculation, and recommendation.

---

## 🧠 Smart Features & AI Engine

Faeda distinguishes itself through its embedded AI Engine (`ai_engine/`), which powers several critical workflows:

### 1. ATS Resume Parsing (`ats_parser.py`)
Utilizes `pdfplumber` and Regex pattern matching to extract text from candidate CVs. It intelligently supports both Arabic and English formats and uses the Google Translator API (`deep-translator`) to standardize university names for global ranking comparisons.

### 2. Market Value Calculator (`market_value_calculator.py`)
Calculates a comprehensive "Market Value Score" for candidates. It evaluates:
- Educational Qualifications
- Years of Experience and Technical Skills
- GPA and Certifications
- **QS World University Rankings**: Uses Fuzzy String Matching (`thefuzz`) to map candidate universities against the 2025 QS Rankings, awarding bonus points for top-tier global institutions.

### 3. Automated Data Pipeline (`market_data_updater.py`)
A robust ETL pipeline that fetches live salary benchmark data from the Saudi Open Data Portal (CKAN API). It features:
- Exponential backoff and retry mechanisms for network resilience.
- Data transformation using `pandas` to bucket experience tiers and map government sector titles to platform specializations.
- SQLite `UPSERT` capabilities to seamlessly refresh market rates without duplicating data.

---

## 🚀 Getting Started (Local Setup)

Follow these steps to run the Faeda platform in your local development environment:

### Prerequisites
- Python 3.13+
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/faeda-jobs.git
   cd faeda-jobs
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize the Database:**
   Ensure the `instance/database.db` exists. If not, the application will create it upon initialization.
   ```bash
   flask db upgrade
   ```

5. **Run the application:**
   ```bash
   python app.py
   # The app will be available at http://127.0.0.1:5000/
   ```

---

## 🗄️ Database

The platform utilizes **SQLite** for its primary database (`instance/database.db`), managed via **SQLAlchemy**. 

- **Fallback Data:** The AI engine incorporates rich fallback seed data for salary benchmarks. If the external CKAN API is unreachable, the system automatically injects realistic Saudi market salary ranges across all major specializations (IT, Finance, Healthcare, etc.) into the `salary_benchmark` table.
- **ORM Models:** Database schemas are strictly defined in the `services/` directory, ensuring data integrity and enforcing relationships between Companies, Customers, Jobs, and Teams.
