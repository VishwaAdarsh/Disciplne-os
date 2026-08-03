import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Scale } from 'lucide-react';
import { useBodyStore } from '../../store/bodyStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogWeightModal({ isOpen, onClose }: Props) {
  const { weight, logWeight } = useBodyStore();
  const [weightKg, setWeightKg] = useState<number | ''>(weight.currentKg);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (weightKg && Number(weightKg) > 0) {
      logWeight(Number(weightKg));
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
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
            maxWidth: '380px',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            color: 'var(--text-main, #FFFFFF)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  background: 'rgba(99, 102, 241, 0.15)',
                  padding: '8px',
                  borderRadius: '10px',
                  color: '#6366F1',
                }}
              >
                <Scale size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Log Weight</h3>
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
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 68.4"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value ? Number(e.target.value) : '')}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'var(--surface-bg, #1F2937)',
                  border: '1px solid var(--card-border, #374151)',
                  color: '#FFF',
                  fontSize: '18px',
                  fontWeight: 700,
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                Target Weight: {weight.targetKg} kg
              </div>
            </div>

            <button
              type="submit"
              disabled={!weightKg}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                background: '#6366F1',
                border: 'none',
                color: '#FFF',
                fontWeight: 800,
                fontSize: '14px',
                cursor: weightKg ? 'pointer' : 'not-allowed',
                opacity: weightKg ? 1 : 0.5,
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
              }}
            >
              SAVE WEIGHT
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
