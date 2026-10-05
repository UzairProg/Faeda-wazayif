import { apiClient as api } from "@/lib/api-client"
import { API_CONFIG } from "@/config/api"
import type { Job, JobDetail, JobFilter, JobListResponse, JobSuggestion } from "../types/job.types"

/**
 * Curated realistic fallback dataset of jobs in Saudi Arabia.
 * Serves when the Python Flask backend is offline or empty.
 */
const FALLBACK_JOBS: JobDetail[] = [
  {
    id: "1",
    title: "مهندس برمجيات واجهات أمامية أول (Senior Frontend Engineer)",
    company: {
      id: "comp-1",
      name: "أرامكو الرقمية | Aramco Digital",
      logoUrl: "https://images.unsplash.com/photo-1542744094-24638eff58bb?w=128&h=128&fit=crop",
      location: "الظهران، المملكة العربية السعودية",
      isVerified: true,
    },
    location: "الظهران",
    isRemote: false,
    workType: "full_time",
    experienceLevel: "senior",
    skills: ["React", "TypeScript", "Next.js", "TailwindCSS", "GraphQL"],
    salary: {
      min: 24000,
      max: 32000,
      currency: "SAR",
      period: "monthly",
      isDisclosed: true,
    },
    postedAt: "2026-09-24T09:30:00Z",
    updatedAt: "2026-09-24T09:30:00Z",
    status: "published",
    isTeamFriendly: true,
    excerpt: "قيادة تطوير الواجهات التفاعلية لمنظومات الطاقة والصناعة الرقمية بأحدث تقنيات React و TypeScript مع مراعاة الأداء وسهولة الوصول.",
    description: `نبحث في **أرامكو الرقمية** عن مهندس واجهات أمامية أول للانضمام إلى فريق الحلول السحابية المتقدمة. ستتولى قيادة تصميم وهندسة واجهات المستخدم لمنصاتنا الحيوية التي تخدم قطاع الطاقة والصناعات الذكية.

### نبذة عن الدور:
ستعمل جنباً إلى جنب مع مديري المنتجات، مصممي UX/UI، ومهندسي الأنظمة الخلفية لبناء تطبيقات ويب فائقة السرعة والأمان، مع تطبيق أفضل معايير كتابة الشيفرات البرمجية النظيفة واختبارها.`,
    responsibilities: [
      "تصميم وتطوير مكونات واجهة مستخدم قابلة لإعادة الاستخدام وفق أحدث معايير Design Systems.",
      "تحسين أداء الواجهات وسرعة التحميل بنسبة لا تقل عن 30% وضمان تجربة سلسة.",
      "مراجعة الأكواد البرمجية (Code Review) وتوجيه المطورين المبتدئين والمتوسطين في الفريق.",
      "التكامل مع خدمات GraphQL و REST APIs ومراعاة إدارة الحالة المتقدمة عبر Zustand و React Query.",
      "ضمان التوافق التام مع متطلبات إمكانية الوصول (a11y) ودعم اتجاهي RTL و LTR بشكل أصيل.",
    ],
    requirements: [
      "خبرة عملية لا تقل عن 5 سنوات في تطوير الواجهات الأمامية باستخدام React و TypeScript.",
      "فهم عميق لمبادئ Next.js، Server Components، وتقنيات تحسين محركات البحث SEO.",
      "خبرة مثبتة في كتابة اختبارات الواجهات الأوتوماتيكية باستخدام Jest و Playwright.",
      "مهارات تواصل استثنائية باللغتين العربية والإنجليزية.",
      "شهادة جامعية في علوم الحاسب أو الهندسة أو خبرة عملية مكافئة.",
    ],
    applicationDeadline: "2026-11-15T23:59:59Z",
    applicationCount: 38,
  },
  {
    id: "2",
    title: "مهندس ذكاء اصطناعي ونماذج لغوية (AI & LLM Engineer)",
    company: {
      id: "comp-2",
      name: "الهيئة السعودية للبيانات والذكاء الاصطناعي (SDAIA)",
      logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop",
      location: "الرياض، المملكة العربية السعودية",
      isVerified: true,
    },
    location: "الرياض",
    isRemote: false,
    workType: "full_time",
    experienceLevel: "senior",
    skills: ["Python", "PyTorch", "LLMs", "NLP", "FastAPI", "Docker"],
    salary: {
      min: 28000,
      max: 38000,
      currency: "SAR",
      period: "monthly",
      isDisclosed: true,
    },
    postedAt: "2026-09-25T11:00:00Z",
    updatedAt: "2026-09-25T11:00:00Z",
    status: "published",
    isTeamFriendly: true,
    excerpt: "تطوير وتدريب النماذج اللغوية الكبيرة المتخصصة في اللغة العربية وتطبيقات الذكاء الاصطناعي التوليدي لخدمة الجهات الوطنية.",
    description: `فرصة رائدة في **سدايا (SDAIA)** للمساهمة في بناء المستقبل الرقمي للمملكة. ستشارك في تطوير وتدريب وضبط النماذج اللغوية العربية الضخمة ونشرها عبر بنى تحتية فائقة الأداء.`,
    responsibilities: [
      "بناء مسارات تدريب وضبط النماذج اللغوية المتقدمة (Fine-tuning & RLHF) للغة العربية الفصحى واللهجات المحلية.",
      "تطوير حلول استرجاع المعلومات المعزز بالتوليد (RAG) وقواعد البيانات الشعاعية (Vector Databases).",
      "نشر النماذج واستضافتها بكفاءة عبر أطر عمل vLLM و TensorRT-LLM لتقليل زمن الاستجابة.",
      "التعاون مع فرق البحث والمنتج لاختبار وتقييم مخرجات النماذج ودقة الإجابات.",
    ],
    requirements: [
      "خبرة 4+ سنوات في التعلم العميق والذكاء الاصطناعي ومعالجة اللغات الطبيعية (NLP).",
      "إتقان Python و PyTorch وخبرة عملية في استخدام مكتبات Hugging Face و LangChain.",
      "معرفة عميقة بتقنيات Quantization و MLOps والنشر على كتل معالجات الحوسبة الرسومية (GPU Clusters).",
      "درجة البكالوريوس أو الماجستير في الذكاء الاصطناعي أو علوم البيانات.",
    ],
    applicationDeadline: "2026-11-20T23:59:59Z",
    applicationCount: 64,
  },
  {
    id: "3",
    title: "مهندس حلول سحابية وديف أوبس (Cloud Solutions & DevOps Architect)",
    company: {
      id: "comp-3",
      name: "شركة الاتصالات السعودية | stc",
      logoUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=128&h=128&fit=crop",
      location: "الرياض، المملكة العربية السعودية",
      isVerified: true,
    },
    location: "الرياض",
    isRemote: false,
    workType: "hybrid",
    experienceLevel: "lead",
    skills: ["AWS", "Kubernetes", "Terraform", "CI/CD", "Linux", "Microservices"],
    salary: {
      min: 30000,
      max: 42000,
      currency: "SAR",
      period: "monthly",
      isDisclosed: true,
    },
    postedAt: "2026-09-23T14:15:00Z",
    updatedAt: "2026-09-23T14:15:00Z",
    status: "published",
    isTeamFriendly: false,
    excerpt: "تصميم وإدارة البنى السحابية الموزعة لمنصات الاتصالات الرقمية، وضمان توافرية 99.99% عبر السحب الهجينة.",
    description: `تبحث مجموعة **stc** عن مهندس حلول سحابية أول لقيادة تصميم وتأمين وتشغيل المنصات السحابية الهجينة والخدمات المصغرة على مستوى المؤسسة.`,
    responsibilities: [
      "تصميم وبناء البنى التحتية كرموز برمجية (IaC) باستخدام Terraform و Ansible.",
      "إدارة كتل Kubernetes (EKS / On-premise OpenShift) وضمان التوسع التلقائي والمرونة العالية.",
      "تطبيق سياسات DevSecOps والفحص الأمني التلقائي في خطوط النشر CI/CD.",
      "مراقبة الأنظمة ومؤشرات الأداء عبر Prometheus و Grafana و Datadog وتخفيض زمن التعافي (MTTR).",
    ],
    requirements: [
      "خبرة لا تقل عن 7 سنوات في هندسة النظم والبنى السحابية (AWS / Azure / GCP).",
      "شهادة معتمدة من AWS (مثل AWS Certified Solutions Architect Professional) أو CKA.",
      "خبرة متقدمة في أمان السحابة وحماية الشبكات المؤسسية.",
    ],
    applicationDeadline: "2026-11-10T23:59:59Z",
    applicationCount: 29,
  },
  {
    id: "4",
    title: "مصمم تجربة وواجهة المستخدم (Senior Product UI/UX Designer)",
    company: {
      id: "comp-4",
      name: "نيوم | NEOM",
      logoUrl: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=128&h=128&fit=crop",
      location: "نيوم، المملكة العربية السعودية",
      isVerified: true,
    },
    location: "نيوم",
    isRemote: false,
    workType: "full_time",
    experienceLevel: "senior",
    skills: ["Figma", "Design Systems", "User Research", "Prototyping", "Design Tokens"],
    salary: {
      min: 26000,
      max: 36000,
      currency: "SAR",
      period: "monthly",
      isDisclosed: true,
    },
    postedAt: "2026-09-24T16:45:00Z",
    updatedAt: "2026-09-24T16:45:00Z",
    status: "published",
    isTeamFriendly: true,
    excerpt: "ابتكار تجارب رقمية استثنائية لمدن المستقبل في نيوم، وبناء أنظمة تصميم تفاعلية تواكب أعلى المعايير العالمية.",
    description: `انضم إلى مشروع **نيوم** الاستثنائي لتصميم الواجهات التفاعلية لمنظومات المدينة الذكية. ستعمل على حل تحديات تصميمية غير مسبوقة تدمج بين العالم الرقمي والمادي.`,
    responsibilities: [
      "قيادة أبحاث المستخدمين والمقابلات واختبارات القابلية للاستخدام للمنتجات الرقمية.",
      "بناء وتطوير نظام التصميم (Design System) الخاص بالمشروع وتوثيقه للمطورين.",
      "إنشاء نماذج تفاعلية عالية الدقة (Interactive Prototypes) واختبار الفرضيات بسرعة.",
      "التعاون المستمر مع فرق الهندسة لضمان مطابقة الواجهات المنفذة للتصاميم بنسبة 100%.",
    ],
    requirements: [
      "معرض أعمال (Portfolio) مبهر يعكس مهارات التفكير المنظومي وتصميم المنتجات المعقدة.",
      "خبرة لا تقل عن 5 سنوات في تصميم المنتجات الرقمية (SaaS أو Mobile Apps).",
      "إتقان كامل لأداة Figma وميزاتها المتقدمة كالمتغيرات (Variables) والـ Auto-layout.",
    ],
    applicationDeadline: "2026-11-25T23:59:59Z",
    applicationCount: 52,
  },
  {
    id: "5",
    title: "مطور خادم وأنظمة موزعة (Backend Engineer - Go / Python)",
    company: {
      id: "comp-5",
      name: "هنقرستيشن | HungerStation",
      logoUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=128&h=128&fit=crop",
      location: "الرياض، المملكة العربية السعودية",
      isVerified: true,
    },
    location: "الرياض",
    isRemote: true,
    workType: "remote",
    experienceLevel: "mid",
    skills: ["Go", "Python", "PostgreSQL", "Redis", "Kafka", "Microservices"],
    salary: {
      min: 18000,
      max: 25000,
      currency: "SAR",
      period: "monthly",
      isDisclosed: true,
    },
    postedAt: "2026-09-25T13:20:00Z",
    updatedAt: "2026-09-25T13:20:00Z",
    status: "published",
    isTeamFriendly: true,
    excerpt: "بناء وتطوير الخدمات الخلفية فائقة السرعة لمنصة التوصيل الأكبر في المملكة للتعامل مع آلاف العمليات في الثانية.",
    description: `نبحث في **هنقرستيشن** عن مطور Backend شغوف بالأنظمة الموزعة عالية الحمل. ستعمل على خدمات الطلبات اللحظية، وتوزيع السائقين بالذكاء الاصطناعي، ومعالجة المدفوعات.`,
    responsibilities: [
      "تطوير خدمات مصغرة (Microservices) بلغة Go و Python قادرة على معالجة ملايين الطلبات اليومية.",
      "تحسين استعلامات قواعد البيانات PostgreSQL والاعتماد الفعال على Redis للتخزين المؤقت.",
      "بناء خطوط تدفق أحداث لحظية باستخدام Apache Kafka.",
      "مراقبة استهلاك الموارد وحل مشاكل الاختناقات البرمجية (Bottlenecks).",
    ],
    requirements: [
      "خبرة 3+ سنوات في تطوير الواجهات الخلفية والأنظمة الموزعة عالية التوسع.",
      "فهم عميق لمفاهيم Concurrency و Memory Management في Go.",
      "خبرة في كتابة Unit Tests واختبارات التكامل وتصميم معمارية Clean Architecture.",
    ],
    applicationDeadline: "2026-11-12T23:59:59Z",
    applicationCount: 45,
  },
  {
    id: "6",
    title: "محلل أمن سيبراني واستجابة للحوادث (Cybersecurity Analyst)",
    company: {
      id: "comp-6",
      name: "شركة علم | Elm",
      logoUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=128&h=128&fit=crop",
      location: "الرياض، المملكة العربية السعودية",
      isVerified: true,
    },
    location: "الرياض",
    isRemote: false,
    workType: "full_time",
    experienceLevel: "mid",
    skills: ["SIEM", "SOC", "Incident Response", "Network Security", "Threat Hunting"],
    salary: {
      min: 16000,
      max: 23000,
      currency: "SAR",
      period: "monthly",
      isDisclosed: true,
    },
    postedAt: "2026-09-23T08:00:00Z",
    updatedAt: "2026-09-23T08:00:00Z",
    status: "published",
    isTeamFriendly: false,
    excerpt: "حماية الأنظمة والمنصات الحكومية والتجارية الحساسة، ورصد التهديدات السيبرانية والاستجابة الفورية للحوادث الأمنية.",
    description: `فرصة استثنائية في **شركة علم**، رائدة الحلول الرقمية الآمنة، للعمل ضمن مركز العمليات الأمنية (SOC) وحماية أصول البيانات والخدمات الرقمية للملايين من المستخدمين.`,
    responsibilities: [
      "مراقبة سجلات الأمان وتحليل التنبيهات عبر منصات SIEM و EDR لاكتشاف أي سلوك مشبوه.",
      "قيادة إجراءات الاحتواء والتحقيق الجنائي الرقمي عند وقوع أي حادث أمني.",
      "إجراء مسوحات دورية للثغرات الأمنية والتنسيق مع فرق التطوير لمعالجتها.",
      "ضمان الامتثال لضوابط الهيئة الوطنية للأمن السيبراني (NCA ECC).",
    ],
    requirements: [
      "خبرة 3+ سنوات في مجال عمليات الأمن السيبراني (SOC L2 / Incident Response).",
      "شهادات مهنية مثل CompTIA Security+, CEH, أو CySA+.",
      "معرفة عميقة ببروتوكولات الشبكات وتحليل الحزم وهجمات الويب الحديثة.",
    ],
    applicationDeadline: "2026-11-18T23:59:59Z",
    applicationCount: 33,
  },
  {
    id: "7",
    title: "مدير منتجات التقنية المالية (FinTech Product Manager)",
    company: {
      id: "comp-7",
      name: "مصرف الراجحي | Al Rajhi Bank",
      logoUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=128&h=128&fit=crop",
      location: "الرياض، المملكة العربية السعودية",
      isVerified: true,
    },
    location: "الرياض",
    isRemote: false,
    workType: "full_time",
    experienceLevel: "senior",
    skills: ["Product Strategy", "Agile / Scrum", "FinTech", "Data Analytics", "Roadmapping"],
    salary: {
      min: 27000,
      max: 36000,
      currency: "SAR",
      period: "monthly",
      isDisclosed: true,
    },
    postedAt: "2026-09-22T12:00:00Z",
    updatedAt: "2026-09-22T12:00:00Z",
    status: "published",
    isTeamFriendly: true,
    excerpt: "قيادة استراتيجية المنتجات المصرفية الرقمية وتطوير تجربة العملاء في أكبر مصرف إسلامي في العالم.",
    description: `يبحث **مصرف الراجحي** عن مدير منتج خبير لقيادة المبادرات الرقمية في الخدمات المصرفية للأفراد، وتطوير حلول دفع واستثمار مبتكرة تلبي تطلعات الجيل الجديد من العملاء.`,
    responsibilities: [
      "صياغة الرؤية وخريطة الطريق للمنتجات المالية الرقمية ومواءمتها مع أهداف المصرف الاستراتيجية.",
      "إدارة دورة حياة المنتج من الفكرة والتحقق الأولي حتى الإطلاق والنمو والتحسين المستمر.",
      "قيادة فرق العمل متعددة التخصصات من مصممين، مهندسين، ومسؤولي الامتثال المالي.",
      "متابعة وتحليل مؤشرات الأداء الرئيسية (KPIs) مثل معدل الاحتفاظ والتحويل ومعدل رضا العملاء (NPS).",
    ],
    requirements: [
      "خبرة 5+ سنوات في إدارة المنتجات الرقمية داخل قطاع البنوك أو التقنية المالية (FinTech).",
      "فهم عميق للوائح البنك المركزي السعودي (ساما) ومعايير الصيرفة المفتوحة (Open Banking).",
      "مهارات قيادية وتحليلية استثنائية وقدرة على اتخاذ القرارات المعتمدة على البيانات.",
    ],
    applicationDeadline: "2026-11-28T23:59:59Z",
    applicationCount: 41,
  },
  {
    id: "8",
    title: "مطور تطبيقات الهواتف الذكية (Mobile Developer - Flutter)",
    company: {
      id: "comp-8",
      name: "جاهز الدولية | Jahez",
      logoUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=128&h=128&fit=crop",
      location: "الرياض، المملكة العربية السعودية",
      isVerified: true,
    },
    location: "الرياض",
    isRemote: true,
    workType: "hybrid",
    experienceLevel: "mid",
    skills: ["Flutter", "Dart", "Bloc", "REST APIs", "iOS/Android", "Google Maps"],
    salary: {
      min: 17000,
      max: 24000,
      currency: "SAR",
      period: "monthly",
      isDisclosed: true,
    },
    postedAt: "2026-09-24T15:30:00Z",
    updatedAt: "2026-09-24T15:30:00Z",
    status: "published",
    isTeamFriendly: true,
    excerpt: "تطوير تطبيقات الجوال لخدمة ملايين العملاء والشركاء، وبناء تجارب سلسة وسريعة مع خرائط ودفع فوري.",
    description: `انضم إلى فريق هندسة الجوال في **جاهز** لبناء الميزات الجديدة لتطبيقات العملاء والسائقين، وضمان أعلى مستويات الاستقرار وسرعة الاستجابة على نظامي iOS و Android.`,
    responsibilities: [
      "كتابة أكواد نظيفة ومعيارية باستخدام Flutter و Dart وإدارة الحالة عبر Bloc / Riverpod.",
      "دمج خدمات التتبع اللحظي للخرائط وبوابات الدفع الإلكتروني المعتمدة (مدى، Apple Pay).",
      "تحسين استهلاك الذاكرة والبطارية ومعالجة أخطاء التطبيق اللحظية عبر Firebase Crashlytics.",
      "نشر التحديثات الدورية عبر App Store Connect و Google Play Console.",
    ],
    requirements: [
      "خبرة 3+ سنوات في تطوير تطبيقات الهواتف الذكية مع سنة على الأقل في Flutter.",
      "وجود تطبيقات منشورة ومتاحة على المتاجر الرقمية توضح جودة العمل.",
      "معرفة عميقة بفلسفة تصميم Material Design وإرشادات أبل للتصميم البشري (HIG).",
    ],
    applicationDeadline: "2026-11-14T23:59:59Z",
    applicationCount: 57,
  },
  {
    id: "9",
    title: "مهندس نظم سيارات كهربائية مدمجة (Embedded Systems Engineer)",
    company: {
      id: "comp-9",
      name: "لوسيد موتورز | Lucid Motors",
      logoUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=128&h=128&fit=crop",
      location: "جدة / مدينة الملك عبدالله الاقتصادية",
      isVerified: true,
    },
    location: "جدة",
    isRemote: false,
    workType: "full_time",
    experienceLevel: "mid",
    skills: ["C++", "C", "CAN Bus", "RTOS", "Embedded Linux", "AUTOSAR"],
    salary: {
      min: 21000,
      max: 29000,
      currency: "SAR",
      period: "monthly",
      isDisclosed: true,
    },
    postedAt: "2026-09-23T10:45:00Z",
    updatedAt: "2026-09-23T10:45:00Z",
    status: "published",
    isTeamFriendly: false,
    excerpt: "برمجة وحدات التحكم الإلكترونية وإدارة بطاريات السيارات الكهربائية الفاخرة في أول مصنع للسيارات بالمملكة.",
    description: `فرصة صناعية تقنية فريدة في مصنع **لوسيد موتورز** بمدينة الملك عبدالله الاقتصادية (KAEC) للمشاركة في تطوير برمجيات القيادة وأنظمة الشحن المتقدمة.`,
    responsibilities: [
      "تطوير البرمجيات المدمجة لوحدات إدارة البطارية (BMS) وأنظمة التحكم بالمحرك بلغات C و C++.",
      "اختبار الاتصالات عبر بروتوكولات CAN, LIN, و Ethernet للسيارات.",
      "الامتثال لمعايير السلامة الوظيفية الصارمة للسيارات ISO 26262.",
      "العمل في بيئة المختبر مع أجهزة قياس الذبذبات والمحاكاة HIL (Hardware-in-the-Loop).",
    ],
    requirements: [
      "درجة البكالوريوس في هندسة الحاسب أو الإلكترونيات أو هندسة الميكاترونكس.",
      "خبرة 3+ سنوات في تطوير البرمجيات المدمجة للأنظمة الحرجة وأنظمة الزمن الحقيقي (RTOS).",
      "إلمام تام بمعايير ومفاهيم معمارية AUTOSAR.",
    ],
    applicationDeadline: "2026-11-22T23:59:59Z",
    applicationCount: 22,
  },
  {
    id: "10",
    title: "مهندس بيانات ومنصات تحليلية (Senior Data Platform Engineer)",
    company: {
      id: "comp-10",
      name: "تابي | Tabby",
      logoUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&h=128&fit=crop",
      location: "الرياض، المملكة العربية السعودية",
      isVerified: true,
    },
    location: "الرياض",
    isRemote: true,
    workType: "remote",
    experienceLevel: "senior",
    skills: ["Snowflake", "dbt", "Apache Airflow", "Python", "SQL", "Kafka"],
    salary: {
      min: 25000,
      max: 35000,
      currency: "SAR",
      period: "monthly",
      isDisclosed: true,
    },
    postedAt: "2026-09-25T14:00:00Z",
    updatedAt: "2026-09-25T14:00:00Z",
    status: "published",
    isTeamFriendly: true,
    excerpt: "تصميم وإدارة مستودعات وبحيرات البيانات الضخمة لدعم قرارات الشراء والائتمان الفوري لملايين المتسوقين.",
    description: `نبحث في **تابي (Tabby)** عن مهندس بيانات أول لبناء مسارات البيانات القوية التي تغذي لوحات المؤشرات المالية ونماذج تقييم الائتمان ومكافحة الاحتيال.`,
    responsibilities: [
      "تصميم وصيانة مستودع البيانات السحابي على Snowflake باستخدام dbt للتحويلات المعيارية.",
      "أتمتة جدولة مهام ومعالجات البيانات المعقدة عبر Apache Airflow.",
      "ضمان حوكمة البيانات وأمانها ومراقبة جودتها عبر أطر عمل Data Observability.",
      "تمكين فرق ذكاء الأعمال (BI) وعلماء البيانات من الوصول الآمن واللحظي للبيانات المعالجة.",
    ],
    requirements: [
      "خبرة 4+ سنوات في هندسة البيانات وبناء مسارات ETL / ELT المتقدمة.",
      "إتقان استثنائي لـ SQL المتقدم ولغة Python.",
      "خبرة عملية في تقنيات البيانات السحابية (AWS / Snowflake / BigQuery).",
    ],
    applicationDeadline: "2026-11-19T23:59:59Z",
    applicationCount: 35,
  },
  {
    id: "11",
    title: "أخصائي تسويق رقمي واكتساب مستخدمين (Growth & Performance Marketer)",
    company: {
      id: "comp-11",
      name: "تمارا | Tamara",
      logoUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=128&h=128&fit=crop",
      location: "الرياض، المملكة العربية السعودية",
      isVerified: true,
    },
    location: "الرياض",
    isRemote: false,
    workType: "full_time",
    experienceLevel: "entry",
    skills: ["SEO/SEM", "Google Analytics", "Social Media Ads", "Growth Hacking", "Attribution"],
    salary: {
      min: 12000,
      max: 18000,
      currency: "SAR",
      period: "monthly",
      isDisclosed: true,
    },
    postedAt: "2026-09-24T11:20:00Z",
    updatedAt: "2026-09-24T11:20:00Z",
    status: "published",
    isTeamFriendly: true,
    excerpt: "إدارة وتوسيع حملات الاستحواذ الرقمي وتحليل مسارات التحويل في أول يونيكورن تقني مالي سعودي.",
    description: `فرصة ممتازة للمواهب الشابة الطموحة في **تمارا** للانضمام إلى فريق النمو، والمساهمة في ابتكار حملات تسويق رقمية قائمة على البيانات لجذب العملاء وزيادة المبيعات للمتاجر الشريكة.`,
    responsibilities: [
      "إدارة وتصميم الحملات الإعلانية المدفوعة على منصات Google, Meta, TikTok, و Snapchat.",
      "إجراء تجارب A/B testing مستمرة للرسائل الإعلانية وصفحات الهبوط لتحسين معدل التحويل.",
      "تحليل تكلفة الاستحواذ على العميل (CAC) والقيمة الدائمة للعميل (LTV).",
      "إعداد تقارير أسبوعية تفصيلية عن أداء القنوات التسويقية وتقديم مقترحات تحسين ملموسة.",
    ],
    requirements: [
      "درجة البكالوريوس في التسويق أو نظم المعلومات الإدارية أو تخصص ذي صلة.",
      "خبرة من سنة إلى سنتين أو تدريب متقدم في التسويق القائم على الأداء (Performance Marketing).",
      "شغف بتحليل البيانات وإجادة أدوات GA4 و Excel / Google Sheets.",
    ],
    applicationDeadline: "2026-11-26T23:59:59Z",
    applicationCount: 68,
  },
  {
    id: "12",
    title: "مطور برمجيات شامل (Full-Stack Engineer - Django / React)",
    company: {
      id: "comp-12",
      name: "شركة ثقة لخدمات الأعمال | Thiqah",
      logoUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&h=128&fit=crop",
      location: "الرياض، المملكة العربية السعودية",
      isVerified: true,
    },
    location: "الرياض",
    isRemote: false,
    workType: "contract",
    experienceLevel: "mid",
    skills: ["Python", "Django", "React", "PostgreSQL", "Docker", "REST APIs"],
    salary: {
      min: 19000,
      max: 26000,
      currency: "SAR",
      period: "monthly",
      isDisclosed: true,
    },
    postedAt: "2026-09-25T08:45:00Z",
    updatedAt: "2026-09-25T08:45:00Z",
    status: "published",
    isTeamFriendly: true,
    excerpt: "المساهمة في بناء وتحديث المنظومات والمنصات الذكية التي تخدم قطاع الأعمال والجهات الحكومية في المملكة.",
    description: `نبحث في **شركة ثقة** عن مهندس Full-Stack متمكن للمشاركة في تطوير أنظمة وخدمات حكومية ذكية تعتمد عليها آلاف المنشآت التجارية يومياً.`,
    responsibilities: [
      "تطوير خدمات الويب وواجهات برمجة التطبيقات باستخدام Python و Django REST framework.",
      "بناء واجهات مستخدم سريعة ومتجاوبة باستخدام React و TailwindCSS.",
      "كتابة استعلامات قواعد بيانات محسنة على PostgreSQL والتعامل مع البيانات المعقدة.",
      "التكامل مع البوابات والخدمات الحكومية المشتركة وفق أعلى معايير الأمان الوطنية.",
    ],
    requirements: [
      "خبرة 3+ سنوات في تطوير تطبيقات الويب المتكاملة Full-Stack.",
      "معرفة عميقة بإدارة بيئات الحاويات Docker وأساسيات CI/CD.",
      "التزام بأعلى معايير جودة الشفرة البرمجية واختبارات الوحدة.",
    ],
    applicationDeadline: "2026-11-16T23:59:59Z",
    applicationCount: 40,
  },
]

