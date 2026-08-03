import { Sparkles, Target, Brain, BookOpen, Smile } from 'lucide-react';
import { useMindStore } from '../../store/mindStore';

export default function MindInsightsCard() {
  const { ruleInsights } = useMindStore();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Target':
        return <Target size={18} color="#6366F1" />;
      case 'Brain':
        return <Brain size={18} color="#8B5CF6" />;
      case 'BookOpen':
        return <BookOpen size={18} color="#38BDF8" />;
      default:
        return <Smile size={18} color="#10B981" />;
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
          <Sparkles size={18} color="#8B5CF6" />
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>AI Wellness & Rule Insights</h3>
        </div>
        <span
          style={{
            fontSize: '11px',
            background: 'rgba(139, 92, 246, 0.15)',
            color: '#8B5CF6',
            padding: '3px 10px',
            borderRadius: '12px',
            fontWeight: 700,
          }}
        >
          AUTOMATED PATTERNS
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {ruleInsights.map((ins) => (
          <div
            key={ins.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: '12px',
              background: 'var(--surface-bg, rgba(255,255,255,0.02))',
              border: '1px solid var(--card-border, #1F2937)',
            }}
          >
            <div
              style={{
                padding: '8px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '2px',
              }}
            >
              {getIcon(ins.icon)}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>{ins.title}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', lineHeight: '1.4' }}>
                {ins.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
