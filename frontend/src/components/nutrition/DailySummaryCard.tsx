/**
 * DailySummaryCard Component (SPR-310)
 */

import React from 'react';
import { Flame, Zap, Droplet } from 'lucide-react';

interface MacroSummary {
  current: number;
  target: number;
  remaining: number;
  progressPercent: number;
}

interface DailySummaryCardProps {
  calories: MacroSummary;
  protein: MacroSummary;
  carbs: MacroSummary;
  fat: MacroSummary;
  fiber: { current: number };
  water: { currentLiters: number; targetLiters: number; progressPercent: number };
  mealsLogged: number;
}

export const DailySummaryCard: React.FC<DailySummaryCardProps> = ({
  calories,
  protein,
  carbs,
  fat,
  fiber,
  water,
  mealsLogged,
}) => {
  const macros = [
    { label: 'Calories', current: calories.current, target: calories.target, remaining: calories.remaining, pct: calories.progressPercent, color: '#10B981', unit: 'kcal' },
    { label: 'Protein', current: protein.current, target: protein.target, remaining: protein.remaining, pct: protein.progressPercent, color: '#6366F1', unit: 'g' },
    { label: 'Carbs', current: carbs.current, target: carbs.target, remaining: carbs.remaining, pct: carbs.progressPercent, color: '#F59E0B', unit: 'g' },
    { label: 'Fat', current: fat.current, target: fat.target, remaining: fat.remaining, pct: fat.progressPercent, color: '#8B5CF6', unit: 'g' },
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
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '6px', borderRadius: '10px', color: '#10B981' }}>
            <Flame size={20} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>Daily Nutrition Summary</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{mealsLogged} meals logged · {fiber.current}g fiber</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {macros.map((m) => (
          <div key={m.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>{m.label}</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: m.color }}>
                {m.current} / {m.target} {m.unit} ({m.remaining} {m.unit} remaining)
              </span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'var(--card-border)', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.min(100, m.pct)}%`,
                  height: '100%',
                  background: m.color,
                  borderRadius: '4px',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>
        ))}

        {/* Water row */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Droplet size={12} color="#0EA5E9" /> Water (from Body Module)
            </span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#0EA5E9' }}>
              {water.currentLiters} / {water.targetLiters} L ({water.progressPercent}%)
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'var(--card-border)', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${Math.min(100, water.progressPercent)}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #38BDF8, #0284C7)',
                borderRadius: '4px',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
