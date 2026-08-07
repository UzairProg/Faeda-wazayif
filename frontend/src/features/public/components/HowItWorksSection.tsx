import { motion } from "framer-motion"
import { User, FileText, CheckCircle2 } from "lucide-react"

const steps = [
  {
    num: "01",
    title: "بناء ملفك المهني الذكي",
    description: "ارفع سيرتك الذاتية ودع الذكاء الاصطناعي يحللها ويبني ملفك الشامل في ثوانٍ، مع إبراز نقاط قوتك.",
    icon: FileText,
    meta: "تحليل ATS فوري.",
  },
  {
    num: "02",
    title: "اكتشف قيمتك السوقية",
    description: "احصل على تقييم دقيق لمهاراتك وتوقع للراتب الذي تستحقه فعلياً بناءً على حالة السوق والطلب الحالي.",
    icon: User,
    meta: "بيانات سوقية محدثة.",
  },
  {
    num: "03",
    title: "المطابقة مع أفضل الفرص",
    description: "خوارزمياتنا ترشح لك وظائف تتطابق مع خبراتك وطموحاتك بنسبة تتجاوز 90%، مما يختصر وقت البحث.",
    icon: CheckCircle2,
    meta: "ترشيحات مخصصة لك.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-background border-t border-white/5 relative overflow-hidden">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-extrabold font-heading tracking-tight sm:text-4xl md:text-5xl text-white mb-6">
            كيف تعمل منصتنا؟
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            رحلتك نحو فرصتك المهنية القادمة أصبحت أذكى وأسرع من أي وقت مضى، خطوة بخطوة باستخدام الذكاء الاصطناعي.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          
          {/* Vertical Timeline Line */}
          <div className="absolute top-0 bottom-0 end-[2.5rem] w-px bg-white/10 hidden md:block" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative flex flex-col md:flex-row items-center gap-8"
              >
                
                {/* Connecting Node */}
                <div className="hidden md:flex absolute end-[1.25rem] w-10 h-10 rounded-full border border-primary bg-background items-center justify-center z-10">
                  <span className="text-primary font-bold font-mono text-sm">{step.num}</span>
                </div>

                {/* Main Card */}
                <div className="w-full md:w-[calc(100%-5rem)] flex flex-col sm:flex-row bg-card border border-white/5 rounded-[1.5rem] p-6 sm:p-8 hover:border-primary/30 transition-colors shadow-xl">
                  
                  {/* Right Content (Arabic Start) */}
                  <div className="flex-1 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                    <div className="w-16 h-16 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground order-first sm:order-last ms-auto sm:ms-0 sm:me-6">
                      <step.icon className="w-8 h-8" strokeWidth={1.5} />
                    </div>
                    <div className="text-start flex-1">
                      <h3 className="text-2xl font-bold font-heading text-white mb-3">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="hidden sm:block w-px bg-white/10 mx-6 self-stretch" />
                  <div className="sm:hidden h-px bg-white/10 my-6 w-full" />

                  {/* Left Content (Arabic End) */}
                  <div className="sm:w-48 flex items-center justify-start sm:justify-end text-start sm:text-end shrink-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground font-medium">{step.meta}</p>
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    </div>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
