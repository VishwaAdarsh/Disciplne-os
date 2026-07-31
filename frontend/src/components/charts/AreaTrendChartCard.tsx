import { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import CustomTooltip from './CustomTooltip';
import ChartEmptyState from './ChartEmptyState';

export interface AreaSeriesConfig {
  key: string;
  name: string;
  color: string;
}

interface AreaTrendChartCardProps {
  title: string;
  subtitle?: string;
  data: any[];
  dataKey?: string;
  series?: AreaSeriesConfig[];
  color?: string;
  height?: number;
  unit?: string;
  timeframes?: string[];
  onTimeframeChange?: (tf: string) => void;
}

export default function AreaTrendChartCard({
  title,
  subtitle,
  data,
  dataKey = 'value',
  series,
  color = '#6366F1',
  height = 190,
  unit = '',
  timeframes,
  onTimeframeChange,
}: AreaTrendChartCardProps) {
  const [selectedTf, setSelectedTf] = useState(timeframes ? timeframes[0] : '');

  const isEmpty = !data || data.length === 0;
  const gradientIdPrefix = `area-grad-${Math.random().toString(36).substr(2, 6)}`;

  const activeSeries: AreaSeriesConfig[] = series || [
    { key: dataKey, name: title, color: color },
  ];

  const handleTfClick = (tf: string) => {
    setSelectedTf(tf);
    if (onTimeframeChange) onTimeframeChange(tf);
  };

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h3 className="font-sekuya" style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
            {title}
          </h3>
          {subtitle && (
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              {subtitle}
            </p>
          )}
        </div>

        {timeframes && timeframes.length > 0 && (
          <div style={{ display: 'flex', gap: '3px', background: 'var(--input-bg)', padding: '3px', borderRadius: '8px' }}>
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => handleTfClick(tf)}
                style={{
                  background: selectedTf === tf ? '#6366F1' : 'transparent',
                  color: selectedTf === tf ? '#FFF' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '3px 9px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tf}
              </button>
            ))}
          </div>
        )}
      </div>

      {isEmpty ? (
        <ChartEmptyState height={height - 30} />
      ) : (
        <div style={{ width: '100%', height: `${height}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                {activeSeries.map((s, idx) => (
                  <linearGradient key={s.key} id={`${gradientIdPrefix}-${idx}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={s.color} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={s.color} stopOpacity={0.0} />
                  </linearGradient>
                ))}
              </defs>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                minTickGap={25}
                tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip unit={unit} />} />
              {activeSeries.map((s, idx) => (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  stroke={s.color}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill={`url(#${gradientIdPrefix}-${idx})`}
                  animationDuration={800}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
