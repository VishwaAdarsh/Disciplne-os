import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Flame, Clock, Play, MoreVertical, SkipForward, Copy, Trash2, Edit3, Target } from 'lucide-react';
import type { DisciplineTask } from '../types/discipline';
import { useDisciplineStore } from '../store/disciplineStore';

interface DisciplineTaskCardProps {
  task: DisciplineTask;
  onEdit: (task: DisciplineTask) => void;
}

export default function DisciplineTaskCard({ task, onEdit }: DisciplineTaskCardProps) {
  const { toggleTask, skipTask, duplicateTask, deleteTask, startFocusSession } = useDisciplineStore();
  const [showMenu, setShowMenu] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [skipReason, setSkipReason] = useState('');

  const priorityColors = {
    high: { bg: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', label: 'HIGH' },
    medium: { bg: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B', label: 'MED' },
    low: { bg: 'rgba(99, 102, 241, 0.12)', color: '#6366F1', label: 'LOW' },
  };

  const categoryMeta = {
    nonneg: { bg: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', label: 'MUST DO' },
    habit: { bg: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6', label: 'HABIT' },
    goal: { bg: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4', label: 'GOAL LINKED' },
  };

  const pMeta = priorityColors[task.priority] || priorityColors.medium;
  const cMeta = categoryMeta[task.category] || categoryMeta.nonneg;

  const handleConfirmSkip = () => {
    skipTask(task.id, skipReason || 'Skipped for today');
    setShowSkipModal(false);
    setSkipReason('');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        padding: '12px 14px',
        borderRadius: '14px',
        border: task.completed
          ? '1px solid rgba(16,185,129,0.3)'
          : task.skipped
          ? '1px solid rgba(245,158,11,0.3)'
          : '1px solid var(--card-border)',
        background: task.completed
          ? 'rgba(16,185,129,0.04)'
          : task.skipped
          ? 'rgba(245,158,11,0.04)'
          : 'var(--card-bg)',
        boxShadow: 'var(--card-shadow)',
        position: 'relative',
        transition: 'all 0.15s ease',
      }}
    >
      {/* Checkbox */}
      <div
        onClick={() => toggleTask(task.id)}
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          border: task.completed ? 'none' : `2px solid ${cMeta.color}`,
          background: task.completed ? '#10B981' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'all 0.15s ease',
        }}
      >
        {task.completed && <CheckCircle size={16} color="#FFFFFF" />}
      </div>

      {/* Task Content */}
      <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => toggleTask(task.id)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <span style={{ fontSize: '15px', flexShrink: 0 }}>{task.icon}</span>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: task.completed ? 'var(--text-muted)' : 'var(--text-main)',
              textDecoration: task.completed ? 'line-through' : 'none',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {task.title}
          </span>
        </div>

        {task.description && (
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {task.description}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 7px',
              borderRadius: '10px',
              background: cMeta.bg,
              color: cMeta.color,
            }}
          >
            {cMeta.label}
          </span>

          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 5px',
              borderRadius: '8px',
              background: pMeta.bg,
              color: pMeta.color,
            }}
          >
            {pMeta.label}
          </span>

          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Clock size={11} /> {task.timeSchedule} ({task.estimatedMinutes}m)
          </span>

          {task.goalTitle && (
            <span style={{ fontSize: '11px', color: '#06B6D4', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Target size={11} /> {task.goalTitle}
            </span>
          )}

          {task.streak > 0 && (
            <span className="font-sekuya text-gradient-streak" style={{ fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
              <Flame size={11} color="#F59E0B" /> {task.streak}d
            </span>
          )}

          <span style={{ fontSize: '10px', color: '#8B5CF6', fontWeight: 700 }}>
            +{task.xpReward} XP
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
        {/* Start Focus Session Action */}
        <button
          onClick={() => startFocusSession(task.title, task.estimatedMinutes)}
          title="Start Focus Timer"
          style={{
            background: 'rgba(99, 102, 241, 0.1)',
            color: '#6366F1',
            border: 'none',
            borderRadius: '8px',
            padding: '6px 9px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            whiteSpace: 'nowrap',
          }}
        >
          <Play size={12} />
          <span>Focus</span>
        </button>

        {/* More Options Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            <MoreVertical size={16} />
          </button>

          {showMenu && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                zIndex: 50,
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '10px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                padding: '6px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                minWidth: '130px',
              }}
            >
              <button
                onClick={() => {
                  onEdit(task);
                  setShowMenu(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-main)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Edit3 size={13} /> Edit
              </button>

              <button
                onClick={() => {
                  setShowSkipModal(true);
                  setShowMenu(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: 'transparent',
                  border: 'none',
                  color: '#F59E0B',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <SkipForward size={13} /> Skip Task
              </button>

              <button
                onClick={() => {
                  duplicateTask(task.id);
                  setShowMenu(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-main)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Copy size={13} /> Duplicate
              </button>

              <button
                onClick={() => {
                  deleteTask(task.id);
                  setShowMenu(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: 'transparent',
                  border: 'none',
                  color: '#EF4444',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Skip Task Reason Modal */}
      {showSkipModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setShowSkipModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '16px',
              padding: '20px',
              width: '360px',
              maxWidth: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
              Skip "{task.title}"
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Specify an optional reason for skipping today:
            </div>
            <input
              value={skipReason}
              onChange={(e) => setSkipReason(e.target.value)}
              placeholder="e.g. Travel, illness, rest day..."
              style={{
                width: '100%',
                background: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '13px',
                color: 'var(--text-main)',
                outline: 'none',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
              <button
                onClick={() => setShowSkipModal(false)}
                style={{
                  background: 'var(--input-bg)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSkip}
                style={{
                  background: '#F59E0B',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  color: '#FFF',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Confirm Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
