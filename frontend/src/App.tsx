import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { authAPI } from './api/client';
import Auth from './pages/Auth';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Analytics from './pages/Analytics';
import Reflect from './pages/Reflect';
import SettingsPage from './pages/SettingsPage';

function App() {
  const { user, token, setUser, logout } = useStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (token && !user) {
      authAPI.me()
        .then(r => setUser(r.data.user))
        .catch(() => {
          logout();
        })
        .finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, [token]);

  if (checking) {
    return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0A0A0F', color:'#6B7280' }}>Loading…</div>;
  }

  if (!token || !user) {
    return <BrowserRouter><Auth /></BrowserRouter>;
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reflect" element={<Reflect />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
