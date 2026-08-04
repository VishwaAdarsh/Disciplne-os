/**
 * Body Module API Service (SPR-308)
 */

import { WorkoutDTO, SleepDTO, WaterDTO, StepDTO, WeightDTO, BodySummaryDTO } from '../../types/body';

const API_BASE = '/api/v1/body';

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

export const bodyApi = {
  async getWorkouts(date?: string): Promise<WorkoutDTO[]> {
    const query = date ? `?date=${date}` : '';
    return fetchJson<WorkoutDTO[]>(`${API_BASE}/workouts${query}`);
  },

  async logWorkout(input: { name: string; category?: string; durationMinutes?: number; caloriesBurned?: number; intensity?: string; notes?: string }): Promise<WorkoutDTO> {
    return fetchJson<WorkoutDTO>(`${API_BASE}/workouts`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async updateWorkout(id: string, updates: Partial<WorkoutDTO>): Promise<WorkoutDTO> {
    return fetchJson<WorkoutDTO>(`${API_BASE}/workouts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async deleteWorkout(id: string): Promise<boolean> {
    await fetchJson(`${API_BASE}/workouts/${id}`, { method: 'DELETE' });
    return true;
  },

  async getSleep(date?: string): Promise<SleepDTO | null> {
    const query = date ? `?date=${date}` : '';
    return fetchJson<SleepDTO | null>(`${API_BASE}/sleep${query}`);
  },

  async logSleep(input: { durationMinutes?: number; qualityPercent?: number; notes?: string }): Promise<SleepDTO> {
    return fetchJson<SleepDTO>(`${API_BASE}/sleep`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async logWater(amountMl: number): Promise<WaterDTO> {
    return fetchJson<WaterDTO>(`${API_BASE}/water`, {
      method: 'POST',
      body: JSON.stringify({ amountMl }),
    });
  },

  async logSteps(stepsCount: number): Promise<StepDTO> {
    return fetchJson<StepDTO>(`${API_BASE}/steps`, {
      method: 'POST',
      body: JSON.stringify({ stepsCount }),
    });
  },

  async logWeight(input: { weightKg: number; chestCm?: number; waistCm?: number; hipCm?: number; armCm?: number; thighCm?: number; notes?: string }): Promise<WeightDTO> {
    return fetchJson<WeightDTO>(`${API_BASE}/weight`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async getDailySummary(date?: string): Promise<BodySummaryDTO> {
    const query = date ? `?date=${date}` : '';
    return fetchJson<BodySummaryDTO>(`${API_BASE}/summary${query}`);
  },
};
