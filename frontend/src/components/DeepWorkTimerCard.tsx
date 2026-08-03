import { useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, Zap, Clock, Coffee } from 'lucide-react';
import { useDisciplineStore } from '../store/disciplineStore';

export default function DeepWorkTimerCard() {
  const {
    deepWorkSession,
    startFocusSession,
    pauseFocusSession,
    resumeFocusSession,
    resetFocusSession,
    finishFocusSession,
    tickFocusTimer,
  } = useDisciplineStore();

  const { status, elapsedSeconds, targetMinutes, sessionName, breaksCount, dailyTotalSeconds } =
    deepWorkSession;

  useEffect(() => {
    if (status !== 'running') return;
    const interval = setInterval(() => {
      tickFocusTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [status, tickFocusTimer]);

  const formatTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const formatHoursMins = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(124,58,237,0.04))',
        border: '1px solid rgba(99,102,241,0.25)',
        borderRadius: 'var(--card-radius, 16px)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        boxShadow: '0 4px 20px rgba(99,102,241,0.08)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={20} color="#6366F1" />
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Deep Work Engine
            </div>
            <h2 className="font-sekuya" style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
              {sessionName}
            </h2>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <Coffee size={14} /> Breaks: <strong style={{ color: 'var(--text-main)' }}>{breaksCount}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <Clock size={14} /> Daily Focus: <strong style={{ color: '#10B981' }}>{formatHoursMins(dailyTotalSeconds)}</strong>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="font-sekuya text-gradient-brand" style={{ fontSize: '42px', fontWeight: 800, letterSpacing: '1px' }}>
            {formatTimer(elapsedSeconds)}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Target Duration: {targetMinutes} minutes
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {status === 'idle' && (
            <button
              onClick={() => startFocusSession(sessionName, targetMinutes)}
              style={{
                background: '#6366F1',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 20px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
              }}
            >
              <Play size={16} />
              <span>START FOCUS</span>
            </button>
          )}

          {status === 'running' && (
            <button
              onClick={pauseFocusSession}
              style={{
                background: '#F59E0B',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 20px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Pause size={16} />
              <span>PAUSE SESSION</span>
            </button>
          )}

          {status === 'paused' && (
            <button
              onClick={resumeFocusSession}
              style={{
                background: '#10B981',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 20px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Play size={16} />
              <span>RESUME SESSION</span>
            </button>
          )}

          {(status === 'running' || status === 'paused') && (
            <button
              onClick={finishFocusSession}
              style={{
                background: '#6366F1',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 20px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
              }}
            >
              <CheckCircle2 size={16} />
              <span>LOG & FINISH</span>
            </button>
          )}

          <button
            onClick={resetFocusSession}
            style={{
              background: 'var(--input-bg)',
              color: 'var(--text-muted)',
              border: '1px solid var(--card-border)',
              borderRadius: '10px',
              padding: '12px 14px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <RotateCcw size={16} />
            <span>RESET</span>
          </button>
        </div>
      </div>
    </div>
  );
}
