import type { ReactNode } from 'react';
import MiniSparkline from './charts/MiniSparkline';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  badge?: string;
  badgeColor?: string;
  icon?: ReactNode;
  progressPercent?: number;
  progressColor?: string;
  accentClass?: string;
  footer?: ReactNode;
  sparklineData?: number[];
  sparklineColor?: string;
  isUp?: boolean;
  onClick?: () => void;
}

export default function MetricCard({
  title,
  value,
  subtext,
  badge,
  badgeColor = '#6366F1',
  icon,
  progressPercent,
  progressColor = 'linear-gradient(90deg, #6366F1, #8B5CF6)',
  accentClass,
  footer,
  sparklineData,
  sparklineColor,
  isUp,
  onClick,
}: MetricCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--card-radius, 16px)',
        boxShadow: 'var(--card-shadow)',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {icon && <div style={{ display: 'flex', alignItems: 'center' }}>{icon}</div>}
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              {title}
            </span>
          </div>
          {badge && (
            <span
              style={{
                fontSize: '11px',
                background: `${badgeColor}18`,
                color: badgeColor,
                padding: '2px 8px',
                borderRadius: '12px',
                fontWeight: 700,
              }}
            >
              {badge}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <div className={`font-sekuya ${accentClass || ''}`} style={{ fontSize: '28px', fontWeight: 700, color: accentClass ? undefined : 'var(--text-main)', lineHeight: 1.1 }}>
              {value}
            </div>

            {subtext && (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 500 }}>
                {subtext}
              </div>
            )}
          </div>

          {sparklineData && sparklineData.length >= 2 && (
            <MiniSparkline data={sparklineData} color={sparklineColor || badgeColor} isUp={isUp} />
          )}
        </div>
      </div>

      {(progressPercent !== undefined || footer) && (
        <div style={{ marginTop: '16px' }}>
          {progressPercent !== undefined && (
            <div style={{ background: 'var(--input-bg)', borderRadius: '20px', height: '7px', overflow: 'hidden', border: '1px solid var(--card-border)' }}>
              <div
                style={{
                  width: `${Math.min(100, Math.max(0, progressPercent))}%`,
                  height: '100%',
                  background: progressColor,
                  borderRadius: '20px',
                  transition: 'width 0.8s ease-out',
                }}
              />
            </div>
          )}
          {footer && <div style={{ marginTop: '8px' }}>{footer}</div>}
        </div>
      )}
    </div>
  );
}
