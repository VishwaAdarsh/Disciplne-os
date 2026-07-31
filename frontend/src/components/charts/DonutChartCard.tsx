import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import CustomTooltip from './CustomTooltip';
import ChartEmptyState from './ChartEmptyState';

export interface DonutDataItem {
  name: string;
  value: number;
  color: string;
}

interface DonutChartCardProps {
  title: string;
  subtitle?: string;
  data: DonutDataItem[];
  centerLabel?: string;
  centerSublabel?: string;
  height?: number;
  unit?: string;
}

export default function DonutChartCard({
  title,
  subtitle,
  data,
  centerLabel,
  centerSublabel,
  height = 180,
  unit = '',
}: DonutChartCardProps) {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  const isEmpty = total === 0 || data.length === 0;

  return (
    <div
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--card-radius, 14px)',
        boxShadow: 'var(--card-shadow)',
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
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
        <ChartEmptyState height={height - 40} />
      ) : (
        <div style={{ position: 'relative', width: '100%', height: `${height}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={height * 0.28}
                outerRadius={height * 0.40}
                paddingAngle={4}
                dataKey="value"
                animationDuration={800}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip unit={unit} />} />
            </PieChart>
          </ResponsiveContainer>

          {/* CENTER OVERLAY CALLOUT */}
          {(centerLabel || centerSublabel) && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none',
              }}
            >
              {centerLabel && (
                <div className="font-sekuya" style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1 }}>
                  {centerLabel}
                </div>
              )}
              {centerSublabel && (
                <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '3px' }}>
                  {centerSublabel}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* LEGEND CALLOUTS */}
      {!isEmpty && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '4px' }}>
          {data.map((item) => (
            <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: item.color }} />
              <span style={{ color: 'var(--text-muted)' }}>{item.name}:</span>
              <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                {item.value}
                {unit}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
