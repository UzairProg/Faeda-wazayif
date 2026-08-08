import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { User, Building2, Users, GraduationCap, Layers, RefreshCw, XCircle, CheckCircle2 } from "lucide-react"

const nodes = [
  { id: "candidate", title: "الكفاءات والباحثين", sub: "هوية مهنية • جاهزية ATS • قيمة سوقية", icon: User },
  { id: "company", title: "الشركات وأصحاب العمل", sub: "حضور موثق • نشر فرص • إدارة توظيف", icon: Building2 },
  { id: "team", title: "الفرق التخصصية", sub: "قدرات تجميعية • عروض موجهة • توظيف جماعي", icon: Users },
  { id: "education", title: "المؤسسات التعليمية", sub: "مواءمة مهارات • جاهزية خريجين • شراكات", icon: GraduationCap },
]

export function EcosystemOverviewSection() {
  return (
    <section className="py-16 bg-background border-t border-white/5 relative overflow-hidden">
      {/* Subtle Grid & Glow */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>خريطة المنظومة</span>
          </div>

          <h2 className="text-2xl font-extrabold font-heading sm:text-3xl text-white mb-2">
            منظومة متكاملة توحّد أطراف التوظيف والنمو
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            بدلاً من تشتيت مسارك بين أدوات منفصلة، فائدة توحد الهوية، التقييم، الفرص، والشركات.
          </p>
        </div>

        {/* Visual Contrast: Disconnected Tools vs Faeda */}
        <div className="max-w-4xl mx-auto mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-card/30 border border-white/5 text-start">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mb-3">
              <XCircle className="w-4 h-4 text-destructive/80" />
              <span>الأدوات المشتتة التقليدية</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              سيرة ذاتية ملغية • منصات إعلانات عشوائية • حساب راتب تقديري مجهول • تقديم وتتبع بدون نتائج مسببة.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 text-start">
            <div className="flex items-center gap-2 text-xs font-bold text-primary mb-3">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>منظومة فائدة الموحدة</span>
            </div>
            <p className="text-xs text-white/90 leading-relaxed">
              هوية موثقة • جاهزية ATS • قيمة سوقية مفسرة • ترشيحات شفافة • تتبع مباشر • توظيف أفراد وفرق.
            </p>
          </div>
        </div>

        {/* Visual Connected Ecosystem Diagram */}
        <div className="max-w-4xl mx-auto relative p-6 sm:p-8 rounded-3xl bg-card/30 border border-white/5 backdrop-blur-md shadow-2xl">
          
          {/* Center Hub Indicator */}
          <div className="hidden sm:flex items-center justify-center my-4">
            <div className="px-6 py-2.5 rounded-full bg-primary/20 border border-primary/40 text-white font-heading font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-primary/20">
              <RefreshCw className="w-4 h-4 text-primary animate-spin" style={{ animationDuration: "12s" }} />
              <span>مركز منظومة فائدة (Faeda Hub)</span>
            </div>
          </div>

          {/* Connected Nodes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
            {nodes.map((node, idx) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <GlassCard className="p-4 flex items-center gap-4 bg-card/60 border-white/10 hover:border-primary/40 transition-colors text-start">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <node.icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-sm mb-0.5 truncate">{node.title}</h3>
                    <p className="text-[11px] text-muted-foreground truncate">{node.sub}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  )
}
