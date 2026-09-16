/**
 * AI Context Builder Service (SPR-314 / ARCH-006)
 * Assembles compact, structured, and privacy-sanitized telemetry from DisciplineOS core modules.
 */

import db from '../../db';
import { userRepository } from '../../repositories/userRepository';
import { performanceService } from '../performance/performanceService';
import { bodyService } from '../body/bodyService';
import { mindService } from '../mind/mindService';
import { nutritionService } from '../nutrition/nutritionService';
import { goalsRepository } from '../../repositories/goals/goalsRepository';
import { eventRepository } from '../../repositories/eventRepository';
import type { AIContextTelemetry } from '../../types/ai';

export class ContextBuilder {
  async buildContext(userId: string, _userQuery?: string): Promise<AIContextTelemetry> {
    const todayStr = new Date().toISOString().split('T')[0];

    // 1. User Profile
    const userRecord = await userRepository.findById(userId);
    const userName = userRecord?.name || 'Operator';
    const userEmail = userRecord?.email || '';

    // 2. Performance Summary (from existing Performance Engine)
    let performanceOverview;
    try {
      performanceOverview = await performanceService.getLatestPerformance(userId);
    } catch {
      performanceOverview = {
        overallScore: 0,
        level: 'Foundation',
        trend: 'stable' as const,
        percentageChange: 0,
        moduleScores: { discipline: 0, body: 0, mind: 0, nutrition: 0, goals: 0 },
      };
    }

    // 3. Discipline (Tasks, Habits, Streaks)
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

    const completionsToday = db
      .prepare('SELECT task_id FROM task_completions WHERE user_id = ? AND (date = ? OR date LIKE ?)')
      .all(userId, todayStr, `${todayStr}%`) as Array<{ task_id: string }>;
    const completedTaskIds = new Set(completionsToday.map((c) => c.task_id));

    const tasksCompletedToday = activeTasks.filter(
      (t) => t.status === 'completed' || completedTaskIds.has(t.id) || (t.completed_at && t.completed_at.startsWith(todayStr))
    ).length;

    const pendingTasksList = activeTasks.filter(
      (t) => t.status !== 'completed' && !completedTaskIds.has(t.id)
    );
    const tasksTotalToday = tasksCompletedToday + pendingTasksList.length;
    const taskCompletionRate = tasksTotalToday > 0 ? Math.round((tasksCompletedToday / tasksTotalToday) * 100) : 0;
    const pendingTasksSummary = pendingTasksList.slice(0, 5).map((t) => t.title);

    let activeHabitsCount = 0;
    let currentStreak = 0;
    let longestStreak = 0;
    try {
      const habitsRow = db
        .prepare("SELECT COUNT(*) as count FROM habits WHERE user_id = ? AND status = 'active'")
        .get(userId) as { count: number };
      activeHabitsCount = habitsRow?.count || 0;

      const streakRow = db
        .prepare('SELECT current, best FROM streaks WHERE user_id = ?')
        .get(userId) as { current: number; best: number };
      currentStreak = streakRow?.current || 0;
      longestStreak = streakRow?.best || 0;
    } catch (err) {
      console.error('[AI ContextBuilder] Error fetching habits/streaks:', err);
    }

    // 4. Body Telemetry
    let workoutsCompletedToday = 0;
    const workoutsSummary: string[] = [];
    let sleepDurationHours = 0;
    let sleepQualityPercent = 0;
    let waterLiters = 0;
    let waterTargetLiters = 2.5;

    try {
      const bodySummary = await bodyService.getDailySummary(userId, todayStr);
      workoutsCompletedToday = bodySummary.workouts.completedCount;
      if (workoutsCompletedToday > 0) {
        workoutsSummary.push(`${workoutsCompletedToday} session(s) (${bodySummary.workouts.totalMinutes}m, ${bodySummary.workouts.caloriesBurned} kcal)`);
      }
      sleepDurationHours = Number(bodySummary.sleep.durationHours.toFixed(1));
      sleepQualityPercent = bodySummary.sleep.qualityPercent;
      waterLiters = Number(bodySummary.water.totalLiters.toFixed(2));
      waterTargetLiters = bodySummary.water.targetLiters;
    } catch (err) {
      console.error('[AI ContextBuilder] Error fetching body summary:', err);
    }

    // 5. Nutrition Telemetry
    let caloriesCurrent = 0;
    let caloriesTarget = 2200;
    let proteinG = 0;
    let carbsG = 0;
    let fatG = 0;
    let mealsLoggedToday = 0;

    try {
      const nutrSummary = await nutritionService.getDailySummary(userId, todayStr);
      caloriesCurrent = nutrSummary.calories.current;
      caloriesTarget = nutrSummary.calories.target;
      proteinG = nutrSummary.protein.current;
      carbsG = nutrSummary.carbs.current;
      fatG = nutrSummary.fat.current;
      mealsLoggedToday = nutrSummary.mealsLogged;
    } catch (err) {
      console.error('[AI ContextBuilder] Error fetching nutrition summary:', err);
    }

    // 6. Mind Telemetry (STRICT PRIVACY: Count reflections only, never raw text)
    let currentMood = 'Neutral';
    let currentEnergy = 'Medium';
    let averageStress: number | null = null;
    let averageFocus: number | null = null;
    let meditationMinutesToday = 0;
    let reflectionsLoggedCount = 0;

    try {
      const mindSummary = await mindService.getDailySummary(userId, todayStr);
      currentMood = mindSummary.mood.currentMood || 'Not checked in';
      currentEnergy = mindSummary.energy.level || 'Unlogged';
      averageStress = mindSummary.stress.level;
      averageFocus = mindSummary.focus.score;
      meditationMinutesToday = mindSummary.meditation.totalMinutes;
      reflectionsLoggedCount = mindSummary.journal.todayEntriesCount;
    } catch (err) {
      console.error('[AI ContextBuilder] Error fetching mind summary:', err);
    }

    // 7. Goals Telemetry
    const goalsList: AIContextTelemetry['goals'] = [];
    try {
      const allGoals = await goalsRepository.findGoals(userId);
      allGoals
        .filter((g) => g.status !== 'Completed')
        .slice(0, 5)
        .forEach((g) => {
          goalsList.push({
            id: g.id,
            title: g.title,
            category: g.category,
            progressPercent: g.progress_percent,
            deadline: g.deadline || null,
            priority: g.priority,
          });
        });
    } catch (err) {
      console.error('[AI ContextBuilder] Error fetching goals:', err);
    }

    // 8. Recent Events (Last 5 meaningful actions)
    const recentEventsList: AIContextTelemetry['recentEvents'] = [];
    try {
      const events = await eventRepository.findMany({ userId });
      events.slice(0, 5).forEach((e) => {
        const timeFormatted = e.created_at
          ? new Date(e.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : 'recent';
        recentEventsList.push({
          module: e.module,
          eventType: e.event_type,
          title: e.title,
          timeFormatted,
        });
      });
    } catch (err) {
      console.error('[AI ContextBuilder] Error fetching recent events:', err);
    }

    return {
      user: {
        id: userId,
        name: userName,
        email: userEmail,
      },
      performance: {
        score: performanceOverview.overallScore,
        level: (performanceOverview as any).level || 'Foundation',
        trend: performanceOverview.trend || 'stable',
        changePercent: performanceOverview.percentageChange || 0,
        moduleScores: performanceOverview.moduleScores || {
          discipline: 0,
          body: 0,
          mind: 0,
          nutrition: 0,
          goals: 0,
        },
      },
      discipline: {
        tasksCompletedToday,
        tasksTotalToday,
        taskCompletionRate,
        activeHabitsCount,
        currentStreak,
        longestStreak,
        pendingTasksSummary,
      },
      body: {
        workoutsCompletedToday,
        workoutsSummary,
        sleepDurationHours,
        sleepQualityPercent,
        waterLiters,
        waterTargetLiters,
      },
      nutrition: {
        caloriesCurrent,
        caloriesTarget,
        proteinG,
        carbsG,
        fatG,
        mealsLoggedToday,
      },
      mind: {
        currentMood,
        currentEnergy,
        averageStress,
        averageFocus,
        meditationMinutesToday,
        reflectionsLoggedCount,
      },
      goals: goalsList,
      recentEvents: recentEventsList,
    };
  }

  formatContextPrompt(context: AIContextTelemetry): string {
    const p = context.performance;
    const d = context.discipline;
    const b = context.body;
    const n = context.nutrition;
    const m = context.mind;

    const pendingTasksStr =
      d.pendingTasksSummary.length > 0 ? d.pendingTasksSummary.join(', ') : 'All tasks completed';
    const workoutsStr =
      b.workoutsSummary.length > 0 ? b.workoutsSummary.join(', ') : 'No workouts logged today';

    const goalsStr =
      context.goals.length > 0
        ? context.goals
            .map((g) => `- "${g.title}" (${g.category}): ${g.progressPercent}% done${g.deadline ? `, due ${g.deadline}` : ''}`)
            .join('\n')
        : '- No active goals currently registered';

    const eventsStr =
      context.recentEvents.length > 0
        ? context.recentEvents.map((e) => `- [${e.module.toUpperCase()}] ${e.title} (${e.timeFormatted})`).join('\n')
        : '- No recent events logged';

    return `=== USER TELEMETRY & SYSTEM STATE (DisciplineOS) ===
Operator: ${context.user.name}
Overall Performance Score: ${p.score}/1000 (${p.level} Level, Trend: ${p.trend}, Change: ${p.changePercent >= 0 ? '+' : ''}${p.changePercent}%)
Module Sub-Scores:
  • Discipline: ${p.moduleScores.discipline}/100
  • Body: ${p.moduleScores.body}/100
  • Mind: ${p.moduleScores.mind}/100
  • Nutrition: ${p.moduleScores.nutrition}/100
  • Goals: ${p.moduleScores.goals}/100

Discipline Module:
  • Tasks Today: ${d.tasksCompletedToday} completed out of ${d.tasksTotalToday} total (${d.taskCompletionRate}%)
  • Pending Tasks: ${pendingTasksStr}
  • Streak: 🔥 ${d.currentStreak} Days (Personal Record: ${d.longestStreak} Days)
  • Active Habits: ${d.activeHabitsCount}

Body Module:
  • Workouts Logged: ${b.workoutsCompletedToday} (${workoutsStr})
  • Sleep: ${b.sleepDurationHours} hours (Quality rating: ${b.sleepQualityPercent}%)
  • Hydration: ${b.waterLiters}L / ${b.waterTargetLiters}L daily target

Nutrition Module:
  • Intake: ${n.caloriesCurrent} kcal / ${n.caloriesTarget} kcal target (${n.mealsLoggedToday} meals logged)
  • Macronutrients: ${n.proteinG}g Protein | ${n.carbsG}g Carbohydrates | ${n.fatG}g Fats

Mind Module:
  • Check-in: Mood: ${m.currentMood} | Energy: ${m.currentEnergy}
  • Metrics: Stress ${m.averageStress !== null ? `${m.averageStress}/10` : 'Unlogged'} | Focus ${m.averageFocus !== null ? `${m.averageFocus}/10` : 'Unlogged'}
  • Meditation: ${m.meditationMinutesToday} minutes
  • Private Reflections: ${m.reflectionsLoggedCount} entries logged (Contents are strictly confidential)

Active Goals:
${goalsStr}

Recent Activity Events:
${eventsStr}
=====================================================`;
  }
}

export const contextBuilder = new ContextBuilder();
