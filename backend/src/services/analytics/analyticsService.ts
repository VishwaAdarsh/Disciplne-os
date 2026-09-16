/**
 * Analytics Service (SPR-313 / ARCH-002)
 * Aggregates historical metrics across Performance, Discipline, Body, Mind, Nutrition, and Goals.
 */

import db from '../../db';
import {
  AnalyticsTimeRange,
  AnalyticsDTO,
  PerformanceTrendPoint,
  PeriodComparisonMetric,
  ActivityVolumePoint,
  ModuleDistributionPoint,
} from '../../types/analytics';

export class AnalyticsService {
  async getAnalytics(userId: string, rawRange?: string): Promise<AnalyticsDTO> {
    const range: AnalyticsTimeRange =
      rawRange === '7d' || rawRange === '90d' ? (rawRange as AnalyticsTimeRange) : '30d';

    const daysCount = range === '7d' ? 7 : range === '90d' ? 90 : 30;

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Current period window
    const startDateObj = new Date(now.getTime() - (daysCount - 1) * 24 * 60 * 60 * 1000);
    const startDate = startDateObj.toISOString().split('T')[0];
    const endDate = todayStr;

    // Previous equivalent period window
    const prevEndDateObj = new Date(now.getTime() - daysCount * 24 * 60 * 60 * 1000);
    const prevEndDate = prevEndDateObj.toISOString().split('T')[0];
    const prevStartDateObj = new Date(now.getTime() - (2 * daysCount - 1) * 24 * 60 * 60 * 1000);
    const prevStartDate = prevStartDateObj.toISOString().split('T')[0];

    // ==========================================
    // 1. PERFORMANCE TIMELINE & SNAPSHOTS
    // ==========================================
    const currentSnapshots = db
      .prepare(`
        SELECT snapshot_date, overall_score, discipline_score, body_score, mind_score, nutrition_score, goals_score
        FROM performance_snapshots
        WHERE user_id = ? AND snapshot_date >= ? AND snapshot_date <= ?
        ORDER BY snapshot_date ASC
      `)
      .all(userId, startDate, endDate) as Array<{
        snapshot_date: string;
        overall_score: number;
        discipline_score: number;
        body_score: number;
        mind_score: number;
        nutrition_score: number;
        goals_score: number;
      }>;

    const prevSnapshots = db
      .prepare(`
        SELECT overall_score
        FROM performance_snapshots
        WHERE user_id = ? AND snapshot_date >= ? AND snapshot_date <= ?
      `)
      .all(userId, prevStartDate, prevEndDate) as Array<{ overall_score: number }>;

    // Map snapshots into daily trend array
    const snapshotMap = new Map<string, (typeof currentSnapshots)[0]>();
    currentSnapshots.forEach((s) => snapshotMap.set(s.snapshot_date, s));

    const overallTrend: PerformanceTrendPoint[] = [];
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const snap = snapshotMap.get(dStr);

      if (snap) {
        overallTrend.push({
          date: dStr,
          dayName,
          overall: snap.overall_score,
          discipline: snap.discipline_score,
          body: snap.body_score,
          mind: snap.mind_score,
          nutrition: snap.nutrition_score,
          goals: snap.goals_score,
        });
      } else {
        // Only include historical points where data exists or default baseline
        overallTrend.push({
          date: dStr,
          dayName,
          overall: 0,
          discipline: 0,
          body: 0,
          mind: 0,
          nutrition: 0,
          goals: 0,
        });
      }
    }

    // Averages for categories across existing snapshots
    const categoryTotals = { discipline: 0, body: 0, mind: 0, nutrition: 0, goals: 0 };
    let validSnapCount = 0;
    let bestDayScore = 0;
    let bestDay = '—';

    currentSnapshots.forEach((s) => {
      validSnapCount++;
      categoryTotals.discipline += s.discipline_score;
      categoryTotals.body += s.body_score;
      categoryTotals.mind += s.mind_score;
      categoryTotals.nutrition += s.nutrition_score;
      categoryTotals.goals += s.goals_score;

      if (s.overall_score > bestDayScore) {
        bestDayScore = s.overall_score;
        bestDay = s.snapshot_date;
      }
    });

