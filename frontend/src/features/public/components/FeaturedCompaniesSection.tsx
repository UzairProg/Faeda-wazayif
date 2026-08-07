import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Star, TrendingUp, Building, ArrowLeft } from "lucide-react"

const companies = [
  {
    id: 1,
    name: "أرامكو السعودية",
    logo: "A",
    description: "الشركة الرائدة عالمياً في مجال الطاقة والكيميائيات، تقود التحول نحو مستقبل مستدام.",
    openPositions: 42,
    rating: 4.8,
    marketValue: "2.1T دولار",
    color: "bg-blue-600",
  },
  {
    id: 2,
    name: "سابك",
    logo: "S",
    description: "من كبرى الشركات العالمية في مجال البتروكيماويات وصناعة المواد المبتكرة.",
    openPositions: 18,
    rating: 4.7,
    marketValue: "70B دولار",
    color: "bg-slate-700",
  },
  {
    id: 3,
    name: "نيوم",
    logo: "N",
    description: "رؤية طموحة لمستقبل جديد. انضم لفريق يبني المدينة الأكثر تطوراً في العالم.",
    openPositions: 85,
    rating: 4.9,
    marketValue: "خاصة",
    color: "bg-sky-600",
  },
]

export function FeaturedCompaniesSection() {
  return (
    <section className="py-24 bg-background border-t border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl text-start">
            <h2 className="text-3xl font-extrabold font-heading tracking-tight sm:text-4xl text-white mb-4">
              أفضل بيئات العمل
            </h2>
            <p className="text-lg text-muted-foreground">
              اكتشف الشركات التي تتمتع بثقافة استثنائية، وقيمة سوقية عالية، ونمو مستمر.
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex gap-2 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white">
            تصفح جميع الشركات <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <GlassCard interactive className="p-6 h-full flex flex-col group relative overflow-hidden bg-card border-white/5 text-start">
                
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg ${company.color}`}>
                    {company.logo}
                  </div>
                  <div className="bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    توظف الآن
                  </div>
                </div>

                <h3 className="text-xl font-bold font-heading mb-3 text-white group-hover:text-primary transition-colors">
                  {company.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-8 line-clamp-2 flex-grow leading-relaxed">
                  {company.description}
                </p>

                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="flex items-center gap-1 text-yellow-500 mb-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-bold text-sm text-white font-mono">{company.rating}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium">التقييم</span>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center text-center border-x border-white/10">
                    <div className="flex items-center gap-1 text-primary mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-bold text-sm text-white font-mono">{company.marketValue}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium">القيمة السوقية</span>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="flex items-center gap-1 text-secondary mb-1">
                      <Building className="w-4 h-4" />
                      <span className="font-bold text-sm text-white font-mono">{company.openPositions}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium">وظائف شاغرة</span>
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
