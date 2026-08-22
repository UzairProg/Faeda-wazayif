import sqlite3
import glob

for db_path in glob.glob('**/*.db', recursive=True):
    try:
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()
        cur.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='skills'")
        row = cur.fetchone()
        if row and "UNIQUE (skill_name)" in row[0]:
            print(f"Migrating skills table in {db_path}...")
            cur.execute("BEGIN TRANSACTION")
            cur.execute("""
                CREATE TABLE skills_new (
                    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                    customer_id INTEGER,
                    job_id INTEGER,
                    skill_name VARCHAR(80) NOT NULL,
                    FOREIGN KEY(customer_id) REFERENCES customers (id),
                    FOREIGN KEY(job_id) REFERENCES jobs (id)
                )
            """)
            cur.execute("""
                INSERT INTO skills_new (id, customer_id, job_id, skill_name)
                SELECT id, customer_id, job_id, skill_name FROM skills
            """)
            cur.execute("DROP TABLE skills")
            cur.execute("ALTER TABLE skills_new RENAME TO skills")
            conn.commit()
            print(f"Successfully migrated skills table in {db_path}!")
        conn.close()
    except Exception as e:
        print(f"Error migrating {db_path}: {e}")