    const categoryAverages = {
      Discipline: validSnapCount > 0 ? Math.round(categoryTotals.discipline / validSnapCount) : 0,
      Body: validSnapCount > 0 ? Math.round(categoryTotals.body / validSnapCount) : 0,
      Mind: validSnapCount > 0 ? Math.round(categoryTotals.mind / validSnapCount) : 0,
      Nutrition: validSnapCount > 0 ? Math.round(categoryTotals.nutrition / validSnapCount) : 0,
      Goals: validSnapCount > 0 ? Math.round(categoryTotals.goals / validSnapCount) : 0,
    };

    // Find best and needs-attention categories
    let bestCategory = 'Discipline';
    let bestCategoryScore = categoryAverages['Discipline'];
    let needsAttention = 'Body';
    let needsAttentionScore = categoryAverages['Body'];

    Object.entries(categoryAverages).forEach(([cat, avg]) => {
      if (avg > bestCategoryScore) {
        bestCategory = cat;
        bestCategoryScore = avg;
      }
      if (avg < needsAttentionScore) {
        needsAttention = cat;
        needsAttentionScore = avg;
      }
    });

    // ==========================================
    // 2. DISCIPLINE ANALYTICS
    // ==========================================
    const tasksCreatedRow = db
      .prepare(`
        SELECT COUNT(*) as count FROM tasks
        WHERE user_id = ? AND deleted_at IS NULL AND (date(created_at) >= ? AND date(created_at) <= ?)
      `)
      .get(userId, startDate, endDate) as { count: number };

    const tasksCompletedRow = db
      .prepare(`
        SELECT COUNT(*) as count FROM tasks
        WHERE user_id = ? AND deleted_at IS NULL
          AND (status = 'completed' OR (date(completed_at) >= ? AND date(completed_at) <= ?))
      `)
      .get(userId, startDate, endDate) as { count: number };

    const prevTasksCompletedRow = db
      .prepare(`
        SELECT COUNT(*) as count FROM tasks
        WHERE user_id = ? AND deleted_at IS NULL
          AND (date(completed_at) >= ? AND date(completed_at) <= ?)
      `)
      .get(userId, prevStartDate, prevEndDate) as { count: number };

    const tasksCreated = tasksCreatedRow?.count || 0;
    const tasksCompleted = tasksCompletedRow?.count || 0;
    const completionRate =
      tasksCreated > 0
        ? Math.min(100, Math.round((tasksCompleted / tasksCreated) * 100))
        : tasksCompleted > 0
        ? 100
        : 0;

    const dailyTaskCompletions = db
      .prepare(`
        SELECT date, COUNT(*) as count FROM task_completions
        WHERE user_id = ? AND date >= ? AND date <= ?
        GROUP BY date ORDER BY date ASC
      `)
      .all(userId, startDate, endDate) as Array<{ date: string; count: number }>;

    const habitsSummaryRow = db
      .prepare(`
        SELECT COUNT(*) as count, AVG(completion_rate) as avg_rate
        FROM habits
        WHERE user_id = ? AND deleted_at IS NULL AND status = 'active'
      `)
      .get(userId) as { count: number; avg_rate: number | null };

    const activeHabits = habitsSummaryRow?.count || 0;
    const habitConsistencyRate = habitsSummaryRow?.avg_rate ? Math.round(habitsSummaryRow.avg_rate * 100) : 0;

    const streakRow = db.prepare('SELECT current, best FROM streaks WHERE user_id = ?').get(userId) as any;
    const currentStreak = streakRow?.current || 0;
    const longestStreak = streakRow?.best || currentStreak;

