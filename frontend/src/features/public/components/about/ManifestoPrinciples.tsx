/**
 * features/public/components/about/ManifestoPrinciples.tsx
 *
 * Vertical manifesto layout section presenting Faeda's 4 core product principles.
 * Focuses on transparency, real data credibility, human agency, and ecosystem connectivity.
 */
import { GlassCard } from "@/components/ui/glass-card"
import { Eye, ShieldCheck, UserCheck, Network } from "lucide-react"

const PRINCIPLES = [
  {
    num: "01",
    title: "الشفافية أولاً",
    sub: "نعرض السبب والآلية خلف التوصيات والترشيحات، لا النتيجة المجردة فقط.",
    desc: "نؤمن بأن الثقة تبدأ من التفسير الواضح. لا نصدر أحكاماً مغلقة على الملفات، بل نوضح العوامل والمعايير التي بنيت عليها النتيجة.",
    icon: Eye,
    color: "text-blue-400 border-blue-500/30 bg-blue-500/10",
  },
  {
    num: "02",
    title: "بيانات حقيقية والمصداقية أساس",
    sub: "لا نملأ الفراغ بأرقام، تقييمات، أو نِسب مئوية غير موثقة في النظام.",
    desc: "نستبعد تماماً كل أنواع المؤشرات المصنوعة أو الإحصائيات الوهمية. البيانات التي تراها تعكس الواقع الفعلي للمرشح والشركة.",
    icon: ShieldCheck,
    color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  },
  {
    num: "03",
    title: "الإنسان صاحب القرار النهائي",
    sub: "التقنية والذكاء الاصطناعي أدوات مساندة وموجهة، والقرار يظل للإنسان.",
    desc: "لا تلغي أدواتنا التقدير البشري أو الاستقلالية الشخصية. الذكاء يقدم الاقتراح والتحليل، وأنت من يقرر القبول أو التعديل أو التجاهل.",
    icon: UserCheck,
    color: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
  },
  {
    num: "04",
    title: "ترابط عناصر المسار المهني",
    sub: "الهوية، الفرص، والفرق جزء من بيئة واحدة وليست أدوات منفصلة.",
    desc: "بدلاً من استخدام سيرة ذاتية في موقع ومتابعة طلبك في موقع آخر، تجمع فائدة هذه الخطوات في رحلة سلسة ومترابطة.",
    icon: Network,
    color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  },
]

export function ManifestoPrinciples() {
  return (
    <section className="py-16 relative text-start">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider block mb-2">
            دستور ومبادئ المنتج
          </span>
          <h2 className="text-2xl font-extrabold font-heading text-white sm:text-4xl leading-tight mb-4">
            المبادئ التي تبنى عليها فائدة
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            قرارات التصميم والتطوير في فائدة تحكمها مبادئ ثابتة نلتزم بها أمام مجتمعنا.
          </p>
        </div>

        {/* Vertical Manifesto Rows */}
        <div className="space-y-6">
          {PRINCIPLES.map((p) => {
            const IconComp = p.icon
            return (
              <GlassCard
                key={p.num}
                className="p-6 sm:p-8 bg-card/60 backdrop-blur-md border-white/10 shadow-xl hover:border-primary/40 transition-all group"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  
                  <div className="flex items-start gap-5 min-w-0 flex-1">
                    <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 ${p.color}`}>
                      <IconComp className="w-6 h-6" />
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-extrabold text-sm text-primary opacity-80">{p.num}</span>
                        <h3 className="text-lg sm:text-xl font-extrabold font-heading text-white group-hover:text-primary transition-colors">
                          {p.title}
                        </h3>
                      </div>

                      <p className="text-xs sm:text-sm font-semibold text-primary/90">
                        "{p.sub}"
                      </p>

                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
                        {p.desc}
                      </p>
                    </div>
                  </div>

                </div>
              </GlassCard>
            )
          })}
        </div>

      </div>
    </section>
  )
}
