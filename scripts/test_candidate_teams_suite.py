"""
scripts/test_candidate_teams_suite.py
Automated test suite for Candidate Teams, Capabilities, Invitations, and Member Management.
"""
import unittest
import json
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from services.customer import Customers
from services.teams import Teams, TeamInvitation, team_members_association


class CandidateTeamsTestSuite(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()

        # Get active candidate (Owner candidate)
        self.candidate1 = Customers.query.filter_by(status='active').first()
        self.candidate2 = Customers.query.filter(Customers.id != self.candidate1.id, Customers.status == 'active').first()
        if not self.candidate2:
            self.candidate2 = Customers.query.filter(Customers.id != self.candidate1.id).first()

    def tearDown(self):
        self.ctx.pop()

    def test_unauthenticated_teams_api_returns_401(self):
        res = self.client.get('/api/v1/candidate/teams')
        self.assertEqual(res.status_code, 401)
        res_create = self.client.post('/api/v1/candidate/teams', json={"name": "Test Team"})
        self.assertEqual(res_create.status_code, 401)

    def test_get_teams_list(self):
        with self.client.session_transaction() as sess:
            sess['session_customer'] = self.candidate1.email
            sess['user_id'] = self.candidate1.id
            sess['role'] = 'candidate'

        res = self.client.get('/api/v1/candidate/teams')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('ownedTeams', data)
        self.assertIn('joinedTeams', data)
        self.assertIn('pendingInvitationsCount', data)
        self.assertIn('totalTeams', data)

    def test_create_team_ownership_and_details(self):
        with self.client.session_transaction() as sess:
            sess['session_customer'] = self.candidate1.email
            sess['user_id'] = self.candidate1.id
            sess['role'] = 'candidate'

        team_payload = {
            "name": "فريق الذكاء والتطوير المتقدم (Test Suite Team)",
            "description": "فريق متخصص في تطوير الحلول التقنية الحديثة",
            "specialization": "Full-Stack AI Development",
            "generalProgram": "تقنية المعلومات",
            "semiSpecialProgram": "الذكاء الاصطناعي"
        }
        res_create = self.client.post('/api/v1/candidate/teams', json=team_payload)
        self.assertEqual(res_create.status_code, 201)
        create_data = res_create.get_json()
        self.assertTrue(create_data['success'])
        team_id = create_data['teamId']

        # Get team detail
        res_detail = self.client.get(f'/api/v1/candidate/teams/{team_id}')
        self.assertEqual(res_detail.status_code, 200)
        detail_data = res_detail.get_json()
        self.assertEqual(detail_data['name'], team_payload['name'])
        self.assertTrue(detail_data['isOwner'])
        self.assertEqual(detail_data['currentMemberRole'], 'owner')
        self.assertIn('capabilities', detail_data)
        self.assertIn('potentialGaps', detail_data)
        self.assertIn('members', detail_data)
        self.assertGreaterEqual(len(detail_data['members']), 1)

        # Non-owner update rejection
        with self.client.session_transaction() as sess:
            sess['session_customer'] = self.candidate2.email
            sess['user_id'] = self.candidate2.id
            sess['role'] = 'candidate'

        res_unauth_update = self.client.put(f'/api/v1/candidate/teams/{team_id}', json={"name": "Hacked Name"})
        self.assertEqual(res_unauth_update.status_code, 403)

        # Owner update success
        with self.client.session_transaction() as sess:
            sess['session_customer'] = self.candidate1.email
            sess['user_id'] = self.candidate1.id
            sess['role'] = 'candidate'

        res_update = self.client.put(f'/api/v1/candidate/teams/{team_id}', json={"name": "فريق الذكاء والتطوير المحدث"})
        self.assertEqual(res_update.status_code, 200)
        self.assertTrue(res_update.get_json()['success'])

        # Clean up test team
        res_delete = self.client.delete(f'/api/v1/candidate/teams/{team_id}')
        self.assertEqual(res_delete.status_code, 200)

    def test_candidate_search_for_teams(self):
        with self.client.session_transaction() as sess:
            sess['session_customer'] = self.candidate1.email
            sess['user_id'] = self.candidate1.id
            sess['role'] = 'candidate'

        res = self.client.get('/api/v1/candidate/teams/candidates/search?q=a')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('candidates', data)
        self.assertIn('total', data)
        for c in data['candidates']:
            self.assertNotEqual(c['id'], self.candidate1.id)
            self.assertNotIn('email', c)
            self.assertNotIn('mobile', c)

    def test_invitation_lifecycle_invite_accept_and_leave(self):
        with self.client.session_transaction() as sess:
            sess['session_customer'] = self.candidate1.email
            sess['user_id'] = self.candidate1.id
            sess['role'] = 'candidate'

        # 1. Create Team
        res_create = self.client.post('/api/v1/candidate/teams', json={
            "name": "فريق اختبار الدعوات",
            "description": "فريق مؤقت لاختبار الدعوات",
            "specialization": "Software Engineering"
        })
        self.assertEqual(res_create.status_code, 201)
        team_id = res_create.get_json()['teamId']

        # 2. Prevent self-invite
        res_self = self.client.post(f'/api/v1/candidate/teams/{team_id}/invite', json={
            "candidateId": self.candidate1.id
        })
        self.assertEqual(res_self.status_code, 400)

        # 3. Invite Candidate 2
        res_inv = self.client.post(f'/api/v1/candidate/teams/{team_id}/invite', json={
            "candidateId": self.candidate2.id,
            "role": "Frontend Specialist",
            "message": "نرحب بانضمامك لفريقنا"
        })
        self.assertEqual(res_inv.status_code, 201)
        inv_id = res_inv.get_json()['invitationId']

        # 4. Duplicate invite prevention
        res_dup_inv = self.client.post(f'/api/v1/candidate/teams/{team_id}/invite', json={
            "candidateId": self.candidate2.id
        })
        self.assertEqual(res_dup_inv.status_code, 409)

        # 5. Candidate 2 views pending invitations
        with self.client.session_transaction() as sess:
            sess['session_customer'] = self.candidate2.email
            sess['user_id'] = self.candidate2.id
            sess['role'] = 'candidate'

        res_invs = self.client.get('/api/v1/candidate/teams/invitations')
        self.assertEqual(res_invs.status_code, 200)
        invs_data = res_invs.get_json()
        self.assertTrue(any(i['id'] == inv_id for i in invs_data['invitations']))

        # 6. Candidate 2 accepts invitation
        res_respond = self.client.post(f'/api/v1/candidate/teams/invitations/{inv_id}/respond', json={
            "action": "accept"
        })
        self.assertEqual(res_respond.status_code, 200)
        self.assertEqual(res_respond.get_json()['action'], 'accepted')

        # 7. Verify Candidate 2 sees team in joinedTeams
        res_c2_teams = self.client.get('/api/v1/candidate/teams')
        self.assertEqual(res_c2_teams.status_code, 200)
        self.assertTrue(any(t['id'] == str(team_id) for t in res_c2_teams.get_json()['joinedTeams']))

        # 8. Candidate 2 leaves team
        res_leave = self.client.post(f'/api/v1/candidate/teams/{team_id}/leave')
        self.assertEqual(res_leave.status_code, 200)

        # 9. Clean up team
        with self.client.session_transaction() as sess:
            sess['session_customer'] = self.candidate1.email
            sess['user_id'] = self.candidate1.id
            sess['role'] = 'candidate'

        self.client.delete(f'/api/v1/candidate/teams/{team_id}')


if __name__ == '__main__':
    unittest.main()
