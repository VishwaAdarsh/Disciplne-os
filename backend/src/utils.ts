import { randomBytes } from 'crypto';

export function generateId(): string {
  return randomBytes(12).toString('hex');
}

export function today(): string {
  const dt = new Date();
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function prevDateStr(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() - 1);
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getWeekStart(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const dayStr = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${dayStr}`;
}

export function daysBetween(d1: string, d2: string): number {
  const t1 = new Date(d1).getTime();
  const t2 = new Date(d2).getTime();
  return Math.round(Math.abs(t2 - t1) / (1000 * 60 * 60 * 24));
}

export function calculateDisciplineScore(params: {
  completionRate: number;
  streakDays: number;
  reflectionAvg: number;
  reflectionCount: number;
}): number {
  const { completionRate, streakDays, reflectionAvg, reflectionCount } = params;
  const taskScore = Math.round(completionRate * 400);
  const streakBonus = Math.min(300, Math.round(streakDays * 10));
  const reflectBase = Math.min(300, Math.round((reflectionAvg / 5) * 200 + reflectionCount * 10));
  return Math.min(1000, taskScore + streakBonus + reflectBase);
}

export function getScoreTier(score: number): string {
  if (score >= 900) return 'Elite';
  if (score >= 750) return 'Consistent';
  if (score >= 500) return 'Building';
  if (score >= 250) return 'Starting';
  return 'Dormant';
}

export function getSmartMotivation(params: {
  score: number;
  streak: number;
  completionRate: number;
}): { message: string; type: 'encouragement' | 'challenge' | 'warning' | 'celebration' } {
  const { score, streak, completionRate } = params;
  if (streak === 0) return { message: "Every expert was once a beginner. Start today.", type: 'encouragement' };
  if (completionRate < 0.5) return { message: "You're below 50% today. Your future self is watching.", type: 'warning' };
  if (streak >= 30) return { message: `${streak} days. You've built something real. Don't stop now.`, type: 'celebration' };
  if (streak >= 7) return { message: `${streak}-day streak. The compound effect is kicking in.`, type: 'challenge' };
  return { message: `Day ${streak}. Discipline is a skill. You're practicing it.`, type: 'encouragement' };
}
