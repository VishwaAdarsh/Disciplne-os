import { useState } from 'react';
import { Award, CheckCircle2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { usePerformanceEngineStore } from '../store/performanceEngineStore';

export default function AchievementsPage() {
  const { achievements } = usePerformanceEngineStore();
  const [filter, setFilter] = useState('All');

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const filtered = filter === 'All' ? achievements : achievements.filter((a) => a.category === filter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <PageHeader
        title="Operator Achievements"
        subtitle="Earned performance badges and operational consistency milestones."
        categories={['All', 'Discipline', 'Mind', 'Goals', 'Nutrition']}
        activeCategory={filter}
        onSelectCategory={setFilter}
      />

      {/* SUMMARY BANNER */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(99,102,241,0.03))',
          border: '1px solid rgba(124,58,237,0.2)',
          borderRadius: 'var(--card-radius, 16px)',
          padding: '22px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Award size={18} color="#7C3AED" />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Badges & Milestones
            </span>
          </div>
          <h2 className="font-sekuya" style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
            {unlockedCount} of {achievements.length} Unlocked
          </h2>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Maintain consistent execution across all modules to unlock higher tier operator badges.
          </div>
        </div>

        <div className="font-sekuya text-gradient-xp" style={{ fontSize: '32px', fontWeight: 700 }}>
          {Math.round((unlockedCount / Math.max(1, achievements.length)) * 100)}%
        </div>
      </div>

      {/* ACHIEVEMENTS CARDS GRID */}
      <div className="mobile-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
        {filtered.map((item) => (
          <div
            key={item.id}
            style={{
              background: 'var(--card-bg, #111827)',
              border: item.unlocked ? '1px solid rgba(124,58,237,0.4)' : '1px solid var(--card-border, #1F2937)',
              borderRadius: 'var(--card-radius, 16px)',
              boxShadow: 'var(--card-shadow)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px',
              opacity: item.unlocked ? 1 : 0.7,
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: item.unlocked ? 'rgba(124,58,237,0.15)' : 'var(--surface-bg, rgba(255,255,255,0.03))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                  }}
                >
                  {item.icon}
                </div>

                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '12px',
                    background: item.unlocked ? 'rgba(16,185,129,0.15)' : 'var(--surface-bg, rgba(255,255,255,0.03))',
                    color: item.unlocked ? '#10B981' : 'var(--text-muted)',
                  }}
                >
                  {item.unlocked ? 'UNLOCKED' : 'LOCKED'}
                </span>
              </div>

              <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                {item.title}
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                {item.description}
              </p>
            </div>

            <div>
              {item.unlocked ? (
                <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={12} />
                  <span>Unlocked on {item.unlockedDate || 'Recent'}</span>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    <span>Progress</span>
                    <span>{item.progressPercent}%</span>
                  </div>
                  <div style={{ height: '4px', background: 'var(--card-border)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${item.progressPercent}%`, background: '#7C3AED' }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