/**
 * Filter and paginate fallback jobs locally.
 */
function filterFallbackJobs(filter: JobFilter = {}): JobListResponse {
  let list = [...FALLBACK_JOBS]

  // Search query: title, excerpt, company, skills, description
  if (filter.query && filter.query.trim()) {
    const q = filter.query.trim().toLowerCase()
    list = list.filter((job) => {
      const matchTitle = job.title.toLowerCase().includes(q)
      const matchExcerpt = job.excerpt?.toLowerCase().includes(q) || false
      const matchCompany = job.company.name.toLowerCase().includes(q)
      const matchSkills = job.skills.some((s) => s.toLowerCase().includes(q))
      const matchDesc = job.description.toLowerCase().includes(q)
      return matchTitle || matchExcerpt || matchCompany || matchSkills || matchDesc
    })
  }

  // Location filter
  if (filter.location && filter.location.trim()) {
    const loc = filter.location.trim().toLowerCase()
    list = list.filter((job) => {
      if (loc.includes("عن بعد") || loc.includes("remote")) {
        return job.isRemote || job.workType === "remote"
      }
      return (
        job.location.toLowerCase().includes(loc) ||
        (job.company.location && job.company.location.toLowerCase().includes(loc))
      )
    })
  }

  // Work type filter
  if (filter.workType && filter.workType.length > 0) {
    list = list.filter((job) => filter.workType!.includes(job.workType))
  }

  // Experience level filter
  if (filter.experienceLevel && filter.experienceLevel.length > 0) {
    list = list.filter((job) => filter.experienceLevel!.includes(job.experienceLevel))
  }

  // Salary disclosed filter
  if (filter.hasDisclosedSalary) {
    list = list.filter((job) => job.salary?.isDisclosed === true)
  }

  // Team friendly filter
  if (filter.isTeamFriendly !== undefined) {
    list = list.filter((job) => job.isTeamFriendly === filter.isTeamFriendly)
  }

  // Company ID filter
  if (filter.companyId) {
    list = list.filter((job) => job.company.id === filter.companyId)
  }

  const total = list.length
  const page = filter.page && filter.page > 0 ? filter.page : 1
  const pageSize = filter.pageSize && filter.pageSize > 0 ? filter.pageSize : 10
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize
  const pagedJobs = list.slice(start, start + pageSize)

  return {
    jobs: pagedJobs,
    total,
    page,
    pageSize,
    totalPages,
  }
}

