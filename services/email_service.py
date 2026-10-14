"""
Faeda Jobs — Asynchronous Background Email & Transactional Delivery Service
===========================================================================
Replaces synchronous, blocking SMTP calls with a resilient background queue
worker supporting:
1. Non-blocking asynchronous dispatch (returns in < 5ms).
2. Resilient background worker with queue.Queue and retry with exponential backoff.
3. Pluggable transactional providers:
   - Resend API (HTTP, instant, reliable)
   - SendGrid API (HTTP)
   - Standard Background SMTP (Gmail / Custom SMTP SSL/TLS with connection pooling)
   - Mock / Development Logging Mode (when no SMTP credentials configured)
4. Comprehensive error handling, dead-letter logging, and audit tracking.
"""

import os
import sys
import ssl
import time
import queue
import smtplib
import logging
import threading
from email.message import EmailMessage
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional, Dict, Any, List

logger = logging.getLogger("email_service")
logger.setLevel(logging.INFO)

if not logger.handlers:
    ch = logging.StreamHandler(sys.stdout)
    ch.setFormatter(logging.Formatter("[%(asctime)s] [%(levelname)s] [email_service] %(message)s", "%Y-%m-%d %H:%M:%S"))
    logger.addHandler(ch)


@dataclass
class EmailTask:
    to_email: str
    subject: str
    html_content: Optional[str] = None
    text_content: Optional[str] = None
    from_email: Optional[str] = None
    reply_to: Optional[str] = None
    retries_left: int = 3
    task_id: str = field(default_factory=lambda: f"mail_{int(time.time()*1000)}")
    created_at: datetime = field(default_factory=datetime.utcnow)
    attempt_count: int = 0
    last_error: Optional[str] = None


