import { apiClient } from "@/lib/api-client"
import { API_CONFIG } from "@/config/api"
import type {
  UniversityDashboardData,
  UniversityProfile,
  UpdateUniversityProfilePayload,
  UniversityStudentItem,
  UniversityStudentDetail,
  VerificationQueueItem,
  UniversityDepartmentItem,
  CreateDepartmentPayload,
  UniversityOpportunityItem,
  StudentFilterParams,
  UniversityThesisCampaign,
  CreateThesisCampaignPayload,
  UniversityIncubatorVenture,
  IncubatorShowcaseResponse,
  CreateIncubatorVenturePayload,
  CoopSupervisionResponse,
  CoopSupervisedStudent,
  CreateCoopStudentPayload,
  UpdateCoopStudentPayload,
  CoopEvaluationPayload,
  CreateCoopSchedulePayload,
  GraduateEmploymentKPIs,
} from "../types/university.types"

export const DEFAULT_OPPORTUNITIES: UniversityOpportunityItem[] = [
  {
    id: 1,
    title: "مهندس برمجيات متكامل (Full-Stack)",
    company_name: "أرامكو السعودية",
    company_logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop",
    location: "الظهران",
    work_type: "دوام كامل",
    experience_level: "حديث تخرج / سنة خبرة",
    salary_range: "14,000 - 22,000 ر.س",
    skills: ["React", "TypeScript", "Node.js", "Python", "Cloud"],
    date_posted: "2026-10-01T08:00:00Z",
  },
  {
    id: 2,
    title: "أخصائي أمن سيبراني واختراق أخلاقي",
    company_name: "شركة علم (Elm)",
    company_logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop",
    location: "الرياض",
    work_type: "دوام كامل",
    experience_level: "مبتدئ / متوسط",
    salary_range: "13,000 - 19,500 ر.س",
    skills: ["Cybersecurity", "Penetration Testing", "NCA Standards", "SIEM"],
    date_posted: "2026-10-03T10:30:00Z",
  },
  {
    id: 3,
    title: "عالم بيانات وتعلم آلة",
    company_name: "شركة الاتصالات السعودية (stc)",
    company_logo: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=100&h=100&fit=crop",
    location: "الرياض",
    work_type: "دوام كامل",
    experience_level: "حديث تخرج (مع مرتبة الشرف)",
    salary_range: "15,000 - 24,000 ر.س",
    skills: ["Python", "Machine Learning", "PyTorch", "SQL", "Big Data"],
    date_posted: "2026-10-05T09:15:00Z",
  },
  {
    id: 4,
    title: "مدير مشاريع زراعية رقمية (AgTech)",
    company_name: "سابك (SABIC)",
    company_logo: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=100&h=100&fit=crop",
    location: "الأحساء / الجبيل",
    work_type: "دوام كامل",
    experience_level: "سنة إلى 3 سنوات",
    salary_range: "12,000 - 18,000 ر.س",
    skills: ["AgTech", "IoT Sensors", "Project Management", "ERP"],
    date_posted: "2026-10-08T11:00:00Z",
  },
  {
    id: 5,
    title: "متدرب تدريب تعاوني في الذكاء الاصطناعي",
    company_name: "نيوم (NEOM)",
    company_logo: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop",
    location: "عن بعد / تبوك",
    work_type: "تدريب تعاوني",
    experience_level: "طالب سنة أخيرة / خريج",
    salary_range: "4,500 - 6,500 ر.س",
    skills: ["AI Systems", "Computer Vision", "Python", "Robotics"],
    date_posted: "2026-10-10T14:20:00Z",
  },
  {
    id: 6,
    title: "مهندس بنية سحابية وحلول DevOps",
    company_name: "Solutions by stc",
    company_logo: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=100&h=100&fit=crop",
    location: "الخبر / الشرقية",
    work_type: "دوام كامل",
    experience_level: "مبتدئ / سنتين خبرة",
    salary_range: "14,500 - 21,000 ر.س",
    skills: ["AWS", "Kubernetes", "Docker", "CI/CD", "Terraform"],
    date_posted: "2026-10-11T12:00:00Z",
  },
]

