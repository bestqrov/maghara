import { api } from './api';

export interface Conversation {
  _id: string;
  matchId: string;
  participants: string[];
  totalMessagesCount: number;
  isLockedForFree: boolean;
  unlockedBy: string[];
  lastMessageAt: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  messageText: string;
  isRead: boolean;
  createdAt: string;
}

export async function getOrCreateConversation(matchId: string) {
  const { data } = await api.post<Conversation>(`/chat/conversations/${matchId}`);
  return data;
}

export async function getMessages(conversationId: string) {
  const { data } = await api.get<Message[]>(`/chat/conversations/${conversationId}/messages`);
  return data;
}

export async function unlockConversation(conversationId: string) {
  const { data } = await api.post<Conversation>(`/chat/conversations/${conversationId}/unlock`);
  return data;
}

export const FREE_MESSAGE_LIMIT = 10;
export const UNLOCK_COIN_COST = 5;
