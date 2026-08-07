import * as React from "react"
import { cn } from "@/lib/utils"

interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  from?: string
  via?: string
  to?: string
}

export function GradientText({
  children,
  className,
  from = "from-primary",
  via = "via-primary/80",
  to = "to-primary/50",
  ...props
}: GradientTextProps) {
  return (
    <span
      className={cn(
        "bg-clip-text text-transparent bg-gradient-to-r",
        from,
        via,
        to,
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
