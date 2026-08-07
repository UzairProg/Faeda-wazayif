import * as React from "react"
import { cn } from "@/lib/utils"

interface MockupFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  title?: string
}

export function MockupFrame({ children, className, title, ...props }: MockupFrameProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-white/10 bg-[#0A110E] shadow-2xl shadow-black/50 ring-1 ring-white/5",
        className
      )}
      {...props}
    >
      {/* Window Header */}
      <div className="flex h-10 items-center justify-between border-b border-white/5 bg-[#0F1714] px-4">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
        </div>
        {title && (
          <div className="text-xs font-medium text-muted-foreground">
            {title}
          </div>
        )}
        <div className="w-10" /> {/* Spacer for centering */}
      </div>
      
      {/* Window Body */}
      <div className="relative">
        {children}
      </div>
    </div>
  )
}
