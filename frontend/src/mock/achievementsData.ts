export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'Discipline' | 'Body' | 'Mind' | 'Nutrition' | 'Goals';
  unlocked: boolean;
  unlockedDate?: string;
  progressPercent: number;
}

export const mockAchievementsData: AchievementItem[] = [
  {
    id: "ach-1",
    title: "FIRST FLAME",
    description: "Maintain a continuous 7-day streak across all non-negotiable activities.",
    icon: "🔥",
    category: "Discipline",
    unlocked: true,
    unlockedDate: "Jul 15, 2026",
    progressPercent: 100,
  },
  {
    id: "ach-2",
    title: "CONSISTENT OPERATOR",
    description: "Reach a 30-day performance streak with 80%+ execution.",
    icon: "⚡",
    category: "Discipline",
    unlocked: false,
    progressPercent: 40, // 12 of 30 days
  },
  {
    id: "ach-3",
    title: "PERFECT WEEK",
    description: "Complete 100% of Non-Negotiables for 7 consecutive days.",
    icon: "🛡️",
    category: "Discipline",
    unlocked: true,
    unlockedDate: "Jul 26, 2026",
    progressPercent: 100,
  },
  {
    id: "ach-4",
    title: "SELF-AWARE",
    description: "Complete 4 consecutive weekly reflections.",
    icon: "🧠",
    category: "Mind",
    unlocked: true,
    unlockedDate: "Jul 28, 2026",
    progressPercent: 100,
  },
  {
    id: "ach-5",
    title: "ELITE OPERATOR",
    description: "Achieve a Discipline Score of 900 or higher.",
    icon: "👑",
    category: "Goals",
    unlocked: false,
    progressPercent: 82, // 742 / 900
  },
  {
    id: "ach-6",
    title: "HYDRATION MASTER",
    description: "Hit your 3.0L water goal for 14 straight days.",
    icon: "💧",
    category: "Nutrition",
    unlocked: false,
    progressPercent: 71,
  },
];
