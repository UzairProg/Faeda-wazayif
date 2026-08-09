/**
 * components/shared/Footer.tsx
 *
 * Shared footer component for Faeda Jobs.
 * Uses official white Faeda logo, fully localized with language switcher support and RTL/LTR arrow directions.
 */
import { Link } from "react-router-dom"
import { ArrowLeft, ArrowRight, Mail, MapPin, Sparkles } from "lucide-react"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"
import faedaWhiteLogo from "@/assets/logos/faeda_white_logo.png"

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
              <Link to={ROUTES.PUBLIC.HOME} className="mb-6 block group">
                <img
                  src={faedaWhiteLogo}
                  alt="Faeda Jobs Logo"
                  className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                {language === "ar" ? "منظومة مهنية متكاملة" : language === "hi" ? "एकीकृत व्यावसायिक पारिस्थितिकी तंत्र" : "Integrated Professional Ecosystem"}
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white mb-6 leading-tight">
                {language === "ar" ? (
                  <>منصة فائدة<br />للهوية والنمو المهني.</>
                ) : language === "hi" ? (
                  <>फ़ायदा प्लेटफ़ॉर्म<br />पेशेवर विकास इंजन।</>
                ) : (
                  <>Faeda Jobs<br />Professional Growth Engine.</>
                )}
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-8 max-w-md">
                {language === "ar"
                  ? "توحد فائدة الهوية المهنية، الذكاء المفسر، الفرص المتاحة، والشركات والفرق في بيئة عمل احترافية شفافة."
                  : language === "hi"
                  ? "फ़ायदा एक पारदर्शी पारिस्थितिकी तंत्र में पेशेवर पहचान, व्याख्या योग्य एआई, अवसरों, कंपनियों और टीमों को जोड़ता है।"
                  : "Faeda unites professional identity, explainable AI, opportunities, companies, and teams in a transparent ecosystem."}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-primary border border-white/5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>{language === "ar" ? "الرياض، المملكة العربية السعودية" : language === "hi" ? "रियाध, सऊदी अरब" : "Riyadh, Saudi Arabia"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-primary border border-white/5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="font-mono">support@faeda.sa</span>
                </div>
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="lg:col-span-3 text-start">
              <h3 className="text-white font-bold text-lg font-heading mb-6">
                {t("common.footer.platformLinks")}
              </h3>
              <ul className="space-y-4">
                {platformLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-white transition-colors text-sm flex items-center gap-2 group/link"
                    >
                      <ArrowIcon className="w-3.5 h-3.5 text-primary opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account Column */}
            <div className="lg:col-span-4 text-start">
              <h3 className="text-white font-bold text-lg font-heading mb-6">
                {t("common.footer.accountLinks")}
              </h3>
              <ul className="space-y-4 mb-8">
                {accountLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-white transition-colors text-sm flex items-center gap-2 group/link"
                    >
                      <ArrowIcon className="w-3.5 h-3.5 text-primary opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <p className="text-xs font-bold text-white">
                  {language === "ar" ? "جاهز للانضمام لشبكة فائدة؟" : language === "hi" ? "फ़ायदा नेटवर्क में शामिल होने के लिए तैयार हैं?" : "Ready to join Faeda ecosystem?"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === "ar" ? "سجل الآن وابدأ في استكشاف الفرص وتقييم القيمة السوقية." : language === "hi" ? "अभी पंजीकरण करें और अवसरों की खोज शुरू करें।" : "Register now and explore opportunities."}
                </p>
                <Link to={ROUTES.AUTH.REGISTER} className="block pt-1">
                  <span className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1">
                    {t("common.nav.register")} <ArrowIcon className="w-3 h-3" />
                  </span>
                </Link>
              </div>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} {t("common.footer.rights")}</p>
            <div className="flex items-center gap-6">
              <Link to={ROUTES.PUBLIC.ABOUT} className="hover:text-white transition-colors">{t("common.nav.about")}</Link>
              <Link to={ROUTES.PUBLIC.CONTACT} className="hover:text-white transition-colors">{t("common.nav.contact")}</Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  )
}