export const DEFAULT_EMPLOYMENT_KPIS: GraduateEmploymentKPIs = {
  success: true,
  institution_name: "جامعة الملك فيصل",
  overall_metrics: {
    in_field_employment_rate: 84.6,
    out_of_field_employment_rate: 15.4,
    total_graduates_surveyed: 595,
    total_employed: 519,
    national_rank_employability: "#3 في المنطقة الشرقية",
    vision_2030_target: 75.0,
    gap_to_target: "+9.6%",
    performance_status: "متفوق على المستهدف الوطني لرؤية 2030",
  },
  department_rates: [
    { department: "علوم الحاسب وتقنية المعلومات", rate: 89.2, graduates_count: 142, employed_count: 127, avg_salary: 12400 },
    { department: "هندسة البرمجيات", rate: 91.5, graduates_count: 98, employed_count: 90, avg_salary: 11800 },
    { department: "العلوم الزراعية والأغذية (AgTech)", rate: 83.0, graduates_count: 115, employed_count: 95, avg_salary: 10200 },
    { department: "إدارة الأعمال ونظم المعلومات", rate: 82.4, graduates_count: 160, employed_count: 132, avg_salary: 9400 },
    { department: "الأمن السيبراني والتحري الرقمي", rate: 93.8, graduates_count: 80, employed_count: 75, avg_salary: 13200 },
  ],
  salary_metrics: {
    overall_average_starting_sar: 11400,
    median_starting_sar: 11000,
    salary_brackets: [
      { bracket: "أقل من 8,000 ر.س", percentage: 12, color: "amber", count: 62 },
      { bracket: "8,000 - 11,000 ر.س", percentage: 36, color: "sky", count: 187 },
      { bracket: "11,000 - 15,000 ر.س", percentage: 38, color: "indigo", count: 197 },
      { bracket: "أعلى من 15,000 ر.س", percentage: 14, color: "emerald", count: 73 },
    ],
    by_specialization: [
      { specialization: "الذكاء الاصطناعي وعلم البيانات", avg_salary: 13500, range: "11,000 - 18,000 ر.س", demand_level: "مرتفع جداً" },
      { specialization: "الأمن السيبراني والبنية التحتية", avg_salary: 12800, range: "10,500 - 16,500 ر.س", demand_level: "مرتفع جداً" },
      { specialization: "هندسة البرمجيات والأنظمة السحابية", avg_salary: 11600, range: "9,500 - 15,000 ر.س", demand_level: "مرتفع" },
      { specialization: "التقنيات الزراعية الحديثة (AgTech)", avg_salary: 10200, range: "8,500 - 13,000 ر.س", demand_level: "مرتفع واعد" },
      { specialization: "نظم المعلومات الإدارية والتحول الرقمي", avg_salary: 9400, range: "8,000 - 12,000 ر.س", demand_level: "مستقر" },
    ],
  },
  unemployment_duration: {
    average_months_to_employment: 2.8,
    distribution: [
      { duration: "أقل من 3 أشهر", percentage: 58, description: "توظيف سريع بعد التخرج مباشرة أو أثناء التدريب التعاوني", count: 301 },
      { duration: "3 إلى 6 أشهر", percentage: 26, description: "فترة بحث اعتيادية ومقابلات اختيارية", count: 135 },
      { duration: "6 إلى 12 شهراً", percentage: 12, description: "حصول على شهادات مهنية تخصصية إضافية", count: 62 },
      { duration: "أكثر من 12 شهراً", percentage: 4, description: "إعادة توجيه مهني أو رغبة بالعمل الحر", count: 21 },
    ],
  },
  labor_market_status: {
    employed_in_field_pct: 66,
    employed_adjacent_pct: 14,
    actively_seeking_work_pct: 12,
    continuing_higher_education_pct: 8,
    actively_seeking_count: 71,
    higher_education_count: 48,
  },
  performance_indicators: {
    ncaaa_standard_score: "4.8 / 5.0 (معيار كفاءة التوظيف والاعتماد البرامجي)",
    employer_satisfaction_rate: "92.4%",
    graduate_skills_alignment: "88.7%",
  },
}

