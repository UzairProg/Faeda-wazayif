import React, { useEffect, useState } from "react"
import { createPortal } from "react-dom"

interface ModalPortalProps {
  children: React.ReactNode
}

/**
 * ModalPortal renders its children directly into document.body.
 * This guarantees that modal dialogs and overlays are NEVER trapped or clipped
 * by parent cards with `overflow-hidden`, `backdrop-filter`, `transform`, or custom stacking contexts.
 */
export function ModalPortal({ children }: ModalPortalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted || typeof document === "undefined") {
    return null
  }

  return createPortal(children, document.body)
}

export default ModalPortal
