import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import PerformanceSummary from '../components/PerformanceSummary';
import RadialScoreCard from '../components/RadialScoreCard';
import MetricCard from '../components/MetricCard';
import LiveActivityCard from '../components/LiveActivityCard';
import PersonalInsightsCard from '../components/PersonalInsightsCard';
import DonutChartCard from '../components/charts/DonutChartCard';
import BarChartCard from '../components/charts/BarChartCard';
import AreaTrendChartCard from '../components/charts/AreaTrendChartCard';
import { mockOverviewData } from '../mock/dashboardData';

export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [nonnegs, setNonnegs] = useState(mockOverviewData.nonNegotiables);

  const toggleTask = (id: string) => {
    setNonnegs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const completedCount = nonnegs.filter((n) => n.completed).length;

  const streakData = [8, 9, 10, 10, 11, 11, 12];
  const xpData = [500, 560, 620, 680, 710, 750, 780];
  const taskSparklineData = [1, 2, 2, 3, 3, 3, completedCount];

  const categoryBalanceData = [
    { name: 'Discipline', value: mockOverviewData.categoryScores.discipline, color: '#6366F1' },
    { name: 'Body', value: mockOverviewData.categoryScores.body, color: '#10B981' },
    { name: 'Mind', value: mockOverviewData.categoryScores.mind, color: '#8B5CF6' },
    { name: 'Nutrition', value: mockOverviewData.categoryScores.nutrition, color: '#F59E0B' },
    { name: 'Goals', value: mockOverviewData.categoryScores.goals, color: '#06B6D4' },
  ];

  const taskDonutData = [
    { name: 'Completed', value: completedCount, color: '#10B981' },
    { name: 'Remaining', value: Math.max(0, nonnegs.length - completedCount), color: '#6366F1' },
  ];

  const weeklyBarData = mockOverviewData.history30Days.slice(-7).map((d) => ({
    name: d.day,
    value: d.score,
    color: d.isToday ? '#10B981' : '#6366F1',
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* TOP AREA: Greeting & Category Filter Pills */}
      <PageHeader
        greeting={mockOverviewData.greeting + ', ' + mockOverviewData.user}
        title="Performance Overview"
        subtitle={mockOverviewData.subtitle}
        dateStr={mockOverviewData.dateStr}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        categories={['All', 'Discipline', 'Body', 'Mind', 'Nutrition', 'Goals']}
      />

      {/* PERFORMANCE SUMMARY SECTION */}
      <PerformanceSummary
        comparisons={mockOverviewData.comparisons}
        categoryScores={mockOverviewData.categoryScores}
      />

      {/* PRIMARY KPI CARDS GRID */}
      <div className="mobile-kpi-grid grid-responsive-3" style={{ gap: '12px' }}>
        {/* DISCIPLINE SCORE RADIAL CARD */}
        <RadialScoreCard
          score={mockOverviewData.kpis.disciplineScore}
          maxScore={mockOverviewData.kpis.maxDisciplineScore}
          tier={mockOverviewData.kpis.scoreTier}
          weeklyChange={mockOverviewData.kpis.scoreChangeThisWeek}
        />

        {/* CURRENT STREAK CARD */}
        <MetricCard
          title="Current Streak"
          value={`🔥 ${mockOverviewData.kpis.currentStreak} DAYS`}
          subtext={`Longest Streak: ${mockOverviewData.kpis.longestStreak} days`}
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
                    background: i < mockOverviewData.kpis.currentStreak ? '#F59E0B' : 'var(--card-border)',
                  }}
                />
              ))}
            </div>
          }
        />

        {/* OPERATOR LEVEL CARD */}
        <MetricCard
          title="Operator Level"
          value={`LEVEL 0${mockOverviewData.kpis.operatorLevel}`}
          subtext={`${mockOverviewData.kpis.targetXp - mockOverviewData.kpis.currentXp} XP until Level 0${mockOverviewData.kpis.operatorLevel + 1}`}
          badge="LVL PROGRESS"
          badgeColor="#8B5CF6"
          accentClass="text-gradient-xp"
          sparklineData={xpData}
          sparklineColor="#8B5CF6"
          isUp={true}
          progressPercent={(mockOverviewData.kpis.currentXp / mockOverviewData.kpis.targetXp) * 100}
          progressColor="linear-gradient(90deg, #7C3AED, #C026D3)"
          footer={
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
              <span>{mockOverviewData.kpis.currentXp} XP</span>
              <span>{mockOverviewData.kpis.targetXp} XP</span>
            </div>
          }
        />

        {/* TODAY NON-NEGOTIABLES SUMMARY CARD */}
        <MetricCard
          title="Today Non-Negotiables"
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

      {/* CHARTS GRID: DONUT & BAR VISUALIZATIONS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        <DonutChartCard
          title="Today's Non-Negotiable Tasks"
          subtitle="Real-time execution status breakdown"
          data={taskDonutData}
          centerLabel={`${Math.round((completedCount / nonnegs.length) * 100)}%`}
          centerSublabel="Complete"
          height={200}
        />

        <DonutChartCard
          title="Category Score Balance"
          subtitle="Relative distribution across 5 core pillars"
          data={categoryBalanceData}
          centerLabel={`${mockOverviewData.comparisons.today}`}
          centerSublabel="Overall Score"
          height={200}
        />

        <BarChartCard
          title="7-Day Performance Scores"
          subtitle="Daily performance scores over past week"
          data={weeklyBarData}
          defaultColor="#6366F1"
          unit=" pts"
          height={200}
          badge="THIS WEEK"
          badgeColor="#10B981"
        />
      </div>

      {/* LIVE ACTIVITY SECTION */}
      <LiveActivityCard
        activeTask={mockOverviewData.liveActivity.activeTask}
        initialSeconds={mockOverviewData.liveActivity.elapsedSeconds}
        startTime={mockOverviewData.liveActivity.startTime}
        recentActivities={mockOverviewData.liveActivity.recentActivities}
      />

      {/* TODAY'S NON-NEGOTIABLES & 30-DAY PERFORMANCE ROW */}
      <div className="grid-responsive-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {/* TODAY'S NON-NEGOTIABLES CARD */}
        <div
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: 'var(--card-radius, 16px)',
            boxShadow: 'var(--card-shadow)',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="#F59E0B" />
              <h2 className="font-sekuya" style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                Today's Non-Negotiables
              </h2>
            </div>
            <span style={{ fontSize: '11px', background: 'rgba(16,185,129,0.12)', color: '#10B981', padding: '3px 10px', borderRadius: '12px', fontWeight: 700 }}>
              {completedCount} / {nonnegs.length} completed
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {nonnegs.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ x: 2 }}
                onClick={() => toggleTask(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: item.completed ? '1px solid rgba(16,185,129,0.25)' : '1px solid var(--card-border)',
                  background: item.completed ? 'rgba(16,185,129,0.04)' : 'var(--input-bg)',
                  cursor: 'pointer',
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
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', gap: '10px' }}>
                    <span>⏰ {item.time}</span>
                  </div>
                </div>

                <div className="font-sekuya text-gradient-streak" style={{ fontSize: '12px', fontWeight: 700 }}>
                  🔥 {item.streakDays}d
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 30-DAY PERFORMANCE AREA TREND CHART */}
        <AreaTrendChartCard
          title="30-Day Performance Score Trend"
          subtitle="Daily performance scores with peak trendline tracking"
          data={mockOverviewData.history30Days.map((h) => ({ date: h.day, score: h.score }))}
          dataKey="score"
          color="#6366F1"
          height={240}
          unit=" pts"
          timeframes={['7D', '30D', '90D']}
        />
      </div>

      {/* PERSONAL INSIGHTS SECTION */}
      <PersonalInsightsCard insights={mockOverviewData.insights} />
    </div>
  );
}
