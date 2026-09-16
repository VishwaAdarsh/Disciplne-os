import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Dumbbell,
  Brain,
  Utensils,
  Target,
  ArrowRight,
  Droplets,
  Moon,
  Footprints,
  Flame,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import type { DailyOverviewDTO } from '../../types/overview';

interface ModuleSummariesGridProps {
  overview: DailyOverviewDTO;
}

export const ModuleSummariesGrid: React.FC<ModuleSummariesGridProps> = ({ overview }) => {
  const navigate = useNavigate();
  const { discipline, body, mind, nutrition, goals } = overview;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-main, #FFFFFF)' }}>
            Core Modules Snapshot
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted, #94A3B8)', margin: '4px 0 0 0' }}>
            Real-time daily progress across all integrated systems
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {/* 1. DISCIPLINE CARD */}
        <div
          onClick={() => navigate('/discipline')}
          style={{
            background: 'var(--card-bg, #111827)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '8px', borderRadius: '10px', color: '#6366F1' }}>
                  <ShieldCheck size={18} />
                </div>
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main, #FFFFFF)' }}>Discipline</span>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#6366F1',
                  background: 'rgba(99, 102, 241, 0.12)',
                  padding: '3px 8px',
                  borderRadius: '12px',
                }}
              >
                {discipline.taskCompletionRate}% DONE
              </span>
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted, #94A3B8)' }}>Tasks Completed</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#10B981', marginTop: '2px' }}>
                  {discipline.tasksCompletedToday} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/ {discipline.tasksTotalToday}</span>
                </div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted, #94A3B8)' }}>Active Streak</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#F59E0B', marginTop: '2px' }}>
                  🔥 {discipline.currentStreak} <span style={{ fontSize: '11px' }}>days</span>
                </div>
              </div>
            </div>

            {/* Habit rate */}
            <div style={{ fontSize: '12px', color: 'var(--text-muted, #94A3B8)', display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span>Habit Execution</span>
              <span style={{ fontWeight: 600, color: 'var(--text-main, #FFFFFF)' }}>
                {discipline.habitsCompletedToday} / {discipline.habitsTotal} habits ({discipline.habitCompletionRate}%)
              </span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${discipline.habitCompletionRate}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #6366F1, #8B5CF6)',
                  borderRadius: '3px',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginTop: '16px', fontSize: '12px', color: '#6366F1', fontWeight: 600 }}>
            <span>Open Discipline</span>
            <ArrowRight size={14} />
          </div>
        </div>

        {/* 2. BODY CARD */}
        <div
          onClick={() => navigate('/body')}
          style={{
            background: 'var(--card-bg, #111827)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '8px', borderRadius: '10px', color: '#10B981' }}>
                  <Dumbbell size={18} />
                </div>
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main, #FFFFFF)' }}>Body</span>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#10B981',
                  background: 'rgba(16, 185, 129, 0.12)',
                  padding: '3px 8px',
                  borderRadius: '12px',
                }}
              >
                {body.workouts.completedCount > 0 ? `${body.workouts.completedCount} WORKOUT` : 'REST / PENDING'}
              </span>
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted, #94A3B8)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Droplets size={12} color="#0EA5E9" />
                  <span>Hydration</span>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#0EA5E9', marginTop: '2px' }}>
                  {body.water.currentLiters}L <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/ {body.water.targetLiters}L</span>
                </div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted, #94A3B8)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Moon size={12} color="#8B5CF6" />
                  <span>Sleep</span>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#8B5CF6', marginTop: '2px' }}>
                  {body.sleep.logged ? `${body.sleep.durationHours}h` : 'No log'}
                </div>
              </div>
            </div>

            {/* Steps or Activity */}
            <div style={{ fontSize: '12px', color: 'var(--text-muted, #94A3B8)', display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Footprints size={12} /> Steps Target
              </span>
              <span style={{ fontWeight: 600, color: 'var(--text-main, #FFFFFF)' }}>
                {body.steps.current.toLocaleString()} / {body.steps.target.toLocaleString()} ({body.steps.progressPercent}%)
              </span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${body.steps.progressPercent}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #10B981, #059669)',
                  borderRadius: '3px',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginTop: '16px', fontSize: '12px', color: '#10B981', fontWeight: 600 }}>
            <span>Open Body</span>
            <ArrowRight size={14} />
          </div>
        </div>

        {/* 3. MIND CARD */}
        <div
          onClick={() => navigate('/mind')}
          style={{
            background: 'var(--card-bg, #111827)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: 'rgba(139, 92, 246, 0.15)', padding: '8px', borderRadius: '10px', color: '#8B5CF6' }}>
                  <Brain size={18} />
                </div>
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main, #FFFFFF)' }}>Mind</span>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#8B5CF6',
                  background: 'rgba(139, 92, 246, 0.12)',
                  padding: '3px 8px',
                  borderRadius: '12px',
                }}
              >
                {mind.mood.logged ? 'CHECKED IN' : 'PENDING CHECK-IN'}
              </span>
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted, #94A3B8)' }}>Daily Mood</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#A855F7', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{mind.mood.icon || '🙂'}</span>
                  <span>{mind.mood.currentMood || 'Unrecorded'}</span>
                </div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted, #94A3B8)' }}>Meditation</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#EC4899', marginTop: '2px' }}>
                  {mind.meditation.totalMinutes}m <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({mind.meditation.sessionsCount} sess)</span>
                </div>
              </div>
            </div>

            {/* Mind Vital Stats */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted, #94A3B8)' }}>
              <span>Energy: <strong style={{ color: '#FFF' }}>{mind.energy.level || '—'}</strong></span>
              <span>Stress: <strong style={{ color: '#FFF' }}>{mind.stress.level !== null ? `${mind.stress.level}/10` : '—'}</strong></span>
              <span>Journal: <strong style={{ color: '#FFF' }}>{mind.journal.todayEntriesCount} entries</strong></span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginTop: '16px', fontSize: '12px', color: '#8B5CF6', fontWeight: 600 }}>
            <span>Open Mind</span>
            <ArrowRight size={14} />
          </div>
        </div>

        {/* 4. NUTRITION CARD */}
        <div
          onClick={() => navigate('/nutrition')}
          style={{
            background: 'var(--card-bg, #111827)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '8px', borderRadius: '10px', color: '#F59E0B' }}>
                  <Utensils size={18} />
                </div>
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main, #FFFFFF)' }}>Nutrition</span>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#F59E0B',
                  background: 'rgba(245, 158, 11, 0.12)',
                  padding: '3px 8px',
                  borderRadius: '12px',
                }}
              >
                {nutrition.mealsLogged} MEALS LOGGED
              </span>
            </div>

            {/* Calories row */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '10px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted, #94A3B8)' }}>Calories Consumed</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {nutrition.calories.remaining} kcal remaining
                </div>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#F59E0B', marginTop: '2px' }}>
                {nutrition.calories.current} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/ {nutrition.calories.target} kcal</span>
              </div>
            </div>

            {/* Macros bar preview */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted, #94A3B8)', marginBottom: '6px' }}>
              <span>Protein: <strong style={{ color: '#10B981' }}>{nutrition.protein.current}g</strong> / {nutrition.protein.target}g</span>
              <span>Carbs: <strong style={{ color: '#0EA5E9' }}>{nutrition.carbs.current}g</strong></span>
              <span>Fat: <strong style={{ color: '#EC4899' }}>{nutrition.fat.current}g</strong></span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${nutrition.calories.progressPercent}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #F59E0B, #EA580C)',
                  borderRadius: '3px',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginTop: '16px', fontSize: '12px', color: '#F59E0B', fontWeight: 600 }}>
            <span>Open Nutrition</span>
            <ArrowRight size={14} />
          </div>
        </div>

        {/* 5. GOALS CARD */}
        <div
          onClick={() => navigate('/goals')}
          style={{
            background: 'var(--card-bg, #111827)',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '8px', borderRadius: '10px', color: '#06B6D4' }}>
                  <Target size={18} />
                </div>
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main, #FFFFFF)' }}>Goals</span>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#06B6D4',
                  background: 'rgba(6, 182, 212, 0.12)',
                  padding: '3px 8px',
                  borderRadius: '12px',
                }}
              >
                {goals.overallProgressPercent}% AVG PROGRESS
              </span>
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted, #94A3B8)' }}>Active Goals</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#06B6D4', marginTop: '2px' }}>
                  {goals.activeCount} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>of {goals.totalGoals}</span>
                </div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted, #94A3B8)' }}>Completed</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#10B981', marginTop: '2px' }}>
                  🏆 {goals.completedCount}
                </div>
              </div>
            </div>

            {/* Approaching Deadlines alert or status */}
            {goals.approachingDeadline.length > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#F59E0B' }}>
                <AlertCircle size={14} />
                <span>
                  <strong>{goals.approachingDeadline[0].title}</strong> due in {goals.approachingDeadline[0].daysRemaining}d
                </span>
              </div>
            ) : goals.overdueCount > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#EF4444' }}>
                <AlertCircle size={14} />
                <span>{goals.overdueCount} overdue goal(s) requiring attention</span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#10B981' }}>
                <CheckCircle2 size={14} />
                <span>All tracked goals on trajectory</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginTop: '16px', fontSize: '12px', color: '#06B6D4', fontWeight: 600 }}>
            <span>Open Goals</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </div>
  );
};
