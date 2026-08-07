import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Sparkles, FileText, LineChart, ShieldCheck, Users, Bot, TrendingUp } from "lucide-react"

const features = [
  {
    title: "المطابقة بالذكاء الاصطناعي",
    description: "يحلل نظامنا أكثر من 50 نقطة بيانات لربطك بالوظائف التي تمتلك فيها فرصة نجاح تتجاوز 90%.",
    icon: Sparkles,
    colSpan: "lg:col-span-2",
  },
  {
    title: "تحليل السيرة الذاتية (ATS)",
    description: "قيم سيرتك الذاتية فوراً مقابل أنظمة تتبع المتقدمين العالمية قبل التقديم.",
    icon: FileText,
    colSpan: "lg:col-span-1",
  },
  {
    title: "القيمة السوقية",
    description: "اكتشف قيمتك الحقيقية. توقعات رواتب لحظية بناءً على مهاراتك وخبرتك والطلب في السوق.",
    icon: TrendingUp,
    colSpan: "lg:col-span-1",
  },
  {
    title: "المساعد المهني الذكي",
    description: "تدرب على المقابلات، واحصل على مسارات مهنية مخصصة، وفاوض على راتبك مع مرشدك المتاح دائماً.",
    icon: Bot,
    colSpan: "lg:col-span-2",
  },
  {
    title: "شركات موثوقة",
    description: "يتم التدقيق الصارم على كل صاحب عمل لضمان فرص استثنائية وعالية الجودة.",
    icon: ShieldCheck,
    colSpan: "lg:col-span-1",
  },
  {
    title: "توظيف جماعي للشركات",
    description: "أدوات تعاونية متقدمة للشركات لإدارة دورة التوظيف بسلاسة وكفاءة.",
    icon: Users,
    colSpan: "lg:col-span-1",
  },
  {
    title: "تحليلات السوق",
    description: "رؤى واتجاهات مدعومة بالبيانات الكبيرة لاتخاذ قرارات مهنية صائبة.",
    icon: LineChart,
    colSpan: "lg:col-span-1",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 relative bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold font-heading tracking-tight sm:text-4xl md:text-5xl mb-6 text-white">
            لماذا <span className="text-primary">منصة فائدة؟</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            أعدنا صياغة مفهوم التوظيف بالكامل. بنينا المنصة من الصفر باستخدام الذكاء الاصطناعي لمنحك ميزة تنافسية لا تضاهى.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[200px]">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`h-full ${feature.colSpan}`}
            >
              <GlassCard interactive className="h-full p-8 flex flex-col justify-between group overflow-hidden bg-card/40 backdrop-blur-md border-white/5 shadow-md hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-white/10 transition-all duration-300">
                <div className="relative z-10">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-muted-foreground transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground border border-white/10 group-hover:border-primary">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold font-heading mb-3 text-white group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                
                {/* Decorative background glow */}
                <div className="absolute -bottom-24 -end-24 h-48 w-48 rounded-full bg-primary/0 blur-3xl transition-all duration-500 group-hover:bg-primary/10 group-hover:scale-150 pointer-events-none" />
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
