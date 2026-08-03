import { CheckCircle2, Circle, ArrowRight, Target } from 'lucide-react';
import { useGoalsStore } from '../../store/goalsStore';

export default function GoalTimelineRoadmap() {
  const { goals } = useGoalsStore();
  const activeGoals = goals.filter((g) => g.status === 'Active' || g.status === 'Completed');

  if (activeGoals.length === 0) {
    return (
      <div
        style={{
          background: 'var(--card-bg, #111827)',
          border: '1px solid var(--card-border, #1F2937)',
          borderRadius: 'var(--card-radius, 16px)',
          padding: '40px 20px',
          textAlign: 'center',
          color: 'var(--text-muted)',
        }}
      >
        <Target size={36} style={{ marginBottom: '12px', opacity: 0.5 }} />
        <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-main)' }}>No active goals roadmap</h4>
        <p style={{ fontSize: '13px', margin: 0 }}>Create a goal to visualize its step-by-step milestone roadmap.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'var(--card-bg, #111827)',
        border: '1px solid var(--card-border, #1F2937)',
        borderRadius: 'var(--card-radius, 16px)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Visual Strategic Roadmap</h3>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Step-by-step milestone progression trajectories from Start to Objective
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {activeGoals.map((g) => (
          <div
            key={g.id}
            style={{
              background: 'var(--surface-bg, rgba(255,255,255,0.02))',
              border: '1px solid var(--card-border, #1F2937)',
              borderRadius: '16px',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>{g.title}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '10px' }}>
                  ({g.progressPercent}% completed)
                </span>
              </div>
              <span style={{ fontSize: '11px', color: '#F59E0B', fontWeight: 700 }}>Deadline: {g.deadline}</span>
            </div>

            {/* ROADMAP HORIZONTAL STEPPER NODES */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '8px',
              }}
            >
              {/* START NODE */}
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  background: 'rgba(99, 102, 241, 0.2)',
                  border: '1px solid #6366F1',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#6366F1',
                  whiteSpace: 'nowrap',
                }}
              >
                🚀 START
              </div>

              {g.milestones.map((m) => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ArrowRight size={14} color="var(--text-muted)" />
                  <div
                    style={{
                      padding: '8px 12px',
                      borderRadius: '10px',
                      background: m.completed
                        ? 'rgba(16, 185, 129, 0.15)'
                        : 'var(--surface-bg, rgba(255,255,255,0.03))',
                      border: `1px solid ${m.completed ? '#10B981' : 'var(--card-border, #374151)'}`,
                      fontSize: '11px',
                      fontWeight: 600,
                      color: m.completed ? '#10B981' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {m.completed ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                    <span>{m.title}</span>
                  </div>
                </div>
              ))}

              <ArrowRight size={14} color="var(--text-muted)" />
              {/* FINAL OBJECTIVE NODE */}
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  background: g.progressPercent === 100 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.15)',
                  border: `1px solid ${g.progressPercent === 100 ? '#10B981' : '#F59E0B'}`,
                  fontSize: '11px',
                  fontWeight: 700,
                  color: g.progressPercent === 100 ? '#10B981' : '#F59E0B',
                  whiteSpace: 'nowrap',
                }}
              >
                🏆 OBJECTIVE
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