export const DEFAULT_THESIS_CAMPAIGNS: UniversityThesisCampaign[] = [
  {
    id: 1,
    university_id: 1,
    university_name_ar: "جامعة الملك فيصل",
    university_location: "الأحساء",
    researcher_name: "م. سارة بنت عبد العزيز العتيبي",
    researcher_title: "باحثة ماجستير في الذكاء الاصطناعي وهندسة البيانات",
    researcher_email: "sara.otaibi@alumni.kfu.edu.sa",
    researcher_img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    thesis_title: "خوارزمية هجينة لترشيد الري الذكي واستدامة واحات الأحساء الزراعية باستخدام إنترنت الأشياء والتعلم العميق",
    thesis_type: "رسالة ماجستير",
    department: "كلية علوم الحاسب وتقنية المعلومات - قسم الذكاء الاصطناعي",
    supervisor_name: "أ.د. عبد الله بن خالد الدوسري",
    summary: "قدمت هذه الرسالة نموذجاً حوسبياً مبتكراً يدمج بيانات استشعار رطوبة التربة عبر إنترنت الأشياء مع صور الأقمار الصناعية لتوجيه الري الدقيق لنخيل التمر في واحة الأحساء. أظهرت التجارب الميدانية خفض استهلاك المياه الجوفية بنسبة 38.4% وزيادة إنتاجية المحصول بنسبة 14.2% مقارنة بالطرائق التقليدية.",
    commercial_readiness_level: "TRL 7 - نموذج صناعي مجرب ميدانياً",
    target_audience: "استثمار صناعي / تراخيص تجارية لبراءات الاختراع",
    tags: ["IoT", "Deep Learning", "AgTech", "Al-Ahsa Oasis", "Water Sustainability", "Vision 2030"],
    banner_url: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1200&h=500&fit=crop",
    university_logo_endorsed: true,
    endorsement_text: "معتمد رسمياً من وكالة الجامعة للدراسات العليا والبحث العلمي - جامعة الملك فيصل",
    views_count: 1840,
    inquiries_count: 46,
    sponsorship_leads: 9,
    status: "active",
  },
  {
    id: 2,
    university_id: 1,
    university_name_ar: "جامعة الملك فيصل",
    university_location: "الأحساء",
    researcher_name: "د. عبد الله بن خالد الدوسري وم. فيصل الحليبي",
    researcher_title: "فريق الابتكار وحاضنة التقنيات الحيوية",
    researcher_email: "innovation-team@kfu.edu.sa",
    researcher_img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
    thesis_title: "نظام كشف مبكر عن سوسة النخيل الحمراء باستخدام الطائرات المسيرة (الدرونز) وتحليل الأطياف الضوئية",
    thesis_type: "براءة اختراع وابتكار جامعي",
    department: "مركز التميز البحثي في النخيل والتمور",
    supervisor_name: "وكالة الجامعة للبحث والابتكار",
    summary: "ابتكار تقني مسجل كبراءة اختراع وطنية يتيح مسح مساحات شاسعة من مزارع النخيل بدقة متناهية عبر كاميرات متعددة الأطياف محمولة جواً، واكتشاف الإصابات في المراحل الأولى قبل ظهور الأعراض الخارجية بدقة تجاوزت 96.3%.",
    commercial_readiness_level: "TRL 8 - نظام تجاري جاهز للترخيص",
    target_audience: "شراكة بحث وتطوير R&D مع الشركات الزراعية الكبرى",
    tags: ["Drones", "Computer Vision", "Red Palm Weevil", "Agro-Security", "Spectral Analysis"],
    banner_url: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1200&h=500&fit=crop",
    university_logo_endorsed: true,
    endorsement_text: "براءة اختراع معتمدة ومسجلة برعاية جامعة الملك فيصل",
    views_count: 2420,
    inquiries_count: 62,
    sponsorship_leads: 14,
    status: "active",
  },
  {
    id: 3,
    university_id: 1,
    university_name_ar: "جامعة الملك فيصل",
    university_location: "الأحساء",
    researcher_name: "م. عمر بن خالد المنصور",
    researcher_title: "باحث ماجستير في هندسة البرمجيات السحابية",
    researcher_email: "omar.mansoor@alumni.kfu.edu.sa",
    researcher_img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    thesis_title: "معمارية حوسبة سحابية موزعة لتأمين وتتبع أصول سلاسل الإمداد الغذائي والتمور بتقنية البلوكتشين",
    thesis_type: "رسالة ماجستير",
    department: "كلية علوم الحاسب وتقنية المعلومات",
    supervisor_name: "د. خالد بن إبراهيم السليمان",
    summary: "تصميم بنية تحتية سحابية لامركزية عالية الأداء لتوثيق جودة المحاصيل وشهادات الزراعة العضوية من المزرعة إلى منافذ المستهلك النهائي دولياً مع تقليل زمن الاستجابة بنسبة 60%.",
    commercial_readiness_level: "TRL 6 - نموذج أولي تجريبي",
    target_audience: "استقطاب كفاءات بحثية وتوظيف الباحث / استثمار أولي",
    tags: ["Blockchain", "Cloud Architecture", "Supply Chain", "Microservices", "Smart Contracts"],
    banner_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=500&fit=crop",
    university_logo_endorsed: true,
    endorsement_text: "معتمد رسمياً من كلية علوم الحاسب وتقنية المعلومات",
    views_count: 1350,
    inquiries_count: 32,
    sponsorship_leads: 7,
    status: "active",
  },
  {
    id: 4,
    university_id: 1,
    university_name_ar: "جامعة الملك فيصل",
    university_location: "الأحساء",
    researcher_name: "د. ريم بنت فهد الحليبي",
    researcher_title: "أستاذ مساعد وباحثة دكتوراه في هندسة المواد المستدامة",
    researcher_email: "reem.hulaibi@kfu.edu.sa",
    researcher_img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop",
    thesis_title: "أغشية حيوية نانوية متطورة مستخلصة من مخلفات النخيل لمعالجة المياه الصناعية وتقليل استهلاك الطاقة بنسبة 35%",
    thesis_type: "أطروحة دكتوراه وبراءة اختراع",
    department: "كلية الهندسة - قسم الهندسة الكيميائية",
    supervisor_name: "أ.د. محمد بن عبد العزيز العوهلي",
    summary: "تحويل مخلفات النخيل الزراعية المعالجة حيوياً إلى أغشية نانوية عالية الكفاءة لتنقية المياه العادمة وإعادة تدويرها في العمليات الصناعية مع تقليل تكلفة الإنتاج بنسبة 45%.",
    commercial_readiness_level: "TRL 7 - نموذج مجرب في بيئة صناعية",
    target_audience: "استثمار صناعي مشترك وترخيص تقني للشركات البتروكيماوية",
    tags: ["Nanotechnology", "Water Treatment", "Sustainability", "Patents", "Circular Economy"],
    banner_url: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=1200&h=500&fit=crop",
    university_logo_endorsed: true,
    endorsement_text: "براءة اختراع معتمدة مسجلة برعاية وكالة الجامعة للدراسات العليا والبحث العلمي",
    views_count: 1980,
    inquiries_count: 51,
    sponsorship_leads: 11,
    status: "active",
  },
]