    // ==========================================
    // 3. BODY ANALYTICS
    // ==========================================
    const workoutsRow = db
      .prepare(`
        SELECT COUNT(*) as total_workouts,
               COALESCE(SUM(duration_minutes), 0) as total_minutes,
               COALESCE(SUM(calories_burned), 0) as total_calories
        FROM workouts
        WHERE user_id = ? AND log_date >= ? AND log_date <= ?
      `)
      .get(userId, startDate, endDate) as {
        total_workouts: number;
        total_minutes: number;
        total_calories: number;
      };

    const prevWorkoutsRow = db
      .prepare(`
        SELECT COUNT(*) as total_workouts
        FROM workouts
        WHERE user_id = ? AND log_date >= ? AND log_date <= ?
      `)
      .get(userId, prevStartDate, prevEndDate) as { total_workouts: number };

    const dailyWorkouts = db
      .prepare(`
        SELECT log_date as date, COUNT(*) as count, COALESCE(SUM(calories_burned), 0) as calories
        FROM workouts
        WHERE user_id = ? AND log_date >= ? AND log_date <= ?
        GROUP BY log_date ORDER BY log_date ASC
      `)
      .all(userId, startDate, endDate) as Array<{ date: string; count: number; calories: number }>;

    const sleepRow = db
      .prepare(`
        SELECT (AVG(duration_minutes) / 60.0) as avg_hours, AVG(quality_percent) as avg_quality
        FROM sleep_logs
        WHERE user_id = ? AND log_date >= ? AND log_date <= ?
      `)
      .get(userId, startDate, endDate) as { avg_hours: number | null; avg_quality: number | null };

    const waterRow = db
      .prepare(`
        SELECT COALESCE(SUM(amount_ml), 0) as total_ml, COUNT(DISTINCT date(logged_at)) as days_logged
        FROM water_logs
        WHERE user_id = ? AND date(logged_at) >= ? AND date(logged_at) <= ?
      `)
      .get(userId, startDate, endDate) as { total_ml: number; days_logged: number };

    const prevWaterRow = db
      .prepare(`
        SELECT COALESCE(SUM(amount_ml), 0) as total_ml, COUNT(DISTINCT date(logged_at)) as days_logged
        FROM water_logs
        WHERE user_id = ? AND date(logged_at) >= ? AND date(logged_at) <= ?
      `)
      .get(userId, prevStartDate, prevEndDate) as { total_ml: number; days_logged: number };

    const waterDays = waterRow?.days_logged || 1;
    const avgDailyWaterLiters = Number(((waterRow?.total_ml || 0) / waterDays / 1000).toFixed(2));

    const prevWaterDays = prevWaterRow?.days_logged || 1;
    const prevAvgDailyWaterLiters = Number(((prevWaterRow?.total_ml || 0) / prevWaterDays / 1000).toFixed(2));

    const stepsRow = db
      .prepare(`
        SELECT AVG(steps_count) as avg_steps FROM step_logs
        WHERE user_id = ? AND log_date >= ? AND log_date <= ?
      `)
      .get(userId, startDate, endDate) as { avg_steps: number | null };

    const weightLogs = db
      .prepare(`
        SELECT weight_kg FROM weight_logs
        WHERE user_id = ? AND date(logged_at) >= ? AND date(logged_at) <= ?
        ORDER BY logged_at ASC
      `)
      .all(userId, startDate, endDate) as Array<{ weight_kg: number }>;

    const latestWeightKg = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight_kg : null;
    const firstWeightKg = weightLogs.length > 0 ? weightLogs[0].weight_kg : null;
    const weightChangeKg =
      latestWeightKg !== null && firstWeightKg !== null
        ? Number((latestWeightKg - firstWeightKg).toFixed(1))
        : null;

    // ==========================================
    // 4. MIND ANALYTICS
    // ==========================================
    const moodRows = db
      .prepare(`
        SELECT mood, icon, COUNT(*) as count FROM mood_logs
        WHERE user_id = ? AND log_date >= ? AND log_date <= ?
        GROUP BY mood ORDER BY count DESC
      `)
      .all(userId, startDate, endDate) as Array<{ mood: string; icon: string | null; count: number }>;

