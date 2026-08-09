/**
 * features/public/components/CommunitySection.tsx
 *
 * Public community insights section for Home page.
 * Fully localized for Arabic (RTL) and English (LTR).
 */
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { BookOpen, ArrowLeft, ArrowRight, Calendar } from "lucide-react"
import { useTranslation } from "@/i18n"

export function CommunitySection() {
  const { t, language, isRTL } = useTranslation()
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  const insightsArticles = language === "en" ? [
    {
      title: "How to prepare your CV to pass automated ATS screening systems?",
      category: "Career Development",
      date: "August 2026",
    },
    {
      title: "Understanding market value & negotiating salaries based on real data",
      category: "Career Growth",
      date: "August 2026",
    },
    {
      title: "Integrated Team Hiring: Why leading employers contract whole teams",
      category: "Hiring Trends",
      date: "August 2026",
    },
  ] : [
    {
      title: "كيف تجهز سيرتك الذاتية لاجتياز أنظمة الفرز الذكي (ATS)؟",
      category: "التطوير المهني",
      date: "أغسطس 2026",
    },
    {
      title: "مفهوم القيمة السوقية وكيف تفاوض على الراتب بناءً على المعطيات",
      category: "إدارة المسار",
      date: "أغسطس 2026",
    },
    {
      title: "التوظيف الجماعي: لماذا تفضل الشركات استقطاب فرق متكاملة؟",
      category: "ثقافة التوظيف",
      date: "أغسطس 2026",
    },
  ]

  return (
    <section className="py-16 bg-background border-t border-white/5 relative overflow-hidden text-start">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex items-center justify-between mb-8 max-w-6xl mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">{t("public.community.sectionTitle")}</h2>
          </div>
          <span className="text-xs sm:text-sm text-muted-foreground">{t("public.community.sectionSubtitle")}</span>
        </div>

        {/* Compact Knowledge Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {insightsArticles.map((art, idx) => (
            <motion.div
              key={art.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <GlassCard className="p-6 sm:p-7 flex flex-col justify-between bg-card/40 border-white/5 hover:border-primary/30 transition-all text-start h-full">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded text-xs font-bold bg-primary/10 border border-primary/20 text-primary">
                      {art.category}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> {art.date}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white line-clamp-2 leading-relaxed mb-4">{art.title}</h3>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs sm:text-sm text-primary font-bold">
                  <span>{t("public.community.viewBlog")}</span>
                  <ArrowIcon className="w-4 h-4" />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
