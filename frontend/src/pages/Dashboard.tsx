import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import MetricCard from '../components/MetricCard';
import LiveActivityCard from '../components/LiveActivityCard';
import QuickActionsBar from '../components/QuickActionsBar';
import AreaTrendChartCard from '../components/charts/AreaTrendChartCard';
import { OverviewDashboardSkeleton } from '../components/OverviewSkeletons';
import { useOverviewStore } from '../store/overviewStore';
import { usePerformanceEngineStore } from '../store/performanceEngineStore';

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
  const { data, isLoading, error, refreshOverview } = useOverviewStore();
  const { performanceScore, dailyChange, highestScore, levelInfo } = usePerformanceEngineStore();

  const [activeCategory, setActiveCategory] = useState('All');

  const nonnegs = data.nonNegotiables;
  const completedCount = nonnegs.filter((n) => n.completed).length;

  const streakData = [8, 9, 10, 10, 11, 11, data.kpis.currentStreak];
  const xpData = [500, 560, 620, 680, 710, 750, data.kpis.currentXp];
  const taskSparklineData = [1, 2, 2, 3, 3, 3, completedCount];

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

  if (isLoading) {
    return <OverviewDashboardSkeleton />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
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
        user={data.user}
        title="Performance Overview"
        subtitle={data.subtitle}
        activeCategory={activeCategory}
        onSelectCategory={handleCategorySelect}
        categories={['All', 'Discipline', 'Body', 'Mind', 'Nutrition', 'Goals']}
      />

      {/* 2. CORE INTELLIGENCE PERFORMANCE SCORE BANNER (0-1000 KPI) */}
      <PerformanceSummaryWidget />

      {/* 3. QUICK ACTIONS BAR */}
      <QuickActionsBar />

      {/* 4. PERFORMANCE TRAJECTORY COMPARISON & RECOMMENDATIONS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        <PerformanceComparisonCard />
        <PerformanceRecommendationsCard />
      </div>

      {/* 5. TODAY'S KPI CARDS */}
      <div className="mobile-kpi-grid grid-responsive-3" style={{ gap: '12px' }}>
        {/* CURRENT STREAK CARD */}
        <div onClick={() => navigate('/discipline')} style={{ cursor: 'pointer' }}>
          <MetricCard
            title="Current Streak"
            value={`🔥 ${data.kpis.currentStreak} DAYS`}
            subtext={`Longest Streak: ${data.kpis.longestStreak} days`}
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
            value={`${completedCount} / ${nonnegs.length}`}
            subtext={`${Math.round((completedCount / nonnegs.length) * 100)}% complete today`}
            badge={completedCount === nonnegs.length ? 'ALL COMPLETE' : 'IN PROGRESS'}
            badgeColor={completedCount === nonnegs.length ? '#10B981' : '#6366F1'}
            accentClass={completedCount === nonnegs.length ? 'text-gradient-success' : 'text-gradient-score'}
            sparklineData={taskSparklineData}
            sparklineColor="#10B981"
            isUp={true}
            progressPercent={(completedCount / nonnegs.length) * 100}
            progressColor="linear-gradient(90deg, #10B981, #14B8A6)"
          />
        </div>
      </div>

      {/* 6. AUTOMATED PERFORMANCE REPORT CARD */}
      <PerformanceReportsCard />

      {/* 7. LIVE SESSION CARD & ACTIVITY TIMELINE */}
      <LiveActivityCard
        hasActiveSession={data.liveActivity.hasActiveSession}
        activeTask={data.liveActivity.activeTask}
        initialSeconds={data.liveActivity.elapsedSeconds}
        startTime={data.liveActivity.startTime}
        recentActivities={data.liveActivity.recentActivities}
      />

      {/* 7. EVENT ENGINE REAL-TIME NERVOUS SYSTEM (SPR-208) */}
      <LiveSessionWidget />
      <ActivityTimelineWidget />

      {/* 8. 30-DAY PERFORMANCE TREND */}
      <AreaTrendChartCard
        title="30-Day Performance Trajectory"
        subtitle="Overall performance index trend line"
        data={data.history30Days}
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