    const totalMoodCount = moodRows.reduce((acc, m) => acc + m.count, 0);
    const moodDistribution = moodRows.map((m) => ({
      mood: m.mood,
      icon: m.icon || '🙂',
      count: m.count,
      percentage: totalMoodCount > 0 ? Math.round((m.count / totalMoodCount) * 100) : 0,
    }));

    const stressRow = db
      .prepare('SELECT AVG(stress_level) as avg FROM stress_logs WHERE user_id = ? AND log_date >= ? AND log_date <= ?')
      .get(userId, startDate, endDate) as { avg: number | null };

    const focusRow = db
      .prepare('SELECT AVG(focus_score) as avg FROM focus_logs WHERE user_id = ? AND log_date >= ? AND log_date <= ?')
      .get(userId, startDate, endDate) as { avg: number | null };

    const meditationRow = db
      .prepare(`
        SELECT COUNT(*) as sessions, COALESCE(SUM(duration_minutes), 0) as minutes
        FROM meditation_sessions
        WHERE user_id = ? AND log_date >= ? AND log_date <= ?
      `)
      .get(userId, startDate, endDate) as { sessions: number; minutes: number };

    // Strictly privacy-compliant: only returns count of journals created
    const journalRow = db
      .prepare('SELECT COUNT(*) as count FROM journals WHERE user_id = ? AND date(created_at) >= ? AND date(created_at) <= ?')
      .get(userId, startDate, endDate) as { count: number };

    // ==========================================
    // 5. NUTRITION ANALYTICS
    // ==========================================
    const nutritionGoalsRow = db
      .prepare('SELECT calories_target, protein_target, carbs_target, fat_target FROM nutrition_goals WHERE user_id = ?')
      .get(userId) as any;

    const targetCalories = nutritionGoalsRow?.calories_target || 2200;

    const dailyMealStats = db
      .prepare(`
        SELECT log_date as date, COUNT(*) as meals_count,
               COALESCE(SUM(calories), 0) as calories,
               COALESCE(SUM(protein_g), 0) as protein,
               COALESCE(SUM(carbs_g), 0) as carbs,
               COALESCE(SUM(fat_g), 0) as fat
        FROM meals
        WHERE user_id = ? AND log_date >= ? AND log_date <= ?
        GROUP BY log_date ORDER BY log_date ASC
      `)
      .all(userId, startDate, endDate) as Array<{
        date: string;
        meals_count: number;
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
      }>;

    const loggedDaysCount = dailyMealStats.length;
    let sumCalories = 0;
    let sumProtein = 0;
    let sumCarbs = 0;
    let sumFat = 0;
    let totalMealsLogged = 0;
    let adheredDays = 0;

    dailyMealStats.forEach((d) => {
      sumCalories += d.calories;
      sumProtein += d.protein;
      sumCarbs += d.carbs;
      sumFat += d.fat;
      totalMealsLogged += d.meals_count;

      // Adherence: within 15% range of calorie target
      if (d.calories >= targetCalories * 0.85 && d.calories <= targetCalories * 1.15) {
        adheredDays++;
      }
    });

    const avgCalories = loggedDaysCount > 0 ? Math.round(sumCalories / loggedDaysCount) : 0;
    const avgProtein = loggedDaysCount > 0 ? Math.round(sumProtein / loggedDaysCount) : 0;
    const avgCarbs = loggedDaysCount > 0 ? Math.round(sumCarbs / loggedDaysCount) : 0;
    const avgFat = loggedDaysCount > 0 ? Math.round(sumFat / loggedDaysCount) : 0;
    const targetAdherenceRate = loggedDaysCount > 0 ? Math.round((adheredDays / loggedDaysCount) * 100) : 0;

    const dailyCalories = dailyMealStats.map((d) => ({
      date: d.date,
      calories: d.calories,
      target: targetCalories,
    }));

    // ==========================================
    // 6. GOALS ANALYTICS
    // ==========================================
    const goalsCreatedRow = db
      .prepare('SELECT COUNT(*) as count FROM goals WHERE user_id = ? AND date(created_at) >= ? AND date(created_at) <= ?')
      .get(userId, startDate, endDate) as { count: number };

