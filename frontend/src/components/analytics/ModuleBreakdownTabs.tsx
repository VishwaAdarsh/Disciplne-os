import { useState } from 'react';
import {
  ShieldCheck,
  Dumbbell,
  Brain,
  Utensils,
  Target,
  Flame,
  CheckCircle2,
  Clock,
  Droplets,
  Moon,
  Footprints,
  Scale,
  Sparkles,
} from 'lucide-react';
import type {
  DisciplineAnalyticsDTO,
  BodyAnalyticsDTO,
  MindAnalyticsDTO,
  NutritionAnalyticsDTO,
  GoalsAnalyticsDTO,
} from '../../types/analytics';

interface ModuleBreakdownTabsProps {
  discipline: DisciplineAnalyticsDTO;
  body: BodyAnalyticsDTO;
  mind: MindAnalyticsDTO;
  nutrition: NutritionAnalyticsDTO;
  goals: GoalsAnalyticsDTO;
}

export const ModuleBreakdownTabs: React.FC<ModuleBreakdownTabsProps> = ({
  discipline,
  body,
  mind,
  nutrition,
  goals,
}) => {
  const [activeTab, setActiveTab] = useState<'discipline' | 'body' | 'mind' | 'nutrition' | 'goals'>('discipline');

  const tabs: Array<{ key: typeof activeTab; label: string; icon: React.ReactNode; color: string }> = [
    { key: 'discipline', label: 'Discipline', icon: <ShieldCheck size={16} />, color: '#6366F1' },
    { key: 'body', label: 'Body', icon: <Dumbbell size={16} />, color: '#10B981' },
    { key: 'mind', label: 'Mind', icon: <Brain size={16} />, color: '#8B5CF6' },
    { key: 'nutrition', label: 'Nutrition', icon: <Utensils size={16} />, color: '#F59E0B' },
    { key: 'goals', label: 'Goals', icon: <Target size={16} />, color: '#06B6D4' },
  ];

  return (
    <div
      style={{
        background: 'var(--card-bg, #111827)',
        border: '1px solid var(--card-border, rgba(255, 255, 255, 0.08))',
        borderRadius: '16px',
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
      }}
    >
      {/* HEADER & TABS BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-main, #FFFFFF)' }}>
            Module-Level Performance Breakdown
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted, #94A3B8)', margin: '2px 0 0 0' }}>
            Detailed quantitative metrics across individual operating domains
          </p>
        </div>

        <div style={{ display: 'flex', gap: '6px', background: 'rgba(255, 255, 255, 0.04)', padding: '4px', borderRadius: '10px' }}>
          {tabs.map((t) => {
            const isActive = activeTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: isActive ? t.color : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--text-muted, #94A3B8)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. DISCIPLINE PANEL */}
      {activeTab === 'discipline' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted, #94A3B8)' }}>Tasks Completed</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>
                {discipline.tasksCompleted} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/ {discipline.tasksCreated} created</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {discipline.completionRate}% completion rate
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted, #94A3B8)' }}>Habit Consistency</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#6366F1', marginTop: '4px' }}>
                {discipline.habitConsistencyRate}%
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Across {discipline.activeHabits} active habits
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted, #94A3B8)' }}>Streak Metrics</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#F59E0B', marginTop: '4px' }}>
                🔥 {discipline.currentStreak} <span style={{ fontSize: '12px' }}>days</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Longest record: {discipline.longestStreak} days
              </div>
            </div>
          </div>

          {/* Daily tasks completion list */}
          {discipline.dailyTaskCompletions.length > 0 && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                Active Task Completion Days
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {discipline.dailyTaskCompletions.map((d) => (
                  <span
                    key={d.date}
                    style={{
                      background: 'rgba(99, 102, 241, 0.1)',
                      border: '1px solid rgba(99, 102, 241, 0.25)',
                      borderRadius: '8px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      color: '#6366F1',
                    }}
                  >
                    <strong>{d.date}</strong>: {d.count} tasks
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. BODY PANEL */}
      {activeTab === 'body' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <Dumbbell size={14} color="#10B981" />
              <span>Workouts</span>
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>
              {body.totalWorkouts} sessions
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              {body.totalWorkoutMinutes}m · {body.totalCaloriesBurned} kcal burned
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <Moon size={14} color="#8B5CF6" />
              <span>Average Sleep</span>
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#8B5CF6', marginTop: '4px' }}>
              {body.avgSleepHours}h
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Quality index: {body.avgSleepQuality}%
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <Droplets size={14} color="#0EA5E9" />
              <span>Daily Hydration Avg</span>
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#0EA5E9', marginTop: '4px' }}>
              {body.avgDailyWaterLiters} L
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Avg Daily Steps: {body.avgDailySteps.toLocaleString()}
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <Scale size={14} color="#F59E0B" />
              <span>Weight Trajectory</span>
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#F59E0B', marginTop: '4px' }}>
              {body.latestWeightKg ? `${body.latestWeightKg} kg` : 'No logs'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              {body.weightChangeKg !== null ? `Change: ${body.weightChangeKg >= 0 ? '+' : ''}${body.weightChangeKg} kg` : 'No change tracked'}
            </div>
          </div>
        </div>
      )}

      {/* 3. MIND PANEL */}
      {activeTab === 'mind' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Average Stress</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#EF4444', marginTop: '4px' }}>
                {mind.avgStress !== null ? `${mind.avgStress} / 10` : 'No data'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Avg Focus: {mind.avgFocus !== null ? `${mind.avgFocus} / 10` : '—'}
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Meditation Practice</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#EC4899', marginTop: '4px' }}>
                {mind.meditationMinutes}m
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Across {mind.meditationSessions} sessions
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Reflections (Private)</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#8B5CF6', marginTop: '4px' }}>
                {mind.journalEntriesCount} entries
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Private reflection logs
              </div>
            </div>
          </div>

          {/* Mood Distribution */}
          {mind.moodDistribution.length > 0 ? (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                Mood Distribution in Period
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {mind.moodDistribution.map((m) => (
                  <span
                    key={m.mood}
                    style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid rgba(139, 92, 246, 0.25)',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      color: 'var(--text-main, #FFFFFF)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>{m.icon}</span>
                    <strong>{m.mood}</strong>: {m.count} ({m.percentage}%)
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              No mood logs recorded in this timeframe.
            </div>
          )}
        </div>
      )}

      {/* 4. NUTRITION PANEL */}
      {activeTab === 'nutrition' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Daily Calorie Intake</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#F59E0B', marginTop: '4px' }}>
              {nutrition.avgCalories} <span style={{ fontSize: '12px' }}>/ {nutrition.targetCalories} kcal</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Target Adherence: {nutrition.targetAdherenceRate}%
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Average Macronutrients</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px', display: 'flex', gap: '8px' }}>
              <span style={{ color: '#10B981' }}>{nutrition.avgProtein}g P</span>
              <span style={{ color: '#0EA5E9' }}>{nutrition.avgCarbs}g C</span>
              <span style={{ color: '#EC4899' }}>{nutrition.avgFat}g F</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
              Total meals logged: {nutrition.totalMealsLogged}
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Hydration Reference</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#0EA5E9', marginTop: '4px' }}>
              {body.avgDailyWaterLiters} L / day
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Sourced from Body water logs
            </div>
          </div>
        </div>
      )}

      {/* 5. GOALS PANEL */}
      {activeTab === 'goals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Goals in Period</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#06B6D4', marginTop: '4px' }}>
                {goals.goalsCreated} created
              </div>
              <div style={{ fontSize: '11px', color: '#10B981', marginTop: '4px' }}>
                🏆 {goals.goalsCompleted} completed
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Active Status</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                {goals.activeGoals} active
              </div>
              <div style={{ fontSize: '11px', color: goals.overdueGoals > 0 ? '#EF4444' : '#10B981', marginTop: '4px' }}>
                {goals.overdueGoals} overdue goals
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Average Progress</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>
                {goals.avgProgressPercent}%
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Across all tracked goals
              </div>
            </div>
          </div>

          {/* Goals Category Breakdown */}
          {goals.categoryBreakdown.length > 0 && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                Category Progress Breakdown
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                {goals.categoryBreakdown.map((c) => (
                  <div
                    key={c.category}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      padding: '10px 12px',
                      borderRadius: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}>
                      <span>{c.category}</span>
                      <span>{c.avgProgress}%</span>
                    </div>
                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', marginTop: '6px', overflow: 'hidden' }}>
                      <div style={{ width: `${c.avgProgress}%`, height: '100%', background: '#06B6D4', borderRadius: '2px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
