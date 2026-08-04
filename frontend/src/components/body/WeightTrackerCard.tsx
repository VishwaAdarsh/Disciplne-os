/**
 * WeightTrackerCard Component (SPR-308)
 */

import React from 'react';
import { Scale, Plus } from 'lucide-react';

interface WeightTrackerCardProps {
  currentKg: number;
  targetKg: number;
  change30Days: number;
  unitSystem: 'metric' | 'imperial';
  onOpenModal: () => void;
}

export const WeightTrackerCard: React.FC<WeightTrackerCardProps> = ({
  currentKg,
  targetKg,
  change30Days,
  unitSystem,
  onOpenModal,
}) => {
  const currentLbs = Number((currentKg * 2.20462).toFixed(1));
  const targetLbs = Number((targetKg * 2.20462).toFixed(1));
  const changeLbs = Number((change30Days * 2.20462).toFixed(1));

  return (
    <div
      style={{
        background: 'var(--card-bg, #111827)',
        border: '1px solid var(--card-border, #1F2937)',
        borderRadius: 'var(--card-radius, 16px)',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: 'var(--card-shadow)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '6px', borderRadius: '10px', color: '#6366F1' }}>
            <Scale size={20} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>Weight & Body Composition</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target Goal: {unitSystem === 'metric' ? `${targetKg} kg` : `${targetLbs} lbs`}</div>
          </div>
        </div>

        <button
          onClick={onOpenModal}
          style={{
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#6366F1',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Plus size={14} />
          <span>Log Weight</span>
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '28px', fontWeight: 800, color: '#6366F1' }}>
          {unitSystem === 'metric' ? `${currentKg} kg` : `${currentLbs} lbs`}
        </div>
        <div
          style={{
            fontSize: '11px',
            fontWeight: 700,
            background: change30Days > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            color: change30Days > 0 ? '#EF4444' : '#10B981',
            padding: '4px 8px',
            borderRadius: '8px',
          }}
        >
          {change30Days > 0 ? '+' : ''}{unitSystem === 'metric' ? `${change30Days} kg` : `${changeLbs} lbs`} (30 Days)
        </div>
      </div>
    </div>
  );
};
