/**
 * DEV_MOCK: Platform stats below are aspirational marketing figures on the landing page.
 * They are not sourced from the backend in real-time.
 * Replace with API data from the analytics endpoint when it exists.
 * Reference: FAEDA_JOBS_FINAL_ROADMAP.md §27
 */
import { motion } from "framer-motion"

import { AnimatedCounter } from "@/components/ui/animated-counter"
import { Briefcase, Building2, Users, Trophy } from "lucide-react"

// DEV_MOCK: Replace with API data — see comment above

const stats = [
  {
    id: 1,
    name: "فرص وظيفية نشطة",
    value: 12,
    suffix: " ألف+",
    icon: Briefcase,
    color: "text-white",
  },
  {
    id: 2,
    name: "شركات معتمدة",
    value: 3400,
    suffix: "+",
    icon: Building2,
    color: "text-white",
  },
  {
    id: 3,
    name: "مرشحين متميزين",
    value: 450,
    suffix: " ألف",
    icon: Users,
    color: "text-white",
  },
  {
    id: 4,
    name: "عمليات توظيف ناجحة",
    value: 98,
    suffix: "%",
    icon: Trophy,
    color: "text-white",
  },
]

export function PlatformStatsSection() {
  return (
    <section className="py-24 relative z-10 bg-transparent">
      {/* Intense Ambient Primary Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[500px] bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 rounded-[100%] blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            >
              <div className="flex flex-col items-center text-center p-8 group h-full justify-center bg-card/40 backdrop-blur-md border border-white/5 rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 hover:border-white/10 transition-all duration-500">
                <div className="mb-4 transition-transform duration-500 group-hover:scale-110">
                  <stat.icon className={`h-12 w-12 text-primary drop-shadow-md`} strokeWidth={1.5} />
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <AnimatedCounter
                    to={stat.value}
                    className="text-5xl font-extrabold font-heading text-white tracking-tight"
                    suffix={stat.suffix}
                  />
                </div>
                <p className="text-base font-medium text-muted-foreground mt-2">
                  {stat.name}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
