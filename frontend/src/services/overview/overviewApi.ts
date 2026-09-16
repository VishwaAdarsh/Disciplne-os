/**
 * Overview API Service (SPR-312)
 */

import type { DailyOverviewDTO } from '../../types/overview';

const API_BASE = '/api/v1/overview';

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
    throw new Error(data.message || 'Failed to fetch overview data');
  }
  return data.data;
}

export const overviewApi = {
  async getDailyOverview(date?: string): Promise<DailyOverviewDTO> {
    const query = date ? `?date=${encodeURIComponent(date)}` : '';
    return fetchJson<DailyOverviewDTO>(`${API_BASE}${query}`);
  },
};
