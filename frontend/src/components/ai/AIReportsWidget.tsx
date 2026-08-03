import React, { useState } from 'react';
import { useAICoachStore } from '../../store/aiCoachStore';

export const AIReportsWidget: React.FC = () => {
  const { reports, generateReport } = useAICoachStore();
  const [activeType, setActiveType] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [latestReport, setLatestReport] = useState(reports[0] || null);

  const handleGenerate = (type: 'daily' | 'weekly' | 'monthly') => {
    setActiveType(type);
    const rep = generateReport(type);
    setLatestReport(rep);
  };

  return (
    <div
      style={{
        background: 'var(--card-bg, #ffffff)',
        borderRadius: '16px',
        border: '1px solid var(--card-border, #e5e7eb)',
        padding: '24px',
        color: 'var(--text-main, #0f172a)',
        boxShadow: 'var(--card-shadow)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              fontSize: '1.3rem',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            }}
          >
            📊
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main, #0f172a)' }}>
              AI Performance Reports
            </h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted, #94a3b8)' }}>
              Synthesized intelligence & reflection theme analysis
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {(['daily', 'weekly', 'monthly'] as const).map((t) => (
            <button
              key={t}
              onClick={() => handleGenerate(t)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: activeType === t ? '1px solid #10b981' : '1px solid var(--card-border, #e5e7eb)',
                background: activeType === t ? 'rgba(16, 185, 129, 0.12)' : 'var(--surface-primary, #ffffff)',
                color: activeType === t ? '#10b981' : 'var(--text-secondary, #475569)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              Generate {t}
            </button>
          ))}
        </div>
      </div>

      {/* Report Document Box */}
      {latestReport ? (
        <div
          style={{
            background: 'var(--surface-secondary, #f8fafc)',
            borderRadius: '12px',
            border: '1px solid var(--card-border, #e5e7eb)',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ margin: 0, fontSize: '1rem', color: '#2563eb' }}>{latestReport.title}</h4>
            <button
              onClick={() => {
                navigator.clipboard.writeText(latestReport.summaryMarkdown);
                alert('Report markdown copied to clipboard!');
              }}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'var(--surface-primary, #ffffff)',
                border: '1px solid var(--card-border, #e5e7eb)',
                color: 'var(--text-main, #0f172a)',
                fontSize: '0.78rem',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              📋 Copy Markdown
            </button>
          </div>

          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              color: 'var(--text-secondary, #475569)',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.5,
              maxHeight: '260px',
              overflowY: 'auto',
            }}
          >
            {latestReport.summaryMarkdown}
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: '28px',
            textAlign: 'center',
            background: 'var(--surface-secondary, #f8fafc)',
            borderRadius: '12px',
            border: '1px dashed var(--card-border, #e5e7eb)',
            color: 'var(--text-muted, #94a3b8)',
          }}
        >
          Click one of the buttons above to generate a synthesized AI Report.
        </div>
      )}
    </div>
  );
};
