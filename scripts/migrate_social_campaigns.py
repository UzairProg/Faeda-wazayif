# ==============================================================================
# scripts/migrate_social_campaigns.py
# Database migration and seeding for LinkedIn/Instagram-style Social Campaigns
# ==============================================================================
import os
import sys
import sqlite3
from datetime import datetime

base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
db_path = os.path.join(base_dir, 'instance', 'database.db')

print(f"Migrating database at: {db_path}")

con = sqlite3.connect(db_path)
cur = con.cursor()

# 1. Inspect existing columns in campaigns
existing_campaign_cols = [r[1] for r in cur.execute("PRAGMA table_info(campaigns)").fetchall()]
print(f"Existing columns in campaigns: {existing_campaign_cols}")

# Columns to add to campaigns table if missing
columns_to_add = [
    ("account_type", "VARCHAR(50) DEFAULT 'company'"),
    ("university_id", "INTEGER REFERENCES universities(id)"),
    ("customer_id", "INTEGER REFERENCES customers(id)"),
    ("post_type", "VARCHAR(100) DEFAULT 'hiring_general'"),
    ("category", "VARCHAR(100) DEFAULT 'استقطاب كفاءات'"),
    ("media_type", "VARCHAR(20) DEFAULT 'image'"),
    ("video_url", "VARCHAR(500)"),
    ("cta_text", "VARCHAR(100)"),
    ("cta_url", "VARCHAR(500)"),
    ("target_specializations", "TEXT"),
    ("target_locations", "TEXT"),
    ("tags", "VARCHAR(500)"),
    ("author_name", "VARCHAR(150)"),
    ("author_title", "VARCHAR(200)"),
    ("author_avatar", "VARCHAR(500)"),
    ("author_username", "VARCHAR(100)"),
    ("is_verified", "BOOLEAN DEFAULT 1"),
]

for col_name, col_type in columns_to_add:
    if col_name not in existing_campaign_cols:
        print(f"Adding column '{col_name}' to campaigns...")
        cur.execute(f"ALTER TABLE campaigns ADD COLUMN {col_name} {col_type};")

# Also, ensure company_id can be NULL by updating schema if needed.
# In SQLite, adding columns is done. If company_id has NOT NULL constraint, we can create campaigns without company_id
# by ensuring company_id defaults to 1 or creating a clean new table if null is needed.
# Let's check if company_id allows null:
# If table was created with NOT NULL, let's make sure company_id can be nullable:
cur.execute("PRAGMA foreign_keys = OFF;")
cur.execute("""
CREATE TABLE IF NOT EXISTS campaigns_temp (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER REFERENCES company(id),
    university_id INTEGER REFERENCES universities(id),
    customer_id INTEGER REFERENCES customers(id),
    account_type VARCHAR(50) DEFAULT 'company',
    post_type VARCHAR(100) DEFAULT 'hiring_general',
    category VARCHAR(100) DEFAULT 'استقطاب كفاءات',
    title VARCHAR(255) NOT NULL,
    tagline VARCHAR(255),
    description TEXT,
    banner_url VARCHAR(500),
    media_type VARCHAR(20) DEFAULT 'image',
    video_url VARCHAR(500),
    cta_text VARCHAR(100),
    cta_url VARCHAR(500),
    target_roles VARCHAR(255),
    target_skills TEXT,
    target_specializations TEXT,
    target_location VARCHAR(255),
    target_locations TEXT,
    experience_level VARCHAR(50),
    work_type VARCHAR(50) DEFAULT 'Full-time',
    min_salary INTEGER,
    max_salary INTEGER,
    tags VARCHAR(500),
    status VARCHAR(50) DEFAULT 'active',
    outreach_template TEXT,
    author_name VARCHAR(150),
    author_title VARCHAR(200),
    author_avatar VARCHAR(500),
    author_username VARCHAR(100),
    is_verified BOOLEAN DEFAULT 1,
    start_date DATETIME,
    end_date DATETIME,
    created_at DATETIME,
    updated_at DATETIME
);
""")

