import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle, AlertTriangle, RefreshCw, ChevronRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import PerformanceComparisonCard from '../components/PerformanceComparisonCard';
import PerformanceSummary from '../components/PerformanceSummary';
import RadialScoreCard from '../components/RadialScoreCard';
import MetricCard from '../components/MetricCard';
import LiveActivityCard from '../components/LiveActivityCard';
import PersonalInsightsCard from '../components/PersonalInsightsCard';
import QuickActionsBar from '../components/QuickActionsBar';
import WeeklyPreviewCard from '../components/WeeklyPreviewCard';
import AreaTrendChartCard from '../components/charts/AreaTrendChartCard';
import { OverviewDashboardSkeleton } from '../components/OverviewSkeletons';
import { useOverviewStore } from '../store/overviewStore';

export default function Dashboard() {
  const navigate = useNavigate();
  const { data, isLoading, error, refreshOverview } = useOverviewStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '90D'>('30D');

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
      {/* ERROR STATE BANNER (PRD Section 21) */}
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

      {/* 1. GREETING SECTION (PRD Section 5) */}
      <PageHeader
        user={data.user}
        title="Performance Overview"
        subtitle={data.subtitle}
        activeCategory={activeCategory}
        onSelectCategory={handleCategorySelect}
        categories={['All', 'Discipline', 'Body', 'Mind', 'Nutrition', 'Goals']}
      />

      {/* 2. QUICK ACTIONS BAR (PRD Section 15) */}
      <QuickActionsBar />

      {/* 3. PERFORMANCE COMPARISON SECTION (PRD Section 6) */}
      <PerformanceComparisonCard comparisons={data.comparisons} />

      {/* 4. OVERALL PERFORMANCE SCORE & CATEGORY SCORES (PRD Section 7 & 8) */}
      <PerformanceSummary
        comparisons={data.comparisons}
        categoryScores={data.categoryScores}
      />

      {/* 5. TODAY'S KPI CARDS (PRD Section 9) */}
      <div className="mobile-kpi-grid grid-responsive-3" style={{ gap: '12px' }}>
        {/* OVERALL PERFORMANCE SCORE / DISCIPLINE SCORE */}
        <div onClick={() => navigate('/discipline')} style={{ cursor: 'pointer' }}>
          <RadialScoreCard
            score={data.kpis.disciplineScore}
            maxScore={data.kpis.maxDisciplineScore}
            tier={data.kpis.scoreTier}
            weeklyChange={data.kpis.scoreChangeThisWeek}
          />
        </div>

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
            footer={
              <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                {Array.from({ length: 14 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: '6px',
                      borderRadius: '4px',
                      background: i < data.kpis.currentStreak ? '#F59E0B' : 'var(--card-border)',
                    }}
                  />
                ))}
              </div>
            }
          />
        </div>

        {/* OPERATOR LEVEL CARD */}
        <div onClick={() => navigate('/discipline')} style={{ cursor: 'pointer' }}>
          <MetricCard
            title="Operator Level"
            value={`LEVEL 0${data.kpis.operatorLevel}`}
            subtext={`${data.kpis.targetXp - data.kpis.currentXp} XP until Level 0${data.kpis.operatorLevel + 1}`}
            badge="LVL PROGRESS"
            badgeColor="#8B5CF6"
            accentClass="text-gradient-xp"
            sparklineData={xpData}
            sparklineColor="#8B5CF6"
            isUp={true}
            progressPercent={(data.kpis.currentXp / data.kpis.targetXp) * 100}
            progressColor="linear-gradient(90deg, #7C3AED, #C026D3)"
            footer={
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>{data.kpis.currentXp} XP</span>
                <span>{data.kpis.targetXp} XP</span>
              </div>
            }
          />
        </div>

        {/* TODAY PROGRESS CARD */}
        <div onClick={() => navigate('/discipline')} style={{ cursor: 'pointer' }}>
          <MetricCard
            title="Today's Progress"
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

      {/* 6. LIVE SESSION CARD & ACTIVITY TIMELINE (PRD Section 10 & 12) */}
      <LiveActivityCard
        hasActiveSession={data.liveActivity.hasActiveSession}
        activeTask={data.liveActivity.activeTask}
        initialSeconds={data.liveActivity.elapsedSeconds}
        startTime={data.liveActivity.startTime}
        recentActivities={data.liveActivity.recentActivities}
      />

      {/* 7. TODAY'S TASKS PREVIEW & 30-DAY PERFORMANCE TREND (PRD Section 11 & 13) */}
      <div className="grid-responsive-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {/* TODAY'S TASKS PREVIEW CARD (PRD Section 11 - Read-Only Navigation) */}
        <div
          onClick={() => navigate('/discipline')}
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: 'var(--card-radius, 16px)',
            boxShadow: 'var(--card-shadow)',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="#F59E0B" />
              <h2 className="font-sekuya" style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                Today's Non-Negotiables
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#10B981', fontWeight: 700 }}>
              <span>{completedCount} / {nonnegs.length}</span>
              <ChevronRight size={14} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {nonnegs.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ x: 2 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: item.completed ? '1px solid rgba(16,185,129,0.25)' : '1px solid var(--card-border)',
                  background: item.completed ? 'rgba(16,185,129,0.04)' : 'var(--input-bg)',
                  transition: 'all 0.15s ease',
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: item.completed ? 'none' : '2px solid var(--text-muted)',
                    background: item.completed ? '#10B981' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {item.completed && <CheckCircle size={14} color="#FFF" />}
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: item.completed ? 'var(--text-muted)' : 'var(--text-main)',
                      textDecoration: item.completed ? 'line-through' : 'none',
                    }}
                  >
                    {item.title}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    ⏰ {item.time}
                  </div>
                </div>

                <div className="font-sekuya text-gradient-streak" style={{ fontSize: '12px', fontWeight: 700 }}>
                  🔥 {item.streakDays}d
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 30-DAY PERFORMANCE TREND CHART (PRD Section 13 & 20) */}
        {data.history30Days.length > 0 ? (
          <AreaTrendChartCard
            title="Performance Score Trend"
            subtitle="30-day historical performance score tracking"
            data={data.history30Days.map((h) => ({ date: h.day, score: h.score }))}
            dataKey="score"
            color="#6366F1"
            height={240}
            unit=" pts"
            timeframes={['7D', '30D', '90D']}
          />
        ) : (
          /* Empty Chart State (PRD Section 20) */
          <div
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: 'var(--card-radius, 16px)',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              minHeight: '240px',
              color: 'var(--text-muted)',
            }}
          >
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
              No historical data yet
            </div>
            <div style={{ fontSize: '13px', maxWidth: '280px' }}>
              Complete today's activities to build your first trend.
            </div>
          </div>
        )}
      </div>

      {/* 8. AI INSIGHTS & WEEKLY PREVIEW SECTION (PRD Section 14 & 16) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        <PersonalInsightsCard insights={data.insights} />
        <WeeklyPreviewCard weeklyPreview={data.weeklyPreview} />
      </div>
    </div>
  );
}
