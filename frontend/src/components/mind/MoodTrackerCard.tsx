/**
 * MoodTrackerCard Component (SPR-309)
 */

import React from 'react';
import { Smile, CheckCircle2 } from 'lucide-react';
import type { MoodLevel } from '../../types/mind';

interface MoodTrackerCardProps {
  currentMood: MoodLevel;
  moodNote?: string;
  isCompleted: boolean;
  onOpenCheckInModal: () => void;
}

const moodOptions: { level: MoodLevel; emoji: string; label: string }[] = [
  { level: 1, emoji: '😞', label: 'Very Bad' },
  { level: 2, emoji: '😕', label: 'Bad' },
  { level: 3, emoji: '😐', label: 'Neutral' },
  { level: 4, emoji: '🙂', label: 'Good' },
  { level: 5, emoji: '😄', label: 'Excellent' },
];

export const MoodTrackerCard: React.FC<MoodTrackerCardProps> = ({
  currentMood,
  moodNote,
  isCompleted,
  onOpenCheckInModal,
}) => {
  const current = moodOptions.find((m) => m.level === currentMood) || moodOptions[2];

  return (
    <div
      style={{
        background: 'var(--card-bg, #111827)',
        border: '1px solid var(--card-border, #1F2937)',
        borderRadius: 'var(--card-radius, 16px)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: 'var(--card-shadow)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.15)', padding: '6px', borderRadius: '10px', color: '#8B5CF6' }}>
            <Smile size={20} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>Daily Mood Check-in</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Emotional self-awareness</div>
          </div>
        </div>

        <span
          style={{
            fontSize: '11px',
            background: isCompleted ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
            color: isCompleted ? '#10B981' : '#F59E0B',
            padding: '4px 10px',
            borderRadius: '12px',
            fontWeight: 700,
          }}
        >
          {isCompleted ? 'CHECKED IN' : 'PENDING'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
        <span style={{ fontSize: '36px' }}>{current.emoji}</span>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>{current.label}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            {moodNote || 'No additional mood notes logged today.'}
          </div>
        </div>
      </div>

      <button
        onClick={onOpenCheckInModal}
        style={{
          background: 'linear-gradient(90deg, #8B5CF6, #6366F1)',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '10px',
          padding: '10px 16px',
          fontSize: '12px',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
        }}
      >
        <CheckCircle2 size={14} />
        <span>{isCompleted ? 'Update Today\'s Mood' : 'Log Daily Mood'}</span>
      </button>
    </div>
  );
};
