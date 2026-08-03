import { useState, useEffect, ReactNode } from 'react';

interface PageHeaderProps {
  user?: string;
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
  user = 'Adarsh',
  greeting: propGreeting,
  title,
  subtitle,
  dateStr: propDateStr,
  activeCategory,
  onSelectCategory,
  categories = ['All', 'Discipline', 'Body', 'Mind', 'Nutrition', 'Goals'],
  actionRight,
}: PageHeaderProps) {
  const [timeStr, setTimeStr] = useState('');
  const [dynamicGreeting, setDynamicGreeting] = useState('');
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();

      // Dynamic Greeting based on PRD Section 5
      let period = 'Good Morning';
      if (hours >= 12 && hours < 17) {
        period = 'Good Afternoon';
      } else if (hours >= 17 && hours < 21) {
        period = 'Good Evening';
      } else if (hours >= 21 || hours < 5) {
        period = 'Good Night';
      }
      setDynamicGreeting(`${period}, ${user}`);

      // Time string format 07:15 AM
      const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setTimeStr(formattedTime);

      // Date string format: Monday • 4 August
      const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
      const dayNum = now.getDate();
      const monthName = now.toLocaleDateString('en-US', { month: 'long' });
      setFormattedDate(`${dayName} • ${dayNum} ${monthName}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [user]);

  const displayGreeting = propGreeting || dynamicGreeting;
  const displayDate = propDateStr || formattedDate;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
            <span>{displayDate}</span>
            <span style={{ color: 'var(--card-border)' }}>|</span>
            <span style={{ color: 'var(--text-muted)' }}>{timeStr}</span>
          </div>
          {displayGreeting && (
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>
              {displayGreeting}
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
        <div
          className="no-scrollbar"
          style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            flexWrap: 'nowrap',
            width: '100%',
            paddingBottom: '4px',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {categories.map((cat) => {
            const active = (activeCategory || 'All').toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                style={{
                  flexShrink: 0,
                  background: active ? '#6366F1' : 'var(--card-bg)',
                  color: active ? '#FFFFFF' : 'var(--text-muted)',
                  border: active ? '1px solid #6366F1' : '1px solid var(--card-border)',
                  borderRadius: '20px',
                  padding: '5px 12px',
                  fontSize: '11px',
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
