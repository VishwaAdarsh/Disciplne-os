import React, { useState, useEffect } from 'react';
import { useEventEngineStore } from '../../store/eventEngineStore';
import type { LiveSession, LiveSessionType, EventModule } from '../../types/events';

export const LiveSessionWidget: React.FC = () => {
  const {
    activeSessions,
    startLiveSession,
    pauseLiveSession,
    resumeLiveSession,
    finishLiveSession,
    cancelLiveSession,
  } = useEventEngineStore();

  const [now, setNow] = useState<number>(Date.now());
  const [selectedType, setSelectedType] = useState<LiveSessionType>('deepwork');
  const [sessionName, setSessionName] = useState<string>('');
  const [targetMins, setTargetMins] = useState<number>(30);
  const [showLauncher, setShowLauncher] = useState<boolean>(false);

  // Tick every second to refresh active session timers
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const sessionList = Object.values(activeSessions);

  const calculateElapsed = (session: LiveSession): { mins: number; secs: number; totalSeconds: number; percent: number } => {
    let pausedDuration = session.pausedTotalMs || 0;
    if (session.status === 'paused' && session.pausedTime) {
      pausedDuration += now - session.pausedTime;
    }
    const elapsedMs = Math.max(0, now - session.startTime - pausedDuration);
    const totalSeconds = Math.floor(elapsedMs / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const targetSeconds = (session.targetMinutes || 30) * 60;
    const percent = Math.min(100, Math.round((totalSeconds / targetSeconds) * 100));

    return { mins, secs, totalSeconds, percent };
  };

  const handleLaunch = () => {
    const name = sessionName.trim() || `${selectedType.toUpperCase()} Session`;
    const moduleMap: Record<LiveSessionType, EventModule> = {
      deepwork: 'discipline',
      workout: 'body',
      meditation: 'mind',
      walking: 'body',
      running: 'body',
    };
    startLiveSession(selectedType, moduleMap[selectedType], name, targetMins);
    setSessionName('');
    setShowLauncher(false);
  };

  return (
    <div
      style={{
        background: 'var(--card-bg, #1e293b)',
        borderRadius: '16px',
        border: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
        padding: '24px',
        color: '#f8fafc',
        boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              fontSize: '1.3rem',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
            }}
          >
            ⏱️
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Live Active Sessions</h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
              Persistent timers across page refresh & navigation
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowLauncher(!showLauncher)}
          style={{
            padding: '8px 14px',
            borderRadius: '10px',
            background: showLauncher ? 'rgba(239, 68, 68, 0.2)' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            border: 'none',
            color: showLauncher ? '#fca5a5' : '#ffffff',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: showLauncher ? 'none' : '0 4px 12px rgba(99, 102, 241, 0.3)',
          }}
        >
          {showLauncher ? 'Close Launcher' : '+ Start Session'}
        </button>
      </div>

      {/* Quick Session Launcher Modal/Panel */}
      {showLauncher && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            borderRadius: '12px',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            padding: '16px',
            marginBottom: '20px',
          }}
        >
          <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', color: '#818cf8' }}>Launch Live Session</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '14px' }}>
            {[
              { type: 'deepwork', label: 'Deep Work', icon: '💻' },
              { type: 'workout', label: 'Workout', icon: '💪' },
              { type: 'meditation', label: 'Meditation', icon: '🧘' },
              { type: 'running', label: 'Running', icon: '🏃' },
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => setSelectedType(item.type as LiveSessionType)}
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  border: selectedType === item.type ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: selectedType === item.type ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  color: selectedType === item.type ? '#34d399' : '#cbd5e1',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Session Name (e.g. Core Coding, Upper Body)"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '0.85rem',
              }}
            />
            <select
              value={targetMins}
              onChange={(e) => setTargetMins(Number(e.target.value))}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '0.85rem',
              }}
            >
              <option value={15}>15 Mins</option>
              <option value={30}>30 Mins</option>
              <option value={45}>45 Mins</option>
              <option value={60}>60 Mins</option>
              <option value={90}>90 Mins</option>
              <option value={120}>120 Mins</option>
            </select>
            <button
              onClick={handleLaunch}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                background: '#10b981',
                border: 'none',
                color: '#022c22',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Launch Now
            </button>
          </div>
        </div>
      )}

      {/* Session Cards */}
      {sessionList.length === 0 ? (
        <div
          style={{
            padding: '24px',
            textAlign: 'center',
            background: 'rgba(15, 23, 42, 0.3)',
            borderRadius: '12px',
            border: '1px dashed rgba(255, 255, 255, 0.08)',
            color: '#64748b',
          }}
        >
          <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>⏸️</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>No Active Sessions Running</div>
          <div style={{ fontSize: '0.8rem', marginTop: '2px' }}>
            Click "+ Start Session" to launch a live session timer.
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {sessionList.map((session) => {
            const { mins, secs, percent } = calculateElapsed(session);
            const isPaused = session.status === 'paused';

            return (
              <div
                key={session.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: '14px',
                  border: isPaused ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)',
                  padding: '16px 20px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Progress bar background */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    height: '3px',
                    width: `${percent}%`,
                    background: isPaused ? '#f59e0b' : '#10b981',
                    transition: 'width 0.4s ease',
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: isPaused ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                          color: isPaused ? '#fbbf24' : '#34d399',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                        }}
                      >
                        {isPaused ? 'Paused' : 'Running'}
                      </span>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{session.sessionName}</h4>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '4px' }}>
                      Target: {session.targetMinutes}m · Breaks taken: {session.breaksCount}
                    </div>
                  </div>

                  {/* Timer display */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'monospace', color: '#38bdf8' }}>
                        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{percent}% target</div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {isPaused ? (
                        <button
                          onClick={() => resumeLiveSession(session.id)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background: '#10b981',
                            border: 'none',
                            color: '#022c22',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          ▶ Resume
                        </button>
                      ) : (
                        <button
                          onClick={() => pauseLiveSession(session.id)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background: 'rgba(245, 158, 11, 0.2)',
                            border: '1px solid rgba(245, 158, 11, 0.4)',
                            color: '#fbbf24',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          ⏸ Pause
                        </button>
                      )}

                      <button
                        onClick={() => finishLiveSession(session.id)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                          border: 'none',
                          color: '#fff',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        ✓ Finish
                      </button>

                      <button
                        onClick={() => cancelLiveSession(session.id)}
                        style={{
                          padding: '8px',
                          borderRadius: '8px',
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#fca5a5',
                          cursor: 'pointer',
                        }}
                        title="Cancel Session"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
