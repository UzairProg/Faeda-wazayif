import os
import sys
import sqlite3
import gzip
import shutil
import glob
from datetime import datetime
import logging

# Add the project root to the Python path so we can import 'app' and 'services'
project_root = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
sys.path.insert(0, project_root)

from app import create_app
from services.audit_log import AuditLog
from services.admin import Admin, ROLE_SUPER_ADMIN

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')

def backup_database():
    instance_dir = os.path.join(project_root, 'instance')
    backups_dir = os.path.join(instance_dir, 'backups')
    db_path = os.path.join(instance_dir, 'database.db')
    
    if not os.path.exists(db_path):
        logging.error(f"Database not found at {db_path}")
        return

    # Create backups directory if it doesn't exist
    os.makedirs(backups_dir, exist_ok=True)
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_db_path = os.path.join(backups_dir, f'database_backup_{timestamp}.db')
    backup_gz_path = f"{backup_db_path}.gz"
    
    try:
        logging.info(f"Starting database backup to {backup_db_path}...")
        # 1. Safely backup the database using SQLite backup API
        source_conn = sqlite3.connect(db_path)
        dest_conn = sqlite3.connect(backup_db_path)
        with source_conn, dest_conn:
            source_conn.backup(dest_conn)
        source_conn.close()
        dest_conn.close()
        
        # 2. Compress the backup file to save space
        logging.info(f"Compressing backup to {backup_gz_path}...")
        with open(backup_db_path, 'rb') as f_in:
            with gzip.open(backup_gz_path, 'wb') as f_out:
                shutil.copyfileobj(f_in, f_out)
        
        # Remove the uncompressed .db file
        os.remove(backup_db_path)
        logging.info("Compression complete.")
        
        # 3. Retention policy: Keep only the last 2 backups
        retention_count = 2
        backup_files = glob.glob(os.path.join(backups_dir, 'database_backup_*.db.gz'))
        # Sort by modification time, oldest first
        backup_files.sort(key=os.path.getmtime)
        
        while len(backup_files) > retention_count:
            old_backup = backup_files.pop(0)
            os.remove(old_backup)
            logging.info(f"Deleted old backup: {os.path.basename(old_backup)}")
            
        # 4. Log the action in AuditLog
        app = create_app()
        with app.app_context():
            # Find an admin to attribute the action to (prefer super admin)
            admin = Admin.query.filter_by(role=ROLE_SUPER_ADMIN).first()
            if not admin:
                admin = Admin.query.first()
                
            if admin:
                file_size = os.path.getsize(backup_gz_path)
                file_size_mb = round(file_size / (1024 * 1024), 2)
                
                AuditLog.log_action(
                    admin_id=admin.id,
                    action='backup_database',
                    target_type='database',
                    details={
                        "filename": os.path.basename(backup_gz_path),
                        "size_mb": file_size_mb,
                        "status": "success"
                    },
                    ip_address="127.0.0.1" # Local script
                )
                logging.info("Backup successfully logged to AuditLog.")
            else:
                logging.warning("No admin found to log the backup action.")
                
        logging.info("Database backup process completed successfully.")

    except Exception as e:
        logging.error(f"Error during database backup: {str(e)}")

if __name__ == '__main__':
    backup_database()
