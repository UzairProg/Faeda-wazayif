import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react"
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"

export function EcosystemCtaSection() {
  return (
    <section className="py-20 bg-background relative overflow-hidden border-t border-white/5">
      {/* Ambient Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-primary/15 via-secondary/10 to-primary/15 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-4">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>الانطلاق مجاناً</span>
          </div>

          <h2 className="text-3xl font-extrabold font-heading tracking-tight sm:text-4xl text-white mb-4 leading-tight">
            مستقبلك المهني يبدأ من منظومة واحدة
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-8">
            سواء كنت مرشحاً تبحث عن نمو قيمتك، أو شركة تعتزم استقطاب كفاءات وفرق، فائدة تمنحك الوضوح والتمكين.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <Link to={ROUTES.AUTH.REGISTER}>
              <Button size="lg" className="rounded-xl px-8 shadow-lg shadow-primary/20 text-white font-bold text-sm bg-primary hover:bg-[#2D6BFF] h-11 gap-2">
                <span>ابدأ مسارك الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <Link to={ROUTES.JOBS.LIST}>
              <Button size="lg" variant="outline" className="rounded-xl px-8 border-white/10 bg-white/5 text-white hover:bg-white/10 h-11 font-bold text-sm">
                استكشف الفرص
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground pt-4 border-t border-white/5">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> تسجيل فوري</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> خصوصية وحماية كاملة</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> دعم مرشحين وشركات وفرق</span>
          </div>
        </div>
      </div>
    </section>
  )
}
