import { useRef } from "react"
import { motion, useScroll } from "framer-motion"
import { User, FileText, CheckCircle2 } from "lucide-react"
import { TiltCard } from "@/components/ui/tilt-card"

const steps = [
  {
    num: "01",
    title: "بناء ملفك المهني الذكي",
    description: "قم بإنشاء حسابك ودع الذكاء الاصطناعي يحلل بياناتك ويبني ملفك الشامل في ثوانٍ، مع إبراز نقاط قوتك.",
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
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  })

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

        <div className="max-w-5xl mx-auto relative" ref={containerRef}>

          {/* Vertical Timeline Background Line */}
          <div className="absolute top-0 bottom-0 end-[2.5rem] w-[2px] bg-white/5 hidden md:block" />
          
          {/* Vertical Animated Timeline Glowing Line */}
          <motion.div 
            style={{ scaleY: scrollYProgress, transformOrigin: "top" }}
            className="absolute top-0 bottom-0 end-[2.5rem] w-[2px] bg-primary hidden md:block shadow-[0_0_15px_rgba(18,75,201,1)]" 
          />

          {/* Ambient Timeline Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none hidden md:block" />

          <div className="space-y-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
                className="relative flex flex-col md:flex-row items-center gap-12 group"
              >

                {/* Connecting Node */}
                <div className="hidden md:flex absolute end-[1.25rem] w-12 h-12 rounded-full border-2 border-white/10 bg-background items-center justify-center z-10 transition-all duration-500 group-hover:border-primary group-hover:bg-primary group-hover:shadow-[0_0_30px_rgba(18,75,201,0.8)]">
                  <span className="text-muted-foreground font-bold font-mono text-base transition-colors duration-500 group-hover:text-white">{step.num}</span>
                </div>

                {/* Main Card */}
                <TiltCard tiltEnabled={false} shineEnabled={true} shineOpacityMax={0.15} className="w-full md:w-[calc(100%-6rem)] rounded-[2rem]">
                <div className="flex flex-col sm:flex-row bg-card/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 sm:p-14 group-hover:border-primary/40 group-hover:bg-card/80 transition-all duration-500 ease-out shadow-lg group-hover:shadow-2xl group-hover:shadow-primary/20 group-hover:-translate-y-2 group-hover:scale-[1.02]">

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
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
