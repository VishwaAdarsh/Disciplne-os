import { Zap } from 'lucide-react';
import { useBodyStore } from '../../store/bodyStore';
import type { RecoveryLevel, RecoveryOption } from '../../types/body';

const RECOVERY_OPTIONS: RecoveryOption[] = [
  { level: 'very_tired', label: 'Very Tired', emoji: '😫', color: '#EF4444', scoreBonus: 30 },
  { level: 'tired', label: 'Tired', emoji: '😕', color: '#F97316', scoreBonus: 50 },
  { level: 'normal', label: 'Normal', emoji: '😐', color: '#F59E0B', scoreBonus: 70 },
  { level: 'good', label: 'Good', emoji: '🙂', color: '#10B981', scoreBonus: 88 },
  { level: 'excellent', label: 'Excellent', emoji: '💪', color: '#8B5CF6', scoreBonus: 100 },
];

export default function RecoveryCard() {
  const { recovery, logRecovery } = useBodyStore();

  return (
    <div
      style={{
        background: 'var(--card-bg, #111827)',
        border: '1px solid var(--card-border, #1F2937)',
        borderRadius: 'var(--card-radius, 16px)',
        boxShadow: 'var(--card-shadow)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={18} color="#F59E0B" />
          <span className="font-sekuya" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
            Physical Recovery & Readiness
          </span>
        </div>
        <span
          style={{
            fontSize: '11px',
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#F59E0B',
            padding: '3px 10px',
            borderRadius: '12px',
            fontWeight: 700,
          }}
        >
          DAILY CHECK-IN
        </span>
      </div>

      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
        How does your body feel today? Physical readiness directly influences your daily Body Score.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
        {RECOVERY_OPTIONS.map((opt) => {
          const isSelected = recovery.currentLevel === opt.level;
          return (
            <button
              key={opt.level}
              onClick={() => logRecovery(opt.level as RecoveryLevel)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px 4px',
                borderRadius: '12px',
                border: `1px solid ${isSelected ? opt.color : 'var(--card-border, #1F2937)'}`,
                background: isSelected ? `${opt.color}22` : 'var(--surface-bg, rgba(255,255,255,0.03))',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: isSelected ? 'scale(1.04)' : 'scale(1)',
              }}
            >
              <span style={{ fontSize: '24px', marginBottom: '4px' }}>{opt.emoji}</span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: isSelected ? opt.color : 'var(--text-muted)',
                  textAlign: 'center',
                }}
              >
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
