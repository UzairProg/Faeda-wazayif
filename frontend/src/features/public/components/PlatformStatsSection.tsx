import { motion } from "framer-motion"

import { AnimatedCounter } from "@/components/ui/animated-counter"
import { Briefcase, Building2, Users, Trophy } from "lucide-react"

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
    <section className="py-24 relative z-10 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex flex-col items-center text-center p-6 group h-full justify-center">
                <div className={`mb-4 transition-transform duration-300 group-hover:-translate-y-2`}>
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
