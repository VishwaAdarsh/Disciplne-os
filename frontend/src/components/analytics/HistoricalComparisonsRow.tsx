import React from 'react';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import type { PeriodComparisonMetric } from '../../types/analytics';

interface HistoricalComparisonsRowProps {
  hasPreviousPeriodData: boolean;
  performance: PeriodComparisonMetric;
  discipline: PeriodComparisonMetric;
  workouts: PeriodComparisonMetric;
  water: PeriodComparisonMetric;
}

export const HistoricalComparisonsRow: React.FC<HistoricalComparisonsRowProps> = ({
  hasPreviousPeriodData,
  performance,
  discipline,
  workouts,
  water,
}) => {
  const metrics = [performance, discipline, workouts, water];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-main, #FFFFFF)' }}>
          Period-Over-Period Trajectory
        </h3>
        {!hasPreviousPeriodData && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted, #94A3B8)' }}>
            <Info size={14} />
            <span>Comparison data will unlock after completing a prior period</span>
          </div>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
        }}
      >
        {metrics.map((m) => {
          const isPositive = m.diff >= 0;
          return (
            <div
              key={m.label}
              style={{
                background: 'var(--card-bg, #111827)',
                border: '1px solid var(--card-border, rgba(255, 255, 255, 0.08))',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted, #94A3B8)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                {m.label}
              </div>

              <div style={{ margin: '8px 0' }}>
                <span className="font-sekuya" style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main, #FFFFFF)' }}>
                  {m.current}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted, #94A3B8)', marginLeft: '4px' }}>
                  {m.unit}
                </span>
              </div>

              {hasPreviousPeriodData ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                  {m.direction === 'up' ? (
                    <TrendingUp size={14} color="#10B981" />
                  ) : m.direction === 'down' ? (
                    <TrendingDown size={14} color="#EF4444" />
                  ) : (
                    <Minus size={14} color="#94A3B8" />
                  )}
                  <span style={{ color: isPositive ? '#10B981' : '#EF4444', fontWeight: 600 }}>
                    {isPositive ? '+' : ''}{m.diff} {m.unit} ({isPositive ? '+' : ''}{m.percentChange}%)
                  </span>
                  <span style={{ color: 'var(--text-muted, #94A3B8)', fontSize: '11px' }}>
                    vs prev ({m.previous})
                  </span>
                </div>
              ) : (
                <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748B)', fontStyle: 'italic' }}>
                  Prior period data not yet recorded
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
