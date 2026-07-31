import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import CustomTooltip from './CustomTooltip';
import ChartEmptyState from './ChartEmptyState';

export interface PieDataItem {
  name: string;
  value: number;
  color: string;
}

interface PieDistributionCardProps {
  title: string;
  subtitle?: string;
  data: PieDataItem[];
  height?: number;
  unit?: string;
}

export default function PieDistributionCard({
  title,
  subtitle,
  data,
  height = 240,
  unit = '',
}: PieDistributionCardProps) {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  const isEmpty = total === 0 || data.length === 0;

  return (
    <div
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--card-radius, 16px)',
        boxShadow: 'var(--card-shadow)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div>
        <h3 className="font-sekuya" style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
          {title}
        </h3>
        {subtitle && (
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
            {subtitle}
          </p>
        )}
      </div>

      {isEmpty ? (
        <ChartEmptyState height={height - 30} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '100%', height: `${height}px` }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={height * 0.42}
                  dataKey="value"
                  animationDuration={800}
                >
                  {data.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} stroke="var(--card-bg)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip unit={unit} />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.map((item) => {
              const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
              return (
                <div
                  key={item.name}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: 'var(--input-bg)',
                    border: '1px solid var(--input-border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }} />
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}>{item.name}</span>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: item.color }}>{pct}%</span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {item.value} {unit}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
