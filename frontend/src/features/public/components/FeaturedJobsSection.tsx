import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { MapPin, DollarSign, Clock, Bookmark, Sparkles, ArrowLeft } from "lucide-react"

const jobs = [
  {
    id: 1,
    title: "مهندس برمجيات أول",
    company: "أرامكو السعودية",
    logo: "A",
    location: "الظهران، السعودية",
    salary: "35k - 45k ر.س",
    type: "دوام كامل",
    match: 98,
    color: "bg-blue-600",
  },
  {
    id: 2,
    title: "مصمم تجربة المستخدم",
    company: "علم",
    logo: "E",
    location: "الرياض، السعودية",
    salary: "20k - 28k ر.س",
    type: "دوام كامل",
    match: 94,
    color: "bg-cyan-600",
  },
  {
    id: 3,
    title: "محلل بيانات الذكاء الاصطناعي",
    company: "نيوم",
    logo: "N",
    location: "عن بعد",
    salary: "40k - 55k ر.س",
    type: "عقد",
    match: 89,
    color: "bg-sky-600",
  },
]

export function FeaturedJobsSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl text-start">
            <h2 className="text-3xl font-extrabold font-heading tracking-tight sm:text-4xl text-white mb-4">
              فرص مهنية استثنائية
            </h2>
            <p className="text-lg text-muted-foreground">
              وظائف مختارة بعناية من أفضل الشركات، مرتبة حسب نسبة توافقك الذكي معها.
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex gap-2 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white">
            عرض جميع الوظائف <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlassCard interactive className="p-6 flex flex-col h-full group bg-card border-white/5">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg ${job.color}`}>
                      {job.logo}
                    </div>
                    <div className="text-start">
                      <h3 className="font-bold font-heading text-white group-hover:text-primary transition-colors text-lg">
                        {job.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                    </div>
                  </div>
                  <button className="text-muted-foreground hover:text-white transition-colors bg-white/5 p-2 rounded-full">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-6 text-start">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 text-xs font-medium text-muted-foreground border border-white/5">
                    <MapPin className="w-3.5 h-3.5" /> {job.location}
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 text-xs font-medium text-muted-foreground border border-white/5">
                    <DollarSign className="w-3.5 h-3.5" /> {job.salary}
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 text-xs font-medium text-muted-foreground border border-white/5">
                    <Clock className="w-3.5 h-3.5" /> {job.type}
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border border-primary/20">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-start">
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">نسبة التوافق</p>
                      <p className="text-base font-extrabold text-primary font-mono">{job.match}%</p>
                    </div>
                  </div>
                  <Button className="rounded-full px-6 shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-transform bg-primary text-primary-foreground font-bold">
                    قدم الآن
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
        
        <Button variant="outline" className="w-full mt-8 md:hidden rounded-full border-white/10 bg-white/5 text-white">
          عرض جميع الوظائف
        </Button>
      </div>
    </section>
  )
}
