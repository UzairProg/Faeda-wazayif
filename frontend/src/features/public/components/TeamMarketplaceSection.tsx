import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { TiltCard } from "@/components/ui/tilt-card"
import { Button } from "@/components/ui/button"
import { Users, Layers, ShieldCheck, ArrowLeft, Code, Palette, Cpu, Sparkles, CheckCircle2 } from "lucide-react"
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"

const teamCapabilities = [
  { role: "تطوير واجهات (Frontend)", skill: "React, TypeScript", icon: Code, share: "35%" },
  { role: "أنظمة خلفية (Backend)", skill: "Node.js, Python, PostgreSQL", icon: Layers, share: "35%" },
  { role: "تجربة مستخدم (UX)", skill: "Figma, System Architecture", icon: Palette, share: "15%" },
  { role: "ذكاء اصطناعي (AI)", skill: "PyTorch, LLMs Integration", icon: Cpu, share: "15%" },
]

export function TeamMarketplaceSection() {
  return (
    <section className="py-20 bg-background border-t border-white/5 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 start-0 -translate-y-1/2 -translate-x-1/3 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Text Info */}
          <div className="lg:col-span-5 flex flex-col items-start text-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/10 px-3.5 py-1 text-xs font-bold text-secondary mb-4">
              <Users className="w-3.5 h-3.5" />
              <span>استقطاب القدرات المركبة</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-white mb-4 leading-tight">
              سوق الفرق التخصصية: <br />
              <span className="text-secondary bg-clip-text text-transparent bg-gradient-to-l from-secondary to-accent">
                توظيف كتلة كفاءات متكاملة
              </span>
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
              لا تبحث الشركات دائماً عن فرد واحد. أحياناً تتطلب المشاريع المعقدة تغطية مهارات متكاملة جاهزة للتسليم المباشر.
            </p>

            <Link to={ROUTES.TEAMS.LIST}>
              <Button size="sm" className="rounded-xl px-6 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-xs gap-1.5 shadow-md shadow-secondary/20">
                استكشف سوق الفرق <ArrowLeft className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {/* Single Team Capability Set Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7"
          >
            <TiltCard tiltEnabled={false} shineEnabled={true} shineOpacityMax={0.12} className="rounded-[2rem]">
              <GlassCard className="p-6 bg-card/60 border-white/10 shadow-2xl relative text-start">
                
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                  <div>
                    <h3 className="font-bold font-heading text-white text-base">وحدة قدرات تخصصية كاملة</h3>
                    <p className="text-xs text-muted-foreground">تغطية مهارية شاملة لبناء وتطوير المنتجات الرقمية</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold font-mono">
                    تغطية مهارات 96%
                  </span>
                </div>

                {/* Team Capability Rows */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {teamCapabilities.map((cap) => (
                    <div key={cap.role} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary shrink-0">
                          <cap.icon className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white mb-0.5">{cap.role}</p>
                          <p className="text-[10px] text-muted-foreground">{cap.skill}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Single Combined Output Banner */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-secondary/20 via-card to-card border border-secondary/30 flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-secondary shrink-0" />
                    <span>جاهزية التعاقد والتسليم الجماعي المباشر للشركات</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                </div>

              </GlassCard>
            </TiltCard>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
