import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Utensils, Plus } from 'lucide-react';
import { useNutritionStore } from '../../store/nutritionStore';
import type { MealCategory } from '../../types/nutrition';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: MealCategory[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Custom'];

export default function LogMealModal({ isOpen, onClose }: Props) {
  const { logMeal } = useNutritionStore();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<MealCategory>('Lunch');
  const [calories, setCalories] = useState<number | ''>(550);
  const [proteinGrams, setProteinGrams] = useState<number | ''>(35);
  const [carbsGrams, setCarbsGrams] = useState<number | ''>(60);
  const [fatGrams, setFatGrams] = useState<number | ''>(15);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logMeal({
      name: name.trim() || `${category} Meal`,
      category,
      timeStr: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      calories: Number(calories) || 400,
      proteinGrams: Number(proteinGrams) || 25,
      carbsGrams: Number(carbsGrams) || 40,
      fatGrams: Number(fatGrams) || 12,
      notes: notes.trim() || undefined,
      logged: true,
    });

    setName('');
    setNotes('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          style={{
            background: 'var(--card-bg, #111827)',
            border: '1px solid var(--card-border, #1F2937)',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '480px',
            padding: '24px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            color: 'var(--text-main, #FFFFFF)',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  padding: '8px',
                  borderRadius: '12px',
                  color: '#10B981',
                }}
              >
                <Utensils size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Log Meal & Macros</h3>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                Meal Category
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 700,
                      border: `1px solid ${category === cat ? '#10B981' : 'var(--card-border, #374151)'}`,
                      background: category === cat ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                      color: category === cat ? '#10B981' : 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                Meal Name / Items
              </label>
              <input
                type="text"
                placeholder="e.g. Chicken Rice Bowl & Veggies"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'var(--surface-bg, #1F2937)',
                  border: '1px solid var(--card-border, #374151)',
                  color: '#FFF',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                Total Calories (kcal)
              </label>
              <input
                type="number"
                placeholder="e.g. 550"
                value={calories}
                onChange={(e) => setCalories(e.target.value ? Number(e.target.value) : '')}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'var(--surface-bg, #1F2937)',
                  border: '1px solid var(--card-border, #374151)',
                  color: '#FFF',
                  fontSize: '16px',
                  fontWeight: 700,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px', color: '#6366F1' }}>
                  Protein (g)
                </label>
                <input
                  type="number"
                  placeholder="35"
                  value={proteinGrams}
                  onChange={(e) => setProteinGrams(e.target.value ? Number(e.target.value) : '')}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: 'var(--surface-bg, #1F2937)',
                    border: '1px solid #6366F1',
                    color: '#FFF',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px', color: '#F59E0B' }}>
                  Carbs (g)
                </label>
                <input
                  type="number"
                  placeholder="60"
                  value={carbsGrams}
                  onChange={(e) => setCarbsGrams(e.target.value ? Number(e.target.value) : '')}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: 'var(--surface-bg, #1F2937)',
                    border: '1px solid #F59E0B',
                    color: '#FFF',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px', color: '#8B5CF6' }}>
                  Fat (g)
                </label>
                <input
                  type="number"
                  placeholder="15"
                  value={fatGrams}
                  onChange={(e) => setFatGrams(e.target.value ? Number(e.target.value) : '')}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: 'var(--surface-bg, #1F2937)',
                    border: '1px solid #8B5CF6',
                    color: '#FFF',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                Meal Notes (Optional)
              </label>
              <textarea
                placeholder="High protein post-workout lunch..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'var(--surface-bg, #1F2937)',
                  border: '1px solid var(--card-border, #374151)',
                  color: '#FFF',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                  resize: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                background: 'linear-gradient(90deg, #10B981, #059669)',
                border: 'none',
                color: '#FFF',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                marginTop: '8px',
              }}
            >
              <Plus size={18} />
              <span>SAVE MEAL</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
