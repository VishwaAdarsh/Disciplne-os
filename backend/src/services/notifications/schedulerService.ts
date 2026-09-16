/**
 * In-Process Background Scheduler Service (SPR-315 / ARCH-009)
 * Handles time-based reminders, daily routine scheduled alerts, and goal deadline monitoring.
 */

import db from '../../db';
import { notificationRepository } from '../../repositories/notifications/notificationRepository';
import { notificationService } from './notificationService';

export class SchedulerService {
  private timer: NodeJS.Timeout | null = null;
  private isRunning = false;

  start(intervalMs: number = 60000): void {
    if (this.timer) return;
    this.isRunning = true;
    console.log(`⏱️ Scheduler Service started (interval: ${intervalMs}ms)`);

    // Initial check on boot
    this.tick().catch((err) => console.error('[Scheduler] Initial tick error:', err));

    this.timer = setInterval(async () => {
      if (!this.isRunning) return;
      try {
        await this.tick();
      } catch (err) {
        console.error('[Scheduler] Tick error:', err);
      }
    }, intervalMs);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
    console.log('⏱️ Scheduler Service stopped');
  }

  /**
   * Main scheduler tick logic - evaluates reminders and goal deadlines
   */
  async tick(referenceDate: Date = new Date()): Promise<{ remindersTriggered: number; deadlineAlerts: number }> {
    let remindersTriggered = 0;
    let deadlineAlerts = 0;

    const todayDateStr = referenceDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    const hours = String(referenceDate.getHours()).padStart(2, '0');
    const minutes = String(referenceDate.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${hours}:${minutes}`;

    const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const currentDayName = dayNames[referenceDate.getDay()];

    // 1. Check Active Reminders
    try {
      const activeReminders = await notificationRepository.findActiveReminders();

      for (const reminder of activeReminders) {
        // Time match check
        if (reminder.time_of_day !== currentTimeStr) {
          continue;
        }

        // Day of week check
        let parsedDays: string[] = [];
        try {
          parsedDays = JSON.parse(reminder.days_of_week);
        } catch {
          parsedDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        }

        if (!parsedDays.includes(currentDayName)) {
          continue;
        }

        // De-duplication check: avoid triggering more than once on the same day
        if (reminder.last_triggered_at && reminder.last_triggered_at.startsWith(todayDateStr)) {
          continue;
        }

        // Trigger notification
        const actionUrl = this.getActionUrlForCategory(reminder.category);

        await notificationService.createNotification({
          userId: reminder.user_id,
          title: `⏰ ${reminder.title}`,
          message: `Scheduled reminder: ${reminder.title}. Stay disciplined!`,
          type: 'reminder',
          priority: 'normal',
          actionUrl,
          entityType: reminder.entity_type || 'reminder',
          entityId: reminder.id,
        });

        // Update last_triggered_at to prevent duplicate triggers
        await notificationRepository.updateLastTriggered(reminder.id, referenceDate.toISOString());
        remindersTriggered++;
      }
    } catch (err) {
      console.error('[Scheduler] Error checking reminders:', err);
    }

    // 2. Check Goal Deadlines
    try {
      deadlineAlerts = await this.checkGoalDeadlines(referenceDate);
    } catch (err) {
      console.error('[Scheduler] Error checking goal deadlines:', err);
    }

    return { remindersTriggered, deadlineAlerts };
  }

  /**
   * Scans active goals with approaching or overdue target dates
   */
  async checkGoalDeadlines(referenceDate: Date = new Date()): Promise<number> {
    let count = 0;
    const todayStr = referenceDate.toISOString().split('T')[0];
    const todayMs = new Date(todayStr).getTime();

    // Query active goals with deadlines
    const goals = db
      .prepare(
        `SELECT id, user_id, title, deadline, status
         FROM goals
         WHERE deleted_at IS NULL
           AND deadline IS NOT NULL
           AND status NOT IN ('Completed', 'Cancelled')`
      )
      .all() as Array<{
        id: string;
        user_id: string;
        title: string;
        deadline: string;
        status: string;
      }>;

    for (const goal of goals) {
      const targetMs = new Date(goal.deadline).getTime();
      if (isNaN(targetMs)) continue;

      const diffDays = Math.floor((targetMs - todayMs) / (1000 * 3600 * 24));

      // Approaching deadline: 0, 1, or 2 days remaining
      if (diffDays >= 0 && diffDays <= 2) {
        const hasRecent = await notificationRepository.hasRecentNotification(
          goal.user_id,
          'goal',
          goal.id,
          'goal',
          24 // Limit to 1 alert every 24 hours
        );

        if (!hasRecent) {
          const dayLabel = diffDays === 0 ? 'today' : diffDays === 1 ? 'tomorrow' : 'in 2 days';
          await notificationService.createNotification({
            userId: goal.user_id,
            title: `⏰ Goal Deadline Approaching: ${goal.title}`,
            message: `Target "${goal.title}" is due ${dayLabel}. Review your milestones and progress.`,
            type: 'goal',
            priority: 'high',
            actionUrl: '/goals',
            entityType: 'goal',
            entityId: goal.id,
          });
          count++;
        }
      } else if (diffDays < 0) {
        // Overdue goal
        const hasRecent = await notificationRepository.hasRecentNotification(
          goal.user_id,
          'goal',
          goal.id,
          'goal',
          48 // Limit to 1 alert every 48 hours for overdue
        );

        if (!hasRecent) {
          await notificationService.createNotification({
            userId: goal.user_id,
            title: `⚠️ Goal Overdue: ${goal.title}`,
            message: `Target "${goal.title}" passed its deadline (${goal.deadline}). Complete remaining items or adjust your plan.`,
            type: 'goal',
            priority: 'high',
            actionUrl: '/goals',
            entityType: 'goal',
            entityId: goal.id,
          });
          count++;
        }
      }
    }

    return count;
  }

  /**
   * Initializes default daily routine reminders if user has none
   */
  async ensureDefaultReminders(userId: string): Promise<void> {
    const existing = await notificationRepository.findReminders(userId);
    if (existing.length > 0) return;

    const defaultRoutines = [
      {
        title: '🌅 Morning Routine & Daily Plan',
        category: 'discipline',
        timeOfDay: '08:00',
        entityType: 'routine',
      },
      {
        title: '💧 Midday Focus & Hydration Check',
        category: 'body',
        timeOfDay: '13:00',
        entityType: 'routine',
      },
      {
        title: '🌙 Evening Review & Wind-down',
        category: 'mind',
        timeOfDay: '21:00',
        entityType: 'routine',
      },
    ];

    for (const routine of defaultRoutines) {
      await notificationService.createReminder({
        userId,
        title: routine.title,
        category: routine.category,
        entityType: routine.entityType,
        timeOfDay: routine.timeOfDay,
        daysOfWeek: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        isEnabled: true,
      });
    }
  }

  private getActionUrlForCategory(category: string): string {
    switch (category?.toLowerCase()) {
      case 'discipline':
        return '/discipline';
      case 'body':
        return '/body';
      case 'nutrition':
        return '/nutrition';
      case 'mind':
        return '/mind';
      case 'goals':
        return '/goals';
      default:
        return '/';
    }
  }
}

export const schedulerService = new SchedulerService();
