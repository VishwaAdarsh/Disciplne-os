import { Link, useLocation } from 'react-router-dom';
import { X, Utensils, Target, BarChart2, BookOpen, Award, Settings, Sun, Moon, LogOut } from 'lucide-react';
import { useStore } from '../store/useStore';

interface MoreMobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MoreMobileNav({ isOpen, onClose }: MoreMobileNavProps) {
  const { pathname } = useLocation();
  const { theme, setTheme, logout, dashboard } = useStore();

  if (!isOpen) return null;

  const score = dashboard?.score ?? 742;
  const level = Math.floor(score / 100) + 1;

  const moreItems = [
    { to: '/nutrition', label: 'Nutrition', icon: Utensils, desc: 'Macro targets & meal logs' },
    { to: '/goals', label: 'Goals', icon: Target, desc: 'Milestone tracking & projects' },
    { to: '/analytics', label: 'Analytics', icon: BarChart2, desc: 'Deep performance comparison' },
    { to: '/reflect', label: 'Weekly Reflect', icon: BookOpen, desc: 'Weekly review & commitments' },
    { to: '/achievements', label: 'Achievements', icon: Award, desc: 'Operator badges & streaks' },
    { to: '/settings', label: 'Settings', icon: Settings, desc: 'Preferences & reset schedule' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 1100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--card-bg)',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          borderTop: '1px solid var(--card-border)',
          padding: '20px',
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="font-sekuya" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
              More Modules
            </span>
            <span className="font-sekuya text-gradient-xp" style={{ fontSize: '11px', background: 'rgba(124,58,237,0.12)', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
              LVL 0{level}
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
          {moreItems.map(({ to, label, icon: Icon, desc }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={onClose}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  padding: '12px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  background: active ? 'rgba(99,102,241,0.12)' : 'var(--input-bg)',
                  border: active ? '1px solid #6366F1' : '1px solid var(--card-border)',
                  color: active ? '#6366F1' : 'var(--text-main)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '13px' }}>
                  <Icon size={16} color={active ? '#6366F1' : 'var(--text-muted)'} />
                  <span>{label}</span>
                </div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{desc}</span>
              </Link>
            );
          })}
        </div>

        {/* Quick Settings Bar in Sheet */}
        <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--card-border)', paddingTop: '14px' }}>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px',
              borderRadius: '10px',
              background: 'var(--input-bg)',
              border: '1px solid var(--input-border)',
              color: 'var(--text-main)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {theme === 'dark' ? <Sun size={15} color="#F59E0B" /> : <Moon size={15} color="#6366F1" />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <button
            onClick={() => {
              onClose();
              logout();
            }}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#EF4444',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
