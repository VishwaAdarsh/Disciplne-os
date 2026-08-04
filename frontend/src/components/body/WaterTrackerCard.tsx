/**
 * WaterTrackerCard Component (SPR-308)
 */

import React from 'react';
import { Droplet, Plus } from 'lucide-react';

interface WaterTrackerCardProps {
  currentLiters: number;
  targetLiters: number;
  unitSystem: 'metric' | 'imperial';
  onQuickAdd: (amountMl: number) => void;
  onOpenModal: () => void;
  onToggleUnit: () => void;
}

export const WaterTrackerCard: React.FC<WaterTrackerCardProps> = ({
  currentLiters,
  targetLiters,
  unitSystem,
  onQuickAdd,
  onOpenModal,
  onToggleUnit,
}) => {
  const currentOz = Math.round(currentLiters * 33.814);
  const targetOz = Math.round(targetLiters * 33.814);
  const progressPct = Math.min(100, Math.round((currentLiters / targetLiters) * 100));

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
          <div style={{ background: 'rgba(56, 189, 248, 0.15)', padding: '6px', borderRadius: '10px', color: '#38BDF8' }}>
            <Droplet size={20} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>Daily Hydration</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target: {unitSystem === 'metric' ? `${targetLiters}L` : `${targetOz} oz`}</div>
          </div>
        </div>

        <button
          onClick={onToggleUnit}
          style={{
            background: 'var(--input-bg)',
            border: '1px solid var(--input-border)',
            color: 'var(--text-muted)',
            borderRadius: '8px',
            padding: '4px 8px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {unitSystem === 'metric' ? 'Metric (L)' : 'Imperial (oz)'}
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '28px', fontWeight: 800, color: '#38BDF8' }}>
          {unitSystem === 'metric' ? `${currentLiters} / ${targetLiters} L` : `${currentOz} / ${targetOz} oz`}
        </div>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#38BDF8' }}>{progressPct}%</span>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '8px', background: 'var(--card-border)', borderRadius: '6px', overflow: 'hidden' }}>
        <div
          style={{
            width: `${progressPct}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #38BDF8, #0284C7)',
            borderRadius: '6px',
            transition: 'width 0.4s ease',
          }}
        />
      </div>

      {/* Quick Add Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginTop: '4px' }}>
        {[
          { label: '+250ml', amount: 250 },
          { label: '+500ml', amount: 500 },
          { label: '+750ml', amount: 750 },
          { label: '+1.0L', amount: 1000 },
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={() => onQuickAdd(btn.amount)}
            style={{
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              color: '#38BDF8',
              borderRadius: '8px',
              padding: '6px 4px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
            }}
          >
            <Plus size={11} />
            <span>{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
