import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { TiltCard } from "@/components/ui/tilt-card"
import { Button } from "@/components/ui/button"
import { Sparkles, ShieldCheck, UserCheck, Check, Edit3, X, Bot, CornerDownLeft } from "lucide-react"

const aiDemos = [
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

export function AIExperienceSection() {
  const [activeDemoId, setActiveDemoId] = useState("ats")
  const [actionStatus, setActionStatus] = useState<string | null>(null)

  const activeDemo = aiDemos.find((d) => d.id === activeDemoId) || aiDemos[0]

  return (
    <section className="py-20 bg-background border-t border-white/5 relative overflow-hidden">
      {/* Soft Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>"الذكاء يساعدك، والقرار لك"</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white mb-2">
            مساحة الذكاء المساعد الشفاف
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            توصيات مفيدة تمنحك التحليل الكامل وتترك لك التحكم والقرار النهائي.
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
            className="max-w-3xl mx-auto"
          >
            <TiltCard tiltEnabled={false} shineEnabled={true} shineOpacityMax={0.12} className="rounded-[2rem]">
              <GlassCard className="p-6 bg-card/60 backdrop-blur-md border-white/10 shadow-2xl text-start">
                
                {/* User Prompt Entry */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between mb-4 text-xs text-white">
                  <div className="flex items-center gap-2.5">
                    <UserCheck className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-semibold">{activeDemo.prompt}</span>
                  </div>
                  <CornerDownLeft className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                </div>

                {/* AI Assistant Output */}
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 mb-6 space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs">
                    <Bot className="w-4 h-4" />
                    <span>تحليل فائدة المساعد ({activeDemo.badge}):</span>
                  </div>
                  <p className="text-xs text-white/90 leading-relaxed">{activeDemo.suggestion}</p>
                </div>

                {/* Human Ownership Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10 text-xs">
                  <span className="text-muted-foreground text-[11px]">القرار لك:</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => setActionStatus("تم تطبيق التوصية بحسابك!")}
                      className="rounded-lg px-4 bg-primary hover:bg-primary/90 text-white font-bold text-xs h-8 gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      تطبيق التوصية
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setActionStatus("فتح شاشة التعديل")}
                      className="rounded-lg px-4 border-white/10 bg-white/5 text-white text-xs h-8 gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      تعديل
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setActionStatus("تم تجاهل التوصية")}
                      className="rounded-lg px-3 text-muted-foreground hover:text-white text-xs h-8 gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      تجاهل
                    </Button>
                  </div>
                </div>

                {actionStatus && (
                  <p className="text-center text-xs font-bold text-primary mt-3 font-mono">{actionStatus}</p>
                )}

              </GlassCard>
            </TiltCard>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  )
}
