/**
 * features/public/components/about/ProductDirection.tsx
 *
 * Product direction roadmap section for the About page.
 * Honestly distinguishes features available today from future direction without fake startup milestones.
 */
import { Compass, CheckCircle2, ArrowLeft, Clock } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"

const AVAILABLE_TODAY = [
  "الهوية المهنية وتأهيل السيرة الذاتية (ATS)",
  "استكشاف الوظائف والترشيحات المفسرة",
  "دليل الشركات الموثقة وبيئات العمل",
  "سوق الفرق التخصصية وتكامل المهارات",
]

const FUTURE_DIRECTION = [
  "عمق الذكاء المهني وتوقعات المسار المستقبلي",
  "ربط البرامج الأكاديمية والتدريبية بحاجة السوق (المؤسسات التعليمية)",
  "مطابقة قدرات متقدمة للمشاريع الضخمة",
  "منظومة مقاييس شفافة لجودة بيئات العمل",
]

export function ProductDirection() {
  return (
    <section className="py-16 relative text-start">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mb-3">
            <Compass className="w-4 h-4" />
            <span>الاتجاه والرؤية المستقبلية</span>
          </div>

          <h2 className="text-2xl font-extrabold font-heading text-white sm:text-4xl leading-tight mb-4">
            إلى أين تتجه فائدة؟
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            نركز على بناء المنتج خطوة بخطوة بكل شفافية، ونبين للزائر الفرق بين ما يعمل الآن والاتجاه القادم.
          </p>
        </div>

        {/* 2-Column Progression: Today vs Next */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Available Today */}
          <GlassCard className="p-6 sm:p-8 bg-card/60 backdrop-blur-md border-emerald-500/30 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold font-heading text-white">متاح اليوم بالمنظومة</h3>
                  <span className="text-xs text-emerald-400 font-mono">مفعل ويعمل حالياً</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {AVAILABLE_TODAY.map((item, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3 text-xs sm:text-sm text-white/90">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Future Direction */}
          <GlassCard className="p-6 sm:p-8 bg-card/60 backdrop-blur-md border-amber-500/30 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold font-heading text-white">الاتجاه والتوسع القادم</h3>
                  <span className="text-xs text-amber-300 font-mono">ضمن مرحلة التطوير القادمة</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {FUTURE_DIRECTION.map((item, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3 text-xs sm:text-sm text-white/90">
                  <ArrowLeft className="w-4 h-4 text-amber-300 shrink-0" />
                  <span className="font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </GlassCard>

        </div>

      </div>
    </section>
  )
}
