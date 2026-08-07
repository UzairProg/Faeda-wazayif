import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, MessageCircle } from "lucide-react"

import imgNegotiate from "@/assets/images/Professional_insights/1_negotiate.png"
import imgInterview from "@/assets/images/Professional_insights/2_interviewPrep.png"
import imgHolistic from "@/assets/images/Professional_insights/3_holistic_engineers.png"

const articles = [
  {
    id: 1,
    title: "كيف تفاوض على زيادة راتبك بنسبة 20% في عام 2026",
    category: "نصائح مهنية",
    readTime: "5 دقائق",
    image: imgNegotiate,
  },
  {
    id: 2,
    title: "صعود المقابلات التقنية المدعومة بالذكاء الاصطناعي",
    category: "التحضير للمقابلات",
    readTime: "8 دقائق",
    image: imgInterview,
  },
  {
    id: 3,
    title: "لماذا تفضل الشركات الناشئة المهندسين الشموليين؟",
    category: "اتجاهات الصناعة",
    readTime: "6 دقائق",
    image: imgHolistic,
  },
]

export function CommunitySection() {
  return (
    <section className="py-24 bg-background border-t border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl text-start">
            <h2 className="text-3xl font-extrabold font-heading tracking-tight sm:text-4xl text-white mb-4">
              رؤى مهنية ومجتمع فائدة
            </h2>
            <p className="text-lg text-muted-foreground">
              ابق على اطلاع دائم بنصائح الخبراء، اتجاهات الصناعة، والنقاشات المجتمعية الحيوية.
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex gap-2 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white">
            زيارة المدونة <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-[20%] left-[20%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            >
              <GlassCard interactive className="flex flex-col h-full group overflow-hidden bg-card/40 backdrop-blur-md border-white/5 text-start shadow-lg hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1 hover:scale-[1.01] hover:border-white/10 transition-all duration-500 ease-out">
                {/* Image Placeholder */}
                <div className={`h-56 w-full relative overflow-hidden`}>
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500 z-10" />
                  <div className="absolute top-4 start-4 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/10 z-20">
                    {article.category}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold font-heading mb-4 text-white group-hover:text-primary transition-colors line-clamp-2 leading-relaxed">
                    {article.title}
                  </h3>

                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{article.readTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span className="font-mono">{Math.floor(Math.random() * 50) + 5}</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
