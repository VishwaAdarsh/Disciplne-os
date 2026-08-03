import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smile, Target, Zap, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useMindStore } from '../../store/mindStore';
import type { MoodLevel } from '../../types/mind';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const EMOJIS = [
  { level: 1 as MoodLevel, emoji: '😞', label: 'Very Bad', color: '#EF4444' },
  { level: 2 as MoodLevel, emoji: '😕', label: 'Bad', color: '#F97316' },
  { level: 3 as MoodLevel, emoji: '😐', label: 'Neutral', color: '#F59E0B' },
  { level: 4 as MoodLevel, emoji: '🙂', label: 'Good', color: '#10B981' },
  { level: 5 as MoodLevel, emoji: '😄', label: 'Excellent', color: '#8B5CF6' },
];

export default function DailyCheckInModal({ isOpen, onClose }: Props) {
  const { todayCheckIn, submitDailyCheckIn } = useMindStore();

  const [mood, setMood] = useState<MoodLevel>(todayCheckIn.mood || 4);
  const [moodNote, setMoodNote] = useState(todayCheckIn.moodNote || '');
  const [focus, setFocus] = useState(todayCheckIn.focus || 8);
  const [energy, setEnergy] = useState(todayCheckIn.energy || 7);
  const [stress, setStress] = useState(todayCheckIn.stress || 3);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitDailyCheckIn({
      mood,
      moodNote: moodNote.trim() || undefined,
      focus,
      energy,
      stress,
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
                  background: 'rgba(139, 92, 246, 0.15)',
                  padding: '8px',
                  borderRadius: '12px',
                  color: '#8B5CF6',
                }}
              >
                <Smile size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Daily Mind Check-In</h3>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Self-awareness & performance check-in
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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 1. MOOD SELECTION */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>
                1. How are you feeling today?
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                {EMOJIS.map((e) => {
                  const isSelected = mood === e.level;
                  return (
                    <button
                      key={e.level}
                      type="button"
                      onClick={() => setMood(e.level)}
                      style={{
                        padding: '10px 4px',
                        borderRadius: '12px',
                        border: `1px solid ${isSelected ? e.color : 'var(--card-border, #374151)'}`,
                        background: isSelected ? `${e.color}22` : 'var(--surface-bg, rgba(255,255,255,0.02))',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span style={{ fontSize: '24px' }}>{e.emoji}</span>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          color: isSelected ? e.color : 'var(--text-muted)',
                        }}
                      >
                        {e.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <input
                type="text"
                placeholder="What's influencing your mood today? (Optional)"
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
                style={{
                  width: '100%',
                  marginTop: '10px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'var(--surface-bg, #1F2937)',
                  border: '1px solid var(--card-border, #374151)',
                  color: '#FFF',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* 2. FOCUS LEVEL (1-10) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Target size={16} color="#6366F1" />
                  <span>2. Focus Level</span>
                </label>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#6366F1' }}>{focus} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={focus}
                onChange={(e) => setFocus(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#6366F1', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>1 - Distracted</span>
                <span>10 - Deep Clarity</span>
              </div>
            </div>

            {/* 3. ENERGY LEVEL (1-10) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={16} color="#F59E0B" />
                  <span>3. Energy Level</span>
                </label>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#F59E0B' }}>{energy} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={energy}
                onChange={(e) => setEnergy(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#F59E0B', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>1 - Exhausted</span>
                <span>10 - High Vitality</span>
              </div>
            </div>

            {/* 4. STRESS LEVEL (1-10) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldAlert size={16} color="#10B981" />
                  <span>4. Perceived Stress</span>
                </label>
                <span style={{ fontSize: '14px', fontWeight: 800, color: stress > 6 ? '#F59E0B' : '#10B981' }}>
                  {stress} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={stress}
                onChange={(e) => setStress(Number(e.target.value))}
                style={{ width: '100%', accentColor: stress > 6 ? '#F59E0B' : '#10B981', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>1 - Calm & Relaxed</span>
                <span>10 - High Strain</span>
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '14px',
                background: 'linear-gradient(90deg, #8B5CF6, #6366F1)',
                border: 'none',
                color: '#FFF',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)',
                marginTop: '8px',
              }}
            >
              <CheckCircle2 size={18} />
              <span>SAVE CHECK-IN</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
