/**
 * TaskItemCard Component (SPR-307)
 */

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Flame, Archive, Trash2, Edit3 } from 'lucide-react';
import { DisciplineTask } from '../../types/discipline';

interface TaskItemCardProps {
  task: DisciplineTask;
  onToggle: (id: string) => void;
  onEdit?: (task: DisciplineTask) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const TaskItemCard: React.FC<TaskItemCardProps> = ({
  task,
  onToggle,
  onEdit,
  onArchive,
  onDelete,
}) => {
  const priorityColors: Record<string, { bg: string; text: string }> = {
    critical: { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444' },
    high: { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B' },
    medium: { bg: 'rgba(99, 102, 241, 0.15)', text: '#6366F1' },
    low: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10B981' },
  };

  const priorityStyle = priorityColors[task.priority] || priorityColors.medium;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '12px',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        opacity: task.completed ? 0.75 : 1,
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
        <button
          onClick={() => onToggle(task.id)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            color: task.completed ? '#10B981' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          {task.completed ? <CheckCircle2 size={22} color="#10B981" /> : <Circle size={22} />}
        </button>

        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-main)',
                textDecoration: task.completed ? 'line-through' : 'none',
              }}
            >
              {task.title}
            </span>

            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                padding: '2px 6px',
                borderRadius: '6px',
                background: priorityStyle.bg,
                color: priorityStyle.text,
              }}
            >
              {task.priority}
            </span>

            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: '6px',
                background: 'var(--input-bg)',
                color: 'var(--text-muted)',
              }}
            >
              {task.category}
            </span>
          </div>

          {task.description && (
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {task.description}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        {task.timeSchedule && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <Clock size={13} />
            <span>{task.timeSchedule}</span>
          </div>
        )}

        {task.streak > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontWeight: 700, color: '#F59E0B' }}>
            <Flame size={13} />
            <span>{task.streak}</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              title="Edit Task"
            >
              <Edit3 size={14} />
            </button>
          )}
          {onArchive && (
            <button
              onClick={() => onArchive(task.id)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              title="Archive Task"
            >
              <Archive size={14} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              title="Delete Task"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