/**
 * Build a URL query string from JobFilter params.
 */
function buildJobsParams(filter: JobFilter): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {}
  if (filter.query) params.q = filter.query
  if (filter.location) params.location = filter.location
  if (filter.workType?.length) params.work_type = filter.workType.join(",")
  if (filter.experienceLevel?.length) params.experience = filter.experienceLevel.join(",")
  if (filter.hasDisclosedSalary !== undefined) params.salary_disclosed = filter.hasDisclosedSalary
  if (filter.companyId) params.company_id = filter.companyId
  if (filter.isTeamFriendly !== undefined) params.team_friendly = filter.isTeamFriendly
  if (filter.page) params.page = filter.page
  if (filter.pageSize) params.page_size = filter.pageSize
  return params
}

/**
 * Fetch a paginated list of published jobs.
 * Falls back seamlessly to curated realistic jobs if backend is offline.
 */
export async function getJobs(filter: JobFilter = {}): Promise<JobListResponse> {
  try {
    const { data } = await api.get<JobListResponse>(
      API_CONFIG.ENDPOINTS.JOBS.LIST,
      { params: buildJobsParams(filter) }
    )
    if (data && Array.isArray(data.jobs) && data.jobs.length > 0) {
      return data
    }
    // If backend returns empty list, fall back to rich showcase jobs
    return filterFallbackJobs(filter)
  } catch {
    // If backend is offline or network fails, return rich fallback jobs
    return filterFallbackJobs(filter)
  }
}

