import { Target, CheckCircle2, Zap, Award } from 'lucide-react';
import { useGoalsStore } from '../../store/goalsStore';

export default function GoalActivityTimeline() {
  const { activityFeed } = useGoalsStore();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'CheckCircle2':
        return <CheckCircle2 size={16} color="#10B981" />;
      case 'Zap':
        return <Zap size={16} color="#F59E0B" />;
      case 'Award':
        return <Award size={16} color="#8B5CF6" />;
      default:
        return <Target size={16} color="#6366F1" />;
    }
  };

  if (activityFeed.length === 0) {
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
        <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-main)' }}>No goal activity history yet</h4>
        <p style={{ fontSize: '13px', margin: 0 }}>
          Create a goal or complete milestones to start building your activity history.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'var(--card-bg, #111827)',
        border: '1px solid var(--card-border, #1F2937)',
        borderRadius: 'var(--card-radius, 16px)',
        padding: '20px',
      }}
    >
      <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 800 }}>Goal Activity Timeline</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {activityFeed.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: '12px',
              background: 'var(--surface-bg, rgba(255,255,255,0.02))',
              border: '1px solid var(--card-border, #1F2937)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  padding: '8px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {getIcon(item.icon)}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>{item.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.subtext}</div>
              </div>
            </div>

            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>{item.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
