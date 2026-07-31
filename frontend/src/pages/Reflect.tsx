import { useState } from 'react';
import { BookOpen, Flame, Award, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function Reflect() {
  const [wentWell, setWentWell] = useState('');
  const [brokeDown, setBrokeDown] = useState('');
  const [changeNext, setChangeNext] = useState('');
  const [commitment, setCommitment] = useState('');
  const [locked, setLocked] = useState(false);

  const handleLockIn = () => {
    setLocked(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <PageHeader
        title="Weekly Reflection"
        subtitle="Review weekly execution, extract lessons, and lock in your commitments."
      />

      {/* WEEK IN REVIEW HEADER BANNER */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(124,58,237,0.04))',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 'var(--card-radius, 16px)',
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
            JUL 27 — AUG 02
          </div>
          <h2 className="font-sekuya" style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
            YOUR WEEK IN REVIEW
          </h2>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Score progression: <strong style={{ color: '#6366F1' }}>712 → 748</strong> (+36 pts)
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Performance</div>
            <div className="font-sekuya text-gradient-success" style={{ fontSize: '22px', fontWeight: 700 }}>86%</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Streak</div>
            <div className="font-sekuya text-gradient-streak" style={{ fontSize: '22px', fontWeight: 700 }}>🔥 12d</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Completed</div>
            <div className="font-sekuya text-gradient-score" style={{ fontSize: '22px', fontWeight: 700 }}>24 / 28</div>
          </div>
        </div>
      </div>

      {/* QUESTIONS FORM CARD */}
      <div
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: 'var(--card-radius, 16px)',
          boxShadow: 'var(--card-shadow)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#6366F1', textTransform: 'uppercase', marginBottom: '4px' }}>
            01
          </div>
          <label style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>
            What went well this week?
          </label>
          <textarea
            value={wentWell}
            onChange={(e) => setWentWell(e.target.value)}
            disabled={locked}
            placeholder="Maintained 100% morning routine streak and focused deep work blocks..."
            rows={3}
            style={{
              width: '100%',
              background: 'var(--input-bg)',
              border: '1px solid var(--input-border)',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '13px',
              color: 'var(--text-main)',
              resize: 'none',
            }}
          />
        </div>

        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#EF4444', textTransform: 'uppercase', marginBottom: '4px' }}>
            02
          </div>
          <label style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>
            What broke down?
          </label>
          <textarea
            value={brokeDown}
            onChange={(e) => setBrokeDown(e.target.value)}
            disabled={locked}
            placeholder="Late evening screen time led to delayed sleep schedule on Thursday..."
            rows={3}
            style={{
              width: '100%',
              background: 'var(--input-bg)',
              border: '1px solid var(--input-border)',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '13px',
              color: 'var(--text-main)',
              resize: 'none',
            }}
          />
        </div>

        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase', marginBottom: '4px' }}>
            03
          </div>
          <label style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>
            What will you change next week?
          </label>
          <textarea
            value={changeNext}
            onChange={(e) => setChangeNext(e.target.value)}
            disabled={locked}
            placeholder="Enforce 10:00 PM digital shutdown and prepare workout gear the night before..."
            rows={3}
            style={{
              width: '100%',
              background: 'var(--input-bg)',
              border: '1px solid var(--input-border)',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '13px',
              color: 'var(--text-main)',
              resize: 'none',
            }}
          />
        </div>

        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#10B981', textTransform: 'uppercase', marginBottom: '4px' }}>
            04
          </div>
          <label style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>
            What is your commitment for next week?
          </label>
          <textarea
            value={commitment}
            onChange={(e) => setCommitment(e.target.value)}
            disabled={locked}
            placeholder="5x workout sessions logged and 100% Non-Negotiables execution."
            rows={3}
            style={{
              width: '100%',
              background: 'var(--input-bg)',
              border: '1px solid var(--input-border)',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '13px',
              color: 'var(--text-main)',
              resize: 'none',
            }}
          />
        </div>

        {!locked ? (
          <button
            onClick={handleLockIn}
            style={{
              marginTop: '10px',
              background: 'linear-gradient(90deg, #6366F1, #7C3AED)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 24px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
            }}
          >
            <Lock size={16} />
            <span>LOCK IN NEXT WEEK</span>
          </button>
        ) : (
          <div
            style={{
              background: 'rgba(16,185,129,0.12)',
              border: '1px solid #10B981',
              borderRadius: '12px',
              padding: '14px',
              textAlign: 'center',
              color: '#10B981',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <CheckCircle2 size={18} />
            <span>NEXT WEEK IS LOCKED IN! OPERATOR READY.</span>
          </div>
        )}
      </div>
    </div>
  );
}
