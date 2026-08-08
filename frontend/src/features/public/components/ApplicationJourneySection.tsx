import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { TiltCard } from "@/components/ui/tilt-card"
import { Send, FileSearch, Calendar, CheckCircle2, MessageSquareText, ShieldCheck } from "lucide-react"

const appPipeline = [
  {
    id: "submit",
    step: "01",
    title: "تم إرسال الطلب",
    desc: "تم حفظ لقطة غير قابلة للتعديل من مؤهلاتك وقت التقديم.",
    icon: Send,
    badge: "مكتمل",
    details: "تأكيد فوري للتقديم مع حفظ نسخة السيرة الذاتية الرسمية وقت إرسال الطلب.",
  },
  {
    id: "review",
    step: "02",
    title: "قيد المراجعة والترشيح",
    desc: "مطابقة ملفك مع معايير الكفاءة الشفافة للفرصة.",
    icon: FileSearch,
    badge: "نشط الان",
    details: "فحص متطلبات الوظيفة وعرض ترتيب التنافس المعياري بدون حجب تلقائي.",
  },
  {
    id: "interview",
    step: "03",
    title: "المقابلة والاختبار",
    desc: "تنسيق المقابلة الشفهية أو الاختبار التقني مباشرة.",
    icon: Calendar,
    badge: "مجدول",
    details: "تنبيه بالمواعيد ورابط المقابلة وحزمة النصائح التحضيرية المخصصة للشركة.",
  },
  {
    id: "decision",
    step: "04",
    title: "القرار والتقرير المحترم",
    desc: "استلام إشعار مسبب بالقبول أو تقرير الرفض المحترم.",
    icon: CheckCircle2,
    badge: "مضمون",
    details: "تقرير ختامي مسبب يحتوي على أسباب القبول أو الملاحظات البناءة لفرصك القادمة.",
  },
]

export function ApplicationJourneySection() {
  const [activeStageId, setActiveStageId] = useState("review")

  const activeStage = appPipeline.find((s) => s.id === activeStageId) || appPipeline[1]

  return (
    <section className="py-20 bg-background border-t border-white/5 relative overflow-hidden">
      {/* Ambient Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-3">
            <MessageSquareText className="w-3.5 h-3.5" />
            <span>تتبع شفاف بدون انتظار مجهول</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white mb-2">
            خط تتبع شفاف لكل طلب توظيف
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            انقر على أي مرحلة لاستكشاف الإجراءات والضمانات التي تقدمها المنظومة.
          </p>
        </div>

        {/* Visual Pipeline Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-2 bg-card/60 border border-white/10 rounded-2xl backdrop-blur-md">
            {appPipeline.map((st) => {
              const isActive = st.id === activeStageId
              const Icon = st.icon
              return (
                <button
                  key={st.id}
                  onClick={() => setActiveStageId(st.id)}
                  className={`flex flex-col items-start p-3.5 rounded-xl transition-all text-start ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/20 border border-primary/40 scale-[1.02]"
                      : "hover:bg-white/5 text-muted-foreground hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px] font-mono opacity-80">{st.step}</span>
                  </div>
                  <span className="text-xs font-bold font-heading line-clamp-1">{st.title}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Dynamic Detail Drawer for Selected Stage */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStage.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <GlassCard className="p-6 bg-card/40 backdrop-blur-md border-white/10 text-start flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0 mt-1">
                  <activeStage.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-white font-heading">{activeStage.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 border border-primary/20 text-primary">{activeStage.badge}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{activeStage.details}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-primary font-bold shrink-0 self-end sm:self-auto">
                <ShieldCheck className="w-4 h-4" />
                <span>ضمان الشفافية</span>
              </div>
            </GlassCard>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  )
}
