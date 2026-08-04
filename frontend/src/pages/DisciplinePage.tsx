/**
 * Discipline Page (SPR-307)
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Plus,
  Zap,
  Sparkles,
  X,
  Flame,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DeepWorkTimerCard from '../components/DeepWorkTimerCard';
import LevelProgressCard from '../components/LevelProgressCard';
import DisciplineAnalyticsCard from '../components/DisciplineAnalyticsCard';
import { TaskItemCard } from '../components/discipline/TaskItemCard';
import { HabitItemCard } from '../components/discipline/HabitItemCard';
import { DisciplineFiltersBar } from '../components/discipline/DisciplineFiltersBar';
import { TaskModal } from '../components/discipline/TaskModal';
import { HabitModal } from '../components/discipline/HabitModal';
import { useDiscipline } from '../hooks/useDiscipline';
import type { DisciplineTask } from '../types/discipline';

export default function DisciplinePage() {
  const {
    tasks,
    habits,
    levelInfo,
    analytics,
    activeTab,
    notificationToast,
    searchQuery,
    selectedCategory,
    selectedPriority,
    selectedStatus,
    sortBy,
    filteredTasks,
    setActiveTab,
    dismissNotification,
    toggleTask,
    addTask,
    editTask,
    deleteTask,
    setSearchQuery,
    setSelectedCategory,
    setSelectedPriority,
    setSelectedStatus,
    setSortBy,
    handleAddHabit,
    handleToggleHabit,
    handleDeleteHabit,
  } = useDiscipline();

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [habitModalOpen, setHabitModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<DisciplineTask | null>(null);

  // Groupings & Progress calculations
  const totalTasks = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  const remainingMins = tasks
    .filter((t) => !t.completed)
    .reduce((acc, t) => acc + (t.estimatedMinutes || 30), 0);

  const handleOpenCreateTask = () => {
    setTaskToEdit(null);
    setTaskModalOpen(true);
  };

  const handleOpenEditTask = (task: DisciplineTask) => {
    setTaskToEdit(task);
    setTaskModalOpen(true);
  };

  const handleSaveTask = (taskData: Partial<DisciplineTask>) => {
    if (taskToEdit) {
      editTask(taskToEdit.id, taskData);
    } else {
      addTask(taskData as any);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', position: 'relative' }}>
      {/* NOTIFICATION TOAST BANNER */}
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

      {/* 1. MODULE HEADER & SUB-NAVIGATION */}
      <PageHeader
        title="Discipline Engine"
        subtitle="Task management, recurring habits, daily planner, search & performance integration."
        categories={['Overview', 'Tasks & Planner', 'Habits Stack', 'Deep Work', 'Analytics']}
        activeCategory={
          activeTab === 'overview'
            ? 'Overview'
            : activeTab === 'nonneg'
              ? 'Tasks & Planner'
              : activeTab === 'habits'
                ? 'Habits Stack'
                : activeTab === 'deepwork'
                  ? 'Deep Work'
                  : 'Analytics'
        }
        onSelectCategory={(cat) => {
          const tabMap: Record<string, any> = {
            Overview: 'overview',
            'Tasks & Planner': 'nonneg',
            'Habits Stack': 'habits',
            'Deep Work': 'deepwork',
            Analytics: 'analytics',
          };
          setActiveTab(tabMap[cat] || 'overview');
        }}
        actionRight={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setHabitModalOpen(true)}
              style={{
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#F59E0B',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '10px',
                padding: '8px 12px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
              }}
            >
              <Flame size={16} />
              <span>New Habit</span>
            </button>

            <button
              onClick={handleOpenCreateTask}
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
          </div>
        }
      />

      {/* 2. TODAY'S EXECUTION PROGRESS CARD */}
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
              Daily Planner Completion
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--text-muted)' }}>
              Completed: <strong style={{ color: '#10B981' }}>{completedCount} / {totalTasks}</strong> ({progressPct}%)
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              Est. Remaining: <strong style={{ color: '#6366F1' }}>{remainingMins} min</strong>
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

      {/* LEVEL & XP PROGRESSION CARD */}
      <LevelProgressCard levelInfo={levelInfo} />

      {/* TAB CONTENT CONDITIONAL RENDERING */}
      {activeTab === 'deepwork' ? (
        <DeepWorkTimerCard />
      ) : activeTab === 'analytics' ? (
        <DisciplineAnalyticsCard analytics={analytics} />
      ) : activeTab === 'habits' ? (
        /* HABITS STACK VIEW */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="font-sekuya" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              Recurring Habits Stack
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{habits.length} habits active</span>
          </div>

          {habits.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {habits.map((habit) => (
                <HabitItemCard key={habit.id} habit={habit} onToggle={handleToggleHabit} onDelete={handleDeleteHabit} />
              ))}
            </div>
          ) : (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No habits created yet. Click "New Habit" to start building a streak!
            </div>
          )}
        </div>
      ) : (
        /* MAIN TASKS & DAILY PLANNER VIEW */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Multi-Criteria Filters & Search Bar */}
          <DisciplineFiltersBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedPriority={selectedPriority}
            onPriorityChange={setSelectedPriority}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {/* Task Cards List */}
          {filteredTasks.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <AnimatePresence>
                {filteredTasks.map((task) => (
                  <TaskItemCard
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onEdit={handleOpenEditTask}
                    onDelete={deleteTask}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            /* Empty State */
            <div
              style={{
                background: 'var(--card-bg)',
                border: '1px dashed var(--card-border)',
                borderRadius: 'var(--card-radius, 16px)',
                padding: '36px 16px',
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
                No tasks match your filter parameters
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '300px' }}>
                Try adjusting your search criteria or create a new task.
              </div>
              <button
                onClick={handleOpenCreateTask}
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
                Create Task
              </button>
            </div>
          )}
        </div>
      )}

      {/* CREATE / EDIT TASK MODAL */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />

      {/* CREATE HABIT MODAL */}
      <HabitModal
        isOpen={habitModalOpen}
        onClose={() => setHabitModalOpen(false)}
        onSave={handleAddHabit}
      />
    </div>
  );
}
