/**
 * features/university/pages/UniversityAcademicUpdatesPage.tsx
 *
 * Academic Updates & Institutional Announcements Center.
 * Showcases:
 * - Curriculum Updates
 * - New Academic Programs
 * - Research Achievements
 * - Faculty Achievements
 * - Student Achievements
 * - University Announcements
 */
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "@/i18n"
import { universityService } from "../services/university.service"
import { tl } from "../utils/universityLocalization"
import type { AcademicUpdateItem } from "../types/university.types"
import {
  BookOpen,
  GraduationCap,
  Award,
  Sparkles,
  Trophy,
  Bell,
  Search,
  Plus,
  Calendar,
  Layers,
  X,
  CheckCircle2,
} from "lucide-react"

export function UniversityAcademicUpdatesPage() {
  const { isRTL, language } = useTranslation()
  const [updates, setUpdates] = useState<AcademicUpdateItem[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<{
    title: string
    category: AcademicUpdateItem["category"]
    department: string
    description: string
    image: string
  }>({
    title: "",
    category: "curriculum",
    department: "كلية علوم الحاسب وتقنية المعلومات",
    description: "",
    image: "",
  })
  const [successToast, setSuccessToast] = useState(false)

  const defaultUpdates: AcademicUpdateItem[] = [
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
      description_hi: "औद्योगिक सलाहकार बोर्ड की सिफारिशों के अनुसार एलएलएम इंजीनियरिंग और उन्नत साइबर रक्षा में 4 नए प्रयोगशाला पाठ्यक्रमों को शामिल किया गया।",
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
      description_hi: "सऊदी बौद्धिक संपदा प्राधिकरण द्वारा 35% कम ऊर्जा खपत वाले नैनोमेम्ब्रेन को पेटेंट प्रदान किया गया।",
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

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const res = await universityService.getAcademicUpdates()
        if (res.success && res.updates && res.updates.length > 0) {
          setUpdates(res.updates)
        } else {
          setUpdates(defaultUpdates)
        }
      } catch {
        setUpdates(defaultUpdates)
      }
    }
    fetchUpdates()
  }, [])

  const categories = [
    { id: "all", label_ar: "جميع التحديثات", label_en: "All Updates", label_hi: "सभी अपडेट", icon: Sparkles },
    { id: "curriculum", label_ar: "تحديثات المناهج", label_en: "Curriculum Updates", label_hi: "पाठ्यक्रम अपडेट", icon: BookOpen },
    { id: "new_programs", label_ar: "برامج أكاديمية جديدة", label_en: "New Programs", label_hi: "नए कार्यक्रम", icon: GraduationCap },
    { id: "research_achievement", label_ar: "إنجازات بحثية وبراءات", label_en: "Research & Patents", label_hi: "अनुसंधान और पेटेंट", icon: Award },
    { id: "faculty_achievement", label_ar: "إنجازات هيئة التدريس", label_en: "Faculty Achievements", label_hi: "संकाय उपलब्धियां", icon: Trophy },
    { id: "student_achievement", label_ar: "إنجازات الطلاب والجوائز", label_en: "Student Achievements", label_hi: "छात्र उपलब्धियां", icon: Award },
    { id: "university_announcement", label_ar: "إعلانات الجامعة الرسمية", label_en: "Announcements", label_hi: "आधिकारिक घोषणाएं", icon: Bell },
  ]

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "curriculum":
        return { label: tl(language, "تحديث مناهج", "Curriculum", "पाठ्यक्रम"), color: "bg-primary/15 text-primary border-primary/30" }
      case "new_programs":
        return { label: tl(language, "برنامج جديد", "New Program", "नया कार्यक्रम"), color: "bg-secondary/15 text-secondary border-secondary/30" }
      case "research_achievement":
        return { label: tl(language, "إنجاز بحثي", "Research", "अनुसंधान"), color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" }
      case "faculty_achievement":
        return { label: tl(language, "هيئة التدريس", "Faculty", "संकाय"), color: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30" }
      case "student_achievement":
        return { label: tl(language, "إنجاز طلابي", "Students", "छात्र"), color: "bg-amber-500/15 text-amber-400 border-amber-500/30" }
      default:
        return { label: tl(language, "إعلان رسمي", "Announcement", "घोषणा"), color: "bg-sky-500/15 text-sky-400 border-sky-500/30" }
    }
  }

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.description.trim()) return

    const newUpdate: AcademicUpdateItem = {
      id: Date.now(),
      title_ar: formData.title,
      title_en: formData.title,
      category: formData.category,
      department: formData.department,
      date: new Date().toISOString().split("T")[0],
      description_ar: formData.description,
      description_en: formData.description,
      image: formData.image || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&fit=crop",
    }

    setUpdates([newUpdate, ...updates])
    setIsModalOpen(false)
    setFormData({
      title: "",
      category: "curriculum",
      department: "كلية علوم الحاسب وتقنية المعلومات",
      description: "",
      image: "",
    })
    setSuccessToast(true)
    setTimeout(() => setSuccessToast(false), 4000)
  }

  const filteredUpdates = updates.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory
    const title = language === "ar" ? item.title_ar : item.title_en
    const desc = language === "ar" ? item.description_ar : item.description_en
    const matchesSearch =
      searchQuery === "" ||
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-8" dir={isRTL ? "rtl" : "ltr"}>
      {/* Toast Notification */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-8 z-50 flex items-center gap-3 p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 backdrop-blur-xl shadow-2xl"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold">
              {tl(language, "تم نشر التحديث الأكاديمي بنجاح في المنظومة!", "Academic update published successfully!", "अकादमिक अपडेट सफलतापूर्वक प्रकाशित हुआ!")}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-primary/20 via-[#0F2247]/90 to-background p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-90" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{tl(language, "مركز التحديثات الأكاديمية والبحثية", "Academic & Research Updates", "शैक्षणिक और अनुसंधान अपडेट")}</span>
              </span>
            </div>
            <h1 className="text-2xl font-black text-white md:text-3xl tracking-tight font-heading">
              {tl(language, "التحديثات الأكاديمية والمناهج والإنجازات", "Academic Updates, Curricula & Achievements", "शैक्षणिक अपडेट, पाठ्यक्रम और उपलब्धियां")}
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              {tl(
                language,
                "رصد فوري لجميع التعديلات على الخطط الدراسية، البرامج المستحدثة، براءات الاختراع والجوائز الوطنية المتصلة بالجامعة.",
                "Live registry of curriculum revisions, newly accredited academic degrees, patent awards, and institutional recognitions.",
                "पाठ्यक्रम संशोधन, नव मान्यता प्राप्त डिग्री, पेटेंट और विश्वविद्यालय से जुड़ी राष्ट्रीय उपलब्धियों का लाइव रिकॉर्ड।"
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-lg shadow-primary/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{tl(language, "نشر تحديث أكاديمي جديد", "Publish Academic Update", "नया शैक्षणिक अपडेट जोड़ें")}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon
            const isSelected = activeCategory === cat.id
            const label = language === "ar" ? cat.label_ar : language === "hi" ? cat.label_hi : cat.label_en
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border ${
                  isSelected
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
                    : "bg-card/80 text-muted-foreground border-border hover:border-primary/40 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            )
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 start-3 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={tl(language, "بحث في التحديثات الأكاديمية...", "Search academic updates...", "अकादमिक अपडेट खोजें...")}
            className="w-full ps-9 pe-4 py-2.5 rounded-2xl bg-card/90 border border-border text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Updates Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredUpdates.map((item) => {
          const badge = getCategoryBadge(item.category)
          const title = language === "ar" ? item.title_ar : item.title_en
          const desc = language === "ar" ? item.description_ar : item.description_en
          return (
            <motion.div
              key={item.id}
              layout
              className="group relative overflow-hidden rounded-3xl border border-border bg-card/85 backdrop-blur-xl p-5 hover:border-primary/50 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Optional Image */}
                {item.image && (
                  <div className="h-44 w-full rounded-2xl overflow-hidden border border-border/60 relative">
                    <img
                      src={item.image}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 start-3">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-primary" />
                      <span>{item.department}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-secondary" />
                      <span>{item.date}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors font-heading leading-snug">
                    {title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {desc}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-border/80 flex items-center justify-between text-[11px] text-primary font-bold">
                <span className="group-hover:text-accent transition-colors">
                  {tl(language, "التفاصيل وتعميم الكلية", "View Full Dossier", "विस्तृत विवरण देखें")}
                </span>
                <span className="p-1.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  →
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {filteredUpdates.length === 0 && (
        <div className="p-12 text-center rounded-3xl border border-border bg-card/40">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h4 className="text-sm font-bold text-white">
            {tl(language, "لا توجد تحديثات أكاديمية مطابقة", "No matching academic updates found", "कोई मेल खाता अपडेट नहीं मिला")}
          </h4>
          <p className="text-xs text-muted-foreground mt-1">
            {tl(language, "جرّب تغيير فئة البحث أو مسح الكلمات المفتاحية.", "Try changing the filter or search term.", "फ़िल्टर या खोज शब्द बदलने का प्रयास करें।")}
          </p>
        </div>
      )}

      {/* Create Update Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-lg rounded-3xl border border-border bg-[#0F2247] p-6 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div className="flex items-center gap-2 text-primary">
                <BookOpen className="w-5 h-5" />
                <h3 className="text-base font-bold text-white font-heading">
                  {tl(language, "إضافة تحديث أكاديمي جديد", "Publish New Academic Update", "नया शैक्षणिक अपडेट जोड़ें")}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-muted-foreground hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {tl(language, "عنوان التحديث الأكاديمي", "Update Title", "शीर्षक")} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={tl(language, "مثال: تحديث الخطة الدراسية لقسم هندسة البرمجيات", "e.g. Software Engineering Curriculum Update", "उदा. सॉफ्टवेयर इंजीनियरिंग पाठ्यक्रम अपडेट")}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {tl(language, "فئة التحديث", "Category", "श्रेणी")}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-white focus:outline-none focus:border-primary"
                  >
                    <option value="curriculum">{tl(language, "تحديث مناهج", "Curriculum", "पाठ्यक्रम")}</option>
                    <option value="new_programs">{tl(language, "برنامج جديد", "New Program", "नया कार्यक्रम")}</option>
                    <option value="research_achievement">{tl(language, "إنجاز بحثي", "Research", "अनुसंधान")}</option>
                    <option value="faculty_achievement">{tl(language, "هيئة التدريس", "Faculty", "संकाय")}</option>
                    <option value="student_achievement">{tl(language, "إنجاز طلابي", "Students", "छात्र")}</option>
                    <option value="university_announcement">{tl(language, "إعلان رسمي", "Announcement", "घोषणा")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {tl(language, "القسم / الكلية", "Department", "विभाग")}
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {tl(language, "الوصف التفصيلي والقرارات", "Detailed Description", "विस्तृत विवरण")} *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={tl(language, "اكتب تفاصيل التحديث وقرار المجلس العلمي...", "Details of the curriculum revision or achievement...", "विवरण यहाँ लिखें...")}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-white focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {tl(language, "رابط الصورة (اختياري)", "Image URL (Optional)", "छवि URL (वैकल्पिक)")}
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2 rounded-xl bg-background border border-border text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/80">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-muted-foreground hover:text-white"
                >
                  {tl(language, "إلغاء", "Cancel", "रद्द करें")}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 shadow-md shadow-primary/25"
                >
                  {tl(language, "نشر التحديث", "Publish Update", "प्रकाशित करें")}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
