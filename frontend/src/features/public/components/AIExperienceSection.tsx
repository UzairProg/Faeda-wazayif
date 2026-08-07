import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { BrainCircuit, Target, MessageSquare, Briefcase, Sparkles } from "lucide-react"

export function AIExperienceSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Abstract AI Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-2xl mb-6 shadow-lg shadow-primary/10">
            <BrainCircuit className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-extrabold font-heading tracking-tight sm:text-4xl md:text-5xl text-white mb-6">
            تعرف على <span className="text-primary">مرشدك المهني الذكي</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            اختبر أكثر تقنيات الذكاء الاصطناعي تطوراً في مجال التوظيف. من تحليل نقاط الضعف في سيرتك الذاتية إلى إجراء مقابلات افتراضية واقعية.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Feature List (Right in RTL) */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-10 order-last lg:order-first">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <div className="flex items-start gap-4 group p-5 rounded-2xl hover:bg-card/40 hover:backdrop-blur-md border border-transparent hover:border-white/10 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
                <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-primary group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 shadow-sm group-hover:shadow-lg">
                  <Target className="h-6 w-6" />
                </div>
                <div className="text-start">
                  <h3 className="text-xl font-bold font-heading text-white mb-2">تعديل جراحي للسيرة الذاتية</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    يعمل الذكاء الاصطناعي كخبير توظيف، حيث يحلل سيرتك الذاتية بحثاً عن الكلمات المفتاحية المفقودة، والأفعال الضعيفة، وفجوات التأثير القابلة للقياس.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
              <div className="flex items-start gap-4 group p-5 rounded-2xl hover:bg-card/40 hover:backdrop-blur-md border border-transparent hover:border-white/10 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
                <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-primary group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 shadow-sm group-hover:shadow-lg">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div className="text-start">
                  <h3 className="text-xl font-bold font-heading text-white mb-2">تدريب حي على المقابلات</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    شارك في مقابلات افتراضية صوتية أو نصية مصممة خصيصاً للشركة والدور الذي تتقدم إليه لضمان أعلى مستويات الجاهزية.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              <div className="flex items-start gap-4 group p-5 rounded-2xl hover:bg-card/40 hover:backdrop-blur-md border border-transparent hover:border-white/10 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
                <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-primary group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 shadow-sm group-hover:shadow-lg">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div className="text-start">
                  <h3 className="text-xl font-bold font-heading text-white mb-2">خريطة طريق مهنية ديناميكية</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    حدد الفجوات في مهاراتك واحصل على مسار تعليمي خطوة بخطوة للوصول إلى شريحة الراتب المستهدفة بكل ثقة.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="pt-4 text-start"
            >
              <Button size="lg" className="rounded-full shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-transform bg-primary text-primary-foreground font-bold px-8">
                استكشف ميزات الذكاء الاصطناعي
              </Button>
            </motion.div>
          </div>

          {/* Interactive Mockup (Left in RTL) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 relative"
          >
            <GlassCard className="h-[550px] p-0 bg-card border-white/10 flex flex-col relative overflow-hidden shadow-2xl">

              {/* Dashboard Header */}
              <div className="flex items-center justify-between border-b border-white/5 bg-background px-4 py-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                </div>
                <div className="text-xs font-mono text-muted-foreground bg-white/5 px-3 py-1 rounded-md border border-white/5">
                  Faeda Intelligence v2.0
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col md:flex-row gap-0">
                {/* Resume Analysis Mock (Right Side of Mockup) */}
                <div className="flex-1 p-6 border-e border-white/5">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-primary" />
                    <h4 className="font-bold text-white font-heading">تحسين السيرة الذاتية</h4>
                  </div>

                  <div className="space-y-4 p-5 bg-card rounded-xl border border-white/5 text-sm text-muted-foreground relative text-start" dir="ltr">
                    <motion.p 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="font-mono opacity-70"
                    >• Led team of 5 engineers to deliver project...</motion.p>
                    
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1, duration: 0.5 }}
                      className="relative group p-2 -mx-2 rounded-lg hover:bg-white/5 transition-colors duration-300"
                    >
                      <p className="font-mono line-through decoration-red-500/70 decoration-2 text-white/80">
                        • Responsible for improving backend performance
                      </p>
                      <div className="absolute -top-14 end-0 bg-primary text-primary-foreground text-xs p-3 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-10 w-64 text-end" dir="rtl">
                        <span className="font-bold block mb-1">اقتراح الذكاء الاصطناعي:</span>
                        الرجاء تحديد الأثر بلغة الأرقام. "تم تحسين وقت استجابة الخادم بنسبة 40٪ باستخدام Redis".
                      </div>
                      <div className="absolute start-0 top-1/2 -translate-y-1/2">
                        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                      </div>
                    </motion.div>

                    <motion.p 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      className="font-mono opacity-70"
                    >• Architected microservices infrastructure...</motion.p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 text-center">
                      <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-1">درجة ATS</p>
                      <p className="text-3xl font-extrabold text-primary font-mono">92</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">تقييم التأثير</p>
                      <p className="text-2xl font-extrabold text-white mt-1">مرتفع</p>
                    </div>
                  </div>
                </div>

                {/* Chat Mock (Left Side of Mockup) */}
                <div className="w-full md:w-72 bg-background p-4 flex flex-col gap-4">
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.2, duration: 0.5, type: "spring" }}
                    className="p-4 bg-card border border-white/5 rounded-2xl rounded-tr-sm text-sm text-white text-start shadow-sm leading-relaxed"
                  >
                    لاحظت خبرتك في React. هل نبدأ بتوليد بعض أسئلة المقابلات الشائعة لدور مهندس واجهات أمامية في شركة Stripe؟
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 2.0, duration: 0.5, type: "spring" }}
                    className="p-4 bg-primary text-primary-foreground rounded-2xl rounded-tl-sm text-sm self-end text-start shadow-md font-medium"
                  >
                    نعم، لنبدأ بتصميم الأنظمة (System Design).
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 2.5, duration: 0.3 }}
                    className="p-4 bg-card/80 backdrop-blur-md border border-primary/30 rounded-2xl rounded-tr-sm text-sm flex items-center gap-2 w-fit shadow-lg shadow-primary/10"
                  >
                    <span className="flex w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <span className="flex w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                    <span className="flex w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                  </motion.div>
                </div>
              </div>

            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
