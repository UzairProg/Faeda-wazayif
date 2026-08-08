import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Globe, CheckCircle2, User, Briefcase, Rocket } from "lucide-react"
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"

export function Register() {
  const [accountType, setAccountType] = useState<"seeker" | "provider" | null>(null)

  return (
    <div className="min-h-screen w-full bg-background flex flex-col lg:flex-row">
      
      {/* Left Panel: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 min-h-screen">
        
        {/* Top Header */}
        <div className="flex justify-between items-center w-full">
          <Button variant="outline" className="rounded-full bg-white/5 border-white/10 text-white hover:bg-white/10 px-4 text-xs">
            English <Globe className="w-3 h-3 ms-2" />
          </Button>
          <Link to="/" className="text-sm text-muted-foreground hover:text-white transition-colors flex items-center gap-2">
            العودة للرئيسية <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[500px] mx-auto my-auto py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl font-bold font-heading text-white mb-3">إنشاء حسابك الجديد</h1>
            <p className="text-muted-foreground text-sm">انضم إلى مجتمعنا من المحترفين والمبدعين بخطوات بسيطة.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <p className="text-sm font-bold text-white text-center">اختر نوع حسابك المناسب:</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Job Seeker Card */}
              <button 
                onClick={() => setAccountType("seeker")}
                className={`relative overflow-hidden p-6 rounded-2xl border text-start transition-all duration-300 flex flex-col gap-4 group ${
                  accountType === "seeker" 
                    ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(18,75,201,0.2)]" 
                    : "bg-transparent border-white/10 hover:border-white/20 hover:bg-white/5"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  accountType === "seeker" ? "bg-primary text-white" : "bg-white/5 text-muted-foreground group-hover:text-white"
                }`}>
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-bold mb-1 ${accountType === "seeker" ? "text-primary" : "text-white"}`}>باحث عن عمل</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">أريد البحث عن فرص وظيفية مميزة ومعرفة قيمتي السوقية.</p>
                </div>
              </button>

              {/* Service Provider / Employer Card */}
              <button 
                onClick={() => setAccountType("provider")}
                className={`relative overflow-hidden p-6 rounded-2xl border text-start transition-all duration-300 flex flex-col gap-4 group ${
                  accountType === "provider" 
                    ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(18,75,201,0.2)]" 
                    : "bg-transparent border-white/10 hover:border-white/20 hover:bg-white/5"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  accountType === "provider" ? "bg-primary text-white" : "bg-white/5 text-muted-foreground group-hover:text-white"
                }`}>
                  <Rocket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-bold mb-1 ${accountType === "provider" ? "text-primary" : "text-white"}`}>مقدم خدمة / جهة</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">أريد توظيف أفضل الكفاءات وإدارة عمليات التوظيف بذكاء.</p>
                </div>
              </button>

            </div>

            <Button 
              disabled={!accountType}
              className={`w-full h-12 text-base font-bold rounded-xl transition-all mt-4 ${
                accountType 
                  ? "bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(18,75,201,0.3)] hover:shadow-[0_0_30px_rgba(18,75,201,0.5)]" 
                  : "bg-white/5 text-muted-foreground cursor-not-allowed"
              }`}
            >
              التالي
            </Button>

            <p className="text-center text-muted-foreground text-sm mt-4">
              هل لديك حساب بالفعل؟{" "}
              <Link to={ROUTES.AUTH.LOGIN} className="text-primary hover:text-white font-bold transition-colors">
                تسجيل الدخول
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground/50">جميع الحقوق محفوظة لمصممي ومطوري منصة فائدة © 2026</p>
        </div>
      </div>

      {/* Right Panel: Brand Hero (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-[#091122] overflow-hidden flex-col justify-between p-12">
        {/* Ambient Gradients */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        
        {/* Abstract Pattern overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />

        {/* Logo Area */}
        <div className="relative z-10 flex justify-end">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black font-heading text-white tracking-tight">منصة <span className="text-primary">فائدة</span></span>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm" />
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-start justify-center h-full max-w-lg mx-auto text-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mb-6"
          >
            <Briefcase className="w-3 h-3" />
            انضم لمنصة المحترفين
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-5xl font-extrabold font-heading text-white leading-[1.3] mb-6"
          >
            ابدأ رحلتك المهنية معنا وتميز عن الآخرين.
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            سواء كنت تبحث عن فرصة عمل مميزة أو تقدم خدمات استشارية واحترافية، منصتنا هي وجهتك المثالية للنمو والنجاح.
          </motion.p>
        </div>

        {/* Footer Features */}
        <div className="relative z-10 flex justify-end gap-8 pt-8 border-t border-white/5">
          <div className="flex items-center gap-2 text-sm text-white/80">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            خطوات سريعة
          </div>
          <div className="flex items-center gap-2 text-sm text-white/80">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            حماية وأمان عالي
          </div>
        </div>

      </div>

    </div>
  )
}
