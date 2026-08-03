export function KPISkeleton() {
  return (
    <div
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--card-radius, 16px)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        animation: 'pulse 1.5s infinite ease-in-out',
      }}
    >
      <div style={{ width: '40%', height: '14px', background: 'var(--card-border)', borderRadius: '4px' }} />
      <div style={{ width: '70%', height: '32px', background: 'var(--card-border)', borderRadius: '6px' }} />
      <div style={{ width: '50%', height: '12px', background: 'var(--card-border)', borderRadius: '4px' }} />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--card-radius, 16px)',
        padding: '22px',
        height: '240px',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        animation: 'pulse 1.5s infinite ease-in-out',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '35%', height: '18px', background: 'var(--card-border)', borderRadius: '4px' }} />
        <div style={{ width: '20%', height: '18px', background: 'var(--card-border)', borderRadius: '4px' }} />
      </div>
      <div style={{ width: '100%', height: '140px', background: 'var(--card-border)', opacity: 0.4, borderRadius: '8px' }} />
    </div>
  );
}

export function OverviewDashboardSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <div style={{ width: '60%', height: '40px', background: 'var(--card-border)', borderRadius: '8px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
        <KPISkeleton />
        <KPISkeleton />
        <KPISkeleton />
        <KPISkeleton />
      </div>
      <ChartSkeleton />
    </div>
  );
}
