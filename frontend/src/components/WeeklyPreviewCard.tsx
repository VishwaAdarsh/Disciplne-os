import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface WeeklyPreviewCardProps {
  weeklyPreview: {
    performance: number;
    goalCompletion: number;
    currentStreak: number;
    reflectionStatus: 'Pending Sunday' | 'Completed';
  };
}

export default function WeeklyPreviewCard({ weeklyPreview }: WeeklyPreviewCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate('/reflect')}
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--card-radius, 16px)',
        boxShadow: 'var(--card-shadow)',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        cursor: 'pointer',
        transition: 'transform 0.15s ease, border-color 0.15s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={18} color="#8B5CF6" />
          <h2 className="font-sekuya" style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
            Weekly Preview
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#8B5CF6', fontWeight: 600 }}>
          <span>Reflection</span>
          <ChevronRight size={14} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
        <div style={{ background: 'var(--input-bg)', padding: '10px 12px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Performance</span>
          <span className="font-sekuya" style={{ fontSize: '20px', fontWeight: 700, color: '#6366F1' }}>
            {weeklyPreview.performance}%
          </span>
        </div>

        <div style={{ background: 'var(--input-bg)', padding: '10px 12px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Goal Completion</span>
          <span className="font-sekuya" style={{ fontSize: '20px', fontWeight: 700, color: '#10B981' }}>
            {weeklyPreview.goalCompletion}%
          </span>
        </div>

        <div style={{ background: 'var(--input-bg)', padding: '10px 12px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Current Streak</span>
          <span className="font-sekuya" style={{ fontSize: '20px', fontWeight: 700, color: '#F59E0B' }}>
            {weeklyPreview.currentStreak} Days
          </span>
        </div>

        <div style={{ background: 'var(--input-bg)', padding: '10px 12px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Sunday Reflection</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            {weeklyPreview.reflectionStatus === 'Completed' ? (
              <>
                <CheckCircle2 size={15} color="#10B981" />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#10B981' }}>Completed</span>
              </>
            ) : (
              <>
                <AlertCircle size={15} color="#F59E0B" />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#F59E0B' }}>Pending</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
