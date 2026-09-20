import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Award, AlertTriangle, Zap, Calendar, RefreshCw, AlertCircle, FileText } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import MetricCard from '../components/MetricCard';
import AreaTrendChartCard from '../components/charts/AreaTrendChartCard';
import BarChartCard from '../components/charts/BarChartCard';
import PieDistributionCard from '../components/charts/PieDistributionCard';
import { HistoricalComparisonsRow } from '../components/analytics/HistoricalComparisonsRow';
import { ModuleBreakdownTabs } from '../components/analytics/ModuleBreakdownTabs';
import { analyticsApi } from '../services/analytics/analyticsApi';
import type { AnalyticsDTO, AnalyticsTimeRange } from '../types/analytics';

const timeframeMap: Record<string, AnalyticsTimeRange> = {
  '7 Days': '7d',
  '30 Days': '30d',
  '90 Days': '90d',
  '7D': '7d',
  '30D': '30d',
  '90D': '90d',
};

const reverseTimeframeMap: Record<AnalyticsTimeRange, string> = {
  '7d': '7 Days',
  '30d': '30 Days',
  '90d': '90 Days',
};

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<AnalyticsTimeRange>('30d');
  const [data, setData] = useState<AnalyticsDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = useCallback(async (range: AnalyticsTimeRange) => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyticsApi.getAnalytics(range);
      setData(result);
    } catch (err: any) {
      console.error('Failed to load analytics:', err);
      setError(err?.message || 'Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics(timeRange);
  }, [timeRange, loadAnalytics]);

  const categoryTrendSeries = [
    { key: 'overall', name: 'Overall Score', color: '#4F46E5' },
    { key: 'discipline', name: 'Discipline', color: '#6366F1' },
    { key: 'body', name: 'Body', color: '#10B981' },
    { key: 'mind', name: 'Mind', color: '#8B5CF6' },
    { key: 'nutrition', name: 'Nutrition', color: '#F59E0B' },
    { key: 'goals', name: 'Goals', color: '#06B6D4' },
  ];

  const bestDayValue = data?.highlights?.bestDayScore ? `${data.highlights.bestDayScore} pts` : '—';
  const bestDaySubtext = data?.highlights?.bestDay ? `Peak on ${data.highlights.bestDay}` : 'No scoring history';

  const bestCatValue = data?.highlights?.bestCategory || 'Discipline';
  const bestCatSubtext = data?.highlights?.bestCategoryScore
    ? `Avg score: ${data.highlights.bestCategoryScore}`
    : 'Awaiting logs';

  const attentionValue = data?.highlights?.needsAttention || 'None';
  const attentionSubtext = data?.highlights?.needsAttentionScore
    ? `Current score: ${data.highlights.needsAttentionScore}`
    : 'All systems nominal';

  const streakValue = `${data?.highlights?.longestStreak ?? 0} Days`;
  const streakSubtext = data?.discipline?.currentStreak
    ? `Current streak: ${data.discipline.currentStreak} days`
    : 'Personal record streak';

  const overallSparkline = data?.overallTrend?.map((p) => p.overall) || [];
  const disciplineSparkline = data?.overallTrend?.map((p) => p.discipline) || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <PageHeader
        title="Performance Analytics"
        subtitle="Historical trajectory and multi-module insights across Discipline, Body, Mind, Nutrition, and Goals."
        categories={['7 Days', '30 Days', '90 Days']}
        activeCategory={reverseTimeframeMap[timeRange]}
        onSelectCategory={(cat) => {
          const mapped = timeframeMap[cat];
          if (mapped) setTimeRange(mapped);
        }}
        actionRight={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link
              to="/reports"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#6366F1',
                color: '#FFFFFF',
                borderRadius: '10px',
                padding: '7px 12px',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(99,102,241,0.25)',
              }}
              title="Generate comprehensive reports and export data"
            >
              <FileText size={14} />
              <span>Reports & Export</span>
            </Link>

            <button
              onClick={() => loadAnalytics(timeRange)}
              disabled={loading}
              title="Refresh Analytics"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                color: 'var(--text-muted)',
                borderRadius: '10px',
                padding: '7px 12px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>{loading ? 'Updating...' : 'Refresh'}</span>
            </button>
          </div>
        }
      />

      {/* ERROR BANNER */}
      {error && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '14px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={20} color="#EF4444" />
            <span style={{ fontSize: '13px', color: '#FCA5A5' }}>{error}</span>
          </div>
          <button
            onClick={() => loadAnalytics(timeRange)}
            style={{
              background: '#EF4444',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* HIGHLIGHT CALLOUTS CARDS GRID */}
      <div className="mobile-kpi-grid" style={{ gap: '12px' }}>
        <MetricCard
          title="Best Day"
          value={loading && !data ? '...' : bestDayValue}
          subtext={bestDaySubtext}
          badge="PEAK SCORE"
          badgeColor="#10B981"
          accentClass="text-gradient-success"
          sparklineData={overallSparkline}
          sparklineColor="#10B981"
          icon={<Award size={18} color="#10B981" />}
        />

        <MetricCard
          title="Best Category"
          value={loading && !data ? '...' : bestCatValue}
          subtext={bestCatSubtext}
          badge="TOP RATED"
          badgeColor="#6366F1"
          accentClass="text-gradient-brand"
          sparklineData={disciplineSparkline}
          sparklineColor="#6366F1"
          icon={<Zap size={18} color="#6366F1" />}
        />

        <MetricCard
          title="Needs Attention"
          value={loading && !data ? '...' : attentionValue}
          subtext={attentionSubtext}
          badge="FOCUS AREA"
          badgeColor="#EF4444"
          accentClass="text-gradient-danger"
          sparklineColor="#EF4444"
          icon={<AlertTriangle size={18} color="#EF4444" />}
        />

        <MetricCard
          title="Longest Streak"
          value={loading && !data ? '...' : streakValue}
          subtext={streakSubtext}
          badge="RECORD"
          badgeColor="#F59E0B"
          accentClass="text-gradient-streak"
          sparklineColor="#F59E0B"
          icon={<Calendar size={18} color="#F59E0B" />}
        />
      </div>

      {/* PERIOD-OVER-PERIOD COMPARISON CARDS */}
      {data && (
        <HistoricalComparisonsRow
          hasPreviousPeriodData={data.comparisons.hasPreviousPeriodData}
          performance={data.comparisons.performance}
          discipline={data.comparisons.discipline}
          workouts={data.comparisons.workouts}
          water={data.comparisons.water}
        />
      )}

      {/* OVERALL MULTI-CATEGORY TREND CHART */}
      <AreaTrendChartCard
        title={`Overall Performance Multi-Module Trend (${reverseTimeframeMap[timeRange]})`}
        subtitle="Comparative trajectory across Discipline, Body, Mind, Nutrition, and Goals (0-1000 scale)"
        data={data?.overallTrend || []}
        series={categoryTrendSeries}
        height={240}
        unit=" pts"
        timeframes={['7D', '30D', '90D']}
        onTimeframeChange={(tf) => {
          const mapped = timeframeMap[tf];
          if (mapped) setTimeRange(mapped);
        }}
      />

      {/* CHARTS ROW: ACTIVITY BAR CHART & ACTIVITY DISTRIBUTION PIE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        <BarChartCard
          title="Daily Activity Volume"
          subtitle={`Total logged actions across all modules (${reverseTimeframeMap[timeRange]})`}
          data={data?.activityVolume || []}
          defaultColor="#6366F1"
          unit=" actions"
          height={210}
          badge="ACTIVITY"
          badgeColor="#10B981"
        />

        <PieDistributionCard
          title="Category Activity Distribution"
          subtitle="Part-to-whole share of total logged operator actions"
          data={data?.activityDistribution || []}
          unit=" actions"
          height={210}
        />
      </div>

      {/* MODULE-LEVEL DEEP DIVE TABS */}
      {data && (
        <ModuleBreakdownTabs
          discipline={data.discipline}
          body={data.body}
          mind={data.mind}
          nutrition={data.nutrition}
          goals={data.goals}
        />
      )}
    </div>
  );
}
