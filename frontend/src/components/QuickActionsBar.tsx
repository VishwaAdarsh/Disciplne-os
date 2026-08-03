import { useNavigate } from 'react-router-dom';
import { Play, Droplets, Smile, Dumbbell, Utensils, Target, Plus } from 'lucide-react';

export default function QuickActionsBar() {
  const navigate = useNavigate();

  const actions = [
    { label: 'Start Focus', icon: Play, color: '#6366F1', bg: 'rgba(99,102,241,0.1)', route: '/discipline' },
    { label: 'Log Water', icon: Droplets, color: '#06B6D4', bg: 'rgba(6,182,212,0.1)', route: '/nutrition' },
    { label: 'Log Mood', icon: Smile, color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)', route: '/mind' },
    { label: 'Workout', icon: Dumbbell, color: '#10B981', bg: 'rgba(16,185,129,0.1)', route: '/body' },
    { label: 'Add Meal', icon: Utensils, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', route: '/nutrition' },
    { label: 'Create Goal', icon: Target, color: '#EC4899', bg: 'rgba(236,72,153,0.1)', route: '/goals' },
  ];

  return (
    <div
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--card-radius, 16px)',
        boxShadow: 'var(--card-shadow)',
        padding: '14px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px', color: 'var(--text-muted)' }}>
        QUICK ACTIONS
      </div>

      <div
        style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '4px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {actions.map((act) => {
          const IconComponent = act.icon;
          return (
            <button
              key={act.label}
              onClick={() => navigate(act.route)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '20px',
                border: `1px solid ${act.color}40`,
                background: act.bg,
                color: 'var(--text-main)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.15s ease',
              }}
            >
              <IconComponent size={15} color={act.color} />
              <span>{act.label}</span>
              <Plus size={13} color={act.color} style={{ opacity: 0.7 }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
