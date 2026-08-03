import { useState } from 'react';
import { Target, CheckCircle2, Circle, Calendar, Pause, Play, Plus, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useGoalsStore } from '../../store/goalsStore';
import type { GoalItem } from '../../types/goals';
import HorizontalProgressBar from '../charts/HorizontalProgressBar';

interface Props {
  goal: GoalItem;
}

export default function GoalCard({ goal }: Props) {
  const { toggleMilestone, setGoalStatus, addMilestone, deleteGoal } = useGoalsStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [newMilestoneText, setNewMilestoneText] = useState('');
  const [isAddingM, setIsAddingM] = useState(false);

  const completedMilestones = goal.milestones.filter((m) => m.completed).length;
  const totalMilestones = goal.milestones.length;

  const handleAddMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMilestoneText.trim()) {
      addMilestone(goal.id, newMilestoneText.trim());
      setNewMilestoneText('');
      setIsAddingM(false);
    }
  };

  const getStatusColor = () => {
    switch (goal.status) {
      case 'Completed':
        return '#10B981';
      case 'Paused':
        return '#F59E0B';
      case 'Archived':
        return '#6B7280';
      default:
        return '#6366F1';
    }
  };

  return (
    <div
      style={{
        background: 'var(--card-bg, #111827)',
        border: `1px solid ${goal.status === 'Completed' ? 'rgba(16, 185, 129, 0.4)' : 'var(--card-border, #1F2937)'}`,
        borderRadius: 'var(--card-radius, 16px)',
        boxShadow: 'var(--card-shadow)',
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '16px',
      }}
    >
      <div>
        {/* HEADER BADGES */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#6366F1',
                background: 'rgba(99, 102, 241, 0.15)',
                padding: '2px 8px',
                borderRadius: '8px',
                textTransform: 'uppercase',
              }}
            >
              {goal.category === 'Custom' ? goal.customCategoryName || 'Custom' : goal.category}
            </span>

            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: getStatusColor(),
                background: `${getStatusColor()}22`,
                padding: '2px 8px',
                borderRadius: '8px',
                textTransform: 'uppercase',
              }}
            >
              {goal.status}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Priority: {goal.priority}</span>
            <button
              onClick={() => deleteGoal(goal.id)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
              title="Delete goal"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* TITLE & DESCRIPTION */}
        <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
          {goal.title}
        </div>
        {goal.description && (
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: '1.4' }}>
            {goal.description}
          </div>
        )}

        {/* PROGRESS BAR */}
        <HorizontalProgressBar
          label="Goal Completion Progress"
          current={goal.progressPercent}
          max={100}
          unit="%"
          color={getStatusColor()}
        />

        {/* METRICS SUMMARY */}
        <div
          style={{
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            marginTop: '12px',
            fontSize: '12px',
            color: 'var(--text-muted)',
            background: 'var(--surface-bg, rgba(255,255,255,0.02))',
            padding: '10px 12px',
            borderRadius: '10px',
            border: '1px solid var(--card-border, #1F2937)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Target size={14} color="#6366F1" />
            <span>
              <strong style={{ color: 'var(--text-main)' }}>{completedMilestones}</strong> / {totalMilestones} Milestones
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} color="#F59E0B" />
            <span>Deadline: <strong style={{ color: 'var(--text-main)' }}>{goal.deadline}</strong></span>
          </div>
        </div>
      </div>

      {/* MILESTONE CHECKLIST (TOGGLABLE) */}
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            color: '#6366F1',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 0',
          }}
        >
          <span>{isExpanded ? 'Hide Milestones' : `View ${totalMilestones} Milestones`}</span>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {isExpanded && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
            {goal.milestones.map((m) => (
              <div
                key={m.id}
                onClick={() => toggleMilestone(goal.id, m.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  background: m.completed ? 'rgba(16, 185, 129, 0.08)' : 'var(--surface-bg, rgba(255,255,255,0.03))',
                  border: `1px solid ${m.completed ? 'rgba(16, 185, 129, 0.2)' : 'var(--card-border, #1F2937)'}`,
                  cursor: 'pointer',
                }}
              >
                {m.completed ? <CheckCircle2 size={16} color="#10B981" /> : <Circle size={16} color="var(--text-muted)" />}
                <span
                  style={{
                    fontSize: '12px',
                    color: m.completed ? 'var(--text-muted)' : 'var(--text-main)',
                    textDecoration: m.completed ? 'line-through' : 'none',
                    flex: 1,
                  }}
                >
                  {m.title}
                </span>
                {m.dueDate && <span style={{ fontSize: '10px', color: '#F59E0B' }}>{m.dueDate}</span>}
              </div>
            ))}

            {isAddingM ? (
              <form onSubmit={handleAddMilestoneSubmit} style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                <input
                  type="text"
                  placeholder="New milestone title..."
                  value={newMilestoneText}
                  onChange={(e) => setNewMilestoneText(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: '6px',
                    background: 'var(--surface-bg, #1F2937)',
                    border: '1px solid #6366F1',
                    color: '#FFF',
                    fontSize: '12px',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    background: '#6366F1',
                    color: '#FFF',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Add
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsAddingM(true)}
                style={{
                  alignSelf: 'flex-start',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '11px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '4px',
                }}
              >
                <Plus size={12} />
                <span>Add Milestone</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* QUICK STATUS ACTIONS */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {goal.status === 'Active' ? (
          <button
            onClick={() => setGoalStatus(goal.id, 'Paused')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#F59E0B',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}
          >
            <Pause size={14} />
            <span>Pause</span>
          </button>
        ) : (
          <button
            onClick={() => setGoalStatus(goal.id, 'Active')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#6366F1',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}
          >
            <Play size={14} />
            <span>Resume</span>
          </button>
        )}

        {goal.status !== 'Completed' && (
          <button
            onClick={() => setGoalStatus(goal.id, 'Completed')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              background: 'linear-gradient(90deg, #10B981, #059669)',
              color: '#FFF',
              border: 'none',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}
          >
            <CheckCircle2 size={14} />
            <span>Mark Done</span>
          </button>
        )}
      </div>
    </div>
  );
}
