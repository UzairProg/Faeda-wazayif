import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Mail, Lock, ArrowLeft, Globe, CheckCircle2 } from "lucide-react"
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"

export function Login() {
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
        <div className="w-full max-w-[420px] mx-auto my-auto py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl font-bold font-heading text-white mb-3">أهلاً بك مجدداً 👋</h1>
            <p className="text-muted-foreground text-sm">أدخل بياناتك للوصول إلى منصة التوظيف الذكية وحسابك.</p>
          </motion.div>

          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-white text-start">البريد الإلكتروني</label>
              <div className="relative group">
                <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full bg-transparent border border-white/10 rounded-xl py-3.5 ps-12 pe-4 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-start"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-white text-start">كلمة المرور</label>
                <a href="#" className="text-xs text-primary hover:text-primary/80 transition-colors font-semibold">هل نسيت كلمة المرور؟</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-transparent border border-white/10 rounded-xl py-3.5 ps-12 pe-4 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-start"
                  dir="ltr"
                />
              </div>
            </div>

            <Button className="w-full h-12 text-base font-bold rounded-xl bg-primary hover:bg-primary/90 text-white transition-all shadow-[0_0_20px_rgba(18,75,201,0.3)] hover:shadow-[0_0_30px_rgba(18,75,201,0.5)]">
              تسجيل الدخول
            </Button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-muted-foreground text-xs">أو المتابعة عبر</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <Button variant="outline" className="w-full h-12 text-sm font-bold rounded-xl bg-transparent border border-white/10 text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              تسجيل الدخول بواسطة Google
            </Button>

            <p className="text-center text-muted-foreground text-sm mt-4">
              ليس لديك حساب بعد؟{" "}
              <Link to={ROUTES.AUTH.REGISTER} className="text-primary hover:text-white font-bold transition-colors">
                إنشاء حساب جديد
              </Link>
            </p>
          </motion.form>
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
            المنصة الأذكى للتوظيف والمطابقة
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-5xl font-extrabold font-heading text-white leading-[1.3] mb-6"
          >
            اصنع مستقبلك المهني بخطوات احترافية بسيطة.
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            انضم إلى آلاف الكفاءات الذين تواصلوا مع أفضل الشركات وحصلوا على وظائف الأحلام عبر تقنيات الذكاء الاصطناعي.
          </motion.p>
        </div>

        {/* Footer Features */}
        <div className="relative z-10 flex justify-end gap-8 pt-8 border-t border-white/5">
          <div className="flex items-center gap-2 text-sm text-white/80">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            مطابقة ذكية
          </div>
          <div className="flex items-center gap-2 text-sm text-white/80">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            تحليلات سوقية
          </div>
        </div>

      </div>

    </div>
  )
}
