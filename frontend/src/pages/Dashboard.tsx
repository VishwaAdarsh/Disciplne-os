import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Sparkles, PlusCircle } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import MetricCard from '../components/MetricCard';
import LiveActivityCard from '../components/LiveActivityCard';
import QuickActionsBar from '../components/QuickActionsBar';
import AreaTrendChartCard from '../components/charts/AreaTrendChartCard';
import { OverviewDashboardSkeleton } from '../components/OverviewSkeletons';
import { useOverviewStore } from '../store/overviewStore';
import { usePerformanceEngineStore } from '../store/performanceEngineStore';

// SPR-312 Integrated Overview Components
import { DailyCompletionCard } from '../components/overview/DailyCompletionCard';
import { ModuleSummariesGrid } from '../components/overview/ModuleSummariesGrid';

// Performance Engine Components
import PerformanceSummaryWidget from '../components/performance/PerformanceSummaryWidget';
import PerformanceComparisonCard from '../components/performance/PerformanceComparisonCard';
import PerformanceRecommendationsCard from '../components/performance/PerformanceRecommendationsCard';
import PerformanceReportsCard from '../components/performance/PerformanceReportsCard';

// Event & Real-Time Engine [SPR-208]
import { LiveSessionWidget } from '../components/events/LiveSessionWidget';
import { ActivityTimelineWidget } from '../components/events/ActivityTimelineWidget';
import { EventEngineInspector } from '../components/events/EventEngineInspector';

