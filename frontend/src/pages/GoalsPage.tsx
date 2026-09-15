import { useState, useEffect } from 'react';
import {
  Target,
  Plus,
  CheckCircle2,
  Calendar,
  Award,
  Zap,
  PauseCircle,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import MetricCard from '../components/MetricCard';
import DonutChartCard from '../components/charts/DonutChartCard';
import AreaTrendChartCard from '../components/charts/AreaTrendChartCard';
import { useGoalsStore } from '../store/goalsStore';
import type { GoalItem } from '../types/goals';

// Goals Subcomponents
import CreateGoalModal from '../components/goals/CreateGoalModal';
import GoalCard from '../components/goals/GoalCard';
import GoalTimelineRoadmap from '../components/goals/GoalTimelineRoadmap';
import GoalInsightsCard from '../components/goals/GoalInsightsCard';
import GoalsAnalyticsTab from '../components/goals/GoalsAnalyticsTab';
import GoalActivityTimeline from '../components/goals/GoalActivityTimeline';

export default function GoalsPage() {
  const {
    goals,
    summary,
    goalScore,
    weeklyProgressHistory,
    loadAllGoals,
  } = useGoalsStore();

  const [activeCategory, setActiveCategory] = useState<string>('Overview');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState<GoalItem | null>(null);

  useEffect(() => {
    loadAllGoals();
  }, []);

  const handleOpenCreateGoal = () => {
    setGoalToEdit(null);
    setIsCreateModalOpen(true);
  };

  const handleOpenEditGoal = (goal: GoalItem) => {
    setGoalToEdit(goal);
    setIsCreateModalOpen(true);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const activeGoals = goals.filter(
    (g) => g.status === 'Active' || g.status === 'In Progress' || g.status === 'Not Started'
  );
  const completedGoals = goals.filter((g) => g.status === 'Completed');
  const pausedGoals = goals.filter((g) => g.status === 'Paused');
  const overdueGoals = goals.filter(
    (g) => g.status !== 'Completed' && Boolean(g.deadline && g.deadline.length >= 10 && g.deadline < todayStr)
  );

  const averageProgress =
    activeGoals.length > 0
      ? Math.round(activeGoals.reduce((acc, g) => acc + (g.progressPercent || 0), 0) / activeGoals.length)
      : summary.overallProgressPercent || (goals.length > 0 ? 100 : 0);

  const goalStatusDonut = [
    { name: 'Active', value: activeGoals.length, color: '#6366F1' },
    { name: 'Completed', value: completedGoals.length, color: '#10B981' },
    { name: 'Paused', value: pausedGoals.length, color: '#F59E0B' },
  ].filter((item) => item.value > 0);

  const milestoneTrendData = weeklyProgressHistory.map((h) => ({
    date: h.week,
    progress: h.progressAvg,
  }));

  const nearestDeadlineGoal = [...activeGoals]
    .filter((g) => g.deadline)
    .sort((a, b) => (a.deadline! > b.deadline! ? 1 : -1))[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', position: 'relative' }}>
      {/* MODALS */}
      <CreateGoalModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setGoalToEdit(null);
        }}
        goalToEdit={goalToEdit}
      />

      {/* HEADER WITH CATEGORIES */}
      <PageHeader
        title="Goals & Projects"
        subtitle="Track long-term strategic objectives, milestone roadmaps, and daily task progress."
        categories={['Overview', 'Active', 'Completed', 'Paused', 'Milestones', 'Roadmap', 'Analytics', 'Insights']}
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
          subtext={`${overdueGoals.length} overdue`}
          badge={overdueGoals.length > 0 ? `${overdueGoals.length} OVERDUE` : 'ON TRACK'}
          badgeColor={overdueGoals.length > 0 ? '#EF4444' : '#6366F1'}
          sparklineData={[1, 2, 2, 3, 3, activeGoals.length]}
          sparklineColor="#6366F1"
          icon={<Target size={18} color="#6366F1" />}
        />

        <MetricCard
          title="Completed Goals"
          value={completedGoals.length}
          subtext={`${goals.length} total created`}
          badge="FINISHED"
          badgeColor="#10B981"
          sparklineData={[0, 1, 1, 2, completedGoals.length]}
          sparklineColor="#10B981"
          icon={<CheckCircle2 size={18} color="#10B981" />}
        />

        <MetricCard
          title="Average Progress"
          value={`${averageProgress}%`}
          subtext="Overall completion rate"
          badge={averageProgress >= 70 ? 'HIGH' : 'ACTIVE'}
          badgeColor="#8B5CF6"
          sparklineData={[20, 35, 50, 65, averageProgress]}
          sparklineColor="#8B5CF6"
          progressPercent={averageProgress}
          progressColor="linear-gradient(90deg, #6366F1, #8B5CF6)"
          icon={<Zap size={18} color="#8B5CF6" />}
        />

        <MetricCard
          title="Next Deadline"
          value={nearestDeadlineGoal?.deadline || 'None'}
          subtext={nearestDeadlineGoal?.title || 'No upcoming deadlines'}
          badge={nearestDeadlineGoal ? 'ACTIVE' : 'IDLE'}
          badgeColor="#F59E0B"
          sparklineData={[5, 4, 3, 2, 1]}
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
            onClick={handleOpenCreateGoal}
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
              subtitle="Breakdown of active, completed, and paused strategic goals"
              data={goalStatusDonut.length > 0 ? goalStatusDonut : [{ name: 'No Goals', value: 1, color: '#374151' }]}
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
            {activeGoals.length === 0 ? (
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
                <Target size={36} style={{ marginBottom: '12px', opacity: 0.5, color: '#6366F1' }} />
                <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-main)' }}>No active goals</h4>
                <p style={{ fontSize: '13px', margin: 0 }}>Create a new goal above to start tracking your strategic objectives.</p>
              </div>
            ) : (
              activeGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} onEdit={handleOpenEditGoal} />
              ))
            )}
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
          {activeGoals.length === 0 ? (
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
              <Target size={36} style={{ marginBottom: '12px', opacity: 0.5 }} />
              <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-main)' }}>No active goals</h4>
              <p style={{ fontSize: '13px', margin: 0 }}>All goals are completed or paused.</p>
            </div>
          ) : (
            activeGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} onEdit={handleOpenEditGoal} />
            ))
          )}
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
            completedGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} onEdit={handleOpenEditGoal} />
            ))
          )}
        </div>
      )}

      {activeCategory === 'Paused' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {pausedGoals.length === 0 ? (
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
              <PauseCircle size={36} style={{ marginBottom: '12px', opacity: 0.5, color: '#F59E0B' }} />
              <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-main)' }}>No paused goals</h4>
              <p style={{ fontSize: '13px', margin: 0 }}>Any goals on hold will appear here.</p>
            </div>
          ) : (
            pausedGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} onEdit={handleOpenEditGoal} />
            ))
          )}
        </div>
      )}

      {activeCategory === 'Roadmap' && <GoalTimelineRoadmap />}

      {activeCategory === 'Milestones' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {goals.map((g) => (
            <div
              key={g.id}
              style={{
                background: 'var(--card-bg, #111827)',
                border: '1px solid var(--card-border, #1F2937)',
                borderRadius: '16px',
                padding: '18px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ margin: 0, color: '#6366F1', fontSize: '16px', fontWeight: 800 }}>{g.title}</h4>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{g.progressPercent}% Done</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px' }}>
                {g.milestones.length === 0 ? (
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No milestones set for this goal.</div>
                ) : (
                  g.milestones.map((m) => (
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
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeCategory === 'Analytics' && <GoalsAnalyticsTab />}

      {activeCategory === 'Insights' && <GoalInsightsCard />}

      {/* FLOATING ACTION BUTTON FOR GOAL CREATION */}
      <button
        onClick={handleOpenCreateGoal}
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
