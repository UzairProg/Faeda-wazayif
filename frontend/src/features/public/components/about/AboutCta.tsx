/**
 * features/public/components/about/AboutCta.tsx
 *
 * Closing editorial CTA section for the About page.
 * Provides a strong conceptual closing statement with primary actions.
 */
import { Link } from "react-router-dom"
import { Sparkles, ArrowLeft } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/config/routes"

export function AboutCta() {
  return (
    <section className="py-16 relative text-start">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        <GlassCard className="p-8 sm:p-14 bg-gradient-to-r from-primary/15 via-card to-card border-primary/30 text-start shadow-2xl relative overflow-hidden space-y-6">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
              <Sparkles className="w-4 h-4" />
              <span>البداية من هنا</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white leading-tight">
              المسار المهني لا يبدأ من مجرد وظيفة...
            </h2>

            <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed">
              يبدأ من فهم من أنت، وما تستطيع تقديمه، وأين يمكن أن تكون قيمتك الحقيقية في المنظومة.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link to={ROUTES.JOBS.LIST}>
                <Button size="lg" className="rounded-xl px-8 bg-primary hover:bg-primary/90 text-white font-bold text-sm gap-2 shadow-lg shadow-primary/20">
                  <span>تصفح الفرص المتاحة</span>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>

              <Link to={ROUTES.AUTH.REGISTER}>
                <Button size="lg" variant="outline" className="rounded-xl px-8 border-white/10 bg-white/5 text-white font-bold text-sm hover:bg-white/10">
                  <span>انضم مجاناً إلى فائدة</span>
                </Button>
              </Link>
            </div>
          </div>
        </GlassCard>

      </div>
    </section>
  )
}
