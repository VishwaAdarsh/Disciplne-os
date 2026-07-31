import { Link, useLocation } from 'react-router-dom';
import { X, Utensils, Target, BarChart2, BookOpen, Award, Settings } from 'lucide-react';

interface MoreMobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MoreMobileNav({ isOpen, onClose }: MoreMobileNavProps) {
  const { pathname } = useLocation();

  if (!isOpen) return null;

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
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span className="font-sekuya" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
            More Modules
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
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
                  padding: '14px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  background: active ? 'rgba(99,102,241,0.12)' : 'var(--input-bg)',
                  border: active ? '1px solid #6366F1' : '1px solid var(--card-border)',
                  color: active ? '#6366F1' : 'var(--text-main)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '14px' }}>
                  <Icon size={18} color={active ? '#6366F1' : 'var(--text-muted)'} />
                  <span>{label}</span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{desc}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
