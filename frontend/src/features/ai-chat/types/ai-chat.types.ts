/**
 * features/ai-chat/types/ai-chat.types.ts
 *
 * Types for the Groq AI Chatbot Assistant widget.
 */

export interface AiChatMessage {
  id: string
  sender: "user" | "bot" | "system"
  text: string
  timestamp: string
  status?: "sending" | "sent" | "error"
  quickLinks?: Array<{
    label_ar: string
    label_en: string
    label_hi: string
    url: string
  }>
}

export interface QuickPrompt {
  id: string
  text_ar: string
  text_en: string
  text_hi: string
  category: "market-value" | "jobs" | "cv" | "teams"
}

export interface AiChatState {
  isOpen: boolean
  isMinimized: boolean
  messages: AiChatMessage[]
  isLoading: boolean
  error: string | null
}
