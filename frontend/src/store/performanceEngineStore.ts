import { create } from 'zustand';
import type {
  PerformanceLevelInfo,
  CategoryWeights,
  ModuleScores,
  PerformanceComparison,
  AchievementBadge,
  PerformanceRecommendation,
  PerformanceReport,
} from '../types/performance';

import { useDisciplineStore } from './disciplineStore';
import { useGoalsStore } from './goalsStore';
import { useBodyStore } from './bodyStore';
import { useMindStore } from './mindStore';
import { useNutritionStore } from './nutritionStore';

interface PerformanceState {
  performanceScore: number; // 0-1000 main KPI
  previousScore: number;
  highestScore: number;
  dailyChange: number;
  weeklyChange: number;
  monthlyChange: number;

  weights: CategoryWeights;
  moduleScores: ModuleScores;
  levelInfo: PerformanceLevelInfo;

  achievements: AchievementBadge[];
  recommendations: PerformanceRecommendation[];
  comparisons: {
    daily: PerformanceComparison;
    weekly: PerformanceComparison;
    monthly: PerformanceComparison;
  };
  reports: {
    daily: PerformanceReport;
    weekly: PerformanceReport;
    monthly: PerformanceReport;
  };

  // Engine Actions
  syncFromAllModules: () => void;
  updateWeights: (newWeights: Partial<CategoryWeights>) => void;
  calculateScore: (scores: ModuleScores, w: CategoryWeights) => number;
  evaluateLevel: (score: number) => PerformanceLevelInfo;
  evaluateAchievements: (score: number, scores: ModuleScores) => AchievementBadge[];
  evaluateRecommendations: (scores: ModuleScores) => PerformanceRecommendation[];
}

const DEFAULT_WEIGHTS: CategoryWeights = {
  discipline: 0.35,
  goals: 0.25,
  body: 0.15,
  mind: 0.15,
  nutrition: 0.10,
};

