import { Award, Zap, ChevronRight } from 'lucide-react';
import type { LevelInfo } from '../types/discipline';

interface LevelProgressCardProps {
  levelInfo: LevelInfo;
}

export default function LevelProgressCard({ levelInfo }: LevelProgressCardProps) {
  const { level, rankTitle, currentXp, targetXp, prevLevelXp } = levelInfo;

  const xpInCurrentLevel = currentXp - prevLevelXp;
  const xpNeededInCurrentLevel = targetXp - prevLevelXp;
  const pct = Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededInCurrentLevel) * 100));

  return (
    <div
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--card-radius, 16px)',
        boxShadow: 'var(--card-shadow)',
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7C3AED, #C026D3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
              flexShrink: 0,
            }}
          >
            <Award size={20} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Level 0{level} Rank
            </div>
            <div className="font-sekuya" style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              {rankTitle}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span className="font-sekuya text-gradient-xp" style={{ fontSize: '18px', fontWeight: 800 }}>
            {currentXp} XP
          </span>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Accumulated</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', flexWrap: 'wrap', gap: '4px' }}>
          <span>Level Progress</span>
          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
            {targetXp - currentXp} XP until Level 0{Math.min(5, level + 1)}
          </span>
        </div>

        <div
          style={{
            width: '100%',
            height: '8px',
            borderRadius: '6px',
            background: 'var(--card-border)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: '100%',
              borderRadius: '6px',
              background: 'linear-gradient(90deg, #7C3AED, #C026D3)',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* Level Tier Ranks List - Touch Scrollable */}
      <div
        className="no-scrollbar"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '6px',
          paddingTop: '2px',
          overflowX: 'auto',
          maxWidth: '100%',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {(
          [
            { lvl: 1, title: 'Explorer' },
            { lvl: 2, title: 'Operator' },
            { lvl: 3, title: 'Builder' },
            { lvl: 4, title: 'Performer' },
            { lvl: 5, title: 'Elite' },
          ] as const
        ).map((item) => {
          const isActive = item.lvl === level;
          const isReached = item.lvl <= level;
          return (
            <div
              key={item.lvl}
              style={{
                flex: '1 0 60px',
                textAlign: 'center',
                padding: '6px 4px',
                borderRadius: '8px',
                background: isActive ? 'rgba(124,58,237,0.12)' : 'transparent',
                border: isActive ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
                minWidth: '56px',
              }}
            >
              <div style={{ fontSize: '10px', fontWeight: 700, color: isReached ? '#8B5CF6' : 'var(--text-muted)' }}>
                Lvl 0{item.lvl}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: isActive ? 'var(--text-main)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                {item.title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
