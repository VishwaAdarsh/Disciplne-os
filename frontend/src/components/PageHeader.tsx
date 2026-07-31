import type { ReactNode } from 'react';

interface PageHeaderProps {
  greeting?: string;
  title: string;
  subtitle?: string;
  dateStr?: string;
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
  categories?: string[];
  actionRight?: ReactNode;
}

export default function PageHeader({
  greeting,
  title,
  subtitle,
  dateStr,
  activeCategory,
  onSelectCategory,
  categories = ['All', 'Discipline', 'Body', 'Mind', 'Nutrition', 'Goals'],
  actionRight,
}: PageHeaderProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          {dateStr && (
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
              {dateStr}
            </div>
          )}
          {greeting && (
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>
              {greeting}
            </div>
          )}
          <h1 className="font-sekuya" style={{ fontSize: '26px', fontWeight: 700, margin: '2px 0 0', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              {subtitle}
            </p>
          )}
        </div>

        {actionRight && <div>{actionRight}</div>}
      </div>

      {categories && categories.length > 0 && onSelectCategory && (
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map((cat) => {
            const active = (activeCategory || 'All').toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                style={{
                  background: active ? '#6366F1' : 'var(--card-bg)',
                  color: active ? '#FFFFFF' : 'var(--text-muted)',
                  border: active ? '1px solid #6366F1' : '1px solid var(--card-border)',
                  borderRadius: '20px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                  boxShadow: active ? '0 2px 8px rgba(99, 102, 241, 0.25)' : 'none',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
