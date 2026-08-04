/**
 * WorkoutTrackerSection Component (SPR-308)
 */

import React from 'react';
import { Dumbbell, Plus } from 'lucide-react';

interface WorkoutItem {
  id: string;
  name: string;
  type: string;
  durationMinutes: number;
  caloriesBurned: number;
  intensity: string;
  dateStr: string;
  notes?: string | null;
}

interface WorkoutTrackerSectionProps {
  workouts: WorkoutItem[];
  weeklyCount: number;
  weeklyTarget: number;
  streakDays: number;
  onOpenModal: () => void;
}

export const WorkoutTrackerSection: React.FC<WorkoutTrackerSectionProps> = ({
  workouts,
  weeklyCount,
  weeklyTarget,
  streakDays,
  onOpenModal,
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
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Dumbbell size={20} color="#10B981" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>Workout Tracker</h3>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            This week: {weeklyCount} / {weeklyTarget} sessions completed · {streakDays} Day streak
          </div>
        </div>

        <button
          onClick={onOpenModal}
          style={{
            padding: '9px 16px',
            borderRadius: '10px',
            background: 'linear-gradient(90deg, #10B981, #059669)',
            border: 'none',
            color: '#FFF',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Plus size={16} />
          <span>Log Workout</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {workouts.map((w) => (
          <div
            key={w.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: '12px',
              background: 'var(--input-bg)',
              border: '1px solid var(--input-border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', background: 'rgba(16,185,129,0.15)', borderRadius: '10px', color: '#10B981' }}>
                <Dumbbell size={18} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>{w.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {w.type} · {w.durationMinutes} min · {w.caloriesBurned} kcal · Intensity: {w.intensity}
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--text-muted)' }}>{w.dateStr}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
