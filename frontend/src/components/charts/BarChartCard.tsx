import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import CustomTooltip from './CustomTooltip';
import ChartEmptyState from './ChartEmptyState';

export interface BarDataItem {
  name: string;
  value: number;
  color?: string;
}

interface BarChartCardProps {
  title: string;
  subtitle?: string;
  data: BarDataItem[];
  defaultColor?: string;
  height?: number;
  unit?: string;
  badge?: string;
  badgeColor?: string;
}

export default function BarChartCard({
  title,
  subtitle,
  data,
  defaultColor = '#6366F1',
  height = 240,
  unit = '',
  badge,
  badgeColor = '#6366F1',
}: BarChartCardProps) {
  const isEmpty = !data || data.length === 0 || data.every((d) => d.value === 0);

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
        gap: '14px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
        {badge && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: badgeColor,
              background: `${badgeColor}18`,
              padding: '3px 10px',
              borderRadius: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {badge}
          </span>
        )}
      </div>

      {isEmpty ? (
        <ChartEmptyState height={height - 30} />
      ) : (
        <div style={{ width: '100%', height: `${height}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 500 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip unit={unit} />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={800}>
                {data.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.color || defaultColor} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
