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

function App() {
  const { user, token, setUser, logout } = useStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (token && !user) {
      authAPI.me()
        .then(r => setUser(r.data.user))
        .catch(() => {
          // Provide fallback demo operator so visual preview works smoothly
          setUser({ id: 'demo-1', email: 'adarsh@disciplineos.app', name: 'Adarsh' });
        })
        .finally(() => setChecking(false));
    } else {
      if (!user && !token) {
        // Set mock operator for visual phase preview
        setUser({ id: 'demo-1', email: 'adarsh@disciplineos.app', name: 'Adarsh' });
      }
      setChecking(false);
    }
  }, [token]);

  if (checking) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--text-muted)' }}>Loading DisciplineOS...</div>;
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
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
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