export default function Dashboard() {
  const navigate = useNavigate();
  const { overview, data, isLoading, error, refreshOverview } = useOverviewStore();
  const { performanceScore, dailyChange, highestScore, levelInfo } = usePerformanceEngineStore();

  const [activeCategory, setActiveCategory] = useState('All');

  // Hydrate overview on mount and when returning to dashboard
  useEffect(() => {
    refreshOverview();
  }, []);

  const streak = overview?.discipline.currentStreak ?? data.kpis.currentStreak;
  const longestStreak = overview?.discipline.longestStreak ?? data.kpis.longestStreak;
  const tasksCompleted = overview?.discipline.tasksCompletedToday ?? data.kpis.nonnegDone;
  const tasksTotal = overview?.discipline.tasksTotalToday ?? data.kpis.nonnegTotal;
  const taskCompletionRate = overview?.discipline.taskCompletionRate ?? 0;

  const streakData = [0, 1, 1, 2, 2, 3, streak];
  const xpData = [100, 150, 200, 250, 300, 350, performanceScore];
  const taskSparklineData = [0, 1, 1, 2, 2, 2, tasksCompleted];

  // Category filter navigation
  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    const routes: Record<string, string> = {
      Discipline: '/discipline',
      Body: '/body',
      Mind: '/mind',
      Nutrition: '/nutrition',
      Goals: '/goals',
    };
    if (routes[category]) {
      navigate(routes[category]);
    }
  };

  // Check if brand new user with 0 activity
  const isNewUser =
    overview !== null &&
    overview.discipline.tasksTotalToday === 0 &&
    overview.body.workouts.completedCount === 0 &&
    overview.nutrition.mealsLogged === 0 &&
    !overview.mind.mood.logged &&
    overview.goals.totalGoals === 0 &&
    performanceScore === 0;

  if (isLoading && !overview) {
    return <OverviewDashboardSkeleton />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* ERROR STATE BANNER */}
      {error && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#EF4444',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={18} />
            <span style={{ fontSize: '14px', fontWeight: 600 }}>{error}</span>
          </div>
          <button
            onClick={refreshOverview}
            style={{
              background: '#EF4444',
              color: '#FFF',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <RefreshCw size={14} />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* 1. GREETING & PAGE HEADER */}
      <PageHeader
        user={overview?.user.name || data.user}
        title="Performance Overview"
        subtitle={overview?.subtitle || data.subtitle}
        activeCategory={activeCategory}
        onSelectCategory={handleCategorySelect}
        categories={['All', 'Discipline', 'Body', 'Mind', 'Nutrition', 'Goals']}
      />

      {/* NEW USER ONBOARDING EMPTY STATE BANNER */}
      {isNewUser && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.08))',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            color: 'var(--text-main, #FFFFFF)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={20} color="#6366F1" />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
              Welcome to DisciplineOS! Your Daily Command Center is Ready
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted, #94A3B8)', lineHeight: 1.5 }}>
            No activities have been recorded yet today. Begin by completing a task in Discipline, logging a workout or meal, or setting your first goal to start generating your Performance Score.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '6px' }}>
            <button
              onClick={() => navigate('/discipline')}
              style={{
                background: '#6366F1',
                color: '#FFF',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <PlusCircle size={14} /> Add Discipline Task
            </button>
            <button
              onClick={() => navigate('/nutrition')}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                color: '#FFF',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Log First Meal
            </button>
            <button
              onClick={() => navigate('/goals')}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                color: '#FFF',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Set a Goal
            </button>
          </div>
        </div>
      )}

      {/* 2. CORE INTELLIGENCE PERFORMANCE SCORE BANNER (0-1000 KPI) */}
      <PerformanceSummaryWidget />

      {/* 3. DAILY EXECUTION INDEX (SPR-312 Daily Completion View) */}
      {overview && (
        <DailyCompletionCard dailyCompletion={overview.dailyCompletion} />
      )}

      {/* 4. QUICK ACTIONS BAR */}
      <QuickActionsBar />

      {/* 5. CORE MODULES SNAPSHOT GRID (SPR-312 Discipline, Body, Mind, Nutrition, Goals) */}
      {overview && (
        <ModuleSummariesGrid overview={overview} />
      )}

      {/* 6. PERFORMANCE TRAJECTORY COMPARISON & RECOMMENDATIONS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '16px' }}>
        <PerformanceComparisonCard />
        <PerformanceRecommendationsCard />
      </div>

      {/* 7. TODAY'S KPI CARDS (Real data from Discipline and Performance engine) */}
      <div className="mobile-kpi-grid grid-responsive-3" style={{ gap: '12px' }}>
        {/* CURRENT STREAK CARD */}
        <div onClick={() => navigate('/discipline')} style={{ cursor: 'pointer' }}>
          <MetricCard
            title="Current Streak"
            value={`🔥 ${streak} DAYS`}
            subtext={`Longest Streak: ${longestStreak} days`}
            badge="ON FIRE"
            badgeColor="#F59E0B"
            accentClass="text-gradient-streak"
            sparklineData={streakData}
            sparklineColor="#F59E0B"
            isUp={true}
          />
        </div>

        {/* OPERATOR LEVEL CARD */}
        <div onClick={() => navigate('/discipline')} style={{ cursor: 'pointer' }}>
          <MetricCard
            title="Operator Level"
            value={`${levelInfo.level.toUpperCase()}`}
            subtext={`Score: ${performanceScore} / 1000 (Best: ${highestScore})`}
            badge={`${dailyChange >= 0 ? '+' : ''}${dailyChange} TODAY`}
            badgeColor={levelInfo.color}
            accentClass="text-gradient-xp"
            sparklineData={xpData}
            sparklineColor={levelInfo.color}
            isUp={true}
            progressPercent={levelInfo.progressPercent}
            progressColor={`linear-gradient(90deg, ${levelInfo.color}, #C026D3)`}
          />
        </div>

        {/* TODAY PROGRESS CARD */}
        <div onClick={() => navigate('/discipline')} style={{ cursor: 'pointer' }}>
          <MetricCard
            title="Today's Tasks"
            value={`${tasksCompleted} / ${tasksTotal}`}
            subtext={`${taskCompletionRate}% complete today`}
            badge={tasksTotal > 0 && tasksCompleted === tasksTotal ? 'ALL COMPLETE' : 'IN PROGRESS'}
            badgeColor={tasksTotal > 0 && tasksCompleted === tasksTotal ? '#10B981' : '#6366F1'}
            accentClass={tasksTotal > 0 && tasksCompleted === tasksTotal ? 'text-gradient-success' : 'text-gradient-score'}
            sparklineData={taskSparklineData}
            sparklineColor="#10B981"
            isUp={true}
            progressPercent={taskCompletionRate}
            progressColor="linear-gradient(90deg, #10B981, #14B8A6)"
          />
        </div>
      </div>

      {/* 8. AUTOMATED PERFORMANCE REPORT CARD */}
      <PerformanceReportsCard />

      {/* 9. LIVE SESSION CARD & ACTIVITY TIMELINE */}
      <LiveActivityCard
        hasActiveSession={data.liveActivity.hasActiveSession}
        activeTask={data.liveActivity.activeTask}
        initialSeconds={data.liveActivity.elapsedSeconds}
        startTime={data.liveActivity.startTime}
        recentActivities={data.liveActivity.recentActivities}
      />

      {/* 10. EVENT ENGINE REAL-TIME NERVOUS SYSTEM (SPR-208) */}
      <LiveSessionWidget />
      <ActivityTimelineWidget />

      {/* 11. 30-DAY PERFORMANCE TREND */}
      <AreaTrendChartCard
        title="30-Day Performance Trajectory"
        subtitle="Overall performance index trend line"
        data={overview?.history30Days && overview.history30Days.length > 0 ? overview.history30Days : data.history30Days}
        dataKey="score"
        color="#6366F1"
        height={220}
        unit=" pts"
      />

      {/* FLOATING TELEMETRY INSPECTOR */}
      <EventEngineInspector />
    </div>
  );
}
