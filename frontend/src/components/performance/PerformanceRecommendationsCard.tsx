import { Zap, Droplet, Dumbbell, Brain, ShieldCheck, ArrowRight } from 'lucide-react';
import { usePerformanceEngineStore } from '../../store/performanceEngineStore';

export default function PerformanceRecommendationsCard() {
  const { recommendations } = usePerformanceEngineStore();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplet':
        return <Droplet size={18} color="#0EA5E9" />;
      case 'Dumbbell':
        return <Dumbbell size={18} color="#10B981" />;
      case 'Brain':
        return <Brain size={18} color="#8B5CF6" />;
      default:
        return <ShieldCheck size={18} color="#6366F1" />;
    }
  };

  return (
    <div
      style={{
        background: 'var(--card-bg, #111827)',
        border: '1px solid var(--card-border, #1F2937)',
        borderRadius: 'var(--card-radius, 16px)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={18} color="#F59E0B" />
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Actionable Recommendations</h3>
        </div>
        <span
          style={{
            fontSize: '11px',
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#F59E0B',
            padding: '3px 10px',
            borderRadius: '12px',
            fontWeight: 700,
          }}
        >
          REAL-TIME ENGINE
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {recommendations.map((rec) => (
          <div
            key={rec.id}
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
                {getIcon(rec.icon)}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>{rec.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{rec.actionText}</div>
              </div>
            </div>

            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: rec.priority === 'High' ? '#EF4444' : '#F59E0B',
                background: rec.priority === 'High' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                padding: '2px 8px',
                borderRadius: '8px',
              }}
            >
              {rec.priority} Priority
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
