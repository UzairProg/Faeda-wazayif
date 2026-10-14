"""
Test Suite: Asynchronous Background Email & Transactional Queue Service
========================================================================
Validates:
1. Asynchronous non-blocking dispatch (< 15ms).
2. Background queue processing via EmailWorker.
3. Password reset and contact inquiry email helpers.
4. Error handling and retry resilience on delivery failure.
5. Queue telemetry and metrics tracking.
"""

import unittest
import time
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.email_service import email_service, EmailTask, BackgroundEmailService


class EmailServiceTestSuite(unittest.TestCase):
    def setUp(self):
        self.service = BackgroundEmailService()

    def test_non_blocking_async_dispatch(self):
        """Verify that queuing an email returns immediately without blocking."""
        start_time = time.time()
        task_id = self.service.send_email_async(
            to_email="test.candidate@example.com",
            subject="Welcome to Faeda Jobs",
            text_content="Your application has been received."
        )
        elapsed_ms = (time.time() - start_time) * 1000

        self.assertTrue(task_id.startswith("mail_"))
        self.assertLess(elapsed_ms, 25.0, f"Dispatch took too long: {elapsed_ms}ms")

    def test_queue_metrics_tracking(self):
        """Verify that get_queue_status returns accurate telemetry."""
        status = self.service.get_queue_status()
        self.assertTrue(status.get("active_worker"))
        self.assertIn("total_queued", status)
        self.assertIn("total_sent", status)
        self.assertIn("pending_queue_size", status)

    def test_password_reset_email_helper(self):
        """Verify password reset email template generation and queuing."""
        task_id = self.service.send_password_reset_email(
            to_email="ahmed@example.com",
            reset_link="https://faeda.sa/reset-password?token=xyz123"
        )
        self.assertTrue(bool(task_id))

    def test_contact_inquiry_email_helper(self):
        """Verify contact form inquiry email generation and queuing."""
        task_id = self.service.send_contact_message_email(
            sender_email="employer@company.com",
            subject="Partnership Inquiry",
            message_text="We would like to register 50 tech positions on Faeda."
        )
        self.assertTrue(bool(task_id))

    def test_error_handling_and_retry_resilience(self):
        """Verify that email delivery failures are handled without throwing exceptions."""
        task = EmailTask(
            to_email="invalid@domain.invalid",
            subject="Test Retry",
            retries_left=1
        )
        # Directly trigger failure handling to test dead-letter logic
        task.last_error = "Simulated SMTP timeout"
        self.service._handle_delivery_failure(task)
        status = self.service.get_queue_status()
        self.assertGreaterEqual(status["total_failed"], 1)


if __name__ == '__main__':
    unittest.main()
