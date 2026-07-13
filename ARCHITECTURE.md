# ARCHITECTURE.md: Faeda Jobs Platform

## Project Overview
The Faeda Jobs Platform is an integrated digital recruitment system owned by Faeda Commercial Services Company. It modernizes traditional hiring by combining individual recruitment with the innovative ability to hire complete, ready-to-work professional teams.

## Core Objectives
* Reduce hiring time and costs while improving the quality of candidate selection.
* Provide an internal, professional communication environment between companies, candidates, and teams without needing external apps.
* Build a comprehensive database of professional teams and support educational institutions in tracking graduates and employment rates.

## System Actors & Permissions
* **Companies:** Can post and edit jobs, review applications, recruit individuals or full teams, schedule interviews, and manage subscription packages.
* **Job Seekers:** Can build profiles, upload resumes, apply for jobs, and either create, join, or manage professional teams.
* **System Administrators:** Manage all users, companies, teams, and jobs. They also oversee subscriptions, payments, reports, and handle complaints or system notifications.
* **Educational Institutions:** Monitor student and trainee progress and measure overall employment success rates.

## Key Technical Features
* **Dual Recruitment Engine:** Supports hiring a single individual, an entire pre-formed team, or selecting specific members from various teams.
* **Internal Messaging:** Direct chat capabilities supporting text and file transfers between companies and candidates, or among team members internally.
* **Notification System:** Real-time alerts covering system updates, job statuses, message alerts, and team invitations.

## Actual Directory Structure

```text
/mysite
│
├── /app
│   ├── /blueprints         # Modularized route files (Flask Blueprints)
│   │   ├── companies.py    # Company dashboard and hiring routes
│   │   ├── core.py         # General platform routes (home, support)
│   │   ├── customers.py    # Job seeker and profile routes
│   │   ├── jobs.py         # Job posting, editing, and listing routes
│   │   └── messages.py     # Platform messaging and email routes
│   └── __init__.py         # App factory, database init, and extensions 
│
├── /services               # Database schema models (SQLAlchemy)
│   ├── admin.py            # Admin models
│   ├── company.py          # Company models
│   ├── customer.py         # Customer/Seeker models
│   ├── following.py        # Followers relations
│   ├── job.py              # Jobs models
│   ├── language.py         # Language models
│   ├── message.py          # Messaging models
│   ├── skills.py           # Skills models
│   └── teams.py            # Teams models
│
├── /templates              # HTML templates (Jinja2)
│   ├── /new_design         # Main active site templates (Base, Index, Jobs, etc.)
│   └── /panel              # Dashboards for Customers and Companies
│
├── /static                 # CSS, JavaScript, and Images
├── /archive                # Archived legacy templates, temporary scripts, and backups
├── /instance               # SQLite database instance
│
├── requirements.txt        # Python dependencies
├── app.py                  # Main server entry point
├── main.py                 # Core configurations (Flask-Mail, secrets, sessions)
├── googleAuth.py           # Google OAuth integration
├── admin.py                # Admin database model
└── ARCHITECTURE.md         # This conceptual document
```