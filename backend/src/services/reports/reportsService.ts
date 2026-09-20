/**
 * Reports & Data Export Service (SPR-317)
 * Implements report summaries, CSV tabular exports, and sanitized JSON backups.
 */

import db from '../../db';
import { AppError } from '../../errors/AppError';
import {
  ReportPeriod,
  ReportCategory,
  ReportSummaryDTO,
  ReportHighlight,
  JSONExportDTO,
} from '../../types/reports';

export class ReportsService {
  /**
   * Helper to escape a value according to RFC-4180 CSV specifications.
   */
  private escapeCSV(val: any): string {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  /**
   * Helper to format a table as a CSV string.
   */
  private toCSV(headers: string[], rows: any[][]): string {
    const headerLine = headers.map((h) => this.escapeCSV(h)).join(',');
    const dataLines = rows.map((row) => row.map((c) => this.escapeCSV(c)).join(','));
    return [headerLine, ...dataLines].join('\r\n');
  }

  /**
   * Helper to safely query a table for a user with optional soft-delete filter.
   */
  private safeQueryTable(table: string, userId: string, filterDeleted = true): any[] {
    if (filterDeleted) {
      try {
        return db.prepare(`SELECT * FROM ${table} WHERE user_id = ? AND deleted_at IS NULL`).all(userId);
      } catch {}
    }
    try {
      return db.prepare(`SELECT * FROM ${table} WHERE user_id = ?`).all(userId);
    } catch {
      return [];
    }
  }

  /**
   * Resolves and validates date ranges for report generation.
   */
  public resolveDateRange(
    rawPeriod?: string,
    rawStartDate?: string,
    rawEndDate?: string
  ): { period: ReportPeriod; startDate: string; endDate: string; daysCount: number } {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const period: ReportPeriod =
      rawPeriod === 'today' || rawPeriod === '7d' || rawPeriod === '30d' || rawPeriod === '90d' || rawPeriod === 'custom'
        ? (rawPeriod as ReportPeriod)
        : '7d';

    if (period === 'custom') {
      if (!rawStartDate || !rawEndDate) {
        throw new AppError('Both startDate and endDate are required for custom date range', 400);
      }

      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(rawStartDate) || !dateRegex.test(rawEndDate)) {
        throw new AppError('Dates must be in YYYY-MM-DD format', 400);
      }

      const startTimestamp = Date.parse(rawStartDate);
      const endTimestamp = Date.parse(rawEndDate);
      if (isNaN(startTimestamp) || isNaN(endTimestamp)) {
        throw new AppError('Invalid date values provided', 400);
      }

      if (rawStartDate > rawEndDate) {
        throw new AppError('startDate must be before or equal to endDate', 400);
      }

      const diffMs = endTimestamp - startTimestamp;
      const daysCount = Math.round(diffMs / (24 * 60 * 60 * 1000)) + 1;

      if (daysCount > 366) {
        throw new AppError('Custom date range cannot exceed 366 days', 400);
      }

      return {
        period: 'custom',
        startDate: rawStartDate,
        endDate: rawEndDate,
        daysCount,
      };
    }

    let daysCount = 7;
    if (period === 'today') daysCount = 1;
    else if (period === '30d') daysCount = 30;
    else if (period === '90d') daysCount = 90;

    const startDateObj = new Date(now.getTime() - (daysCount - 1) * 24 * 60 * 60 * 1000);
    const startDate = startDateObj.toISOString().split('T')[0];
    const endDate = todayStr;

    return {
      period,
      startDate,
      endDate,
      daysCount,
    };
  }

