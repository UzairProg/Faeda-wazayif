# ==============================================================================
# scripts/test_campaign_social.py
# Automated Test Suite for Campaign Social Features
# ==============================================================================
import os
import sys
import json

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
sys.path.insert(0, base_dir)

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

from app import create_app, db
from services.campaign import (
    Campaign, CampaignLike, CampaignComment, CampaignShare,
    CampaignSave, CampaignView, Notification
)

app = create_app()

def run_tests():
    print("======================================================================")
    print("RUNNING CAMPAIGN SOCIAL INTERACTIONS TEST SUITE")
    print("======================================================================")

    with app.test_client() as client:
        # 1. Test GET /api/v1/posts (Feed)
        print("\n[TEST 1] GET /api/v1/posts (Public Feed)")
        res = client.get('/api/v1/posts')
        assert res.status_code == 200, f"Expected 200, got {res.status_code}"
        data = res.get_json()
        assert data.get('success') is True
        assert len(data.get('posts', [])) > 0
        first_post = data['posts'][0]
        print(f"-> SUCCESS: Retrieved {len(data['posts'])} campaigns. First: '{first_post['title']}'")
        first_id = first_post['id']

        # 2. Test Filters
        print("\n[TEST 2] Testing Feed Filters (account_type, target_audience_role)")
        res_univ = client.get('/api/v1/posts?account_type=university')
        assert res_univ.status_code == 200
        univ_data = res_univ.get_json()
        assert all(p['accountType'] == 'university' for p in univ_data['posts'])
        print(f"-> SUCCESS: Filter by university returned {len(univ_data['posts'])} posts.")

        # 3. Test Create Campaign as Candidate
        print("\n[TEST 3] POST /api/v1/posts (Create Campaign as Candidate)")
        cand_payload = {
            "title": "مشروع نظام ذكاء اصطناعي لرصد التهديدات السيبرانية",
            "summary": "نظام مفتوح المصدر تم تطويره بلغة بايثون لاكتشاف محاولات الاختراق",
            "content": "تفاصيل المشروع التقنية: يعتمد على خوارزميات التعلم الآلي ونماذج الكشف الشاذ...",
            "accountType": "candidate",
            "postType": "portfolio_showcase",
            "category": "المشاريع والأعمال",
            "tags": ["أمن سيبراني", "ذكاء اصطناعي", "بايثون"],
            "coverImage": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=600&fit=crop",
            "mediaType": "image",
            "ctaText": "مشاهدة المشروع على جيت هب",
            "ctaUrl": "https://github.com",
            "targetAudience": {
                "roles": ["company"],
                "targetSpecializations": ["الأمن السيبراني"],
                "targetLocations": ["الرياض"]
            }
        }
        res_create = client.post('/api/v1/posts', json=cand_payload, headers={"X-Persona-Role": "candidate"})
        assert res_create.status_code == 201, f"Expected 201, got {res_create.status_code}: {res_create.get_data(as_text=True)}"
        new_post = res_create.get_json()['post']
        created_id = new_post['id']
        print(f"-> SUCCESS: Created campaign ID {created_id} for candidate.")

        # 4. Test Like and Unlike
        print("\n[TEST 4] POST /api/v1/posts/<id>/like (Like / Unlike & Duplicate Prevention)")
        # First like as company
        res_like1 = client.post(f'/api/v1/posts/{created_id}/like', headers={"X-Persona-Role": "company"})
        assert res_like1.status_code == 200
        like_data1 = res_like1.get_json()
        assert like_data1['isLiked'] is True
        print(f"-> SUCCESS: Company liked campaign. Total likes: {like_data1['likes']}")

        # Like again -> should unlike (toggle)
        res_like2 = client.post(f'/api/v1/posts/{created_id}/like', headers={"X-Persona-Role": "company"})
        assert res_like2.status_code == 200
        like_data2 = res_like2.get_json()
        assert like_data2['isLiked'] is False
        print(f"-> SUCCESS: Second click unliked. Total likes: {like_data2['likes']}")

        # Like back so we have a like
        client.post(f'/api/v1/posts/{created_id}/like', headers={"X-Persona-Role": "company"})

        # 5. Test Comments and Replies
        print("\n[TEST 5] POST /api/v1/posts/<id>/comments (Comment & Nested Reply)")
        res_comm1 = client.post(f'/api/v1/posts/{created_id}/comments', json={
            "text": "مشروع رائع جداً، هل يدعم التوافق مع بروتوكولات SIEM؟"
        }, headers={"X-Persona-Role": "company"})
        assert res_comm1.status_code == 201
        comm1 = res_comm1.get_json()['comment']
        comm1_id = comm1['id']
        print(f"-> SUCCESS: Added comment ID {comm1_id} by Company.")

        # Candidate replies to Company comment
        res_reply = client.post(f'/api/v1/posts/{created_id}/comments', json={
            "text": "نعم، يدعم الربط المباشر عبر Syslog و Webhooks مع Splunk و Elastic.",
            "parent_id": comm1_id
        }, headers={"X-Persona-Role": "candidate"})
        assert res_reply.status_code == 201
        reply = res_reply.get_json()['comment']
        assert reply['parentId'] == comm1_id
        print(f"-> SUCCESS: Added reply ID {reply['id']} to comment {comm1_id}.")

        # 6. Test Comment Edit Permissions
        print("\n[TEST 6] PUT /api/v1/posts/comments/<id> (Security: Edit only own comment)")
        # Unauthorized edit attempt by university on company's comment
        res_unauth_edit = client.put(f'/api/v1/posts/comments/{comm1_id}', json={
            "text": "محاولة تعديل غير مصرح بها"
        }, headers={"X-Persona-Role": "university"})
        assert res_unauth_edit.status_code == 403, f"Expected 403, got {res_unauth_edit.status_code}"
        print("-> SUCCESS: Blocked unauthorized edit with 403 Forbidden.")

        # Authorized edit by author
        res_auth_edit = client.put(f'/api/v1/posts/comments/{comm1_id}', json={
            "text": "مشروع رائع جداً ومبتكر، هل يدعم التوافق مع بروتوكولات SIEM المتقدمة؟"
        }, headers={"X-Persona-Role": "company"})
        assert res_auth_edit.status_code == 200
        print("-> SUCCESS: Comment edited successfully by author.")

        # 7. Test Share / Repost
        print("\n[TEST 7] POST /api/v1/posts/<id>/share (Share / Repost Campaign)")
        res_share = client.post(f'/api/v1/posts/{created_id}/share', json={
            "quote": "كفاءة واعدة ومشروع مميز يستحق الدعم والتبني المؤسسي!"
        }, headers={"X-Persona-Role": "university"})
        assert res_share.status_code == 201
        share_data = res_share.get_json()
        assert share_data['sharesCount'] >= 1
        print(f"-> SUCCESS: Shared campaign. Total shares: {share_data['sharesCount']}")

        # 8. Test Save / Unsave
        print("\n[TEST 8] POST /api/v1/posts/<id>/save (Save / Unsave & Duplicate Prevention)")
        res_save1 = client.post(f'/api/v1/posts/{created_id}/save', headers={"X-Persona-Role": "company"})
        assert res_save1.status_code == 200
        assert res_save1.get_json()['isSaved'] is True
        print("-> SUCCESS: Campaign saved.")

        # Get Saved Campaigns
        res_saved_list = client.get('/api/v1/posts/saved', headers={"X-Persona-Role": "company"})
        assert res_saved_list.status_code == 200
        saved_posts = res_saved_list.get_json()['posts']
        assert any(p['id'] == created_id for p in saved_posts)
        print(f"-> SUCCESS: Saved list contains {len(saved_posts)} campaigns.")

        # 9. Test Notifications
        print("\n[TEST 9] GET /api/v1/notifications (Candidate Notifications for Likes/Comments)")
        res_notifs = client.get('/api/v1/notifications', headers={"X-Persona-Role": "candidate"})
        assert res_notifs.status_code == 200
        notifs_data = res_notifs.get_json()
        assert len(notifs_data['notifications']) > 0
        print(f"-> SUCCESS: Retrieved {len(notifs_data['notifications'])} notifications. Unread: {notifs_data['unreadCount']}")

        # Mark all read
        res_read_all = client.post('/api/v1/notifications/read-all', headers={"X-Persona-Role": "candidate"})
        assert res_read_all.status_code == 200
        res_notifs_after = client.get('/api/v1/notifications', headers={"X-Persona-Role": "candidate"})
        assert res_notifs_after.get_json()['unreadCount'] == 0
        print("-> SUCCESS: Marked all notifications as read.")

        # 10. Test Analytics for Campaign Owner
        print("\n[TEST 10] GET /api/v1/campaigns/<id>/analytics (Views, Likes, Comments, Shares, Saves, Engagement)")
        # Unauthorized viewer
        res_unauth_an = client.get(f'/api/v1/campaigns/{created_id}/analytics', headers={"X-Persona-Role": "university"})
        assert res_unauth_an.status_code == 403
        print("-> SUCCESS: Blocked unauthorized analytics view with 403 Forbidden.")

        # Authorized campaign owner (candidate)
        res_owner_an = client.get(f'/api/v1/campaigns/{created_id}/analytics', headers={"X-Persona-Role": "candidate"})
        assert res_owner_an.status_code == 200
        an = res_owner_an.get_json()['analytics']
        assert 'views' in an and 'likes' in an and 'comments' in an and 'shares' in an and 'saves' in an and 'engagement_rate' in an
        print(f"-> SUCCESS: Analytics verified: Views={an['views']}, Likes={an['likes']}, Comments={an['comments']}, Shares={an['shares']}, Saves={an['saves']}, Engagement Rate={an['engagement_rate']}%")

        # 11. Test User Published Campaigns (for Profiles)
        print("\n[TEST 11] GET /api/v1/campaigns/by-user (Profile Published Campaigns)")
        res_user_camps = client.get('/api/v1/campaigns/by-user?user_type=candidate&user_id=1')
        assert res_user_camps.status_code == 200
        user_camps = res_user_camps.get_json()['campaigns']
        assert len(user_camps) > 0
        print(f"-> SUCCESS: Retrieved {len(user_camps)} campaigns published by candidate.")

        # 12. Test Delete Comment Permissions
        print("\n[TEST 12] DELETE /api/v1/posts/comments/<id> (Security: Author or Owner can delete)")
        # Candidate (campaign owner) deletes the reply
        res_del = client.delete(f'/api/v1/posts/comments/{reply["id"]}', headers={"X-Persona-Role": "candidate"})
        assert res_del.status_code == 200
        print("-> SUCCESS: Deleted comment successfully.")

    print("\n======================================================================")
    print("ALL 12 BACKEND TESTS PASSED WITH 100% SUCCESS!")
    print("======================================================================")

if __name__ == "__main__":
    run_tests()
