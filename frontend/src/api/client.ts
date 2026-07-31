import axios from 'axios';
import { useStore } from '../store/useStore';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('dos_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      useStore.getState().logout();
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data: { email: string; name: string; password: string }) => api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

export const tasksAPI = {
  list: () => api.get('/tasks'),
  create: (data: { name: string; type: string; timeTarget?: string; why?: string }) => api.post('/tasks', data),
  update: (id: string, data: Partial<{ name: string; type: string; timeTarget: string; why: string }>) => api.put(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
  toggle: (id: string) => api.post(`/tasks/${id}/complete`),
};

export const analyticsAPI = {
  dashboard: () => api.get('/analytics/dashboard'),
  weekly: () => api.get('/analytics/weekly'),
  updateStreak: () => api.put('/analytics/streak'),
};

export const reflectionsAPI = {
  list: () => api.get('/reflections'),
  create: (data: {
    overallScore: number; nonnegScore: number; clarityScore: number; progressScore: number;
    wentWell: string; brokeDown: string; commitment: string;
  }) => api.post('/reflections', data),
};

export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data: Partial<{ resetTime: string; reflectionDay: string; streakAlerts: boolean; publicScore: boolean; reflectReminder: boolean; comebackMode: boolean }>) => api.put('/settings', data),
};

export default api;
