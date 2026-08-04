import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { authAPI } from './api/client';
import Auth from './pages/Auth';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DisciplinePage from './pages/DisciplinePage';
import BodyPage from './pages/BodyPage';
import MindPage from './pages/MindPage';
import NutritionPage from './pages/NutritionPage';
import GoalsPage from './pages/GoalsPage';
import Analytics from './pages/Analytics';
import Reflect from './pages/Reflect';
import AchievementsPage from './pages/AchievementsPage';
import SettingsPage from './pages/SettingsPage';
import AICoachPage from './pages/AICoachPage';

function App() {
  const { user, token, setUser, logout } = useStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (token) {
      authAPI.me()
        .then((r) => {
          const u = r.data?.data?.user || r.data?.user;
          if (u) {
            setUser(u);
          }
        })
        .catch(() => {
          // Token expired or invalid
          logout();
        })
        .finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, [token, setUser, logout]);

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--text-muted)' }}>
        Loading DisciplineOS...
      </div>
    );
  }

  // Unauthenticated routing view
  if (!user || !token) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // Authenticated application routing view
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ai-coach" element={<AICoachPage />} />
          <Route path="/discipline" element={<DisciplinePage />} />
          <Route path="/tasks" element={<DisciplinePage />} />
          <Route path="/body" element={<BodyPage />} />
          <Route path="/mind" element={<MindPage />} />
          <Route path="/nutrition" element={<NutritionPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reflect" element={<Reflect />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/auth" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
