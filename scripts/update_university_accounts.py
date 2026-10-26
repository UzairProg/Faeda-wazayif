import sqlite3

def run():
    conn = sqlite3.connect('d:/faeda-wazayif/Faeda-wazayif/instance/database.db')
    cur = conn.cursor()

    cur.execute("UPDATE universities SET password = 'admin123'")

    existing = cur.execute("SELECT id FROM universities WHERE email = 'k.sulaiman@kfu.edu.sa'").fetchone()
    if not existing:
        cur.execute("""
            INSERT INTO universities (name_ar, name_en, email, password, location, country, institution_type, status)
            VALUES ('د. خالد السليمان (مشرف التدريب التعاوني)', 'Dr. Khalid Sulaiman (Coop Academic Supervisor)', 'k.sulaiman@kfu.edu.sa', 'admin123', 'الأحساء', 'المملكة العربية السعودية', 'جامعة حكومية', 'active')
        """)
        print("Inserted Dr. Khalid Sulaiman into universities")
    else:
        print("Dr. Khalid Sulaiman already exists")

    conn.commit()
    conn.close()
    print("Database updated!")

if __name__ == '__main__':
    run()