export const usePerformanceEngineStore = create<PerformanceState>((set, get) => {
  const initialModuleScores: ModuleScores = {
    discipline: 82,
    goals: 84,
    body: 78,
    mind: 82,
    nutrition: 81,
  };

  const calculateScoreInternal = (scores: ModuleScores, w: CategoryWeights): number => {
    const raw =
      scores.discipline * w.discipline +
      scores.goals * w.goals +
      scores.body * w.body +
      scores.mind * w.mind +
      scores.nutrition * w.nutrition;
    return Math.min(1000, Math.max(0, Math.round(raw * 10)));
  };

  const initialScore = calculateScoreInternal(initialModuleScores, DEFAULT_WEIGHTS);

  const evaluateLevelInternal = (score: number): PerformanceLevelInfo => {
    if (score >= 900) {
      return {
        level: 'Master',
        minScore: 900,
        maxScore: 1000,
        color: '#F59E0B',
        progressPercent: Math.min(100, Math.round(((score - 900) / 100) * 100)),
      };
    }
    if (score >= 800) {
      return {
        level: 'Elite',
        minScore: 800,
        maxScore: 899,
        color: '#8B5CF6',
        progressPercent: Math.min(100, Math.round(((score - 800) / 100) * 100)),
      };
    }
    if (score >= 600) {
      return {
        level: 'Performer',
        minScore: 600,
        maxScore: 799,
        color: '#6366F1',
        progressPercent: Math.min(100, Math.round(((score - 600) / 200) * 100)),
      };
    }
    if (score >= 400) {
      return {
        level: 'Builder',
        minScore: 400,
        maxScore: 599,
        color: '#10B981',
        progressPercent: Math.min(100, Math.round(((score - 400) / 200) * 100)),
      };
    }
    if (score >= 200) {
      return {
        level: 'Explorer',
        minScore: 200,
        maxScore: 399,
        color: '#0EA5E9',
        progressPercent: Math.min(100, Math.round(((score - 200) / 200) * 100)),
      };
    }
    return {
      level: 'Starter',
      minScore: 0,
      maxScore: 199,
      color: '#6B7280',
      progressPercent: Math.min(100, Math.round((score / 200) * 100)),
    };
  };

  const evaluateAchievementsInternal = (
    score: number,
    scores: ModuleScores
  ): AchievementBadge[] => [
    {
      id: 'ach-1',
      title: 'FIRST FLAME',
      description: 'Maintain a continuous 7-day streak across all non-negotiables.',
      icon: '🔥',
      category: 'Discipline',
      unlocked: true,
      unlockedDate: 'Jul 15, 2026',
      progressPercent: 100,
    },
    {
      id: 'ach-2',
      title: 'CONSISTENT OPERATOR',
      description: 'Reach a 30-day performance streak with 80%+ execution.',
      icon: '⚡',
      category: 'Discipline',
      unlocked: score >= 750,
      progressPercent: score >= 750 ? 100 : 70,
    },
    {
      id: 'ach-3',
      title: 'PERFECT WEEK',
      description: 'Complete 100% of Non-Negotiables for 7 consecutive days.',
      icon: '🛡️',
      category: 'Discipline',
      unlocked: true,
      unlockedDate: 'Jul 26, 2026',
      progressPercent: 100,
    },
    {
      id: 'ach-4',
      title: 'SELF-AWARE',
      description: 'Log 10 daily mind check-ins & reflections.',
      icon: '🧠',
      category: 'Mind',
      unlocked: true,
      unlockedDate: 'Jul 28, 2026',
      progressPercent: 100,
    },
    {
      id: 'ach-5',
      title: 'MASTER OPERATOR',
      description: 'Achieve a Performance Score of 800 or higher.',
      icon: '👑',
      category: 'Goals',
      unlocked: score >= 800,
      progressPercent: Math.min(100, Math.round((score / 800) * 100)),
    },
    {
      id: 'ach-6',
      title: 'HYDRATION MASTER',
      description: 'Hit your 3.0L water goal for 14 straight days.',
      icon: '💧',
      category: 'Nutrition',
      unlocked: scores.nutrition >= 85,
      progressPercent: Math.min(100, Math.round((scores.nutrition / 85) * 100)),
    },
  ];

  const evaluateRecommendationsInternal = (
    scores: ModuleScores
  ): PerformanceRecommendation[] => {
    const recs: PerformanceRecommendation[] = [];

    if (scores.nutrition < 85) {
      recs.push({
        id: 'rec-1',
        title: 'Drink 500ml Hydration',
        actionText: 'Log +500ml water to complete your 3.0L daily goal.',
        category: 'nutrition',
        icon: 'Droplet',
        priority: 'High',
      });
    }

    if (scores.body < 85) {
      recs.push({
        id: 'rec-2',
        title: 'Log Workout Session',
        actionText: 'Complete today\'s 45m Strength Training workout to boost Body Score.',
        category: 'body',
        icon: 'Dumbbell',
        priority: 'High',
      });
    }

    if (scores.mind < 85) {
      recs.push({
        id: 'rec-3',
        title: '10m Mindfulness Meditation',
        actionText: 'Practice 10 minutes of guided meditation to increase clarity.',
        category: 'mind',
        icon: 'Brain',
        priority: 'Medium',
      });
    }

    if (scores.discipline < 90) {
      recs.push({
        id: 'rec-4',
        title: 'Finish 1 Non-Negotiable',
        actionText: 'Check off your remaining daily non-negotiable task.',
        category: 'discipline',
        icon: 'ShieldCheck',
        priority: 'Medium',
      });
    }

    return recs;
  };

  return {
    performanceScore: initialScore,
    previousScore: initialScore - 18,
    highestScore: 815,
    dailyChange: 18,
    weeklyChange: 32,
    monthlyChange: 81,

    weights: DEFAULT_WEIGHTS,
    moduleScores: initialModuleScores,
    levelInfo: evaluateLevelInternal(initialScore),

    achievements: evaluateAchievementsInternal(initialScore, initialModuleScores),
    recommendations: evaluateRecommendationsInternal(initialModuleScores),

    comparisons: {
      daily: {
        period: 'daily',
        currentScore: initialScore,
        previousScore: initialScore - 18,
        diff: 18,
        percentChange: 2.2,
        direction: 'up',
      },
      weekly: {
        period: 'weekly',
        currentScore: initialScore,
        previousScore: initialScore - 32,
        diff: 32,
        percentChange: 4.0,
        direction: 'up',
      },
      monthly: {
        period: 'monthly',
        currentScore: initialScore,
        previousScore: initialScore - 81,
        diff: 81,
        percentChange: 10.9,
        direction: 'up',
      },
    },

    reports: {
      daily: {
        period: 'daily',
        totalScore: initialScore,
        level: evaluateLevelInternal(initialScore).level,
        bestCategory: 'Goals',
        weakestCategory: 'Body',
        recommendationsCount: 2,
        summary: 'Solid execution today! Goals and Discipline scores lead overall performance.',
      },
      weekly: {
        period: 'weekly',
        totalScore: initialScore,
        level: evaluateLevelInternal(initialScore).level,
        bestCategory: 'Discipline',
        weakestCategory: 'Body',
        recommendationsCount: 3,
        summary: 'Strong weekly trend (+32 pts). Consistent execution on non-negotiable tasks.',
      },
      monthly: {
        period: 'monthly',
        totalScore: initialScore,
        level: evaluateLevelInternal(initialScore).level,
        bestCategory: 'Goals',
        weakestCategory: 'Nutrition',
        recommendationsCount: 4,
        summary: 'Monthly performance increased by +81 pts. Achieved Builder to Performer level progression.',
      },
    },

    calculateScore: calculateScoreInternal,
    evaluateLevel: evaluateLevelInternal,
    evaluateAchievements: evaluateAchievementsInternal,
    evaluateRecommendations: evaluateRecommendationsInternal,

    updateWeights: (newWeights) => {
      const updated = { ...get().weights, ...newWeights };
      set({ weights: updated });
      get().syncFromAllModules();
    },

    syncFromAllModules: () => {
      // Pull scores from state stores
      const dScore = useDisciplineStore.getState().analytics?.disciplineScore || 82;
      const gScore = useGoalsStore.getState().goalScore || 84;
      const bScore = useBodyStore.getState().bodyScore || 78;
      const mScore = useMindStore.getState().mindScore || 82;
      const nScore = useNutritionStore.getState().nutritionScore || 81;

      const currentModuleScores: ModuleScores = {
        discipline: dScore,
        goals: gScore,
        body: bScore,
        mind: mScore,
        nutrition: nScore,
      };

      const weights = get().weights;
      const newTotalScore = calculateScoreInternal(currentModuleScores, weights);
      const newLevelInfo = evaluateLevelInternal(newTotalScore);
      const newAchievements = evaluateAchievementsInternal(newTotalScore, currentModuleScores);
      const newRecommendations = evaluateRecommendationsInternal(currentModuleScores);

      const diff = newTotalScore - get().previousScore;

      set({
        moduleScores: currentModuleScores,
        performanceScore: newTotalScore,
        highestScore: Math.max(get().highestScore, newTotalScore),
        dailyChange: diff,
        levelInfo: newLevelInfo,
        achievements: newAchievements,
        recommendations: newRecommendations,
        comparisons: {
          ...get().comparisons,
          daily: {
            period: 'daily',
            currentScore: newTotalScore,
            previousScore: get().previousScore,
            diff,
            percentChange: Number(((diff / (get().previousScore || 1)) * 100).toFixed(1)),
            direction: diff >= 0 ? 'up' : 'down',
          },
        },
      });
    },
  };
});

// REAL-TIME AUTO SUBSCRIBERS ACROSS ALL MODULE STORES
if (typeof window !== 'undefined') {
  useDisciplineStore.subscribe(() => {
    usePerformanceEngineStore.getState().syncFromAllModules();
  });
  useGoalsStore.subscribe(() => {
    usePerformanceEngineStore.getState().syncFromAllModules();
  });
  useBodyStore.subscribe(() => {
    usePerformanceEngineStore.getState().syncFromAllModules();
  });
  useMindStore.subscribe(() => {
    usePerformanceEngineStore.getState().syncFromAllModules();
  });
  useNutritionStore.subscribe(() => {
    usePerformanceEngineStore.getState().syncFromAllModules();
  });
}
