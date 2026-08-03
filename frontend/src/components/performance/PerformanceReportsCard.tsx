import { useState } from 'react';
import { Award, Calendar, CheckCircle2, AlertTriangle } from 'lucide-react';
import { usePerformanceEngineStore } from '../../store/performanceEngineStore';

export default function PerformanceReportsCard() {
  const { reports, performanceScore, levelInfo } = usePerformanceEngineStore();
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const currentReport = reports[selectedPeriod];

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
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={18} color="#8B5CF6" />
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Automated Performance Reports</h3>
        </div>

        {/* PERIOD SWITCHER */}
        <div style={{ display: 'flex', gap: '4px', background: 'var(--surface-bg, rgba(255,255,255,0.03))', padding: '3px', borderRadius: '8px' }}>
          {(['daily', 'weekly', 'monthly'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                border: 'none',
                background: selectedPeriod === period ? '#8B5CF6' : 'transparent',
                color: selectedPeriod === period ? '#FFF' : 'var(--text-muted)',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          background: 'var(--surface-bg, rgba(255,255,255,0.02))',
          border: '1px solid var(--card-border, #1F2937)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              {selectedPeriod.toUpperCase()} SUMMARY REPORT
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
              Score: <strong style={{ color: levelInfo.color }}>{performanceScore}</strong> · Level: {levelInfo.level}
            </div>
          </div>

          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10B981',
              padding: '4px 10px',
              borderRadius: '10px',
            }}
          >
            REPORT READY
          </span>
        </div>

        <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          "{currentReport.summary}"
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '4px' }}>
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '8px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CheckCircle2 size={16} color="#10B981" />
            <div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>BEST CATEGORY</span>
              <strong style={{ fontSize: '12px', color: '#10B981' }}>{currentReport.bestCategory}</strong>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: '8px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertTriangle size={16} color="#F59E0B" />
            <div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>FOCUS AREA</span>
              <strong style={{ fontSize: '12px', color: '#F59E0B' }}>{currentReport.weakestCategory}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
