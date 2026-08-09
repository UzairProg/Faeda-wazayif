/**
 * features/public/components/about/AudienceSwitcher.tsx
 *
 * Interactive role switcher section for the About page.
 * Allows visitors to see how Faeda addresses each specific audience while keeping them connected.
 */
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Building2, User, GraduationCap, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/config/routes"

const ROLES = [
  {
    id: "candidate",
    label: "الكفاءات والباحثون",
    icon: User,
    headline: "بناء الهوية ونمو المسار المهني",
    desc: "تمكن فائدة الباحثين عن عمل والمهنيين من بناء حضور موثوق، ومعرفة القيمة السوقية، والتفاعل مع الفرص الأكثر ملاءمة.",
    highlights: ["سيرة ذاتية متوافقة مع ATS", "محاكاة المقابلات بالذكاء", "ترشيحات وظيفية مفسرة", "تصفح بيئات العمل الموثقة"],
    ctaText: "استكشف وظائف المنظومة",
    ctaHref: ROUTES.JOBS.LIST,
  },
  {
    id: "employer",
    label: "الشركات وأصحاب العمل",
    icon: Building2,
    headline: "استقطاب الكفاءات وبناء بيئة عمل موثوقة",
    desc: "توفر فائدة للشركات مسار توظيف شفاف للوصول المباشر إلى أفضل الكفاءات والفرق التخصصية بدون تشتت.",
    highlights: ["ملف منشأة موثق رسمياً", "نشر إدارة الوظائف", "خط توظيف شفاف", "وصول لسوق الفرق التخصصية"],
    ctaText: "تصفح دليل الشركات",
    ctaHref: ROUTES.COMPANIES.LIST,
  },
  {
    id: "teams",
    label: "الفرق التخصصية",
    headline: "استقطاب القدرات التراكمية المكتملة",
    icon: Users,
    desc: "تمكن فائدة الكفاءات من إنشاء فرق تخصصية تجمع الخبرات وتتقدم للمشاريع الكبيرة كقدرة واحدة مجمعة.",
    highlights: ["ملف تخصصي للفريق", "عرض المهارات التراكمية", "التقديم المباشر للفرص", "إبراز أعضاء الطاقم"],
    ctaText: "سوق الفرق التخصصية",
    ctaHref: ROUTES.TEAMS.LIST,
  },
  {
    id: "education",
    label: "المؤسسات التعليمية",
    headline: "ربط مخرجات التأهيل باحتياجات السوق",
    isFuture: true,
    icon: GraduationCap,
    desc: "مسار مستقبلي يربط المؤسسات التعليمية والتدريبية بإشارات حية من سوق العمل لدعم خريجيها.",
    highlights: ["ربط خريجي البرامج بالسوق", "تحديد المهارات المطلوبة حيّاً", "رصد مسارات التوظيف"],
    ctaText: "تعرف على اتجاه فائدة",
    ctaHref: ROUTES.PUBLIC.ABOUT,
  },
]

export function AudienceSwitcher() {
  const [selectedId, setSelectedId] = useState<string>("candidate")
  const activeRole = ROLES.find((r) => r.id === selectedId) || ROLES[0]

  return (
    <section className="py-16 relative text-start">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider block mb-2">
            لمن نبني المنظومة؟
          </span>
          <h2 className="text-2xl font-extrabold font-heading text-white sm:text-4xl leading-tight">
            مصممة حول المشاركين، ومترابطة بينهم
          </h2>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {ROLES.map((role) => {
            const IconComp = role.icon
            const isSelected = role.id === selectedId
            return (
              <button
                key={role.id}
                onClick={() => setSelectedId(role.id)}
                className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                  isSelected
                    ? "bg-primary text-white shadow-lg shadow-primary/20 border border-primary/50"
                    : "bg-white/5 text-muted-foreground border border-white/10 hover:text-white hover:bg-white/10"
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{role.label}</span>
                {role.isFuture && (
                  <span className="text-[10px] font-mono font-normal opacity-80 me-1">(قريباً)</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Role Content Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard className="p-6 sm:p-10 bg-card/60 backdrop-blur-md border-white/10 shadow-2xl relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                <div className="lg:col-span-8 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold font-mono">
                    {activeRole.label}
                  </div>

                  <h3 className="text-xl sm:text-3xl font-extrabold font-heading text-white">
                    {activeRole.headline}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {activeRole.desc}
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {activeRole.highlights.map((h, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-white font-medium flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/5 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                    <activeRole.icon className="w-8 h-8" />
                  </div>

                  <Link to={activeRole.ctaHref} className="w-full">
                    <Button className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs gap-1.5 shadow-md">
                      <span>{activeRole.ctaText}</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>

              </div>
            </GlassCard>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  )
}
