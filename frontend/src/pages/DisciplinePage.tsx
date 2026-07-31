import { useState, useEffect } from 'react';
import { Zap, Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import MetricCard from '../components/MetricCard';
import BarChartCard from '../components/charts/BarChartCard';
import DonutChartCard from '../components/charts/DonutChartCard';
import HorizontalProgressBar from '../components/charts/HorizontalProgressBar';

export default function DisciplinePage() {
  const [timerSecs, setTimerSecs] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => setTimerSecs((s) => s + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const habits = [
    { id: 'h1', title: 'Morning Cold Shower', category: 'Routine', streak: 18, done: true, pct: 100 },
    { id: 'h2', title: 'Read 20 Pages', category: 'Mindset', streak: 12, done: true, pct: 100 },
    { id: 'h3', title: 'No Social Media Before Noon', category: 'Focus', streak: 24, done: true, pct: 100 },
    { id: 'h4', title: 'Evening Shutdown Routine', category: 'Recovery', streak: 9, done: false, pct: 60 },
  ];

  const focusDurationData = [
    { name: 'Mon', value: 2.5, color: '#6366F1' },
    { name: 'Tue', value: 3.2, color: '#6366F1' },
    { name: 'Wed', value: 1.8, color: '#F59E0B' },
    { name: 'Thu', value: 3.5, color: '#10B981' },
    { name: 'Fri', value: 2.8, color: '#6366F1' },
    { name: 'Sat', value: 4.0, color: '#8B5CF6' },
    { name: 'Sun', value: 2.2, color: '#6366F1' },
  ];

  const habitDonutData = [
    { name: 'Completed Habits', value: 3, color: '#10B981' },
    { name: 'Pending Habits', value: 1, color: '#6366F1' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <PageHeader
        title="Discipline OS"
        subtitle="Master execution, habits, and daily focus standards."
        categories={['Overview', 'Non-Negotiables', 'Habits', 'Focus Timer']}
        onSelectCategory={() => {}}
      />

      {/* TOP STATS GRID WITH SPARKLINES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <MetricCard
          title="Discipline Score"
          value="842"
          subtext="Rank: Consistent Operator"
          badge="TIER 1"
          badgeColor="#6366F1"
          accentClass="text-gradient-score"
          sparklineData={[750, 780, 800, 810, 830, 842]}
          sparklineColor="#6366F1"
        />
        <MetricCard
          title="Non-Negotiables"
          value="3 / 4"
          subtext="75% daily execution rate"
          badge="3 COMPLETE"
          badgeColor="#10B981"
          accentClass="text-gradient-success"
          sparklineData={[2, 3, 3, 4, 3, 3]}
          sparklineColor="#10B981"
        />
        <MetricCard
          title="Current Streak"
          value="🔥 12 DAYS"
          subtext="Best: 21 days continuous"
          badge="ACTIVE"
          badgeColor="#F59E0B"
          accentClass="text-gradient-streak"
          sparklineData={[7, 8, 9, 10, 11, 12]}
          sparklineColor="#F59E0B"
        />
        <MetricCard
          title="Focus Today"
          value="2h 14m"
          subtext="Target: 3h 00m total"
          badge="ON TRACK"
          badgeColor="#8B5CF6"
          accentClass="text-gradient-xp"
          sparklineData={[1.5, 1.8, 2.0, 2.1, 2.2, 2.23]}
          sparklineColor="#8B5CF6"
        />
      </div>

      {/* START FOCUS SESSION CARD */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(124,58,237,0.03))',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 'var(--card-radius, 16px)',
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Zap size={18} color="#6366F1" />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Deep Work Engine
            </span>
          </div>
          <h2 className="font-sekuya" style={{ fontSize: '22px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
            Start Focus Session
          </h2>
          <div className="font-sekuya text-gradient-brand" style={{ fontSize: '36px', fontWeight: 700, margin: '8px 0 0' }}>
            {formatTimer(timerSecs)}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            style={{
              background: '#6366F1',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 20px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
            }}
          >
            {isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
            <span>{isTimerRunning ? 'PAUSE SESSION' : 'START SESSION'}</span>
          </button>

          <button
            onClick={() => {
              setIsTimerRunning(false);
              setTimerSecs(0);
            }}
            style={{
              background: 'var(--input-bg)',
              color: 'var(--text-muted)',
              border: '1px solid var(--card-border)',
              borderRadius: '10px',
              padding: '12px 14px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <RotateCcw size={16} />
            <span>RESET</span>
          </button>
        </div>
      </div>

      {/* CHARTS ROW: DEEP WORK DURATION & HABIT CONSISTENCY */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        <BarChartCard
          title="Focus / Deep Work Duration"
          subtitle="Daily focus session hours logged per day"
          data={focusDurationData}
          defaultColor="#6366F1"
          unit=" hrs"
          height={200}
          badge="WEEKLY TARGET: 20H"
          badgeColor="#6366F1"
        />

        <DonutChartCard
          title="Weekly Habit Consistency"
          subtitle="Completion distribution of protocol habits"
          data={habitDonutData}
          centerLabel="75%"
          centerSublabel="Consistency"
          height={200}
        />
      </div>

      {/* HABITS & DETAILED PROGRESS BARS GRID */}
      <div className="grid-responsive-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {/* HABITS CARD */}
        <div
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: 'var(--card-radius, 16px)',
            boxShadow: 'var(--card-shadow)',
            padding: '22px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span className="font-sekuya" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
              Habit Stack & Streaks
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Daily Protocol</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {habits.map((h) => (
              <div
                key={h.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: h.done ? 'rgba(16,185,129,0.05)' : 'var(--input-bg)',
                  border: h.done ? '1px solid rgba(16,185,129,0.2)' : '1px solid var(--input-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle size={16} color={h.done ? '#10B981' : 'var(--text-muted)'} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>{h.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{h.category}</div>
                  </div>
                </div>
                <div className="font-sekuya text-gradient-streak" style={{ fontSize: '12px', fontWeight: 700 }}>
                  🔥 {h.streak}d
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HABIT STACK PROGRESS BARS CARD */}
        <div
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: 'var(--card-radius, 16px)',
            boxShadow: 'var(--card-shadow)',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <span className="font-sekuya" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
            Protocol Execution Rate
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {habits.map((h) => (
              <HorizontalProgressBar
                key={h.id}
                label={h.title}
                current={h.pct}
                max={100}
                unit="%"
                color={h.done ? '#10B981' : '#F59E0B'}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
