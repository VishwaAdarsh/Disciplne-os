import { BarChart2 } from 'lucide-react';

interface ChartEmptyStateProps {
  title?: string;
  description?: string;
  height?: number;
}

export default function ChartEmptyState({
  title = 'No Data Available',
  description = 'Complete activities or log entries to start populating this visualization.',
  height = 200,
}: ChartEmptyStateProps) {
  return (
    <div
      style={{
        height: `${height}px`,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--input-bg)',
        border: '1px dashed var(--card-border)',
        borderRadius: '12px',
        padding: '16px',
        textAlign: 'center',
        gap: '8px',
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'rgba(99,102,241,0.1)',
          color: '#6366F1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <BarChart2 size={18} />
      </div>
      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
        {title}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', maxWidth: '280px' }}>
        {description}
      </div>
    </div>
  );
}
