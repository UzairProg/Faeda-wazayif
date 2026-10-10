import sqlite3
import os

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
db_path = os.path.join(base_dir, 'instance', 'database.db')

con = sqlite3.connect(db_path)
cur = con.cursor()

# Check verified vs unverified companies
cur.execute('SELECT is_verified, COUNT(*) FROM company GROUP BY is_verified')
print('Company verification stats:', cur.fetchall())

# Set a few customer_jobs to 'hired'
cur.execute("UPDATE customer_jobs SET status = 'hired' WHERE id IN (1, 2, 6)")
con.commit()

cur.execute('SELECT status, COUNT(*) FROM customer_jobs GROUP BY status')
print('Updated customer_jobs stats:', cur.fetchall())

con.close()
print("Database seed update completed successfully.")