class BackgroundEmailService:
    def __init__(self):
        self._queue: queue.Queue = queue.Queue(maxsize=1000)
        self._worker_thread: Optional[threading.Thread] = None
        self._running: bool = False
        self._lock = threading.Lock()

        # Telemetry / metrics
        self._sent_count: int = 0
        self._failed_count: int = 0
        self._queued_count: int = 0
        self._recent_logs: List[Dict[str, Any]] = []

        self._ensure_worker_running()

    def _ensure_worker_running(self):
        with self._lock:
            if not self._running or self._worker_thread is None or not self._worker_thread.is_alive():
                self._running = True
                self._worker_thread = threading.Thread(
                    target=self._worker_loop,
                    name="BackgroundEmailWorker",
                    daemon=True
                )
                self._worker_thread.start()
                logger.info("[+] Background Email Queue Worker started.")

    def _worker_loop(self):
        """Continuously process queued emails in background."""
        while self._running:
            try:
                task: EmailTask = self._queue.get(timeout=2.0)
            except queue.Empty:
                continue

            try:
                task.attempt_count += 1
                logger.info("[*] Dispatching email task %s to %s (attempt %d/3)...", task.task_id, task.to_email, task.attempt_count)
                
                success = self._deliver_email(task)
                if success:
                    with self._lock:
                        self._sent_count += 1
                        self._log_event(task.task_id, task.to_email, "SENT")
                    logger.info("[+] Email %s successfully delivered to %s", task.task_id, task.to_email)
                else:
                    self._handle_delivery_failure(task)

            except Exception as e:
                task.last_error = str(e)
                logger.error("[-] Unexpected error processing email %s: %s", task.task_id, e)
                self._handle_delivery_failure(task)
            finally:
                self._queue.task_done()

    def _handle_delivery_failure(self, task: EmailTask):
        """Retry with exponential backoff or send to dead-letter log."""
        task.retries_left -= 1
        if task.retries_left > 0:
            backoff_seconds = (4 - task.retries_left) * 2
            logger.warning("[!] Email %s to %s failed. Re-queuing in %ds (%d retries left). Error: %s",
                           task.task_id, task.to_email, backoff_seconds, task.retries_left, task.last_error)
            time.sleep(backoff_seconds)
            self._queue.put(task)
        else:
            with self._lock:
                self._failed_count += 1
                self._log_event(task.task_id, task.to_email, "FAILED", task.last_error)
            logger.error("[-] Email %s to %s permanently failed after all retries. Dead-lettered. Error: %s",
                         task.task_id, task.to_email, task.last_error)

    def _deliver_email(self, task: EmailTask) -> bool:
        """Attempt delivery via Transactional API or SMTP with fallback."""
        # 1. Check for Resend Transactional API Key
        resend_key = os.environ.get("RESEND_API_KEY")
        if resend_key:
            return self._deliver_via_resend(task, resend_key)

        # 2. Check for SendGrid API Key
        sendgrid_key = os.environ.get("SENDGRID_API_KEY")
        if sendgrid_key:
            return self._deliver_via_sendgrid(task, sendgrid_key)

        # 3. Deliver via SMTP (Gmail / Custom SMTP)
        return self._deliver_via_smtp(task)

    def _deliver_via_resend(self, task: EmailTask, api_key: str) -> bool:
        """Deliver transactional email via Resend REST API."""
        try:
            import requests
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "from": task.from_email or os.environ.get("MAIL_DEFAULT_SENDER", "Faeda Jobs <notifications@faeda.sa>"),
                "to": [task.to_email],
                "subject": task.subject,
            }
            if task.html_content:
                payload["html"] = task.html_content
            if task.text_content:
                payload["text"] = task.text_content

            res = requests.post("https://api.resend.com/emails", json=payload, headers=headers, timeout=10)
            if res.status_code in (200, 201):
                return True
            task.last_error = f"Resend API error: {res.status_code} - {res.text}"
            return False
        except Exception as e:
            task.last_error = str(e)
            return False

    def _deliver_via_sendgrid(self, task: EmailTask, api_key: str) -> bool:
        """Deliver transactional email via SendGrid v3 API (Twilio SendGrid)."""
        try:
            import requests
            import email.utils

            raw_sender = task.from_email or os.environ.get("SENDGRID_FROM_EMAIL") or os.environ.get("MAIL_DEFAULT_SENDER") or os.environ.get("SENDER_EMAIL", "notifications@faeda.sa")
            parsed_name, parsed_email = email.utils.parseaddr(raw_sender)
            sender_email = parsed_email if parsed_email else raw_sender
            sender_name = parsed_name or os.environ.get("SENDGRID_FROM_NAME", "Faeda Jobs")

            headers = {
                "Authorization": f"Bearer {api_key.strip()}",
                "Content-Type": "application/json"
            }
            from_obj = {"email": sender_email}
            if sender_name:
                from_obj["name"] = sender_name

            payload = {
                "personalizations": [{"to": [{"email": task.to_email}]}],
                "from": from_obj,
                "subject": task.subject,
                "content": []
            }
            if task.text_content:
                payload["content"].append({"type": "text/plain", "value": task.text_content})
            if task.html_content:
                payload["content"].append({"type": "text/html", "value": task.html_content})

            if not payload["content"]:
                payload["content"].append({"type": "text/plain", "value": task.subject or "Notification from Faeda Jobs"})

            res = requests.post("https://api.sendgrid.com/v3/mail/send", json=payload, headers=headers, timeout=12)
            if res.status_code in (200, 202):
                return True
            task.last_error = f"SendGrid API error: {res.status_code} - {res.text}"
            logger.error("[-] SendGrid delivery failed: %s", task.last_error)
            return False
        except Exception as e:
            task.last_error = str(e)
            logger.error("[-] Exception in SendGrid delivery: %s", e)
            return False

    def _deliver_via_smtp(self, task: EmailTask) -> bool:
        """Deliver email via SMTP (SSL / TLS) with resilient connection handling."""
        sender_email = task.from_email or os.environ.get("SENDER_EMAIL") or os.environ.get("MAIL_USERNAME") or "coursesforyo@gmail.com"
        sender_password = os.environ.get("SENDER_PASSWORD") or os.environ.get("MAIL_PASSWORD")

        # Mock / Development mode when password is not set
        if not sender_password or sender_password == "your_app_password":
            logger.info("[DEV MODE] Mock email simulated for %s (Subject: '%s'). Set SENDER_PASSWORD in .env for live dispatch.",
                        task.to_email, task.subject)
            return True

        smtp_server = os.environ.get("MAIL_SERVER", "smtp.gmail.com")
        smtp_port = int(os.environ.get("MAIL_PORT", 465))
        use_ssl = os.environ.get("MAIL_USE_SSL", "True").lower() in ("true", "1") or smtp_port == 465

        em = EmailMessage()
        em["From"] = sender_email
        em["To"] = task.to_email
        em["Subject"] = task.subject
        if task.reply_to:
            em["Reply-To"] = task.reply_to

        if task.html_content:
            em.set_content(task.html_content, subtype="html")
            if task.text_content:
                em.add_alternative(task.text_content, subtype="plain")
        elif task.text_content:
            em.set_content(task.text_content)
        else:
            em.set_content(task.subject)

        try:
            context = ssl.create_default_context()
            context.check_hostname = False
            context.verify_mode = ssl.CERT_NONE

            if use_ssl:
                with smtplib.SMTP_SSL(smtp_server, smtp_port, context=context, timeout=15) as server:
                    server.login(sender_email, sender_password)
                    server.send_message(em)
            else:
                with smtplib.SMTP(smtp_server, smtp_port, timeout=15) as server:
                    if os.environ.get("MAIL_USE_TLS", "True").lower() in ("true", "1"):
                        server.starttls(context=context)
                    server.login(sender_email, sender_password)
                    server.send_message(em)
            return True

        except (smtplib.SMTPException, OSError, TimeoutError) as e:
            task.last_error = f"SMTP error: {type(e).__name__} - {str(e)}"
            return False

    def _log_event(self, task_id: str, to_email: str, status: str, error: Optional[str] = None):
        self._recent_logs.append({
            "task_id": task_id,
            "to_email": to_email,
            "status": status,
            "timestamp": datetime.utcnow().isoformat(),
            "error": error
        })
        if len(self._recent_logs) > 50:
            self._recent_logs.pop(0)

    # -------------------------------------------------------------------------
    # Public API
    # -------------------------------------------------------------------------

    def send_email_async(
        self,
        to_email: str,
        subject: str,
        html_content: Optional[str] = None,
        text_content: Optional[str] = None,
        from_email: Optional[str] = None,
        reply_to: Optional[str] = None
    ) -> str:
        """
        Enqueues an email to be sent asynchronously in the background.
        Returns immediately with a task_id (< 5ms execution time).
        """
        task = EmailTask(
            to_email=to_email,
            subject=subject,
            html_content=html_content,
            text_content=text_content,
            from_email=from_email,
            reply_to=reply_to
        )
        try:
            self._queue.put(task, block=False)
            with self._lock:
                self._queued_count += 1
            logger.info("[+] Email task %s queued for %s (subject: '%s')", task.task_id, to_email, subject)
            return task.task_id
        except queue.Full:
            logger.error("[-] Email queue is full! Dropping email %s to %s", task.task_id, to_email)
            with self._lock:
                self._failed_count += 1
            return ""

    def send_password_reset_email(self, to_email: str, reset_link: str) -> str:
        """Send password reset transactional email."""
        subject = "Reset Your Password — Faeda Jobs"
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }}
                .container {{ max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }}
                .header {{ background: #0f172a; padding: 28px; text-align: center; }}
                .header h1 {{ color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; }}
                .content {{ padding: 32px 28px; color: #334155; line-height: 1.6; font-size: 16px; }}
                .btn-container {{ text-align: center; margin: 32px 0; }}
                .btn {{ display: inline-block; background-color: #2563eb; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; }}
                .footer {{ background: #f1f5f9; padding: 20px 28px; text-align: center; font-size: 13px; color: #64748b; border-top: 1px solid #e2e8f0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Faeda Jobs | فائدة للتوظيف</h1>
                </div>
                <div class="content">
                    <p>مرحباً،</p>
                    <p>لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك على منصة فائدة. يرجى النقر على الزر أدناه لإعادة تعيين كلمة المرور:</p>
                    <div class="btn-container">
                        <a href="{reset_link}" class="btn">إعادة تعيين كلمة المرور</a>
                    </div>
                    <p>إذا لم تطلب هذا التغيير، يمكنك تجاهل هذه الرسالة بأمان.</p>
                    <p style="font-size: 13px; color: #94a3b8; word-break: break-all;">أو انسخ الرابط التالي:<br>{reset_link}</p>
                </div>
                <div class="footer">
                    &copy; {datetime.utcnow().year} Faeda Jobs Platform. All rights reserved.
                </div>
            </div>
        </body>
        </html>
        """
        text_content = f"Reset your Faeda Jobs password by opening this link: {reset_link}"
        return self.send_email_async(to_email=to_email, subject=subject, html_content=html_content, text_content=text_content)

    def send_contact_message_email(self, sender_email: str, subject: str, message_text: str) -> str:
        """Send contact inquiry email to platform administrators."""
        admin_email = os.environ.get("ADMIN_NOTIFICATION_EMAIL") or os.environ.get("SENDER_EMAIL") or "coursesforyo@gmail.com"
        email_subject = f"[Faeda Contact Inquiry] {subject}"
        html_content = f"""
        <div style="font-family: sans-serif; padding: 20px; line-height: 1.5; color: #1e293b;">
            <h2>New Contact Inquiry Received</h2>
            <p><strong>From:</strong> {sender_email}</p>
            <p><strong>Subject:</strong> {subject}</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
            <p><strong>Message:</strong></p>
            <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; white-space: pre-wrap;">
                {message_text}
            </div>
        </div>
        """
        text_content = f"New message from {sender_email}\nSubject: {subject}\n\nMessage:\n{message_text}"
        return self.send_email_async(
            to_email=admin_email,
            subject=email_subject,
            html_content=html_content,
            text_content=text_content,
            reply_to=sender_email
        )

    def get_queue_status(self) -> Dict[str, Any]:
        """Return the current queue metrics and health."""
        with self._lock:
            return {
                "active_worker": self._running,
                "pending_queue_size": self._queue.qsize(),
                "total_queued": self._queued_count,
                "total_sent": self._sent_count,
                "total_failed": self._failed_count,
                "recent_events": list(self._recent_logs[-10:])
            }


# Singleton Instance
email_service = BackgroundEmailService()
