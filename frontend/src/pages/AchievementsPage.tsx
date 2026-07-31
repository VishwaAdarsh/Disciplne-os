import { useState } from 'react';
import { Award, Lock, CheckCircle2, Shield, Flame, Zap, Brain, Crown } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import MetricCard from '../components/MetricCard';
import { mockAchievementsData } from '../mock/achievementsData';

export default function AchievementsPage() {
  const [filter, setFilter] = useState('All');

  const unlockedCount = mockAchievementsData.filter((a) => a.unlocked).length;
  const filtered = filter === 'All' ? mockAchievementsData : mockAchievementsData.filter((a) => a.category === filter);

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
            {unlockedCount} of {mockAchievementsData.length} Unlocked
          </h2>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Maintain consistent execution to unlock higher tier operator badges.
          </div>
        </div>

        <div className="font-sekuya text-gradient-xp" style={{ fontSize: '32px', fontWeight: 700 }}>
          {Math.round((unlockedCount / mockAchievementsData.length) * 100)}%
        </div>
      </div>

      {/* ACHIEVEMENTS CARDS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {filtered.map((item) => (
          <div
            key={item.id}
            style={{
              background: 'var(--card-bg)',
              border: item.unlocked ? '1px solid rgba(124,58,237,0.3)' : '1px solid var(--card-border)',
              borderRadius: 'var(--card-radius, 16px)',
              boxShadow: 'var(--card-shadow)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px',
              opacity: item.unlocked ? 1 : 0.75,
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: item.unlocked ? 'rgba(124,58,237,0.12)' : 'var(--input-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
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
                    background: item.unlocked ? 'rgba(16,185,129,0.12)' : 'var(--input-bg)',
                    color: item.unlocked ? '#10B981' : 'var(--text-muted)',
                  }}
                >
                  {item.unlocked ? 'UNLOCKED' : 'LOCKED'}
                </span>
              </div>

              <h3 className="font-sekuya" style={{ fontSize: '18px', fontWeight: 700, margin: '4px 0', color: 'var(--text-main)' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 12px', lineHeight: 1.4 }}>
                {item.description}
              </p>
            </div>

            <div>
              {!item.unlocked ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>
                    <span>Progress</span>
                    <span>{item.progressPercent}%</span>
                  </div>
                  <div style={{ background: 'var(--input-bg)', borderRadius: '20px', height: '6px', overflow: 'hidden' }}>
                    <div style={{ width: `${item.progressPercent}%`, height: '100%', background: '#7C3AED', borderRadius: '20px' }} />
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={13} /> Unlocked on {item.unlockedDate}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
