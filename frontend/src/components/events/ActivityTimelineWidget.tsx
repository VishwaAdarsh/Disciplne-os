import React from 'react';
import { useEventEngineStore } from '../../store/eventEngineStore';
import type { EventModule } from '../../types/events';

const moduleColors: Record<EventModule | 'system', { bg: string; text: string; border: string }> = {
  discipline: { bg: 'rgba(99, 102, 241, 0.08)', text: '#6366f1', border: 'rgba(99, 102, 241, 0.25)' },
  body: { bg: 'rgba(16, 185, 129, 0.08)', text: '#10b981', border: 'rgba(16, 185, 129, 0.25)' },
  mind: { bg: 'rgba(236, 72, 153, 0.08)', text: '#ec4899', border: 'rgba(236, 72, 153, 0.25)' },
  nutrition: { bg: 'rgba(245, 158, 11, 0.08)', text: '#d97706', border: 'rgba(245, 158, 11, 0.25)' },
  goals: { bg: 'rgba(139, 92, 246, 0.08)', text: '#7c3aed', border: 'rgba(139, 92, 246, 0.25)' },
  system: { bg: 'rgba(107, 114, 128, 0.08)', text: '#4b5563', border: 'rgba(107, 114, 128, 0.25)' },
};

export const ActivityTimelineWidget: React.FC = () => {
  const {
    filterOptions,
    setTimelineFilter,
    getFilteredEvents,
    getStats,
    isOffline,
  } = useEventEngineStore();

  const filteredEvents = getFilteredEvents();
  const stats = getStats();

  const timeframes: Array<{ key: typeof filterOptions.timeframe; label: string }> = [
    { key: 'today', label: "Today" },
    { key: 'yesterday', label: 'Yesterday' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'all', label: 'All Time' },
  ];

  const modules: Array<{ key: EventModule | 'all'; label: string; icon: string }> = [
    { key: 'all', label: 'All Modules', icon: '🌐' },
    { key: 'discipline', label: 'Discipline', icon: '⚡' },
    { key: 'body', label: 'Body', icon: '💪' },
    { key: 'mind', label: 'Mind', icon: '🧘' },
    { key: 'nutrition', label: 'Nutrition', icon: '🍳' },
    { key: 'goals', label: 'Goals', icon: '🎯' },
  ];

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
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              fontSize: '1.4rem',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            }}
          >
            🧠
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main, #0f172a)' }}>
              Activity Timeline
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted, #94a3b8)' }}>
              Real-time system nervous feed · {stats.todayCount} event{stats.todayCount !== 1 ? 's' : ''} today
            </p>
          </div>
        </div>

        {/* Offline Status indicator */}
        {isOffline && (
          <div
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              fontSize: '0.8rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
            Offline Mode (Queueing)
          </div>
        )}
      </div>

      {/* Filter Toolbar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
        {/* Search bar */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search events by title, description, or event type..."
            value={filterOptions.searchQuery}
            onChange={(e) => setTimelineFilter({ searchQuery: e.target.value })}
            style={{
              width: '100%',
              padding: '10px 16px',
              paddingLeft: '38px',
              borderRadius: '10px',
              background: 'var(--surface-primary, #ffffff)',
              border: '1px solid var(--input-border, #e5e7eb)',
              color: 'var(--text-main, #0f172a)',
              fontSize: '0.9rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
            🔍
          </span>
        </div>

        {/* Timeframe selector tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {timeframes.map((tf) => {
            const isActive = filterOptions.timeframe === tf.key;
            return (
              <button
                key={tf.key}
                onClick={() => setTimelineFilter({ timeframe: tf.key })}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: isActive ? '1px solid #6366f1' : '1px solid var(--card-border, #e5e7eb)',
                  background: isActive ? 'rgba(99, 102, 241, 0.12)' : 'var(--surface-primary, #ffffff)',
                  color: isActive ? '#6366f1' : 'var(--text-secondary, #475569)',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
              >
                {tf.label}
              </button>
            );
          })}
        </div>

        {/* Module filter chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {modules.map((m) => {
            const isActive = filterOptions.module === m.key;
            return (
              <button
                key={m.key}
                onClick={() => setTimelineFilter({ module: m.key })}
                style={{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  border: isActive ? '1px solid #3b82f6' : '1px solid var(--card-border, #e5e7eb)',
                  background: isActive ? 'rgba(59, 130, 246, 0.12)' : 'var(--surface-primary, #ffffff)',
                  color: isActive ? '#2563eb' : 'var(--text-secondary, #475569)',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Stream List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
        {filteredEvents.length === 0 ? (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: 'var(--text-muted, #94a3b8)',
              background: 'var(--surface-secondary, #f8fafc)',
              borderRadius: '12px',
              border: '1px dashed var(--card-border, #e5e7eb)',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📡</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>No Events Found</div>
            <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>
              Perform actions across modules or adjust search filters to view events.
            </div>
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const modStyle = moduleColors[evt.module] || moduleColors.system;
            const formattedTime = new Date(evt.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });
            const formattedDate = new Date(evt.timestamp).toLocaleDateString([], {
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={evt.eventId}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: 'var(--surface-secondary, #f8fafc)',
                  border: '1px solid var(--soft-border, #eef2f7)',
                  transition: 'all 0.2s ease',
                  borderLeft: `4px solid ${modStyle.text}`,
                }}
              >
                {/* Icon box */}
                <div
                  style={{
                    fontSize: '1.2rem',
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: modStyle.bg,
                    border: `1px solid ${modStyle.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {evt.icon || '⚡'}
                </div>

                {/* Event Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main, #0f172a)' }}>
                      {evt.title}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted, #94a3b8)', whiteSpace: 'nowrap' }}>
                      {formattedDate} · {formattedTime}
                    </span>
                  </div>

                  {evt.description && (
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary, #475569)' }}>
                      {evt.description}
                    </p>
                  )}

                  {/* Module badge & score impact tag */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: modStyle.bg,
                        color: modStyle.text,
                        border: `1px solid ${modStyle.border}`,
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                      }}
                    >
                      {evt.module}
                    </span>

                    {evt.scoreImpact && evt.scoreImpact > 0 ? (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: 'rgba(16, 185, 129, 0.12)',
                          color: '#10b981',
                          fontWeight: 700,
                        }}
                      >
                        +{evt.scoreImpact} pts
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