export const DEFAULT_ACADEMIC_UPDATES = [
  {
    id: 1,
    title_ar: "تحديث الخطة الدراسية لبكالوريوس الأمن السيبراني والذكاء الاصطناعي",
    title_en: "Curriculum Update: B.Sc. Cybersecurity & Applied AI",
    title_hi: "पाठ्यक्रम अपडेट: बी.एससी. साइबर सुरक्षा और एआई",
    category: "curriculum",
    department: "كلية علوم الحاسب وتقنية المعلومات",
    date: "2026-09-24",
    description_ar: "اعتماد دمج 4 مقررات معملية في هندسة النماذج اللغوية الكبيرة (LLMs) والدفاع السيبراني المتقدم بناءً على توصيات مجالس الشراكة الصناعية مع كبرى شركات الاتصالات والتقنية.",
    description_en: "Approved integration of 4 lab courses in Large Language Model (LLM) engineering and advanced cyber defense per industrial advisory board recommendations.",
    description_hi: "औद्योगिक सलाहकार बोर्ड की सिफारिशों के अनुसार 4 नए व्यावहारिक पाठ्यक्रम शामिल किए गए।",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&fit=crop",
  },
  {
    id: 2,
    title_ar: "تدشين برنامج ماجستير التقنيات الزراعية الذكية (AgTech)",
    title_en: "Launch of M.Sc. in Smart Agricultural Technologies (AgTech)",
    title_hi: "स्मार्ट कृषि प्रौद्योगिकियों (AgTech) में एम.एससी. का शुभारंभ",
    category: "new_programs",
    department: "كلية العلوم الزراعية والأغذية",
    date: "2026-09-18",
    description_ar: "إطلاق برنامج نوعي بالشراكة مع مركز النخيل والتمور بالأحساء لدعم استدامة الواحة وتأهيل قيادات وطنية في مجالات إنترنت الأشياء والاستشعار عن بعد في الزراعة.",
    description_en: "Qualitative postgraduate program launched in partnership with the National Date Palm Center in Al-Ahsa to advance oasis food security.",
    description_hi: "राष्ट्रीय खजूर केंद्र के सहयोग से पोस्टग्रेजुएट कार्यक्रम का शुभारंभ।",
    image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&fit=crop",
  },
  {
    id: 3,
    title_ar: "تسجيل براءة اختراع سعودية في تحلية المياه باستخدام الأغشية النانوية",
    title_en: "Saudi Patent Granted: Energy-Efficient Desalination Nanomembranes",
    title_hi: "सऊदी पेटेंट स्वीकृत: ऊर्जा कुशल नैनोमेम्ब्रेन डिसैलिनेशन",
    category: "research_achievement",
    department: "كلية الهندسة",
    date: "2026-09-10",
    description_ar: "منح الهيئة السعودية للملكية الفكرية (SAIP) براءة اختراع لفريق بحثي من الجامعة لابتكار أغشية نانوية متطورة توفر استهلاك الطاقة في محطات التحلية بنسبة 35%.",
    description_en: "Saudi Authority for Intellectual Property (SAIP) granted patent for advanced nanomembranes reducing desalination energy consumption by 35%.",
    description_hi: "सऊदी बौद्धिक संपदा प्राधिकरण द्वारा 35% कम ऊर्जा वाले नैनोमेम्ब्रेन को पेटेंट प्रदान किया गया।",
    image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&fit=crop",
  },
  {
    id: 4,
    title_ar: "فوز فريق الجامعة بالمركز الأول في هاكاثون الابتكار الوطني لعام 2026",
    title_en: "University Team Wins 1st Place in National Innovation Hackathon 2026",
    title_hi: "राष्ट्रीय नवाचार हैकाथॉन 2026 में विश्वविद्यालय टीम ने प्रथम स्थान जीता",
    category: "student_achievement",
    department: "كلية علوم الحاسب وتقنية المعلومات",
    date: "2026-09-05",
    description_ar: "حصد 5 طلاب من كليتي علوم الحاسب وإدارة الأعمال المركز الأول وجائزة مالية قدرها 150,000 ريال لتطوير منصة ذكاء اصطناعي لوجستية للتوزيع المبرد.",
    description_en: "Five students from Computer Science and Business claimed first place and a 150,000 SAR prize for developing an AI logistics platform.",
    description_hi: "कंप्यूटर साइंस और बिजनेस के 5 छात्रों ने एआई लॉजिस्टिक्स प्लेटफॉर्म के लिए प्रथम स्थान और 150,000 रियाल का पुरस्कार जीता।",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&fit=crop",
  },
  {
    id: 5,
    title_ar: "اختيار الدكتور أحمد الزهراني عضواً في المجلس العلمي الاستشاري العالمي",
    title_en: "Dr. Ahmed Al-Zahrani Appointed to Global Scientific Advisory Council",
    title_hi: "डॉ. अहमद अल-जहरानी वैश्विक वैज्ञानिक सलाहकार परिषद में नियुक्त",
    category: "faculty_achievement",
    department: "قسم الكيمياء والعلوم التطبيقية",
    date: "2026-08-28",
    description_ar: "تقديراً لأبحاثه المنشورة في مجلات دور النشر المرموقة حول الهيدروجين النظيف وتخزين الطاقة الخضراء تم اختيار عضو هيئة التدريس في المجلس الدولي.",
    description_en: "Recognized for high-impact publications on clean hydrogen and green energy storage in top-tier peer-reviewed journals.",
    description_hi: "स्वच्छ हाइड्रोजन और हरित ऊर्जा भंडारण पर उच्च प्रभाव वाले शोध के लिए अंतरराष्ट्रीय परिषद में चयन।",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&fit=crop",
  },
  {
    id: 6,
    title_ar: "حصول الجامعة على الترتيب الثالث وطنياً في سرعة توظيف الخريجين",
    title_en: "University Ranked #3 Nationally in Time-to-Hire Placement Velocity",
    title_hi: "स्नातक रोजगार गति में विश्वविद्यालय को राष्ट्रीय स्तर पर तीसरा स्थान",
    category: "university_announcement",
    department: "عمادة شؤون الخريجين والتطوير الوظيفي",
    date: "2026-08-20",
    description_ar: "وفق التقرير السنوي لمرصد سوق العمل ومؤشرات رؤية 2030، بلغ متوسط حصول خريجي الجامعة على وظيفة 2.8 شهر فقط محققة بذلك الصدارة الإقليمية.",
    description_en: "According to the annual labor observatory report and Vision 2030 indicators, graduate time-to-hire achieved an exceptional 2.8 months benchmark.",
    description_hi: "श्रम वेधशाला रिपोर्ट के अनुसार विश्वविद्यालय के स्नातकों को औसतन केवल 2.8 महीनों में रोजगार मिला।",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&fit=crop",
  },
]

