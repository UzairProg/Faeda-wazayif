import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Star, TrendingUp, Building, ArrowLeft } from "lucide-react"

import aramcoImg from "@/assets/images/aramco.png"
import sabicImg from "@/assets/images/sabic.png"
import neomImg from "@/assets/images/neom.png"

const companies = [
  {
    id: 1,
    name: "أرامكو السعودية",
    logo: aramcoImg,
    description: "الشركة الرائدة عالمياً في مجال الطاقة والكيميائيات، تقود التحول نحو مستقبل مستدام عبر ابتكارات وتقنيات متطورة لدعم نمو الاقتصاد العالمي.",
    openPositions: 42,
    rating: 4.8,
    marketValue: "2.1T دولار",
    color: "bg-blue-600",
  },
  {
    id: 2,
    name: "سابك",
    logo: sabicImg,
    description: "من كبرى الشركات العالمية في مجال البتروكيماويات وصناعة المواد المبتكرة، توفر حلولاً مستدامة لأكبر التحديات التي تواجه العالم اليوم.",
    openPositions: 18,
    rating: 4.7,
    marketValue: "70B دولار",
    color: "bg-slate-700",
  },
  {
    id: 3,
    name: "نيوم",
    logo: neomImg,
    description: "رؤية طموحة لمستقبل جديد. انضم لفريق يبني المدينة الأكثر تطوراً في العالم، حيث تلتقي التكنولوجيا بالاستدامة لخلق معايير جديدة للعيش.",
    openPositions: 85,
    rating: 4.9,
    marketValue: "خاصة",
    color: "bg-sky-600",
  },
]

export function FeaturedCompaniesSection() {
  return (
    <section className="py-24 bg-background border-t border-white/5 relative z-10">
      {/* Ambient Navy/Cyan Glow */}
      <div className="absolute top-1/2 end-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-cyan-600/5 rounded-full blur-[180px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl text-start">
            <h2 className="text-3xl font-extrabold font-heading tracking-tight sm:text-4xl text-white mb-4">
              أفضل بيئات العمل
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              اكتشف الشركات التي تتمتع بثقافة استثنائية، وقيمة سوقية عالية، ونمو مستمر. فرص فريدة للارتقاء بمسيرتك المهنية.
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex gap-2 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white">
            تصفح جميع الشركات <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-col gap-8 relative z-10">
          {companies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
            >
              <GlassCard interactive className="p-0 flex flex-col md:flex-row group relative overflow-hidden bg-card/40 backdrop-blur-md border-white/5 shadow-xl hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1 hover:border-white/10 transition-all duration-500 ease-out">

                {/* Colorful Cover/Logo Section on the Right (RTL) */}
                <div className={`w-full md:w-1/3 p-4 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden bg-white md:border-l border-white/10 min-h-[240px]`}>
                  <img src={company.logo} alt={company.name} className="relative scale-110 z-10 w-full h-full max-h-[160px] object-contain group-hover:scale-120 transition-transform duration-700 ease-out" />

                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-700 z-20 pointer-events-none" />

                  {/* Ambient glow inside cover */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0" />
                </div>

                {/* Content Section */}
                <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col text-start justify-center relative">
                  {/* Abstract background highlight on hover */}
                  <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4 relative z-10">
                    <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white group-hover:text-primary transition-colors">
                      {company.name}
                    </h3>
                    <div className="bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      توظف الآن
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-8 leading-relaxed text-sm sm:text-base relative z-10">
                    {company.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-white/10 relative z-10">

                    {/* Stats */}
                    <div className="flex items-center gap-6 sm:gap-8">
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-1.5 text-yellow-500 mb-1">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="font-bold text-base text-white font-mono">{company.rating}</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">التقييم</span>
                      </div>

                      <div className="flex flex-col items-start border-r border-white/10 pr-6 sm:pr-8">
                        <div className="flex items-center gap-1.5 text-primary mb-1">
                          <TrendingUp className="w-4 h-4" />
                          <span className="font-bold text-base text-white font-mono">{company.marketValue}</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">القيمة السوقية</span>
                      </div>

                      <div className="flex flex-col items-start border-r border-white/10 pr-6 sm:pr-8">
                        <div className="flex items-center gap-1.5 text-secondary mb-1">
                          <Building className="w-4 h-4" />
                          <span className="font-bold text-base text-white font-mono">{company.openPositions}</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">وظائف شاغرة</span>
                      </div>
                    </div>

                    {/* Action */}
                    <Button variant="ghost" className="gap-2 text-primary hover:text-white hover:bg-primary rounded-full transition-all">
                      عرض الوظائف <ArrowLeft className="w-4 h-4" />
                    </Button>

                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <Button variant="outline" className="w-full mt-8 md:hidden rounded-full border-white/10 bg-white/5 text-white">
          تصفح جميع الشركات
        </Button>
      </div>
    </section>
  )
}
