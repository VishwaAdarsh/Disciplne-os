/**
 * Analytics API Client Service (SPR-313)
 */

import type { AnalyticsDTO, AnalyticsTimeRange } from '../../types/analytics';

const API_BASE = '/api/v1/analytics';

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
    throw new Error(data.message || 'Failed to fetch analytics data');
  }
  return data.data;
}

export const analyticsApi = {
  async getAnalytics(range: AnalyticsTimeRange = '30d'): Promise<AnalyticsDTO> {
    return fetchJson<AnalyticsDTO>(`${API_BASE}?range=${range}`);
  },
};
