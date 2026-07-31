import { useState } from 'react';
import { Activity, Dumbbell, Moon, Scale, Droplet, Play } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import MetricCard from '../components/MetricCard';
import BarChartCard from '../components/charts/BarChartCard';
import AreaTrendChartCard from '../components/charts/AreaTrendChartCard';
import HorizontalProgressBar from '../components/charts/HorizontalProgressBar';
import { mockBodyData } from '../mock/bodyData';

export default function BodyPage() {
  const [waterLiters] = useState(mockBodyData.water.currentLiters);

  const sleepTrendData = mockBodyData.sleep.weeklyHistory.map((s) => ({
    date: s.day,
    hours: s.hours,
  }));

  const weightTrendData = mockBodyData.weight.history30Days.map((w) => ({
    date: w.date,
    weight: w.weight,
  }));

  const workoutBarData = [
    { name: 'Mon', value: 45, color: '#10B981' },
    { name: 'Tue', value: 50, color: '#10B981' },
    { name: 'Wed', value: 35, color: '#0EA5E9' },
    { name: 'Thu', value: 55, color: '#10B981' },
    { name: 'Fri', value: 40, color: '#10B981' },
    { name: 'Sat', value: 60, color: '#8B5CF6' },
    { name: 'Sun', value: 0, color: 'var(--card-border)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <PageHeader
        title="Body Performance"
        subtitle="Physical activity, workouts, sleep quality, and body metrics."
        categories={['Overview', 'Activity', 'Workouts', 'Sleep', 'Weight']}
        onSelectCategory={() => {}}
      />

      {/* TOP STATS CARDS GRID WITH SPARKLINES */}
      <div className="mobile-kpi-grid" style={{ gap: '12px' }}>
        <MetricCard
          title="Steps"
          value={`${mockBodyData.steps.current.toLocaleString()} / ${mockBodyData.steps.target.toLocaleString()}`}
          subtext={`${mockBodyData.steps.distanceKm} km · ${mockBodyData.steps.caloriesBurned} kcal`}
          badge="78%"
          badgeColor="#0EA5E9"
          sparklineData={[5200, 6100, 6800, 7200, 7500, 7842]}
          sparklineColor="#0EA5E9"
          progressPercent={(mockBodyData.steps.current / mockBodyData.steps.target) * 100}
          progressColor="linear-gradient(90deg, #0EA5E9, #0284C7)"
          icon={<Activity size={18} color="#0EA5E9" />}
        />

        <MetricCard
          title="Workout"
          value={`${mockBodyData.workout.durationMinutes} min`}
          subtext={mockBodyData.workout.todayTitle}
          badge={mockBodyData.workout.completed ? 'DONE' : 'PENDING'}
          badgeColor={mockBodyData.workout.completed ? '#10B981' : '#F59E0B'}
          sparklineData={[30, 40, 45, 35, 50, 45]}
          sparklineColor="#10B981"
          icon={<Dumbbell size={18} color="#10B981" />}
        />

        <MetricCard
          title="Sleep"
          value={`${mockBodyData.sleep.durationHours}h ${mockBodyData.sleep.durationMinutes}m`}
          subtext={`Target: ${mockBodyData.sleep.targetHours}h 00m`}
          badge={`${mockBodyData.sleep.qualityPercent}% Quality`}
          badgeColor="#8B5CF6"
          sparklineData={[7.1, 7.8, 6.9, 7.4, 8.0, 7.4]}
          sparklineColor="#8B5CF6"
          icon={<Moon size={18} color="#8B5CF6" />}
        />

        <MetricCard
          title="Weight"
          value={`${mockBodyData.weight.currentKg} kg`}
          subtext={`${mockBodyData.weight.change30Days} kg in 30 days`}
          badge="ON TARGET"
          badgeColor="#6366F1"
          sparklineData={[69.2, 69.0, 68.7, 68.5, 68.4, 68.4]}
          sparklineColor="#6366F1"
          isUp={false}
          icon={<Scale size={18} color="#6366F1" />}
        />

        <MetricCard
          title="Water"
          value={`${waterLiters} / ${mockBodyData.water.targetLiters}L`}
          subtext="Daily hydration goal"
          badge={`${Math.round((waterLiters / mockBodyData.water.targetLiters) * 100)}%`}
          badgeColor="#0EA5E9"
          sparklineData={[1.5, 1.8, 2.0, 2.1, 2.1, waterLiters]}
          sparklineColor="#0EA5E9"
          progressPercent={(waterLiters / mockBodyData.water.targetLiters) * 100}
          progressColor="linear-gradient(90deg, #38BDF8, #0284C7)"
          icon={<Droplet size={18} color="#0EA5E9" />}
        />
      </div>

      {/* WORKOUT STARTER & SLEEP CHART GRID */}
      <div className="grid-responsive-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {/* WORKOUT CARD */}
        <div
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: 'var(--card-radius, 16px)',
            boxShadow: 'var(--card-shadow)',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Dumbbell size={18} color="#10B981" />
                <span className="font-sekuya" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
                  Today's Workout
                </span>
              </div>
              <span style={{ fontSize: '11px', background: 'rgba(16,185,129,0.12)', color: '#10B981', padding: '3px 10px', borderRadius: '12px', fontWeight: 700 }}>
                STRENGTH
              </span>
            </div>

            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
              {mockBodyData.workout.todayTitle}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Duration: {mockBodyData.workout.durationMinutes} minutes · Est. {mockBodyData.workout.caloriesBurned} kcal
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <HorizontalProgressBar
                label="Daily Step Goal Progress"
                current={mockBodyData.steps.current}
                max={mockBodyData.steps.target}
                unit="steps"
                color="#0EA5E9"
                targetMarker={mockBodyData.steps.target}
              />
              <HorizontalProgressBar
                label="Hydration Goal Progress"
                current={waterLiters}
                max={mockBodyData.water.targetLiters}
                unit="L"
                color="#38BDF8"
                targetMarker={mockBodyData.water.targetLiters}
              />
            </div>
          </div>

          <button
            onClick={() => alert('Workout session started!')}
            style={{
              background: 'linear-gradient(90deg, #10B981, #059669)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 20px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            }}
          >
            <Play size={16} />
            <span>START WORKOUT</span>
          </button>
        </div>

        {/* 7-DAY SLEEP DURATION AREA TREND CHART */}
        <AreaTrendChartCard
          title="Sleep & Recovery Trend"
          subtitle={`7-Day sleep duration history (Target: ${mockBodyData.sleep.targetHours}h)`}
          data={sleepTrendData}
          dataKey="hours"
          color="#8B5CF6"
          height={200}
          unit=" hrs"
        />
      </div>

      {/* CHARTS ROW: WORKOUT FREQUENCY & WEIGHT TREND */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        <BarChartCard
          title="Weekly Workout Frequency & Duration"
          subtitle="Workout minutes logged per day across the week"
          data={workoutBarData}
          defaultColor="#10B981"
          unit=" min"
          height={200}
          badge="5 SESSIONS"
          badgeColor="#10B981"
        />

        <AreaTrendChartCard
          title="30-Day Weight Progression"
          subtitle={`Current: ${mockBodyData.weight.currentKg} kg · Target: ${mockBodyData.weight.targetKg} kg`}
          data={weightTrendData}
          dataKey="weight"
          color="#0EA5E9"
          height={200}
          unit=" kg"
        />
      </div>
    </div>
  );
}
