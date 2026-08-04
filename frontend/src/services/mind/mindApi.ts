/**
 * Mind Module API Service (SPR-309)
 */

import type {
  MoodDTO,
  EnergyDTO,
  StressDTO,
  FocusDTO,
  JournalDTO,
  MeditationDTO,
  MindSummaryDTO,
} from '../../types/mind';

const API_BASE = '/api/v1/mind';

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

export const mindApi = {
  async getMood(date?: string): Promise<MoodDTO | null> {
    const query = date ? `?date=${date}` : '';
    return fetchJson<MoodDTO | null>(`${API_BASE}/mood${query}`);
  },

  async logMood(input: { mood: string; icon?: string; notes?: string }): Promise<MoodDTO> {
    return fetchJson<MoodDTO>(`${API_BASE}/mood`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async logEnergy(energyLevel: string): Promise<EnergyDTO> {
    return fetchJson<EnergyDTO>(`${API_BASE}/energy`, {
      method: 'POST',
      body: JSON.stringify({ energyLevel }),
    });
  },

  async logStress(stressLevel: number, triggerNotes?: string): Promise<StressDTO> {
    return fetchJson<StressDTO>(`${API_BASE}/stress`, {
      method: 'POST',
      body: JSON.stringify({ stressLevel, triggerNotes }),
    });
  },

  async logFocus(focusScore: number, notes?: string): Promise<FocusDTO> {
    return fetchJson<FocusDTO>(`${API_BASE}/focus`, {
      method: 'POST',
      body: JSON.stringify({ focusScore, notes }),
    });
  },

  async getJournals(search?: string): Promise<JournalDTO[]> {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return fetchJson<JournalDTO[]>(`${API_BASE}/journal${query}`);
  },

  async createJournal(input: { title: string; content: string; moodTag?: string }): Promise<JournalDTO> {
    return fetchJson<JournalDTO>(`${API_BASE}/journal`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async updateJournal(id: string, updates: { title?: string; content?: string; moodTag?: string }): Promise<JournalDTO> {
    return fetchJson<JournalDTO>(`${API_BASE}/journal/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async deleteJournal(id: string): Promise<boolean> {
    await fetchJson(`${API_BASE}/journal/${id}`, { method: 'DELETE' });
    return true;
  },

  async getMeditation(date?: string): Promise<MeditationDTO[]> {
    const query = date ? `?date=${date}` : '';
    return fetchJson<MeditationDTO[]>(`${API_BASE}/meditation${query}`);
  },

  async logMeditation(input: { title?: string; durationMinutes?: number; type?: string; notes?: string }): Promise<MeditationDTO> {
    return fetchJson<MeditationDTO>(`${API_BASE}/meditation`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async getDailySummary(date?: string): Promise<MindSummaryDTO> {
    const query = date ? `?date=${date}` : '';
    return fetchJson<MindSummaryDTO>(`${API_BASE}/summary${query}`);
  },
};
