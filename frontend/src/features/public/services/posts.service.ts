/**
 * features/public/services/posts.service.ts
 *
 * Client HTTP service for Career Articles, Research, and Insights feed.
 * Includes complete fallback mock dataset segmented by Account Types
 * (University, Company, Candidate) and specific Post Types for resilient browsing.
 */
import { apiClient } from "@/lib/api-client"
import { API_CONFIG } from "@/config/api"
import type {
  PostsResponse,
  PostDetailResponse,
  PostArticle,
  CreatePostDTO,
  PostComment,
  AccountType,
  NotificationItem,
  CampaignAnalyticsData,
} from "../types/posts.types"

const FALLBACK_ARTICLES: PostArticle[] = [
  // ── University Posts ──────────────────────────────────────────────
  {
    id: 101,
    title: "ورقة بحثية: تحسين أداء نماذج معالجة اللغة الطبيعية للغة العربية في البيئات الصناعية",
    slug: "kfupm-arabic-nlp-research-paper-2026",
    summary:
      "نشرت جامعة الملك فهد للبترول والمعادن دراسة بحثية محكمة حول تقنيات تدريب النماذج اللغوية الضخمة على اللهجات والبيانات الهندسية بدقة فائقة.",
    content: `أعلن مركز أبحاث الذكاء الاصطناعي وهندسة البيانات في جامعة الملك فهد للبترول والمعادن (KFUPM) عن نشر ورقة بحثية جديدة في مؤتمر دولي مصنف Q1.

### أبرز محاور البحث:
1. معالجة التحديات الدلالية في استخلاص المصطلحات التقنية السعودية من الوثائق والعقود الصناعية.
2. خفض التكلفة الحسابية لعملية Fine-Tuning بنسبة 45% باستخدام خوارزميات الضغط الدلالي.
3. إتاحة النموذج الأولي والمفردات مفتوحة المصدر لدعم الباحثين والمطورين في المملكة.`,
    category: "الأبحاث والابتكار",
    accountType: "university",
    postType: "research_paper",
    tags: ["أبحاث", "ذكاء اصطناعي", "معالجة اللغة الطبيعية", "KFUPM"],
    coverImage:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=600&fit=crop",
    publishedAt: "2026-09-28T09:00:00Z",
    readTime: "6 دقائق قراءة",
    views: 4210,
    likes: 530,
    isLiked: false,
    author: {
      name: "جامعة الملك فهد للبترول والمعادن",
      title: "مركز التميز لأبحاث الذكاء الاصطناعي",
      avatar:
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=150&h=150&fit=crop",
      isVerified: true,
      username: "kfupm-ai-research",
      accountType: "university",
      organizationName: "KFUPM",
    },
    comments: [],
  },
  {
    id: 102,
    title: "ملتقى التوظيف السنوي وربط الخريجين 2026: بمشاركة أكثر من 85 شركة رائدة",
    slug: "ksu-annual-career-fair-2026",
    summary:
      "تنظم عمادة شؤون الطلاب ملتقى التوظيف والتدريب التعاوني لربط أكثر من 1,500 طالب وطالبة بمسؤولي التوظيف المباشر في كبرى الشركات الوطنية والدولية.",
    content: `يسر جامعة الملك سعود الإعلان عن انطلاق فعاليات "ملتقى التوظيف السنوي واليوم المهني 2026" في البهو الرئيسي للحرم الجامعي.

### مميزات الملتقى لهذا العام:
- مقابلات شخصية فورية للمرشحين المتفوقين في مجالات التقنية، الهندسة، وإدارة الأعمال.
- ورش عمل تفاعلية لبناء السير الذاتية وتجاوز اختبارات الجاهزية المهنية.
- منصة إلكترونية مشتركة بالتعاون مع منصة فائدة وظائف لتسليم السير الذاتية آلياً.`,
    category: "معارض التوظيف",
    accountType: "university",
    postType: "job_fair",
    tags: ["معارض التوظيف", "يوم المهنة", "جامعة الملك سعود", "تدريب تعاوني"],
    coverImage:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=600&fit=crop",
    publishedAt: "2026-09-26T11:30:00Z",
    readTime: "4 دقائق قراءة",
    views: 6120,
    likes: 870,
    isLiked: true,
    author: {
      name: "جامعة الملك سعود",
      title: "عمادة التطوير المهني وشؤون الخريجين",
      avatar:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=150&h=150&fit=crop",
      isVerified: true,
      username: "ksu-career",
      accountType: "university",
      organizationName: "King Saud University",
    },
    comments: [],
  },
  {
    id: 103,
    title: "إنجاز أكاديمي: تجديد الاعتماد الدولي الكامل ABET لكافة البرامج الهندسية والحاسوبية",
    slug: "pnu-abet-accreditation-milestone",
    summary:
      "حصدت الجامعة الاعتماد الأكاديمي الدولي المرموق تأكيداً على جودة المخرجات ومواءمة البرامج مع أحدث المعايير الصناعية العالمية.",
    content: `حققت كلية علوم الحاسب والمعلومات إنجازاً نوعياً بتجديد الاعتماد الأكاديمي الدولي الكامل من هيئة (ABET) الأمريكية لبرامج هندسة البرمجيات، الشبكات، والأمن السيبراني حتى عام 2032.

يعكس هذا الاعتماد التزام الجامعة بتخريج كفاءات وطنية تنافس بثقة في سوق العمل المحلي والدولي.`,
    category: "الإنجازات الأكاديمية",
    accountType: "university",
    postType: "achievement",
    tags: ["اعتماد أكاديمي", "ABET", "جودة التعليم", "جامعات سعودية"],
    coverImage:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=600&fit=crop",
    publishedAt: "2026-09-23T14:00:00Z",
    readTime: "3 دقائق قراءة",
    views: 2980,
    likes: 415,
    isLiked: false,
    author: {
      name: "جامعة الأميرة نورة",
      title: "وكالة الشؤون الأكاديمية وضمان الجودة",
      avatar:
        "https://images.unsplash.com/photo-1562774053-701939374585?w=150&h=150&fit=crop",
      isVerified: true,
      username: "pnu-official",
      accountType: "university",
      organizationName: "PNU",
    },
    comments: [],
  },
  {
    id: 104,
    title: "حاضنة الابتكار: تسجيل 12 براءة اختراع لطلاب الجامعة في إنترنت الأشياء والمدن الذكية",
    slug: "kau-tech-patents-innovation-incubator",
    summary:
      "مشاريع تخرج رائدة تتحول إلى شركات ناشئة واعدة مدعومة بحاضنة الأعمال الجامعية ومنظومة الابتكار والملكية الفكرية.",
    content: `أعلن مركز الابتكار وريادة الأعمال عن تسجيل 12 براءة اختراع جديدة لدى الهيئة السعودية للملكية الفكرية، شملت حلولاً لإدارة الطاقة الذكية والمستشعرات الطبية المحمولة المطورة بأيدي كوادر طلابية.`,
    category: "الابتكار والمشاريع",
    accountType: "university",
    postType: "innovation",
    tags: ["ابتكار", "براءات اختراع", "ريادة أعمال", "حاضنات تقنية"],
    coverImage:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=600&fit=crop",
    publishedAt: "2026-09-20T10:15:00Z",
    readTime: "5 دقائق قراءة",
    views: 3490,
    likes: 560,
    isLiked: false,
    author: {
      name: "جامعة الملك عبد العزيز",
      title: "مركز الابتكار وريادة الأعمال",
      avatar:
        "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=150&h=150&fit=crop",
      isVerified: true,
      username: "kau-innovation",
      accountType: "university",
      organizationName: "KAU",
    },
    comments: [],
  },
  {
    id: 105,
    title: "فريق طلابي يحصد المركز الأول في أولمبياد الروبوتات والأنظمة الذكية الدولية في طوكيو",
    slug: "iau-robotics-international-award-tokyo",
    summary:
      "تتويج عالمي للشباب السعودي بعد منافسة قوية مع أكثر من 40 جامعة دولية في تصميم وبرمجة المركبات الذاتية القيادة.",
    content: `حصد فريق كلية علوم الحاسب وتكنولوجيا المعلومات المركز الأول والميدالية الذهبية في بطولة طوكيو للروبوتات المستقلة، تقديراً لابتكارهم نظام ملاحة ذكي يتفادى العوائق في البيئات الوعرة بدقة متناهية.`,
    category: "جوائز وتكريم",
    accountType: "university",
    postType: "awards",
    tags: ["جوائز دولية", "روبوتات", "أولمبياد", "إنجاز سعودي"],
    coverImage:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=600&fit=crop",
    publishedAt: "2026-09-17T16:00:00Z",
    readTime: "4 دقائق قراءة",
    views: 5120,
    likes: 980,
    isLiked: true,
    author: {
      name: "جامعة الإمام عبد الرحمن بن فيصل",
      title: "عمادة البحث العلمي والابتكار",
      avatar:
        "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&h=150&fit=crop",
      isVerified: true,
      username: "iau-official",
      accountType: "university",
      organizationName: "IAU",
    },
    comments: [],
  },

  // ── Company Posts ─────────────────────────────────────────────────
  {
    id: 201,
    title: "حملة التوظيف الوطنية الشاملة: فتح باب التقديم لأكثر من 150 شاغراً وظيفياً في مختلف الفروع",
    slug: "elm-national-general-hiring-campaign-2026",
    summary:
      "تعلن شركة علم عن إطلاق حملة استقطاب عامة تستهدف حديثي التخرج وذوي الخبرة في مجالات التقنية، العمليات، والمبيعات الرقمية.",
    content: `ضمن خطتنا التوسعية لعام 2026، تسر شركة علم فتح باب التوظيف العام لاستقطاب أكثر من 150 كفاءة طموحة في مدن الرياض، جدة، والدمام.

نرحب بجميع التخصصات الشغوفة بالمساهمة في بناء المنصات الرقمية الوطنية وتطوير منظومة الخدمات الحكومية الذكية.`,
    category: "استقطاب كفاءات",
    accountType: "company",
    postType: "hiring_general",
    tags: ["توظيف عام", "شركة علم", "وظائف الرياض", "فرص عمل"],
    coverImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop",
    publishedAt: "2026-09-27T08:30:00Z",
    readTime: "4 دقائق قراءة",
    views: 7820,
    likes: 1240,
    isLiked: false,
    author: {
      name: "شركة علم (Elm)",
      title: "إدارة استقطاب المواهب والتوظيف الوطني",
      avatar:
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop",
      isVerified: true,
      username: "elm-careers",
      accountType: "company",
      organizationName: "Elm",
    },
    comments: [],
  },
  {
    id: 202,
    title: "نبحث عن مهندسي ذكاء اصطناعي وبنية سحابية سيادية (LLMOps & Cloud Infrastructure)",
    slug: "aramco-digital-specialized-ai-cloud-roles",
    summary:
      "فرص هندسية متقدمة في أرامكو الرقمية لبناء حلول الحوسبة الفائقة ونماذج الذكاء الاصطناعي الصناعية الكبرى.",
    content: `تستقطب أرامكو الرقمية نخبة المهندسين في تخصصات هندسة البيانات الضخمة، معماريات السحابة الهجينة، وهندسة نماذج الذكاء الاصطناعي (LLMOps).

نقدم حزمة مزايا استثنائية وبيئة عمل عالمية المستوى تركز على الأثر الصناعي الضخم والحلول السيادية.`,
    category: "استقطاب كفاءات",
    accountType: "company",
    postType: "hiring_specialized",
    tags: ["هندسة السحابة", "أرامكو الرقمية", "ذكاء اصطناعي", "وظائف تخصصية"],
    coverImage:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=600&fit=crop",
    publishedAt: "2026-09-25T13:00:00Z",
    readTime: "5 دقائق قراءة",
    views: 6540,
    likes: 980,
    isLiked: true,
    author: {
      name: "أرامكو الرقمية (Aramco Digital)",
      title: "فريق توظيف الكفاءات الهندسية المتقدمة",
      avatar:
        "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&h=150&fit=crop",
      isVerified: true,
      username: "aramco-digital-talent",
      accountType: "company",
      organizationName: "Aramco Digital",
    },
    comments: [],
  },
  {
    id: 203,
    title: "داخل ثقافة تابي: كيف نبني بيئة عمل مرنة تكافئ روح المبادرة والنمو السريع؟",
    slug: "tabby-workplace-culture-brand-image",
    summary:
      "نظرة حصرية على نمط العمل المرن، الدعم النفسي والمهني، والتمكين القيادي الذي يجعل من تابي الوجهة المفضلة للمبدعين.",
    content: `في تابي، نؤمن بأن أفضل المنتجات المالية تُبنى عندما يشعر كل موظف بالملكية الكاملة لقراراته وحرية التجربة السريعة دون خوف من الخطأ.

نشارككم فلسفتنا في إدارة الأداء المستمر وساعات العمل المرنة ومبادرات الصحة الذهنية.`,
    category: "بيئة وثقافة العمل",
    accountType: "company",
    postType: "brand_image",
    tags: ["ثقافة العمل", "تابي", "بيئة العمل", "المرونة الوظيفية"],
    coverImage:
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&h=600&fit=crop",
    publishedAt: "2026-09-22T15:45:00Z",
    readTime: "5 دقائق قراءة",
    views: 5210,
    likes: 840,
    isLiked: false,
    author: {
      name: "شركة تابي (Tabby)",
      title: "فريق ثقافة المنشأة وهوية صاحب العمل",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop",
      isVerified: true,
      username: "tabby-people",
      accountType: "company",
      organizationName: "Tabby",
    },
    comments: [],
  },
  {
    id: 204,
    title: "انضم إلى مجتمع المواهب المستقبلي: برنامج التدريب التعاوني والمتابعة المهنية المبكرة",
    slug: "thiqah-talent-community-early-careers",
    summary:
      "نفتح أبواب التسجيل في مجتمع المواهب الرقمي للطلاب والمطورين الواعدين للحصول على إرشاد مهني مباشر وفرص توظيف استباقية.",
    content: `تهدف مبادرة "مجتمع مواهب ثقة" إلى بناء جسور مستدامة مع الكفاءات الشابة قبل تخرجهم، من خلال جلسات توجيه تقنية وتحديات برمجية ومشاريع واقعية تؤهلهم للانضمام المباشر لفرقنا الهندسية.`,
    category: "قاعدة المواهب",
    accountType: "company",
    postType: "talent_pool",
    tags: ["مجتمع المواهب", "شركة ثقة", "تدريب وتأهيل", "الخريجين الجدد"],
    coverImage:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop",
    publishedAt: "2026-09-19T11:00:00Z",
    readTime: "4 دقائق قراءة",
    views: 4320,
    likes: 670,
    isLiked: false,
    author: {
      name: "شركة ثقة (Thiqah)",
      title: "برامج الكفاءات المبكرة وتطوير المواهب",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      isVerified: true,
      username: "thiqah-talent-pool",
      accountType: "company",
      organizationName: "Thiqah",
    },
    comments: [],
  },
  {
    id: 205,
    title: "لقاء مع رئيس هندسة البيانات: كيف نعالج ملايين المعاملات اللحظية بأعلى موثوقية؟",
    slug: "jahez-meet-the-team-data-engineering",
    summary:
      "سلسلة التعريف بقيادات وفرق جاهز: حوار صريح حول البنية التحتية البرمجية، التحديات التشغيلية، وروح الفريق في بيئة العمل السريعة.",
    content: `في هذه الحلقة من سلسلة "أبطال جاهز"، نجلس مع المهندس عبد الله الصالح ليحدثنا عن تجربة الفريق في التوسع اللحظي لخدمة أكثر من مليوني طلب يومياً ومفاتيح النجاح لأي مهندس ينضم لفرقنا.`,
    category: "فريق العمل والقيادات",
    accountType: "company",
    postType: "team_spotlight",
    tags: ["فريق العمل", "جاهز", "هندسة البيانات", "مقابلات القيادة"],
    coverImage:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop",
    publishedAt: "2026-09-16T14:20:00Z",
    readTime: "6 دقائق قراءة",
    views: 5910,
    likes: 910,
    isLiked: true,
    author: {
      name: "جاهز الدولية (Jahez)",
      title: "فريق الإعلام الرقمي والتواصل الداخلي",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      isVerified: true,
      username: "jahez-team-spotlight",
      accountType: "company",
      organizationName: "Jahez",
    },
    comments: [],
  },
  {
    id: 206,
    title: "إطلاق محرك التوصيل الذكي: خفض زمن مطابقة الشحنات بنسبة 65% بالاعتماد على الذكاء الاصطناعي",
    slug: "hungerstation-ai-matching-engine-innovation",
    summary:
      "إنجاز تقني بارز حققه مهندسو هنقرستيشن بتطوير خوارزمية ذكية لمطابقة الطلبات مع السائقين في أقل من 40 ميلي ثانية.",
    content: `يسر الفريق التقني في هنقرستيشن مشاركة تفاصيل إطلاق الجيل الجديد من محرك Dispatching المبني على خوارزميات التعلم المعزز (Reinforcement Learning)، والذي ساهم في تقليص زمن الانتظار وزيادة كفاءة الأسطول بشكل قياسي.`,
    category: "الابتكار والمشاريع",
    accountType: "company",
    postType: "company_innovation",
    tags: ["ابتكارات تقنية", "هنقرستيشن", "ذكاء اصطناعي", "خدمات لوجستية"],
    coverImage:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=600&fit=crop",
    publishedAt: "2026-09-14T10:00:00Z",
    readTime: "5 دقائق قراءة",
    views: 6340,
    likes: 1050,
    isLiked: false,
    author: {
      name: "هنقرستيشن (HungerStation)",
      title: "فريق التكنولوجيا والابتكار الرقمي",
      avatar:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop",
      isVerified: true,
      username: "hungerstation-tech",
      accountType: "company",
      organizationName: "HungerStation",
    },
    comments: [],
  },
  {
    id: 207,
    title: "رسالة في السيادة الرقمية: مستقبل البنية التحتية السحابية ومراكز البيانات الوطنية 2030",
    slug: "stc-cloud-sovereignty-thought-leadership",
    summary:
      "رؤية استراتيجية حول تمكين الاقتصاد الرقمي، توطين تقنيات السحابة المتقدمة، وحماية البيانات السيادية الحساسة في المنطقة.",
    content: `تستعرض مجموعة stc في هذا المقال التوجيهي ركائز التحول نحو الحوسبة السحابية فائقة الأمان، ودور مراكز البيانات المترابطة في جعل المملكة مركزاً رقمياً عالمياً يربط القارات الثلاث.`,
    category: "رؤية 2030",
    accountType: "company",
    postType: "thought_leadership",
    tags: ["سيادة رقمية", "stc", "حوسبة سحابية", "رؤية 2030"],
    coverImage:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop",
    publishedAt: "2026-09-12T09:15:00Z",
    readTime: "7 دقائق قراءة",
    views: 8420,
    likes: 1390,
    isLiked: false,
    author: {
      name: "مجموعة stc",
      title: "قطاع الاستراتيجية والتحول المؤسسي",
      avatar:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&h=150&fit=crop",
      isVerified: true,
      username: "stc-strategy",
      accountType: "company",
      organizationName: "stc Group",
    },
    comments: [],
  },

  // ── Job Seeker (Candidate) Posts ──────────────────────────────────
  {
    id: 301,
    title: "استعراض مشروع: بناء محرك فحص وتنسيق تلقائي للسير الذاتية بالذكاء الاصطناعي (ATS Evaluator)",
    slug: "candidate-portfolio-ats-evaluator-project",
    summary:
      "شاركت كود وهيكلية مشروع تخرجي: تطبيق مفتوح المصدر يحلل التوافق الدلالي للسيرة الذاتية مع إعلانات التوظيف بدقة 94%.",
    content: `مرحباً بمجتمع فائدة! كمهندس برمجيات شغوف بالذكاء الاصطناعي، صممت هذا المشروع لحل مشكلة الرفض العشوائي للسير الذاتية.

### المكدس التقني المستخدم:
- FastAPI مع PostgreSQL لتخزين المتجهات (pgvector).
- واجهة مستخدم سريعة باستخدام React 19 ও TailwindCSS.
- نموذج استدلال محلي يعتمد على Sentence-Transformers.`,
    category: "المشاريع والأعمال",
    accountType: "candidate",
    postType: "portfolio_showcase",
    tags: ["مشاريع", "GitHub", "مهندس برمجيات", "مفتوح المصدر"],
    coverImage:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop",
    publishedAt: "2026-09-24T12:00:00Z",
    readTime: "5 دقائق قراءة",
    views: 3280,
    likes: 470,
    isLiked: false,
    author: {
      name: "محمد العتيبي",
      title: "مطور Full-Stack ومهندس تعلم آلة",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
      isVerified: true,
      username: "mohammed-alotaibi",
      accountType: "candidate",
    },
    comments: [],
  },
  {
    id: 302,
    title: "متاحة لفرص العمل: مهندسة أمن سيبراني واختبار اختراق معتمدة (OSCP, CEH) في الرياض أو عن بعد",
    slug: "candidate-open-to-work-cybersecurity-engineer",
    summary:
      "بعد 4 سنوات من العمل على تأمين التطبيقات البنكية واختبار الاختراق، أبحث عن تحدٍ جديد كمسؤولة أمن سيبراني أو قائدة فريق Red Team.",
    content: `أعلن عن جهوزيتي للانضمام إلى فريق عمل تقني متميز. أمتلك خبرة عملية في:
- إجراء اختبارات الاختراق الشاملة لتطبيقات الويب والموبايل وفق معايير OWASP.
- إعداد تقارير التدقيق الأمني والامتثال لأنظمة الهيئة الوطنية للأمن السيبراني (NCA).
- التعامل مع حوادث الاختراق والاستجابة الفورية للأزمات.`,
    category: "متاح للعمل",
    accountType: "candidate",
    postType: "seeking_work",
    tags: ["متاح للعمل", "أمن سيبراني", "OSCP", "وظائف الرياض"],
    coverImage:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=600&fit=crop",
    publishedAt: "2026-09-21T16:30:00Z",
    readTime: "3 دقائق قراءة",
    views: 4820,
    likes: 730,
    isLiked: true,
    author: {
      name: "ريناد الدوسري",
      title: "مهندسة أمن معلومات واختبار اختراق معتمدة",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      isVerified: true,
      username: "renad-aldawsari",
      accountType: "candidate",
    },
    comments: [],
  },
  {
    id: 303,
    title: "رحلتي لاجتياز شهادة AWS Solutions Architect Professional في 90 يوماً: الخطة والمصادر المجانية",
    slug: "candidate-aws-sap-certification-journey",
    summary:
      "توثيق شامل لخطة المذاكرة، الاختبارات التجريبية، والنصائح العملية التي ساعدتني في الحصول على واحدة من أصعب شهادات الحوسبة السحابية.",
    content: `يسرني مشاركة تجربتي الناجحة في اجتياز امتحان AWS SAP-C02. قمت بتقسيم المذاكرة إلى 3 مراحل:
1. فهم المعماريات المعقدة وتصميم الحلول متعددة الحسابات (AWS Organizations).
2. استراتيجيات ترحيل قواعد البيانات الضخمة دون توقف العمليات.
3. حل أكثر من 500 سؤال واقعي لتثبيت المفاهيم والتوقيت الزمني.`,
    category: "الشهادات المهنية",
    accountType: "candidate",
    postType: "certifications",
    tags: ["شهادات مهنية", "AWS", "حوسبة سحابية", "تطوير الذات"],
    coverImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=600&fit=crop",
    publishedAt: "2026-09-18T14:10:00Z",
    readTime: "6 دقائق قراءة",
    views: 3950,
    likes: 610,
    isLiked: false,
    author: {
      name: "سلطان الحربي",
      title: "مهندس بنية سحابية معتمد",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      isVerified: true,
      username: "sultan-alharbi",
      accountType: "candidate",
    },
    comments: [],
  },
  {
    id: 304,
    title: "دليلك الشامل لاجتياز أنظمة الفرز الذكي (ATS) والوصول إلى المقابلات الشخصية",
    slug: "ats-resume-optimization-guide-2026",
    summary:
      "كيف تصيغ سيرتك الذاتية بلغة تفهمها خوارزميات الذكاء الاصطناعي ومسؤولو التوظيف في السوق السعودي؟ 5 استراتيجيات عملية معتمدة.",
    content: `تعتمد اليوم أكثر من 85% من كبرى الشركات السعودية والدولية على أنظمة التتبع الآلي للمرشحين (ATS). وظيفة هذه الأنظمة هي فلترة مئات السير الذاتية وفرزها تلقائياً قبل أن تصل إلى عين مسؤول الموارد البشرية.
ابتعد عن التنسيقات المعقدة واحرص على الصياغة الرقمية الدقيقة بنموذج STAR.`,
    category: "السير الذاتية وATS",
    accountType: "candidate",
    postType: "career_tips",
    tags: ["ATS", "السيرة الذاتية", "التوظيف", "الذكاء الاصطناعي"],
    coverImage:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=600&fit=crop",
    publishedAt: "2026-09-15T10:00:00Z",
    readTime: "5 دقائق قراءة",
    views: 4120,
    likes: 580,
    isLiked: false,
    author: {
      name: "أحمد الفارسي",
      title: "خبير استقطاب المواهب التقنية | مستشار مهني",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
      isVerified: true,
      username: "ahmed-alfarsi",
      accountType: "candidate",
    },
    comments: [],
  },
]

