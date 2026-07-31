import { motion } from 'framer-motion';

interface HorizontalProgressBarProps {
  label: string;
  current: number;
  max?: number;
  unit?: string;
  color?: string;
  targetMarker?: number;
  height?: number;
  showPercentage?: boolean;
}

export default function HorizontalProgressBar({
  label,
  current,
  max = 100,
  unit = '%',
  color = '#6366F1',
  targetMarker,
  height = 8,
  showPercentage = true,
}: HorizontalProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((current / max) * 100)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontWeight: 700, color: color }}>
            {current} {unit}
          </span>
          {showPercentage && max !== 100 && (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              ({percentage}%)
            </span>
          )}
        </div>
      </div>

      <div
        style={{
          width: '100%',
          height: `${height}px`,
          borderRadius: `${height}px`,
          background: 'var(--input-bg)',
          border: '1px solid var(--input-border)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            height: '100%',
            borderRadius: `${height}px`,
            background: color,
          }}
        />

        {targetMarker !== undefined && (
          <div
            title={`Target: ${targetMarker}`}
            style={{
              position: 'absolute',
              left: `${Math.min(100, (targetMarker / max) * 100)}%`,
              top: 0,
              bottom: 0,
              width: '2px',
              background: 'var(--text-main)',
              zIndex: 2,
            }}
          />
        )}
      </div>
    </div>
  );
}
