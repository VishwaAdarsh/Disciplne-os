/**
 * Custom Discipline Hook (SPR-307)
 */

import { useState, useMemo } from 'react';
import { useDisciplineStore } from '../store/disciplineStore';
import { DisciplineTask, DisciplineHabit, TaskCategory, TaskPriority } from '../types/discipline';

export function useDiscipline() {
  const store = useDisciplineStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'time' | 'category'>('time');
  const [habits, setHabits] = useState<DisciplineHabit[]>([
    {
      id: 'h-1',
      habitName: 'Hydration 3L Daily',
      description: 'Drink 500ml water upon waking + 2.5L throughout the day',
      category: 'Health',
      frequency: 'daily',
      targetDaysPerWeek: 7,
      streak: 18,
      completionRate: 95,
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'h-2',
      habitName: 'Read 20 Pages',
      description: 'Non-fiction or deep domain learning',
      category: 'Study',
      frequency: 'daily',
      targetDaysPerWeek: 7,
      streak: 12,
      completionRate: 85,
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'h-3',
      habitName: 'Cold Shower & Breathwork',
      description: 'Morning alertness routine',
      category: 'Fitness',
      frequency: 'weekdays',
      targetDaysPerWeek: 5,
      streak: 9,
      completionRate: 90,
      status: 'active',
      createdAt: new Date().toISOString(),
    },
  ]);

  // Combined Search & Multi-criteria Filtering
  const filteredTasks = useMemo(() => {
    return store.tasks.filter((task) => {
      // 1. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      // 2. Category Filter
      if (selectedCategory !== 'all') {
        if (task.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // 3. Priority Filter
      if (selectedPriority !== 'all') {
        if (task.priority.toLowerCase() !== selectedPriority.toLowerCase()) {
          return false;
        }
      }

      // 4. Status Filter
      if (selectedStatus === 'completed') {
        if (!task.completed) return false;
      } else if (selectedStatus === 'pending') {
        if (task.completed || task.isArchived) return false;
      } else if (selectedStatus === 'archived') {
        if (!task.isArchived) return false;
      } else if (selectedStatus === 'overdue') {
        if (task.completed) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
        return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      }
      if (sortBy === 'category') {
        return a.category.localeCompare(b.category);
      }
      return (a.timeSchedule || '').localeCompare(b.timeSchedule || '');
    });
  }, [store.tasks, searchQuery, selectedCategory, selectedPriority, selectedStatus, sortBy]);

  const handleAddHabit = (habitData: { habitName: string; category?: string; frequency?: any; targetDaysPerWeek?: number }) => {
    const newHabit: DisciplineHabit = {
      id: `habit-${Date.now()}`,
      habitName: habitData.habitName,
      category: habitData.category || 'Health',
      frequency: habitData.frequency || 'daily',
      targetDaysPerWeek: habitData.targetDaysPerWeek ?? 7,
      streak: 1,
      completionRate: 100,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    setHabits((prev) => [newHabit, ...prev]);
  };

  const handleToggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, streak: h.streak + 1 } : h))
    );
  };

  const handleDeleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  return {
    ...store,
    habits,
    searchQuery,
    selectedCategory,
    selectedPriority,
    selectedStatus,
    sortBy,
    filteredTasks,
    setSearchQuery,
    setSelectedCategory,
    setSelectedPriority,
    setSelectedStatus,
    setSortBy,
    handleAddHabit,
    handleToggleHabit,
    handleDeleteHabit,
  };
}
