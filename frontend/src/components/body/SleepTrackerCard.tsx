/**
 * SleepTrackerCard Component (SPR-308)
 */

import React from 'react';
import { Moon, Plus } from 'lucide-react';

interface SleepTrackerCardProps {
  durationHours: number;
  durationMinutes: number;
  targetHours: number;
  qualityPercent: number;
  sleepStart?: string;
  wakeTime?: string;
  onOpenModal: () => void;
}

export const SleepTrackerCard: React.FC<SleepTrackerCardProps> = ({
  durationHours,
  durationMinutes,
  targetHours,
  qualityPercent,
  sleepStart = '11:00 PM',
  wakeTime = '06:30 AM',
  onOpenModal,
}) => {
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
          <div style={{ background: 'rgba(139, 92, 246, 0.15)', padding: '6px', borderRadius: '10px', color: '#8B5CF6' }}>
            <Moon size={20} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>Sleep Logging</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target: {targetHours}h 00m</div>
          </div>
        </div>

        <button
          onClick={onOpenModal}
          style={{
            background: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            color: '#8B5CF6',
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
          <span>Log Sleep</span>
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '28px', fontWeight: 800, color: '#8B5CF6' }}>
          {durationHours}h {durationMinutes}m
        </div>
        <div
          style={{
            fontSize: '11px',
            fontWeight: 700,
            background: 'rgba(139, 92, 246, 0.15)',
            color: '#8B5CF6',
            padding: '4px 8px',
            borderRadius: '8px',
          }}
        >
          {qualityPercent}% Quality
        </div>
      </div>

      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
        Schedule: <strong>{sleepStart}</strong> → <strong>{wakeTime}</strong>
      </div>
    </div>
  );
};
