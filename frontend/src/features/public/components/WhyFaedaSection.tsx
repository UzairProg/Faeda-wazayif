import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { ShieldCheck, Sparkles, UserCheck, Layers, Award, ArrowLeft, RefreshCw } from "lucide-react"
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"

const advantages = [
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

export function WhyFaedaSection() {
  return (
    <section className="py-20 bg-background border-t border-white/5 relative overflow-hidden">
      {/* Radial Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[170px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>القيمة المضافة</span>
          </div>

          <h2 className="text-3xl font-extrabold font-heading text-white mb-2">
            لماذا تختار فائدة؟
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            أربعة أسباب تجعل فائدة الخيار الأنسب لمسارك التوظيفي والمهني.
          </p>
        </div>

        {/* Central Faeda Ecosystem Core Node */}
        <div className="hidden lg:flex items-center justify-center mb-8">
          <div className="px-8 py-3 rounded-full bg-primary/20 border border-primary/40 text-white font-heading font-extrabold text-sm flex items-center gap-3 shadow-xl shadow-primary/20 backdrop-blur-md">
            <RefreshCw className="w-4 h-4 text-primary animate-spin" style={{ animationDuration: "14s" }} />
            <span>مركز فائدة (Faeda Hub Architecture)</span>
          </div>
        </div>

        {/* 4 Connected Advantage Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto mb-10">
          {advantages.map((adv, idx) => (
            <motion.div
              key={adv.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <GlassCard className="p-6 flex flex-col justify-between h-full bg-card/50 backdrop-blur-md border-white/10 hover:border-primary/40 transition-all text-start shadow-xl relative overflow-hidden group">
                {/* Subtle Hover Glow Line */}
                <div className="absolute top-0 start-0 end-0 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <adv.icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-muted-foreground">{adv.num}</span>
                  </div>

                  <h3 className="text-lg font-bold font-heading text-white mb-2">{adv.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{adv.desc}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-primary font-bold">
                  <span>{adv.tag}</span>
                  <ArrowLeft className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to={ROUTES.AUTH.REGISTER}>
            <button className="px-7 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg shadow-primary/25 transition-all hover:scale-105">
              <span>انضم لمنظومة فائدة</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>

      </div>
    </section>
  )
}
