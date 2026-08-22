import sqlite3

def run():
    conn = sqlite3.connect('instance/database.db')
    cur = conn.cursor()

    # Check customers table
    cur.execute('PRAGMA table_info(customers);')
    cols = [r[1] for r in cur.fetchall()]
    if 'visibility' not in cols:
        cur.execute("ALTER TABLE customers ADD COLUMN visibility VARCHAR(30) DEFAULT 'employers_only';")
        print('Added visibility column to customers table')
    else:
        print('visibility column already exists in customers')

    # Check customer_projects table
    cur.execute('PRAGMA table_info(customer_projects);')
    pcols = [r[1] for r in cur.fetchall()]
    if 'description' not in pcols:
        cur.execute("ALTER TABLE customer_projects ADD COLUMN description TEXT;")
        print('Added description column to customer_projects table')
    else:
        print('description column already exists in customer_projects')

    # Fix legacy UNIQUE(skill_name) on skills table
    cur.execute("SELECT sql FROM sqlite_master WHERE name='skills';")
    skills_sql = cur.fetchone()
    if skills_sql and 'UNIQUE' in skills_sql[0]:
        print('Removing global UNIQUE constraint from skills table...')
        cur.execute('''
            CREATE TABLE skills_new (
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
                customer_id INTEGER, 
                job_id INTEGER, 
                skill_name VARCHAR(80) NOT NULL, 
                FOREIGN KEY(customer_id) REFERENCES customers (id), 
                FOREIGN KEY(job_id) REFERENCES jobs (id)
            );
        ''')
        cur.execute('INSERT INTO skills_new (id, customer_id, job_id, skill_name) SELECT id, customer_id, job_id, skill_name FROM skills;')
        cur.execute('DROP TABLE skills;')
        cur.execute('ALTER TABLE skills_new RENAME TO skills;')
        print('Skills table migrated successfully without unique constraint!')

    conn.commit()
    conn.close()

if __name__ == '__main__':
    run()
