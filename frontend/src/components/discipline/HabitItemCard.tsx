/**
 * HabitItemCard Component (SPR-307)
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, CheckCircle2, Repeat, Trash2 } from 'lucide-react';
import { DisciplineHabit } from '../../types/discipline';

interface HabitItemCardProps {
  habit: DisciplineHabit;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const HabitItemCard: React.FC<HabitItemCardProps> = ({ habit, onToggle, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '12px',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        <button
          onClick={() => onToggle(habit.id)}
          style={{
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#F59E0B',
            flexShrink: 0,
          }}
        >
          <CheckCircle2 size={20} />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>{habit.habitName}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Repeat size={12} /> {habit.frequency} ({habit.targetDaysPerWeek}d/wk)
            </span>
            <span>• {habit.category}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#F59E0B',
            padding: '4px 8px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 700,
          }}
        >
          <Flame size={14} />
          <span>{habit.streak} day streak</span>
        </div>

        {onDelete && (
          <button
            onClick={() => onDelete(habit.id)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
            title="Delete Habit"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </motion.div>
  );
};
