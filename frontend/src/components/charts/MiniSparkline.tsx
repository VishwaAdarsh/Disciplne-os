import { useMemo } from 'react';

interface MiniSparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  isUp?: boolean;
  showTrendBadge?: boolean;
}

export default function MiniSparkline({
  data,
  width = 110,
  height = 36,
  color,
  isUp,
  showTrendBadge = true,
}: MiniSparklineProps) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;

  // Calculate trajectory trend if not explicitly passed
  const calculatedIsUp = isUp !== undefined ? isUp : data[data.length - 1] >= data[0];
  const strokeColor = color || (calculatedIsUp ? '#10B981' : '#EF4444');
  const gradientId = useMemo(() => `spark-grad-${Math.random().toString(36).substr(2, 9)}`, []);

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * (width - 8) + 4;
    const y = height - 6 - ((val - min) / range) * (height - 12);
    return { x, y };
  });

  const pathD = points.reduce((acc, point, idx) => {
    return idx === 0 ? `M ${point.x},${point.y}` : `${acc} L ${point.x},${point.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`;

  const lastPoint = points[points.length - 1];
  const percentChange = Math.round(
    ((data[data.length - 1] - data[0]) / (data[0] || 1)) * 100
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.3} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#${gradientId})`} />
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={lastPoint.x} cy={lastPoint.y} r="3" fill={strokeColor} />
      </svg>

      {showTrendBadge && (
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: strokeColor,
            background: `${strokeColor}18`,
            padding: '2px 6px',
            borderRadius: '6px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2px',
          }}
        >
          {calculatedIsUp ? '↑' : '↓'} {Math.abs(percentChange)}%
        </span>
      )}
    </div>
  );
}
