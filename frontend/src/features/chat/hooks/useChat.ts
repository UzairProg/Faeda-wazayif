/**
 * features/chat/hooks/useChat.ts
 *
 * Real-time reactive React Query hooks for Faeda Professional Chat.
 * Includes background synchronization intervals, optimistic updates, and cache invalidation.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { chatService } from "../services/chat.service"
import type {
  CreateConversationPayload,
  SendMessagePayload,
  ChatMessage,
  ConversationSummary,
} from "../types/chat.types"

export const CHAT_QUERY_KEYS = {
  conversations: ["chat", "conversations"] as const,
  conversation: (id: string | number) => ["chat", "conversation", String(id)] as const,
  unreadCount: ["chat", "unreadCount"] as const,
}

/**
 * Hook to query all conversation threads with automatic background polling.
 */
export function useConversations() {
  return useQuery({
    queryKey: CHAT_QUERY_KEYS.conversations,
    queryFn: () => chatService.getConversations(),
    refetchInterval: 8000, // Poll every 8s
    staleTime: 4000,
  })
}

/**
 * Hook to query active conversation detail and message history with fast polling (3s).
 */
export function useConversation(convId: string | number | null | undefined) {
  return useQuery({
    queryKey: CHAT_QUERY_KEYS.conversation(convId || 0),
    queryFn: () => {
      if (!convId) throw new Error("Conversation ID required")
      return chatService.getConversationDetail(convId)
    },
    enabled: Boolean(convId && Number(convId) > 0),
    refetchInterval: convId ? 3000 : false, // Fast live polling when chat is open
    staleTime: 1500,
  })
}

/**
 * Hook to query aggregated global unread messages count for navbar/sidebar badges.
 */
export function useUnreadCount() {
  return useQuery({
    queryKey: CHAT_QUERY_KEYS.unreadCount,
    queryFn: () => chatService.getUnreadCount(),
    refetchInterval: 10000, // Poll every 10s
    staleTime: 5000,
  })
}

/**
 * Hook providing send message, create conversation, edit, delete, and mark read mutations.
 */
export function useChatActions() {
  const queryClient = useQueryClient()

  // Send message mutation with optimistic cache update
  const sendMessageMutation = useMutation({
    mutationFn: ({
      convId,
      payload,
    }: {
      convId: string | number
      payload: SendMessagePayload
    }) => chatService.sendMessage(convId, payload),
    onSuccess: (newMsg, variables) => {
      // Invalidate and refresh conversation messages
      queryClient.setQueryData(
        CHAT_QUERY_KEYS.conversation(variables.convId),
        (oldData: { conversation: ConversationSummary; messages: ChatMessage[] } | undefined) => {
          if (!oldData) return oldData
          const exists = oldData.messages.some((m) => m.id === newMsg.id)
          return {
            ...oldData,
            messages: exists ? oldData.messages : [...oldData.messages, newMsg],
          }
        }
      )
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations })
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversation(variables.convId) })
    },
  })

  // Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: (payload: CreateConversationPayload) =>
      chatService.createConversation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations })
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.unreadCount })
    },
  })

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (convId: string | number) => chatService.markAsRead(convId),
    onSuccess: (_, convId) => {
      // Optimistically clear unread count in conversations list
      queryClient.setQueryData(
        CHAT_QUERY_KEYS.conversations,
        (oldList: ConversationSummary[] | undefined) => {
          if (!oldList) return oldList
          return oldList.map((c) =>
            String(c.id) === String(convId) ? { ...c, unreadCount: 0 } : c
          )
        }
      )
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.unreadCount })
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations })
    },
  })

  // Edit message mutation
  const editMessageMutation = useMutation({
    mutationFn: ({
      msgId,
      body,
    }: {
      msgId: string | number
      body: string
      convId: string | number
    }) => chatService.editMessage(msgId, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.conversation(variables.convId),
      })
    },
  })

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: ({
      msgId,
    }: {
      msgId: string | number
      convId: string | number
    }) => chatService.deleteMessage(msgId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.conversation(variables.convId),
      })
    },
  })

  return {
    sendMessage: sendMessageMutation.mutateAsync,
    isSending: sendMessageMutation.isPending,
    createConversation: createConversationMutation.mutateAsync,
    isCreating: createConversationMutation.isPending,
    markAsRead: markAsReadMutation.mutateAsync,
    editMessage: editMessageMutation.mutateAsync,
    deleteMessage: deleteMessageMutation.mutateAsync,
  }
}
