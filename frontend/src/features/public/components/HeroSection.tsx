import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

import { Search, Sparkles, Play, Pause, Volume2, VolumeX } from "lucide-react"

import { Link } from "react-router-dom"
import { ROUTES } from "@/config/routes"

// @ts-ignore
import heroVideo from "../../../assets/video/Video_heroPage.webm"

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!videoRef.current) return

        if (entry.isIntersecting) {
          // Hero is visible (>= 50%)
          videoRef.current.muted = true
          setIsMuted(true)

          const playPromise = videoRef.current.play()
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Autoplay was prevented
              setIsPlaying(false)
            })
          }
          setIsPlaying(true)
        } else {
          // Hero is NOT visible (< 50%)
          videoRef.current.pause()
          setIsPlaying(false)

          videoRef.current.muted = true
          setIsMuted(true)
        }
      },
      {
        threshold: 0.5,
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      observer.disconnect()
    }
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

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* Soft Blue Radial Background */}
      <div className="absolute top-0 end-0 -translate-y-1/4 translate-x-1/4">
        <div className="h-[600px] w-[600px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      </div>
      <div className="absolute bottom-0 start-0 -translate-y-1/4 -translate-x-1/4">
        <div className="h-[500px] w-[500px] rounded-full bg-[#124BC9]/10 blur-[100px] pointer-events-none" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full h-full pb-0 lg:pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-end h-full">

          {/* Content (Visually Right in RTL) */}
          <div className="flex flex-col justify-end text-start relative z-20 w-full max-w-2xl py-12 lg:py-4 pb-8 lg:pb-12 h-full">
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary shadow-sm w-fit mt-8 lg:mt-20"
            >
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>منظومة مهنية متكاملة</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-4xl font-extrabold font-heading tracking-tight sm:text-5xl lg:text-6xl mb-6 text-white leading-tight"
            >
              منظومة واحدة لمسارك <br />
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-l from-primary to-accent">المهني وفرصك القادمة</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed"
            >
              ابنِ هويتك المهنية، افهم قيمتك السوقية، واكتشف الفرص التي تناسبك — في بيئة واحدة توحد الكفاءات، الشركات، والفرق التخصصية.
            </motion.p>

            {/* Primary & Secondary Hero CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="flex flex-wrap items-center gap-4 mb-8"
            >
              <Link to={ROUTES.AUTH.REGISTER}>
                <Button size="lg" className="rounded-xl px-8 shadow-lg shadow-primary/20 text-white font-bold text-sm bg-primary hover:bg-[#2D6BFF] h-12">
                  ابدأ مسارك المهني
                </Button>
              </Link>
              <Link to={ROUTES.JOBS.LIST}>
                <Button size="lg" variant="outline" className="rounded-xl px-8 border-white/10 bg-white/5 text-white hover:bg-white/10 h-12 font-bold text-sm">
                  استكشف المنظومة والفرص
                </Button>
              </Link>
            </motion.div>

            {/* Lightweight Ecosystem Search Entry Bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="w-full max-w-xl mb-6"
            >
              <Link to={ROUTES.JOBS.LIST} className="block group">
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-card/50 backdrop-blur-md px-5 py-3 border border-white/10 group-hover:border-primary/40 group-hover:bg-card/70 transition-all shadow-xl">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Search className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-sm">ابحث عن فرصة، مهارة، شركة، أو فريق تخصصي...</span>
                  </div>
                  <span className="text-xs font-bold text-primary px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
                    استكشاف ←
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* Popular Searches */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
              className="flex flex-wrap gap-2 text-sm text-muted-foreground items-center"
            >
              <span className="font-semibold ms-1 text-[#C8D2E4]">الأكثر بحثاً:</span>
              {["القيمة السوقية", "تحليل ATS", "توظيف فرق", "مهندس برمجيات", "عن بعد", "الرياض"].map((chip) => (
                <Link
                  key={chip}
                  to={`${ROUTES.JOBS.LIST}?q=${encodeURIComponent(chip)}`}
                  className="px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 hover:text-white transition-colors text-xs text-muted-foreground"
                >
                  {chip}
                </Link>
              ))}
            </motion.div>
          </div>

          {/* Visual Presenter Video (Visually Left) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative w-full h-full lg:min-h-[500px] mx-auto lg:mx-0 flex justify-center items-end pointer-events-auto"
          >
            {/* Transparent WebM Video */}
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

            {/* Custom Video Controls */}
            <div className="absolute bottom-8 left-8 flex items-center gap-3 z-30">
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
