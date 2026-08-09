/**
 * features/public/components/FeaturedCompaniesSection.tsx
 *
 * Featured companies section for public home page.
 * Fully localized for Arabic (RTL), English (LTR), and Hindi (LTR).
 */
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { TiltCard } from "@/components/ui/tilt-card"
import { Button } from "@/components/ui/button"
import { Building2, ShieldCheck, Search, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react"
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"

export function FeaturedCompaniesSection() {
  const { t, language, isRTL } = useTranslation()
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  const employerPipelineSteps = language === "en" ? [
    {
      step: "01",
      title: "Verified Employer Presence",
      desc: "Set up company profile and official verification to protect your recruitment reputation.",
      icon: ShieldCheck,
    },
    {
      step: "02",
      title: "Post Jobs or Recruit Teams",
      desc: "Post individual vacancies or contract ready-to-execute multi-disciplinary teams.",
      icon: Building2,
    },
    {
      step: "03",
      title: "Explainable Candidate Matching",
      desc: "Rank applications based on skills and experience with transparent evaluation screens.",
      icon: Search,
    },
    {
      step: "04",
      title: "Professional Hiring Cycle",
      desc: "Issue offers and share respectful feedback with all applicants seamlessly.",
      icon: CheckCircle2,
    },
  ] : language === "hi" ? [
    {
      step: "01",
      title: "सत्यापित नियोक्ता उपस्थिति",
      desc: "अपनी भर्ती प्रतिष्ठा की सुरक्षा के लिए कंपनी प्रोफ़ाइल और आधिकारिक सत्यापन सेट करें।",
      icon: ShieldCheck,
    },
    {
      step: "02",
      title: "नौकरियां पोस्ट करें या टीमों की भर्ती करें",
      desc: "व्यक्तिगत रिक्तियां पोस्ट करें या निष्पादित करने के लिए तैयार बहु-विषयक टीमों का अनुबंध करें।",
      icon: Building2,
    },
    {
      step: "03",
      title: "स्पष्टीकरण योग्य उम्मीदवार मिलान",
      desc: "पारदर्शी मूल्यांकन स्क्रीन के साथ कौशल और अनुभव के आधार पर आवेदनों को रैंक करें।",
      icon: Search,
    },
    {
      step: "04",
      title: "पेशेवर भर्ती चक्र",
      desc: "प्रस्ताव जारी करें और सभी आवेदकों के साथ निर्बाध रूप से सम्मानजनक प्रतिक्रिया साझा करें।",
      icon: CheckCircle2,
    },
  ] : [
    {
      step: "01",
      title: "حضور مؤسسي موثق",
      desc: "إعداد بروفايل الشركة وتأكيد التوثيق بناءً على السجلات الرسمية لحماية سمعة التوظيف.",
      icon: ShieldCheck,
    },
    {
      step: "02",
      title: "نشر الفرص أو طلب فرق",
      desc: "نشر وظائف فردية مخصصة أو استقطاب فرق عمل كاملة لتغطية قدرات مشاريع معقدة.",
      icon: Building2,
    },
    {
      step: "03",
      title: "ترشيح ذكي وتقييم مسبب",
      desc: "ترتيب طلبات المتقدمين حسب الملاءمة مع شاشات تقييم موحدة تدعم قرارات مسؤولي التوظيف.",
      icon: Search,
    },
    {
      step: "04",
      title: "إغلاق التوظيف باحترافية",
      desc: "تقديم عروض التوظيف ومشاركة أسباب القرارات المحترمة مع كافة المتقدمين.",
      icon: CheckCircle2,
    },
  ]

  return (
    <section className="py-24 bg-background border-t border-white/5 relative overflow-hidden text-start">
      <div className="absolute top-1/2 end-0 -translate-y-1/2 translate-x-1/4 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[170px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl text-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mb-4">
              <Building2 className="w-3.5 h-3.5" />
              <span>{t("public.companies.sectionTitle")}</span>
            </div>
            <h2 className="text-3xl font-extrabold font-heading tracking-tight sm:text-4xl text-white mb-4">
              {t("public.companies.sectionSubtitle")}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {language === "en"
                ? "Faeda provides employers with tools to build a verified presence, publish opportunities, evaluate candidates, and manage hiring cycles smoothly."
                : language === "hi"
                ? "फ़ायदा नियोक्ताओं को एक सत्यापित उपस्थिति बनाने, अवसरों को प्रकाशित करने, उम्मीदवारों का मूल्यांकन करने और भर्ती चक्रों को सुचारू रूप से प्रबंधित करने के लिए उपकरण प्रदान करता है।"
                : "توفر فائدة لأصحاب العمل أدوات متكاملة لبناء سجل موثوق، نشر الفرص، تقييم المرشحين، وإدارة دورة التوظيف بسلاسة واقتدار."}
            </p>
          </div>
          <Link to={ROUTES.COMPANIES.LIST}>
            <Button variant="outline" className="hidden md:flex gap-2 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
              <span>{t("public.companies.viewAll")}</span>
              <ArrowIcon className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Employer Journey Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {employerPipelineSteps.map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
            >
              <TiltCard className="h-full rounded-[1.5rem]" tiltMaxAngle={6} shineOpacityMax={0.12}>
                <GlassCard className="p-6 flex flex-col justify-between h-full bg-card/40 backdrop-blur-md border-white/5 shadow-xl text-start">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary mb-6">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-primary font-bold block mb-1">
                      {language === "en" ? `Step ${item.step}` : language === "hi" ? `चरण ${item.step}` : `الخطوة ${item.step}`}
                    </span>
                    <h3 className="text-lg font-bold font-heading text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-white/5 text-[11px] text-muted-foreground/60 flex items-center justify-between">
                    <span>{t("companies.detail.verified")}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  </div>
                </GlassCard>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* Employer CTA Box */}
        <div className="p-8 rounded-3xl bg-card/60 border border-white/10 backdrop-blur-md max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-start shadow-2xl">
          <div className="space-y-1">
            <h3 className="text-xl font-bold font-heading text-white">
              {t("companies.detail.joinCtaTitle")}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t("companies.detail.joinCtaSubtitle")}
            </p>
          </div>
          <Link to={`${ROUTES.AUTH.REGISTER}?role=company`} className="shrink-0">
            <Button size="lg" className="rounded-xl px-8 bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-md shadow-primary/20">
              {t("public.cta.companyCta")}
            </Button>
          </Link>
        </div>

      </div>
    </section>
  )
}
