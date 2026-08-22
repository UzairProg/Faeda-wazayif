import sqlite3
import os
import sys

db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'mysite', 'database.db')
con = sqlite3.connect(db_path)
cur = con.cursor()

cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='customer_saved_jobs';")
row = cur.fetchone()
print("customer_saved_jobs table exists:", bool(row))

if not row:
    cur.execute("""
    CREATE TABLE customer_saved_jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL,
        job_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers (id),
        FOREIGN KEY (job_id) REFERENCES jobs (id),
        UNIQUE(customer_id, job_id)
    );
    """)
    con.commit()
    print("Created customer_saved_jobs table successfully!")
else:
    print("Table already present.")

con.close()
