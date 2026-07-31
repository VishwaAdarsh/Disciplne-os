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
        borderRadius: 'var(--card-radius, 16px)',
        boxShadow: 'var(--card-shadow)',
        padding: '22px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
      }}
    >
      {/* LEFT SIDE: Comparison Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} color="#6366F1" />
              <span className="font-sekuya" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
                Performance Comparison
              </span>
            </div>

            <div style={{ display: 'flex', gap: '4px', background: 'var(--input-bg)', padding: '3px', borderRadius: '10px' }}>
              <button
                onClick={() => setActiveTab('score')}
                style={{
                  background: activeTab === 'score' ? '#6366F1' : 'transparent',
                  color: activeTab === 'score' ? '#FFF' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '7px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Performance Score
              </button>
              <button
                onClick={() => setActiveTab('avg')}
                style={{
                  background: activeTab === 'avg' ? '#6366F1' : 'transparent',
                  color: activeTab === 'avg' ? '#FFF' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '7px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Daily Average
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '12px' }}>
            <div style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>TODAY</div>
              <div className="font-sekuya text-gradient-score" style={{ fontSize: '24px', fontWeight: 700, margin: '2px 0' }}>
                {activeTab === 'score' ? comparisons.today : Math.round(comparisons.today * 0.9)}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#10B981' }}>{comparisons.todayTrend}</div>
            </div>

            <div style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>THIS WEEK</div>
              <div className="font-sekuya text-gradient-brand" style={{ fontSize: '24px', fontWeight: 700, margin: '2px 0' }}>
                {activeTab === 'score' ? comparisons.thisWeek : Math.round(comparisons.thisWeek * 0.92)}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#10B981' }}>{comparisons.thisWeekTrend}</div>
            </div>

            <div style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>THIS MONTH</div>
              <div className="font-sekuya text-gradient-xp" style={{ fontSize: '24px', fontWeight: 700, margin: '2px 0' }}>
                {activeTab === 'score' ? comparisons.thisMonth : Math.round(comparisons.thisMonth * 0.88)}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#10B981' }}>{comparisons.thisMonthTrend}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div style={{ background: 'var(--input-bg)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>YESTERDAY</div>
              <div className="font-sekuya" style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-muted)' }}>{comparisons.yesterday}</div>
            </div>
            <div style={{ background: 'var(--input-bg)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>LAST WEEK</div>
              <div className="font-sekuya" style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-muted)' }}>{comparisons.lastWeek}</div>
            </div>
            <div style={{ background: 'var(--input-bg)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>LAST MONTH</div>
              <div className="font-sekuya" style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-muted)' }}>{comparisons.lastMonth}</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Horizontal Progress Bars */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span className="font-sekuya" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
            Your Performance Today
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Category Breakdown</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {categories.map(({ name, score, color }) => (
            <HorizontalProgressBar
              key={name}
              label={name}
              current={score}
              max={100}
              unit="%"
              color={color}
              height={9}
              showPercentage={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
