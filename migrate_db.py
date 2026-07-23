from app import create_app, db

app = create_app()

with app.app_context():
    engine = db.engine
    # For SQLAlchemy 1.4+ / 2.0
    from sqlalchemy import text
    with engine.begin() as conn:
        columns_to_add = {
            'project_size': 'INTEGER DEFAULT 0',
            'number_of_projects': 'INTEGER DEFAULT 0',
            'success_rate': 'FLOAT DEFAULT 0.0',
            'reputation': 'VARCHAR(20) DEFAULT "N/A"',
            'profit_percentage': 'FLOAT DEFAULT 0.0',
            'services_provided': 'VARCHAR(100) DEFAULT "N/A"',
            'intellectual_property': 'INTEGER DEFAULT 0',
            'social_impact': 'VARCHAR(20) DEFAULT "N/A"'
        }
        for col, col_type in columns_to_add.items():
            try:
                conn.execute(text(f"ALTER TABLE company ADD COLUMN {col} {col_type}"))
                print(f"Added {col}")
            except Exception as e:
                print(f"Could not add {col}: {e}")
