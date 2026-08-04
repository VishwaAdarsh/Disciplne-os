/**
 * Mind Performance Page (SPR-309)
 */

import { useState } from 'react';
import {
  Brain,
  Smile,
  Zap,
  Target,
  ShieldAlert,
  BookOpen,
  Lock,
  Play,
  CheckCircle2,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import MetricCard from '../components/MetricCard';
import AreaTrendChartCard from '../components/charts/AreaTrendChartCard';
import BarChartCard from '../components/charts/BarChartCard';
import { useMind } from '../hooks/mind/useMind';

// Mind Subcomponents
import DailyCheckInModal from '../components/mind/DailyCheckInModal';
import ActiveMeditationModal from '../components/mind/ActiveMeditationModal';
import CreateJournalModal from '../components/mind/CreateJournalModal';
import MindInsightsCard from '../components/mind/MindInsightsCard';
import MindAnalyticsTab from '../components/mind/MindAnalyticsTab';
import MindActivityTimeline from '../components/mind/MindActivityTimeline';
import { MoodTrackerCard } from '../components/mind/MoodTrackerCard';
import { EnergyStressFocusCard } from '../components/mind/EnergyStressFocusCard';
import { JournalSection } from '../components/mind/JournalSection';
import { MeditationSection } from '../components/mind/MeditationSection';
import type { MoodLevel } from '../types/mind';

export default function MindPage() {
  const {
    mindScore,
    todayCheckIn,
    meditation,
    journal,
    startMeditation,
  } = useMind();

  const [activeCategory, setActiveCategory] = useState<string>('Overview');

  // Modal open states
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);

  const emojis: Record<MoodLevel, { emoji: string; label: string }> = {
    1: { emoji: '😞', label: 'Very Bad' },
    2: { emoji: '😕', label: 'Bad' },
    3: { emoji: '😐', label: 'Neutral' },
    4: { emoji: '🙂', label: 'Good' },
    5: { emoji: '😄', label: 'Excellent' },
  };

  const focusTrendData = [
    { date: 'Mon', focus: 70 },
    { date: 'Tue', focus: 75 },
    { date: 'Wed', focus: 65 },
    { date: 'Thu', focus: 80 },
    { date: 'Fri', focus: 85 },
    { date: 'Sat', focus: 80 },
    { date: 'Sun', focus: todayCheckIn.focus * 10 },
  ];

  const stressTrendData = [
    { date: 'Mon', stress: 50 },
    { date: 'Tue', stress: 40 },
    { date: 'Wed', stress: 60 },
    { date: 'Thu', stress: 35 },
    { date: 'Fri', stress: 30 },
    { date: 'Sat', stress: 25 },
    { date: 'Sun', stress: todayCheckIn.stress * 10 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', position: 'relative' }}>
      {/* ACTIVE MEDITATION MODAL OVERLAY */}
      <ActiveMeditationModal />

      {/* MODALS */}
      <DailyCheckInModal isOpen={isCheckInOpen} onClose={() => setIsCheckInOpen(false)} />
      <CreateJournalModal isOpen={isJournalOpen} onClose={() => setIsJournalOpen(false)} />

      {/* PAGE HEADER */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '11px',
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#10B981',
                padding: '4px 10px',
                borderRadius: '12px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Lock size={12} />
              <span>PRIVATE & ENCRYPTED BY DEFAULT</span>
            </span>
          </div>
        </div>

        <PageHeader
          title="Mind & Mental Performance"
          subtitle="Track self-awareness, cognitive focus, emotional energy, stress levels, and daily reflections."
          categories={['Overview', 'Check-in', 'Meditation', 'Journal', 'Trends', 'Insights']}
          onSelectCategory={(cat) => setActiveCategory(cat)}
        />
      </div>

      {/* TOP STATS KPI CARDS GRID */}
      <div className="mobile-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
        {/* MIND SCORE CARD */}
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
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>MIND SCORE</span>
            <Brain size={16} color="#8B5CF6" />
          </div>
          <div style={{ margin: '8px 0' }}>
            <span style={{ fontSize: '32px', fontWeight: 900, color: '#8B5CF6' }}>{mindScore}%</span>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Mental clarity & resilience score
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
            <div style={{ height: '100%', width: `${mindScore}%`, background: '#8B5CF6' }} />
          </div>
        </div>

        <MetricCard
          title="Mood"
          value={`${emojis[todayCheckIn.mood].emoji} ${emojis[todayCheckIn.mood].label}`}
          subtext={todayCheckIn.moodNote || 'Daily mood rating'}
          badge={todayCheckIn.completed ? 'CHECKED IN' : 'PENDING'}
          badgeColor="#8B5CF6"
          sparklineData={[3, 3, 4, 4, 4, todayCheckIn.mood]}
          sparklineColor="#8B5CF6"
          icon={<Smile size={18} color="#8B5CF6" />}
        />

        <MetricCard
          title="Focus"
          value={`${todayCheckIn.focus} / 10`}
          subtext="High concentration state"
          badge={todayCheckIn.focus >= 8 ? 'OPTIMAL' : 'MODERATE'}
          badgeColor="#6366F1"
          sparklineData={[6, 7, 7, 8, 8, todayCheckIn.focus]}
          sparklineColor="#6366F1"
          progressPercent={todayCheckIn.focus * 10}
          progressColor="linear-gradient(90deg, #6366F1, #8B5CF6)"
          icon={<Target size={18} color="#6366F1" />}
        />

        <MetricCard
          title="Energy"
          value={`${todayCheckIn.energy} / 10`}
          subtext="Sustained vitality"
          badge="BALANCED"
          badgeColor="#F59E0B"
          sparklineData={[5, 6, 6, 7, 7, todayCheckIn.energy]}
          sparklineColor="#F59E0B"
          progressPercent={todayCheckIn.energy * 10}
          progressColor="linear-gradient(90deg, #F59E0B, #F97316)"
          icon={<Zap size={18} color="#F59E0B" />}
        />

        <MetricCard
          title="Stress"
          value={`${todayCheckIn.stress} / 10`}
          subtext="Perceived psychological strain"
          badge={todayCheckIn.stress <= 4 ? 'LOW STRESS' : 'ELEVATED'}
          badgeColor={todayCheckIn.stress <= 4 ? '#10B981' : '#F59E0B'}
          sparklineData={[6, 5, 5, 4, 4, todayCheckIn.stress]}
          sparklineColor="#10B981"
          isUp={false}
          progressPercent={todayCheckIn.stress * 10}
          progressColor="linear-gradient(90deg, #10B981, #14B8A6)"
          icon={<ShieldAlert size={18} color="#10B981" />}
        />

        <MetricCard
          title="Meditation"
          value={`${meditation.todayMinutes} min`}
          subtext={`${meditation.streakDays}d streak`}
          badge={`${meditation.todayMinutes >= meditation.targetMinutes ? 'GOAL MET' : 'IN PROGRESS'}`}
          badgeColor="#8B5CF6"
          sparklineData={[10, 10, 15, 15, 15, meditation.todayMinutes]}
          sparklineColor="#8B5CF6"
          icon={<Brain size={18} color="#8B5CF6" />}
        />
      </div>

      {/* QUICK LOG ACTIONS BAR */}
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
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>QUICK MIND ACTIONS</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <button
            onClick={() => setIsCheckInOpen(true)}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              background: 'linear-gradient(90deg, #8B5CF6, #6366F1)',
              color: '#FFF',
              border: 'none',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
            }}
          >
            <Smile size={14} />
            <span>+ Daily Check-in</span>
          </button>

          <button
            onClick={() => startMeditation('Morning Clarity & Focus', 'guided', 10)}
            style={{
              padding: '8px 16px',
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
            <Play size={14} />
            <span>Start 10m Meditation</span>
          </button>

          <button
            onClick={() => setIsJournalOpen(true)}
            style={{
              padding: '8px 16px',
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
            <BookOpen size={14} />
            <span>+ Write Journal</span>
          </button>
        </div>
      </div>

      {/* HEALTH TRACKERS GRID (MOOD & ENERGY/STRESS/FOCUS) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        <MoodTrackerCard
          currentMood={todayCheckIn.mood}
          moodNote={todayCheckIn.moodNote}
          isCompleted={todayCheckIn.completed}
          onOpenCheckInModal={() => setIsCheckInOpen(true)}
        />

        <EnergyStressFocusCard
          energy={todayCheckIn.energy}
          stress={todayCheckIn.stress}
          focus={todayCheckIn.focus}
          onOpenCheckInModal={() => setIsCheckInOpen(true)}
        />
      </div>

      {/* RENDER CATEGORY SUBVIEWS */}
      {activeCategory === 'Overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* MEDITATION & JOURNAL GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <MeditationSection />
            <JournalSection onOpenCreate={() => setIsJournalOpen(true)} />
          </div>

          {/* INSIGHTS & TIMELINE */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <MindInsightsCard />
            <MindActivityTimeline />
          </div>

          {/* CHARTS ROW: FOCUS TREND & STRESS STRAIN */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <AreaTrendChartCard
              title="Cognitive Focus Level Trend"
              subtitle="Self-reported focus clarity across the week"
              data={focusTrendData}
              dataKey="focus"
              color="#6366F1"
              height={200}
              unit="%"
            />

            <AreaTrendChartCard
              title="Perceived Stress Strain"
              subtitle="Lower stress score represents mental calm"
              data={stressTrendData}
              dataKey="stress"
              color="#10B981"
              height={200}
              unit="%"
            />
          </div>
        </div>
      )}

      {activeCategory === 'Check-in' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              background: 'var(--card-bg, #111827)',
              border: '1px solid var(--card-border, #1F2937)',
              borderRadius: 'var(--card-radius, 16px)',
              padding: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '20px', fontWeight: 800 }}>Daily Mind Check-In</h3>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Mood: {emojis[todayCheckIn.mood].emoji} {emojis[todayCheckIn.mood].label} · Focus: {todayCheckIn.focus}/10 · Energy: {todayCheckIn.energy}/10 · Stress: {todayCheckIn.stress}/10
              </div>
            </div>

            <button
              onClick={() => setIsCheckInOpen(true)}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                background: 'linear-gradient(90deg, #8B5CF6, #6366F1)',
                border: 'none',
                color: '#FFF',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Open Daily Check-In Form
            </button>
          </div>

          <MindActivityTimeline />
        </div>
      )}

      {activeCategory === 'Meditation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <MeditationSection />
          <BarChartCard
            title="Weekly Meditation Minutes"
            subtitle="Mindfulness logged per day"
            data={[
              { name: 'Mon', value: 10 },
              { name: 'Tue', value: 15 },
              { name: 'Wed', value: 15 },
              { name: 'Thu', value: 20 },
              { name: 'Fri', value: 10 },
              { name: 'Sat', value: 15 },
              { name: 'Sun', value: meditation.todayMinutes },
            ]}
            defaultColor="#8B5CF6"
            unit=" min"
            height={220}
          />
        </div>
      )}

      {activeCategory === 'Journal' && (
        <JournalSection onOpenCreate={() => setIsJournalOpen(true)} />
      )}

      {activeCategory === 'Trends' && <MindAnalyticsTab />}

      {activeCategory === 'Insights' && <MindInsightsCard />}

      {/* FLOATING ACTION BUTTON FOR QUICK CHECK-IN */}
      <button
        onClick={() => setIsCheckInOpen(true)}
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          background: 'linear-gradient(90deg, #8B5CF6, #6366F1)',
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
          boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
          zIndex: 99,
        }}
      >
        <Smile size={18} />
        <span>+ DAILY CHECK-IN</span>
      </button>
    </div>
  );
}
