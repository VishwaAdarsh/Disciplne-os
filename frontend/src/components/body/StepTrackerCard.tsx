import { useState } from 'react';
import { Activity, RefreshCw, Smartphone, Edit3 } from 'lucide-react';
import { useBodyStore } from '../../store/bodyStore';
import HorizontalProgressBar from '../charts/HorizontalProgressBar';

export default function StepTrackerCard() {
  const { steps, updateSteps, mockSyncHealthConnect } = useBodyStore();
  const [isEditing, setIsEditing] = useState(false);
  const [inputVal, setInputVal] = useState(steps.current.toString());
  const [isSyncing, setIsSyncing] = useState(false);

  const percent = Math.min(100, Math.round((steps.current / steps.target) * 100));

  const handleSaveStep = () => {
    const val = parseInt(inputVal, 10);
    if (!isNaN(val) && val >= 0) {
      updateSteps(val);
    }
    setIsEditing(false);
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      mockSyncHealthConnect();
      setIsSyncing(false);
    }, 600);
  };

  return (
    <div
      style={{
        background: 'var(--card-bg, #111827)',
        border: '1px solid var(--card-border, #1F2937)',
        borderRadius: 'var(--card-radius, 16px)',
        boxShadow: 'var(--card-shadow)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={18} color="#0EA5E9" />
          <span className="font-sekuya" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
            Daily Step Tracker
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={handleSync}
            disabled={isSyncing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              background: 'rgba(14, 165, 233, 0.12)',
              color: '#0EA5E9',
              border: '1px solid rgba(14, 165, 233, 0.25)',
              padding: '4px 10px',
              borderRadius: '12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
            <span>SYNC HEALTH</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          {isEditing ? (
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <input
                type="number"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                style={{
                  width: '100px',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  background: 'var(--surface-bg, #1F2937)',
                  border: '1px solid #0EA5E9',
                  color: '#FFF',
                  fontSize: '16px',
                  fontWeight: 700,
                }}
              />
              <button
                onClick={handleSaveStep}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: '#0EA5E9',
                  color: '#FFF',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Save
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '28px', fontWeight: 900, color: 'var(--text-main)' }}>
                {steps.current.toLocaleString()}
              </span>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/ {steps.target.toLocaleString()} steps</span>
              <button
                onClick={() => {
                  setInputVal(steps.current.toString());
                  setIsEditing(true);
                }}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <Edit3 size={14} />
              </button>
            </div>
          )}
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Est. {steps.distanceKm} km · {steps.caloriesBurned} kcal burned
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0EA5E9' }}>{percent}%</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>of Goal</div>
        </div>
      </div>

      <HorizontalProgressBar
        label="Movement Goal Progress"
        current={steps.current}
        max={steps.target}
        unit="steps"
        color="#0EA5E9"
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '11px',
          color: 'var(--text-muted)',
          background: 'rgba(255,255,255,0.02)',
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px dashed var(--card-border)',
        }}
      >
        <Smartphone size={14} color="#0EA5E9" />
        <span>Ready for Google Health Connect, Apple Health & Smart Watches sync</span>
      </div>
    </div>
  );
}
