# Database Backup and Recovery Guide

This guide details how to set up automated database backups for the Faeda platform on both Windows and Linux, and how to restore the database in case of a failure.

## 1. Backup Strategy

The backup script (`scripts/backup_db.py`) safely copies the SQLite database, compresses it to save space, and logs the action to the `AuditLog` table so it is visible in the admin panel. 
It also enforces a retention policy: **only the last 2 backups are kept**.

### Setting up Automation

You should configure your server to run this script automatically on a daily basis.

#### Option A: Windows (Task Scheduler)

1. Open **Task Scheduler** from the Start Menu.
2. Click **Action > Create Basic Task**.
3. Name it "Faeda Daily Database Backup".
4. Set the trigger to **Daily** and choose a time (e.g., 2:00 AM).
5. For the action, choose **Start a program**.
6. Set **Program/script** to your Python executable (e.g., `C:\mysite\.venv\Scripts\python.exe` if using a virtual environment).
7. Set **Add arguments** to `scripts\backup_db.py`.
8. Set **Start in** to your project directory (e.g., `C:\mysite`).
9. Finish the wizard. The script will now run automatically in the background every day.

#### Option B: Linux (Cron Job)

If deploying the application on a Linux server (Ubuntu/Debian), use `cron` to schedule the script:

1. Open the crontab for the user running the application:
   ```bash
   crontab -e
   ```
2. Add the following line to run the backup daily at 2:00 AM:
   ```bash
   0 2 * * * cd /path/to/mysite && /path/to/mysite/.venv/bin/python scripts/backup_db.py >> /path/to/mysite/instance/backup_cron.log 2>&1
   ```
   *(Make sure to replace `/path/to/mysite` with the actual absolute path to your project).*

---

## 2. Recovery Strategy

If the database becomes corrupted or data is lost, you can easily restore from the latest backup.

### Restoring a Backup

1. Open a terminal or PowerShell in your project directory.
2. Run the restore script without arguments to view available backups:
   ```bash
   python scripts/restore_db.py
   ```
   This will list the `.db.gz` files in `instance/backups/`.
3. To restore a specific backup, provide its filename as an argument:
   ```bash
   python scripts/restore_db.py database_backup_YYYYMMDD_HHMM.db.gz
   ```

**Important Notes During Restore:**
- The restore script automatically creates a "pre-restore" backup of your current database before replacing it, just in case you need to revert the restore.
- If the Flask application (or Gunicorn/Waitress) is running, **restart the application** after the restore is complete to ensure all database connections are refreshed.

---

## 3. Viewing Logs

All successful backups triggered by `scripts/backup_db.py` will appear in the Admin Panel's Audit Logs under the action `نسخ احتياطي لقاعدة البيانات` (Database Backup), showing the backup filename and size.
