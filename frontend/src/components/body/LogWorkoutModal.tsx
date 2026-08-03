import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Dumbbell, Plus } from 'lucide-react';
import { useBodyStore } from '../../store/bodyStore';
import type { WorkoutType, WorkoutIntensity } from '../../types/body';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const WORKOUT_TYPES: WorkoutType[] = [
  'Strength',
  'Cardio',
  'Walking',
  'Running',
  'Cycling',
  'Yoga',
  'Stretching',
  'Sports',
  'Custom',
];

export default function LogWorkoutModal({ isOpen, onClose }: Props) {
  const { logCustomWorkout } = useBodyStore();
  const [name, setName] = useState('');
  const [type, setType] = useState<WorkoutType>('Strength');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [caloriesBurned, setCaloriesBurned] = useState<number | ''>(320);
  const [intensity, setIntensity] = useState<WorkoutIntensity>('High');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logCustomWorkout({
      name: name.trim() || `${type} Session`,
      type,
      durationMinutes: Number(durationMinutes) || 30,
      caloriesBurned: caloriesBurned !== '' ? Number(caloriesBurned) : undefined,
      intensity,
      notes,
    });
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
            maxWidth: '480px',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            color: 'var(--text-main, #FFFFFF)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  padding: '8px',
                  borderRadius: '10px',
                  color: '#10B981',
                }}
              >
                <Dumbbell size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Log Workout</h3>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                Workout Name
              </label>
              <input
                type="text"
                placeholder="e.g. Morning Push Day, 5k Tempo Run..."
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
                Workout Type
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {WORKOUT_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      border: `1px solid ${type === t ? '#10B981' : 'var(--card-border, #374151)'}`,
                      background: type === t ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                      color: type === t ? '#10B981' : 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  min={1}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
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
                  Calories Burned (kcal)
                </label>
                <input
                  type="number"
                  placeholder="Optional"
                  value={caloriesBurned}
                  onChange={(e) => setCaloriesBurned(e.target.value ? Number(e.target.value) : '')}
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
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                Intensity Level
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {(['Low', 'Medium', 'High', 'Extreme'] as WorkoutIntensity[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setIntensity(lvl)}
                    style={{
                      padding: '8px 4px',
                      fontSize: '11px',
                      fontWeight: 700,
                      borderRadius: '8px',
                      border: `1px solid ${intensity === lvl ? '#10B981' : 'var(--card-border)'}`,
                      background: intensity === lvl ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                      color: intensity === lvl ? '#10B981' : 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                Notes / Sets & Reps
              </label>
              <textarea
                placeholder="Logged 4 sets of Bench, 3 sets of Incline DB..."
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
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                marginTop: '8px',
              }}
            >
              <Plus size={18} />
              <span>SAVE WORKOUT</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
