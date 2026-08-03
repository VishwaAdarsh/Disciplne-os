import { useState, useEffect } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import type { DisciplineTask, TaskCategory, TaskPriority } from '../types/discipline';
import { useDisciplineStore } from '../store/disciplineStore';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: DisciplineTask | null;
}

export default function CreateTaskModal({ isOpen, onClose, taskToEdit }: CreateTaskModalProps) {
  const { addTask, editTask } = useDisciplineStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('nonneg');
  const [priority, setPriority] = useState<TaskPriority>('high');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [timeSchedule, setTimeSchedule] = useState('08:00 AM');
  const [goalTitle, setGoalTitle] = useState('');
  const [icon, setIcon] = useState('⚡');
  const [xpReward, setXpReward] = useState(20);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setCategory(taskToEdit.category);
      setPriority(taskToEdit.priority);
      setEstimatedMinutes(taskToEdit.estimatedMinutes);
      setTimeSchedule(taskToEdit.timeSchedule);
      setGoalTitle(taskToEdit.goalTitle || '');
      setIcon(taskToEdit.icon || '⚡');
      setXpReward(taskToEdit.xpReward || 20);
    } else {
      setTitle('');
      setDescription('');
      setCategory('nonneg');
      setPriority('high');
      setEstimatedMinutes(30);
      setTimeSchedule('08:00 AM');
      setGoalTitle('');
      setIcon('⚡');
      setXpReward(20);
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (taskToEdit) {
      editTask(taskToEdit.id, {
        title,
        description,
        category,
        priority,
        estimatedMinutes,
        timeSchedule,
        goalTitle: goalTitle || undefined,
        icon,
        xpReward,
      });
    } else {
      addTask({
        title,
        description,
        category,
        priority,
        estimatedMinutes,
        timeSchedule,
        goalTitle: goalTitle || undefined,
        icon,
        color: category === 'nonneg' ? '#F59E0B' : category === 'habit' ? '#8B5CF6' : '#06B6D4',
        xpReward,
      });
    }
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '18px',
          padding: '24px',
          width: '460px',
          maxWidth: '100%',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#6366F1" />
            <h2 className="font-sekuya" style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
              {taskToEdit ? 'Edit Task' : 'Create Task Commitment'}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Title
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Morning Routine, Deep Work Block..."
              style={{
                width: '100%',
                background: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                borderRadius: '8px',
                padding: '10px 12px',
                fontSize: '14px',
                color: 'var(--text-main)',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Description
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Specific execution criteria..."
              style={{
                width: '100%',
                background: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                borderRadius: '8px',
                padding: '10px 12px',
                fontSize: '13px',
                color: 'var(--text-main)',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                style={{
                  width: '100%',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--input-border)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  fontSize: '13px',
                  color: 'var(--text-main)',
                  outline: 'none',
                }}
              >
                <option value="nonneg">Non-Negotiable (Must Do)</option>
                <option value="habit">Habit (Routine)</option>
                <option value="goal">Goal-Linked Task</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                style={{
                  width: '100%',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--input-border)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  fontSize: '13px',
                  color: 'var(--text-main)',
                  outline: 'none',
                }}
              >
                <option value="high">High Priority (+40 XP)</option>
                <option value="medium">Medium Priority (+20 XP)</option>
                <option value="low">Low Priority (+10 XP)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Icon
              </label>
              <input
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--input-border)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  fontSize: '14px',
                  textAlign: 'center',
                  color: 'var(--text-main)',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Duration (m)
              </label>
              <input
                type="number"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                style={{
                  width: '100%',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--input-border)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  fontSize: '13px',
                  color: 'var(--text-main)',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Schedule
              </label>
              <input
                value={timeSchedule}
                onChange={(e) => setTimeSchedule(e.target.value)}
                placeholder="09:00 AM"
                style={{
                  width: '100%',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--input-border)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  fontSize: '13px',
                  color: 'var(--text-main)',
                }}
              />
            </div>
          </div>

          {category === 'goal' && (
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Linked Goal Title
              </label>
              <input
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                placeholder="e.g. Learn Python Mastery"
                style={{
                  width: '100%',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--input-border)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  fontSize: '13px',
                  color: 'var(--text-main)',
                }}
              />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '8px',
                padding: '10px 16px',
                fontSize: '13px',
                color: 'var(--text-muted)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={{
                background: '#6366F1',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '13px',
                color: '#FFF',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Plus size={16} />
              <span>{taskToEdit ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
