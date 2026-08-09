/**
 * features/public/components/WhyFaedaSection.tsx
 *
 * Why Faeda section for public home page.
 * Fully localized for Arabic (RTL), English (LTR), and Hindi (LTR).
 */
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { ShieldCheck, Sparkles, UserCheck, Layers, Award, ArrowLeft, ArrowRight, RefreshCw } from "lucide-react"
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"

export function WhyFaedaSection() {
  const { t, language, isRTL } = useTranslation()
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  const advantages = language === "en" ? [
    {
      num: "01",
      title: "Unified Professional Identity",
      desc: "A verified professional identity holding your experience and projects in one place.",
      icon: UserCheck,
      tag: "Permanent Identity",
    },
    {
      num: "02",
      title: "Explainable AI Guidance",
      desc: "Clear recommendations and salary ranges without blackbox algorithms.",
      icon: Sparkles,
      tag: "Transparent AI",
    },
    {
      num: "03",
      title: "Interconnected Ecosystem",
      desc: "Direct integration connecting professionals, employers, teams, and education.",
      icon: Layers,
      tag: "Single Platform",
    },
    {
      num: "04",
      title: "Respectful Hiring Experience",
      desc: "Transparent tracking and reasoning behind recruitment decisions.",
      icon: ShieldCheck,
      tag: "High Integrity",
    },
  ] : language === "hi" ? [
    {
      num: "01",
      title: "एकीकृत पेशेवर पहचान",
      desc: "एक ही स्थान पर आपके अनुभव और परियोजनाओं को रखने वाली एक सत्यापित पेशेवर पहचान।",
      icon: UserCheck,
      tag: "स्थायी पहचान",
    },
    {
      num: "02",
      title: "स्पष्टीकरण योग्य एआई मार्गदर्शन",
      desc: "ब्लैकबॉक्स एल्गोरिदम के बिना स्पष्ट सिफारिशें और वेतन सीमाएँ।",
      icon: Sparkles,
      tag: "पारदर्शी एआई",
    },
    {
      num: "03",
      title: "आपस में जुड़ा पारिस्थितिकी तंत्र",
      desc: "पेशेवरों, नियोक्ताओं, टीमों और शिक्षा को जोड़ने वाला सीधा एकीकरण।",
      icon: Layers,
      tag: "एकल मंच",
    },
    {
      num: "04",
      title: "सम्मानजनक भर्ती अनुभव",
      desc: "भर्ती निर्णयों के पीछे पारदर्शी ट्रैकिंग और तर्क।",
      icon: ShieldCheck,
      tag: "उच्च सत्यनिष्ठा",
    },
  ] : [
    {
      num: "01",
      title: "هوية مهنية موحدة",
      desc: "بروفايل احترافي موثق يحفظ خبراتك ومشاريعك في مكان واحد.",
      icon: UserCheck,
      tag: "هوية دائمة",
    },
    {
      num: "02",
      title: "ذكاء مفسر وواضح",
      desc: "توصيات ونطاق راتبي واضح الأسباب بدون خوارزميات غامضة.",
      icon: Sparkles,
      tag: "توصيات مفسرة",
    },
    {
      num: "03",
      title: "منظومة مترابطة الأطراف",
      desc: "ربط مباشر بين المرشحين والشركات والفرق والجامعات.",
      icon: Layers,
      tag: "بيئة موحدة",
    },
    {
      num: "04",
      title: "تجربة توظيف محترمة",
      desc: "خط تتبع شفاف وإشعارات مسببة تدعم نموك المهني.",
      icon: ShieldCheck,
      tag: "شفافية عالية",
    },
  ]

  return (
    <section className="py-20 bg-background border-t border-white/5 relative overflow-hidden text-start">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[170px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>{t("public.features.sectionTitle")}</span>
          </div>

          <h2 className="text-3xl font-extrabold font-heading text-white mb-2">
            {t("public.features.sectionSubtitle")}
          </h2>
        </div>

        {/* Central Faeda Core Node */}
        <div className="hidden lg:flex items-center justify-center mb-8">
          <div className="px-8 py-3 rounded-full bg-primary/20 border border-primary/40 text-white font-heading font-extrabold text-sm flex items-center gap-3 shadow-xl shadow-primary/20 backdrop-blur-md">
            <RefreshCw className="w-4 h-4 text-primary animate-spin" style={{ animationDuration: "14s" }} />
            <span>
              {language === "en" ? "Faeda Hub Architecture" : language === "hi" ? "फ़ायदा हब वास्तुकला" : "Faeda Hub Architecture"}
            </span>
          </div>
        </div>

        {/* 4 Connected Advantage Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-10">
          {advantages.map((adv, idx) => (
            <motion.div
              key={adv.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <GlassCard className="p-7 sm:p-8 flex flex-col justify-between h-full bg-card/50 backdrop-blur-md border-white/10 hover:border-primary/40 transition-all text-start shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 start-0 end-0 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <adv.icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-sm font-bold text-muted-foreground">{adv.num}</span>
                  </div>

                  <h3 className="text-xl font-bold font-heading text-white mb-2.5">{adv.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{adv.desc}</p>
                </div>

                <div className="pt-4 mt-5 border-t border-white/5 flex items-center justify-between text-xs sm:text-sm text-primary font-bold">
                  <span>{adv.tag}</span>
                  <ArrowIcon className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to={ROUTES.AUTH.REGISTER}>
            <button className="px-7 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg shadow-primary/25 transition-all hover:scale-105">
              <span>{t("about.hero.ctaRegister")}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>

      </div>
    </section>
  )
}
