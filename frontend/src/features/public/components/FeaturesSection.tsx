import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { TiltCard } from "@/components/ui/tilt-card"
import { Sparkles, FileText, ShieldCheck, Users, BrainCircuit, Building2, TrendingUp } from "lucide-react"

const features = [
  {
    title: "الذكاء المهني للمرشحين",
    subtitle: "فهم موضعك المهني وتطويره",
    description: "فحص جاهزية ATS للسيرة الذاتية، تقدير القيمة السوقية المستحقة بناءً على بيانات حقيقية، وترشيحات مخصصة توضح أسباب كل فرصة.",
    icon: FileText,
    badge: "للكفاءات",
    colSpan: "lg:col-span-2",
  },
  {
    title: "منظومة موثوقة للشركات",
    subtitle: "استقطاب احترافي وتقييم شفاف",
    description: "ملفات شركات موثقة، حساب درجات الموثوقية وقيمة الشركة في التوظيف، وإدارة سلسة لدورة التوظيف وصنع القرار.",
    icon: Building2,
    badge: "للشركات",
    colSpan: "lg:col-span-1",
  },
  {
    title: "سوق الفرق التخصصية",
    subtitle: "العمل والتوظيف الجماعي",
    description: "بناء فرق متكاملة المهارات والتقديم على الفرص كفريق واحد، أو تمكين الشركات من استقطاب فرق كاملة لتنفيذ المشاريع.",
    icon: Users,
    badge: "للفرق",
    colSpan: "lg:col-span-1",
  },
  {
    title: "ذكاء موجه وشفافية كاملة",
    subtitle: "معطيات مفسرة دون غموض",
    description: "كل نسبة توافق أو تقييم في فائدة يأتي مع إجابات واضحة: ماذا يعني؟ لماذا أراه؟ وما هي الخطوة القادمة؟ دون خوارزميات غامضة.",
    icon: BrainCircuit,
    badge: "شفافية الذكاء",
    colSpan: "lg:col-span-2",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 relative bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>رؤية المنظومة</span>
          </div>
          <h2 className="text-3xl font-extrabold font-heading tracking-tight sm:text-4xl md:text-5xl mb-6 text-white">
            منظومة متكاملة تجمع <span className="text-primary">الكفاءات، الشركات، والفرق</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            تتجاوز فائدة فكرة "لوحة الوظائف التقليدية". نحن نربط أطراف التوظيف عبر بيانات موثوقة، ذكاء مفسر، وفرص نمو حقيقية.
          </p>
        </div>

        {/* Ambient Cyan Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              className={`h-full ${feature.colSpan}`}
            >
              <TiltCard className="h-full rounded-[1.5rem]" tiltMaxAngle={8} shineOpacityMax={0.15}>
                <GlassCard className="h-full p-8 flex flex-col justify-between group overflow-hidden bg-card/40 backdrop-blur-md border-white/5 shadow-lg transition-all duration-500 ease-out border">
                  
                  {/* Abstract light sweep on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  <div className="relative z-10" style={{ transform: "translateZ(30px)" }}>
                    <div className="flex items-center justify-between mb-6">
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground border border-white/10 group-hover:border-primary shadow-lg">
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-muted-foreground group-hover:border-primary/30 group-hover:text-primary transition-colors">
                        {feature.badge}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold font-heading mb-1 text-white transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-primary font-semibold mb-4 opacity-90">
                      {feature.subtitle}
                    </p>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Decorative background glow */}
                  <div className="absolute -bottom-24 -end-24 h-48 w-48 rounded-full bg-primary/0 blur-3xl transition-all duration-700 group-hover:bg-primary/20 pointer-events-none" />
                </GlassCard>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