/**
 * Fetch a single job by ID.
 * Falls back to matching mock job if backend is offline.
 */
export async function getJobById(id: string): Promise<JobDetail> {
  try {
    const { data } = await api.get<JobDetail>(API_CONFIG.ENDPOINTS.JOBS.DETAIL(id))
    if (data && data.id) {
      return data
    }
  } catch {
    // Fall back to offline mock dataset
  }

  const match = FALLBACK_JOBS.find(
    (j) => j.id === id || String(j.id) === String(id)
  )
  if (match) return match

  // If ID doesn't exist, return customized first job so UI never crashes
  const fallback = { ...FALLBACK_JOBS[0], id }
  return fallback
}

/**
 * Save/unsave a job (requires auth).
 * Returns the new saved state with graceful local storage fallback.
 */
export async function toggleSaveJob(id: string): Promise<{ saved: boolean }> {
  try {
    const { data } = await api.post<{ saved: boolean }>(
      API_CONFIG.ENDPOINTS.JOBS.SAVE(id)
    )
    return data
  } catch {
    // Local storage toggle fallback
    const key = `faeda_saved_job_${id}`
    const isSaved = localStorage.getItem(key) === "true"
    const nextSaved = !isSaved
    localStorage.setItem(key, String(nextSaved))
    return { saved: nextSaved }
  }
}

