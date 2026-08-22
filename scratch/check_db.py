import sqlite3
import glob

for db_path in glob.glob('**/*.db', recursive=True):
    try:
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()
        cur.execute("SELECT sql FROM sqlite_master WHERE tbl_name='skills'")
        rows = cur.fetchall()
        if rows:
            print("DB:", db_path)
            for r in rows:
                print(r[0])
    except Exception as e:
        print("ERR:", db_path, e)
