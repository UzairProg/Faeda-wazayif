import { useEffect } from "react"
import { useLangStore } from "@/store/lang.store"

export function RTLProvider({ children }: { children: React.ReactNode }) {
  const { lang, isRTL } = useLangStore()

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr"
    document.documentElement.lang = lang
  }, [lang, isRTL])

  return <>{children}</>
}
