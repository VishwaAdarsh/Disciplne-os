import { useState } from 'react';
import { Sparkles, Lightbulb, ChevronRight, Zap } from 'lucide-react';

interface InsightItem {
  id: string;
  category: 'Tips' | 'Insights' | 'Suggestions';
  title: string;
  description: string;
  impact: string;
}

interface PersonalInsightsCardProps {
  insights: InsightItem[];
}

export default function PersonalInsightsCard({ insights }: PersonalInsightsCardProps) {
  const [activeTab, setActiveTab] = useState<'All' | 'Tips' | 'Insights' | 'Suggestions'>('All');

  const filtered = activeTab === 'All' ? insights : insights.filter((i) => i.category === activeTab);

  return (
    <div
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--card-radius, 16px)',
        boxShadow: 'var(--card-shadow)',
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="#8B5CF6" />
          <span className="font-sekuya" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
            Personal Insights
          </span>
        </div>

        <div style={{ display: 'flex', gap: '4px', background: 'var(--input-bg)', padding: '3px', borderRadius: '10px' }}>
          {(['All', 'Tips', 'Insights', 'Suggestions'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? '#8B5CF6' : 'transparent',
                color: activeTab === tab ? '#FFFFFF' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '7px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div
        className="no-scrollbar"
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '12px',
          paddingBottom: '4px',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {filtered.map((item) => (
          <div
            key={item.id}
            style={{
              flex: '0 0 82%',
              minWidth: '240px',
              scrollSnapAlign: 'start',
              background: 'linear-gradient(135deg, rgba(139,92,246,0.05), rgba(99,102,241,0.02))',
              border: '1px solid rgba(139,92,246,0.18)',
              borderRadius: '14px',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '10px',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                    background: 'rgba(139,92,246,0.15)',
                    color: '#8B5CF6',
                    padding: '2px 8px',
                    borderRadius: '10px',
                  }}
                >
                  {item.category}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#10B981' }}>{item.impact}</span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>{item.title}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>"{item.description}"</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
