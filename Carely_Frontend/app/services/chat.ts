import { apiFetch } from '../api';

export type Conversation = {
  id: string;
  participants: string[];
  lastMessage?: { senderId: string; text: string; createdAt: string } | null;
  updatedAt?: string;
  otherUser?: any;
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  status?: 'sent' | 'delivered' | 'read';
};

export async function listConversations(userId: string): Promise<Conversation[]> {
  return apiFetch(`/chat/conversations?userId=${encodeURIComponent(userId)}`);
}

export async function startConversation(participants: string[]): Promise<Conversation> {
  return apiFetch('/chat/conversations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ participants }),
  });
}

export async function listMessages(conversationId: string, limit = 50): Promise<Message[]> {
  return apiFetch(`/chat/conversations/${conversationId}/messages?limit=${limit}`);
}

export async function sendMessage(conversationId: string, senderId: string, text: string): Promise<Message> {
  return apiFetch(`/chat/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ senderId, text }),
  });
}

export type LightweightUser = { id: string; fullName?: string; email?: string; role?: string };
export async function listUsers(excludeId?: string): Promise<LightweightUser[]> {
  const q = excludeId ? `?excludeId=${encodeURIComponent(excludeId)}` : '';
  return apiFetch(`/register/users${q}`);
}
