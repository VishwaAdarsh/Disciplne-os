import React from 'react';
import { CheckCircle, Circle, Zap, Sparkles } from 'lucide-react';
import type { DailyCompletionSummary } from '../../types/overview';

interface DailyCompletionCardProps {
  dailyCompletion: DailyCompletionSummary;
}

export const DailyCompletionCard: React.FC<DailyCompletionCardProps> = ({ dailyCompletion }) => {
  const { overallPercentage, completedCount, totalCount, pillars } = dailyCompletion;

  const isAllComplete = overallPercentage === 100 || completedCount === totalCount;

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9))',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        color: 'var(--text-main, #FFFFFF)',
      }}
    >
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #10B981, #059669)',
              padding: '8px',
              borderRadius: '12px',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isAllComplete ? <Sparkles size={20} /> : <Zap size={20} />}
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, letterSpacing: '0.3px' }}>
              Daily Execution Index
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted, #94A3B8)', margin: '2px 0 0 0' }}>
              Aggregate daily completion across core behavioral disciplines
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '32px', fontWeight: 900, color: '#10B981', lineHeight: 1 }}>
            {overallPercentage}%
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted, #94A3B8)', fontWeight: 600 }}>
            ({completedCount} of {totalCount} completed)
          </span>
        </div>
      </div>

      {/* OVERALL PROGRESS BAR */}
      <div
        style={{
          width: '100%',
          height: '10px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '5px',
          overflow: 'hidden',
          padding: '2px',
        }}
      >
        <div
          style={{
            width: `${overallPercentage}%`,
            height: '100%',
            background: isAllComplete
              ? 'linear-gradient(90deg, #10B981, #34D399)'
              : 'linear-gradient(90deg, #6366F1, #10B981)',
            borderRadius: '4px',
            transition: 'width 0.4s ease',
          }}
        />
      </div>

      {/* PILLARS GRID */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
        }}
      >
        {pillars.map((pillar) => (
          <div
            key={pillar.key}
            style={{
              background: pillar.completed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${pillar.completed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.06)'}`,
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div style={{ color: pillar.completed ? '#10B981' : 'var(--text-muted, #94A3B8)', flexShrink: 0 }}>
              {pillar.completed ? <CheckCircle size={18} /> : <Circle size={18} />}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: pillar.completed ? '#FFFFFF' : 'var(--text-muted, #E2E8F0)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {pillar.label}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--text-muted, #94A3B8)',
                  marginTop: '1px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {pillar.detail}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