  /**
   * Generates a comprehensive, structured report summary based on actual stored data.
   */
  public generateReportSummary(
    userId: string,
    options: { period?: string; startDate?: string; endDate?: string; category?: string }
  ): ReportSummaryDTO {
    const { period, startDate, endDate, daysCount } = this.resolveDateRange(
      options.period,
      options.startDate,
      options.endDate
    );

    const validCategory: ReportCategory =
      options.category === 'discipline' ||
      options.category === 'body' ||
      options.category === 'mind' ||
      options.category === 'nutrition' ||
      options.category === 'goals'
        ? (options.category as ReportCategory)
        : 'overall';

    // 1. User Information
    const userRow = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(userId) as any;
    if (!userRow) {
      throw new AppError('User not found', 404);
    }
    const user = {
      id: userRow.id,
      name: userRow.name,
      email: userRow.email,
    };

    // 2. Performance Snapshots & Score
    const snapshots = db
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

    // Latest snapshot ever for current score baseline if no snapshots in window
    const latestOverallSnap = db
      .prepare('SELECT overall_score FROM performance_snapshots WHERE user_id = ? ORDER BY snapshot_date DESC LIMIT 1')
      .get(userId) as { overall_score: number } | undefined;

    const currentScore =
      snapshots.length > 0
        ? snapshots[snapshots.length - 1].overall_score
        : latestOverallSnap?.overall_score || 0;

    const level = Math.floor(currentScore / 100) + 1;
    const status =
      currentScore >= 800
        ? 'Optimal'
        : currentScore >= 650
        ? 'Solid'
        : currentScore >= 450
        ? 'Developing'
        : 'Requires Attention';

    let trend = 'Stable';
    if (snapshots.length >= 2) {
      const firstScore = snapshots[0].overall_score;
      const lastScore = snapshots[snapshots.length - 1].overall_score;
      const diff = lastScore - firstScore;
      if (diff > 15) trend = `+${diff} pts Upward`;
      else if (diff < -15) trend = `${diff} pts Downward`;
    }

    const scoreHistory = snapshots.map((s) => ({ date: s.snapshot_date, score: s.overall_score }));

    // 3. Discipline Metrics
    const tasksCreatedRow = db
      .prepare(`
        SELECT COUNT(*) as count FROM tasks
        WHERE user_id = ? AND deleted_at IS NULL AND date(created_at) >= ? AND date(created_at) <= ?
      `)
      .get(userId, startDate, endDate) as { count: number };

    const tasksCompletedRow = db
      .prepare(`
        SELECT COUNT(*) as count FROM tasks
        WHERE user_id = ? AND deleted_at IS NULL
          AND (status = 'completed' OR (date(completed_at) >= ? AND date(completed_at) <= ?))
      `)
      .get(userId, startDate, endDate) as { count: number };

    const tasksCreated = tasksCreatedRow?.count || 0;
    const tasksCompleted = tasksCompletedRow?.count || 0;
    const completionRate =
      tasksCreated > 0
        ? Math.min(100, Math.round((tasksCompleted / tasksCreated) * 100))
        : tasksCompleted > 0
        ? 100
        : 0;

    const habitsRow = db
      .prepare(`
        SELECT COUNT(*) as count, AVG(completion_rate) as avg_rate
        FROM habits
        WHERE user_id = ? AND deleted_at IS NULL AND status = 'active'
      `)
      .get(userId) as { count: number; avg_rate: number | null };

    const activeHabits = habitsRow?.count || 0;
    const habitConsistencyRate = habitsRow?.avg_rate ? Math.round(habitsRow.avg_rate * 100) : 0;

    const streakRow = db.prepare('SELECT current, best FROM streaks WHERE user_id = ?').get(userId) as any;
    const currentStreak = streakRow?.current || 0;
    const longestStreak = streakRow?.best || currentStreak;

    // 4. Body Metrics
    const workoutsRow = db
      .prepare(`
        SELECT COUNT(*) as count, COALESCE(SUM(duration_minutes), 0) as minutes, COALESCE(SUM(calories_burned), 0) as calories
        FROM workouts
        WHERE user_id = ? AND log_date >= ? AND log_date <= ?
      `)
      .get(userId, startDate, endDate) as { count: number; minutes: number; calories: number };

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

    const waterDays = waterRow?.days_logged || 1;
    const avgWaterLiters = Number(((waterRow?.total_ml || 0) / waterDays / 1000).toFixed(2));

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

    // 5. Mind Metrics
    const moodRows = db
      .prepare(`
        SELECT mood, COUNT(*) as count FROM mood_logs
        WHERE user_id = ? AND log_date >= ? AND log_date <= ?
        GROUP BY mood ORDER BY count DESC LIMIT 1
      `)
      .get(userId, startDate, endDate) as { mood: string; count: number } | undefined;

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

    const journalRow = db
      .prepare('SELECT COUNT(*) as count FROM journals WHERE user_id = ? AND date(created_at) >= ? AND date(created_at) <= ?')
      .get(userId, startDate, endDate) as { count: number };

    // 6. Nutrition Metrics
    const nutritionGoalsRow = db
      .prepare('SELECT calories_target FROM nutrition_goals WHERE user_id = ?')
      .get(userId) as { calories_target: number } | undefined;

    const targetCalories = nutritionGoalsRow?.calories_target || 2200;

    const dailyMeals = db
      .prepare(`
        SELECT log_date, COUNT(*) as meals_count,
               COALESCE(SUM(calories), 0) as calories,
               COALESCE(SUM(protein_g), 0) as protein,
               COALESCE(SUM(carbs_g), 0) as carbs,
               COALESCE(SUM(fat_g), 0) as fat
        FROM meals
        WHERE user_id = ? AND log_date >= ? AND log_date <= ?
        GROUP BY log_date
      `)
      .all(userId, startDate, endDate) as Array<{
        log_date: string;
        meals_count: number;
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
      }>;

    const mealDaysCount = dailyMeals.length;
    let sumCalories = 0;
    let sumProtein = 0;
    let sumCarbs = 0;
    let sumFat = 0;
    let totalMealsLogged = 0;
    let adheredDays = 0;

    dailyMeals.forEach((m) => {
      sumCalories += m.calories;
      sumProtein += m.protein;
      sumCarbs += m.carbs;
      sumFat += m.fat;
      totalMealsLogged += m.meals_count;
      if (m.calories >= targetCalories * 0.85 && m.calories <= targetCalories * 1.15) {
        adheredDays++;
      }
    });

    const avgCalories = mealDaysCount > 0 ? Math.round(sumCalories / mealDaysCount) : 0;
    const avgProtein = mealDaysCount > 0 ? Math.round(sumProtein / mealDaysCount) : 0;
    const avgCarbs = mealDaysCount > 0 ? Math.round(sumCarbs / mealDaysCount) : 0;
    const avgFat = mealDaysCount > 0 ? Math.round(sumFat / mealDaysCount) : 0;
    const adherenceRate = mealDaysCount > 0 ? Math.round((adheredDays / mealDaysCount) * 100) : 0;

    // 7. Goals Metrics
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

    allActiveGoals.forEach((g) => {
      progressSum += g.progress_percent || 0;
      if (g.status === 'Active' || g.status === 'In Progress') activeGoals++;
      if (g.status !== 'Completed' && g.deadline && g.deadline < endDate) overdueGoals++;
    });

    const avgProgressPercent = allActiveGoals.length > 0 ? Math.round(progressSum / allActiveGoals.length) : 0;

    const milestonesCountRow = db
      .prepare(`
        SELECT COUNT(*) as count FROM goal_milestones
        WHERE user_id = ? AND completed = 1 AND date(updated_at) >= ? AND date(updated_at) <= ?
      `)
      .get(userId, startDate, endDate) as { count: number } | undefined;

    // 8. Highlights Generation
    const highlights: ReportHighlight[] = [];

    if (currentScore >= 750) {
      highlights.push({
        title: 'High Performance Zone',
        desc: `Operating at ${currentScore} score (${status}). Consistency across primary modules is robust.`,
        type: 'success',
      });
    } else if (currentScore < 500) {
      highlights.push({
        title: 'Performance Diagnostic',
        desc: `Overall score is currently ${currentScore}. Focus on completing high-priority daily tasks and logging habits.`,
        type: 'warning',
      });
    }

    if (completionRate >= 80 && tasksCompleted > 0) {
      highlights.push({
        title: 'Strong Task Execution',
        desc: `${tasksCompleted} of ${tasksCreated} tasks completed (${completionRate}% execution rate).`,
        type: 'success',
      });
    } else if (tasksCreated > 3 && completionRate < 50) {
      highlights.push({
        title: 'Task Backlog Alert',
        desc: `${tasksCreated - tasksCompleted} tasks remain uncompleted during this period (${completionRate}% completion).`,
        type: 'warning',
      });
    }

    if (workoutsRow.count >= Math.max(1, Math.floor(daysCount / 2.5))) {
      highlights.push({
        title: 'Physical Training Target Met',
        desc: `${workoutsRow.count} workouts logged totaling ${workoutsRow.minutes} minutes and ${workoutsRow.calories} kcal.`,
        type: 'success',
      });
    }

    if (overdueGoals > 0) {
      highlights.push({
        title: 'Goal Deadlines Requiring Action',
        desc: `${overdueGoals} active goal(s) have passed their scheduled target date.`,
        type: 'warning',
      });
    }

    if (highlights.length === 0) {
      highlights.push({
        title: 'System Operating Normally',
        desc: `Data logging active for ${daysCount} day window. Continue daily discipline routines.`,
        type: 'info',
      });
    }

    return {
      period,
      startDate,
      endDate,
      daysCount,
      category: validCategory,
      generatedAt: new Date().toISOString(),
      user,
      performance: {
        score: currentScore,
        level,
        status,
        trend,
        scoreHistory,
      },
      discipline: {
        tasksCreated,
        tasksCompleted,
        completionRate,
        activeHabits,
        habitConsistencyRate,
        currentStreak,
        longestStreak,
      },
      body: {
        workoutsCount: workoutsRow?.count || 0,
        workoutMinutes: workoutsRow?.minutes || 0,
        caloriesBurned: workoutsRow?.calories || 0,
        avgSleepHours: sleepRow?.avg_hours ? Number(sleepRow.avg_hours.toFixed(1)) : 0,
        avgSleepQuality: sleepRow?.avg_quality ? Math.round(sleepRow.avg_quality) : 0,
        avgWaterLiters,
        avgSteps: stepsRow?.avg_steps ? Math.round(stepsRow.avg_steps) : 0,
        latestWeightKg,
        weightChangeKg,
      },
      mind: {
        dominantMood: moodRows?.mood || 'Neutral',
        moodCount: moodRows?.count || 0,
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
        adherenceRate,
        mealsLogged: totalMealsLogged,
      },
      goals: {
        goalsCreated: goalsCreatedRow?.count || 0,
        goalsCompleted: goalsCompletedRow?.count || 0,
        activeGoals,
        overdueGoals,
        avgProgressPercent,
        milestonesCount: milestonesCountRow?.count || 0,
      },
      highlights,
    };
  }

