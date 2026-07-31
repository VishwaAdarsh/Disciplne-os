interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  unit?: string;
  formatter?: (value: any) => string;
}

export default function CustomTooltip({
  active,
  payload,
  label,
  unit = '',
  formatter,
}: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '10px',
        boxShadow: 'var(--card-shadow)',
        padding: '10px 14px',
        fontSize: '12px',
        color: 'var(--text-main)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
      }}
    >
      {label && (
        <div style={{ fontWeight: 700, marginBottom: '6px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {payload.map((entry, index) => {
          const valStr = formatter ? formatter(entry.value) : `${entry.value}${unit}`;
          return (
            <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: entry.color || entry.fill || '#6366F1',
                }}
              />
              <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{entry.name || 'Value'}:</span>
              <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{valStr}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
