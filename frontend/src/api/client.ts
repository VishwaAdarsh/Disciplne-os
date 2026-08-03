import axios from 'axios';
import { useStore } from '../store/useStore';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('dos_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      useStore.getState().logout();
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data: { email: string; name: string; password: string }) => api.post('/v1/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/v1/auth/login', data),
  me: () => api.get('/v1/auth/me'),
  logout: () => api.post('/v1/auth/logout'),
};

export const tasksAPI = {
  list: () => api.get('/v1/discipline/tasks'),
  create: (data: { title: string; category?: string; priority?: string; estimatedMinutes?: number }) =>
    api.post('/v1/discipline/tasks', data),
  toggle: (id: string) => api.patch(`/v1/discipline/tasks/${id}/toggle`),
};

export const bodyAPI = {
  getSummary: () => api.get('/v1/body/summary'),
  logWater: (amountMl: number) => api.post('/v1/body/water', { amountMl }),
  logWorkout: (data: { name: string; durationMinutes: number; caloriesBurned?: number }) =>
    api.post('/v1/body/workouts', data),
};

export const mindAPI = {
  getSummary: () => api.get('/v1/mind/summary'),
  checkIn: (data: { mood: string; focus?: number; energy?: number; stress?: number }) =>
    api.post('/v1/mind/checkin', data),
};

export const nutritionAPI = {
  getSummary: () => api.get('/v1/nutrition/summary'),
  logMeal: (data: { name: string; category?: string; calories?: number; proteinGrams?: number }) =>
    api.post('/v1/nutrition/meals', data),
};

export const goalsAPI = {
  list: () => api.get('/v1/goals'),
  create: (data: { title: string; category?: string; deadline?: string }) => api.post('/v1/goals', data),
};

export const performanceAPI = {
  getCurrent: () => api.get('/v1/performance/current'),
  getHistory: () => api.get('/v1/performance/history'),
};

export const eventsAPI = {
  list: () => api.get('/v1/events'),
  emit: (data: { module: string; eventType: string; title: string; payload?: any; scoreImpact?: number }) =>
    api.post('/v1/events', data),
};

export const aiAPI = {
  chat: (message: string) => api.post('/v1/ai/chat', { message }),
  getBriefing: () => api.get('/v1/ai/briefing'),
  generateReport: (type: 'daily' | 'weekly' | 'monthly') => api.post('/v1/ai/reports', { type }),
};

export default api;
