import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, Flame, Dumbbell, Zap, CheckCircle2 } from 'lucide-react';
import { useBodyStore } from '../../store/bodyStore';
import type { WorkoutIntensity } from '../../types/body';

export default function ActiveWorkoutModal() {
  const { activeSession, pauseWorkout, resumeWorkout, tickWorkoutTimer, finishWorkout, cancelWorkout } = useBodyStore();
  const [showFinishStep, setShowFinishStep] = useState(false);
  const [intensity, setIntensity] = useState<WorkoutIntensity>('High');
  const [notes, setNotes] = useState('');
  const [customCalories, setCustomCalories] = useState<number | ''>('');

  // Interval timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeSession.status === 'running') {
      interval = setInterval(() => {
        tickWorkoutTimer();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeSession.status, tickWorkoutTimer]);

  if (activeSession.status === 'idle') return null;

  const minutes = Math.floor(activeSession.elapsedSeconds / 60);
  const seconds = activeSession.elapsedSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const estimatedCalories = customCalories !== '' ? Number(customCalories) : Math.max(1, minutes) * 8;

  const handleFinishSubmit = () => {
    finishWorkout(notes, Number(estimatedCalories), intensity);
    setShowFinishStep(false);
    setNotes('');
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          style={{
            background: 'var(--card-bg, #111827)',
            border: '1px solid var(--card-border, #1F2937)',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '460px',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            color: 'var(--text-main, #FFFFFF)',
          }}
        >
          {!showFinishStep ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10B981',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                }}
              >
                <Dumbbell size={16} />
                <span>ACTIVE WORKOUT SESSION</span>
              </div>

              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px 0' }}>{activeSession.name}</h2>
                <div style={{ fontSize: '13px', color: 'var(--text-muted, #9CA3AF)' }}>
                  Type: {activeSession.type} · Target: 45 min
                </div>
              </div>

              {/* STOPWATCH TIMER DISPLAY */}
              <div
                style={{
                  fontSize: '64px',
                  fontWeight: 900,
                  fontFamily: 'monospace',
                  letterSpacing: '2px',
                  color: activeSession.status === 'paused' ? '#F59E0B' : '#10B981',
                  background: 'rgba(0,0,0,0.3)',
                  padding: '16px 32px',
                  borderRadius: '20px',
                  border: `1px solid ${activeSession.status === 'paused' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                {formattedTime}
              </div>

              {/* STATS PREVIEW */}
              <div style={{ display: 'flex', gap: '16px', width: '100%', justifyContent: 'center' }}>
                <div
                  style={{
                    flex: 1,
                    background: 'var(--surface-bg, #1F2937)',
                    padding: '12px',
                    borderRadius: '12px',
                    textAlign: 'center',
                  }}
                >
                  <Flame size={18} color="#EF4444" style={{ marginBottom: '4px' }} />
                  <div style={{ fontSize: '16px', fontWeight: 700 }}>~{estimatedCalories}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Est. Calories</div>
                </div>

                <div
                  style={{
                    flex: 1,
                    background: 'var(--surface-bg, #1F2937)',
                    padding: '12px',
                    borderRadius: '12px',
                    textAlign: 'center',
                  }}
                >
                  <Zap size={18} color="#F59E0B" style={{ marginBottom: '4px' }} />
                  <div style={{ fontSize: '16px', fontWeight: 700 }}>{activeSession.status.toUpperCase()}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Status</div>
                </div>
              </div>

              {/* CONTROLS BUTTONS */}
              <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '8px' }}>
                {activeSession.status === 'running' ? (
                  <button
                    onClick={pauseWorkout}
                    style={{
                      flex: 1,
                      background: '#F59E0B',
                      color: '#000000',
                      border: 'none',
                      padding: '14px',
                      borderRadius: '14px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '14px',
                    }}
                  >
                    <Pause size={18} />
                    <span>PAUSE</span>
                  </button>
                ) : (
                  <button
                    onClick={resumeWorkout}
                    style={{
                      flex: 1,
                      background: '#10B981',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '14px',
                      borderRadius: '14px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '14px',
                    }}
                  >
                    <Play size={18} />
                    <span>RESUME</span>
                  </button>
                )}

                <button
                  onClick={() => setShowFinishStep(true)}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(90deg, #10B981, #059669)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '14px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  <Square size={18} />
                  <span>FINISH</span>
                </button>
              </div>

              <button
                onClick={cancelWorkout}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted, #9CA3AF)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Discard Session
              </button>
            </div>
          ) : (
            /* FINISH SUMMARY STEP */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={24} color="#10B981" />
                <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>Finish & Save Workout</h3>
              </div>

              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Total Duration: <strong>{formattedTime}</strong> ({minutes} minutes)
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                  Intensity Level
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {(['Low', 'Medium', 'High', 'Extreme'] as WorkoutIntensity[]).map((lvl) => (
                    <button
                      key={lvl}
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
                  Calories Burned (kcal)
                </label>
                <input
                  type="number"
                  placeholder={`Est. ${estimatedCalories}`}
                  value={customCalories}
                  onChange={(e) => setCustomCalories(e.target.value ? Number(e.target.value) : '')}
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
                  Session Notes (Optional)
                </label>
                <textarea
                  placeholder="How did the session feel? Felt strong, hit PR on bench..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
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

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  onClick={() => setShowFinishStep(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'transparent',
                    border: '1px solid var(--card-border)',
                    color: 'var(--text-muted)',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Back
                </button>
                <button
                  onClick={handleFinishSubmit}
                  style={{
                    flex: 2,
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'linear-gradient(90deg, #10B981, #059669)',
                    border: 'none',
                    color: '#FFF',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  SAVE WORKOUT
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
