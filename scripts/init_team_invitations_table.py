"""
scripts/init_team_invitations_table.py
Creates the team_invitations table in the SQLite database if it does not already exist.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from sqlalchemy import inspect, text

app = create_app()

with app.app_context():
    inspector = inspect(db.engine)
    tables = inspector.get_table_names()
    
    if 'team_invitations' not in tables:
        print("[*] Creating team_invitations table...")
        create_sql = """
        CREATE TABLE team_invitations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            team_id INTEGER NOT NULL,
            candidate_id INTEGER NOT NULL,
            invited_by_id INTEGER NOT NULL,
            status VARCHAR(20) DEFAULT 'pending',
            message VARCHAR(255),
            role VARCHAR(100),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            responded_at DATETIME,
            FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
            FOREIGN KEY (candidate_id) REFERENCES customers(id) ON DELETE CASCADE,
            FOREIGN KEY (invited_by_id) REFERENCES customers(id) ON DELETE CASCADE
        );
        CREATE INDEX idx_team_invitations_candidate ON team_invitations(candidate_id);
        CREATE INDEX idx_team_invitations_team ON team_invitations(team_id);
        """
        for stmt in create_sql.strip().split(';'):
            if stmt.strip():
                db.session.execute(text(stmt))
        db.session.commit()
        print("[+] team_invitations table created successfully.")
    else:
        print("[i] team_invitations table already exists.")