# Check if campaigns_temp needs to replace campaigns
# Let's check company_id nullable
info = cur.execute("PRAGMA table_info(campaigns)").fetchall()
company_id_not_null = any(c[1] == 'company_id' and c[3] == 1 for c in info)
if company_id_not_null:
    print("Migrating campaigns table to allow nullable company_id...")
    # Copy data into campaigns_temp
    cur.execute("""
    INSERT INTO campaigns_temp (
        id, company_id, university_id, customer_id, account_type, post_type, category,
        title, tagline, description, banner_url, media_type, video_url, cta_text, cta_url,
        target_roles, target_skills, target_specializations, target_location, target_locations,
        experience_level, work_type, min_salary, max_salary, tags, status, outreach_template,
        author_name, author_title, author_avatar, author_username, is_verified,
        start_date, end_date, created_at, updated_at
    )
    SELECT
        id, company_id, university_id, customer_id, COALESCE(account_type, 'company'), COALESCE(post_type, 'hiring_general'), COALESCE(category, 'استقطاب كفاءات'),
        title, tagline, description, banner_url, COALESCE(media_type, 'image'), video_url, cta_text, cta_url,
        target_roles, target_skills, target_specializations, target_location, target_locations,
        experience_level, work_type, min_salary, max_salary, tags, status, outreach_template,
        author_name, author_title, author_avatar, author_username, COALESCE(is_verified, 1),
        start_date, end_date, created_at, updated_at
    FROM campaigns;
    """)
    cur.execute("DROP TABLE campaigns;")
    cur.execute("ALTER TABLE campaigns_temp RENAME TO campaigns;")
    print("campaigns table successfully migrated to allow nullable company_id.")
else:
    cur.execute("DROP TABLE IF EXISTS campaigns_temp;")

# 2. Create campaign_likes table
cur.execute("""
CREATE TABLE IF NOT EXISTS campaign_likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    user_type VARCHAR(30) NOT NULL,
    user_id INTEGER NOT NULL,
    user_name VARCHAR(150),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_campaign_like UNIQUE (campaign_id, user_type, user_id)
);
""")
cur.execute("CREATE INDEX IF NOT EXISTS idx_campaign_likes_cid ON campaign_likes(campaign_id);")
cur.execute("CREATE INDEX IF NOT EXISTS idx_campaign_likes_user ON campaign_likes(user_type, user_id);")

# 3. Create campaign_comments table
cur.execute("""
CREATE TABLE IF NOT EXISTS campaign_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    user_type VARCHAR(30) NOT NULL,
    user_id INTEGER NOT NULL,
    author_name VARCHAR(150) NOT NULL,
    author_avatar VARCHAR(500),
    author_title VARCHAR(200),
    author_username VARCHAR(100),
    content TEXT NOT NULL,
    parent_id INTEGER REFERENCES campaign_comments(id) ON DELETE CASCADE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
""")
cur.execute("CREATE INDEX IF NOT EXISTS idx_campaign_comments_cid ON campaign_comments(campaign_id);")
cur.execute("CREATE INDEX IF NOT EXISTS idx_campaign_comments_parent ON campaign_comments(parent_id);")

# 4. Create campaign_shares table
cur.execute("""
CREATE TABLE IF NOT EXISTS campaign_shares (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    user_type VARCHAR(30) NOT NULL,
    user_id INTEGER NOT NULL,
    user_name VARCHAR(150),
    user_avatar VARCHAR(500),
    user_title VARCHAR(200),
    repost_quote TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
""")
cur.execute("CREATE INDEX IF NOT EXISTS idx_campaign_shares_cid ON campaign_shares(campaign_id);")
cur.execute("CREATE INDEX IF NOT EXISTS idx_campaign_shares_user ON campaign_shares(user_type, user_id);")

# 5. Create campaign_saves table
cur.execute("""
CREATE TABLE IF NOT EXISTS campaign_saves (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    user_type VARCHAR(30) NOT NULL,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_campaign_save UNIQUE (campaign_id, user_type, user_id)
);
""")
cur.execute("CREATE INDEX IF NOT EXISTS idx_campaign_saves_cid ON campaign_saves(campaign_id);")
cur.execute("CREATE INDEX IF NOT EXISTS idx_campaign_saves_user ON campaign_saves(user_type, user_id);")

