import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { TiltCard } from "@/components/ui/tilt-card"
import { Button } from "@/components/ui/button"
import { TrendingUp, CheckCircle2, AlertCircle, Info, Sparkles, Layers, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"

const demoInputs = [
  { label: "الخبرة العملية", val: "5 سنوات (تطوير برمجيات)", status: "قوي" },
  { label: "المهارات المحققة", val: "React, TypeScript, Node.js, Python", status: "مطلوب جداً" },
  { label: "المؤهل الأكاديمي", val: "بكالوريوس علوم حاسب", status: "مكتمل" },
  { label: "حجم الطلب بالسوق", val: "السوق السعودي (الرياض/عن بعد)", status: "مرتفع" },
]

export function MarketValueShowcaseSection() {
  const [activeTab, setActiveTab] = useState<"overview" | "why" | "actions">("overview")

  return (
    <section className="py-24 bg-background border-t border-white/5 relative overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/2 end-0 -translate-y-1/2 translate-x-1/4 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[170px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column (RTL Start) */}
          <div className="lg:col-span-5 flex flex-col items-start text-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mb-6">
              <TrendingUp className="w-4 h-4" />
              <span>ميزة استثنائية في فائدة</span>
            </div>

            <h2 className="text-3xl font-extrabold font-heading tracking-tight sm:text-4xl md:text-5xl text-white mb-6 leading-tight">
              تقدير القيمة السوقية: <br />
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-l from-primary to-accent">
                اعرف نطاق راتبك المستحق ومسبباته
              </span>
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              لا ترتكز فائدة على تقديم رقم عشوائي. نحن نساعدك على فهم موقعك التنافسي في سوق العمل بناءً على مهاراتك والطلب الحالي، مع توضيح كامل لأسباب النتيجة والخطوات القادمة لرفع قيمتك.
            </p>

            <div className="space-y-4 mb-8 w-full">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-card/40 border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">تقدير مبني على البيانات الحقيقية</h4>
                  <p className="text-xs text-muted-foreground">ربط مؤهلاتك ومعايير سوق العمل الإقليمي دون خوارزميات مجهولة.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-card/40 border border-white/5">
                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">قسم "لماذا هذه النتيجة؟"</h4>
                  <p className="text-xs text-muted-foreground">شرح شفاف لنقاط القوة ونقاط النمو التي تؤثر مباشرة على راتبك.</p>
                </div>
              </div>
            </div>

            <Link to={ROUTES.AUTH.REGISTER}>
              <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-lg shadow-primary/20">
                اقرأ قيمتك السوقية الان <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Right Product Demo Card (RTL End) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <TiltCard className="rounded-[2rem]" tiltMaxAngle={5} shineOpacityMax={0.15}>
              <GlassCard className="p-7 sm:p-10 bg-card/60 border-white/10 shadow-2xl relative overflow-hidden text-start">
                
                {/* Banner Badge */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold font-heading text-white text-lg sm:text-xl">تقرير القيمة السوقية</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">مهندس برمجيات واجهات قدير • الرياض</p>
                    </div>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-muted-foreground font-mono">
                    مثال توضيحي
                  </span>
                </div>

                {/* Main Estimated Salary Range Box */}
                <div className="p-7 sm:p-8 rounded-2xl bg-gradient-to-r from-primary/20 via-card to-card border border-primary/30 mb-6 relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs sm:text-sm text-primary font-bold tracking-wider uppercase block mb-1">
                        نطاق الراتب المتوقع بالسوق (SAR / شهرياً)
                      </span>
                      <p className="text-3xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">
                        22,000 – 28,000 <span className="text-base font-sans font-normal text-muted-foreground">ر.س</span>
                      </p>
                    </div>
                    <div className="px-3.5 py-2 rounded-lg bg-primary/20 border border-primary/30 text-primary text-xs sm:text-sm font-bold shrink-0">
                      مستوى تنافسي مرتفع
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    * التقدير نتاج مقارنة مؤهلاتك الفعالية بالطلب الحالي في السوق، ولا يُعتبر إرغاماً للشركات.
                  </p>
                </div>

                {/* Tabs for Explanation */}
                <div className="flex flex-wrap gap-2 mb-6 border-b border-white/10 pb-3">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      activeTab === "overview" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    مدخلات التقييم
                  </button>
                  <button
                    onClick={() => setActiveTab("why")}
                    className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      activeTab === "why" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    لماذا هذه النتيجة؟
                  </button>
                  <button
                    onClick={() => setActiveTab("actions")}
                    className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      activeTab === "actions" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    فرص زيادة القيمة (+15%)
                  </button>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                  {activeTab === "overview" && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4"
                    >
                      {demoInputs.map((inp) => (
                        <div key={inp.label} className="p-4 sm:p-5 rounded-xl bg-white/5 border border-white/5">
                          <span className="text-xs sm:text-sm text-muted-foreground block mb-1">{inp.label}</span>
                          <p className="text-sm sm:text-base font-bold text-white mb-1">{inp.val}</p>
                          <span className="text-xs text-primary font-semibold">{inp.status}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === "why" && (
                    <motion.div
                      key="why"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-3.5 mb-4 text-xs sm:text-sm"
                    >
                      <div className="flex flex-wrap gap-2.5 mb-3">
                        <span className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary font-bold text-xs">الخبرة (5 سنوات)</span>
                        <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white font-medium text-xs">المهارات (React/TS)</span>
                        <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white font-medium text-xs">التعليم (بكالوريوس)</span>
                        <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white font-medium text-xs">الطلب (الرياض)</span>
                      </div>
                      <div className="p-4 rounded-xl bg-success/10 border border-success/20 text-white flex items-center gap-2.5">
                        <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                        <span>امتلاك مهارات React و TypeScript المطلوبة بشدة في مشاريع النواحي التقنية بالرياض.</span>
                      </div>
                      <div className="p-4 rounded-xl bg-warning/10 border border-warning/20 text-white flex items-center gap-2.5">
                        <AlertCircle className="w-5 h-5 text-warning shrink-0" />
                        <span>عدم توثيق مشاريع سابقة في إدارة تصميم الأنظمة (System Architecture) يقلل السقف الأعلى.</span>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "actions" && (
                    <motion.div
                      key="actions"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-3.5 mb-4 text-xs sm:text-sm"
                    >
                      <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-white flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <Sparkles className="w-5 h-5 text-primary shrink-0" />
                          <span>إضافة شهادة معتمدة في Cloud Architecture (AWS/Azure)</span>
                        </div>
                        <span className="text-primary font-mono font-bold shrink-0">+2,500 SAR</span>
                      </div>
                      <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-white flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <Sparkles className="w-5 h-5 text-primary shrink-0" />
                          <span>إبراز قيادة فرق برمجية صغيرة في خانة الخبرات</span>
                        </div>
                        <span className="text-primary font-mono font-bold shrink-0">+1,800 SAR</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </GlassCard>
            </TiltCard>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
