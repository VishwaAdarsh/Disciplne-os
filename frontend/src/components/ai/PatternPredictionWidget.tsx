import React from 'react';
import { useAICoachStore } from '../../store/aiCoachStore';

export const PatternPredictionWidget: React.FC = () => {
  const { getPatterns, getGoalPredictions } = useAICoachStore();

  const patterns = getPatterns();
  const predictions = getGoalPredictions();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
      {/* Pattern Detector Card */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div
            style={{
              fontSize: '1.3rem',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(56, 189, 248, 0.4)',
            }}
          >
            🔮
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Pattern Detector</h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>AI behavioral correlation insights</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {patterns.map((pat) => (
            <div
              key={pat.id}
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{pat.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{pat.title}</span>
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: pat.impactScore > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: pat.impactScore > 0 ? '#10b981' : '#fca5a5',
                    fontWeight: 700,
                  }}
                >
                  {pat.impactScore > 0 ? `+${pat.impactScore} pts` : `${pat.impactScore} pts`}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#94a3b8' }}>{pat.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.75rem', color: '#64748b' }}>
                <span>Confidence Rating</span>
                <span style={{ color: '#38bdf8', fontWeight: 600 }}>{pat.confidencePercent}% Match</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Goal Prediction Engine Card */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div
            style={{
              fontSize: '1.3rem',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)',
            }}
          >
            🎯
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Goal Prediction Engine</h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>Completion date & streak risk forecast</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {predictions.map((pred) => (
            <div
              key={pred.goalId}
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f1f5f9' }}>{pred.goalTitle}</span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: pred.streakRisk === 'low' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: pred.streakRisk === 'low' ? '#34d399' : '#fbbf24',
                    fontWeight: 700,
                  }}
                >
                  {pred.streakRisk.toUpperCase()} STREAK RISK
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', margin: '10px 0', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${pred.currentProgressPercent}%`,
                    background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                    borderRadius: '3px',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#94a3b8' }}>
                <span>Forecasted Completion:</span>
                <strong style={{ color: '#c084fc' }}>{pred.predictedCompletionDate}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#94a3b8', marginTop: '4px' }}>
                <span>Confidence Index:</span>
                <span style={{ color: '#34d399', fontWeight: 600 }}>{pred.confidencePercent}%</span>
              </div>

              <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#cbd5e1', fontStyle: 'italic' }}>
                💡 {pred.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
