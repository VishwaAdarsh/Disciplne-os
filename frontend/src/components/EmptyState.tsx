import { Sparkles, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title = "BUILD YOUR FIRST TREND",
  description = "Complete today's activities to start building your performance history.",
  buttonText = "START TODAY",
  onAction,
}: EmptyStateProps) {
  return (
    <div
      style={{
        background: 'var(--card-bg)',
        border: '1px dashed var(--card-border)',
        borderRadius: 'var(--card-radius, 16px)',
        padding: '36px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '12px',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'rgba(99,102,241,0.12)',
          color: '#6366F1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Sparkles size={24} />
      </div>

      <h3 className="font-sekuya" style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
        {title}
      </h3>

      <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, maxWidth: '400px' }}>
        {description}
      </p>

      {buttonText && (
        <button
          onClick={onAction}
          style={{
            marginTop: '8px',
            background: '#6366F1',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            padding: '8px 18px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 10px rgba(99, 102, 241, 0.3)',
          }}
        >
          <span>{buttonText}</span>
          <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
}
