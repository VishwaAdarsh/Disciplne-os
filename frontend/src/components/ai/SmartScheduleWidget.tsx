import React from 'react';
import { useAICoachStore } from '../../store/aiCoachStore';

export const SmartScheduleWidget: React.FC = () => {
  const { getSmartSchedule } = useAICoachStore();
  const schedule = getSmartSchedule();

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              fontSize: '1.3rem',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
            }}
          >
            📅
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main, #0f172a)' }}>
              AI Smart Scheduling
            </h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted, #94a3b8)' }}>
              Optimal time-blocked routine based on peak energy
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
        {schedule.map((slot) => (
          <div
            key={slot.id}
            style={{
              padding: '14px',
              borderRadius: '12px',
              background: 'var(--surface-secondary, #f8fafc)',
              border: '1px solid var(--soft-border, #eef2f7)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                fontSize: '1.2rem',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--surface-primary, #ffffff)',
                border: '1px solid var(--card-border, #e5e7eb)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {slot.icon}
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 700 }}>{slot.timeSlot}</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main, #0f172a)', marginTop: '2px' }}>
                {slot.taskTitle}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #94a3b8)', marginTop: '2px' }}>
                Duration: {slot.recommendedDurationMins} mins
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