    const goalsCompletedRow = db
      .prepare(`
        SELECT COUNT(*) as count FROM goals
        WHERE user_id = ? AND status = 'Completed' AND date(updated_at) >= ? AND date(updated_at) <= ?
      `)
      .get(userId, startDate, endDate) as { count: number };

    const allActiveGoals = db
      .prepare(`
        SELECT id, category, status, progress_percent, deadline FROM goals
        WHERE user_id = ? AND deleted_at IS NULL
      `)
      .all(userId) as Array<{
        id: string;
        category: string;
        status: string;
        progress_percent: number;
        deadline: string | null;
      }>;

    let activeGoals = 0;
    let overdueGoals = 0;
    let progressSum = 0;
    const categoryGoalMap = new Map<string, { count: number; sumProgress: number }>();

    allActiveGoals.forEach((g) => {
      progressSum += g.progress_percent || 0;
      if (g.status === 'Active' || g.status === 'In Progress') {
        activeGoals++;
      }
      if (g.status !== 'Completed' && g.deadline && g.deadline < todayStr) {
        overdueGoals++;
      }

      const existingCat = categoryGoalMap.get(g.category) || { count: 0, sumProgress: 0 };
      existingCat.count++;
      existingCat.sumProgress += g.progress_percent || 0;
      categoryGoalMap.set(g.category, existingCat);
    });

    const avgProgressPercent = allActiveGoals.length > 0 ? Math.round(progressSum / allActiveGoals.length) : 0;

    const categoryBreakdown = Array.from(categoryGoalMap.entries()).map(([category, data]) => ({
      category,
      count: data.count,
      avgProgress: Math.round(data.sumProgress / data.count),
    }));

    // ==========================================
    // 7. HISTORICAL COMPARISONS (PERIOD OVER PERIOD)
    // ==========================================
    const currAvgScore = validSnapCount > 0 ? Math.round(currentSnapshots.reduce((a, s) => a + s.overall_score, 0) / validSnapCount) : 0;
    const prevAvgScore = prevSnapshots.length > 0 ? Math.round(prevSnapshots.reduce((a, s) => a + s.overall_score, 0) / prevSnapshots.length) : 0;

    const prevWorkoutsCount = prevWorkoutsRow?.total_workouts || 0;
    const prevTasksCount = prevTasksCompletedRow?.count || 0;

    // Check if sufficient past data exists
    const hasPreviousPeriodData =
      prevSnapshots.length > 0 || prevWorkoutsCount > 0 || prevTasksCount > 0 || (prevWaterRow?.total_ml || 0) > 0;

    const buildMetric = (
      current: number,
      previous: number,
      label: string,
      unit: string
    ): PeriodComparisonMetric => {
      const diff = current - previous;
      const percentChange = previous > 0 ? Number(((diff / previous) * 100).toFixed(1)) : diff > 0 ? 100 : 0;
      const direction = diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral';
      return {
        current,
        previous,
        diff,
        percentChange,
        direction,
        available: hasPreviousPeriodData,
        label,
        unit,
      };
    };

    const comparisons = {
      hasPreviousPeriodData,
      performance: buildMetric(currAvgScore, prevAvgScore, 'Average Performance Score', 'pts'),
      discipline: buildMetric(tasksCompleted, prevTasksCount, 'Tasks Completed', 'tasks'),
      workouts: buildMetric(workoutsRow?.total_workouts || 0, prevWorkoutsCount, 'Workouts Logged', 'sessions'),
      water: buildMetric(avgDailyWaterLiters, prevAvgDailyWaterLiters, 'Daily Water Intake', 'L'),
    };

    // ==========================================
    // 8. ACTIVITY VOLUME & SHARE DISTRIBUTION
    // ==========================================
    const rawEvents = db
      .prepare(`
        SELECT date(created_at) as event_date, module, COUNT(*) as count
        FROM events
        WHERE user_id = ? AND date(created_at) >= ? AND date(created_at) <= ?
        GROUP BY date(created_at), module
        ORDER BY event_date ASC
      `)
      .all(userId, startDate, endDate) as Array<{ event_date: string; module: string; count: number }>;

