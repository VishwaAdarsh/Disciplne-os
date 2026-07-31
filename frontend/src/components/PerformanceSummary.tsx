import { useState } from 'react';
import { Award } from 'lucide-react';
import HorizontalProgressBar from './charts/HorizontalProgressBar';

interface CategoryScore {
  discipline: number;
  body: number;
  mind: number;
  nutrition: number;
  goals: number;
}

interface Comparisons {
  today: number;
  todayTrend: string;
  thisWeek: number;
  thisWeekTrend: string;
  thisMonth: number;
  thisMonthTrend: string;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
}

interface PerformanceSummaryProps {
  comparisons: Comparisons;
  categoryScores: CategoryScore;
}

export default function PerformanceSummary({ comparisons, categoryScores }: PerformanceSummaryProps) {
  const [activeTab, setActiveTab] = useState<'score' | 'avg'>('score');

  const categories = [
    { name: 'Discipline', score: categoryScores.discipline, color: '#6366F1' },
    { name: 'Body', score: categoryScores.body, color: '#10B981' },
    { name: 'Mind', score: categoryScores.mind, color: '#8B5CF6' },
    { name: 'Nutrition', score: categoryScores.nutrition, color: '#F59E0B' },
    { name: 'Goals', score: categoryScores.goals, color: '#06B6D4' },
  ];

  return (
    <div
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--card-radius, 14px)',
        boxShadow: 'var(--card-shadow)',
        padding: '16px 18px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
      }}
    >
      {/* LEFT SIDE: Comparison Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={16} color="#6366F1" />
              <span className="font-sekuya" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                Performance Comparison
              </span>
            </div>

            <div style={{ display: 'flex', gap: '3px', background: 'var(--input-bg)', padding: '3px', borderRadius: '8px' }}>
              <button
                onClick={() => setActiveTab('score')}
                style={{
                  background: activeTab === 'score' ? '#6366F1' : 'transparent',
                  color: activeTab === 'score' ? '#FFF' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  fontSize: '10px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Score
              </button>
              <button
                onClick={() => setActiveTab('avg')}
                style={{
                  background: activeTab === 'avg' ? '#6366F1' : 'transparent',
                  color: activeTab === 'avg' ? '#FFF' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  fontSize: '10px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Avg
              </button>
            </div>
          </div>

          <div className="mobile-stats-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '10px' }}>
            <div style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: '10px', padding: '8px 4px', textAlign: 'center' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>TODAY</div>
              <div className="font-sekuya text-gradient-score" style={{ fontSize: '20px', fontWeight: 700, margin: '2px 0' }}>
                {activeTab === 'score' ? comparisons.today : Math.round(comparisons.today * 0.9)}
              </div>
              <div style={{ fontSize: '10px', fontWeight: 600, color: '#10B981' }}>{comparisons.todayTrend}</div>
            </div>

            <div style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: '10px', padding: '8px 4px', textAlign: 'center' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>WEEK</div>
              <div className="font-sekuya text-gradient-brand" style={{ fontSize: '20px', fontWeight: 700, margin: '2px 0' }}>
                {activeTab === 'score' ? comparisons.thisWeek : Math.round(comparisons.thisWeek * 0.92)}
              </div>
              <div style={{ fontSize: '10px', fontWeight: 600, color: '#10B981' }}>{comparisons.thisWeekTrend}</div>
            </div>

            <div style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: '10px', padding: '8px 4px', textAlign: 'center' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>MONTH</div>
              <div className="font-sekuya text-gradient-xp" style={{ fontSize: '20px', fontWeight: 700, margin: '2px 0' }}>
                {activeTab === 'score' ? comparisons.thisMonth : Math.round(comparisons.thisMonth * 0.88)}
              </div>
              <div style={{ fontSize: '10px', fontWeight: 600, color: '#10B981' }}>{comparisons.thisMonthTrend}</div>
            </div>
          </div>

          <div className="mobile-stats-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <div style={{ background: 'var(--input-bg)', borderRadius: '8px', padding: '8px 4px', textAlign: 'center' }}>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>YESTERDAY</div>
              <div className="font-sekuya" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-muted)' }}>{comparisons.yesterday}</div>
            </div>
            <div style={{ background: 'var(--input-bg)', borderRadius: '8px', padding: '8px 4px', textAlign: 'center' }}>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>LAST WEEK</div>
              <div className="font-sekuya" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-muted)' }}>{comparisons.lastWeek}</div>
            </div>
            <div style={{ background: 'var(--input-bg)', borderRadius: '8px', padding: '8px 4px', textAlign: 'center' }}>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>LAST MONTH</div>
              <div className="font-sekuya" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-muted)' }}>{comparisons.lastMonth}</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Horizontal Progress Bars */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span className="font-sekuya" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
            Your Performance Today
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Breakdown</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {categories.map(({ name, score, color }) => (
            <HorizontalProgressBar
              key={name}
              label={name}
              current={score}
              max={100}
              unit="%"
              color={color}
              height={7}
              showPercentage={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
