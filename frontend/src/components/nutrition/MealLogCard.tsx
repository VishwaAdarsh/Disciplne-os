/**
 * MealLogCard Component (SPR-310)
 */

import React from 'react';
import { Utensils, Plus, Trash2, Edit3 } from 'lucide-react';

interface MealItem {
  id: string;
  name: string;
  category: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  loggedAt: string;
}

interface MealLogCardProps {
  meals: MealItem[];
  onOpenLogModal: () => void;
  onDelete?: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  Breakfast: '#F59E0B',
  Lunch: '#10B981',
  Dinner: '#8B5CF6',
  Snacks: '#0EA5E9',
  Custom: '#6366F1',
};

export const MealLogCard: React.FC<MealLogCardProps> = ({
  meals,
  onOpenLogModal,
  onDelete,
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
            <Utensils size={20} color="#10B981" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>Today's Meals</h3>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {meals.length} meals logged today
          </div>
        </div>

        <button
          onClick={onOpenLogModal}
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
          <span>Log Meal</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {meals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '13px' }}>
            No meals logged today. Start by logging your first meal.
          </div>
        ) : (
          meals.map((meal) => (
            <div
              key={meal.id}
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
                <div
                  style={{
                    padding: '8px',
                    background: `${categoryColors[meal.category] || '#10B981'}20`,
                    borderRadius: '10px',
                    color: categoryColors[meal.category] || '#10B981',
                  }}
                >
                  <Utensils size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>{meal.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span
                      style={{
                        background: `${categoryColors[meal.category] || '#10B981'}20`,
                        color: categoryColors[meal.category] || '#10B981',
                        padding: '1px 6px',
                        borderRadius: '6px',
                        fontSize: '10px',
                        fontWeight: 700,
                        marginRight: '6px',
                      }}
                    >
                      {meal.category}
                    </span>
                    {meal.calories} kcal · {meal.proteinG}g P · {meal.carbsG}g C · {meal.fatG}g F
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {onDelete && (
                  <button
                    onClick={() => onDelete(meal.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
