import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Plus } from 'lucide-react';
import { useMindStore } from '../../store/mindStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const MOOD_TAGS = [
  { tag: 'Great', emoji: '😄' },
  { tag: 'Good', emoji: '🙂' },
  { tag: 'Calm', emoji: '🧘' },
  { tag: 'Focused', emoji: '🎯' },
  { tag: 'Challenged', emoji: '💪' },
];

export default function CreateJournalModal({ isOpen, onClose }: Props) {
  const { saveJournalEntry } = useMindStore();

  const [title, setTitle] = useState('');
  const [reflection, setReflection] = useState('');
  const [wentWell, setWentWell] = useState('');
  const [challenged, setChallenged] = useState('');
  const [improveTomorrow, setImproveTomorrow] = useState('');
  const [selectedTag, setSelectedTag] = useState(MOOD_TAGS[1]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflection.trim() && !title.trim()) return;

    saveJournalEntry({
      title: title.trim() || 'Daily Reflection',
      reflection: reflection.trim(),
      wentWell: wentWell.trim() || undefined,
      challenged: challenged.trim() || undefined,
      improveTomorrow: improveTomorrow.trim() || undefined,
      moodTag: selectedTag.tag,
      emoji: selectedTag.emoji,
    });

    setTitle('');
    setReflection('');
    setWentWell('');
    setChallenged('');
    setImproveTomorrow('');
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
            maxWidth: '520px',
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
                  background: 'rgba(99, 102, 241, 0.15)',
                  padding: '8px',
                  borderRadius: '12px',
                  color: '#6366F1',
                }}
              >
                <BookOpen size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>New Journal Reflection</h3>
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
                Entry Title
              </label>
              <input
                type="text"
                placeholder="e.g. Evening Reflection & Wins"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                Mood / Mindset Tag
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {MOOD_TAGS.map((t) => (
                  <button
                    key={t.tag}
                    type="button"
                    onClick={() => setSelectedTag(t)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      border: `1px solid ${selectedTag.tag === t.tag ? '#6366F1' : 'var(--card-border, #374151)'}`,
                      background: selectedTag.tag === t.tag ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                      color: selectedTag.tag === t.tag ? '#6366F1' : 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>{t.emoji}</span>
                    <span>{t.tag}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                General Thoughts & Reflection
              </label>
              <textarea
                placeholder="How was today overall? How did your mind feel?"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                  What Went Well Today?
                </label>
                <textarea
                  placeholder="Wins, achievements, focus streak..."
                  value={wentWell}
                  onChange={(e) => setWentWell(e.target.value)}
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'var(--surface-bg, #1F2937)',
                    border: '1px solid var(--card-border, #374151)',
                    color: '#FFF',
                    fontSize: '12px',
                    boxSizing: 'border-box',
                    resize: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                  What Challenged You?
                </label>
                <textarea
                  placeholder="Distractions, stress spikes..."
                  value={challenged}
                  onChange={(e) => setChallenged(e.target.value)}
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'var(--surface-bg, #1F2937)',
                    border: '1px solid var(--card-border, #374151)',
                    color: '#FFF',
                    fontSize: '12px',
                    boxSizing: 'border-box',
                    resize: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                What Will You Improve Tomorrow?
              </label>
              <input
                type="text"
                placeholder="Actionable focus improvement..."
                value={improveTomorrow}
                onChange={(e) => setImproveTomorrow(e.target.value)}
                style={{
                  width: '100%',
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

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                background: 'linear-gradient(90deg, #6366F1, #8B5CF6)',
                border: 'none',
                color: '#FFF',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                marginTop: '8px',
              }}
            >
              <Plus size={18} />
              <span>SAVE JOURNAL ENTRY</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