  /**
   * Generates a CSV tabular export for a specified dataset or all datasets.
   */
  public exportCSV(
    userId: string,
    rawDataset: string,
    rawStartDate?: string,
    rawEndDate?: string
  ): { filename: string; csv: string } {
    const dataset = (rawDataset || 'all').toLowerCase();
    const todayStr = new Date().toISOString().split('T')[0];

    // Check optional date filtering
    let dateFilter = '';
    const dateParams: string[] = [userId];
    if (rawStartDate && rawEndDate) {
      dateFilter = ' AND date >= ? AND date <= ? ';
    }

    if (dataset === 'discipline' || dataset === 'tasks') {
      const tasks = db
        .prepare(`
          SELECT id, name, category, priority, status, estimated_minutes, due_date, completed_at, created_at
          FROM tasks
          WHERE user_id = ? AND deleted_at IS NULL
          ORDER BY created_at DESC
        `)
        .all(userId) as any[];

      const headers = ['Task ID', 'Title', 'Category', 'Priority', 'Status', 'Estimated Minutes', 'Due Date', 'Completed At', 'Created At'];
      const rows = tasks.map((t) => [
        t.id,
        t.name,
        t.category,
        t.priority,
        t.status,
        t.estimated_minutes,
        t.due_date || '',
        t.completed_at || '',
        t.created_at,
      ]);

      return {
        filename: `disciplineos-tasks-${todayStr}.csv`,
        csv: this.toCSV(headers, rows),
      };
    }

    if (dataset === 'habits') {
      const habits = db
        .prepare(`
          SELECT id, habit_name, category, frequency, streak, completion_rate, status, created_at
          FROM habits
          WHERE user_id = ? AND deleted_at IS NULL
          ORDER BY created_at DESC
        `)
        .all(userId) as any[];

      const headers = ['Habit ID', 'Name', 'Category', 'Frequency', 'Current Streak', 'Completion Rate %', 'Status', 'Created At'];
      const rows = habits.map((h) => [
        h.id,
        h.habit_name,
        h.category,
        h.frequency,
        h.streak,
        Math.round((h.completion_rate || 0) * 100),
        h.status,
        h.created_at,
      ]);

      return {
        filename: `disciplineos-habits-${todayStr}.csv`,
        csv: this.toCSV(headers, rows),
      };
    }

    if (dataset === 'body') {
      const workouts = db
        .prepare(`
          SELECT id, name, category, duration_minutes, calories_burned, intensity, log_date
          FROM workouts
          WHERE user_id = ?
          ORDER BY log_date DESC
        `)
        .all(userId) as any[];

      const headers = ['Workout ID', 'Name', 'Category', 'Duration (min)', 'Calories Burned', 'Intensity', 'Log Date'];
      const rows = workouts.map((w) => [
        w.id,
        w.name,
        w.category,
        w.duration_minutes,
        w.calories_burned,
        w.intensity,
        w.log_date,
      ]);

      return {
        filename: `disciplineos-body-workouts-${todayStr}.csv`,
        csv: this.toCSV(headers, rows),
      };
    }

    if (dataset === 'mind') {
      const moods = db
        .prepare(`
          SELECT id, log_date, mood, icon, notes
          FROM mood_logs
          WHERE user_id = ?
          ORDER BY log_date DESC
        `)
        .all(userId) as any[];

      const headers = ['Log ID', 'Date', 'Mood', 'Icon', 'Notes'];
      const rows = moods.map((m) => [m.id, m.log_date, m.mood, m.icon || '', m.notes || '']);

      return {
        filename: `disciplineos-mind-moods-${todayStr}.csv`,
        csv: this.toCSV(headers, rows),
      };
    }

    if (dataset === 'nutrition') {
      const meals = db
        .prepare(`
          SELECT id, log_date, name, category, calories, protein_g, carbs_g, fat_g, fiber_g, notes
          FROM meals
          WHERE user_id = ? AND deleted_at IS NULL
          ORDER BY log_date DESC
        `)
        .all(userId) as any[];

      const headers = ['Meal ID', 'Date', 'Name', 'Category', 'Calories (kcal)', 'Protein (g)', 'Carbs (g)', 'Fat (g)', 'Fiber (g)', 'Notes'];
      const rows = meals.map((m) => [
        m.id,
        m.log_date,
        m.name,
        m.category,
        m.calories,
        m.protein_g,
        m.carbs_g,
        m.fat_g,
        m.fiber_g,
        m.notes || '',
      ]);

      return {
        filename: `disciplineos-nutrition-meals-${todayStr}.csv`,
        csv: this.toCSV(headers, rows),
      };
    }

    if (dataset === 'goals') {
      const goals = db
        .prepare(`
          SELECT id, title, category, goal_type, target_value, current_value, unit, priority, status, progress_percent, deadline, created_at
          FROM goals
          WHERE user_id = ? AND deleted_at IS NULL
          ORDER BY created_at DESC
        `)
        .all(userId) as any[];

      const headers = ['Goal ID', 'Title', 'Category', 'Goal Type', 'Target Value', 'Current Value', 'Unit', 'Priority', 'Status', 'Progress %', 'Deadline', 'Created At'];
      const rows = goals.map((g) => [
        g.id,
        g.title,
        g.category,
        g.goal_type,
        g.target_value ?? '',
        g.current_value ?? '',
        g.unit ?? '',
        g.priority,
        g.status,
        g.progress_percent,
        g.deadline || '',
        g.created_at,
      ]);

      return {
        filename: `disciplineos-goals-${todayStr}.csv`,
        csv: this.toCSV(headers, rows),
      };
    }

    if (dataset === 'performance') {
      const snapshots = db
        .prepare(`
          SELECT snapshot_date, overall_score, discipline_score, body_score, mind_score, nutrition_score, goals_score, period_type, trend
          FROM performance_snapshots
          WHERE user_id = ?
          ORDER BY snapshot_date DESC
        `)
        .all(userId) as any[];

      const headers = ['Date', 'Overall Score', 'Discipline', 'Body', 'Mind', 'Nutrition', 'Goals', 'Period Type', 'Trend'];
      const rows = snapshots.map((s) => [
        s.snapshot_date,
        s.overall_score,
        s.discipline_score,
        s.body_score,
        s.mind_score,
        s.nutrition_score,
        s.goals_score,
        s.period_type,
        s.trend,
      ]);

      return {
        filename: `disciplineos-performance-history-${todayStr}.csv`,
        csv: this.toCSV(headers, rows),
      };
    }

    // Default 'all': Export summary of tasks, workouts, meals, goals, performance
    const tasks = db.prepare('SELECT id, name, category, priority, status, due_date FROM tasks WHERE user_id = ? AND deleted_at IS NULL').all(userId) as any[];
    const workouts = db.prepare('SELECT id, name, category, duration_minutes, calories_burned, log_date FROM workouts WHERE user_id = ?').all(userId) as any[];
    const meals = db.prepare('SELECT id, name, category, calories, log_date FROM meals WHERE user_id = ? AND deleted_at IS NULL').all(userId) as any[];
    const goals = db.prepare('SELECT id, title, category, status, progress_percent, deadline FROM goals WHERE user_id = ? AND deleted_at IS NULL').all(userId) as any[];
    const snapshots = db.prepare('SELECT snapshot_date, overall_score FROM performance_snapshots WHERE user_id = ? ORDER BY snapshot_date DESC').all(userId) as any[];

    const sections: string[] = [];

    // Discipline section
    sections.push('=== DISCIPLINE TASKS ===');
    sections.push(this.toCSV(['ID', 'Title', 'Category', 'Priority', 'Status', 'Due Date'], tasks.map(t => [t.id, t.name, t.category, t.priority, t.status, t.due_date || ''])));
    sections.push('\r\n');

    // Body section
    sections.push('=== BODY WORKOUTS ===');
    sections.push(this.toCSV(['ID', 'Name', 'Category', 'Duration Min', 'Calories', 'Date'], workouts.map(w => [w.id, w.name, w.category, w.duration_minutes, w.calories_burned, w.log_date])));
    sections.push('\r\n');

    // Nutrition section
    sections.push('=== NUTRITION MEALS ===');
    sections.push(this.toCSV(['ID', 'Name', 'Category', 'Calories', 'Date'], meals.map(m => [m.id, m.name, m.category, m.calories, m.log_date])));
    sections.push('\r\n');

    // Goals section
    sections.push('=== GOALS ===');
    sections.push(this.toCSV(['ID', 'Title', 'Category', 'Status', 'Progress %', 'Deadline'], goals.map(g => [g.id, g.title, g.category, g.status, g.progress_percent, g.deadline || ''])));
    sections.push('\r\n');

    // Performance section
    sections.push('=== PERFORMANCE HISTORY ===');
    sections.push(this.toCSV(['Date', 'Score'], snapshots.map(s => [s.snapshot_date, s.overall_score])));

    return {
      filename: `disciplineos-full-export-${todayStr}.csv`,
      csv: sections.join('\r\n'),
    };
  }

