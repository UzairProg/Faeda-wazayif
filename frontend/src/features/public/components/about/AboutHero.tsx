/**
 * features/public/components/about/AboutHero.tsx
 *
 * Editorial hero section for the About page.
 * Displays Faeda's core purpose statement alongside an animated connected ecosystem node diagram.
 */
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Sparkles, ArrowLeft, Building2, Users, Briefcase, GraduationCap, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { ROUTES } from "@/config/routes"

const ECOSYSTEM_NODES = [
  { label: "الكفاءات والمهن", icon: UserCheck, color: "from-blue-500/30 to-primary/30 border-primary/40 text-primary" },
  { label: "الفرص والوظائف", icon: Briefcase, color: "from-cyan-500/30 to-teal-500/30 border-cyan-500/40 text-cyan-400" },
  { label: "الشركات وبيئات العمل", icon: Building2, color: "from-indigo-500/30 to-purple-500/30 border-indigo-500/40 text-indigo-400" },
  { label: "الفرق التخصصية", icon: Users, color: "from-emerald-500/30 to-teal-700/30 border-emerald-500/40 text-emerald-400" },
  { label: "المؤسسات التعليمية", subLabel: "(قريباً)", icon: GraduationCap, color: "from-amber-500/30 to-orange-500/30 border-amber-500/40 text-amber-400" },
]

export function AboutHero() {
  return (
    <section className="relative pt-28 pb-16 overflow-hidden text-start">
      {/* Background Radial Washes */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[180px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column (Editorial Headline & Narrative - 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary"
            >
              <Sparkles className="w-4 h-4" />
              <span>عن فائدة ورؤية المنظومة</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl font-extrabold font-heading tracking-tight sm:text-5xl text-white leading-tight"
            >
              فائدة ليست مجرد منصة وظائف. <br />
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-l from-primary via-accent to-blue-300">
                هي منظومة مهنية مترابطة
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl"
            >
              تصل فائدة بين هويتك المهنية، ذكاء المسار، الفرص الشاغرة، بيئات العمل الموثوقة والفرق التخصصية في مساحة موحدة تمتاز بالشفافية الكاملة.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link to={ROUTES.JOBS.LIST}>
                <Button size="lg" className="rounded-xl px-7 bg-primary hover:bg-primary/90 text-white font-bold text-sm gap-2 shadow-lg shadow-primary/20">
                  <span>تصفح الفرص والمنظومة</span>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>

              <Link to={ROUTES.AUTH.REGISTER}>
                <Button size="lg" variant="outline" className="rounded-xl px-7 border-white/10 bg-white/5 text-white font-bold text-sm hover:bg-white/10">
                  <span>ابدأ مسارك مع فائدة</span>
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right Column (Connected Ecosystem Node Diagram - 5 cols) */}
          <div className="lg:col-span-5">
            <GlassCard className="p-6 sm:p-8 bg-card/60 backdrop-blur-md border-white/10 shadow-2xl relative overflow-hidden">
              
              <div className="text-center mb-6">
                <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider block mb-1">
                  الهيكلية المترابطة
                </span>
                <h3 className="text-lg font-extrabold font-heading text-white">منظومة فائدة المهنية</h3>
              </div>

              {/* Central Node Visualizer */}
              <div className="relative py-4 space-y-3">
                {/* Central Faeda Hub Badge */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-blue-600 to-accent text-white flex items-center justify-center font-extrabold font-heading text-2xl mx-auto shadow-xl shadow-primary/30 border border-white/20 mb-6">
                  فائدة
                </div>

                {/* Satellite Connected Nodes */}
                <div className="space-y-2.5">
                  {ECOSYSTEM_NODES.map((node, index) => {
                    const IconComp = node.icon
                    return (
                      <motion.div
                        key={node.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                        className={`p-3 rounded-xl bg-gradient-to-r ${node.color} border flex items-center justify-between shadow-md transition-all hover:scale-[1.02]`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-black/30 flex items-center justify-center shrink-0">
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">{node.label}</span>
                            {node.subLabel && (
                              <span className="text-[10px] text-amber-300 font-mono">{node.subLabel}</span>
                            )}
                          </div>
                        </div>

                        <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                      </motion.div>
                    )
                  })}
                </div>
              </div>

            </GlassCard>
          </div>

        </div>
      </div>
    </section>
  )
}
