/**
 * features/chat/types/chat.types.ts
 *
 * Strongly-typed domain models for Faeda Professional Chat & Real-Time Messaging.
 */

export type ConversationType = 'CANDIDATE_COMPANY' | 'TEAM_INTERNAL' | 'TEAM_COMPANY' | 'DIRECT'
export type ParticipantType = 'candidate' | 'company' | 'team' | 'admin'
export type MessageType = 'text' | 'system' | 'file'

export interface Participant {
  id: number
  conversationId: number
  type: ParticipantType
  idRef: number
  name: string
  avatar: string | null
  joinedAt?: string
  lastReadAt?: string | null
}

export interface CounterpartMeta {
  type: ParticipantType | 'unknown'
  id: number
  name: string
  avatar: string | null
  badge?: string
  badgeEn?: string
}

export interface ChatMessage {
  id: number
  conversationId: number
  senderType: ParticipantType
  senderId: number
  senderName: string
  senderAvatar: string | null
  isOwn: boolean
  body: string
  messageType: MessageType
  createdAt: string
  editedAt?: string | null
  isDeleted: boolean
  isRead: boolean
}

export interface ConversationSummary {
  id: number
  type: ConversationType
  subject: string
  context: {
    type: string | null
    id: string | null
  }
  counterpart: CounterpartMeta
  participants: Participant[]
  lastMessage: ChatMessage | null
  lastMessageAt: string
  unreadCount: number
  createdAt: string
  updatedAt: string
}

export interface ConversationDetailResponse {
  success: boolean
  conversation: ConversationSummary
  messages: ChatMessage[]
  totalMessages: number
}

export interface ConversationListResponse {
  success: boolean
  conversations: ConversationSummary[]
  total: number
}

export interface UnreadCountResponse {
  success: boolean
  unreadCount: number
}

export interface CreateConversationPayload {
  type: ConversationType
  targetId: number
  subject?: string
  contextType?: string
  contextId?: string | number
  initialMessage?: string
}

export interface SendMessagePayload {
  body: string
  messageType?: MessageType
}
