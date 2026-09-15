/**
 * Goals Module API Service (SPR-311)
 */

const API_BASE = '/api/v1/goals';

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
    throw new Error(data.message || 'API Request failed');
  }
  return data.data;
}

export interface GoalPayload {
  title: string;
  description?: string;
  category?: string;
  goalType?: string;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  color?: string;
  priority?: string;
  status?: string;
  startDate?: string;
  deadline?: string;
  notes?: string;
  milestones?: Array<{ title: string; dueDate?: string }>;
}

export const goalsApi = {
  async getGoals(params?: { status?: string; category?: string }): Promise<any[]> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.category) searchParams.set('category', params.category);
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return fetchJson<any[]>(`${API_BASE}${query}`);
  },

  async getGoalsSummary(): Promise<any> {
    return fetchJson(`${API_BASE}/summary`);
  },

  async getGoalById(id: string): Promise<any> {
    return fetchJson(`${API_BASE}/${id}`);
  },

  async createGoal(input: GoalPayload): Promise<any> {
    return fetchJson(`${API_BASE}`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async updateGoal(id: string, updates: Partial<GoalPayload>): Promise<any> {
    return fetchJson(`${API_BASE}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async deleteGoal(id: string): Promise<boolean> {
    await fetchJson(`${API_BASE}/${id}`, { method: 'DELETE' });
    return true;
  },

  async setGoalStatus(id: string, status: string): Promise<any> {
    return fetchJson(`${API_BASE}/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async updateProgress(id: string, progressPercent: number, currentValue?: number): Promise<any> {
    return fetchJson(`${API_BASE}/${id}/progress`, {
      method: 'PATCH',
      body: JSON.stringify({ progressPercent, currentValue }),
    });
  },

  async addMilestone(goalId: string, title: string, dueDate?: string): Promise<any> {
    return fetchJson(`${API_BASE}/${goalId}/milestones`, {
      method: 'POST',
      body: JSON.stringify({ title, dueDate }),
    });
  },

  async toggleMilestone(goalId: string, milestoneId: string): Promise<any> {
    return fetchJson(`${API_BASE}/${goalId}/milestones/${milestoneId}/toggle`, {
      method: 'PATCH',
    });
  },

  async deleteMilestone(goalId: string, milestoneId: string): Promise<boolean> {
    await fetchJson(`${API_BASE}/${goalId}/milestones/${milestoneId}`, {
      method: 'DELETE',
    });
    return true;
  },
};
