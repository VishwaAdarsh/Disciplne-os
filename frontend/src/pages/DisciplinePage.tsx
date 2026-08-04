import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Plus,
  Zap,
  Sparkles,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DeepWorkTimerCard from '../components/DeepWorkTimerCard';
import LevelProgressCard from '../components/LevelProgressCard';
import DisciplineTaskCard from '../components/DisciplineTaskCard';
import CreateTaskModal from '../components/CreateTaskModal';
import DisciplineAnalyticsCard from '../components/DisciplineAnalyticsCard';
import { useDisciplineStore } from '../store/disciplineStore';
import type { DisciplineTask } from '../types/discipline';

export default function DisciplinePage() {
  const {
    tasks,
    levelInfo,
    analytics,
    activeTab,
    activeFilter,
    notificationToast,
    setActiveTab,
    setActiveFilter,
    dismissNotification,
  } = useDisciplineStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<DisciplineTask | null>(null);

  // Groupings & Progress calculations
  const nonnegTasks = tasks.filter((t) => t.category === 'nonneg');
  const nonnegDone = nonnegTasks.filter((t) => t.completed).length;
  const nonnegTotal = nonnegTasks.length;
  const progressPct = nonnegTotal > 0 ? Math.round((nonnegDone / nonnegTotal) * 100) : 0;

  const remainingTasks = tasks.filter((t) => !t.completed && !t.skipped);
  const totalRemainingMins = remainingTasks.reduce((acc, t) => acc + t.estimatedMinutes, 0);

  // Filter tasks based on active category filter
  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === 'all') return true;
    return t.category === activeFilter;
  });

  const handleEditClick = (task: DisciplineTask) => {
    setTaskToEdit(task);
    setModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setTaskToEdit(null);
    setModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', position: 'relative' }}>
      {/* NOTIFICATION TOAST BANNER (PRD Section 18) */}
      <AnimatePresence>
        {notificationToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'fixed',
              top: '16px',
              right: '16px',
              left: '16px',
              maxWidth: '480px',
              marginLeft: 'auto',
              marginRight: 'auto',
              zIndex: 110,
              background: 'linear-gradient(135deg, #6366F1, #7C3AED)',
              color: '#FFFFFF',
              borderRadius: '12px',
              padding: '10px 14px',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
              <Sparkles size={16} color="#FFF" style={{ flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{notificationToast}</span>
            </div>
            <button
              onClick={dismissNotification}
              style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. MODULE HEADER & SUB-NAVIGATION (PRD Section 4) */}
      <PageHeader
        title="Discipline Engine"
        subtitle="Structured execution, Non-Negotiables, Habits, Deep Work, and XP progression."
        categories={['Overview', 'Non-Negotiables', 'Habits', 'Deep Work', 'Analytics', 'History']}
        activeCategory={
          activeTab === 'overview'
            ? 'Overview'
            : activeTab === 'nonneg'
              ? 'Non-Negotiables'
              : activeTab === 'habits'
                ? 'Habits'
                : activeTab === 'deepwork'
                  ? 'Deep Work'
                  : activeTab === 'analytics'
                    ? 'Analytics'
                    : 'History'
        }
        onSelectCategory={(cat) => {
          const tabMap: Record<string, any> = {
            Overview: 'overview',
            'Non-Negotiables': 'nonneg',
            Habits: 'habits',
            'Deep Work': 'deepwork',
            Analytics: 'analytics',
            History: 'history',
          };
          setActiveTab(tabMap[cat] || 'overview');
        }}
        actionRight={
          <button
            onClick={handleOpenCreateModal}
            style={{
              background: '#6366F1',
              color: '#FFF',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
              whiteSpace: 'nowrap',
            }}
          >
            <Plus size={16} />
            <span>New Task</span>
          </button>
        }
      />

      {/* 2. TODAY'S EXECUTION STICKY PROGRESS BAR (PRD Section 7 & 10) */}
      <div
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: 'var(--card-radius, 16px)',
          boxShadow: 'var(--card-shadow)',
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="#F59E0B" />
            <span className="font-sekuya" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
              Today's Execution
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--text-muted)' }}>
              Completed: <strong style={{ color: '#10B981' }}>{nonnegDone} / {nonnegTotal}</strong> ({progressPct}%)
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              Left: <strong style={{ color: '#6366F1' }}>{totalRemainingMins} min</strong>
            </span>
          </div>
        </div>

        {/* Dynamic Progress Line */}
        <div style={{ width: '100%', height: '8px', background: 'var(--card-border)', borderRadius: '6px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${progressPct}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #10B981, #14B8A6)',
              borderRadius: '6px',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* LEVEL & XP PROGRESSION CARD (PRD Section 13 & 14) */}
      <LevelProgressCard levelInfo={levelInfo} />

      {/* TAB CONTENT CONDITIONAL RENDERING */}
      {activeTab === 'deepwork' ? (
        <DeepWorkTimerCard />
      ) : activeTab === 'analytics' ? (
        <DisciplineAnalyticsCard analytics={analytics} />
      ) : activeTab === 'history' ? (
        /* TASK HISTORY VIEW (PRD Section 16) */
        <div
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: 'var(--card-radius, 16px)',
            boxShadow: 'var(--card-shadow)',
            padding: '18px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
            <h2 className="font-sekuya" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              Execution Task History
            </h2>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Filterable Date Range Logs</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tasks.map((task) => (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--input-border)',
                  fontSize: '13px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                  <span style={{ fontSize: '16px', flexShrink: 0 }}>{task.icon}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{task.timeSchedule}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  {task.completed ? (
                    <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={13} /> Completed
                    </span>
                  ) : task.skipped ? (
                    <span style={{ fontSize: '11px', color: '#F59E0B', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={13} /> Skipped ({task.skipReason})
                    </span>
                  ) : (
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* MAIN TASKS DASHBOARD VIEW (PRD Section 5 & 8) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Deep Work Focus Card Launcher */}
          <DeepWorkTimerCard />

          {/* Task Category Filter Tabs - Mobile Touch Scrollable */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div
              className="no-scrollbar"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'var(--input-bg)',
                padding: '4px',
                borderRadius: '12px',
                overflowX: 'auto',
                maxWidth: '100%',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {(
                [
                  { key: 'all', label: 'All Tasks' },
                  { key: 'nonneg', label: 'Non-Negotiables' },
                  { key: 'habit', label: 'Habits Stack' },
                  { key: 'goal', label: 'Goal-Linked' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  style={{
                    background: activeFilter === tab.key ? '#6366F1' : 'transparent',
                    color: activeFilter === tab.key ? '#FFFFFF' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
              Showing {filteredTasks.length} tasks
            </span>
          </div>

          {/* Task Cards List */}
          {filteredTasks.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <AnimatePresence>
                {filteredTasks.map((task) => (
                  <DisciplineTaskCard key={task.id} task={task} onEdit={handleEditClick} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            /* Empty Task State (PRD Section 20) */
            <div
              style={{
                background: 'var(--card-bg)',
                border: '1px dashed var(--card-border)',
                borderRadius: 'var(--card-radius, 16px)',
                padding: '32px 16px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'rgba(99,102,241,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Zap size={22} color="#6366F1" />
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                No Non-Negotiables created
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '300px' }}>
                Create your first structured daily commitment to protect your streak.
              </div>
              <button
                onClick={handleOpenCreateModal}
                style={{
                  background: '#6366F1',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '9px 16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginTop: '4px',
                }}
              >
                Create First Commitment
              </button>
            </div>
          )}
        </div>
      )}

      {/* CREATE / EDIT TASK MODAL */}
      <CreateTaskModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setTaskToEdit(null);
        }}
        taskToEdit={taskToEdit}
      />
    </div>
  );
}
