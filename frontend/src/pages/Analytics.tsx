import { useState } from 'react';
import { Award, AlertTriangle, Zap, Calendar } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import MetricCard from '../components/MetricCard';
import AreaTrendChartCard from '../components/charts/AreaTrendChartCard';
import BarChartCard from '../components/charts/BarChartCard';
import PieDistributionCard from '../components/charts/PieDistributionCard';
import { mockAnalyticsData } from '../mock/analyticsData';

export default function Analytics() {
  const [timeframe, setTimeframe] = useState<'Today' | 'This Week' | 'This Month' | '90 Days'>('This Month');

  const categoryTrendSeries = [
    { key: 'overall', name: 'Overall Score', color: '#4F46E5' },
    { key: 'discipline', name: 'Discipline', color: '#6366F1' },
    { key: 'body', name: 'Body', color: '#10B981' },
    { key: 'mind', name: 'Mind', color: '#8B5CF6' },
    { key: 'nutrition', name: 'Nutrition', color: '#F59E0B' },
  ];

  const activityBarData = [
    { name: 'Week 1', value: 42, color: '#6366F1' },
    { name: 'Week 2', value: 48, color: '#6366F1' },
    { name: 'Week 3', value: 54, color: '#6366F1' },
    { name: 'Week 4', value: 62, color: '#10B981' },
  ];

  const activityDistributionPie = [
    { name: 'Discipline & Focus', value: 38, color: '#6366F1' },
    { name: 'Body & Fitness', value: 24, color: '#10B981' },
    { name: 'Mind & Reflection', value: 18, color: '#8B5CF6' },
    { name: 'Nutrition Tracking', value: 12, color: '#F59E0B' },
    { name: 'Goals & Career', value: 8, color: '#06B6D4' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <PageHeader
        title="Performance Analytics"
        subtitle="Deep comparative analytics across all 6 core operating categories."
        categories={['Today', 'This Week', 'This Month', '90 Days']}
        activeCategory={timeframe}
        onSelectCategory={(tf) => setTimeframe(tf as any)}
      />

      {/* HIGHLIGHT CALLOUTS CARDS GRID WITH SPARKLINES */}
      <div className="mobile-kpi-grid" style={{ gap: '12px' }}>
        <MetricCard
          title="Best Day"
          value={mockAnalyticsData.highlights.bestDayScore}
          subtext={mockAnalyticsData.highlights.bestDay}
          badge="PEAK SCORE"
          badgeColor="#10B981"
          accentClass="text-gradient-success"
          sparklineData={[82, 85, 88, 90, 91, 92]}
          sparklineColor="#10B981"
          icon={<Award size={18} color="#10B981" />}
        />

        <MetricCard
          title="Best Category"
          value={mockAnalyticsData.highlights.bestCategory}
          subtext={`Avg score: ${mockAnalyticsData.highlights.bestCategoryScore}`}
          badge="TOP RATED"
          badgeColor="#6366F1"
          accentClass="text-gradient-brand"
          sparklineData={[72, 78, 82, 84, 85, 86]}
          sparklineColor="#6366F1"
          icon={<Zap size={18} color="#6366F1" />}
        />

        <MetricCard
          title="Needs Attention"
          value={mockAnalyticsData.highlights.needsAttention}
          subtext={`Current score: ${mockAnalyticsData.highlights.needsAttentionScore}`}
          badge="FOCUS AREA"
          badgeColor="#EF4444"
          accentClass="text-gradient-danger"
          sparklineData={[60, 62, 64, 65, 66, 68]}
          sparklineColor="#EF4444"
          icon={<AlertTriangle size={18} color="#EF4444" />}
        />

        <MetricCard
          title="Longest Streak"
          value={`${mockAnalyticsData.highlights.longestStreak} Days`}
          subtext="Personal record streak"
          badge="RECORD"
          badgeColor="#F59E0B"
          accentClass="text-gradient-streak"
          sparklineData={[12, 14, 16, 18, 20, 21]}
          sparklineColor="#F59E0B"
          icon={<Calendar size={18} color="#F59E0B" />}
        />
      </div>

      {/* COMPARISON CARDS ROW */}
      <div className="grid-responsive-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Today vs Yesterday</div>
          <div className="font-sekuya text-gradient-score" style={{ fontSize: '24px', fontWeight: 700, margin: '4px 0' }}>
            {mockAnalyticsData.comparisons.todayVsYesterday.score} pts
          </div>
          <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 600 }}>
            {mockAnalyticsData.comparisons.todayVsYesterday.change}
          </div>
        </div>

        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>This Week vs Last Week</div>
          <div className="font-sekuya text-gradient-brand" style={{ fontSize: '24px', fontWeight: 700, margin: '4px 0' }}>
            {mockAnalyticsData.comparisons.thisWeekVsLastWeek.score} pts
          </div>
          <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 600 }}>
            {mockAnalyticsData.comparisons.thisWeekVsLastWeek.change}
          </div>
        </div>

        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>This Month vs Last Month</div>
          <div className="font-sekuya text-gradient-xp" style={{ fontSize: '24px', fontWeight: 700, margin: '4px 0' }}>
            {mockAnalyticsData.comparisons.thisMonthVsLastMonth.score} pts
          </div>
          <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 600 }}>
            {mockAnalyticsData.comparisons.thisMonthVsLastMonth.change}
          </div>
        </div>
      </div>

      {/* OVERALL MULTI-CATEGORY TREND CHART */}
      <AreaTrendChartCard
        title={`Overall Performance Multi-Category Trend (${timeframe})`}
        subtitle="Comparative trajectory across Discipline, Body, Mind, and Nutrition"
        data={mockAnalyticsData.overallTrend}
        series={categoryTrendSeries}
        height={240}
        unit=" pts"
        timeframes={['7D', '30D', '90D']}
      />

      {/* CHARTS ROW: ACTIVITY BAR CHART & ACTIVITY DISTRIBUTION PIE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        <BarChartCard
          title="Weekly Activity Volume"
          subtitle="Total completed actions & sessions logged per week"
          data={activityBarData}
          defaultColor="#6366F1"
          unit=" logs"
          height={210}
          badge="GROWTH"
          badgeColor="#10B981"
        />

        <PieDistributionCard
          title="Category Activity Distribution"
          subtitle="Part-to-whole share of total logged operator actions"
          data={activityDistributionPie}
          unit="%"
          height={210}
        />
      </div>
    </div>
  );
}
