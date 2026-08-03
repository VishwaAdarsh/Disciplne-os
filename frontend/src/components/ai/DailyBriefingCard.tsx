import React, { useState } from 'react';
import { useAICoachStore } from '../../store/aiCoachStore';

export const DailyBriefingCard: React.FC = () => {
  const [tab, setTab] = useState<'briefing' | 'evening'>('briefing');
  const { getDailyBriefing, getEveningReview } = useAICoachStore();

  const briefing = getDailyBriefing();
  const evening = getEveningReview();

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
      {/* Tab Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              fontSize: '1.4rem',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)',
            }}
          >
            🤖
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>AI Intelligence Briefing</h3>
            <p style={{ margin: 0, fontSize: '0.83rem', color: '#94a3b8' }}>
              Proactive personal performance operating briefing
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px', background: 'rgba(15, 23, 42, 0.6)', padding: '4px', borderRadius: '10px' }}>
          <button
            onClick={() => setTab('briefing')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: tab === 'briefing' ? '#6366f1' : 'transparent',
              color: tab === 'briefing' ? '#ffffff' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            ☀️ Daily Briefing
          </button>
          <button
            onClick={() => setTab('evening')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: tab === 'evening' ? '#a855f7' : 'transparent',
              color: tab === 'evening' ? '#ffffff' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            🌙 Evening Review
          </button>
        </div>
      </div>

      {tab === 'briefing' ? (
        <div>
          {/* Greeting & Score Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '14px',
              padding: '20px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f1f5f9' }}>{briefing.greeting}</div>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px' }}>
                Top Priority: <strong style={{ color: '#38bdf8' }}>{briefing.topPriorityTask}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399' }}>{briefing.performancePercent}%</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Today's Index</div>
              </div>
              <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fbbf24' }}>🔥 {briefing.currentStreakDays}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Active Streak</div>
              </div>
              <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#818cf8' }}>{briefing.estimatedActiveTime}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Est. Execution</div>
              </div>
            </div>
          </div>

          {/* Today's Focus List */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.92rem', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              🎯 Recommended Execution Targets
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {briefing.todayFocus.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(15, 23, 42, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    fontSize: '0.9rem',
                  }}
                >
                  <span style={{ color: '#6366f1', fontWeight: 700 }}>•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quote of the Day */}
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.6)',
              borderLeft: '4px solid #a855f7',
              fontSize: '0.88rem',
              fontStyle: 'italic',
              color: '#cbd5e1',
            }}
          >
            "{briefing.quoteOfTheDay.quote}" — <span style={{ fontStyle: 'normal', fontWeight: 600, color: '#a855f7' }}>{briefing.quoteOfTheDay.author}</span>
          </div>
        </div>
      ) : (
        /* Evening Review View */
        <div>
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '14px',
              padding: '20px',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>Daily Performance Score: {evening.performanceScore}/100</div>
              <div style={{ fontSize: '1.2rem' }}>{evening.moodEmoji}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
              <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(15, 23, 42, 0.5)' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Tasks</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8' }}>{evening.tasksCompleted}</div>
              </div>
              <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(15, 23, 42, 0.5)' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Workout</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399' }}>{evening.workoutStatus}</div>
              </div>
              <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(15, 23, 42, 0.5)' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Water</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fbbf24' }}>{evening.waterIntakeStr}</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.88rem' }}>
              <strong>🏆 Key Win:</strong> {evening.keyWin}
            </div>
            <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', fontSize: '0.88rem' }}>
              <strong>💡 Tomorrow's Optimization:</strong> {evening.tomorrowSuggestion}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
