/**
 * features/ai-chat/components/AiChatbotWidget.tsx
 *
 * Modern, production-grade Floating Groq AI Chatbot Widget.
 * Powered by Groq LLM (llama-3.3-70b-versatile) via Flask POST /api/chat.
 * Features:
 * - Glassmorphic floating window with smooth Framer Motion transitions
 * - Real-time conversational AI with Markdown formatting and quick navigation links
 * - 3-dots animated typing indicator
 * - Dynamic quick-prompt suggestion pills
 * - Clear chat memory & Minimize capabilities
 * - Trilingual RTL/LTR support (Arabic, English, Hindi)
 */
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bot,
  Sparkles,
  Send,
  X,
  Minus,
  RotateCcw,
  ExternalLink,
  ChevronDown,
} from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/i18n"
import { aiChatService, DEFAULT_QUICK_PROMPTS } from "../services/ai-chat.service"
import type { AiChatMessage } from "../types/ai-chat.types"

export function AiChatbotWidget() {
  const { language, isRTL } = useTranslation()

  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initial welcome message based on active language
  const initialGreeting: AiChatMessage = {
    id: "welcome-msg",
    sender: "bot",
    text:
      language === "ar"
        ? "أهلاً بك! أنا مساعدك الذكي في منصة **فائدة وظائف** (مدعوم بـ Groq Llama 3.3). كيف يمكنني مساعدتك في استكشاف الوظائف أو احتساب قيمتك السوقية اليوم؟"
        : language === "hi"
        ? "नमस्ते! मैं **फ़ायदा जॉब्स** का आधिकारिक एआई सलाहकार हूँ (Groq Llama 3.3 द्वारा संचालित)। मैं आज आपकी क्या सहायता कर सकता हूँ?"
        : "Hello! I am your AI Career Advisor on **Faeda Jobs**, powered by Groq Llama 3.3. How can I assist you with career insights or market valuation today?",
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  }

  const [messages, setMessages] = useState<AiChatMessage[]>([initialGreeting])

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom()
      inputRef.current?.focus()
    }
  }, [messages, isOpen, isMinimized])

  // Handle Send Message
  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || inputValue).trim()
    if (!messageText || isLoading) return

    const userMsg: AiChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInputValue("")
    setIsLoading(true)

    try {
      const res = await aiChatService.sendMessage(messageText, language)
      const botMsg: AiChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        quickLinks: res.quickLinks,
      }
      setMessages((prev) => [...prev, botMsg])
    } catch {
      const errorMsg: AiChatMessage = {
        id: `err-${Date.now()}`,
        sender: "bot",
        text:
          language === "ar"
            ? "عذراً، حدث خطأ أثناء الاتصال بالمساعد الذكي. يرجى المحاولة مرة أخرى."
            : language === "hi"
            ? "क्षमा करें, प्रतिक्रिया प्राप्त करने में समस्या हुई। कृपया पुनः प्रयास करें।"
            : "Sorry, there was an issue getting a response. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Quick Prompt Click
  const handlePromptClick = (promptText: string) => {
    handleSendMessage(promptText)
  }

  // Clear Chat History
  const handleClearHistory = () => {
    setMessages([initialGreeting])
  }

  // Toggle Widget Window
  const toggleOpen = () => {
    if (!isOpen) {
      setIsOpen(true)
      setIsMinimized(false)
    } else {
      setIsOpen(false)
    }
  }

  return (
    <div className={`fixed bottom-6 ${isRTL ? "left-6" : "right-6"} z-50 flex flex-col items-end`}>
      {/* ── 1. The Chatbot Window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? "auto" : "540px",
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`w-[360px] sm:w-[410px] max-w-[calc(100vw-32px)] bg-[#0c1526]/95 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden flex flex-col mb-4 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-primary/20 via-slate-900 to-slate-900 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-sm">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-white font-heading leading-tight">
                      {language === "ar" ? "مساعد فائدة الذكي" : language === "hi" ? "फ़ायदा एआई सहायक" : "Faeda AI Advisor"}
                    </h3>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-primary/20 text-primary uppercase tracking-wider font-mono">
                      Groq
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <span>{language === "ar" ? "متصل • Llama 3.3" : language === "hi" ? "ऑनलाइन • Llama 3.3" : "Online • Llama 3.3"}</span>
                  </span>
                </div>
              </div>

              {/* Window Controls */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleClearHistory}
                  title={language === "ar" ? "مسح المحادثة" : "Clear Chat"}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? "Expand" : "Minimize"}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {isMinimized ? <ChevronDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Collapsible Body (Hidden if Minimized) */}
            {!isMinimized && (
              <>
                {/* Messages Stream Area */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs sm:text-sm">
                  {messages.map((msg) => {
                    const isUser = msg.sender === "user"
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-2.5 ${isUser ? (isRTL ? "flex-row-reverse" : "flex-row-reverse") : ""}`}
                      >
                        {/* Avatar */}
                        {!isUser && (
                          <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0 mt-0.5">
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                        )}

                        <div className={`space-y-1.5 max-w-[82%]`}>
                          {/* Message Bubble */}
                          <div
                            className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                              isUser
                                ? "bg-primary text-white rounded-br-none shadow-md shadow-primary/20 font-medium"
                                : "bg-slate-900/90 text-slate-200 border border-white/10 rounded-bl-none shadow-sm"
                            }`}
                          >
                            {msg.text}
                          </div>

                          {/* Quick Navigation Links if provided */}
                          {msg.quickLinks && msg.quickLinks.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {msg.quickLinks.map((link) => (
                                <Link
                                  key={link.url}
                                  to={link.url}
                                  onClick={() => setIsOpen(false)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[11px] font-bold transition-all shadow-sm group"
                                >
                                  <span>
                                    {language === "ar"
                                      ? link.label_ar
                                      : language === "hi"
                                      ? link.label_hi
                                      : link.label_en}
                                  </span>
                                  <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                              ))}
                            </div>
                          )}

                          {/* Timestamp */}
                          <span
                            className={`text-[10px] text-slate-500 block ${
                              isUser ? "text-end" : "text-start"
                            }`}
                          >
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    )
                  })}

                  {/* Typing Indicator */}
                  {isLoading && (
                    <div className="flex gap-2.5 items-center">
                      <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                      <div className="px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts Pills Row */}
                <div className="px-4 py-2 border-t border-white/5 bg-slate-950/40">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
                    {DEFAULT_QUICK_PROMPTS.map((prompt) => {
                      const label =
                        language === "ar"
                          ? prompt.text_ar
                          : language === "hi"
                          ? prompt.text_hi
                          : prompt.text_en
                      return (
                        <button
                          key={prompt.id}
                          type="button"
                          onClick={() => handlePromptClick(label)}
                          className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 text-slate-300 hover:text-white text-[10px] font-medium whitespace-nowrap transition-all shrink-0"
                        >
                          {label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Input Area */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                  }}
                  className="p-3 bg-slate-900/90 border-t border-white/10 flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={
                      language === "ar"
                        ? "اكتب استفسارك هنا..."
                        : language === "hi"
                        ? "अपना प्रश्न यहाँ लिखें..."
                        : "Ask about jobs, salary, or CV..."
                    }
                    className="flex-1 bg-white/5 border border-white/10 focus:border-primary rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none transition-colors"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!inputValue.trim() || isLoading}
                    className="w-10 h-10 rounded-xl bg-primary hover:bg-primary/90 text-white flex items-center justify-center shrink-0 disabled:opacity-40 transition-all shadow-md shadow-primary/25"
                  >
                    <Send className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 2. Floating Action Button (Widget Trigger) ── */}
      <motion.button
        type="button"
        onClick={toggleOpen}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative group w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary via-primary to-sky-400 text-white shadow-xl shadow-primary/30 flex items-center justify-center border border-white/20 transition-all"
        aria-label="Open Faeda AI Assistant"
      >
        {/* Subtle Ambient Pulse Ring */}
        <span className="absolute inset-0 rounded-2xl bg-primary animate-ping opacity-25 pointer-events-none" />

        {/* Icon toggles between Bot/Sparkles and Close */}
        {isOpen ? (
          <X className="w-6 h-6 transition-transform group-hover:rotate-90 duration-200" />
        ) : (
          <div className="relative">
            <Bot className="w-6 h-6" />
            <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1.5 -right-2 animate-pulse" />
          </div>
        )}

        {/* Tooltip on Hover */}
        {!isOpen && (
          <span
            className={`absolute bottom-full mb-3 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs font-bold whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
              isRTL ? "left-0" : "right-0"
            }`}
          >
            {language === "ar"
              ? "اسأل مساعد فائدة الذكي (Groq AI) ⚡"
              : language === "hi"
              ? "फ़ायदा एआई से पूछें ⚡"
              : "Ask Faeda AI Assistant ⚡"}
          </span>
        )}
      </motion.button>
    </div>
  )
}
