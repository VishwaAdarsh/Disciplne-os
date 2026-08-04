/**
 * Discipline Module API Service (SPR-307)
 */

import { DisciplineTask, DisciplineHabit } from '../types/discipline';

const API_BASE = '/api/v1';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.message || 'API Request failed');
  }
  return data.data;
}

export const disciplineApi = {
  // Tasks Endpoints
  async getTasks(params?: { category?: string; priority?: string; status?: string; search?: string; archived?: boolean }): Promise<DisciplineTask[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.priority) query.append('priority', params.priority);
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.archived !== undefined) query.append('archived', String(params.archived));

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchJson<DisciplineTask[]>(`${API_BASE}/tasks${queryString}`);
  },

  async createTask(input: Partial<DisciplineTask>): Promise<DisciplineTask> {
    return fetchJson<DisciplineTask>(`${API_BASE}/tasks`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async updateTask(id: string, updates: Partial<DisciplineTask>): Promise<DisciplineTask> {
    return fetchJson<DisciplineTask>(`${API_BASE}/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async completeTask(id: string): Promise<DisciplineTask> {
    return fetchJson<DisciplineTask>(`${API_BASE}/tasks/${id}/complete`, {
      method: 'PATCH',
    });
  },

  async archiveTask(id: string): Promise<DisciplineTask> {
    return fetchJson<DisciplineTask>(`${API_BASE}/tasks/${id}/archive`, {
      method: 'PATCH',
    });
  },

  async restoreTask(id: string): Promise<DisciplineTask> {
    return fetchJson<DisciplineTask>(`${API_BASE}/tasks/${id}/restore`, {
      method: 'PATCH',
    });
  },

  async deleteTask(id: string): Promise<boolean> {
    await fetchJson(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
    return true;
  },

  // Habits Endpoints
  async getHabits(): Promise<DisciplineHabit[]> {
    return fetchJson<DisciplineHabit[]>(`${API_BASE}/habits`);
  },

  async createHabit(input: Partial<DisciplineHabit>): Promise<DisciplineHabit> {
    return fetchJson<DisciplineHabit>(`${API_BASE}/habits`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async completeHabit(id: string): Promise<DisciplineHabit> {
    return fetchJson<DisciplineHabit>(`${API_BASE}/habits/${id}/complete`, {
      method: 'PATCH',
    });
  },

  async deleteHabit(id: string): Promise<boolean> {
    await fetchJson(`${API_BASE}/habits/${id}`, { method: 'DELETE' });
    return true;
  },
};
