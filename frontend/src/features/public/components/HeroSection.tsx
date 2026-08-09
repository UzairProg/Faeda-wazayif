/**
 * features/public/components/HeroSection.tsx
 *
 * Hero section for Faeda Jobs landing page.
 * Video presenter touches bottom edge with original scale, and balanced text styling for AR & EN.
 */
import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Search, Sparkles, Play, Pause, Volume2, VolumeX, ArrowLeft, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"
import { useTranslation } from "@/i18n"

// @ts-ignore
import heroVideo from "../../../assets/video/Video_heroPage.webm"

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const { t, language, isRTL } = useTranslation()

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!videoRef.current) return
        if (entry.isIntersecting) {
          videoRef.current.muted = true
          setIsMuted(true)
          const playPromise = videoRef.current.play()
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              setIsPlaying(false)
            })
          }
          setIsPlaying(true)
        } else {
          videoRef.current.pause()
          setIsPlaying(false)
          videoRef.current.muted = true
          setIsMuted(true)
        }
      },
      { threshold: 0.5 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const popularChips = language === "en"
    ? ["Market Value", "ATS Analysis", "Team Hiring", "Software Engineer", "Remote", "Riyadh"]
    : ["القيمة السوقية", "تحليل ATS", "توظيف فرق", "مهندس برمجيات", "عن بعد", "الرياض"]

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-background">
      {/* Background Radial Washes */}
      <div className="absolute top-0 end-0 -translate-y-1/4 translate-x-1/4">
        <div className="h-[600px] w-[600px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      </div>
      <div className="absolute bottom-0 start-0 -translate-y-1/4 -translate-x-1/4">
        <div className="h-[500px] w-[500px] rounded-full bg-[#124BC9]/10 blur-[100px] pointer-events-none" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full h-full pb-0 lg:pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-end h-full">

          {/* Content */}
          <div className="flex flex-col justify-end text-start relative z-20 w-full max-w-2xl py-8 lg:py-4 pb-6 lg:pb-10 h-full">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 40 : -40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary shadow-sm w-fit mt-4 lg:mt-12"
            >
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>{t("public.hero.badge")}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading tracking-tight mb-4 text-white leading-tight"
            >
              {t("public.hero.heading")} <br />
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-l from-primary to-accent">
                {t("public.hero.subheading")}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="text-sm sm:text-base text-muted-foreground mb-6 max-w-xl leading-relaxed"
            >
              {t("public.hero.desc")}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
              className="flex flex-wrap items-center gap-4 mb-6"
            >
              <Link to={ROUTES.AUTH.REGISTER}>
                <Button size="lg" className="rounded-xl px-7 shadow-lg shadow-primary/20 text-white font-bold text-xs sm:text-sm bg-primary hover:bg-[#2D6BFF] h-11">
                  {t("public.cta.candidateCta")}
                </Button>
              </Link>
              <Link to={ROUTES.JOBS.LIST}>
                <Button size="lg" variant="outline" className="rounded-xl px-7 border-white/10 bg-white/5 text-white hover:bg-white/10 h-11 font-bold text-xs sm:text-sm">
                  {t("public.jobs.viewAll")}
                </Button>
              </Link>
            </motion.div>

            {/* Search Bar Entry */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
              className="w-full max-w-xl mb-4"
            >
              <Link to={ROUTES.JOBS.LIST} className="block group">
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-card/50 backdrop-blur-md px-4 py-2.5 border border-white/10 group-hover:border-primary/40 group-hover:bg-card/70 transition-all shadow-xl">
                  <div className="flex items-center gap-2.5 text-muted-foreground min-w-0">
                    <Search className="h-4.5 w-4.5 text-primary group-hover:scale-110 transition-transform shrink-0" />
                    <span className="text-xs sm:text-sm truncate">{t("public.hero.searchPlaceholder")}</span>
                  </div>
                  <span className="text-xs font-bold text-primary px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 shrink-0 flex items-center gap-1">
                    <span>{t("common.actions.search")}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* Popular Searches */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
              className="flex flex-wrap gap-1.5 text-xs text-muted-foreground items-center"
            >
              <span className="font-semibold me-1 text-[#C8D2E4]">{t("public.hero.popularSearches")}</span>
              {popularChips.map((chip) => (
                <Link
                  key={chip}
                  to={`${ROUTES.JOBS.LIST}?q=${encodeURIComponent(chip)}`}
                  className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 hover:text-white transition-colors text-[11px] text-muted-foreground"
                >
                  {chip}
                </Link>
              ))}
            </motion.div>
          </div>

          {/* Presenter Video (Restored exact original bottom alignment & scaling) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative w-full h-full lg:min-h-[500px] mx-auto lg:mx-0 flex justify-center items-end pointer-events-auto"
          >
            <video
              ref={videoRef}
              src={heroVideo}
              autoPlay
              muted
              playsInline
              loop
              preload="auto"
              className="w-full h-auto max-h-[85vh] object-contain object-bottom scale-[1.20] lg:scale-[1.30] origin-bottom translate-y-[2%]"
            />

            <div className="absolute bottom-8 start-8 flex items-center gap-3 z-30">
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-primary/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-primary transition-all shadow-lg hover:scale-105"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              <button
                onClick={toggleMute}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all shadow-lg hover:scale-105"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
