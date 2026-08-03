import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Droplet, Plus } from 'lucide-react';
import { useNutritionStore } from '../../store/nutritionStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogWaterModal({ isOpen, onClose }: Props) {
  const { water, addWater } = useNutritionStore();
  const [customMl, setCustomMl] = useState<number | ''>('');

  if (!isOpen) return null;

  const handleQuickAdd = (ml: number) => {
    addWater(ml);
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customMl && Number(customMl) > 0) {
      addWater(Number(customMl));
      setCustomMl('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(6px)',
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
            borderRadius: '20px',
            width: '100%',
            maxWidth: '400px',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            color: 'var(--text-main, #FFFFFF)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  background: 'rgba(14, 165, 233, 0.15)',
                  padding: '8px',
                  borderRadius: '10px',
                  color: '#0EA5E9',
                }}
              >
                <Droplet size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Log Hydration</h3>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Current: {water.currentLiters}L / Goal: {water.targetLiters}L
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
            <button
              onClick={() => handleQuickAdd(250)}
              style={{
                padding: '14px 8px',
                borderRadius: '12px',
                background: 'rgba(14, 165, 233, 0.12)',
                border: '1px solid rgba(14, 165, 233, 0.3)',
                color: '#38BDF8',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              +250 ml
              <span style={{ display: 'block', fontSize: '10px', fontWeight: 500, opacity: 0.8 }}>Glass</span>
            </button>

            <button
              onClick={() => handleQuickAdd(500)}
              style={{
                padding: '14px 8px',
                borderRadius: '12px',
                background: 'rgba(14, 165, 233, 0.18)',
                border: '1px solid rgba(14, 165, 233, 0.4)',
                color: '#38BDF8',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              +500 ml
              <span style={{ display: 'block', fontSize: '10px', fontWeight: 500, opacity: 0.8 }}>Bottle</span>
            </button>

            <button
              onClick={() => handleQuickAdd(1000)}
              style={{
                padding: '14px 8px',
                borderRadius: '12px',
                background: 'rgba(14, 165, 233, 0.25)',
                border: '1px solid rgba(14, 165, 233, 0.5)',
                color: '#38BDF8',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              +1.0 L
              <span style={{ display: 'block', fontSize: '10px', fontWeight: 500, opacity: 0.8 }}>Large Jug</span>
            </button>
          </div>

          <form onSubmit={handleCustomSubmit} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="number"
              placeholder="Custom ml (e.g. 350)"
              value={customMl}
              onChange={(e) => setCustomMl(e.target.value ? Number(e.target.value) : '')}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '10px',
                background: 'var(--surface-bg, #1F2937)',
                border: '1px solid var(--card-border, #374151)',
                color: '#FFF',
                fontSize: '14px',
              }}
            />
            <button
              type="submit"
              disabled={!customMl}
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                background: '#0EA5E9',
                border: 'none',
                color: '#FFF',
                fontWeight: 700,
                cursor: customMl ? 'pointer' : 'not-allowed',
                opacity: customMl ? 1 : 0.5,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Plus size={16} />
              <span>ADD</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
