/**
 * features/chat/services/chat.service.ts
 *
 * REST API client service for Faeda Professional Chat.
 */
import axios from "axios"
import { API_CONFIG } from "@/config/api"
import type {
  ConversationListResponse,
  ConversationDetailResponse,
  UnreadCountResponse,
  CreateConversationPayload,
  SendMessagePayload,
  ChatMessage,
  ConversationSummary,
} from "../types/chat.types"

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true,
})

export const chatService = {
  /**
   * Fetch list of active conversation threads for authenticated user/employer.
   */
  async getConversations(): Promise<ConversationSummary[]> {
    const res = await apiClient.get<ConversationListResponse>(
      API_CONFIG.ENDPOINTS.CHAT.CONVERSATIONS
    )
    return res.data?.conversations || []
  },

  /**
   * Fetch conversation detail, participants, and message history.
   */
  async getConversationDetail(convId: number | string): Promise<{
    conversation: ConversationSummary
    messages: ChatMessage[]
  }> {
    const res = await apiClient.get<ConversationDetailResponse>(
      API_CONFIG.ENDPOINTS.CHAT.CONVERSATION_DETAIL(convId)
    )
    return {
      conversation: res.data.conversation,
      messages: res.data.messages || [],
    }
  },

  /**
   * Create or retrieve an existing conversation.
   */
  async createConversation(payload: CreateConversationPayload): Promise<{
    conversation: ConversationSummary
    isExisting: boolean
  }> {
    const res = await apiClient.post<{
      success: boolean
      isExisting: boolean
      conversation: ConversationSummary
    }>(API_CONFIG.ENDPOINTS.CHAT.CREATE_CONVERSATION, payload)
    return {
      conversation: res.data.conversation,
      isExisting: res.data.isExisting,
    }
  },

  /**
   * Send a new message to a conversation thread.
   */
  async sendMessage(
    convId: number | string,
    payload: SendMessagePayload
  ): Promise<ChatMessage> {
    const res = await apiClient.post<{
      success: boolean
      message: ChatMessage
    }>(API_CONFIG.ENDPOINTS.CHAT.SEND_MESSAGE(convId), payload)
    return res.data.message
  },

  /**
   * Edit user's own message.
   */
  async editMessage(
    msgId: number | string,
    body: string
  ): Promise<ChatMessage> {
    const res = await apiClient.put<{
      success: boolean
      message: ChatMessage
    }>(API_CONFIG.ENDPOINTS.CHAT.EDIT_MESSAGE(msgId), { body })
    return res.data.message
  },

  /**
   * Soft-delete user's own message.
   */
  async deleteMessage(msgId: number | string): Promise<boolean> {
    const res = await apiClient.delete<{ success: boolean; message: string }>(
      API_CONFIG.ENDPOINTS.CHAT.DELETE_MESSAGE(msgId)
    )
    return res.data.success
  },

  /**
   * Mark conversation as read and update last_read_at timestamp.
   */
  async markAsRead(convId: number | string): Promise<boolean> {
    const res = await apiClient.post<{ success: boolean; message: string }>(
      API_CONFIG.ENDPOINTS.CHAT.MARK_READ(convId)
    )
    return res.data.success
  },

  /**
   * Fetch real aggregated unread messages count.
   */
  async getUnreadCount(): Promise<number> {
    const res = await apiClient.get<UnreadCountResponse>(
      API_CONFIG.ENDPOINTS.CHAT.UNREAD_COUNT
    )
    return res.data?.unreadCount || 0
  },
}
