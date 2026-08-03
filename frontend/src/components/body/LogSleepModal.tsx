import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Star } from 'lucide-react';
import { useBodyStore } from '../../store/bodyStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogSleepModal({ isOpen, onClose }: Props) {
  const { sleep, logSleep } = useBodyStore();
  const [sleepStart, setSleepStart] = useState(sleep.sleepStart || '11:10 PM');
  const [wakeTime, setWakeTime] = useState(sleep.wakeTime || '6:36 AM');
  const [qualityStars, setQualityStars] = useState(sleep.qualityStars || 4);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logSleep(sleepStart, wakeTime, qualityStars);
    onClose();
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
            maxWidth: '420px',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            color: 'var(--text-main, #FFFFFF)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  background: 'rgba(139, 92, 246, 0.15)',
                  padding: '8px',
                  borderRadius: '10px',
                  color: '#8B5CF6',
                }}
              >
                <Moon size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Record Sleep</h3>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                  Bedtime
                </label>
                <input
                  type="text"
                  placeholder="e.g. 11:10 PM"
                  value={sleepStart}
                  onChange={(e) => setSleepStart(e.target.value)}
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
                  Wake Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. 6:36 AM"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
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
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>
                Self-Reported Sleep Quality
              </label>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setQualityStars(star)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                  >
                    <Star
                      size={28}
                      color={star <= qualityStars ? '#F59E0B' : 'var(--text-muted)'}
                      fill={star <= qualityStars ? '#F59E0B' : 'transparent'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                background: '#8B5CF6',
                border: 'none',
                color: '#FFF',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)',
                marginTop: '8px',
              }}
            >
              SAVE SLEEP LOG
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
