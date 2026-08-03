import React, { useState } from 'react';
import { useEventEngineStore } from '../../store/eventEngineStore';

export const EventEngineInspector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    eventHistory,
    offlineQueue,
    isOffline,
    emitEvent,
    clearHistory,
    syncOfflineQueue,
    getStats,
  } = useEventEngineStore();

  const stats = getStats();

  const handleSimulateEvent = (type: 'task' | 'workout' | 'water' | 'goal') => {
    if (type === 'task') {
      emitEvent({
        module: 'discipline',
        eventType: 'TASK_COMPLETED',
        title: 'Simulated Task Complete',
        description: 'Synthetic event generated from Event Inspector',
        icon: '⚡',
        payload: { simulated: true },
        scoreImpact: 5,
      });
    } else if (type === 'workout') {
      emitEvent({
        module: 'body',
        eventType: 'WORKOUT_COMPLETED',
        title: 'Simulated 30m Workout',
        description: 'Synthetic workout session completion',
        icon: '💪',
        payload: { simulated: true },
        scoreImpact: 10,
      });
    } else if (type === 'water') {
      emitEvent({
        module: 'nutrition',
        eventType: 'WATER_LOGGED',
        title: 'Simulated Water Log (+500ml)',
        description: 'Synthetic hydration update',
        icon: '💧',
        payload: { simulated: true },
        scoreImpact: 2,
      });
    } else if (type === 'goal') {
      emitEvent({
        module: 'goals',
        eventType: 'GOAL_COMPLETED',
        title: 'Simulated Goal Milestone Completed',
        description: 'Synthetic milestone achievement',
        icon: '🏆',
        payload: { simulated: true },
        scoreImpact: 15,
      });
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          padding: '12px 18px',
          borderRadius: '30px',
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '0.85rem',
          cursor: 'pointer',
          boxShadow: '0 8px 25px rgba(99, 102, 241, 0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span>⚡</span>
        <span>Nervous System Inspector</span>
        {offlineQueue.length > 0 && (
          <span
            style={{
              background: '#ef4444',
              color: '#fff',
              borderRadius: '10px',
              padding: '2px 6px',
              fontSize: '0.7rem',
            }}
          >
            {offlineQueue.length}
          </span>
        )}
      </button>

      {/* Inspector Panel Modal */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '850px',
              maxHeight: '90vh',
              background: 'var(--card-bg, #ffffff)',
              borderRadius: '20px',
              border: '1px solid var(--card-border, #e5e7eb)',
              padding: '28px',
              color: 'var(--text-main, #0f172a)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    fontSize: '1.5rem',
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                  }}
                >
                  📡
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main, #0f172a)' }}>
                    Event & Real-Time Engine Telemetry
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted, #94a3b8)' }}>
                    Nervous system event log inspector & synthetic simulator
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted, #94a3b8)',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            {/* Metrics Bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '12px',
                marginBottom: '24px',
              }}
            >
              <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'var(--surface-secondary, #f8fafc)', border: '1px solid var(--soft-border, #eef2f7)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #94a3b8)' }}>Total Processed</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2563eb' }}>{stats.totalCount}</div>
              </div>
              <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'var(--surface-secondary, #f8fafc)', border: '1px solid var(--soft-border, #eef2f7)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #94a3b8)' }}>Processed Today</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>{stats.todayCount}</div>
              </div>
              <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'var(--surface-secondary, #f8fafc)', border: '1px solid var(--soft-border, #eef2f7)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #94a3b8)' }}>Active Sessions</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#d97706' }}>{stats.activeSessionsCount}</div>
              </div>
              <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'var(--surface-secondary, #f8fafc)', border: '1px solid var(--soft-border, #eef2f7)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #94a3b8)' }}>Network Status</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: isOffline ? '#ef4444' : '#10b981' }}>
                  {isOffline ? 'Offline' : 'Online'}
                </div>
              </div>
            </div>

            {/* Synthetic Event Generator */}
            <div
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                marginBottom: '20px',
              }}
            >
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#6366f1', marginBottom: '10px' }}>
                ⚡ Event Bus Simulator: Inject Synthetic Events
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleSimulateEvent('task')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: 'rgba(99, 102, 241, 0.12)',
                    border: '1px solid #6366f1',
                    color: '#6366f1',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  + Task Completed Event
                </button>
                <button
                  onClick={() => handleSimulateEvent('workout')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid #10b981',
                    color: '#10b981',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  + Workout Event
                </button>
                <button
                  onClick={() => handleSimulateEvent('water')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: 'rgba(245, 158, 11, 0.12)',
                    border: '1px solid #f59e0b',
                    color: '#d97706',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  + Water Log Event
                </button>
                <button
                  onClick={() => handleSimulateEvent('goal')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: 'rgba(168, 85, 247, 0.12)',
                    border: '1px solid #a855f7',
                    color: '#7c3aed',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  + Goal Milestone Event
                </button>
              </div>
            </div>

            {/* Event Log JSON Stream */}
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main, #0f172a)' }}>
                  Live Event Payload Buffer
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {offlineQueue.length > 0 && (
                    <button
                      onClick={syncOfflineQueue}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: '#10b981',
                        border: 'none',
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Sync Offline Queue ({offlineQueue.length})
                    </button>
                  )}
                  <button
                    onClick={clearHistory}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      color: '#ef4444',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                    }}
                  >
                    Clear History
                  </button>
                </div>
              </div>

              <div
                style={{
                  flex: 1,
                  background: 'var(--surface-secondary, #f8fafc)',
                  borderRadius: '12px',
                  border: '1px solid var(--soft-border, #eef2f7)',
                  padding: '14px',
                  fontFamily: 'monospace',
                  fontSize: '0.78rem',
                  color: 'var(--text-main, #0f172a)',
                  overflowY: 'auto',
                  maxHeight: '300px',
                }}
              >
                {eventHistory.length === 0 ? (
                  <span style={{ color: 'var(--text-muted, #94a3b8)' }}>// Event log empty...</span>
                ) : (
                  eventHistory.map((evt) => (
                    <div
                      key={evt.eventId}
                      style={{
                        paddingBottom: '8px',
                        marginBottom: '8px',
                        borderBottom: '1px solid var(--soft-border, #eef2f7)',
                      }}
                    >
                      <span style={{ color: '#7c3aed', fontWeight: 600 }}>[{evt.timestamp.substring(11, 19)}]</span>{' '}
                      <span style={{ color: '#d97706', fontWeight: 600 }}>[{evt.module.toUpperCase()}]</span>{' '}
                      <span style={{ color: 'var(--text-main, #0f172a)', fontWeight: 700 }}>{evt.eventType}</span> — {evt.title}
                      <div style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.72rem', marginTop: '2px' }}>
                        ID: {evt.eventId} | ScoreImpact: +{evt.scoreImpact || 0} | Status: {evt.status}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
