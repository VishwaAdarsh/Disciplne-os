/**
 * Nutrition Module API Service (SPR-310)
 */

const API_BASE = '/api/v1/nutrition';

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

export interface MealInput {
  name: string;
  category?: string;
  calories?: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  fiberG?: number;
  notes?: string;
  logDate?: string;
}

export interface GoalsInput {
  caloriesTarget?: number;
  proteinTarget?: number;
  carbsTarget?: number;
  fatTarget?: number;
  waterTargetMl?: number;
}

export const nutritionApi = {
  async getMeals(date?: string, category?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (date) params.set('date', date);
    if (category) params.set('category', category);
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchJson<any[]>(`${API_BASE}/meals${query}`);
  },

  async logMeal(input: MealInput): Promise<any> {
    return fetchJson(`${API_BASE}/meals`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async updateMeal(id: string, updates: Partial<MealInput>): Promise<any> {
    return fetchJson(`${API_BASE}/meals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async deleteMeal(id: string): Promise<boolean> {
    await fetchJson(`${API_BASE}/meals/${id}`, { method: 'DELETE' });
    return true;
  },

  async getGoals(): Promise<any> {
    return fetchJson(`${API_BASE}/goals`);
  },

  async updateGoals(input: GoalsInput): Promise<any> {
    return fetchJson(`${API_BASE}/goals`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  },

  async getDailySummary(date?: string): Promise<any> {
    const query = date ? `?date=${date}` : '';
    return fetchJson(`${API_BASE}/summary${query}`);
  },

  async getHistory(period?: string, from?: string, to?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (period) params.set('period', period);
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchJson<any[]>(`${API_BASE}/history${query}`);
  },
};