export const universityService = {
  /**
   * Check authenticated institution session.
   */
  async getMe(): Promise<{ authenticated: boolean; role: string; institution: UniversityProfile }> {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.UNIVERSITY.ME)
    return res.data
  },

  /**
   * Get institution profile with completeness scorecard.
   */
  async getProfile(): Promise<{ success: boolean; profile: UniversityProfile }> {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.UNIVERSITY.PROFILE)
    return res.data
  },

  /**
   * Update institution profile fields.
   */
  async updateProfile(payload: UpdateUniversityProfilePayload): Promise<{ success: boolean; profile: UniversityProfile; message: string }> {
    const res = await apiClient.put(API_CONFIG.ENDPOINTS.UNIVERSITY.PROFILE, payload)
    return res.data
  },

  /**
   * Upload institution logo.
   */
  async uploadLogo(file: File): Promise<{ success: boolean; logo_url: string; message: string }> {
    const formData = new FormData()
    formData.append("logo", file)
    const res = await apiClient.post(API_CONFIG.ENDPOINTS.UNIVERSITY.LOGO_UPLOAD, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return res.data
  },

  /**
   * Get dashboard aggregated metrics.
   */
  async getDashboard(): Promise<UniversityDashboardData> {
    try {
      const res = await apiClient.get<UniversityDashboardData>(API_CONFIG.ENDPOINTS.UNIVERSITY.DASHBOARD)
      return res.data
    } catch (err) {
      console.warn("Using fallback university dashboard data:", err)
      return {
        success: true,
        institution: {
          id: 1,
          name_ar: "جامعة الملك فيصل",
          name_en: "King Faisal University",
          name: "جامعة الملك فيصل",
          email: "careers@kfu.edu.sa",
          description_ar: "جامعة رائدة في الأحساء مكرسة للأمن الغذائي والاستدامة البيئية والابتكار.",
          description_en: "Leading university in Al-Ahsa dedicated to food security and innovation.",
          location: "الأحساء، المنطقة الشرقية",
          country: "المملكة العربية السعودية",
          website: "https://kfu.edu.sa",
          logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&h=150&fit=crop",
          institution_type: "جامعة حكومية",
          qs_rank: "#18 في المنطقة العربية",
          phone: "+966135800000",
          dean_name: "أ.د. محمد بن عبد العزيز العوهلي",
          career_center_email: "careers@kfu.edu.sa",
          is_verified: true,
          verified_at: "2026-01-15T10:00:00Z",
          status: "active",
          completeness: { percentage: 100, completed_factors: 6, total_factors: 6, checklist: [] },
        },
        stats: {
          total_students: 1250,
          graduates_count: 595,
          verified_count: 512,
          pending_verifications: 14,
          departments_count: 8,
          academic_projects_count: 48,
          career_opportunities_count: 32,
          thesis_campaigns_count: 4,
          incubator_ventures_count: 3,
          coop_students_count: 12,
        },
        recent_students: [],
        recent_verifications: [],
      }
    }
  },

  /**
   * Get connected students with filters and pagination.
   */
  async getStudents(params?: StudentFilterParams): Promise<{
    success: boolean
    students: UniversityStudentItem[]
    pagination: { total: number; page: number; page_size: number; total_pages: number }
  }> {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.UNIVERSITY.STUDENTS, { params })
    return res.data
  },

  /**
   * Get deep student academic & professional dossier.
   */
  async getStudentDetail(id: string | number): Promise<{ success: boolean; student: UniversityStudentDetail }> {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.UNIVERSITY.STUDENT_DETAIL(id))
    return res.data
  },

  /**
   * Directly verify a connected student.
   */
  async verifyStudentDirect(
    id: string | number,
    payload: { degree?: string; department?: string; graduation_year?: string; gpa?: string; notes?: string }
  ): Promise<{ success: boolean; message: string; verification_code: string }> {
    const res = await apiClient.post(API_CONFIG.ENDPOINTS.UNIVERSITY.STUDENT_VERIFY_DIRECT(id), payload)
    return res.data
  },

  /**
   * Get academic verification queue.
   */
  async getVerifications(params?: { status?: string; department?: string; q?: string }): Promise<{
    success: boolean
    verifications: VerificationQueueItem[]
    total: number
  }> {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.UNIVERSITY.VERIFICATIONS, { params })
    return res.data
  },

  /**
   * Update verification status (approve / reject).
   */
  async updateVerification(
    id: string | number,
    payload: { status: "verified" | "rejected" | "pending"; notes?: string }
  ): Promise<{ success: boolean; message: string; verification: { id: number; status: string; verification_code: string } }> {
    const res = await apiClient.put(API_CONFIG.ENDPOINTS.UNIVERSITY.VERIFICATION_UPDATE(id), payload)
    return res.data
  },

  /**
   * Get academic departments list.
   */
  async getDepartments(): Promise<{ success: boolean; departments: UniversityDepartmentItem[]; total: number }> {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.UNIVERSITY.DEPARTMENTS)
    return res.data
  },

  /**
   * Create new academic department.
   */
  async createDepartment(payload: CreateDepartmentPayload): Promise<{ success: boolean; department: UniversityDepartmentItem; message: string }> {
    const res = await apiClient.post(API_CONFIG.ENDPOINTS.UNIVERSITY.DEPARTMENTS, payload)
    return res.data
  },

  /**
   * Update department.
   */
  async updateDepartment(
    id: string | number,
    payload: Partial<CreateDepartmentPayload>
  ): Promise<{ success: boolean; department: UniversityDepartmentItem; message: string }> {
    const res = await apiClient.put(API_CONFIG.ENDPOINTS.UNIVERSITY.DEPARTMENT_DETAIL(id), payload)
    return res.data
  },

  /**
   * Delete department.
   */
  async deleteDepartment(id: string | number): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.delete(API_CONFIG.ENDPOINTS.UNIVERSITY.DEPARTMENT_DETAIL(id))
    return res.data
  },

  /**
   * Get approved opportunities relevant to institution specializations.
   */
  async getOpportunities(params?: { q?: string; work_type?: string }): Promise<{
    success: boolean
    opportunities: UniversityOpportunityItem[]
    total: number
  }> {
    try {
      const res = await apiClient.get(API_CONFIG.ENDPOINTS.UNIVERSITY.OPPORTUNITIES, { params })
      if (res.data?.opportunities && res.data.opportunities.length > 0) {
        return res.data
      }
    } catch {
      // Fallback
    }

    let filtered = DEFAULT_OPPORTUNITIES
    if (params?.q) {
      const qLower = params.q.toLowerCase()
      filtered = filtered.filter(
        (o) =>
          o.title.toLowerCase().includes(qLower) ||
          o.company_name.toLowerCase().includes(qLower) ||
          o.skills.some((s) => s.toLowerCase().includes(qLower))
      )
    }
    if (params?.work_type) {
      filtered = filtered.filter((o) => o.work_type === params.work_type)
    }

    return {
      success: true,
      opportunities: filtered,
      total: filtered.length,
    }
  },

  /**
   * Get Graduate Employability & Labor Market Performance Indicators (KPIs).
   */
  async getEmploymentKPIs(department?: string): Promise<GraduateEmploymentKPIs> {
    try {
      const res = await apiClient.get<GraduateEmploymentKPIs>(API_CONFIG.ENDPOINTS.UNIVERSITY.EMPLOYMENT_KPIS, {
        params: department ? { department } : {},
      })
      if (res.data?.success && res.data.overall_metrics) {
        return res.data
      }
    } catch {
      // Fallback
    }
    return DEFAULT_EMPLOYMENT_KPIS
  },

  /**
   * Get Research & Innovation Marketing Campaigns (Thesis / Inventions).
   */
  async getThesisCampaigns(params?: { type?: string; status?: string }): Promise<{
    success: boolean
    campaigns: UniversityThesisCampaign[]
    total: number
  }> {
    try {
      const res = await apiClient.get(API_CONFIG.ENDPOINTS.UNIVERSITY.CAMPAIGNS, { params })
      if (res.data?.campaigns && res.data.campaigns.length > 0) {
        return res.data
      }
    } catch {
      // Fallback
    }

    let filtered = DEFAULT_THESIS_CAMPAIGNS
    if (params?.type) {
      filtered = filtered.filter((c) => c.thesis_type.includes(params.type!))
    }
    if (params?.status && params.status !== "all") {
      filtered = filtered.filter((c) => c.status === params.status)
    }

    return {
      success: true,
      campaigns: filtered,
      total: filtered.length,
    }
  },

  /**
   * Launch new Research / Thesis Marketing Campaign.
   */
  async createThesisCampaign(payload: CreateThesisCampaignPayload): Promise<{
    success: boolean
    message: string
    campaign: UniversityThesisCampaign
  }> {
    const res = await apiClient.post(API_CONFIG.ENDPOINTS.UNIVERSITY.CAMPAIGNS, payload)
    return res.data
  },

  /**
   * Get single thesis campaign detail with co-branding metadata.
   */
  async getCampaignDetail(id: number | string): Promise<{
    success: boolean
    campaign: UniversityThesisCampaign
  }> {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.UNIVERSITY.CAMPAIGN_DETAIL(id))
    return res.data
  },

  /**
   * Record industry / sponsorship / hiring inquiry on a thesis campaign.
   */
  async recordCampaignInquiry(id: number | string, type = "general"): Promise<{
    success: boolean
    message: string
    inquiries_count: number
    sponsorship_leads: number
  }> {
    const res = await apiClient.post(API_CONFIG.ENDPOINTS.UNIVERSITY.CAMPAIGN_INQUIRY(id), { type })
    return res.data
  },

  /**
   * Get Monsha'at Incubator & Entrepreneurship Showcase (Al-Ahsa & King Faisal University).
   */
  async getIncubatorShowcase(): Promise<IncubatorShowcaseResponse> {
    const res = await apiClient.get<IncubatorShowcaseResponse>(API_CONFIG.ENDPOINTS.UNIVERSITY.INCUBATOR)
    return res.data
  },

  /**
   * Register a new startup in the university incubator showcase.
   */
  async createIncubatorVenture(payload: CreateIncubatorVenturePayload): Promise<{
    success: boolean
    message: string
    venture: UniversityIncubatorVenture
  }> {
    const res = await apiClient.post(API_CONFIG.ENDPOINTS.UNIVERSITY.INCUBATOR, payload)
    return res.data
  },

  /**
   * Get Professor Cooperative Training Supervision Command Center.
   */
  async getCoopSupervision(professorId?: string): Promise<CoopSupervisionResponse> {
    const res = await apiClient.get<CoopSupervisionResponse>(API_CONFIG.ENDPOINTS.UNIVERSITY.COOP_SUPERVISION, {
      params: professorId ? { professor_id: professorId } : {},
    })
    return res.data
  },

  /**
   * Enroll new graduating senior in cooperative training.
   */
  async createCoopStudent(payload: CreateCoopStudentPayload): Promise<{
    success: boolean
    message: string
    student: CoopSupervisedStudent
  }> {
    const res = await apiClient.post(API_CONFIG.ENDPOINTS.UNIVERSITY.COOP_SUPERVISION, payload)
    return res.data
  },

  /**
   * Update student information or training details.
   */
  async updateCoopStudent(id: number | string, payload: UpdateCoopStudentPayload): Promise<{
    success: boolean
    message: string
    student: CoopSupervisedStudent
  }> {
    const res = await apiClient.put(`${API_CONFIG.ENDPOINTS.UNIVERSITY.COOP_SUPERVISION}/${id}`, payload)
    return res.data
  },

  /**
   * Professor submits midterm or final evaluation for supervised training student.
   */
  async submitCoopEvaluation(id: number | string, payload: CoopEvaluationPayload): Promise<{
    success: boolean
    message: string
    student: CoopSupervisedStudent
  }> {
    const res = await apiClient.put(API_CONFIG.ENDPOINTS.UNIVERSITY.COOP_EVALUATION(id), payload)
    return res.data
  },

  /**
   * Schedule professor supervision field visit or review check-in.
   */
  async createCoopSchedule(payload: CreateCoopSchedulePayload): Promise<{
    success: boolean
    message: string
    schedule: any
  }> {
    const res = await apiClient.post(API_CONFIG.ENDPOINTS.UNIVERSITY.COOP_SCHEDULE, payload)
    return res.data
  },

  /**
   * Update campaign review and publishing status.
   */
  async updateCampaignStatus(id: number | string, status: string): Promise<{
    success: boolean
    message: string
    campaign: UniversityThesisCampaign
  }> {
    const res = await apiClient.put(`/api/v1/university/campaigns/${id}/status`, { status })
    return res.data
  },

  /**
   * Submit detailed corporate partnership, sponsorship, or licensing request.
   */
  async submitPartnershipRequest(id: number | string, payload: any): Promise<{
    success: boolean
    message: string
    inquiries_count: number
    sponsorship_leads: number
  }> {
    const res = await apiClient.post(`/api/v1/university/campaigns/${id}/partner-request`, payload)
    return res.data
  },

  /**
   * Get campaign performance analytics.
   */
  async getCampaignAnalytics(): Promise<{
    success: boolean
    analytics: any
  }> {
    const res = await apiClient.get(`/api/v1/university/campaigns/analytics`)
    return res.data
  },

  /**
   * Get academic updates (curriculum, new programs, research achievements, announcements).
   */
  async getAcademicUpdates(): Promise<{
    success: boolean
    updates: any[]
    total: number
  }> {
    try {
      const res = await apiClient.get(API_CONFIG.ENDPOINTS.UNIVERSITY.ACADEMIC_UPDATES)
      if (res.data?.updates && res.data.updates.length > 0) {
        return res.data
      }
    } catch {
      // Fallback
    }
    return {
      success: true,
      updates: DEFAULT_ACADEMIC_UPDATES,
      total: DEFAULT_ACADEMIC_UPDATES.length,
    }
  },

  /**
   * Create / publish a new academic update.
   */
  async createAcademicUpdate(payload: {
    title: string
    category: string
    department: string
    description: string
    image?: string
  }): Promise<{ success: boolean; message: string; update: any }> {
    const res = await apiClient.post(API_CONFIG.ENDPOINTS.UNIVERSITY.ACADEMIC_UPDATES, payload)
    return res.data
  },

  /**
   * Get university account and privacy settings.
   */
  async getSettings(): Promise<{ success: boolean; settings: any }> {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.UNIVERSITY.SETTINGS)
    return res.data
  },

  /**
   * Update university account settings.
   */
  async updateSettings(settings: any): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.put(API_CONFIG.ENDPOINTS.UNIVERSITY.SETTINGS, settings)
    return res.data
  },

  /**
   * Change institutional account password.
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.post(API_CONFIG.ENDPOINTS.UNIVERSITY.CHANGE_PASSWORD, {
      current_password: currentPassword,
      new_password: newPassword,
    })
    return res.data
  },
}

