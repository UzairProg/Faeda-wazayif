/**
 * features/public/components/TeamMarketplaceSection.tsx
 *
 * Public team marketplace section for Home page.
 * Fully localized for Arabic (RTL), English (LTR), and Hindi (LTR).
 */
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { TiltCard } from "@/components/ui/tilt-card"
import { Button } from "@/components/ui/button"
import { Users, Layers, ArrowLeft, ArrowRight, Code, Palette, Cpu, Sparkles, CheckCircle2 } from "lucide-react"
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"

export function TeamMarketplaceSection() {
  const { t, language, isRTL } = useTranslation()
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  const teamCapabilities = language === "en" ? [
    { role: "Frontend Development", skill: "React, TypeScript", icon: Code },
    { role: "Backend Engineering", skill: "Node.js, Python, PostgreSQL", icon: Layers },
    { role: "UX/UI Design", skill: "Figma, System Architecture", icon: Palette },
    { role: "AI & ML Integration", skill: "PyTorch, LLMs Integration", icon: Cpu },
  ] : language === "hi" ? [
    { role: "फ़्रंटएंड डेवलपमेंट", skill: "React, TypeScript", icon: Code },
    { role: "बैकएंड इंजीनियरिंग", skill: "Node.js, Python, PostgreSQL", icon: Layers },
    { role: "यूएक्स/यूआई डिजाइन", skill: "Figma, System Architecture", icon: Palette },
    { role: "एआई और एमएल एकीकरण", skill: "PyTorch, LLMs Integration", icon: Cpu },
  ] : [
    { role: "تطوير واجهات (Frontend)", skill: "React, TypeScript", icon: Code },
    { role: "أنظمة خلفية (Backend)", skill: "Node.js, Python, PostgreSQL", icon: Layers },
    { role: "تجربة مستخدم (UX)", skill: "Figma, System Architecture", icon: Palette },
    { role: "ذكاء اصطناعي (AI)", skill: "PyTorch, LLMs Integration", icon: Cpu },
  ]

  return (
    <section className="py-20 bg-background border-t border-white/5 relative overflow-hidden text-start">
      <div className="absolute top-1/2 start-0 -translate-y-1/2 -translate-x-1/3 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Text Info */}
          <div className="lg:col-span-5 flex flex-col items-start text-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/10 px-3.5 py-1 text-xs font-bold text-secondary mb-4">
              <Users className="w-3.5 h-3.5" />
              <span>{t("teams.header.badge")}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-white mb-4 leading-tight">
              {t("teams.header.title")}: <br />
              <span className="text-secondary bg-clip-text text-transparent bg-gradient-to-l from-secondary to-accent">
                {language === "en" ? "Hire capabilities, not just individuals." : language === "hi" ? "केवल व्यक्तियों को ही नहीं, क्षमताओं को भर्ती करें।" : "توظيف كتلة كفاءات متكاملة"}
              </span>
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
              {t("teams.header.subtitle")}
            </p>

            <Link to={ROUTES.TEAMS.LIST}>
              <Button size="sm" className="rounded-xl px-6 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-xs gap-1.5 shadow-md shadow-secondary/20">
                <span>{t("teams.detail.browseJobsCta")}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {/* Team Capability Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7"
          >
            <TiltCard tiltEnabled={false} shineEnabled={true} shineOpacityMax={0.12} className="rounded-[2rem]">
              <GlassCard className="p-7 sm:p-10 bg-card/60 border-white/10 shadow-2xl relative text-start">
                
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                  <div>
                    <h3 className="font-bold font-heading text-white text-lg sm:text-xl">
                      {language === "en" ? "Full Capability Unit" : language === "hi" ? "पूर्ण क्षमता इकाई" : "وحدة قدرات تخصصية كاملة"}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {language === "en"
                        ? "Multi-domain skills for building digital products"
                        : language === "hi"
                        ? "डिजिटल उत्पाद बनाने के लिए बहु-डोमेन कौशल"
                        : "تغطية مهارية شاملة لبناء وتطوير المنتجات الرقمية"}
                    </p>
                  </div>
                  <span className="px-3.5 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs sm:text-sm font-bold font-mono">
                    {language === "en" ? "96% Skill Coverage" : language === "hi" ? "96% कौशल कवरेज" : "تغطية مهارات 96%"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {teamCapabilities.map((cap) => (
                    <div key={cap.role} className="p-4 sm:p-5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary shrink-0">
                          <cap.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-white mb-0.5">{cap.role}</p>
                          <p className="text-xs text-muted-foreground">{cap.skill}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-5 rounded-xl bg-gradient-to-r from-secondary/20 via-card to-card border border-secondary/30 flex items-center justify-between text-xs sm:text-sm text-white">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5 text-secondary shrink-0" />
                    <span>
                      {language === "en"
                        ? "Ready for direct team contracting & execution"
                        : language === "hi"
                        ? "प्रत्यक्ष टीम अनुबंध और निष्पादन के लिए तैयार"
                        : "جاهزية التعاقد والتسليم الجماعي المباشر للشركات"}
                    </span>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                </div>

              </GlassCard>
            </TiltCard>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
