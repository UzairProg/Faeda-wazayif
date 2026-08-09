/**
 * components/shared/Footer.tsx
 *
 * Shared footer component for Faeda Jobs.
 * Fully localized with language switcher support and RTL/LTR arrow directions.
 */
import { Link } from "react-router-dom"
import { ArrowLeft, ArrowRight, Mail, MapPin, Sparkles } from "lucide-react"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"

export function Footer() {
  const { t, language, isRTL } = useTranslation()

  const platformLinks = [
    { label: t("common.nav.home"), href: ROUTES.PUBLIC.HOME },
    { label: t("common.nav.jobs"), href: ROUTES.JOBS.LIST },
    { label: t("common.nav.companies"), href: ROUTES.COMPANIES.LIST },
    { label: t("common.nav.teams"), href: ROUTES.TEAMS.LIST },
    { label: t("common.nav.about"), href: ROUTES.PUBLIC.ABOUT },
  ]

  const accountLinks = [
    { label: t("common.nav.login"), href: ROUTES.AUTH.LOGIN },
    { label: t("common.nav.register"), href: ROUTES.AUTH.REGISTER },
    { label: t("common.nav.contact"), href: ROUTES.PUBLIC.CONTACT },
  ]

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  return (
    <footer className="w-full bg-background pt-12 pb-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-t border-white/5">
      {/* Background Ambient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-primary/5 rounded-[100%] blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl">
        <div className="bg-card/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-6 md:p-8 lg:p-12 shadow-2xl relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 border-b border-white/5 pb-12">
            
            {/* Brand & Info Column */}
            <div className="lg:col-span-5 flex flex-col items-start text-start">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                {language === "ar" ? "منظومة مهنية متكاملة" : "Integrated Professional Ecosystem"}
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white mb-6 leading-tight">
                {language === "ar" ? (
                  <>منصة فائدة<br />للهوية والنمو المهني.</>
                ) : (
                  <>Faeda Jobs<br />Professional Growth Engine.</>
                )}
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-8 max-w-md">
                {language === "ar"
                  ? "توحد فائدة الهوية المهنية، الذكاء المفسر، الفرص المتاحة، والشركات والفرق في بيئة عمل احترافية شفافة."
                  : "Faeda unites professional identity, explainable AI, opportunities, companies, and teams in a transparent ecosystem."}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-2xl p-4 w-fit hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-primary">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-sm text-white font-mono">contact@faedajobs.com</span>
                </div>
                <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-2xl p-4 w-fit hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-sm text-white">
                    {language === "ar" ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia"}
                  </span>
                </div>
              </div>
            </div>

            {/* Platform Links */}
            <div className="lg:col-span-3 lg:col-start-7 flex flex-col items-start text-start">
              <h3 className="text-primary font-bold mb-6">
                {language === "ar" ? "المنظومة والفرص" : "Ecosystem & Opportunities"}
              </h3>
              <ul className="space-y-4 w-full">
                {platformLinks.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="group flex items-center justify-between text-muted-foreground hover:text-white transition-colors text-sm py-1">
                      {link.label}
                      <ArrowIcon className="w-4 h-4 opacity-0 transition-all duration-300 text-primary group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account Links & CTA */}
            <div className="lg:col-span-3 flex flex-col items-start text-start">
              <h3 className="text-primary font-bold mb-6">
                {language === "ar" ? "الحساب والدعم" : "Account & Support"}
              </h3>
              <ul className="space-y-4 w-full mb-8">
                {accountLinks.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="group flex items-center justify-between text-muted-foreground hover:text-white transition-colors text-sm py-1">
                      {link.label}
                      <ArrowIcon className="w-4 h-4 opacity-0 transition-all duration-300 text-primary group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>

              {/* CTA Box */}
              <div className="w-full bg-[#081628]/80 border border-primary/20 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-primary/50 transition-colors duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors duration-500" />
                
                <h4 className="text-primary font-bold mb-2 relative z-10">
                  {language === "ar" ? "ابدأ مسارك" : "Start Your Path"}
                </h4>
                <p className="text-muted-foreground text-xs leading-relaxed mb-6 relative z-10">
                  {language === "ar"
                    ? "انضم كمرشح، شركة، أو فريق عمل تخصصي في خطوة واحدة."
                    : "Join as a candidate, employer, or specialized team in one step."}
                </p>
                <Link to={ROUTES.AUTH.REGISTER} className="flex items-center justify-center gap-2 w-full py-3 bg-primary hover:bg-[#2D6BFF] text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 relative z-10">
                  <span>{language === "ar" ? "انضم مجاناً" : "Join for Free"}</span>
                  <ArrowIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 text-xs text-muted-foreground/60">
            <p>
              {language === "ar"
                ? "منظومة توظيف شفافة تدعم العربية والإنجليزية."
                : "A transparent recruitment ecosystem supporting Arabic and English."}
            </p>
            <p>&copy; {new Date().getFullYear()} Faeda Jobs. All rights reserved.</p>
          </div>

        </div>
      </div>
    </footer>
  )
}
