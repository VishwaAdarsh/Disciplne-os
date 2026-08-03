import { Activity, Dumbbell, Moon, Scale, Zap } from 'lucide-react';
import { useBodyStore } from '../../store/bodyStore';
import BarChartCard from '../charts/BarChartCard';
import AreaTrendChartCard from '../charts/AreaTrendChartCard';

export default function BodyAnalyticsTab() {
  const { steps, workout, sleep, weight, bodyScore, calculateScoreBreakdown } = useBodyStore();
  const breakdown = calculateScoreBreakdown();

  const stepChartData = steps.weeklyHistory.map((s) => ({
    name: s.day,
    value: s.count,
  }));

  const workoutChartData = [
    { name: 'Mon', value: 45 },
    { name: 'Tue', value: 50 },
    { name: 'Wed', value: 35 },
    { name: 'Thu', value: 55 },
    { name: 'Fri', value: 40 },
    { name: 'Sat', value: 60 },
    { name: 'Sun', value: workout.durationMinutes },
  ];

  const sleepChartData = sleep.weeklyHistory.map((s) => ({
    date: s.day,
    hours: s.hours,
  }));

  const weightChartData = weight.history30Days.map((w) => ({
    date: w.date,
    weight: w.weightKg,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* BODY SCORE BREAKDOWN SUMMARY */}
      <div
        style={{
          background: 'var(--card-bg, #111827)',
          border: '1px solid var(--card-border, #1F2937)',
          borderRadius: 'var(--card-radius, 16px)',
          padding: '20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Body Performance Breakdown</h3>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Overall Score: <strong style={{ color: '#10B981', fontSize: '14px' }}>{bodyScore}%</strong> (feeds Performance Engine)
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
          <div style={{ background: 'var(--surface-bg, #1F2937)', padding: '12px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#10B981', fontWeight: 700 }}>
              <Dumbbell size={14} /> Workout
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>{breakdown.workoutScore}%</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>25% Weight</div>
          </div>

          <div style={{ background: 'var(--surface-bg, #1F2937)', padding: '12px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#0EA5E9', fontWeight: 700 }}>
              <Activity size={14} /> Steps
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>{breakdown.stepScore}%</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>25% Weight</div>
          </div>

          <div style={{ background: 'var(--surface-bg, #1F2937)', padding: '12px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#8B5CF6', fontWeight: 700 }}>
              <Moon size={14} /> Sleep
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>{breakdown.sleepScore}%</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>20% Weight</div>
          </div>

          <div style={{ background: 'var(--surface-bg, #1F2937)', padding: '12px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#38BDF8', fontWeight: 700 }}>
              <Zap size={14} /> Water
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>{breakdown.waterScore}%</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>15% Weight</div>
          </div>

          <div style={{ background: 'var(--surface-bg, #1F2937)', padding: '12px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#F59E0B', fontWeight: 700 }}>
              <Scale size={14} /> Recovery
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>{breakdown.recoveryScore}%</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>15% Weight</div>
          </div>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        <BarChartCard
          title="Daily Steps History"
          subtitle="7-day movement history vs 10,000 step goal"
          data={stepChartData}
          defaultColor="#0EA5E9"
          unit=" steps"
          height={200}
        />

        <BarChartCard
          title="Weekly Workout Duration"
          subtitle="Total minutes logged in exercise per day"
          data={workoutChartData}
          defaultColor="#10B981"
          unit=" min"
          height={200}
        />

        <AreaTrendChartCard
          title="Sleep Quality & Duration Trend"
          subtitle="Hours of sleep per night (Target: 8h)"
          data={sleepChartData}
          dataKey="hours"
          color="#8B5CF6"
          height={200}
          unit=" hrs"
        />

        <AreaTrendChartCard
          title="Weight Progression (30 Days)"
          subtitle={`Current: ${weight.currentKg} kg · Target: ${weight.targetKg} kg`}
          data={weightChartData}
          dataKey="weight"
          color="#6366F1"
          height={200}
          unit=" kg"
        />
      </div>
    </div>
  );
}
