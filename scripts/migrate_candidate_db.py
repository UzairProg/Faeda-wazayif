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

    conn.commit()
    conn.close()

if __name__ == '__main__':
    run()