  /**
   * Generates a complete, machine-readable JSON data export strictly sanitized of credentials and secrets.
   */
  public exportJSON(userId: string): JSONExportDTO {
    // 1. User Info (sanitized - NO password, NO token)
    const userRow = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(userId) as any;
    if (!userRow) {
      throw new AppError('User not found', 404);
    }

    // 2. Discipline
    const tasks = this.safeQueryTable('tasks', userId, true);
    const habits = this.safeQueryTable('habits', userId, true);
    const taskCompletions = this.safeQueryTable('task_completions', userId, false);

    // 3. Body
    const workouts = this.safeQueryTable('workouts', userId, true);
    const sleepLogs = this.safeQueryTable('sleep_logs', userId, false);
    const waterLogs = this.safeQueryTable('water_logs', userId, false);
    const stepLogs = this.safeQueryTable('step_logs', userId, false);
    const weightLogs = this.safeQueryTable('weight_logs', userId, false);

    // 4. Mind
    const moodLogs = this.safeQueryTable('mood_logs', userId, false);
    const energyLogs = this.safeQueryTable('energy_logs', userId, false);
    const stressLogs = this.safeQueryTable('stress_logs', userId, false);
    const focusLogs = this.safeQueryTable('focus_logs', userId, false);
    const meditationSessions = this.safeQueryTable('meditation_sessions', userId, false);
    const journals = this.safeQueryTable('journals', userId, true);

    // 5. Nutrition
    const meals = this.safeQueryTable('meals', userId, true);
    const nutritionGoals = db.prepare('SELECT * FROM nutrition_goals WHERE user_id = ?').get(userId) || null;

    // 6. Goals
    const goals = this.safeQueryTable('goals', userId, true);
    const milestones = this.safeQueryTable('goal_milestones', userId, true);

    // 7. Performance
    const snapshots = db.prepare('SELECT * FROM performance_snapshots WHERE user_id = ? ORDER BY snapshot_date ASC').all(userId);
    const streaks = db.prepare('SELECT * FROM streaks WHERE user_id = ?').get(userId) || null;
    const reflections = this.safeQueryTable('reflections', userId, true);

    // 8. Notifications
    const notifications = this.safeQueryTable('notifications', userId, true);

    return {
      metadata: {
        app: 'DisciplineOS',
        version: '1.0',
        exported_at: new Date().toISOString(),
        user: {
          id: userRow.id,
          name: userRow.name,
          email: userRow.email,
        },
      },
      discipline: {
        tasks,
        habits,
        task_completions: taskCompletions,
      },
      body: {
        workouts,
        sleep_logs: sleepLogs,
        water_logs: waterLogs,
        step_logs: stepLogs,
        weight_logs: weightLogs,
      },
      mind: {
        mood_logs: moodLogs,
        energy_logs: energyLogs,
        stress_logs: stressLogs,
        focus_logs: focusLogs,
        meditation_sessions: meditationSessions,
        journals,
      },
      nutrition: {
        meals,
        nutrition_goals: nutritionGoals,
      },
      goals: {
        goals,
        milestones,
      },
      performance: {
        snapshots,
        streaks,
        reflections,
      },
      notifications,
    };
  }
}

export const reportsService = new ReportsService();
