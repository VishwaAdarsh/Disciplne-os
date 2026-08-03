import { TrendingUp, Calendar, Zap } from 'lucide-react';
import { usePerformanceEngineStore } from '../../store/performanceEngineStore';

export default function PerformanceComparisonCard() {
  const { comparisons } = usePerformanceEngineStore();

  return (
    <div
      style={{
        background: 'var(--card-bg, #111827)',
        border: '1px solid var(--card-border, #1F2937)',
        borderRadius: 'var(--card-radius, 16px)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={18} color="#6366F1" />
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Performance Trajectory</h3>
        </div>
        <span
          style={{
            fontSize: '11px',
            background: 'rgba(99, 102, 241, 0.15)',
            color: '#6366F1',
            padding: '3px 10px',
            borderRadius: '12px',
            fontWeight: 700,
          }}
        >
          COMPARISON ENGINE
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {/* TODAY VS YESTERDAY */}
        <div
          style={{
            background: 'var(--surface-bg, rgba(255,255,255,0.02))',
            border: '1px solid var(--card-border, #1F2937)',
            borderRadius: '12px',
            padding: '14px',
          }}
        >
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>TODAY VS YESTERDAY</div>
          <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text-main)', marginTop: '4px' }}>
            {comparisons.daily.currentScore}
          </div>
          <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 700, marginTop: '2px' }}>
            +{comparisons.daily.diff} ({comparisons.daily.percentChange}%)
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Prev: {comparisons.daily.previousScore}
          </div>
        </div>

        {/* THIS WEEK VS LAST WEEK */}
        <div
          style={{
            background: 'var(--surface-bg, rgba(255,255,255,0.02))',
            border: '1px solid var(--card-border, #1F2937)',
            borderRadius: '12px',
            padding: '14px',
          }}
        >
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>WEEK VS LAST WEEK</div>
          <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text-main)', marginTop: '4px' }}>
            {comparisons.weekly.currentScore}
          </div>
          <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 700, marginTop: '2px' }}>
            +{comparisons.weekly.diff} ({comparisons.weekly.percentChange}%)
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Prev: {comparisons.weekly.previousScore}
          </div>
        </div>

        {/* THIS MONTH VS LAST MONTH */}
        <div
          style={{
            background: 'var(--surface-bg, rgba(255,255,255,0.02))',
            border: '1px solid var(--card-border, #1F2937)',
            borderRadius: '12px',
            padding: '14px',
          }}
        >
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>MONTH VS LAST MONTH</div>
          <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text-main)', marginTop: '4px' }}>
            {comparisons.monthly.currentScore}
          </div>
          <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 700, marginTop: '2px' }}>
            +{comparisons.monthly.diff} ({comparisons.monthly.percentChange}%)
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Prev: {comparisons.monthly.previousScore}
          </div>
        </div>
      </div>
    </div>
  );
}
