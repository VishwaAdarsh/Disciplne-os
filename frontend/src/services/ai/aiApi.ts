/**
 * AI Coach API Client Service (SPR-314 / ARCH-006)
 */

import type {
  AIChatResponseDTO,
  AIConversationDTO,
  AIMessageDTO,
  DailyBriefing,
  AIReport,
} from '../../types/ai';

const API_BASE = '/api/v1/ai';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('dos_token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers as Record<string, string>),
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.message || 'Failed to complete AI Coach request');
  }
  return data.data;
}

export const aiApi = {
  async chat(message: string, conversationId?: string): Promise<AIChatResponseDTO> {
    return fetchJson<AIChatResponseDTO>(`${API_BASE}/chat`, {
      method: 'POST',
      body: JSON.stringify({ message, conversationId }),
    });
  },

  async getConversations(): Promise<AIConversationDTO[]> {
    return fetchJson<AIConversationDTO[]>(`${API_BASE}/conversations`);
  },

  async createConversation(title?: string): Promise<AIConversationDTO> {
    return fetchJson<AIConversationDTO>(`${API_BASE}/conversations`, {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  },

  async getMessages(conversationId: string): Promise<AIMessageDTO[]> {
    return fetchJson<AIMessageDTO[]>(`${API_BASE}/conversations/${conversationId}/messages`);
  },

  async deleteConversation(conversationId: string): Promise<{ success: boolean }> {
    return fetchJson<{ success: boolean }>(`${API_BASE}/conversations/${conversationId}`, {
      method: 'DELETE',
    });
  },

  async getBriefing(): Promise<DailyBriefing> {
    return fetchJson<DailyBriefing>(`${API_BASE}/briefing`);
  },

  async generateReport(type: 'daily' | 'weekly' | 'monthly'): Promise<AIReport> {
    return fetchJson<AIReport>(`${API_BASE}/reports`, {
      method: 'POST',
      body: JSON.stringify({ type }),
    });
  },
};
