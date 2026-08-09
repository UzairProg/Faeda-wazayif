/**
 * features/public/components/about/AiPhilosophyVisualizer.tsx
 *
 * Interactive visualizer illustrating Faeda's AI philosophy: "الذكاء يساعدك، والقرار لك".
 * Visualizes the 3-step flow: AI Suggests → Human Reviews → Human Decides.
 */
import { useState } from "react"
import { Bot, UserCheck, Check, Edit3, X, Sparkles, HelpCircle } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"

export function AiPhilosophyVisualizer() {
  const [userChoice, setUserChoice] = useState<"applied" | "edited" | "dismissed" | null>(null)

  return (
    <section className="py-16 relative text-start">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        <GlassCard className="p-6 sm:p-12 bg-gradient-to-br from-primary/10 via-card to-card border border-primary/20 shadow-2xl relative overflow-hidden space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-bold text-primary">
              <Bot className="w-4 h-4" />
              <span>فلسفة الذكاء الاصطناعي المساند</span>
            </div>

            <h2 className="text-2xl font-extrabold font-heading text-white sm:text-4xl leading-tight">
              الذكاء يساعدك، <span className="text-primary">والقرار لك</span>
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              الذكاء الاصطناعي في فائدة مرشد تحليلي موثوق يفتح الرؤية، ولا يستبدل حريتك وتقديرك المستقل مطلقاً.
            </p>
          </div>

          {/* Interactive 3-Step Assistive Visualizer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            
            {/* Step 1: AI Suggests */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-start relative">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-primary font-bold">الخطوة 01</span>
                <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold">مقترح النظام</span>
              </div>

              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Sparkles className="w-4 h-4 text-primary shrink-0" />
                <span>الذكاء الاصطناعي يقترح</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white/90 space-y-1.5 font-mono">
                <div className="flex items-center justify-between text-muted-foreground text-[10px]">
                  <span>تحليل ملاءمة الفرصة</span>
                  <span className="text-emerald-400">طبيعة متطابقة</span>
                </div>
                <p className="text-[11px] leading-snug">
                  "نقترح تحسين الفقرة الثانية بالسيرة الذاتية لربط خبرتك بمهارات TypeScript المطلوبة."
                </p>
              </div>
            </div>

            {/* Step 2: Human Reviews */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-start relative">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-cyan-400 font-bold">الخطوة 02</span>
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 text-[10px] font-bold">التحقق الإنساني</span>
              </div>

              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <UserCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>الإنسان يراجع المسببات</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white/90 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-semibold">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>تفسير التوصية</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  تقرأ الأسباب والتوصية بكل شفافية وتحدد مدى ملاءمتها لهويتك وطموحك الشخصي.
                </p>
              </div>
            </div>

            {/* Step 3: Human Decides (Interactive Controls) */}
            <div className="p-5 rounded-2xl bg-primary/10 border border-primary/30 space-y-3 text-start relative">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-emerald-400 font-bold">الخطوة 03</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">القرار النهائي</span>
              </div>

              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>الإنسان يقرر بحرية</span>
              </div>

              {/* 3 Human Action Buttons */}
              <div className="space-y-2 pt-1">
                <Button
                  size="sm"
                  onClick={() => setUserChoice("applied")}
                  className={`w-full h-8 rounded-lg text-xs font-bold gap-1.5 justify-start ${
                    userChoice === "applied" ? "bg-emerald-500 text-white" : "bg-white/10 hover:bg-emerald-500/20 text-white"
                  }`}
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>تطبيق الاقتراح</span>
                </Button>

                <Button
                  size="sm"
                  onClick={() => setUserChoice("edited")}
                  className={`w-full h-8 rounded-lg text-xs font-bold gap-1.5 justify-start ${
                    userChoice === "edited" ? "bg-primary text-white" : "bg-white/10 hover:bg-primary/20 text-white"
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5 text-primary" />
                  <span>تعديل حسب رغبتي</span>
                </Button>

                <Button
                  size="sm"
                  onClick={() => setUserChoice("dismissed")}
                  className={`w-full h-8 rounded-lg text-xs font-bold gap-1.5 justify-start ${
                    userChoice === "dismissed" ? "bg-rose-500 text-white" : "bg-white/10 hover:bg-rose-500/20 text-white"
                  }`}
                >
                  <X className="w-3.5 h-3.5 text-rose-400" />
                  <span>تجاهل الاقتراح</span>
                </Button>
              </div>

              {userChoice && (
                <p className="text-[11px] text-emerald-300 font-mono text-center pt-1 animate-fade-in">
                  ✓ تم تسجيل قرارك البشري بنجاح
                </p>
              )}
            </div>

          </div>

        </GlassCard>

      </div>
    </section>
  )
}
