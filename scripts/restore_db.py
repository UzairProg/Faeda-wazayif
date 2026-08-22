import os
import sys
import gzip
import shutil
import glob
from datetime import datetime
import logging

project_root = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
sys.path.insert(0, project_root)

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')

def restore_database(backup_filename=None):
    instance_dir = os.path.join(project_root, 'instance')
    backups_dir = os.path.join(instance_dir, 'backups')
    db_path = os.path.join(instance_dir, 'database.db')
    
    if not os.path.exists(backups_dir):
        logging.error(f"Backups directory not found at {backups_dir}")
        return

    backup_files = glob.glob(os.path.join(backups_dir, 'database_backup_*.db.gz'))
    backup_files.sort(key=os.path.getmtime, reverse=True)
    
    if not backup_files:
        logging.error("No backups found in the backups directory.")
        return
        
    if not backup_filename:
        print("\nAvailable backups:")
        for idx, file in enumerate(backup_files):
            print(f"{idx + 1}. {os.path.basename(file)}")
            
        print("\nTo restore, run: python restore_db.py <backup_filename>")
        print(f"Example: python restore_db.py {os.path.basename(backup_files[0])}\n")
        return
        
    backup_path = os.path.join(backups_dir, backup_filename)
    if not os.path.exists(backup_path):
        logging.error(f"Backup file not found: {backup_path}")
        return
        
    # 1. Create a pre-restore backup of the current state
    if os.path.exists(db_path):
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        pre_restore_backup_path = os.path.join(backups_dir, f'pre_restore_backup_{timestamp}.db')
        logging.info(f"Creating pre-restore backup of current DB at {pre_restore_backup_path}...")
        try:
            shutil.copy2(db_path, pre_restore_backup_path)
            logging.info("Pre-restore backup created.")
        except Exception as e:
            logging.error(f"Failed to create pre-restore backup: {e}")
            return
            
    # 2. Decompress and restore the selected backup
    logging.info(f"Restoring from {backup_path}...")
    try:
        with gzip.open(backup_path, 'rb') as f_in:
            with open(db_path, 'wb') as f_out:
                shutil.copyfileobj(f_in, f_out)
        logging.info("Database successfully restored!")
        logging.info("Please restart your Flask application if it is currently running.")
    except Exception as e:
        logging.error(f"Failed to restore database: {e}")

if __name__ == '__main__':
    if len(sys.argv) > 1:
        restore_database(sys.argv[1])
    else:
        restore_database()
