import { useState } from 'react';
import { Target, Plus, CheckCircle2, Calendar, ArrowRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import MetricCard from '../components/MetricCard';
import DonutChartCard from '../components/charts/DonutChartCard';
import AreaTrendChartCard from '../components/charts/AreaTrendChartCard';
import HorizontalProgressBar from '../components/charts/HorizontalProgressBar';
import { mockGoalsData } from '../mock/goalsData';

export default function GoalsPage() {
  const [goals] = useState(mockGoalsData.goals);

  const handleCreateGoal = () => {
    alert('Create Goal modal triggered! (Visual mock UI)');
  };

  const goalStatusDonut = [
    { name: 'Active Goals', value: mockGoalsData.activeGoalsCount, color: '#6366F1' },
    { name: 'Completed Goals', value: mockGoalsData.completedGoalsCount, color: '#10B981' },
  ];

  const milestoneTrendData = [
    { date: 'Week 1', progress: 45 },
    { date: 'Week 2', progress: 52 },
    { date: 'Week 3', progress: 60 },
    { date: 'Week 4', progress: 68 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <PageHeader
        title="Goals & Projects"
        subtitle="Track major strategic objectives, project milestones, and progress."
        categories={['All', 'Active', 'Completed', 'Career', 'Body', 'Mind']}
        onSelectCategory={() => {}}
        actionRight={
          <button
            onClick={handleCreateGoal}
            style={{
              background: '#4F46E5',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 18px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 3px 12px rgba(79, 70, 229, 0.3)',
            }}
          >
            <Plus size={16} />
            <span>+ CREATE GOAL</span>
          </button>
        }
      />

      {/* TOP STATS CARDS GRID WITH SPARKLINES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <MetricCard
          title="Active Goals"
          value={mockGoalsData.activeGoalsCount}
          subtext="Ongoing strategic projects"
          badge="IN FLIGHT"
          badgeColor="#6366F1"
          accentClass="text-gradient-brand"
          sparklineData={[2, 3, 3, 4, 4, mockGoalsData.activeGoalsCount]}
          sparklineColor="#6366F1"
          icon={<Target size={18} color="#6366F1" />}
        />

        <MetricCard
          title="Completed Goals"
          value={mockGoalsData.completedGoalsCount}
          subtext="Achieved milestones"
          badge="FINISHED"
          badgeColor="#10B981"
          accentClass="text-gradient-success"
          sparklineData={[4, 5, 5, 6, 6, mockGoalsData.completedGoalsCount]}
          sparklineColor="#10B981"
          icon={<CheckCircle2 size={18} color="#10B981" />}
        />

        <MetricCard
          title="Average Progress"
          value={`${mockGoalsData.averageProgressPercent}%`}
          subtext="Overall completion rate"
          badge="ON TRACK"
          badgeColor="#8B5CF6"
          accentClass="text-gradient-score"
          sparklineData={[45, 52, 60, 64, 66, mockGoalsData.averageProgressPercent]}
          sparklineColor="#8B5CF6"
          progressPercent={mockGoalsData.averageProgressPercent}
          progressColor="linear-gradient(90deg, #4F46E5, #7C3AED)"
        />
      </div>

      {/* CHARTS ROW: GOAL DONUT STATUS & MILESTONE TREND AREA */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        <DonutChartCard
          title="Goal Completion Status"
          subtitle="Breakdown of active vs completed strategic goals"
          data={goalStatusDonut}
          centerLabel={`${mockGoalsData.completedGoalsCount} / ${mockGoalsData.activeGoalsCount + mockGoalsData.completedGoalsCount}`}
          centerSublabel="Goals Done"
          height={200}
        />

        <AreaTrendChartCard
          title="Long-Term Milestone Progression"
          subtitle="Average progress trajectory across all active goals"
          data={milestoneTrendData}
          dataKey="progress"
          color="#06B6D4"
          height={200}
          unit="%"
        />
      </div>

      {/* GOALS CARDS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {goals.map((g) => (
          <div
            key={g.id}
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: 'var(--card-radius, 16px)',
              boxShadow: 'var(--card-shadow)',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#6366F1',
                    background: 'rgba(99,102,241,0.12)',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    textTransform: 'uppercase',
                  }}
                >
                  {g.category}
                </span>

                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={12} /> Due {g.dueDate}
                </span>
              </div>

              <h3 className="font-sekuya" style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                {g.title}
              </h3>

              <div style={{ marginTop: '14px' }}>
                <HorizontalProgressBar
                  label={`${g.completedMilestones} of ${g.totalMilestones} Milestones Completed`}
                  current={g.progressPercent}
                  max={100}
                  unit="%"
                  color={g.progressPercent >= 75 ? '#10B981' : g.progressPercent >= 50 ? '#6366F1' : '#F59E0B'}
                />
              </div>

              <div style={{ background: 'var(--input-bg)', borderRadius: '10px', padding: '12px', marginTop: '14px', border: '1px solid var(--card-border)' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>
                  NEXT MILESTONE
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ArrowRight size={13} color="#6366F1" />
                  <span>{g.nextMilestone}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
