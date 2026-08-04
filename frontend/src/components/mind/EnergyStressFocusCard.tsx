/**
 * EnergyStressFocusCard Component (SPR-309)
 */

import React from 'react';
import { Zap, ShieldAlert, Target } from 'lucide-react';

interface EnergyStressFocusCardProps {
  energy: number;
  stress: number;
  focus: number;
  onOpenCheckInModal: () => void;
}

export const EnergyStressFocusCard: React.FC<EnergyStressFocusCardProps> = ({
  energy,
  stress,
  focus,
  onOpenCheckInModal,
}) => {
  return (
    <div
      style={{
        background: 'var(--card-bg, #111827)',
        border: '1px solid var(--card-border, #1F2937)',
        borderRadius: 'var(--card-radius, 16px)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: 'var(--card-shadow)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
          Energy, Stress & Focus Metrics
        </h3>
        <button
          onClick={onOpenCheckInModal}
          style={{
            background: 'var(--input-bg)',
            border: '1px solid var(--input-border)',
            color: 'var(--text-muted)',
            borderRadius: '8px',
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Update
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        <div style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
            <Zap size={18} color="#F59E0B" />
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Energy</span>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#F59E0B', marginTop: '2px' }}>{energy}/10</div>
        </div>

        <div style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
            <ShieldAlert size={18} color="#10B981" />
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Stress</span>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#10B981', marginTop: '2px' }}>{stress}/10</div>
        </div>

        <div style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
            <Target size={18} color="#6366F1" />
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Focus</span>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#6366F1', marginTop: '2px' }}>{focus}/10</div>
        </div>
      </div>
    </div>
  );
};
