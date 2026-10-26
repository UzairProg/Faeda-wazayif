import sqlite3

def migrate():
    conn = sqlite3.connect('d:/faeda-wazayif/Faeda-wazayif/instance/database.db')
    cur = conn.cursor()

    columns = [
        ('entity_type', "TEXT DEFAULT 'graduated'"),
        ('company_location', "TEXT DEFAULT 'المملكة العربية السعودية'"),
        ('google_maps_url', "TEXT"),
        ('target_companies_goal', "INTEGER DEFAULT 30"),
        ('hired_continuity_count', "INTEGER DEFAULT 40"),
        ('retention_duration_months', "INTEGER DEFAULT 18"),
        ('committee_notes', "TEXT DEFAULT 'متابعة لجنة تحقيق الأهداف لضمان الاستمرارية'"),
    ]

    for col_name, col_def in columns:
        try:
            cur.execute(f"ALTER TABLE university_incubator_ventures ADD COLUMN {col_name} {col_def}")
            print(f"Added column {col_name}")
        except sqlite3.OperationalError as e:
            print(f"Column {col_name}: {e}")

    conn.commit()
    conn.close()
    print("Migration finished!")

if __name__ == '__main__':
    migrate()
