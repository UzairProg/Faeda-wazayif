/**
 * features/public/components/AIExperienceSection.tsx
 *
 * Public AI Experience section for Home page ("الذكاء يساعدك، والقرار لك").
 * Fully localized for Arabic (RTL), English (LTR), and Hindi (LTR).
 */
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { TiltCard } from "@/components/ui/tilt-card"
import { Button } from "@/components/ui/button"
import { Sparkles, UserCheck, Check, Edit3, X, Bot, CornerDownLeft } from "lucide-react"
import { useTranslation } from "@/i18n"

export function AIExperienceSection() {
  const [activeDemoId, setActiveDemoId] = useState("ats")
  const [actionStatus, setActionStatus] = useState<string | null>(null)
  const { t, language } = useTranslation()

  const aiDemos = language === "en" ? [
    {
      id: "ats",
      prompt: "How can I improve my CV alignment for Frontend opportunities?",
      badge: "Smart ATS Advisor",
      analysis: "Found 3 missing keywords in experience section (System Architecture, CI/CD, Performance Optimization).",
      suggestion: "Add a quantitative achievement demonstrating 30% UI performance boost along with TypeScript documentation.",
    },
    {
      id: "interview",
      prompt: "What are the top 3 questions expected in a Senior Frontend interview?",
      badge: "Interview Simulator",
      analysis: "Analyzed hiring trends from tech employers for 2026.",
      suggestion: "Q1: How do you handle State Management at enterprise scale? Q2: Explain SSR performance optimization.",
    },
    {
      id: "growth",
      prompt: "What is my next best step to increase my salary market value?",
      badge: "Trajectory Coach",
      analysis: "Compared your skills against high market demand for Cloud & Fullstack.",
      suggestion: "Obtaining AWS Cloud Practitioner certification increases expected monthly salary range by SAR 2,500.",
    },
  ] : language === "hi" ? [
    {
      id: "ats",
      prompt: "मैं फ़्रंटएंड अवसरों के लिए अपने सीवी संरेखण में कैसे सुधार कर सकता हूं?",
      badge: "स्मार्ट एटीएस सलाहकार",
      analysis: "अनुभव अनुभाग में 3 लापता कीवर्ड मिले (सिस्टम आर्किटेक्चर, सीआई/सीडी, प्रदर्शन अनुकूलन)।",
      suggestion: "TypeScript दस्तावेज़ीकरण के साथ 30% UI प्रदर्शन वृद्धि का प्रदर्शन करने वाली एक मात्रात्मक उपलब्धि जोड़ें।",
    },
    {
      id: "interview",
      prompt: "वरिष्ठ फ़्रंटएंड साक्षात्कार में अपेक्षित शीर्ष 3 प्रश्न क्या हैं?",
      badge: "साक्षात्कार सिम्युलेटर",
      analysis: "2026 के लिए टेक नियोक्ताओं से भर्ती रुझानों का विश्लेषण किया गया।",
      suggestion: "प्रश्न 1: आप एंटरप्राइज स्केल पर स्टेट मैनेजमेंट को कैसे संभालते हैं? प्रश्न 2: SSR प्रदर्शन अनुकूलन समझाएं।",
    },
    {
      id: "growth",
      prompt: "मेरे वेतन बाजार मूल्य को बढ़ाने के लिए मेरा अगला सबसे अच्छा कदम क्या है?",
      badge: "प्रक्षेपवक्र कोच",
      analysis: "क्लाउड और फुलस्टैक की उच्च बाजार मांग के खिलाफ आपके कौशलों की तुलना की गई।",
      suggestion: "AWS क्लाउड प्रैक्टिशनर प्रमाणन प्राप्त करने से अपेक्षित मासिक वेतन सीमा में 2,500 SAR की वृद्धि होती है।",
    },
  ] : [
    {
      id: "ats",
      prompt: "كيف أرفع توافق سيرتي الذاتية لفرص تطوير الواجهات؟",
      badge: "مُحلل ATS الحكيم",
      analysis: "تم العثور على 3 كلمات مفتاحية غائبة في قسم الخبرة (System Architecture, CI/CD, Performance Optimization).",
      suggestion: "إضافة إنجاز رقمي يوضح تحسين أداء الواجهات بنسبة 30% مع توثيق مهارة TypeScript.",
    },
    {
      id: "interview",
      prompt: "ما هي أهم 3 أسئلة متوقعة لمقابلة Senior Frontend؟",
      badge: "محاكي المقابلات",
      analysis: "تحليل نمط مقابلات شركات التقنية بالرياض لعام 2026.",
      suggestion: "السؤال 1: كيف تدير State Management في تطبيقات الضخمة؟ السؤال 2: شرح تحسين SSR والـ Hydration.",
    },
    {
      id: "growth",
      prompt: "ما هي الخطوة القادمة لزيادة القيمة السوقية لراتبي؟",
      badge: "مستشار المسار",
      analysis: "مقارنة مؤهلاتك بالطلب العالي على مهندسي Cloud & Fullstack.",
      suggestion: "الحصول على شهادة AWS Cloud Practitioner يقفز بنطاق الراتب المستحق بمقدار 2,500 SAR شهرياً.",
    },
  ]

  const activeDemo = aiDemos.find((d) => d.id === activeDemoId) || aiDemos[0]

  return (
    <section className="py-20 bg-background border-t border-white/5 relative overflow-hidden text-start">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("about.ai.title")}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white mb-2">
            {t("public.ai.sectionTitle")}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t("public.ai.sectionSubtitle")}
          </p>
        </div>

        {/* Demo Selection Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {aiDemos.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                setActiveDemoId(d.id)
                setActionStatus(null)
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                d.id === activeDemoId
                  ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                  : "bg-card/50 text-muted-foreground border border-white/10 hover:text-white"
              }`}
            >
              {d.badge}
            </button>
          ))}
        </div>

        {/* Single Interactive AI Workspace Mockup */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDemo.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto"
          >
            <TiltCard tiltEnabled={false} shineEnabled={true} shineOpacityMax={0.12} className="rounded-[2rem]">
              <GlassCard className="p-6 sm:p-10 bg-card/60 backdrop-blur-md border-white/10 shadow-2xl text-start">
                
                {/* User Prompt Entry */}
                <div className="p-4 sm:p-5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between mb-5 text-xs sm:text-base text-white">
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-5 h-5 text-primary shrink-0" />
                    <span className="font-semibold">{activeDemo.prompt}</span>
                  </div>
                  <CornerDownLeft className="w-4 h-4 text-muted-foreground shrink-0" />
                </div>

                {/* AI Assistant Output */}
                <div className="p-5 sm:p-6 rounded-xl bg-primary/10 border border-primary/20 mb-6 space-y-2.5">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs sm:text-sm">
                    <Bot className="w-5 h-5" />
                    <span>{t("about.ai.suggest")} ({activeDemo.badge}):</span>
                  </div>
                  <p className="text-xs sm:text-base text-white/90 leading-relaxed">{activeDemo.suggestion}</p>
                </div>

                {/* Human Ownership Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-white/10 text-xs sm:text-sm">
                  <span className="text-muted-foreground text-xs sm:text-sm">{t("about.ai.decide")}:</span>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      size="sm"
                      onClick={() => setActionStatus(language === "en" ? "Recommendation applied!" : language === "hi" ? "सिफारिश लागू की गई!" : "تم تطبيق التوصية بحسابك!")}
                      className="rounded-lg px-5 bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm h-10 gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      {language === "en" ? "Apply Recommendation" : language === "hi" ? "सिफारिश लागू करें" : "تطبيق التوصية"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setActionStatus(language === "en" ? "Editing screen opened" : language === "hi" ? "संपादन स्क्रीन खोली गई" : "فتح شاشة التعديل")}
                      className="rounded-lg px-5 border-white/10 bg-white/5 text-white text-xs sm:text-sm h-10 gap-1.5"
                    >
                      <Edit3 className="w-4 h-4" />
                      {t("common.actions.edit")}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setActionStatus(language === "en" ? "Recommendation dismissed" : language === "hi" ? "सिफारिश खारिज की गई" : "تم تجاهل التوصية")}
                      className="rounded-lg px-4 text-muted-foreground hover:text-white text-xs sm:text-sm h-10 gap-1.5"
                    >
                      <X className="w-4 h-4" />
                      {language === "en" ? "Dismiss" : language === "hi" ? "खारिज करें" : "تجاهل"}
                    </Button>
                  </div>
                </div>

                {actionStatus && (
                  <p className="text-center text-xs sm:text-sm font-bold text-primary mt-4 font-mono">{actionStatus}</p>
                )}

              </GlassCard>
            </TiltCard>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  )
}
