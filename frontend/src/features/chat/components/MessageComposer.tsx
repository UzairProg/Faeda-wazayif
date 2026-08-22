/**
 * features/chat/components/MessageComposer.tsx
 *
 * Message input composer bar with auto-expanding textarea, keyboard shortcuts, and character limit.
 */
import React, { useState, useRef, useEffect } from "react"
import { Send, Loader2 } from "lucide-react"
import { useTranslation } from "@/i18n"

interface MessageComposerProps {
  onSendMessage: (body: string) => Promise<void>
  disabled?: boolean
}

const MAX_CHARS = 4000

export const MessageComposer: React.FC<MessageComposerProps> = ({
  onSendMessage,
  disabled = false,
}) => {
  const { t, isRTL } = useTranslation()
  const [text, setText] = useState("")
  const [isSending, setIsSending] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140
      )}px`
    }
  }, [text])

  const handleSubmit = async () => {
    const trimmed = text.trim()
    if (!trimmed || isSending || disabled) return

    setIsSending(true)
    try {
      await onSendMessage(trimmed)
      setText("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
        textareaRef.current.focus()
      }
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const charsRemaining = MAX_CHARS - text.length
  const isNearLimit = charsRemaining < 200

  return (
    <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
      <div className="relative flex items-end gap-2 bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-2 border border-slate-200 dark:border-slate-700/80 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("chat.composer.placeholder")}
          disabled={disabled || isSending}
          maxLength={MAX_CHARS}
          rows={1}
          className="flex-1 max-h-[140px] resize-none bg-transparent border-0 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-0 px-2 py-1.5 leading-relaxed"
        />

        {/* Character Limit Badge (if close to limit) */}
        {isNearLimit && (
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
              charsRemaining < 0
                ? "text-red-600 bg-red-50 dark:bg-red-950/40"
                : "text-amber-600 bg-amber-50 dark:bg-amber-950/40"
            }`}
          >
            {charsRemaining}
          </span>
        )}

        {/* Send Button */}
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || isSending || disabled}
          className={`p-2.5 rounded-xl font-bold transition-all shrink-0 flex items-center justify-center ${
            text.trim() && !isSending && !disabled
              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 hover:scale-105 active:scale-95"
              : "bg-slate-200 dark:bg-slate-700/60 text-slate-400 dark:text-slate-500 cursor-not-allowed"
          }`}
          title={t("chat.composer.send")}
        >
          {isSending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} />
          )}
        </button>
      </div>
    </div>
  )
}
