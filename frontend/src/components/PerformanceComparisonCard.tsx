import { TrendingUp } from 'lucide-react';

interface PerformanceComparisonCardProps {
  comparisons: {
    today: number;
    todayTrend: string;
    thisWeek: number;
    thisWeekTrend: string;
    thisMonth: number;
    thisMonthTrend: string;
    yesterday: number;
    lastWeek: number;
    lastMonth: number;
  };
}

export default function PerformanceComparisonCard({ comparisons }: PerformanceComparisonCardProps) {
  const items = [
    {
      label: 'TODAY',
      current: comparisons.today,
      trend: comparisons.todayTrend,
      vsLabel: 'YESTERDAY',
      vsValue: comparisons.yesterday,
      accent: '#6366F1',
    },
    {
      label: 'THIS WEEK',
      current: comparisons.thisWeek,
      trend: comparisons.thisWeekTrend,
      vsLabel: 'LAST WEEK',
      vsValue: comparisons.lastWeek,
      accent: '#10B981',
    },
    {
      label: 'THIS MONTH',
      current: comparisons.thisMonth,
      trend: comparisons.thisMonthTrend,
      vsLabel: 'LAST MONTH',
      vsValue: comparisons.lastMonth,
      accent: '#8B5CF6',
    },
  ];

  return (
    <div
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--card-radius, 16px)',
        boxShadow: 'var(--card-shadow)',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={18} color="#6366F1" />
          <h2 className="font-sekuya" style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
            Performance Comparison
          </h2>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Historical Benchmark</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
        {items.map((item) => (
          <div
            key={item.label}
            style={{
              background: 'var(--input-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '12px',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px', color: 'var(--text-muted)' }}>
                {item.label}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#10B981',
                  background: 'rgba(16,185,129,0.12)',
                  padding: '2px 8px',
                  borderRadius: '10px',
                }}
              >
                {item.trend}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span className="font-sekuya" style={{ fontSize: '28px', fontWeight: 800, color: item.accent }}>
                {item.current}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>pts</span>
            </div>

            <div
              style={{
                borderTop: '1px dashed var(--card-border)',
                paddingTop: '6px',
                marginTop: '2px',
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                fontSize: '11px',
                color: 'var(--text-muted)',
              }}
            >
              <span>{item.vsLabel}</span>
              <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{item.vsValue} pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
