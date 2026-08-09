/**
 * features/public/components/HeroSection.tsx
 *
 * Hero section for Faeda Jobs landing page.
 * Compact height, balanced video scale, clean text badge, and full AR/EN/HI localization.
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
    : language === "hi"
    ? ["बाजार मूल्य", "एटीएस विश्लेषण", "टीम भर्ती", "सॉफ्टवेयर इंजीनियर", "रिमोट", "रियाध"]
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
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="flex flex-wrap items-center gap-3 mb-6"
            >
              <Button
                asChild
                size="lg"
                className="h-11 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 shadow-lg shadow-primary/25 group/btn"
              >
                <Link to={ROUTES.JOBS.LIST} className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span>{t("public.hero.exploreJobsCta")}</span>
                  <ArrowIcon className="h-4 w-4 transition-transform group-hover/btn:-translate-x-1" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-11 rounded-full border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white font-medium px-6"
              >
                <Link to={ROUTES.TEAMS.LIST} className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <span>{t("public.hero.exploreTeamsCta")}</span>
                </Link>
              </Button>
            </motion.div>

            {/* Popular Search Chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground"
            >
              <span className="font-semibold text-white/70 me-1">{t("public.hero.popularSearches")}</span>
              {popularChips.map((chip) => (
                <Link
                  key={chip}
                  to={`${ROUTES.JOBS.LIST}?q=${encodeURIComponent(chip)}`}
                  className="px-2.5 py-1 rounded-full bg-white/5 border border-white/5 hover:border-primary/30 hover:text-white transition-all text-[11px]"
                >
                  {chip}
                </Link>
              ))}
            </motion.div>
          </div>

          {/* Right Video Container */}
          <div className="relative flex items-end justify-center w-full h-full pt-4 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-[500px] sm:max-w-[560px] lg:max-w-none flex justify-center items-end"
            >
              <div className="relative w-full rounded-t-[2.5rem] overflow-hidden border-t border-x border-white/15 bg-card/60 backdrop-blur-xl shadow-2xl shadow-primary/10 group">
                <video
                  ref={videoRef}
                  src={heroVideo}
                  muted={isMuted}
                  loop
                  playsInline
                  autoPlay
                  className="w-full h-auto max-h-[380px] sm:max-h-[440px] lg:max-h-[480px] object-cover object-bottom transition-transform duration-700 group-hover:scale-[1.01]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80 pointer-events-none" />

                {/* Video Controls Overlay */}
                <div className="absolute bottom-4 start-4 end-4 flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={togglePlay}
                      className="h-9 w-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-all shadow-lg"
                      aria-label={isPlaying ? "Pause video" : "Play video"}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ms-0.5" />}
                    </button>
                    <button
                      onClick={toggleMute}
                      className="h-9 w-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-all shadow-lg"
                      aria-label={isMuted ? "Unmute video" : "Mute video"}
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                  </div>

                  <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-white/90 shadow-lg">
                    {t("public.hero.videoBadge")}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
