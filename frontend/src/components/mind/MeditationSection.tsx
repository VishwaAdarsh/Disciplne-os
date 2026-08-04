/**
 * MeditationSection Component (SPR-309)
 */

import React from 'react';
import { Brain, Play } from 'lucide-react';
import { useMindStore } from '../../store/mindStore';

export const MeditationSection: React.FC = () => {
  const { meditation, startMeditation } = useMindStore();

  return (
    <div
      style={{
        background: 'var(--card-bg, #111827)',
        border: '1px solid var(--card-border, #1F2937)',
        borderRadius: 'var(--card-radius, 16px)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: 'var(--card-shadow)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.15)', padding: '6px', borderRadius: '10px', color: '#8B5CF6' }}>
            <Brain size={20} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>Meditation & Mindfulness</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Target: {meditation.targetMinutes} min · Today: {meditation.todayMinutes} min ({meditation.streakDays}d streak)
            </div>
          </div>
        </div>

        <button
          onClick={() => startMeditation('Mindfulness Focus', 'guided', 10)}
          style={{
            background: 'linear-gradient(90deg, #8B5CF6, #6366F1)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            padding: '9px 16px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Play size={14} />
          <span>Start 10m Session</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
        {[
          { title: 'Morning Clarity', duration: 10, type: 'guided' as const },
          { title: 'Deep Focus Breathing', duration: 15, type: 'breathing' as const },
          { title: 'Un-guided Silence', duration: 20, type: 'unguided' as const },
        ].map((item) => (
          <div
            key={item.title}
            onClick={() => startMeditation(item.title, item.type, item.duration)}
            style={{
              background: 'var(--input-bg)',
              border: '1px solid var(--input-border)',
              borderRadius: '12px',
              padding: '12px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>{item.title}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {item.duration} min · {item.type.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
