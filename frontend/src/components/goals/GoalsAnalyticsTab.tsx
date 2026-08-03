import { Target, CheckCircle2, Zap, Calendar, Award } from 'lucide-react';
import { useGoalsStore } from '../../store/goalsStore';
import DonutChartCard from '../charts/DonutChartCard';
import AreaTrendChartCard from '../charts/AreaTrendChartCard';
import BarChartCard from '../charts/BarChartCard';

export default function GoalsAnalyticsTab() {
  const { goals, goalScore, calculateScoreBreakdown, weeklyProgressHistory } = useGoalsStore();
  const breakdown = calculateScoreBreakdown();

  const activeCount = goals.filter((g) => g.status === 'Active').length;
  const completedCount = goals.filter((g) => g.status === 'Completed').length;
  const pausedCount = goals.filter((g) => g.status === 'Paused').length;

  const goalStatusDonut = [
    { name: 'Active Goals', value: activeCount, color: '#6366F1' },
    { name: 'Completed Goals', value: completedCount, color: '#10B981' },
    { name: 'Paused Goals', value: pausedCount, color: '#F59E0B' },
  ];

  const milestoneTrendData = weeklyProgressHistory.map((h) => ({
    date: h.week,
    progress: h.progressAvg,
  }));

  const velocityData = weeklyProgressHistory.map((h) => ({
    name: h.week,
    value: h.completedCount,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* GOAL SCORE BREAKDOWN CARD */}
      <div
        style={{
          background: 'var(--card-bg, #111827)',
          border: '1px solid var(--card-border, #1F2937)',
          borderRadius: 'var(--card-radius, 16px)',
          padding: '20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Goal Performance Score Breakdown</h3>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Overall Score: <strong style={{ color: '#6366F1', fontSize: '14px' }}>{goalScore}%</strong> (feeds Performance Engine)
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
          <div style={{ background: 'var(--surface-bg, #1F2937)', padding: '12px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6366F1', fontWeight: 700 }}>
              <Target size={14} /> Progress Avg
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>{breakdown.progressAvgScore}%</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>40% Weight</div>
          </div>

          <div style={{ background: 'var(--surface-bg, #1F2937)', padding: '12px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#10B981', fontWeight 700 }}>
              <Zap size={14} /> Velocity
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>{breakdown.milestoneVelocityScore}%</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>30% Weight</div>
          </div>

          <div style={{ background: 'var(--surface-bg, #1F2937)', padding: '12px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#F59E0B', fontWeight: 700 }}>
              <Calendar size={14} /> Deadline Health
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>{breakdown.deadlineHealthScore}%</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>20% Weight</div>
          </div>

          <div style={{ background: 'var(--surface-bg, #1F2937)', padding: '12px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#8B5CF6', fontWeight: 700 }}>
              <Award size={14} /> Consistency
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>{breakdown.consistencyScore}%</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>10% Weight</div>
          </div>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        <DonutChartCard
          title="Goal Status Distribution"
          subtitle="Active, Completed, and Paused goals"
          data={goalStatusDonut}
          centerLabel={`${completedCount} / ${goals.length}`}
          centerSublabel="Completed Goals"
          height={200}
        />

        <AreaTrendChartCard
          title="Milestone Progression Trajectory"
          subtitle="Average progress percentage across active goals"
          data={milestoneTrendData}
          dataKey="progress"
          color="#6366F1"
          height={200}
          unit="%"
        />

        <BarChartCard
          title="Milestone Velocity"
          subtitle="Number of milestones completed per week"
          data={velocityData}
          defaultColor="#10B981"
          unit=" completed"
          height={200}
        />
      </div>
    </div>
  );
}
