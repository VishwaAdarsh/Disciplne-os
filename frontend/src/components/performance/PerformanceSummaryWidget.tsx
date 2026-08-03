import { Award, Zap, TrendingUp, ShieldCheck, Dumbbell, Brain, Utensils, Target } from 'lucide-react';
import { usePerformanceEngineStore } from '../../store/performanceEngineStore';

export default function PerformanceSummaryWidget() {
  const { performanceScore, dailyChange, highestScore, levelInfo, moduleScores } =
    usePerformanceEngineStore();

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.06))',
        border: `1px solid ${levelInfo.color}44`,
        borderRadius: '24px',
        padding: '24px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        color: 'var(--text-main, #FFFFFF)',
      }}
    >
      {/* HEADER LEVEL & BEST SCORE RECORD */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              background: `${levelInfo.color}22`,
              color: levelInfo.color,
              border: `1px solid ${levelInfo.color}44`,
              padding: '4px 12px',
              borderRadius: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Award size={14} />
            <span>OPERATOR LEVEL: {levelInfo.level.toUpperCase()}</span>
          </span>
        </div>

        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Highest Record: <strong style={{ color: '#FFF' }}>{highestScore} / 1000</strong>
        </div>
      </div>

      {/* MAIN PERFORMANCE SCORE DISPLAY */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            OVERALL PERFORMANCE SCORE (0-1000)
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginTop: '2px' }}>
            <span style={{ fontSize: '56px', fontWeight: 900, color: levelInfo.color, lineHeight: 1 }}>
              {performanceScore}
            </span>
            <span
              style={{
                fontSize: '14px',
                fontWeight: 800,
                color: dailyChange >= 0 ? '#10B981' : '#EF4444',
                background: dailyChange >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                padding: '4px 10px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <TrendingUp size={14} />
              <span>{dailyChange >= 0 ? `+${dailyChange}` : dailyChange} Today</span>
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Next Level: <strong>{levelInfo.maxScore + 1} pts</strong>
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: levelInfo.color }}>
            {levelInfo.progressPercent}% Completed
          </div>
        </div>
      </div>

      {/* LEVEL PROGRESSION BAR */}
      <div
        style={{
          height: '6px',
          width: '100%',
          background: 'var(--surface-bg, rgba(255,255,255,0.08))',
          borderRadius: '3px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${levelInfo.progressPercent}%`,
            background: levelInfo.color,
            borderRadius: '3px',
            transition: 'width 0.5s ease',
          }}
        />
      </div>

      {/* MODULE SCORES QUICK SUMMARY BAR */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
          gap: '8px',
          marginTop: '4px',
        }}
      >
        <div style={{ background: 'var(--surface-bg, rgba(255,255,255,0.03))', padding: '8px 10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11px', color: '#6366F1', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={12} /> Disc (35%)
          </span>
          <span style={{ fontSize: '12px', fontWeight: 800 }}>{moduleScores.discipline}</span>
        </div>

        <div style={{ background: 'var(--surface-bg, rgba(255,255,255,0.03))', padding: '8px 10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Target size={12} /> Goals (25%)
          </span>
          <span style={{ fontSize: '12px', fontWeight: 800 }}>{moduleScores.goals}</span>
        </div>

        <div style={{ background: 'var(--surface-bg, rgba(255,255,255,0.03))', padding: '8px 10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11px', color: '#0EA5E9', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Dumbbell size={12} /> Body (15%)
          </span>
          <span style={{ fontSize: '12px', fontWeight: 800 }}>{moduleScores.body}</span>
        </div>

        <div style={{ background: 'var(--surface-bg, rgba(255,255,255,0.03))', padding: '8px 10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11px', color: '#EC4899', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Brain size={12} /> Mind (15%)
          </span>
          <span style={{ fontSize: '12px', fontWeight: 800 }}>{moduleScores.mind}</span>
        </div>

        <div style={{ background: 'var(--surface-bg, rgba(255,255,255,0.03))', padding: '8px 10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Utensils size={12} /> Nutri (10%)
          </span>
          <span style={{ fontSize: '12px', fontWeight: 800 }}>{moduleScores.nutrition}</span>
        </div>
      </div>
    </div>
  );
}