    // Aggregate by date for bar chart
    const dailyVolumeMap = new Map<string, number>();
    const moduleCountMap = new Map<string, number>();
    let totalEventsInPeriod = 0;

    rawEvents.forEach((e) => {
      dailyVolumeMap.set(e.event_date, (dailyVolumeMap.get(e.event_date) || 0) + e.count);
      moduleCountMap.set(e.module, (moduleCountMap.get(e.module) || 0) + e.count);
      totalEventsInPeriod += e.count;
    });

    const activityVolume: ActivityVolumePoint[] = Array.from(dailyVolumeMap.entries()).map(([d, val]) => {
      const dObj = new Date(d);
      const display = dObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return {
        date: d,
        name: display,
        value: val,
      };
    });

    const moduleColors: Record<string, string> = {
      discipline: '#6366F1',
      body: '#10B981',
      mind: '#8B5CF6',
      nutrition: '#F59E0B',
      goals: '#06B6D4',
      system: '#64748B',
    };

    const activityDistribution: ModuleDistributionPoint[] = Array.from(moduleCountMap.entries()).map(
      ([module, count]) => {
        const percentage = totalEventsInPeriod > 0 ? Math.round((count / totalEventsInPeriod) * 100) : 0;
        const capitalized = module.charAt(0).toUpperCase() + module.slice(1);
        return {
          name: capitalized,
          count,
          value: percentage,
          color: moduleColors[module.toLowerCase()] || '#6366F1',
        };
      }
    );

    return {
      range,
      startDate,
      endDate,
      daysInRange: daysCount,
      highlights: {
        bestDay: bestDayScore > 0 ? bestDay : 'No data yet',
        bestDayScore,
        bestCategory,
        bestCategoryScore,
        needsAttention,
        needsAttentionScore,
        longestStreak,
      },
      comparisons,
      overallTrend,
      discipline: {
        tasksCreated,
        tasksCompleted,
        completionRate,
        activeHabits,
        habitConsistencyRate,
        longestStreak,
        currentStreak,
        dailyTaskCompletions,
      },
      body: {
        totalWorkouts: workoutsRow?.total_workouts || 0,
        totalWorkoutMinutes: workoutsRow?.total_minutes || 0,
        totalCaloriesBurned: workoutsRow?.total_calories || 0,
        avgSleepHours: sleepRow?.avg_hours ? Number(sleepRow.avg_hours.toFixed(1)) : 0,
        avgSleepQuality: sleepRow?.avg_quality ? Math.round(sleepRow.avg_quality) : 0,
        avgDailyWaterLiters,
        avgDailySteps: stepsRow?.avg_steps ? Math.round(stepsRow.avg_steps) : 0,
        latestWeightKg,
        weightChangeKg,
        dailyWorkouts,
      },
      mind: {
        moodDistribution,
        avgStress: stressRow?.avg ? Number(stressRow.avg.toFixed(1)) : null,
        avgFocus: focusRow?.avg ? Number(focusRow.avg.toFixed(1)) : null,
        meditationSessions: meditationRow?.sessions || 0,
        meditationMinutes: meditationRow?.minutes || 0,
        journalEntriesCount: journalRow?.count || 0,
      },
      nutrition: {
        avgCalories,
        targetCalories,
        avgProtein,
        avgCarbs,
        avgFat,
        totalMealsLogged,
        targetAdherenceRate,
        dailyCalories,
      },
      goals: {
        goalsCreated: goalsCreatedRow?.count || 0,
        goalsCompleted: goalsCompletedRow?.count || 0,
        activeGoals,
        overdueGoals,
        avgProgressPercent,
        categoryBreakdown,
      },
      activityVolume,
      activityDistribution,
    };
  }
}

export const analyticsService = new AnalyticsService();