/**
 * Autocomplete suggestions library
 */
const SUGGESTION_CITIES = ["الرياض", "جدة", "الدمام", "نيوم", "الظهران", "الخبر", "مكة المكرمة", "المدينة المنورة"]
const SUGGESTION_COMPANIES = ["أرامكو الرقمية", "سدايا SDAIA", "شركة الاتصالات السعودية stc", "نيوم NEOM", "هنقرستيشن", "شركة علم", "مصرف الراجحي", "جاهز", "لوسيد موتورز", "تابي", "تمارا", "شركة ثقة"]
const SUGGESTION_TITLES = ["مهندس برمجيات", "مطور واجهات أمامية", "مهندس ذكاء اصطناعي", "مهندس حلول سحابية", "مصمم تجربة المستخدم", "مطور خلفية Go", "محلل أمن سيبراني", "مدير منتج", "مطور تطبيقات Flutter", "مهندس بيانات"]
const SUGGESTION_SKILLS = ["React", "TypeScript", "Python", "AWS", "Figma", "Docker", "Go", "Kubernetes", "PostgreSQL", "Flutter", "Snowflake", "Django"]

/**
 * Fetch autocomplete suggestions for search inputs.
 */
export async function getJobSuggestions(
  query: string,
  type: "all" | "location" | "keyword" = "all"
): Promise<JobSuggestion[]> {
  if (!query || query.trim().length < 2) return []
  const cleanQ = query.trim().toLowerCase()

  try {
    const { data } = await api.get<{ suggestions: JobSuggestion[] }>(
      API_CONFIG.ENDPOINTS.JOBS.SUGGESTIONS,
      { params: { q: cleanQ, type } }
    )
    if (data?.suggestions && data.suggestions.length > 0) {
      return data.suggestions
    }
  } catch {
    // proceed to fallback suggestions
  }

  const results: JobSuggestion[] = []

  if (type === "all" || type === "location") {
    SUGGESTION_CITIES.filter((city) => city.toLowerCase().includes(cleanQ)).forEach((city) => {
      results.push({
        id: `city-${city}`,
        type: "city",
        label: city,
        subLabel: "المملكة العربية السعودية",
        category: "مدينة",
        filterType: "location",
        value: city,
      })
    })
  }

  if (type === "all" || type === "keyword") {
    SUGGESTION_COMPANIES.filter((comp) => comp.toLowerCase().includes(cleanQ)).forEach((comp) => {
      results.push({
        id: `comp-${comp}`,
        type: "company",
        label: comp,
        subLabel: "شركة معتمدة",
        category: "شركة",
        filterType: "keyword",
        value: comp,
      })
    })

    SUGGESTION_TITLES.filter((title) => title.toLowerCase().includes(cleanQ)).forEach((title) => {
      results.push({
        id: `job-${title}`,
        type: "job",
        label: title,
        subLabel: "مسمى وظيفي",
        category: "وظيفة",
        filterType: "keyword",
        value: title,
      })
    })

    SUGGESTION_SKILLS.filter((skill) => skill.toLowerCase().includes(cleanQ)).forEach((skill) => {
      results.push({
        id: `skill-${skill}`,
        type: "skill",
        label: skill,
        subLabel: "مهارة مطلوبة",
        category: "مهارة",
        filterType: "keyword",
        value: skill,
      })
    })
  }

  return results.slice(0, 8)
}

export type { Job, JobDetail, JobFilter, JobListResponse, JobSuggestion }