# 6. Create campaign_views table
cur.execute("""
CREATE TABLE IF NOT EXISTS campaign_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    user_type VARCHAR(30),
    user_id INTEGER,
    ip_address VARCHAR(50),
    viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
""")
cur.execute("CREATE INDEX IF NOT EXISTS idx_campaign_views_cid ON campaign_views(campaign_id);")

# 7. Create notifications table
cur.execute("""
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipient_type VARCHAR(30) NOT NULL,
    recipient_id INTEGER NOT NULL,
    actor_type VARCHAR(30) NOT NULL,
    actor_id INTEGER NOT NULL,
    actor_name VARCHAR(150),
    actor_avatar VARCHAR(500),
    action_type VARCHAR(50) NOT NULL,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
    comment_id INTEGER,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT 0,
    read_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
""")
cur.execute("CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_type, recipient_id, is_read);")

cur.execute("PRAGMA foreign_keys = ON;")
con.commit()
print("All relational tables created successfully!")

# 8. Seed initial sample campaigns if only initial 2 exist
count = cur.execute("SELECT count(*) FROM campaigns").fetchone()[0]
print(f"Total campaigns in database: {count}")

if count <= 2:
    print("Seeding initial high-quality social campaigns across University, Company, and Candidate accounts...")
    
    seeds = [
        # University Campaign 1
        {
            "account_type": "university",
            "university_id": 1,
            "post_type": "research_paper",
            "category": "الأبحاث والابتكار",
            "title": "ورقة بحثية: تحسين أداء نماذج معالجة اللغة الطبيعية للغة العربية في البيئات الصناعية",
            "tagline": "نشرت جامعة الملك فهد دراسة بحثية محكمة حول تقنيات تدريب النماذج اللغوية الضخمة بدقة فائقة.",
            "description": """أعلن مركز أبحاث الذكاء الاصطناعي وهندسة البيانات في جامعة الملك فهد للبترول والمعادن (KFUPM) عن نشر ورقة بحثية جديدة في مؤتمر دولي مصنف Q1.

### أبرز محاور البحث:
1. معالجة التحديات الدلالية في استخلاص المصطلحات التقنية السعودية من الوثائق والعقود الصناعية.
2. خفض التكلفة الحسابية لعملية Fine-Tuning بنسبة 45% باستخدام خوارزميات الضغط الدلالي.
3. إتاحة النموذج الأولي والمفردات مفتوحة المصدر لدعم الباحثين والمطورين في المملكة.""",
            "banner_url": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=600&fit=crop",
            "media_type": "image",
            "cta_text": "تحميل البحث العلمي",
            "cta_url": "/posts",
            "target_roles": "candidate,company",
            "target_skills": "معالجة اللغة الطبيعية, الذكاء الاصطناعي",
            "target_specializations": "الذكاء الاصطناعي وهندسة البرمجيات",
            "target_location": "الظهران، المملكة العربية السعودية",
            "target_locations": "جميع مناطق المملكة",
            "tags": "أبحاث, ذكاء اصطناعي, معالجة اللغة الطبيعية, KFUPM",
            "author_name": "جامعة الملك فهد للبترول والمعادن",
            "author_title": "مركز التميز لأبحاث الذكاء الاصطناعي",
            "author_avatar": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=150&h=150&fit=crop",
            "author_username": "kfupm-ai-research",
        },
        # University Campaign 2
        {
            "account_type": "university",
            "university_id": 2,
            "post_type": "job_fair",
            "category": "معارض التوظيف",
            "title": "ملتقى التوظيف السنوي وربط الخريجين 2026: بمشاركة أكثر من 85 شركة رائدة",
            "tagline": "تنظم عمادة شؤون الطلاب ملتقى التوظيف والتدريب التعاوني لربط أكثر من 1,500 طالب وطالبة بكبرى الشركات.",
            "description": """يسر جامعة الملك سعود الإعلان عن انطلاق فعاليات "ملتقى التوظيف السنوي واليوم المهني 2026" في البهو الرئيسي للحرم الجامعي.

### مميزات الملتقى لهذا العام:
- مقابلات شخصية فورية للمرشحين المتفوقين في مجالات التقنية، الهندسة، وإدارة الأعمال.
- ورش عمل تفاعلية لبناء السير الذاتية وتجاوز اختبارات الجاهزية المهنية.
- منصة إلكترونية مشتركة بالتعاون مع منصة فائدة وظائف لتسليم السير الذاتية آلياً.""",
            "banner_url": "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=600&fit=crop",
            "media_type": "image",
            "cta_text": "التسجيل في الملتقى",
            "cta_url": "/jobs",
            "target_roles": "candidate,company",
            "target_skills": "تقنية المعلومات, هندسة, إدارة أعمال",
            "target_specializations": "جميع التخصصات",
            "target_location": "الرياض",
            "target_locations": "الرياض",
            "tags": "معارض التوظيف, يوم المهنة, جامعة الملك سعود, تدريب تعاوني",
            "author_name": "جامعة الملك سعود",
            "author_title": "عمادة التطوير المهني وشؤون الخريجين",
            "author_avatar": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=150&h=150&fit=crop",
            "author_username": "ksu-career",
        },
        # Company Campaign 1
        {
            "account_type": "company",
            "company_id": 1,
            "post_type": "hiring_general",
            "category": "استقطاب كفاءات",
            "title": "حملة التوظيف الوطنية الشاملة: فتح باب التقديم لأكثر من 150 شاغراً وظيفياً في مختلف الفروع",
            "tagline": "تعلن شركة علم عن إطلاق حملة استقطاب عامة تستهدف حديثي التخرج وذوي الخبرة في مجالات التقنية.",
            "description": """ضمن خطتنا التوسعية لعام 2026، تسر شركة علم فتح باب التوظيف العام لاستقطاب أكثر من 150 كفاءة طموحة في مدن الرياض، جدة، والدمام.

نرحب بجميع التخصصات الشغوفة بالمساهمة في بناء المنصات الرقمية الوطنية وتطوير منظومة الخدمات الحكومية الذكية.""",
            "banner_url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop",
            "media_type": "image",
            "cta_text": "التقديم الفوري على الوظائف",
            "cta_url": "/jobs",
            "target_roles": "candidate",
            "target_skills": "Full-Stack, Cloud, DevOps, Product Management",
            "target_specializations": "الذكاء الاصطناعي وهندسة البرمجيات",
            "target_location": "الرياض",
            "target_locations": "الرياض, جدة, الدمام",
            "tags": "توظيف عام, شركة علم, وظائف الرياض, فرص عمل",
            "author_name": "شركة علم (Elm)",
            "author_title": "إدارة استقطاب المواهب والتوظيف الوطني",
            "author_avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop",
            "author_username": "elm-careers",
        },
        # Company Campaign 2 (With Video)
        {
            "account_type": "company",
            "company_id": 1,
            "post_type": "hiring_specialized",
            "category": "استقطاب كفاءات",
            "title": "نبحث عن مهندسي ذكاء اصطناعي وبنية سحابية سيادية (LLMOps & Cloud Infrastructure)",
            "tagline": "فرص هندسية متقدمة في أرامكو الرقمية لبناء حلول الحوسبة الفائقة ونماذج الذكاء الاصطناعي الصناعية.",
            "description": """تستقطب أرامكو الرقمية نخبة المهندسين في تخصصات هندسة البيانات الضخمة، معماريات السحابة الهجينة، وهندسة نماذج الذكاء الاصطناعي (LLMOps).

نقدم حزمة مزايا استثنائية وبيئة عمل عالمية المستوى تركز على الأثر الصناعي الضخم والحلول السيادية.""",
            "banner_url": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=600&fit=crop",
            "media_type": "video",
            "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "cta_text": "تقديم السيرة الذاتية",
            "cta_url": "/jobs",
            "target_roles": "candidate",
            "target_skills": "LLMOps, Kubernetes, PyTorch, Cloud Architecture",
            "target_specializations": "الذكاء الاصطناعي وهندسة البرمجيات, الأمن السيبراني",
            "target_location": "الظهران / الرياض",
            "target_locations": "الرياض, المنطقة الشرقية (الدمام والخبر والأحساء)",
            "tags": "هندسة السحابة, أرامكو الرقمية, ذكاء اصطناعي, وظائف تخصصية",
            "author_name": "أرامكو الرقمية (Aramco Digital)",
            "author_title": "فريق توظيف الكفاءات الهندسية المتقدمة",
            "author_avatar": "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&h=150&fit=crop",
            "author_username": "aramco-digital-talent",
        },
        # Candidate Campaign 1
        {
            "account_type": "candidate",
            "customer_id": 1,
            "post_type": "portfolio_showcase",
            "category": "المشاريع والأعمال",
            "title": "استعراض مشروع: بناء محرك فحص وتنسيق تلقائي للسير الذاتية بالذكاء الاصطناعي (ATS Evaluator)",
            "tagline": "شاركت كود وهيكلية مشروعي: تطبيق مفتوح المصدر يحلل التوافق الدلالي للسيرة الذاتية مع الوظائف بدقة 94%.",
            "description": """مرحباً بمجتمع فائدة! كمهندس برمجيات شغوف بالذكاء الاصطناعي، صممت هذا المشروع لحل مشكلة الرفض العشوائي للسير الذاتية.

### المكدس التقني المستخدم:
- FastAPI مع PostgreSQL لتخزين المتجهات (pgvector).
- واجهة مستخدم سريعة باستخدام React 19 و TailwindCSS.
- نموذج استدلال محلي يعتمد على Sentence-Transformers.""",
            "banner_url": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop",
            "media_type": "image",
            "cta_text": "استعراض كود المشروع على GitHub",
            "cta_url": "https://github.com",
            "target_roles": "company",
            "target_skills": "Python, FastAPI, PyTorch, React, Vector Search",
            "target_specializations": "الذكاء الاصطناعي وهندسة البرمجيات",
            "target_location": "الرياض / عن بُعد",
            "target_locations": "جميع مناطق المملكة, عن بُعد (Remote)",
            "tags": "مشاريع, GitHub, مهندس برمجيات, مفتوح المصدر",
            "author_name": "محمد العتيبي",
            "author_title": "مطور Full-Stack ومهندس تعلم آلة",
            "author_avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
            "author_username": "mohammed-alotaibi",
        },
        # Candidate Campaign 2
        {
            "account_type": "candidate",
            "customer_id": 2,
            "post_type": "seeking_work",
            "category": "متاح للعمل",
            "title": "متاحة لفرص العمل: مهندسة أمن سيبراني واختبار اختراق معتمدة (OSCP, CEH) في الرياض أو عن بعد",
            "tagline": "بعد 4 سنوات من العمل على تأمين التطبيقات البنكية، أبحث عن تحدٍ جديد كمسؤولة أمن سيبراني.",
            "description": """أعلن عن جهوزيتي للانضمام إلى فريق عمل تقني متميز. أمتلك خبرة عملية في:
- إجراء اختبارات الاختراق الشاملة لتطبيقات الويب والموبايل وفق معايير OWASP.
- إعداد تقارير التدقيق الأمني والامتثال لأنظمة الهيئة الوطنية للأمن السيبراني (NCA).
- التعامل مع حوادث الاختراق والاستجابة الفورية للأزمات.""",
            "banner_url": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=600&fit=crop",
            "media_type": "image",
            "cta_text": "تحميل السيرة الذاتية والتواصل",
            "cta_url": "/candidate/profile",
            "target_roles": "company",
            "target_skills": "OSCP, CEH, Penetration Testing, Application Security",
            "target_specializations": "الأمن السيبراني",
            "target_location": "الرياض",
            "target_locations": "الرياض, عن بُعد (Remote)",
            "tags": "متاح للعمل, أمن سيبراني, OSCP, وظائف الرياض",
            "author_name": "ريناد الدوسري",
            "author_title": "مهندسة أمن معلومات واختبار اختراق معتمدة",
            "author_avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
            "author_username": "renad-aldawsari",
        }
    ]

    for s in seeds:
        cur.execute("""
        INSERT INTO campaigns (
            company_id, university_id, customer_id, account_type, post_type, category,
            title, tagline, description, banner_url, media_type, video_url, cta_text, cta_url,
            target_roles, target_skills, target_specializations, target_location, target_locations,
            tags, status, author_name, author_title, author_avatar, author_username, is_verified,
            created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        """, (
            s.get("company_id"), s.get("university_id"), s.get("customer_id"), s["account_type"], s["post_type"], s["category"],
            s["title"], s["tagline"], s["description"], s["banner_url"], s["media_type"], s.get("video_url"), s["cta_text"], s["cta_url"],
            s["target_roles"], s["target_skills"], s["target_specializations"], s["target_location"], s["target_locations"],
            s["tags"], s["author_name"], s["author_title"], s["author_avatar"], s["author_username"]
        ))
    
    con.commit()
    print(f"Successfully seeded {len(seeds)} dynamic campaigns!")

