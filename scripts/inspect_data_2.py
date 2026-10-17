import sqlite3

conn = sqlite3.connect('instance/database.db')
c = conn.cursor()
c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
tables = [r[0] for r in c.fetchall()]

print(f"Total tables: {len(tables)}")
non_empty = 0
for t in tables:
    try:
        cnt = c.execute(f'SELECT COUNT(*) FROM "{t}"').fetchone()[0]
        if cnt > 0:
            print(f"{t:35} : {cnt} rows")
            non_empty += 1
    except Exception as e:
        print(f"{t:35} : Error: {e}")

print(f"\nNon-empty tables: {non_empty} / {len(tables)}")
