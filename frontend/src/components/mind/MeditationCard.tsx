import { Brain, Play, Wind, Sparkles } from 'lucide-react';
import { useMindStore } from '../../store/mindStore';
import type { MeditationType } from '../../types/mind';

const PRESET_SESSIONS: Array<{ title: string; type: MeditationType; minutes: number; tag: string }> = [
  { title: 'Morning Clarity & Focus', type: 'guided', minutes: 10, tag: 'Focus' },
  { title: 'Mid-Day De-stress Reset', type: 'breathing', minutes: 5, tag: 'De-stress' },
  { title: 'Silent Silent Meditation', type: 'silent', minutes: 15, tag: 'Mindfulness' },
];

export default function MeditationCard() {
  const { meditation, startMeditation } = useMindStore();

  const percent = Math.min(100, Math.round((meditation.todayMinutes / meditation.targetMinutes) * 100));

  return (
    <div
      style={{
        background: 'var(--card-bg, #111827)',
        border: '1px solid var(--card-border, #1F2937)',
        borderRadius: 'var(--card-radius, 16px)',
        boxShadow: 'var(--card-shadow)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Brain size={20} color="#8B5CF6" />
          <span className="font-sekuya" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
            Meditation & Mindfulness
          </span>
        </div>
        <span
          style={{
            fontSize: '11px',
            background: 'rgba(139, 92, 246, 0.15)',
            color: '#8B5CF6',
            padding: '3px 10px',
            borderRadius: '12px',
            fontWeight: 700,
          }}
        >
          {meditation.streakDays} DAY STREAK
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#8B5CF6' }}>
            {meditation.todayMinutes} <span style={{ fontSize: '16px', fontWeight: 600 }}>min</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Today's mindfulness total (Target: {meditation.targetMinutes} min)
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#8B5CF6' }}>{percent}%</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Daily Goal</div>
        </div>
      </div>

      {/* QUICK LAUNCH SESSIONS */}
      <div>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
          RECOMMENDED SESSIONS
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {PRESET_SESSIONS.map((sess, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '12px',
                background: 'var(--surface-bg, rgba(255,255,255,0.02))',
                border: '1px solid var(--card-border, #1F2937)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {sess.type === 'breathing' ? (
                  <Wind size={16} color="#38BDF8" />
                ) : sess.type === 'silent' ? (
                  <Sparkles size={16} color="#F59E0B" />
                ) : (
                  <Brain size={16} color="#8B5CF6" />
                )}
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>{sess.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {sess.minutes} min · {sess.tag}
                  </div>
                </div>
              </div>

              <button
                onClick={() => startMeditation(sess.title, sess.type, sess.minutes)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: 'linear-gradient(90deg, #8B5CF6, #6366F1)',
                  color: '#FFF',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Play size={12} />
                <span>START</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
