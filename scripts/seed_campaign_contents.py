import os
import sys

sys.path.insert(0, os.path.abspath(os.path.dirname(os.path.dirname(__file__))))

from app import create_app, db
from services.campaign import Campaign, CampaignContent

app = create_app()
with app.app_context():
    camp = Campaign.query.first()
    if camp:
        existing_count = CampaignContent.query.filter_by(campaign_id=camp.id).count()
        if existing_count == 0:
            c1 = CampaignContent(
                campaign_id=camp.id,
                content_type="text",
                title="دليل برنامج استقطاب وتأهيل الكفاءات الوطنية",
                description="نظرة شاملة حول المسارات التدريبية، المزايا التنافسية، وخطة التطور الوظيفي للكوادر المنضمة.",
                text_content="يتضمن البرنامج مساراً متسارعاً لتطوير المهارات التقنية العالية في الحوسبة السحابية وهندسة الذكاء الاصطناعي مع إشراف مباشر من كبار المهندسين والخبراء الدوليين.",
                display_order=0
            )
            c2 = CampaignContent(
                campaign_id=camp.id,
                content_type="image",
                title="إنفوجرافيك مزايا بيئة العمل والبدلات",
                description="مخطط تفصيلي يوضح باقات التأمين الطبي الشامل، بدل السكن، ومكافآت الأداء السنوية.",
                file_url="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1000&h=600&fit=crop",
                media_type="image/jpeg",
                display_order=1
            )
            c3 = CampaignContent(
                campaign_id=camp.id,
                content_type="document",
                title="كتيب المواصفات الوظيفية والشروط الأكاديمية (PDF)",
                description="تحميل الدليل الإرشادي المعتمد لشروط التقديم ومعايير القبول في الحملة الوظيفية.",
                file_url="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                media_type="application/pdf",
                display_order=2
            )
            db.session.add_all([c1, c2, c3])
            db.session.commit()
            print(f"Seeded 3 demo contents for Campaign ID {camp.id}!")
        else:
            print(f"Campaign ID {camp.id} already has {existing_count} contents.")
    else:
        print("No campaigns found to seed contents for.")
