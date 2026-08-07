import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

import { Search, MapPin, Sparkles, Play, Pause, Volume2, VolumeX } from "lucide-react"

// @ts-ignore
import heroVideo from "../../../../video/Video_heroPage.webm"

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
        <div className="h-[600px] w-[600px] rounded-full bg-gradient-to-br from-primary/30 to-accent/10 blur-[120px] pointer-events-none" />
      </div>
      <div className="absolute bottom-0 start-0 -translate-y-1/4 -translate-x-1/4">
        <div className="h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-[#124BC9]/20 to-primary/5 blur-[100px] pointer-events-none" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full h-full pb-0 lg:pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-end h-full">

          {/* Content (Visually Right in RTL) */}
          <div className="flex flex-col justify-end text-start relative z-20 w-full max-w-2xl py-12 lg:py-4 pb-8 lg:pb-12 h-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md px-4 py-1.5 text-sm font-medium text-primary shadow-[0_0_20px_rgba(34,199,242,0.15)] w-fit mt-8 lg:mt-20"
            >
              <Sparkles className="h-4 w-4" />
              <span>ذكاء اصطناعي لمستقبلك المهني</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl font-extrabold font-heading tracking-tight sm:text-6xl lg:text-7xl mb-6 text-white leading-tight"
            >
              اكتشف قيمتك <br />
              <span className="text-primary">وضاعف فرصك</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed"
            >
              انضم إلى المنصة التي تجمع نخبة الكفاءات مع أفضل الشركات. حلل سيرتك الذاتية، واعرف قيمتك السوقية الحقيقية بدقة متناهية.
            </motion.p>

            {/* Smart Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full max-w-2xl mb-8"
            >
              <div className="flex flex-col sm:flex-row items-center gap-2 rounded-2xl bg-card/80 backdrop-blur-xl p-2 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)] ring-1 ring-white/10 focus-within:ring-primary/50 focus-within:shadow-[0_20px_50px_-12px_rgba(18,75,201,0.25)] transition-all duration-300">
                <div className="flex flex-1 items-center gap-3 px-4 py-3 w-full border-b sm:border-b-0 sm:border-e border-white/10 group">
                  <Search className="h-5 w-5 text-primary group-focus-within:text-accent transition-colors" />
                  <input
                    type="text"
                    placeholder="المسمى الوظيفي أو المهارة..."
                    className="w-full bg-transparent outline-none text-white placeholder:text-muted-foreground/60 focus:ring-0"
                  />
                </div>
                <div className="flex flex-1 items-center gap-3 px-4 py-3 w-full group">
                  <MapPin className="h-5 w-5 text-primary group-focus-within:text-accent transition-colors" />
                  <input
                    type="text"
                    placeholder="المدينة أو عن بعد..."
                    className="w-full bg-transparent outline-none text-white placeholder:text-muted-foreground/60 focus:ring-0"
                  />
                </div>
                <Button size="lg" className="w-full sm:w-auto rounded-xl px-8 shadow-lg shadow-primary/25 hover:shadow-primary/40 text-white font-bold text-base bg-gradient-to-r from-primary to-accent hover:to-primary transition-all duration-300">
                  ابحث
                </Button>
              </div>
            </motion.div>

            {/* Popular Searches */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="flex flex-wrap gap-2 text-sm text-muted-foreground items-center"
            >
              <span className="font-semibold ms-1 text-[#C8D2E4]">الأكثر بحثاً:</span>
              {["مهندس برمجيات", "محلل بيانات", "مدير منتج", "عن بعد", "الرياض"].map((chip) => (
                <button
                  key={chip}
                  className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/50 hover:text-white transition-all duration-300 text-xs text-muted-foreground shadow-sm hover:shadow-[0_0_15px_rgba(18,75,201,0.2)]"
                >
                  {chip}
                </button>
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
