import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Save } from 'lucide-react';
import { useNutritionStore } from '../../store/nutritionStore';

interface EditGoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditGoalsModal: React.FC<EditGoalsModalProps> = ({ isOpen, onClose }) => {
  const { calories, protein, carbs, fat, water, updateGoalsAsync } = useNutritionStore();

  const [caloriesTarget, setCaloriesTarget] = useState<number | ''>(calories.target || 2200);
  const [proteinTarget, setProteinTarget] = useState<number | ''>(protein.target || 120);
  const [carbsTarget, setCarbsTarget] = useState<number | ''>(carbs.target || 250);
  const [fatTarget, setFatTarget] = useState<number | ''>(fat.target || 70);
  const [waterTargetMl, setWaterTargetMl] = useState<number | ''>(Math.round((water.targetLiters || 3.0) * 1000));

  useEffect(() => {
    if (isOpen) {
      setCaloriesTarget(calories.target || 2200);
      setProteinTarget(protein.target || 120);
      setCarbsTarget(carbs.target || 250);
      setFatTarget(fat.target || 70);
      setWaterTargetMl(Math.round((water.targetLiters || 3.0) * 1000));
    }
  }, [isOpen, calories.target, protein.target, carbs.target, fat.target, water.targetLiters]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateGoalsAsync({
      caloriesTarget: Number(caloriesTarget) || 2200,
      proteinTarget: Number(proteinTarget) || 120,
      carbsTarget: Number(carbsTarget) || 250,
      fatTarget: Number(fatTarget) || 70,
      waterTargetMl: Number(waterTargetMl) || 3000,
    });
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
            maxWidth: '440px',
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
                <Target size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Edit Nutrition Goals</h3>
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
                Daily Calorie Target (kcal)
              </label>
              <input
                type="number"
                value={caloriesTarget}
                onChange={(e) => setCaloriesTarget(e.target.value ? Number(e.target.value) : '')}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'var(--surface-bg, #1F2937)',
                  border: '1px solid var(--card-border, #374151)',
                  color: '#FFF',
                  fontSize: '15px',
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
                  value={proteinTarget}
                  onChange={(e) => setProteinTarget(e.target.value ? Number(e.target.value) : '')}
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
                  value={carbsTarget}
                  onChange={(e) => setCarbsTarget(e.target.value ? Number(e.target.value) : '')}
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
                  value={fatTarget}
                  onChange={(e) => setFatTarget(e.target.value ? Number(e.target.value) : '')}
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
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: '#0EA5E9' }}>
                Water Goal (ml)
              </label>
              <input
                type="number"
                placeholder="3000"
                value={waterTargetMl}
                onChange={(e) => setWaterTargetMl(e.target.value ? Number(e.target.value) : '')}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'var(--surface-bg, #1F2937)',
                  border: '1px solid #0EA5E9',
                  color: '#FFF',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {Number(waterTargetMl) / 1000} Liters
              </div>
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
              <Save size={18} />
              <span>SAVE TARGETS</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
