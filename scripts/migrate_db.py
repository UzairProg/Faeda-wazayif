import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import create_app, db
from sqlalchemy import text

app = create_app()

queries = [
    # Customers table
    "ALTER TABLE customers ADD COLUMN status VARCHAR(20) DEFAULT 'active';",
    "ALTER TABLE customers ADD COLUMN is_verified BOOLEAN DEFAULT 0;",
    "ALTER TABLE customers ADD COLUMN verified_at DATETIME;",
    "ALTER TABLE customers ADD COLUMN suspension_reason TEXT;",
    "ALTER TABLE customers ADD COLUMN warnings_count INTEGER DEFAULT 0;",
    
    # Company table
    "ALTER TABLE company ADD COLUMN status VARCHAR(20) DEFAULT 'active';",
    "ALTER TABLE company ADD COLUMN is_verified BOOLEAN DEFAULT 0;",
    "ALTER TABLE company ADD COLUMN verified_at DATETIME;",
    "ALTER TABLE company ADD COLUMN suspension_reason TEXT;",
    
    # Jobs table
    "ALTER TABLE jobs ADD COLUMN status VARCHAR(20) DEFAULT 'pending';",
    "ALTER TABLE jobs ADD COLUMN is_featured BOOLEAN DEFAULT 0;",
    "ALTER TABLE jobs ADD COLUMN category VARCHAR(100);",
    "ALTER TABLE jobs ADD COLUMN rejection_reason TEXT;"
]

with app.app_context():
    for q in queries:
        try:
            db.session.execute(text(q))
            print(f"Executed: {q}")
        except Exception as e:
            print(f"Skipped (might already exist or error): {q}")
            print(f"Error detail: {e}")
            db.session.rollback()
    
    db.session.commit()
    
    # Create tickets table if it doesn't exist
    from services.ticket import Ticket
    db.create_all()
    
    print("Migration finished successfully.")
