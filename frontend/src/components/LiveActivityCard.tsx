import { useState, useEffect } from 'react';
import { Play, Pause, CheckCircle, Clock } from 'lucide-react';

interface ActivityItem {
  id: string;
  time: string;
  icon: string;
  text: string;
  category: 'discipline' | 'body' | 'mind' | 'nutrition' | 'goals';
}

interface LiveActivityCardProps {
  activeTask?: string;
  initialSeconds?: number;
  startTime?: string;
  recentActivities?: ActivityItem[];
}

export default function LiveActivityCard({
  activeTask = "Deep Work",
  initialSeconds = 5058, // 01:24:18
  startTime = "10:02 AM",
  recentActivities = [],
}: LiveActivityCardProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--card-radius, 16px)',
        boxShadow: 'var(--card-shadow)',
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Top Banner: Active Live Activity Timer */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(124,58,237,0.04))',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '14px',
          padding: '16px 18px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10B981',
                boxShadow: '0 0 8px #10B981',
                display: 'inline-block',
              }}
            />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Active Now
            </span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} /> Started {startTime}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)' }}>{activeTask}</div>
            <div className="font-sekuya text-gradient-brand" style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '0.5px' }}>
              {formatTime(seconds)}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setIsPaused(!isPaused)}
              style={{
                background: isPaused ? '#10B981' : 'var(--input-bg)',
                color: isPaused ? '#FFF' : 'var(--text-main)',
                border: '1px solid var(--card-border)',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
            >
              {isPaused ? <Play size={14} /> : <Pause size={14} />}
              <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
            </button>

            <button
              onClick={() => alert('Focus session logged!')}
              style={{
                background: '#6366F1',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
                transition: 'all 0.15s ease',
              }}
            >
              <CheckCircle size={14} />
              <span>FINISH</span>
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Feed */}
      <div>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px' }}>
          Recent Activity Log
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {recentActivities.map((act) => (
            <div
              key={act.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '10px',
                background: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                fontSize: '13px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '15px' }}>{act.icon}</span>
                <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{act.text}</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>{act.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
