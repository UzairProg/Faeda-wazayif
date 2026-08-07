import { useEffect, useState } from "react"
import { useInView } from "framer-motion"
import * as React from "react"

interface AnimatedCounterProps {
  from?: number
  to: number
  duration?: number
  className?: string
  suffix?: string
}

export function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  className,
  suffix = "",
}: AnimatedCounterProps) {
  const [count, setCount] = useState(from)
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (!isInView) return

    let startTime: number
    let animationFrame: number

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      
      // Easing function (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      
      setCount(Math.floor(easeProgress * (to - from) + from))

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step)
      }
    }

    animationFrame = window.requestAnimationFrame(step)
    return () => window.cancelAnimationFrame(animationFrame)
  }, [from, to, duration, isInView])

  return (
    <span ref={ref} className={className}>
      {count.toLocaleString()}{suffix}
    </span>
  )
}
