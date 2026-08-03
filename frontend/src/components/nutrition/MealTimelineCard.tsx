import { useState } from 'react';
import { Utensils, CheckCircle2, Circle, Clock, Plus, Trash2, Search } from 'lucide-react';
import { useNutritionStore } from '../../store/nutritionStore';

interface Props {
  onOpenLogModal: () => void;
}

export default function MealTimelineCard({ onOpenLogModal }: Props) {
  const { meals, toggleMealLogged, deleteMeal } = useNutritionStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMeals = meals.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCaloriesLogged = meals
    .filter((m) => m.logged)
    .reduce((acc, m) => acc + m.calories, 0);

  return (
    <div
      style={{
        background: 'var(--card-bg, #111827)',
        border: '1px solid var(--card-border, #1F2937)',
        borderRadius: 'var(--card-radius, 16px)',
        boxShadow: 'var(--card-shadow)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Utensils size={18} color="#10B981" />
          <span className="font-sekuya" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
            Daily Meal Timeline
          </span>
        </div>
        <button
          onClick={onOpenLogModal}
          style={{
            padding: '8px 14px',
            borderRadius: '10px',
            background: 'linear-gradient(90deg, #10B981, #059669)',
            border: 'none',
            color: '#FFF',
            fontWeight: 700,
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
          }}
        >
          <Plus size={14} />
          <span>+ LOG MEAL</span>
        </button>
      </div>

      {/* SEARCH & TOTAL SUMMARY */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--surface-bg, rgba(255,255,255,0.03))',
            border: '1px solid var(--card-border, #1F2937)',
            borderRadius: '10px',
            padding: '6px 12px',
          }}
        >
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search meals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-main, #FFF)',
              fontSize: '12px',
              width: '100%',
            }}
          />
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
          Logged: <strong style={{ color: '#10B981' }}>{totalCaloriesLogged} kcal</strong>
        </div>
      </div>

      {/* MEALS LIST */}
      {filteredMeals.length === 0 ? (
        <div
          style={{
            padding: '30px 20px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '13px',
          }}
        >
          <Utensils size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
          <p style={{ margin: 0 }}>No meals logged today. Log your first meal to start tracking.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredMeals.map((meal) => (
            <div
              key={meal.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'var(--surface-bg, rgba(255,255,255,0.02))',
                border: `1px solid ${meal.logged ? 'rgba(16, 185, 129, 0.3)' : 'var(--card-border, #1F2937)'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => toggleMealLogged(meal.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    color: meal.logged ? '#10B981' : 'var(--text-muted)',
                  }}
                >
                  {meal.logged ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </button>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#10B981',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontWeight: 700,
                      }}
                    >
                      {meal.category}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                      {meal.name}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      marginTop: '4px',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {meal.timeStr}
                    </span>
                    <span style={{ fontWeight: 700, color: '#FFF' }}>{meal.calories} kcal</span>
                    <span>
                      {meal.proteinGrams}g P · {meal.carbsGrams}g C · {meal.fatGrams}g F
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => deleteMeal(meal.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                }}
                title="Delete meal"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
