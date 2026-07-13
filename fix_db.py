import sqlite3
import os

db_path = 'instance/database.db'
if not os.path.exists(db_path):
    print('DB not found at instance/site.db')
else:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("UPDATE team_members_association SET status='عضو' WHERE status IN ('منظم', 'منضم')")
    conn.commit()
    print('Rows updated:', cursor.rowcount)
    conn.close()
