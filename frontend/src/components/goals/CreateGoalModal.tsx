import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Sparkles, Plus, Trash2 } from 'lucide-react';
import { useGoalsStore } from '../../store/goalsStore';
import type { GoalCategory, GoalPriority } from '../../types/goals';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: GoalCategory[] = [
  'Career',
  'Study',
  'Fitness',
  'Finance',
  'Personal',
  'Learning',
  'Custom',
];

const PRIORITIES: GoalPriority[] = ['Low', 'Medium', 'High', 'Critical'];

export default function CreateGoalModal({ isOpen, onClose }: Props) {
  const { createGoal, aiSuggestMilestones } = useGoalsStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GoalCategory>('Career');
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [priority, setPriority] = useState<GoalPriority>('High');
  const [deadline, setDeadline] = useState('Aug 31');
  const [targetValue, setTargetValue] = useState('');
  const [milestoneInputs, setMilestoneInputs] = useState<string[]>([
    'Phase 1: Setup & Fundamentals',
    'Phase 2: Core Project Implementation',
  ]);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleAddMilestoneInput = () => {
    setMilestoneInputs([...milestoneInputs, '']);
  };

  const handleRemoveMilestoneInput = (idx: number) => {
    setMilestoneInputs(milestoneInputs.filter((_, i) => i !== idx));
  };

  const handleAiSuggest = () => {
    if (!title.trim()) return;
    const suggested = aiSuggestMilestones(title, category);
    setMilestoneInputs(suggested);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const milestones = milestoneInputs
      .filter((m) => m.trim().length > 0)
      .map((mTitle, idx) => ({
        id: `m-${Date.now()}-${idx}`,
        title: mTitle.trim(),
        completed: false,
      }));

    createGoal({
      title: title.trim().toUpperCase(),
      description: description.trim() || undefined,
      category,
      customCategoryName: category === 'Custom' ? customCategoryName.trim() : undefined,
      startDate: new Date().toISOString().split('T')[0],
      deadline: deadline.trim() || 'Ongoing',
      priority,
      status: 'Active',
      targetValue: targetValue.trim() || undefined,
      milestones,
      linkedTasks: [],
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setDescription('');
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
                <Target size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Create New Strategic Goal</h3>
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
                Goal Title
              </label>
              <input
                type="text"
                placeholder="e.g. LEARN PYTHON & DATA SCIENCE"
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
                  fontWeight: 700,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                Category
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      border: `1px solid ${category === cat ? '#6366F1' : 'var(--card-border, #374151)'}`,
                      background: category === cat ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                      color: category === cat ? '#6366F1' : 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {category === 'Custom' && (
                <input
                  type="text"
                  placeholder="Enter custom category name..."
                  value={customCategoryName}
                  onChange={(e) => setCustomCategoryName(e.target.value)}
                  style={{
                    width: '100%',
                    marginTop: '8px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--surface-bg, #1F2937)',
                    border: '1px solid #6366F1',
                    color: '#FFF',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                  Target Deadline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aug 31 or Dec 31"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
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

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                  Priority
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                  {PRIORITIES.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      style={{
                        padding: '8px 2px',
                        fontSize: '10px',
                        fontWeight: 700,
                        borderRadius: '6px',
                        border: `1px solid ${priority === p ? '#6366F1' : 'var(--card-border)'}`,
                        background: priority === p ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                        color: priority === p ? '#6366F1' : 'var(--text-muted)',
                        cursor: 'pointer',
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Milestones Checklist</label>
                <button
                  type="button"
                  onClick={handleAiSuggest}
                  disabled={!title.trim()}
                  style={{
                    background: 'rgba(139, 92, 246, 0.15)',
                    color: '#8B5CF6',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: title.trim() ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Sparkles size={12} />
                  <span>AI Breakdown</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {milestoneInputs.map((val, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder={`Milestone #${idx + 1}`}
                      value={val}
                      onChange={(e) => {
                        const updated = [...milestoneInputs];
                        updated[idx] = e.target.value;
                        setMilestoneInputs(updated);
                      }}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'var(--surface-bg, #1F2937)',
                        border: '1px solid var(--card-border, #374151)',
                        color: '#FFF',
                        fontSize: '13px',
                      }}
                    />
                    {milestoneInputs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMilestoneInput(idx)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddMilestoneInput}
                  style={{
                    alignSelf: 'flex-start',
                    background: 'transparent',
                    border: 'none',
                    color: '#6366F1',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: '4px',
                  }}
                >
                  <Plus size={14} />
                  <span>Add Milestone</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                background: 'linear-gradient(90deg, #6366F1, #4F46E5)',
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
              <span>SAVE STRATEGIC GOAL</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
