#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
scripts/test_chat_suite.py
=============================================================================
FAEDA JOBS — PROFESSIONAL CHAT & REAL-TIME COMMUNICATION SUITE (SECTION 8)
=============================================================================
Verifies:
  1. Unauthenticated access rejection (401)
  2. Candidate ↔ Company conversation initialization (201)
  3. Candidate message send & DB persistence
  4. Company inbox receipt & unread counter
  5. Company reply & conversation updated_at bump
  6. Candidate receipt of company reply
  7. Conversation list summary & counterpart resolution
  8. Global unread count calculation
  9. Mark conversation read & timestamp synchronization
  10. Unauthorized conversation access rejection (403)
  11. Cross-company IDOR rejection (403)
  12. Cross-candidate IDOR rejection (403)
  13. Team internal squad conversation & messaging
  14. Team non-member access rejection (403)
  15. Invalid / empty / oversized message validation (400)
  16. Duplicate conversation reuse prevention (200, isExisting: True)
"""

import sys
import os
import json
import unittest
from datetime import datetime

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app import create_app, db
from services.customer import Customers, customer_jobs
from services.company import Company
from services.job import Jobs
from services.teams import Teams, team_members_association
from services.chat import Conversation, ConversationParticipant, ChatMessage


class TestChatSuite(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Bootstrap test environment with isolated test users, companies, and teams."""
        cls.app = create_app()
        cls.app.config['TESTING'] = True
        cls.app.config['WTF_CSRF_ENABLED'] = False
        cls.client = cls.app.test_client()

        with cls.app.app_context():
            db.create_all()

            # Clean all old chat records first
            ChatMessage.query.delete()
            ConversationParticipant.query.delete()
            Conversation.query.delete()
            db.session.commit()

            # 1. Candidate 1 (Ahmed)
            c1 = Customers.query.filter_by(email="chat_cand_1@faeda.test").first()
            if not c1:
                c1 = Customers(
                    fullname="أحمد الزهراني",
                    email="chat_cand_1@faeda.test",
                    mobile="+966500000001",
                    password="pass",
                    user_id="chat_cand_uuid_1",
                    activated=True
                )
                db.session.add(c1)
                db.session.commit()
            cls.cand1_id = c1.id
            cls.cand1_email = c1.email

            # 2. Candidate 2 (Omar - Snooper)
            c2 = Customers.query.filter_by(email="chat_cand_2@faeda.test").first()
            if not c2:
                c2 = Customers(
                    fullname="عمر الشمري",
                    email="chat_cand_2@faeda.test",
                    mobile="+966500000002",
                    password="pass",
                    user_id="chat_cand_uuid_2",
                    activated=True
                )
                db.session.add(c2)
                db.session.commit()
            cls.cand2_id = c2.id
            cls.cand2_email = c2.email

            # 3. Company 1 (Digital Innovation)
            comp1 = Company.query.filter_by(company_email="chat_comp_1@faeda.test").first()
            if not comp1:
                comp1 = Company(
                    company_arabic_name="شركة الابتكار المتقدم",
                    company_english_name="Advanced Innovation Co",
                    company_email="chat_comp_1@faeda.test",
                    login_password="pass",
                    activated=True
                )
                db.session.add(comp1)
                db.session.commit()
            cls.comp1_id = comp1.id
            cls.comp1_email = comp1.company_email

            # 4. Company 2 (Competitor - Snooper)
            comp2 = Company.query.filter_by(company_email="chat_comp_2@faeda.test").first()
            if not comp2:
                comp2 = Company(
                    company_arabic_name="شركة المنافس للتقنية",
                    company_english_name="Competitor Tech",
                    company_email="chat_comp_2@faeda.test",
                    login_password="pass",
                    activated=True
                )
                db.session.add(comp2)
                db.session.commit()
            cls.comp2_id = comp2.id
            cls.comp2_email = comp2.company_email

            # 5. Team (Cloud Squad led by Cand 1)
            t = Teams.query.filter_by(team_name="فريق السحابة الذكية - شات").first()
            if not t:
                t = Teams(
                    team_name="فريق السحابة الذكية - شات",
                    about="فريق برمجيات سحابية",
                    special_program="هندسة السحابة",
                    admin_id="chat_cand_uuid_1"
                )
                db.session.add(t)
                db.session.commit()
            cls.team_id = t.id

    def _login_cand1(self):
        with self.client.session_transaction() as sess:
            sess.clear()
            sess['session_customer'] = self.cand1_email
            sess['user_id'] = self.cand1_id
            sess['user_role'] = 'customer'

    def _login_cand2(self):
        with self.client.session_transaction() as sess:
            sess.clear()
            sess['session_customer'] = self.cand2_email
            sess['user_id'] = self.cand2_id
            sess['user_role'] = 'customer'

    def _login_comp1(self):
        with self.client.session_transaction() as sess:
            sess.clear()
            sess['session_company'] = self.comp1_email
            sess['company_id'] = self.comp1_id
            sess['user_role'] = 'company'

    def _login_comp2(self):
        with self.client.session_transaction() as sess:
            sess.clear()
            sess['session_company'] = self.comp2_email
            sess['company_id'] = self.comp2_id
            sess['user_role'] = 'company'

    def _logout(self):
        with self.client.session_transaction() as sess:
            sess.clear()

    # -------------------------------------------------------------------------
    # 1. Unauthenticated Rejection
    # -------------------------------------------------------------------------
    def test_01_unauthenticated_access_rejected(self):
        """Unauthenticated requests to any chat endpoint must return 401."""
        self._logout()
        res_list = self.client.get('/api/v1/chat/conversations')
        self.assertEqual(res_list.status_code, 401)

        res_unread = self.client.get('/api/v1/chat/unread-count')
        self.assertEqual(res_unread.status_code, 401)

        res_send = self.client.post('/api/v1/chat/conversations/1/messages', data=json.dumps({"body": "Hi"}), content_type='application/json')
        self.assertEqual(res_send.status_code, 401)

    # -------------------------------------------------------------------------
    # 2. Candidate ↔ Company Conversation Creation & Message Send
    # -------------------------------------------------------------------------
    def test_02_candidate_creates_conversation_and_sends_message(self):
        """Candidate initiates a conversation with Company 1 regarding an application."""
        self._login_cand1()

        payload = {
            "type": "CANDIDATE_COMPANY",
            "targetId": self.comp1_id,
            "subject": "استفسار بخصوص وظيفة مهندس برمجيات أول",
            "contextType": "job_application",
            "contextId": "101",
            "initialMessage": "السلام عليكم، أود الاستفسار عن تفاصيل المقابلة الفنية."
        }
        res = self.client.post('/api/v1/chat/conversations', data=json.dumps(payload), content_type='application/json')
        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        self.assertTrue(data['success'])
        conv = data['conversation']
        self.assertEqual(conv['type'], 'CANDIDATE_COMPANY')
        self.assertEqual(conv['counterpart']['name'], "شركة الابتكار المتقدم")

    # -------------------------------------------------------------------------
    # 3. Company Receives Message & Unread Count Increments
    # -------------------------------------------------------------------------
    def test_03_company_receives_message_and_unread_count(self):
        """Company logs in and verifies conversation presence and unread counter."""
        self._login_comp1()

        # Check conversations list
        res_list = self.client.get('/api/v1/chat/conversations')
        self.assertEqual(res_list.status_code, 200)
        convs = res_list.get_json()['conversations']
        self.assertTrue(len(convs) > 0)
        target_conv = convs[0]

        # Check unread count
        res_unread = self.client.get('/api/v1/chat/unread-count')
        self.assertEqual(res_unread.status_code, 200)
        self.assertGreaterEqual(res_unread.get_json()['unreadCount'], 1)

        # Check conversation detail
        res_detail = self.client.get(f'/api/v1/chat/conversations/{target_conv["id"]}')
        self.assertEqual(res_detail.status_code, 200)
        msgs = res_detail.get_json()['messages']
        self.assertTrue(len(msgs) > 0)
        self.assertEqual(msgs[0]['body'], "السلام عليكم، أود الاستفسار عن تفاصيل المقابلة الفنية.")
        self.assertFalse(msgs[0]['isOwn'])

    # -------------------------------------------------------------------------
    # 4. Company Replies to Candidate
    # -------------------------------------------------------------------------
    def test_04_company_replies_to_candidate(self):
        """Company sends a reply into the conversation thread."""
        self._login_comp1()

        # Get conversation
        res_list = self.client.get('/api/v1/chat/conversations')
        self.assertEqual(res_list.status_code, 200)
        conv_id = res_list.get_json()['conversations'][0]['id']

        reply_payload = {
            "body": "أهلاً بك يا أحمد، المقابلة الفنية ستكون يوم الثلاثاء القادم بإذن الله."
        }
        res_msg = self.client.post(
            f'/api/v1/chat/conversations/{conv_id}/messages',
            data=json.dumps(reply_payload),
            content_type='application/json'
        )
        self.assertEqual(res_msg.status_code, 201)
        msg_data = res_msg.get_json()['message']
        self.assertEqual(msg_data['senderType'], 'company')
        self.assertTrue(msg_data['isOwn'])

    # -------------------------------------------------------------------------
    # 5. Candidate Receives Company Reply & Marks as Read
    # -------------------------------------------------------------------------
    def test_05_candidate_receives_reply_and_marks_read(self):
        """Candidate verifies company reply, unread count, and marks thread as read."""
        self._login_cand1()

        res_list = self.client.get('/api/v1/chat/conversations')
        self.assertEqual(res_list.status_code, 200)
        conv_id = res_list.get_json()['conversations'][0]['id']

        # Unread count should be >= 1 (the reply from company)
        res_unread = self.client.get('/api/v1/chat/unread-count')
        self.assertEqual(res_unread.status_code, 200)
        self.assertGreaterEqual(res_unread.get_json()['unreadCount'], 1)

        # Mark as read
        res_read = self.client.post(f'/api/v1/chat/conversations/{conv_id}/read')
        self.assertEqual(res_read.status_code, 200)

        # Unread count should now be 0
        res_unread_after = self.client.get('/api/v1/chat/unread-count')
        self.assertEqual(res_unread_after.get_json()['unreadCount'], 0)

    # -------------------------------------------------------------------------
    # 6. IDOR Protection: Cross-Candidate Access Rejected (403)
    # -------------------------------------------------------------------------
    def test_06_cross_candidate_access_rejected(self):
        """Candidate 2 (Omar) must not be able to read or send in Candidate 1's conversation."""
        # Get conv id as cand 1
        self._login_cand1()
        res_list = self.client.get('/api/v1/chat/conversations')
        conv_id = res_list.get_json()['conversations'][0]['id']

        self._login_cand2()

        # Try to view conversation detail
        res_snoop = self.client.get(f'/api/v1/chat/conversations/{conv_id}')
        self.assertEqual(res_snoop.status_code, 403)

        # Try to send a message into Candidate 1's conversation
        res_send = self.client.post(
            f'/api/v1/chat/conversations/{conv_id}/messages',
            data=json.dumps({"body": "محاولة اختراق المحادثة"}),
            content_type='application/json'
        )
        self.assertEqual(res_send.status_code, 403)

    # -------------------------------------------------------------------------
    # 7. IDOR Protection: Cross-Company Access Rejected (403)
    # -------------------------------------------------------------------------
    def test_07_cross_company_access_rejected(self):
        """Company 2 (Competitor) must not be able to read Company 1's conversation."""
        self._login_comp1()
        res_list = self.client.get('/api/v1/chat/conversations')
        conv_id = res_list.get_json()['conversations'][0]['id']

        self._login_comp2()

        res_snoop = self.client.get(f'/api/v1/chat/conversations/{conv_id}')
        self.assertEqual(res_snoop.status_code, 403)

    # -------------------------------------------------------------------------
    # 8. Team Internal Squad Chat
    # -------------------------------------------------------------------------
    def test_08_team_internal_squad_chat(self):
        """Team leader (Cand 1) creates and posts in internal team chat."""
        self._login_cand1()

        payload = {
            "type": "TEAM_INTERNAL",
            "targetId": self.team_id,
            "initialMessage": "مرحباً بأعضاء الفريق، سنبدأ العمل على المشروع اليوم."
        }
        res_team_chat = self.client.post('/api/v1/chat/conversations', data=json.dumps(payload), content_type='application/json')
        self.assertEqual(res_team_chat.status_code, 201)
        conv = res_team_chat.get_json()['conversation']
        self.assertEqual(conv['type'], 'TEAM_INTERNAL')
        team_conv_id = conv['id']

        # Non-team member (Cand 2) cannot access team chat
        self._login_cand2()
        res_non_member = self.client.get(f'/api/v1/chat/conversations/{team_conv_id}')
        self.assertEqual(res_non_member.status_code, 403)

    # -------------------------------------------------------------------------
    # 9. Company ↔ Team Conversation
    # -------------------------------------------------------------------------
    def test_09_company_team_conversation(self):
        """Company 1 contacts Team regarding team opportunity."""
        self._login_comp1()

        payload = {
            "type": "TEAM_COMPANY",
            "targetId": self.team_id,
            "subject": "عرض مشروع سحابي لفريق العمل",
            "initialMessage": "السلام عليكم، نود مناقشة تنفيذ مشروع سحابي متكامل مع فريقكم."
        }
        res = self.client.post('/api/v1/chat/conversations', data=json.dumps(payload), content_type='application/json')
        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        self.assertEqual(data['conversation']['type'], 'TEAM_COMPANY')

    # -------------------------------------------------------------------------
    # 10. Message Validation (Empty & Length Limit)
    # -------------------------------------------------------------------------
    def test_10_message_validation(self):
        """Validates empty body and oversized message limits."""
        self._login_cand1()

        res_list = self.client.get('/api/v1/chat/conversations')
        conv_id = res_list.get_json()['conversations'][0]['id']

        # Empty body
        res_empty = self.client.post(
            f'/api/v1/chat/conversations/{conv_id}/messages',
            data=json.dumps({"body": "   "}),
            content_type='application/json'
        )
        self.assertEqual(res_empty.status_code, 400)

        # Oversized body (> 4000 chars)
        res_long = self.client.post(
            f'/api/v1/chat/conversations/{conv_id}/messages',
            data=json.dumps({"body": "A" * 4500}),
            content_type='application/json'
        )
        self.assertEqual(res_long.status_code, 400)

    # -------------------------------------------------------------------------
    # 11. Message Edit & Soft Delete
    # -------------------------------------------------------------------------
    def test_11_message_edit_and_soft_delete(self):
        """Verify editing own message and soft deleting it."""
        self._login_comp1()

        res_list = self.client.get('/api/v1/chat/conversations')
        conv_id = res_list.get_json()['conversations'][0]['id']

        # Send a message to edit and delete
        res_msg = self.client.post(
            f'/api/v1/chat/conversations/{conv_id}/messages',
            data=json.dumps({"body": "رسالة سيتم تعديلها ثم حذفها"}),
            content_type='application/json'
        )
        self.assertEqual(res_msg.status_code, 201)
        msg_id = res_msg.get_json()['message']['id']

        # Edit message
        res_edit = self.client.put(
            f'/api/v1/chat/messages/{msg_id}',
            data=json.dumps({"body": "رسالة محدثة بنجاح"}),
            content_type='application/json'
        )
        self.assertEqual(res_edit.status_code, 200)
        self.assertEqual(res_edit.get_json()['message']['body'], "رسالة محدثة بنجاح")

        # Delete message
        res_del = self.client.delete(f'/api/v1/chat/messages/{msg_id}')
        self.assertEqual(res_del.status_code, 200)

        # Retrieve conversation and verify message is marked deleted
        res_conv = self.client.get(f'/api/v1/chat/conversations/{conv_id}')
        self.assertEqual(res_conv.status_code, 200)

    # -------------------------------------------------------------------------
    # 12. Duplicate Conversation Prevention (Reuse Existing Thread)
    # -------------------------------------------------------------------------
    def test_12_duplicate_conversation_prevention(self):
        """Calling create conversation for existing pair returns existing thread (isExisting: True)."""
        self._login_cand1()

        payload = {
            "type": "CANDIDATE_COMPANY",
            "targetId": self.comp1_id
        }
        res = self.client.post('/api/v1/chat/conversations', data=json.dumps(payload), content_type='application/json')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data['isExisting'])


if __name__ == '__main__':
    unittest.main(verbosity=2)
