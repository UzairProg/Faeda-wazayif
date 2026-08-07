import { Link } from "react-router-dom"
import { ArrowLeft, Mail, MapPin, Sparkles } from "lucide-react"

export function Footer() {
  const quickLinks = [
    { label: "الرئيسية", href: "/" },
    { label: "من نحن", href: "/about" },
    { label: "الوظائف", href: "/jobs" },
    { label: "الخدمات", href: "/services" },
    { label: "الأسعار", href: "/pricing" },
    { label: "تواصل معنا", href: "/contact" },
  ]

  const usefulLinks = [
    { label: "لوحة التحكم", href: "/dashboard" },
    { label: "الشركات المميزة", href: "/companies" },
    { label: "الإعدادات", href: "/settings" },
  ]

  return (
    <footer className="w-full bg-background pt-12 pb-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-primary/5 rounded-[100%] blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl">
        <div className="bg-card/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-6 md:p-8 lg:p-12 shadow-2xl relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 border-b border-white/5 pb-12">
            
            {/* Right Column: Brand & Info (RTL) */}
            <div className="lg:col-span-5 flex flex-col items-start text-start">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                منصة توظيف احترافية
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white mb-6 leading-tight">
                فائدة منصة توظيف<br />
                أقوى وأوضح.
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-8 max-w-md">
                منصة حديثة تساعدك على بناء مسيرة مهنية بمظهر احترافي وتسلسل واضح وتجربة أسرع للانطلاق نحو الفرص المناسبة.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-2xl p-4 w-fit hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-primary">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-sm text-white font-mono">hello@faeda.sa</span>
                </div>
                <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-2xl p-4 w-fit hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-sm text-white">الرياض، المملكة العربية السعودية</span>
                </div>
              </div>
            </div>

            {/* Middle Column: Quick Links */}
            <div className="lg:col-span-3 lg:col-start-7 flex flex-col items-start text-start">
              <h3 className="text-primary font-bold mb-6">التنقل السريع</h3>
              <ul className="space-y-4 w-full">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="group flex items-center justify-between text-muted-foreground hover:text-white transition-colors text-sm py-1">
                      {link.label}
                      <ArrowLeft className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Left Column: Useful Links & CTA */}
            <div className="lg:col-span-3 flex flex-col items-start text-start">
              <h3 className="text-primary font-bold mb-6">روابط مفيدة</h3>
              <ul className="space-y-4 w-full mb-8">
                {usefulLinks.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="group flex items-center justify-between text-muted-foreground hover:text-white transition-colors text-sm py-1">
                      {link.label}
                      <ArrowLeft className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
                    </Link>
                  </li>
                ))}
              </ul>

              {/* CTA Box */}
              <div className="w-full bg-[#081628]/80 border border-primary/20 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-primary/50 transition-colors duration-500">
                {/* Glow inside box */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors duration-500" />
                
                <h4 className="text-primary font-bold mb-2 relative z-10">ابدأ الآن</h4>
                <p className="text-muted-foreground text-xs leading-relaxed mb-6 relative z-10">
                  استعرض الوظائف وتقدم للشركات التي تناسب طموحك المهني وتمنحك أفضل انطباع.
                </p>
                <Link to="/jobs" className="flex items-center justify-center gap-2 w-full py-3 bg-primary hover:bg-[#2D6BFF] text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 relative z-10">
                  تصفح الوظائف
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 text-xs text-muted-foreground/60">
            <p>تصميم احترافي يدعم العربية والإنجليزية بسلاسة.</p>
            <p>&copy; {new Date().getFullYear()} فائدة. جميع الحقوق محفوظة.</p>
          </div>

        </div>
      </div>
    </footer>
  )
}
