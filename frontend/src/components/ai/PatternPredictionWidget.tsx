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
          background: 'var(--card-bg, #ffffff)',
          borderRadius: '16px',
          border: '1px solid var(--card-border, #e5e7eb)',
          padding: '24px',
          color: 'var(--text-main, #0f172a)',
          boxShadow: 'var(--card-shadow)',
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
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)',
            }}
          >
            🔮
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main, #0f172a)' }}>
              Pattern Detector
            </h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted, #94a3b8)' }}>
              AI behavioral correlation insights
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {patterns.map((pat) => (
            <div
              key={pat.id}
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                background: 'var(--surface-secondary, #f8fafc)',
                border: '1px solid var(--soft-border, #eef2f7)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{pat.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main, #0f172a)' }}>
                    {pat.title}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: pat.impactScore > 0 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                    color: pat.impactScore > 0 ? '#10b981' : '#ef4444',
                    fontWeight: 700,
                  }}
                >
                  {pat.impactScore > 0 ? `+${pat.impactScore} pts` : `${pat.impactScore} pts`}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary, #475569)' }}>{pat.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted, #94a3b8)' }}>
                <span>Confidence Rating</span>
                <span style={{ color: '#2563eb', fontWeight: 600 }}>{pat.confidencePercent}% Match</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Goal Prediction Engine Card */}
      <div
        style={{
          background: 'var(--card-bg, #ffffff)',
          borderRadius: '16px',
          border: '1px solid var(--card-border, #e5e7eb)',
          padding: '24px',
          color: 'var(--text-main, #0f172a)',
          boxShadow: 'var(--card-shadow)',
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
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
            }}
          >
            🎯
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main, #0f172a)' }}>
              Goal Prediction Engine
            </h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted, #94a3b8)' }}>
              Completion date & streak risk forecast
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {predictions.map((pred) => (
            <div
              key={pred.goalId}
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: 'var(--surface-secondary, #f8fafc)',
                border: '1px solid var(--soft-border, #eef2f7)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main, #0f172a)' }}>{pred.goalTitle}</span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: pred.streakRisk === 'low' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                    color: pred.streakRisk === 'low' ? '#10b981' : '#d97706',
                    fontWeight: 700,
                  }}
                >
                  {pred.streakRisk.toUpperCase()} STREAK RISK
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ height: '6px', background: 'var(--card-border, #e5e7eb)', borderRadius: '3px', margin: '10px 0', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${pred.currentProgressPercent}%`,
                    background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                    borderRadius: '3px',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary, #475569)' }}>
                <span>Forecasted Completion:</span>
                <strong style={{ color: '#7c3aed' }}>{pred.predictedCompletionDate}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary, #475569)', marginTop: '4px' }}>
                <span>Confidence Index:</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>{pred.confidencePercent}%</span>
              </div>

              <div style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-secondary, #475569)', fontStyle: 'italic' }}>
                💡 {pred.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
