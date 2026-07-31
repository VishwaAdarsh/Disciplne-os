import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

interface RadialScoreCardProps {
  score: number;
  maxScore?: number;
  tier: string;
  weeklyChange?: number;
}

export default function RadialScoreCard({
  score,
  maxScore = 1000,
  tier,
  weeklyChange = 18,
}: RadialScoreCardProps) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * Math.min(score, maxScore)) / maxScore;

  const tierColor = tier === 'ELITE' || tier === 'Elite' ? '#10B981' : tier === 'BUILDING' || tier === 'Building' ? '#F59E0B' : '#6366F1';

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
        alignItems: 'center',
        justifyContent: 'space-between',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          Discipline Score
        </span>
        <span style={{ fontSize: '11px', background: `${tierColor}18`, color: tierColor, padding: '2px 10px', borderRadius: '20px', fontWeight: 700 }}>
          {tier}
        </span>
      </div>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '6px 0' }}>
        <svg width="140" height="140" viewBox="0 0 120 120">
          <defs>
            <linearGradient id="scoreRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="50%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r={r} fill="none" stroke="var(--card-border)" strokeWidth="8" />
          <motion.circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke="url(#scoreRingGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div style={{ position: 'absolute', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className="font-sekuya text-gradient-score" style={{ fontSize: '32px', fontWeight: 700, lineHeight: 1 }}>
            {score}
          </span>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginTop: '2px' }}>
            / {maxScore}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
        <Award size={14} color="#10B981" />
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#10B981' }}>
          +{weeklyChange} this week
        </span>
      </div>
    </div>
  );
}
