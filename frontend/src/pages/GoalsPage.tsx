import { useState } from 'react';
import { Target, Plus, CheckCircle2, Calendar, Award, Zap } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import MetricCard from '../components/MetricCard';
import DonutChartCard from '../components/charts/DonutChartCard';
import AreaTrendChartCard from '../components/charts/AreaTrendChartCard';
import { useGoalsStore } from '../store/goalsStore';

// Goals Subcomponents
import CreateGoalModal from '../components/goals/CreateGoalModal';
import GoalCard from '../components/goals/GoalCard';
import GoalTimelineRoadmap from '../components/goals/GoalTimelineRoadmap';
import GoalInsightsCard from '../components/goals/GoalInsightsCard';
import GoalsAnalyticsTab from '../components/goals/GoalsAnalyticsTab';
import GoalActivityTimeline from '../components/goals/GoalActivityTimeline';

export default function GoalsPage() {
  const { goals, goalScore, weeklyProgressHistory } = useGoalsStore();

  const [activeCategory, setActiveCategory] = useState<string>('Overview');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const activeGoals = goals.filter((g) => g.status === 'Active');
  const completedGoals = goals.filter((g) => g.status === 'Completed');

  const averageProgress = activeGoals.length > 0
    ? Math.round(activeGoals.reduce((acc, g) => acc + g.progressPercent, 0) / activeGoals.length)
    : 100;

  const goalStatusDonut = [
    { name: 'Active Goals', value: activeGoals.length, color: '#6366F1' },
    { name: 'Completed Goals', value: completedGoals.length, color: '#10B981' },
  ];

  const milestoneTrendData = weeklyProgressHistory.map((h) => ({
    date: h.week,
    progress: h.progressAvg,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', position: 'relative' }}>
      {/* MODALS */}
      <CreateGoalModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

      {/* HEADER WITH CATEGORIES */}
      <PageHeader
        title="Goals & Projects"
        subtitle="Track long-term strategic objectives, milestone roadmaps, and daily task progress."
        categories={['Overview', 'Active', 'Roadmap', 'Milestones', 'Completed', 'Analytics', 'Insights']}
        onSelectCategory={(cat) => setActiveCategory(cat)}
      />

      {/* TOP STATS CARDS GRID */}
      <div className="mobile-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
        {/* GOAL SCORE CARD */}
        <div
          style={{
            background: 'var(--card-bg, #111827)',
            border: '1px solid var(--card-border, #1F2937)',
            borderRadius: 'var(--card-radius, 16px)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>GOAL SCORE</span>
            <Award size={16} color="#6366F1" />
          </div>
          <div style={{ margin: '8px 0' }}>
            <span style={{ fontSize: '32px', fontWeight: 900, color: '#6366F1' }}>{goalScore}%</span>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Strategic execution score
            </div>
          </div>
          <div
            style={{
              height: '4px',
              width: '100%',
              background: 'var(--surface-bg, rgba(255,255,255,0.1))',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div style={{ height: '100%', width: `${goalScore}%`, background: '#6366F1' }} />
          </div>
        </div>

        <MetricCard
          title="Active Goals"
          value={activeGoals.length}
          subtext="Ongoing strategic projects"
          badge="IN FLIGHT"
          badgeColor="#6366F1"
          sparklineData={[2, 3, 3, 4, 4, activeGoals.length]}
          sparklineColor="#6366F1"
          icon={<Target size={18} color="#6366F1" />}
        />

        <MetricCard
          title="Completed Goals"
          value={completedGoals.length}
          subtext="Achieved strategic objectives"
          badge="FINISHED"
          badgeColor="#10B981"
          sparklineData={[4, 5, 5, 6, 6, completedGoals.length]}
          sparklineColor="#10B981"
          icon={<CheckCircle2 size={18} color="#10B981" />}
        />

        <MetricCard
          title="Average Progress"
          value={`${averageProgress}%`}
          subtext="Overall completion rate"
          badge="ON TRACK"
          badgeColor="#8B5CF6"
          sparklineData={[45, 52, 60, 64, 66, averageProgress]}
          sparklineColor="#8B5CF6"
          progressPercent={averageProgress}
          progressColor="linear-gradient(90deg, #6366F1, #8B5CF6)"
          icon={<Zap size={18} color="#8B5CF6" />}
        />

        <MetricCard
          title="Nearest Deadline"
          value={activeGoals[0]?.deadline || 'Aug 30'}
          subtext={activeGoals[0]?.title || 'Learn Python'}
          badge="ON TRACK"
          badgeColor="#F59E0B"
          sparklineData={[10, 8, 7, 5, 4, 3]}
          sparklineColor="#F59E0B"
          icon={<Calendar size={18} color="#F59E0B" />}
        />
      </div>

      {/* QUICK ACTION BAR */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          background: 'var(--card-bg, #111827)',
          border: '1px solid var(--card-border, #1F2937)',
          borderRadius: '16px',
          padding: '14px 18px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>QUICK GOAL ACTIONS</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              background: 'linear-gradient(90deg, #6366F1, #4F46E5)',
              color: '#FFF',
              border: 'none',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            }}
          >
            <Plus size={14} />
            <span>+ CREATE GOAL</span>
          </button>
        </div>
      </div>

      {/* RENDER CATEGORY SUBVIEWS */}
      {activeCategory === 'Overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* CHARTS ROW: GOAL DONUT STATUS & MILESTONE TREND AREA */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <DonutChartCard
              title="Goal Completion Status"
              subtitle="Breakdown of active vs completed strategic goals"
              data={goalStatusDonut}
              centerLabel={`${completedGoals.length} / ${goals.length}`}
              centerSublabel="Goals Done"
              height={200}
            />

            <AreaTrendChartCard
              title="Long-Term Milestone Progression"
              subtitle="Average progress trajectory across all active goals"
              data={milestoneTrendData}
              dataKey="progress"
              color="#6366F1"
              height={200}
              unit="%"
            />
          </div>

          {/* ACTIVE GOALS CARDS GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {activeGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>

          {/* INSIGHTS & TIMELINE */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <GoalInsightsCard />
            <GoalActivityTimeline />
          </div>
        </div>
      )}

      {activeCategory === 'Active' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {activeGoals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}

      {activeCategory === 'Roadmap' && <GoalTimelineRoadmap />}

      {activeCategory === 'Milestones' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activeGoals.map((g) => (
            <div
              key={g.id}
              style={{
                background: 'var(--card-bg, #111827)',
                border: '1px solid var(--card-border, #1F2937)',
                borderRadius: '16px',
                padding: '18px',
              }}
            >
              <h4 style={{ margin: '0 0 10px 0', color: '#6366F1', fontSize: '16px', fontWeight: 800 }}>{g.title}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px' }}>
                {g.milestones.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: m.completed ? 'rgba(16, 185, 129, 0.1)' : 'var(--surface-bg, #1F2937)',
                      border: `1px solid ${m.completed ? '#10B981' : 'var(--card-border)'}`,
                      fontSize: '12px',
                      color: m.completed ? '#10B981' : 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{m.completed ? '✓' : '○'} {m.title}</span>
                    {m.dueDate && <span style={{ fontSize: '10px', color: '#F59E0B' }}>{m.dueDate}</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeCategory === 'Completed' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {completedGoals.length === 0 ? (
            <div
              style={{
                background: 'var(--card-bg, #111827)',
                border: '1px solid var(--card-border, #1F2937)',
                borderRadius: '16px',
                padding: '40px 20px',
                textAlign: 'center',
                color: 'var(--text-muted)',
                gridColumn: '1 / -1',
              }}
            >
              <CheckCircle2 size={36} style={{ marginBottom: '12px', opacity: 0.5 }} />
              <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-main)' }}>No completed goals yet</h4>
              <p style={{ fontSize: '13px', margin: 0 }}>Keep working on active goal milestones to complete your first objective!</p>
            </div>
          ) : (
            completedGoals.map((goal) => <GoalCard key={goal.id} goal={goal} />)
          )}
        </div>
      )}

      {activeCategory === 'Analytics' && <GoalsAnalyticsTab />}

      {activeCategory === 'Insights' && <GoalInsightsCard />}

      {/* FLOATING ACTION BUTTON FOR GOAL CREATION */}
      <button
        onClick={() => setIsCreateModalOpen(true)}
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          background: 'linear-gradient(90deg, #6366F1, #4F46E5)',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '30px',
          padding: '14px 24px',
          fontSize: '14px',
          fontWeight: 800,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
          zIndex: 99,
        }}
      >
        <Plus size={18} />
        <span>+ CREATE GOAL</span>
      </button>
    </div>
  );
}
