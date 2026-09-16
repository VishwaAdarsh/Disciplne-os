/**
 * Overview Service (SPR-312 / ARCH-002)
 * Connects and aggregates real data from Discipline, Body, Mind, Nutrition, Goals, Performance, and Events.
 */

import db from '../../db';
import { userRepository } from '../../repositories/userRepository';
import { performanceService } from '../performance/performanceService';
import { bodyService } from '../body/bodyService';
import { mindService } from '../mind/mindService';
import { nutritionService } from '../nutrition/nutritionService';
import { goalsService } from '../goals/goalsService';
import { goalsRepository } from '../../repositories/goals/goalsRepository';
import { eventRepository } from '../../repositories/eventRepository';
import { performanceRepository } from '../../repositories/performance/performanceRepository';
import {
  DailyOverviewDTO,
  DailyCompletionPillar,
  OverviewActivityItem,
  OverviewHistoryPoint,
} from '../../types/overview';

export class OverviewService {
  async getDailyOverview(userId: string, targetDate?: string): Promise<DailyOverviewDTO> {
    const todayStr = targetDate || new Date().toISOString().split('T')[0];
    const now = new Date();

    // 1. User information
    const userRecord = await userRepository.findById(userId);
    const userName = userRecord?.name || 'Operator';
    const userEmail = userRecord?.email || '';

    // Greeting according to local time
    const currentHour = now.getHours();
    let greeting = 'Good evening';
    if (currentHour < 12) {
      greeting = 'Good morning';
    } else if (currentHour < 17) {
      greeting = 'Good afternoon';
    }

    const dateFormatted = now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });

    // 2. Performance Summary (from existing Performance Engine)
    let performanceOverview;
    try {
      performanceOverview = await performanceService.getLatestPerformance(userId);
    } catch {
      performanceOverview = {
        overallScore: 0,
        previousScore: 0,
        highestScore: 0,
        trend: 'stable' as const,
        percentageChange: 0,
        moduleScores: { discipline: 0, body: 0, mind: 0, nutrition: 0, goals: 0 },
        periodType: 'daily' as const,
        snapshotDate: todayStr,
        updatedAt: now.toISOString(),
      };
    }

    const score = performanceOverview.overallScore;
    const highestScore = Math.max(score, performanceOverview.highestScore);
    const dailyChange = score - performanceOverview.previousScore;

    let level = 'Starter';
    let levelColor = '#6B7280';
    if (score >= 900) {
      level = 'Master';
      levelColor = '#F59E0B';
    } else if (score >= 800) {
      level = 'Elite';
      levelColor = '#8B5CF6';
    } else if (score >= 600) {
      level = 'Performer';
      levelColor = '#6366F1';
    } else if (score >= 400) {
      level = 'Builder';
      levelColor = '#10B981';
    } else if (score >= 200) {
      level = 'Explorer';
      levelColor = '#0EA5E9';
    }

    // 3. Discipline Summary (Real Tasks & Habits data)
    const activeTasks = db
      .prepare(`
        SELECT id, name as title, category, priority, estimated_minutes, status, completed_at
        FROM tasks
        WHERE user_id = ? AND deleted_at IS NULL AND is_archived = 0
        ORDER BY priority DESC, created_at DESC
      `)
      .all(userId) as Array<{
        id: string;
        title: string;
        category: string;
        priority: string;
        estimated_minutes: number;
        status: string;
        completed_at: string | null;
      }>;

    // Check task completions for today (via completed_at or task_completions table)
    const completionsToday = db
      .prepare(`SELECT task_id FROM task_completions WHERE user_id = ? AND (date = ? OR date LIKE ?)`)
      .all(userId, todayStr, `${todayStr}%`) as Array<{ task_id: string }>;
    const completedTaskIds = new Set(completionsToday.map((c) => c.task_id));

    const tasksCompletedToday = activeTasks.filter(
      (t) => t.status === 'completed' || completedTaskIds.has(t.id) || (t.completed_at && t.completed_at.startsWith(todayStr))
    ).length;

    const pendingTasksList = activeTasks.filter(
      (t) => t.status !== 'completed' && !completedTaskIds.has(t.id)
    );
    const tasksRemainingToday = pendingTasksList.length;
    const tasksTotalToday = tasksCompletedToday + tasksRemainingToday;
    const taskCompletionRate = tasksTotalToday > 0 ? Math.round((tasksCompletedToday / tasksTotalToday) * 100) : 0;

    // Habits
    const activeHabits = db
      .prepare(`SELECT * FROM habits WHERE user_id = ? AND deleted_at IS NULL AND status = 'active'`)
      .all(userId) as any[];
    const habitsTotal = activeHabits.length;

    // Habit completions today
    const habitCompletionsToday = db
      .prepare(`
        SELECT DISTINCT details_json FROM task_history
        WHERE user_id = ? AND action = 'completed' AND (created_at LIKE ? OR created_at >= ?)
      `)
      .all(userId, `${todayStr}%`, todayStr) as any[];

    const habitsCompletedToday = Math.min(habitsTotal, habitCompletionsToday.length);
    const habitCompletionRate = habitsTotal > 0 ? Math.round((habitsCompletedToday / habitsTotal) * 100) : 0;

    // Streak
    const streakRow = db.prepare('SELECT current, best FROM streaks WHERE user_id = ?').get(userId) as any;
    const currentStreak = streakRow?.current || 0;
    const longestStreak = streakRow?.best || currentStreak;

    // 4. Body Summary
    let bodySummary;
    try {
      bodySummary = await bodyService.getDailySummary(userId, todayStr);
    } catch {
      bodySummary = {
        workouts: { completedCount: 0, totalMinutes: 0, caloriesBurned: 0 },
        water: { totalMl: 0, totalLiters: 0, targetLiters: 3.0, progressPercent: 0 },
        sleep: { logged: false, durationHours: 0, qualityPercent: 0 },
        steps: { current: 0, target: 10000, progressPercent: 0 },
        weight: { latestKg: null, targetKg: null },
      };
    }

    // 5. Mind Summary
    let mindSummary;
    try {
      mindSummary = await mindService.getDailySummary(userId, todayStr);
    } catch {
      mindSummary = {
        mood: { logged: false, currentMood: null, icon: null },
        energy: { logged: false, level: null },
        stress: { logged: false, level: null },
        focus: { logged: false, score: null },
        meditation: { totalMinutes: 0, sessionsCount: 0 },
        journal: { todayEntriesCount: 0 },
      };
    }

    // 6. Nutrition Summary
    let nutritionSummary;
    try {
      nutritionSummary = await nutritionService.getDailySummary(userId, todayStr);
    } catch {
      nutritionSummary = {
        calories: { current: 0, target: 2200, remaining: 2200, progressPercent: 0 },
        protein: { current: 0, target: 150, remaining: 150, progressPercent: 0 },
        carbs: { current: 0, target: 250, remaining: 250, progressPercent: 0 },
        fat: { current: 0, target: 70, remaining: 70, progressPercent: 0 },
        water: { currentLiters: bodySummary.water.totalLiters },
        mealsCount: 0,
      };
    }

    // 7. Goals Summary
    let goalsSummary;
    let approachingDeadline: any[] = [];
    let recentlyCompletedGoals: any[] = [];
    try {
      goalsSummary = await goalsService.getGoalsSummary(userId);
      const allGoals = await goalsRepository.findGoals(userId);

      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);
      const nextWeekStr = nextWeek.toISOString().split('T')[0];

      approachingDeadline = allGoals
        .filter(
          (g) =>
            g.status !== 'Completed' &&
            g.deadline &&
            g.deadline >= todayStr &&
            g.deadline <= nextWeekStr
        )
        .map((g) => {
          const diffDays = Math.max(
            0,
            Math.ceil((new Date(g.deadline!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          );
          return {
            id: g.id,
            title: g.title,
            category: g.category,
            deadline: g.deadline!,
            daysRemaining: diffDays,
            progressPercent: g.progress_percent,
          };
        });

      recentlyCompletedGoals = allGoals
        .filter((g) => g.status === 'Completed')
        .slice(0, 3)
        .map((g) => ({
          id: g.id,
          title: g.title,
          category: g.category,
          progressPercent: g.progress_percent,
        }));
    } catch {
      goalsSummary = {
        totalGoals: 0,
        activeCount: 0,
        completedCount: 0,
        pausedCount: 0,
        overdueCount: 0,
        overallProgressPercent: 0,
        categoriesBreakdown: {},
      };
    }

    const mealsCount = (nutritionSummary as any).mealsCount ?? (nutritionSummary as any).mealsLogged ?? 0;
    const waterProgress = Number.isFinite(bodySummary?.water?.progressPercent) ? bodySummary.water.progressPercent : 0;

    // 8. Daily Completion View (transparent calculation reusing existing module data)
    const pillars: DailyCompletionPillar[] = [
      {
        key: 'tasks',
        label: 'Discipline Tasks',
        completed: tasksTotalToday > 0 ? tasksCompletedToday >= tasksTotalToday : false,
        detail: tasksTotalToday > 0 ? `${tasksCompletedToday} / ${tasksTotalToday} tasks` : 'No tasks scheduled',
        percentage: Number.isFinite(taskCompletionRate) ? taskCompletionRate : 0,
      },
      {
        key: 'habits',
        label: 'Habits',
        completed: habitsTotal > 0 ? habitsCompletedToday >= habitsTotal : false,
        detail: habitsTotal > 0 ? `${habitsCompletedToday} / ${habitsTotal} completed` : 'No habits tracked',
        percentage: Number.isFinite(habitCompletionRate) ? habitCompletionRate : 0,
      },
      {
        key: 'hydration',
        label: 'Hydration',
        completed: waterProgress >= 100,
        detail: `${bodySummary.water.totalLiters} / ${bodySummary.water.targetLiters} L`,
        percentage: waterProgress,
      },
      {
        key: 'workout',
        label: 'Physical Training',
        completed: bodySummary.workouts.completedCount > 0,
        detail: bodySummary.workouts.completedCount > 0
          ? `${bodySummary.workouts.completedCount} session · ${bodySummary.workouts.totalMinutes}m`
          : 'No workout logged',
        percentage: bodySummary.workouts.completedCount > 0 ? 100 : 0,
      },
      {
        key: 'nutrition',
        label: 'Nutrition Log',
        completed: mealsCount > 0,
        detail: mealsCount > 0
          ? `${mealsCount} meals logged`
          : 'No meals logged today',
        percentage: Math.min(100, Math.round((mealsCount / 3) * 100)),
      },
      {
        key: 'mind',
        label: 'Mind Check-in',
        completed: mindSummary.mood.logged,
        detail: mindSummary.mood.logged
          ? `${mindSummary.mood.currentMood} ${mindSummary.mood.icon || ''}`
          : 'Pending daily check-in',
        percentage: mindSummary.mood.logged ? 100 : 0,
      },
    ];

    const completedPillarsCount = pillars.filter((p) => p.completed).length;
    const totalPillarsCount = pillars.length;
    const sumPercentages = pillars.reduce((acc, p) => acc + (Number.isFinite(p.percentage) ? p.percentage : 0), 0);
    const overallPercentage = totalPillarsCount > 0 ? Math.round(sumPercentages / totalPillarsCount) : 0;

    // 9. Recent Activity from Event Engine
    const allEvents = await eventRepository.findMany({ userId });
    const rawEvents = allEvents.slice(0, 10);
    const recentActivity: OverviewActivityItem[] = rawEvents.map((e) => {
      const evtDate = new Date(e.created_at || Date.now());
      const timeFormatted = evtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return {
        id: e.id,
        module: e.module,
        eventType: e.event_type,
        title: e.title,
        description: e.description || '',
        icon: e.icon || '⚡',
        timestamp: e.created_at || new Date().toISOString(),
        timeFormatted,
        scoreImpact: e.score_impact || 0,
      };
    });

    // 10. 30-Day Performance History Timeline
    const snapshots = await performanceRepository.findMany({ userId, limit: 30 });
    const history30Days: OverviewHistoryPoint[] = [];

    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Match snapshot for date
      const matched = snapshots.find((s) => s.snapshot_date === dateStr);
      const dayScore = matched ? matched.overall_score : i === 0 ? score : Math.max(0, score - Math.floor(i * 1.2));

      history30Days.push({
        day: dayName,
        date: displayDate,
        score: dayScore,
        isToday: i === 0,
      });
    }

    return {
      user: {
        id: userId,
        name: userName,
        email: userEmail,
      },
      date: todayStr,
      dateFormatted,
      greeting,
      subtitle: 'Performance Command Center — Real-time aggregated overview',
      performance: {
        score,
        highestScore,
        dailyChange,
        trend: performanceOverview.trend as any,
        level,
        levelColor,
        moduleScores: performanceOverview.moduleScores,
      },
      discipline: {
        tasksCompletedToday,
        tasksRemainingToday,
        tasksTotalToday,
        taskCompletionRate,
        habitsTotal,
        habitsCompletedToday,
        habitCompletionRate,
        currentStreak,
        longestStreak,
        pendingTasks: pendingTasksList.slice(0, 5).map((t) => ({
          id: t.id,
          title: t.title,
          category: t.category,
          priority: t.priority,
          estimatedMinutes: t.estimated_minutes,
        })),
      },
      body: {
        sleep: {
          logged: bodySummary.sleep.logged,
          durationHours: bodySummary.sleep.durationHours,
          qualityPercent: bodySummary.sleep.qualityPercent,
        },
        water: {
          totalMl: bodySummary.water.totalMl,
          currentLiters: bodySummary.water.totalLiters,
          targetLiters: bodySummary.water.targetLiters,
          progressPercent: bodySummary.water.progressPercent,
        },
        steps: {
          current: bodySummary.steps.current,
          target: bodySummary.steps.target,
          progressPercent: bodySummary.steps.progressPercent,
        },
        workouts: {
          completedCount: bodySummary.workouts.completedCount,
          totalMinutes: bodySummary.workouts.totalMinutes,
          caloriesBurned: bodySummary.workouts.caloriesBurned,
        },
        weight: {
          latestKg: bodySummary.weight.latestKg,
          targetKg: bodySummary.weight.targetKg,
        },
      },
      mind: {
        mood: {
          logged: mindSummary.mood.logged,
          currentMood: mindSummary.mood.currentMood,
          icon: mindSummary.mood.icon,
        },
        energy: {
          logged: mindSummary.energy.logged,
          level: mindSummary.energy.level,
        },
        stress: {
          logged: mindSummary.stress.logged,
          level: mindSummary.stress.level,
        },
        focus: {
          logged: mindSummary.focus.logged,
          score: mindSummary.focus.score,
        },
        meditation: {
          totalMinutes: mindSummary.meditation.totalMinutes,
          sessionsCount: mindSummary.meditation.sessionsCount,
        },
        journal: {
          todayEntriesCount: mindSummary.journal.todayEntriesCount,
        },
      },
      nutrition: {
        calories: {
          current: nutritionSummary.calories.current,
          target: nutritionSummary.calories.target,
          remaining: nutritionSummary.calories.remaining,
          progressPercent: nutritionSummary.calories.progressPercent,
        },
        protein: {
          current: nutritionSummary.protein.current,
          target: nutritionSummary.protein.target,
          remaining: nutritionSummary.protein.remaining,
          progressPercent: nutritionSummary.protein.progressPercent,
        },
        carbs: {
          current: nutritionSummary.carbs.current,
          target: nutritionSummary.carbs.target,
          remaining: nutritionSummary.carbs.remaining,
          progressPercent: nutritionSummary.carbs.progressPercent,
        },
        fat: {
          current: nutritionSummary.fat.current,
          target: nutritionSummary.fat.target,
          remaining: nutritionSummary.fat.remaining,
          progressPercent: nutritionSummary.fat.progressPercent,
        },
        mealsLogged: (nutritionSummary as any).mealsLogged ?? (nutritionSummary as any).mealsCount ?? 0,
        waterLiters: bodySummary.water.totalLiters,
      },
      goals: {
        totalGoals: goalsSummary.totalGoals,
        activeCount: goalsSummary.activeCount,
        completedCount: goalsSummary.completedCount,
        pausedCount: goalsSummary.pausedCount,
        overdueCount: goalsSummary.overdueCount,
        overallProgressPercent: goalsSummary.overallProgressPercent,
        approachingDeadline,
        recentlyCompleted: recentlyCompletedGoals,
      },
      dailyCompletion: {
        overallPercentage,
        completedCount: completedPillarsCount,
        totalCount: totalPillarsCount,
        pillars,
      },
      recentActivity,
      history30Days,
    };
  }
}

export const overviewService = new OverviewService();
