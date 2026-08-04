import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, CheckCircle, Clock, Zap, ArrowRight } from 'lucide-react';

interface ActivityItem {
  id: string;
  time: string;
  icon: string;
  text: string;
  category: 'discipline' | 'body' | 'mind' | 'nutrition' | 'goals';
}

interface LiveActivityCardProps {
  hasActiveSession?: boolean;
  activeTask?: string;
  initialSeconds?: number;
  startTime?: string;
  recentActivities?: ActivityItem[];
}

export default function LiveActivityCard({
  hasActiveSession = true,
  activeTask = "Deep Work",
  initialSeconds = 5058, // 01:24:18
  startTime = "10:02 AM",
  recentActivities = [],
}: LiveActivityCardProps) {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!hasActiveSession || isPaused) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [hasActiveSession, isPaused]);

  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleModuleClick = (category: string) => {
    const routes: Record<string, string> = {
      discipline: '/discipline',
      body: '/body',
      mind: '/mind',
      nutrition: '/nutrition',
      goals: '/goals',
    };
    navigate(routes[category] || '/discipline');
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
      {/* Live Session Card Section */}
      {hasActiveSession ? (
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
                LIVE
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

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setIsPaused(!isPaused)}
                style={{
                  flex: '1 1 auto',
                  justifyContent: 'center',
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
                onClick={() => navigate('/discipline')}
                style={{
                  flex: '1 1 auto',
                  justifyContent: 'center',
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
      ) : (
        /* Empty Live Session State */
        <div
          style={{
            background: 'var(--input-bg)',
            border: '1px border var(--card-border)',
            borderRadius: '14px',
            padding: '18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>No active session</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Ready to deep focus?</div>
          </div>
          <button
            onClick={() => navigate('/discipline')}
            style={{
              background: '#6366F1',
              color: '#FFF',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Zap size={14} />
            <span>Start Focus Session</span>
          </button>
        </div>
      )}

      {/* Activity Timeline Section (PRD Section 12) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            Activity Timeline
          </div>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Newest First</span>
        </div>

        {recentActivities.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentActivities.map((act) => (
              <div
                key={act.id}
                onClick={() => handleModuleClick(act.category)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--input-border)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '16px' }}>{act.icon}</span>
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{act.text}</span>
                    <div style={{ fontSize: '10px', color: '#8B5CF6', textTransform: 'uppercase', fontWeight: 700, marginTop: '1px' }}>
                      {act.category}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>{act.time}</span>
                  <ArrowRight size={13} color="var(--text-muted)" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Timeline State (PRD Section 20) */
          <div
            style={{
              padding: '24px 16px',
              textAlign: 'center',
              background: 'var(--input-bg)',
              borderRadius: '10px',
              border: '1px dashed var(--card-border)',
              color: 'var(--text-muted)',
              fontSize: '13px',
            }}
          >
            No activity yet. Start your first task to begin today's timeline.
          </div>
        )}
      </div>
    </div>
  );
}
