/**
 * NutritionGoalsCard Component (SPR-310)
 */

import React from 'react';
import { Target } from 'lucide-react';

interface NutritionGoalsCardProps {
  caloriesTarget: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  waterTargetLiters: number;
  onEditGoals: () => void;
}

export const NutritionGoalsCard: React.FC<NutritionGoalsCardProps> = ({
  caloriesTarget,
  proteinTarget,
  carbsTarget,
  fatTarget,
  waterTargetLiters,
  onEditGoals,
}) => {
  const goals = [
    { label: 'Calories', value: `${caloriesTarget} kcal`, color: '#10B981' },
    { label: 'Protein', value: `${proteinTarget}g`, color: '#6366F1' },
    { label: 'Carbs', value: `${carbsTarget}g`, color: '#F59E0B' },
    { label: 'Fat', value: `${fatTarget}g`, color: '#8B5CF6' },
    { label: 'Water', value: `${waterTargetLiters}L`, color: '#0EA5E9' },
  ];

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
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '6px', borderRadius: '10px', color: '#10B981' }}>
            <Target size={20} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>Daily Nutrition Goals</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Configurable targets for optimal nutrition</div>
          </div>
        </div>

        <button
          onClick={onEditGoals}
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
          Edit Goals
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px' }}>
        {goals.map((goal) => (
          <div
            key={goal.label}
            style={{
              background: 'var(--input-bg)',
              border: '1px solid var(--input-border)',
              borderRadius: '10px',
              padding: '10px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>{goal.label}</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: goal.color }}>{goal.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
