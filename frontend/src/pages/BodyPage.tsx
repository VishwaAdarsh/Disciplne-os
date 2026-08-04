/**
 * Body Performance Page (SPR-308)
 */

import { useState } from 'react';
import {
  Activity,
  Dumbbell,
  Moon,
  Scale,
  Droplet,
  Play,
  Plus,
  Zap,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import MetricCard from '../components/MetricCard';
import BarChartCard from '../components/charts/BarChartCard';
import AreaTrendChartCard from '../components/charts/AreaTrendChartCard';
import HorizontalProgressBar from '../components/charts/HorizontalProgressBar';
import { useBody } from '../hooks/body/useBody';

// Body Subcomponents
import ActiveWorkoutModal from '../components/body/ActiveWorkoutModal';
import LogWorkoutModal from '../components/body/LogWorkoutModal';
import LogWaterModal from '../components/body/LogWaterModal';
import LogSleepModal from '../components/body/LogSleepModal';
import LogWeightModal from '../components/body/LogWeightModal';
import RecoveryCard from '../components/body/RecoveryCard';
import StepTrackerCard from '../components/body/StepTrackerCard';
import BodyAnalyticsTab from '../components/body/BodyAnalyticsTab';
import BodyActivityTimeline from '../components/body/BodyActivityTimeline';
import { WaterTrackerCard } from '../components/body/WaterTrackerCard';
import { SleepTrackerCard } from '../components/body/SleepTrackerCard';
import { WeightTrackerCard } from '../components/body/WeightTrackerCard';

export default function BodyPage() {
  const {
    bodyScore,
    steps,
    workout,
    sleep,
    water,
    weight,
    recovery,
    activeSession,
    startWorkout,
    unitSystem,
    toggleUnitSystem,
    handleQuickAddWater,
  } = useBody();

  const [activeCategory, setActiveCategory] = useState<string>('Overview');

  // Modal open states
  const [isLogWorkoutOpen, setIsLogWorkoutOpen] = useState(false);
  const [isLogWaterOpen, setIsLogWaterOpen] = useState(false);
  const [isLogSleepOpen, setIsLogSleepOpen] = useState(false);
  const [isLogWeightOpen, setIsLogWeightOpen] = useState(false);

  // Compute today's goal completion
  const goalsCompletedCount = [
    workout.completed,
    steps.current >= steps.target,
    sleep.durationHours >= sleep.targetHours,
    water.currentLiters >= water.targetLiters,
    recovery.loggedToday,
  ].filter(Boolean).length;

  const sleepTrendData = sleep.weeklyHistory.map((s) => ({
    date: s.day,
    hours: s.hours,
  }));

  const weightTrendData = weight.history30Days.map((w) => ({
    date: w.date,
    weight: w.weightKg,
  }));

  const workoutBarData = [
    { name: 'Mon', value: 45, color: '#10B981' },
    { name: 'Tue', value: 50, color: '#10B981' },
    { name: 'Wed', value: 35, color: '#0EA5E9' },
    { name: 'Thu', value: 55, color: '#10B981' },
    { name: 'Fri', value: 40, color: '#10B981' },
    { name: 'Sat', value: 60, color: '#8B5CF6' },
    { name: 'Sun', value: workout.durationMinutes, color: '#10B981' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', position: 'relative' }}>
      {/* ACTIVE WORKOUT MODAL OVERLAY */}
      <ActiveWorkoutModal />

      {/* QUICK LOG MODALS */}
      <LogWorkoutModal isOpen={isLogWorkoutOpen} onClose={() => setIsLogWorkoutOpen(false)} />
      <LogWaterModal isOpen={isLogWaterOpen} onClose={() => setIsLogWaterOpen(false)} />
      <LogSleepModal isOpen={isLogSleepOpen} onClose={() => setIsLogSleepOpen(false)} />
      <LogWeightModal isOpen={isLogWeightOpen} onClose={() => setIsLogWeightOpen(false)} />

      {/* HEADER WITH CATEGORIES */}
      <PageHeader
        title="Body Performance"
        subtitle="Physical activity, workouts, sleep quality, water hydration, and physical recovery."
        categories={['Overview', 'Activity', 'Workouts', 'Sleep', 'Weight', 'Analytics']}
        onSelectCategory={(cat) => setActiveCategory(cat)}
      />

      {/* ACTIVE WORKOUT SESSION BANNER IF RUNNING */}
      {activeSession.status !== 'idle' && (
        <div
          style={{
            background: 'linear-gradient(90deg, #10B981, #059669)',
            borderRadius: '16px',
            padding: '16px 20px',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '8px',
                borderRadius: '12px',
              }}
            >
              <Dumbbell size={24} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800 }}>Workout in Progress: {activeSession.name}</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>
                Status: {activeSession.status.toUpperCase()} · Click to view timer
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOP BODY PERFORMANCE DASHBOARD KPI GRID */}
      <div className="mobile-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        {/* BODY SCORE CARD */}
        <div
          style={{
            background: 'var(--card-bg, #111827)',
            border: '1px solid var(--card-border, #1F2937)',
            borderRadius: 'var(--card-radius, 16px)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>BODY SCORE</span>
            <Zap size={16} color="#10B981" />
          </div>
          <div style={{ margin: '8px 0' }}>
            <span style={{ fontSize: '32px', fontWeight: 900, color: '#10B981' }}>{bodyScore}%</span>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Goals: {goalsCompletedCount} / 5 completed today
            </div>
          </div>
          <div
            style={{
              height: '4px',
              width: '100%',
              background: 'var(--surface-bg, rgba(255,255,255,0.1))',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div style={{ height: '100%', width: `${bodyScore}%`, background: '#10B981' }} />
          </div>
        </div>

        <MetricCard
          title="Steps"
          value={`${steps.current.toLocaleString()} / ${steps.target.toLocaleString()}`}
          subtext={`${steps.distanceKm} km · ${steps.caloriesBurned} kcal`}
          badge={`${Math.round((steps.current / steps.target) * 100)}%`}
          badgeColor="#0EA5E9"
          sparklineData={[5200, 6100, 6800, 7200, 7500, steps.current]}
          sparklineColor="#0EA5E9"
          progressPercent={(steps.current / steps.target) * 100}
          progressColor="linear-gradient(90deg, #0EA5E9, #0284C7)"
          icon={<Activity size={18} color="#0EA5E9" />}
        />

        <MetricCard
          title="Workout"
          value={`${workout.durationMinutes} min`}
          subtext={workout.todayTitle}
          badge={workout.completed ? 'DONE' : 'PENDING'}
          badgeColor={workout.completed ? '#10B981' : '#F59E0B'}
          sparklineData={[30, 40, 45, 35, 50, workout.durationMinutes]}
          sparklineColor="#10B981"
          icon={<Dumbbell size={18} color="#10B981" />}
        />

        <MetricCard
          title="Sleep"
          value={`${sleep.durationHours}h ${sleep.durationMinutes}m`}
          subtext={`Target: ${sleep.targetHours}h 00m`}
          badge={`${sleep.qualityPercent}% Quality`}
          badgeColor="#8B5CF6"
          sparklineData={[7.1, 7.8, 6.9, 7.4, 8.0, sleep.durationHours]}
          sparklineColor="#8B5CF6"
          icon={<Moon size={18} color="#8B5CF6" />}
        />

        <MetricCard
          title="Water"
          value={`${water.currentLiters} / ${water.targetLiters}L`}
          subtext="Hydration goal"
          badge={`${Math.round((water.currentLiters / water.targetLiters) * 100)}%`}
          badgeColor="#38BDF8"
          sparklineData={[1.5, 1.8, 2.0, 2.1, water.currentLiters]}
          sparklineColor="#38BDF8"
          progressPercent={(water.currentLiters / water.targetLiters) * 100}
          progressColor="linear-gradient(90deg, #38BDF8, #0284C7)"
          icon={<Droplet size={18} color="#38BDF8" />}
        />

        <MetricCard
          title="Weight"
          value={`${weight.currentKg} kg`}
          subtext={`Target: ${weight.targetKg} kg`}
          badge={`${weight.change30Days > 0 ? '+' : ''}${weight.change30Days} kg`}
          badgeColor="#6366F1"
          sparklineData={weight.history30Days.map((w) => w.weightKg)}
          sparklineColor="#6366F1"
          isUp={weight.change30Days > 0}
          icon={<Scale size={18} color="#6366F1" />}
        />
      </div>

      {/* QUICK LOG ACTION BUTTONS BAR */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          background: 'var(--card-bg, #111827)',
          border: '1px solid var(--card-border, #1F2937)',
          borderRadius: '16px',
          padding: '14px 18px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>QUICK LOG ACTIONS</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <button
            onClick={() => startWorkout("Today's Workout", 'Strength')}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              background: 'linear-gradient(90deg, #10B981, #059669)',
              color: '#FFF',
              border: 'none',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Play size={14} />
            <span>START WORKOUT</span>
          </button>

          <button
            onClick={() => setIsLogWorkoutOpen(true)}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10B981',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Plus size={14} />
            <span>+ Log Workout</span>
          </button>

          <button
            onClick={() => setIsLogWaterOpen(true)}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38BDF8',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Droplet size={14} />
            <span>+ Add Water</span>
          </button>

          <button
            onClick={() => setIsLogSleepOpen(true)}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              background: 'rgba(139, 92, 246, 0.15)',
              color: '#8B5CF6',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Moon size={14} />
            <span>Log Sleep</span>
          </button>

          <button
            onClick={() => setIsLogWeightOpen(true)}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#6366F1',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Scale size={14} />
            <span>Log Weight</span>
          </button>
        </div>
      </div>

      {/* HEALTH TRACKERS GRID (WATER, SLEEP, WEIGHT) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        <WaterTrackerCard
          currentLiters={water.currentLiters}
          targetLiters={water.targetLiters}
          unitSystem={unitSystem}
          onQuickAdd={handleQuickAddWater}
          onOpenModal={() => setIsLogWaterOpen(true)}
          onToggleUnit={toggleUnitSystem}
        />

        <SleepTrackerCard
          durationHours={sleep.durationHours}
          durationMinutes={sleep.durationMinutes}
          targetHours={sleep.targetHours}
          qualityPercent={sleep.qualityPercent}
          sleepStart={sleep.sleepStart}
          wakeTime={sleep.wakeTime}
          onOpenModal={() => setIsLogSleepOpen(true)}
        />

        <WeightTrackerCard
          currentKg={weight.currentKg}
          targetKg={weight.targetKg}
          change30Days={weight.change30Days}
          unitSystem={unitSystem}
          onOpenModal={() => setIsLogWeightOpen(true)}
        />
      </div>

      {/* RENDER CATEGORY SUBVIEWS */}
      {activeCategory === 'Overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* WORKOUT STARTER & STEP TRACKER GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {/* WORKOUT CARD */}
            <div
              style={{
                background: 'var(--card-bg, #111827)',
                border: '1px solid var(--card-border, #1F2937)',
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
                  <span
                    style={{
                      fontSize: '11px',
                      background: workout.completed ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                      color: workout.completed ? '#10B981' : '#F59E0B',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontWeight: 700,
                    }}
                  >
                    {workout.completed ? 'COMPLETED' : 'PENDING'}
                  </span>
                </div>

                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                  {workout.todayTitle}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Duration: {workout.durationMinutes} min · Est. {workout.caloriesBurned} kcal · Streak: {workout.streakDays} Days
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <HorizontalProgressBar
                    label="Daily Step Goal Progress"
                    current={steps.current}
                    max={steps.target}
                    unit="steps"
                    color="#0EA5E9"
                    targetMarker={steps.target}
                  />
                  <HorizontalProgressBar
                    label="Hydration Goal Progress"
                    current={water.currentLiters}
                    max={water.targetLiters}
                    unit="L"
                    color="#38BDF8"
                    targetMarker={water.targetLiters}
                  />
                </div>
              </div>

              <button
                onClick={() => startWorkout(workout.todayTitle, 'Strength')}
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
                <span>START WORKOUT SESSION</span>
              </button>
            </div>

            {/* STEP TRACKER CARD */}
            <StepTrackerCard />
          </div>

          {/* RECOVERY CARD & SLEEP TREND GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <RecoveryCard />

            <AreaTrendChartCard
              title="Sleep & Recovery Trend"
              subtitle={`7-Day sleep duration history (Target: ${sleep.targetHours}h)`}
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
              badge={`${workout.weeklyCount} / ${workout.weeklyTarget} SESSIONS`}
              badgeColor="#10B981"
            />

            <AreaTrendChartCard
              title="30-Day Weight Progression"
              subtitle={`Current: ${weight.currentKg} kg · Target: ${weight.targetKg} kg`}
              data={weightTrendData}
              dataKey="weight"
              color="#6366F1"
              height={200}
              unit=" kg"
            />
          </div>
        </div>
      )}

      {activeCategory === 'Workouts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Workout Sessions History</h3>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  This week: {workout.weeklyCount} of {workout.weeklyTarget} workouts completed · {workout.streakDays} Day streak
                </div>
              </div>
              <button
                onClick={() => setIsLogWorkoutOpen(true)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '10px',
                  background: 'linear-gradient(90deg, #10B981, #059669)',
                  border: 'none',
                  color: '#FFF',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Plus size={16} />
                <span>Log Custom Workout</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {workout.recentWorkouts.map((w) => (
                <div
                  key={w.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: 'var(--surface-bg, rgba(255,255,255,0.02))',
                    border: '1px solid var(--card-border, #1F2937)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '10px', background: 'rgba(16,185,129,0.15)', borderRadius: '10px', color: '#10B981' }}>
                      <Dumbbell size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>{w.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {w.type} · {w.durationMinutes} min · {w.caloriesBurned} kcal · Intensity: {w.intensity}
                      </div>
                      {w.notes && (
                        <div style={{ fontSize: '11px', color: '#10B981', marginTop: '4px' }}>Notes: {w.notes}</div>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{w.dateStr}</div>
                    <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700 }}>COMPLETED</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <BarChartCard
            title="Weekly Workout Duration"
            subtitle="Minutes of exercise completed per day"
            data={workoutBarData}
            defaultColor="#10B981"
            unit=" min"
            height={220}
          />
        </div>
      )}

      {activeCategory === 'Activity' && <BodyActivityTimeline />}

      {activeCategory === 'Sleep' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              background: 'var(--card-bg, #111827)',
              border: '1px solid var(--card-border, #1F2937)',
              borderRadius: 'var(--card-radius, 16px)',
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Moon size={20} color="#8B5CF6" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Sleep Tracker</h3>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Target: {sleep.targetHours} hours · Last night: {sleep.durationHours}h {sleep.durationMinutes}m ({sleep.sleepStart} → {sleep.wakeTime})
              </div>
            </div>

            <button
              onClick={() => setIsLogSleepOpen(true)}
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                background: '#8B5CF6',
                color: '#FFF',
                border: 'none',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Record Sleep Log
            </button>
          </div>

          <AreaTrendChartCard
            title="Sleep & Recovery Trend"
            subtitle={`7-Day sleep duration history (Target: ${sleep.targetHours}h)`}
            data={sleepTrendData}
            dataKey="hours"
            color="#8B5CF6"
            height={240}
            unit=" hrs"
          />
        </div>
      )}

      {activeCategory === 'Weight' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              background: 'var(--card-bg, #111827)',
              border: '1px solid var(--card-border, #1F2937)',
              borderRadius: 'var(--card-radius, 16px)',
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Scale size={20} color="#6366F1" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Weight & Body Composition</h3>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Current: {weight.currentKg} kg · Target Goal: {weight.targetKg} kg · 30-Day Change: {weight.change30Days} kg
              </div>
            </div>

            <button
              onClick={() => setIsLogWeightOpen(true)}
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                background: '#6366F1',
                color: '#FFF',
                border: 'none',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Log New Weight
            </button>
          </div>

          <AreaTrendChartCard
            title="30-Day Weight Progression"
            subtitle={`Current: ${weight.currentKg} kg · Target: ${weight.targetKg} kg`}
            data={weightTrendData}
            dataKey="weight"
            color="#6366F1"
            height={240}
            unit=" kg"
          />
        </div>
      )}

      {activeCategory === 'Analytics' && <BodyAnalyticsTab />}

      {/* FLOATING ACTION BUTTON FOR QUICK WORKOUT LOGGING */}
      <button
        onClick={() => startWorkout("Quick Workout", 'Strength')}
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          background: 'linear-gradient(90deg, #10B981, #059669)',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '30px',
          padding: '14px 24px',
          fontSize: '14px',
          fontWeight: 800,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
          zIndex: 99,
        }}
      >
        <Play size={18} />
        <span>START WORKOUT</span>
      </button>
    </div>
  );
}