class PostsService {
  private localArticles = [...FALLBACK_ARTICLES]

  async getPosts(params?: {
    search?: string
    category?: string
    accountType?: AccountType
    postType?: string
    targetAudienceRole?: string
    sort?: string
    page?: number
    pageSize?: number
  }): Promise<PostsResponse> {
    try {
      const { data } = await apiClient.get<PostsResponse>(API_CONFIG.ENDPOINTS.POSTS.LIST, {
        params: {
          search: params?.search,
          category: params?.category,
          account_type: params?.accountType,
          post_type: params?.postType,
          target_audience_role: params?.targetAudienceRole,
          sort: params?.sort,
          page: params?.page,
          pageSize: params?.pageSize,
        },
      })
      return data
    } catch {
      // Local fallback
      let list = [...this.localArticles]
      const cat = params?.category
      const acc = params?.accountType
      const pt = params?.postType
      const targetRole = params?.targetAudienceRole
      const q = params?.search?.toLowerCase().trim()

      if (acc && acc !== "all") {
        list = list.filter((p) => p.accountType === acc)
      }

      if (pt && pt !== "all") {
        list = list.filter((p) => p.postType === pt)
      }

      if (targetRole && targetRole !== "all") {
        list = list.filter((p) => {
          if (!p.targetAudience?.roles || p.targetAudience.roles.length === 0) return true
          return p.targetAudience.roles.includes(targetRole as any)
        })
      }

      if (cat && cat !== "all" && cat !== "الكل") {
        list = list.filter((p) => p.category === cat || p.tags.includes(cat))
      }

      if (q) {
        list = list.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.summary.toLowerCase().includes(q) ||
            p.author.name.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q))
        )
      }

      if (params?.sort === "popular") {
        list.sort((a, b) => b.views - a.views)
      } else if (params?.sort === "likes") {
        list.sort((a, b) => b.likes - a.likes)
      } else {
        list.sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        )
      }

      const page = params?.page || 1
      const pageSize = params?.pageSize || 12
      const start = (page - 1) * pageSize
      const paged = list.slice(start, start + pageSize)

      return {
        posts: paged,
        total: list.length,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(list.length / pageSize)),
        categories: [
          { name: "الكل", key: "all", count: this.localArticles.length },
          {
            name: "الأبحاث والابتكار",
            key: "الأبحاث والابتكار",
            count: this.localArticles.filter((p) => p.category === "الأبحاث والابتكار").length,
          },
          {
            name: "معارض التوظيف",
            key: "معارض التوظيف",
            count: this.localArticles.filter((p) => p.category === "معارض التوظيف").length,
          },
          {
            name: "استقطاب كفاءات",
            key: "استقطاب كفاءات",
            count: this.localArticles.filter((p) => p.category === "استقطاب كفاءات").length,
          },
          {
            name: "بيئة وثقافة العمل",
            key: "بيئة وثقافة العمل",
            count: this.localArticles.filter((p) => p.category === "بيئة وثقافة العمل").length,
          },
          {
            name: "المشاريع والأعمال",
            key: "المشاريع والأعمال",
            count: this.localArticles.filter((p) => p.category === "المشاريع والأعمال").length,
          },
          {
            name: "السير الذاتية وATS",
            key: "السير الذاتية وATS",
            count: this.localArticles.filter((p) => p.category === "السير الذاتية وATS").length,
          },
        ],
        trendingTopics: [
          { id: 1, title: "#SaudiVision2030", posts: "45.2K", category: "رؤية 2030" },
          { id: 2, title: "#University_Job_Fairs", posts: "34.1K", category: "معارض التوظيف" },
          { id: 3, title: "#Aramco_AI_Recruitment", posts: "28.4K", category: "استقطاب كفاءات" },
          { id: 4, title: "#ATS_Optimization", posts: "22.6K", category: "السير الذاتية وATS" },
          { id: 5, title: "#Tech_Innovations_2026", posts: "19.8K", category: "الابتكار والمشاريع" },
        ],
        suggestedAuthors: [
          {
            name: "جامعة الملك فهد (KFUPM)",
            title: "مركز التميز لأبحاث الذكاء الاصطناعي",
            avatar:
              "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=100&h=100&fit=crop",
            username: "kfupm-ai-research",
            articlesCount: 18,
            isVerified: true,
            accountType: "university",
          },
          {
            name: "شركة علم (Elm)",
            title: "إدارة استقطاب المواهب الوطنية",
            avatar:
              "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop",
            username: "elm-careers",
            articlesCount: 24,
            isVerified: true,
            accountType: "company",
          },
          {
            name: "أحمد الفارسي",
            title: "خبير استقطاب المواهب التقنية",
            avatar:
              "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
            username: "ahmed-alfarsi",
            articlesCount: 14,
            isVerified: true,
            accountType: "candidate",
          },
        ],
      }
    }
  }

  async getPostById(id: number | string): Promise<PostDetailResponse> {
    try {
      const { data } = await apiClient.get<PostDetailResponse>(
        API_CONFIG.ENDPOINTS.POSTS.DETAIL(id)
      )
      return data
    } catch {
      const numericId = Number(id)
      const post = this.localArticles.find((p) => p.id === numericId)
      if (!post) {
        throw new Error("Post not found")
      }
      const related = this.localArticles
        .filter((p) => p.id !== numericId && (p.accountType === post.accountType || p.category === post.category))
        .slice(0, 3)

      return { post, related }
    }
  }

  async getPostDetail(id: number | string): Promise<PostDetailResponse> {
    return this.getPostById(id)
  }

  async createPost(dto: CreatePostDTO): Promise<{ success: boolean; post: PostArticle }> {
    try {
      const { data } = await apiClient.post<{ success: boolean; post: PostArticle }>(
        API_CONFIG.ENDPOINTS.POSTS.CREATE,
        dto
      )
      return data
    } catch {
      const newId = Math.max(...this.localArticles.map((p) => p.id), 0) + 1
      const accountType = dto.accountType || "candidate"
      const defaultPostType =
        accountType === "university"
          ? "research_paper"
          : accountType === "company"
          ? "hiring_general"
          : "career_tips"

      const created: PostArticle = {
        id: newId,
        title: dto.title,
        slug: `post-${newId}`,
        summary: dto.summary || dto.content.slice(0, 140) + "...",
        content: dto.content,
        category: dto.category || "التطوير المهني",
        accountType,
        postType: dto.postType || defaultPostType,
        tags: dto.tags || [dto.category || "عام"],
        coverImage:
          dto.coverImage ||
          "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=600&fit=crop",
        mediaType: dto.mediaType || "image",
        videoUrl: dto.videoUrl,
        ctaText: dto.ctaText,
        ctaUrl: dto.ctaUrl,
        targetAudience: dto.targetAudience || {
          roles: accountType === "university" ? ["candidate", "company"] : accountType === "company" ? ["candidate"] : ["company"],
          targetSpecializations: ["الكل"],
          targetLocations: ["جميع مناطق المملكة"]
        },
        publishedAt: new Date().toISOString(),
        readTime: `${Math.max(2, Math.round(dto.content.split(/\s+/).length / 150))} دقائق قراءة`,
        views: 1,
        likes: 0,
        isLiked: false,
        author: {
          name: dto.authorName || (accountType === "university" ? "جامعة الملك سعود" : accountType === "company" ? "شركة وطنية" : "كاتب متميز"),
          title: dto.authorTitle || (accountType === "university" ? "شؤون الأبحاث والطلاب" : accountType === "company" ? "إدارة التوظيف" : "عضو مجتمع فائدة"),
          avatar:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
          isVerified: true,
          username: dto.authorUsername || `user-${accountType}`,
          accountType,
        },
        comments: [],
        // budget fallback for offline
        budget: dto.budgetType ? {
          budgetType: dto.budgetType,
          totalBudget: dto.totalBudget ?? null,
          dailyBudget: dto.dailyBudget ?? null,
          currency: dto.currency || "SAR",
          durationDays: dto.durationDays ?? null,
        } : undefined,
        proposedReach: {
          isEstimate: true,
          label: "الوصول المقدر (تقديري)",
          min: null,
          max: null,
        },
      }
      this.localArticles.unshift(created)
      return { success: true, post: created }
    }
  }

  async toggleLike(id: number | string): Promise<{ success: boolean; likes: number; isLiked: boolean }> {
    try {
      const { data } = await apiClient.post<{ success: boolean; likes: number; isLiked: boolean }>(
        API_CONFIG.ENDPOINTS.POSTS.LIKE(id)
      )
      return data
    } catch {
      const post = this.localArticles.find((p) => p.id === Number(id))
      if (post) {
        post.isLiked = !post.isLiked
        post.likes = post.isLiked ? post.likes + 1 : Math.max(0, post.likes - 1)
        return { success: true, likes: post.likes, isLiked: post.isLiked }
      }
      return { success: true, likes: 1, isLiked: true }
    }
  }

  async addComment(
    id: number | string,
    text: string,
    authorOrParent?: string | number | null,
    parentIdOrAuthor?: number | string | null
  ): Promise<{ success: boolean; comment: PostComment; commentsCount: number }> {
    let parentId: number | null = null
    let author = "زائر مهتم"

    if (typeof authorOrParent === "number") {
      parentId = authorOrParent
      if (typeof parentIdOrAuthor === "string") author = parentIdOrAuthor
    } else if (typeof authorOrParent === "string") {
      author = authorOrParent
      if (typeof parentIdOrAuthor === "number") parentId = parentIdOrAuthor
    }

    try {
      const { data } = await apiClient.post<{
        success: boolean
        comment: PostComment
        commentsCount: number
      }>(API_CONFIG.ENDPOINTS.POSTS.COMMENTS(id), { text, parent_id: parentId, author })
      return data
    } catch {
      const post = this.localArticles.find((p) => p.id === Number(id))
      const newComment: PostComment = {
        id: (post?.comments?.length || 0) + 1,
        author,
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
        text,
        content: text,
        time: "الآن",
        parentId: parentId || null,
        isOwner: true,
        replies: []
      }
      if (post) {
        if (!post.comments) post.comments = []
        if (parentId) {
          const parent = post.comments.find(c => c.id === parentId)
          if (parent) {
            if (!parent.replies) parent.replies = []
            parent.replies.push(newComment)
          } else {
            post.comments.push(newComment)
          }
        } else {
          post.comments.push(newComment)
        }
      }
      return {
        success: true,
        comment: newComment,
        commentsCount: post?.comments?.length || 1,
      }
    }
  }

  async editComment(
    commentId: number | string,
    text: string
  ): Promise<{ success: boolean; comment: PostComment }> {
    const { data } = await apiClient.put<{ success: boolean; comment: PostComment }>(
      API_CONFIG.ENDPOINTS.POSTS.COMMENT_EDIT(commentId),
      { text }
    )
    return data
  }

  async deleteComment(
    commentId: number | string
  ): Promise<{ success: boolean; message: string; commentsCount: number }> {
    const { data } = await apiClient.delete<{ success: boolean; message: string; commentsCount: number }>(
      API_CONFIG.ENDPOINTS.POSTS.COMMENT_DELETE(commentId)
    )
    return data
  }

  async shareCampaign(
    id: number | string,
    quote?: string
  ): Promise<{ success: boolean; sharesCount: number; share: any }> {
    const { data } = await apiClient.post<{ success: boolean; sharesCount: number; share: any }>(
      API_CONFIG.ENDPOINTS.POSTS.SHARE(id),
      { quote }
    )
    return data
  }

  async toggleSave(
    id: number | string
  ): Promise<{ success: boolean; isSaved: boolean; savesCount: number }> {
    const { data } = await apiClient.post<{ success: boolean; isSaved: boolean; savesCount: number }>(
      API_CONFIG.ENDPOINTS.POSTS.SAVE(id)
    )
    return data
  }

  async getSavedPosts(): Promise<{ posts: PostArticle[]; total: number }> {
    const { data } = await apiClient.get<{ posts: PostArticle[]; total: number }>(
      API_CONFIG.ENDPOINTS.POSTS.SAVED
    )
    return data
  }

  async getCampaignAnalytics(
    id: number | string
  ): Promise<{ success: boolean; analytics: CampaignAnalyticsData }> {
    const { data } = await apiClient.get<{ success: boolean; analytics: CampaignAnalyticsData }>(
      API_CONFIG.ENDPOINTS.POSTS.ANALYTICS(id)
    )
    return data
  }

  async getUserPublishedCampaigns(
    userType?: string,
    userId?: number | string
  ): Promise<{ success: boolean; campaigns: PostArticle[]; total: number }> {
    const { data } = await apiClient.get<{ success: boolean; campaigns: PostArticle[]; total: number }>(
      API_CONFIG.ENDPOINTS.POSTS.BY_USER,
      { params: { user_type: userType, user_id: userId } }
    )
    return data
  }

  async getNotifications(): Promise<{ success: boolean; notifications: NotificationItem[]; unreadCount: number }> {
    const { data } = await apiClient.get<{ success: boolean; notifications: NotificationItem[]; unreadCount: number }>(
      API_CONFIG.ENDPOINTS.NOTIFICATIONS.LIST
    )
    return data
  }

  async markNotificationRead(id: number | string): Promise<{ success: boolean }> {
    const { data } = await apiClient.patch<{ success: boolean }>(
      API_CONFIG.ENDPOINTS.NOTIFICATIONS.READ(id)
    )
    return data
  }

  async markAllNotificationsRead(): Promise<{ success: boolean }> {
    const { data } = await apiClient.post<{ success: boolean }>(
      API_CONFIG.ENDPOINTS.NOTIFICATIONS.READ_ALL
    )
    return data
  }
}

export const postsService = new PostsService()