# Add a few sample likes, comments, and views
campaign_ids = [r[0] for r in cur.execute("SELECT id FROM campaigns").fetchall()]
if campaign_ids:
    first_cid = campaign_ids[0]
    # Check if likes exist
    likes_count = cur.execute("SELECT count(*) FROM campaign_likes WHERE campaign_id=?", (first_cid,)).fetchone()[0]
    if likes_count == 0:
        cur.execute("INSERT OR IGNORE INTO campaign_likes (campaign_id, user_type, user_id, user_name) VALUES (?, 'candidate', 1, 'عمر المنصور')", (first_cid,))
        cur.execute("INSERT OR IGNORE INTO campaign_likes (campaign_id, user_type, user_id, user_name) VALUES (?, 'company', 1, 'أرامكو الرقمية')", (first_cid,))
        
    comments_count = cur.execute("SELECT count(*) FROM campaign_comments WHERE campaign_id=?", (first_cid,)).fetchone()[0]
    if comments_count == 0:
        cur.execute("""
        INSERT INTO campaign_comments (campaign_id, user_type, user_id, author_name, author_avatar, author_title, author_username, content)
        VALUES (?, 'candidate', 1, 'عمر المنصور', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', 'مهندس برمجيات', 'omar-mansoor', 'مبادرة متميزة وبحث واعد جداً يخدم المنظومة التقنية في المملكة!')
        """, (first_cid,))
        comm_id = cur.lastrowid
        cur.execute("""
        INSERT INTO campaign_comments (campaign_id, user_type, user_id, author_name, author_avatar, author_title, author_username, content, parent_id)
        VALUES (?, 'university', 1, 'جامعة الملك فهد', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=150&h=150&fit=crop', 'مركز الأبحاث', 'kfupm-ai', 'شكراً لاهتمامك مهندس عمر، نسعد بتواصلك لمزيد من التعاون البحثي.', ?)
        """, (first_cid, comm_id))

    views_count = cur.execute("SELECT count(*) FROM campaign_views WHERE campaign_id=?", (first_cid,)).fetchone()[0]
    if views_count == 0:
        for i in range(15):
            cur.execute("INSERT INTO campaign_views (campaign_id, user_type, user_id) VALUES (?, 'candidate', ?)", (first_cid, (i % 10) + 1))

    # Add a sample notification
    notif_count = cur.execute("SELECT count(*) FROM notifications").fetchone()[0]
    if notif_count == 0:
        cur.execute("""
        INSERT INTO notifications (recipient_type, recipient_id, actor_type, actor_id, actor_name, actor_avatar, action_type, campaign_id, title, message, is_read)
        VALUES ('university', 1, 'candidate', 1, 'عمر المنصور', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', 'comment', ?, 'تعليق جديد على حملتك', 'علّق عمر المنصور على حملتك: مبادرة متميزة وبحث واعد...', 0)
        """, (first_cid,))
    
    con.commit()

con.close()
print("Migration and initial seeding completed successfully!")
