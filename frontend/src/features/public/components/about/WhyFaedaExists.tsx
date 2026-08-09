/**
 * features/public/components/about/WhyFaedaExists.tsx
 *
 * Core narrative section explaining why Faeda was built.
 * Features a visual transformation flow comparing fragmented professional tools vs. Faeda's unified ecosystem.
 */
import { GlassCard } from "@/components/ui/glass-card"
import { Layers, ArrowLeft, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react"

export function WhyFaedaExists() {
  return (
    <section className="py-16 relative overflow-hidden text-start">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mb-3">
            <Layers className="w-4 h-4" />
            <span>لماذا وجود فائدة ضروري؟</span>
          </div>

          <h2 className="text-2xl font-extrabold font-heading text-white sm:text-4xl leading-tight mb-4">
            المشكلة ليست نقص الأدوات. <br />
            <span className="text-primary">المشكلة أن الأدوات لا تتحدث مع بعضها.</span>
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            اليوم تتوزع الهوية المهنية بين منصات متعددة وأدوات منفصلة، مما يسبب تشتتاً للمرشح وضبابية للشركات.
          </p>
        </div>

        {/* Visual Transformation Comparison Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Fragmented World Box (5 cols) */}
          <div className="md:col-span-5">
            <GlassCard className="p-6 sm:p-8 bg-card/40 border-white/10 h-full flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold mb-3">
                  <ShieldAlert className="w-4 h-4" />
                  <span>الوضع التقليدي التنافسي</span>
                </div>
                <h3 className="text-lg font-extrabold font-heading text-white mb-2">
                  عالم مهني مجزأ ومشتت
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  يتنقل المرشح أو صاحب العمل بين خدمات لا تعتمد لغة مشتركة، مما يخلق فجوة في الفهم والتوثيق.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs text-white/80">
                  <span>سيرة ذاتية ثابتة بمكان منفصل</span>
                  <span className="text-rose-400 font-mono text-[10px]">محدثة نادراً</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs text-white/80">
                  <span>البحث عن الوظائف بمنصة أخرى</span>
                  <span className="text-rose-400 font-mono text-[10px]">دون توضيح الأسباب</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs text-white/80">
                  <span>تقدير الراتب والقيمة بدون بيانات</span>
                  <span className="text-rose-400 font-mono text-[10px]">تخمينات عشوائية</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs text-white/80">
                  <span>توظيف أفراد بدلاً من قدرة كاملة</span>
                  <span className="text-rose-400 font-mono text-[10px]">تجميع مجهد</span>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Transformation Arrow Center Badge (2 cols) */}
          <div className="md:col-span-2 flex items-center justify-center py-2 md:py-0">
            <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 text-primary flex items-center justify-center font-bold shadow-lg shadow-primary/20 rotate-90 md:rotate-0">
              <ArrowLeft className="w-6 h-6" />
            </div>
          </div>

          {/* Faeda Ecosystem Solution Box (5 cols) */}
          <div className="md:col-span-5">
            <GlassCard className="p-6 sm:p-8 bg-gradient-to-br from-primary/15 via-card to-card border border-primary/30 h-full flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden">
              <div>
                <div className="flex items-center gap-2 text-primary text-xs font-bold mb-3">
                  <Sparkles className="w-4 h-4" />
                  <span>حل منظومة فائدة</span>
                </div>
                <h3 className="text-lg font-extrabold font-heading text-white mb-2">
                  مسار موحد ومترابط بالكامل
                </h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  توحد فائدة هذه الأجزاء في رحلة واحدة ذكية وشفافة تدعم اتخاذ القرار وتضاعف الفرص.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="p-3 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-between text-xs text-white">
                  <span className="font-bold">هوية مهنية ديناميكية موثقة</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
                <div className="p-3 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-between text-xs text-white">
                  <span className="font-bold">فهم القيمة السوقية الحقيقية</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
                <div className="p-3 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-between text-xs text-white">
                  <span className="font-bold">ترشيحات وظيفية مفسرة بالذكاء</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
                <div className="p-3 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-between text-xs text-white">
                  <span className="font-bold">بيئات عمل موثقة وسوق للفرق</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
              </div>
            </GlassCard>
          </div>

        </div>

      </div>
    </section>
  )
}
