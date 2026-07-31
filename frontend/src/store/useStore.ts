import { create } from 'zustand';
import type { User, Task, DashboardData, Reflection, Settings } from '../types';

const initialTheme = (localStorage.getItem('dos_theme') as 'dark' | 'light') || 'light';
if (typeof document !== 'undefined') {
  document.documentElement.setAttribute('data-theme', initialTheme);
}

interface AppState {
  user: User | null;
  token: string | null;
  tasks: Task[];
  dashboard: DashboardData | null;
  reflections: Reflection[];
  settings: Settings | null;
  loading: boolean;
  theme: 'dark' | 'light';

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setTasks: (tasks: Task[]) => void;
  toggleTaskDone: (id: string, done: boolean) => void;
  addTask: (task: Task) => void;
  removeTask: (id: string) => void;
  setDashboard: (data: DashboardData) => void;
  setReflections: (r: Reflection[]) => void;
  setSettings: (s: Settings) => void;
  setLoading: (v: boolean) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  logout: () => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  token: localStorage.getItem('dos_token'),
  tasks: [],
  dashboard: null,
  reflections: [],
  settings: null,
  loading: false,
  theme: initialTheme,

  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) localStorage.setItem('dos_token', token);
    else localStorage.removeItem('dos_token');
    set({ token });
  },
  setTasks: (tasks) => set({ tasks }),
  toggleTaskDone: (id, done) => set(s => ({
    tasks: s.tasks.map(t => t.id === id ? { ...t, done, streak: done ? t.streak + 1 : Math.max(0, t.streak - 1) } : t)
  })),
  addTask: (task) => set(s => ({ tasks: [...s.tasks, task] })),
  removeTask: (id) => set(s => ({ tasks: s.tasks.filter(t => t.id !== id) })),
  setDashboard: (dashboard) => set({ dashboard }),
  setReflections: (reflections) => set({ reflections }),
  setSettings: (settings) => set({ settings }),
  setLoading: (loading) => set({ loading }),
  setTheme: (theme) => {
    localStorage.setItem('dos_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },
  logout: () => {
    localStorage.removeItem('dos_token');
    set({ user: null, token: null, tasks: [], dashboard: null });
  },
}));
