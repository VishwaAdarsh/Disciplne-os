import { Bell, X, Check, Flame, Zap, Award } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  if (!isOpen) return null;

  const notifications = [
    {
      id: '1',
      icon: <Flame size={16} color="#F59E0B" />,
      title: '12-Day Streak Milestone!',
      time: '10 mins ago',
      read: false,
    },
    {
      id: '2',
      icon: <Award size={16} color="#10B981" />,
      title: 'Level 04 Operator Unlocked',
      time: '2 hours ago',
      read: false,
    },
    {
      id: '3',
      icon: <Zap size={16} color="#6366F1" />,
      title: 'Reflection Reminder: Week 31',
      time: 'Yesterday',
      read: true,
    },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: '64px',
        right: '16px',
        width: '320px',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        padding: '16px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>
          <Bell size={16} color="#6366F1" />
          <span>Notifications</span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <X size={16} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {notifications.map((n) => (
          <div
            key={n.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '10px',
              borderRadius: '10px',
              background: n.read ? 'transparent' : 'var(--input-bg)',
              border: '1px solid var(--input-border)',
            }}
          >
            <div style={{ marginTop: '2px' }}>{n.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}>{n.title}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
