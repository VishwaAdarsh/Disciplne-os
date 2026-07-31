import { useState } from 'react';
import { Brain, Smile, Zap, Target, ShieldAlert, Play, BookOpen } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import MetricCard from '../components/MetricCard';
import AreaTrendChartCard from '../components/charts/AreaTrendChartCard';
import PieDistributionCard from '../components/charts/PieDistributionCard';
import HorizontalProgressBar from '../components/charts/HorizontalProgressBar';
import { mockMindData } from '../mock/mindData';

export default function MindPage() {
  const [selectedMood, setSelectedMood] = useState(mockMindData.todayCheckIn.selectedMood);
  const [energy, setEnergy] = useState(mockMindData.todayCheckIn.energy);
  const [focus, setFocus] = useState(mockMindData.todayCheckIn.focus);
  const [stress, setStress] = useState(mockMindData.todayCheckIn.stress);
  const [journalText, setJournalText] = useState(mockMindData.journal.todayReflection);

  const emojis = [
    { level: 1, char: '😞', label: 'Low' },
    { level: 2, char: '😕', label: 'Meh' },
    { level: 3, char: '😐', label: 'Neutral' },
    { level: 4, char: '🙂', label: 'Good' },
    { level: 5, char: '😄', label: 'Great' },
  ];

  const timeDistributionData = [
    { name: 'Deep Focus', value: 4.5, color: '#6366F1' },
    { name: 'Workout & Body', value: 1.2, color: '#10B981' },
    { name: 'Meditation', value: 0.25, color: '#8B5CF6' },
    { name: 'Rest & Admin', value: 2.5, color: '#F59E0B' },
  ];

  const mindSeries = [
    { key: 'focus', name: 'Focus Level', color: '#6366F1' },
    { key: 'energy', name: 'Energy', color: '#F59E0B' },
    { key: 'stress', name: 'Stress (Lower is better)', color: '#10B981' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <PageHeader
        title="Mind & Mental Performance"
        subtitle="Track cognitive focus, emotional energy, stress levels, and daily reflections."
        categories={['Overview', 'Check-in', 'Meditation', 'Journal', 'Trends']}
        onSelectCategory={() => {}}
      />

      {/* TOP STATS CARDS GRID WITH SPARKLINES */}
      <div className="mobile-kpi-grid" style={{ gap: '12px' }}>
        <MetricCard
          title="Mood"
          value={`${selectedMood} / 5`}
          subtext={emojis.find((e) => e.level === selectedMood)?.label || 'Good'}
          badge="CHECKED IN"
          badgeColor="#8B5CF6"
          sparklineData={[3, 3, 4, 4, 5, selectedMood]}
          sparklineColor="#8B5CF6"
          icon={<Smile size={18} color="#8B5CF6" />}
        />
        <MetricCard
          title="Focus"
          value={`${focus} / 10`}
          subtext="High clarity state"
          badge="OPTIMAL"
          badgeColor="#6366F1"
          sparklineData={[6, 7, 7, 8, 8, focus]}
          sparklineColor="#6366F1"
          progressPercent={focus * 10}
          progressColor="linear-gradient(90deg, #6366F1, #8B5CF6)"
          icon={<Target size={18} color="#6366F1" />}
        />
        <MetricCard
          title="Energy"
          value={`${energy} / 10`}
          subtext="Sustained motivation"
          badge="BALANCED"
          badgeColor="#F59E0B"
          sparklineData={[5, 6, 6, 7, 7, energy]}
          sparklineColor="#F59E0B"
          progressPercent={energy * 10}
          progressColor="linear-gradient(90deg, #F59E0B, #F97316)"
          icon={<Zap size={18} color="#F59E0B" />}
        />
        <MetricCard
          title="Stress"
          value={`${stress} / 10`}
          subtext="Low strain level"
          badge="LOW STRESS"
          badgeColor="#10B981"
          sparklineData={[6, 5, 5, 4, 4, stress]}
          sparklineColor="#10B981"
          isUp={false}
          progressPercent={stress * 10}
          progressColor="linear-gradient(90deg, #10B981, #14B8A6)"
          icon={<ShieldAlert size={18} color="#10B981" />}
        />
        <MetricCard
          title="Meditation"
          value={`${mockMindData.topMetrics.meditationMinutes} min`}
          subtext={`${mockMindData.meditation.streakDays}d streak`}
          badge="DAILY LOG"
          badgeColor="#8B5CF6"
          sparklineData={[10, 10, 15, 15, 15, mockMindData.topMetrics.meditationMinutes]}
          sparklineColor="#8B5CF6"
          icon={<Brain size={18} color="#8B5CF6" />}
        />
      </div>

      {/* DAILY CHECK-IN & MEDITATION / JOURNAL GRID */}
      <div className="grid-responsive-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {/* DAILY CHECK-IN CARD */}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="font-sekuya" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
              Daily Mind Check-In
            </span>
            <span style={{ fontSize: '11px', background: 'rgba(139,92,246,0.12)', color: '#8B5CF6', padding: '3px 10px', borderRadius: '12px', fontWeight: 700 }}>
              COMPLETED
            </span>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
              HOW IS YOUR MOOD TODAY?
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {emojis.map((e) => (
                <button
                  key={e.level}
                  onClick={() => setSelectedMood(e.level)}
                  style={{
                    flex: 1,
                    background: selectedMood === e.level ? 'rgba(139,92,246,0.18)' : 'var(--input-bg)',
                    border: selectedMood === e.level ? '1px solid #8B5CF6' : '1px solid var(--input-border)',
                    borderRadius: '12px',
                    padding: '10px 4px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{e.char}</span>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: selectedMood === e.level ? '#8B5CF6' : 'var(--text-muted)' }}>
                    {e.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-main)' }}>Focus Level</span>
                <span style={{ color: '#6366F1' }}>{focus} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={focus}
                onChange={(e) => setFocus(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#6366F1' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-main)' }}>Energy Level</span>
                <span style={{ color: '#F59E0B' }}>{energy} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={energy}
                onChange={(e) => setEnergy(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#F59E0B' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-main)' }}>Stress Level</span>
                <span style={{ color: '#10B981' }}>{stress} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={stress}
                onChange={(e) => setStress(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#10B981' }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TIME DISTRIBUTION & MEDITATION / JOURNAL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* MEDITATION CARD WITH HORIZONTAL PROGRESS BAR */}
          <div
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: 'var(--card-radius, 16px)',
              boxShadow: 'var(--card-shadow)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#8B5CF6', textTransform: 'uppercase' }}>MEDITATION</div>
                <div className="font-sekuya" style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)', margin: '2px 0' }}>
                  {mockMindData.topMetrics.meditationMinutes} min today
                </div>
              </div>

              <button
                onClick={() => alert('Meditation session started!')}
                style={{
                  background: '#8B5CF6',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Play size={14} />
                <span>START SESSION</span>
              </button>
            </div>

            <HorizontalProgressBar
              label="Daily Meditation Target"
              current={mockMindData.topMetrics.meditationMinutes}
              max={20}
              unit="min"
              color="#8B5CF6"
              targetMarker={20}
            />
          </div>

          {/* JOURNAL CARD */}
          <div
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: 'var(--card-radius, 16px)',
              boxShadow: 'var(--card-shadow)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={16} color="#6366F1" />
              <span className="font-sekuya" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                Daily Reflection
              </span>
            </div>

            <textarea
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="How was your day? What went well or broke down?"
              rows={3}
              style={{
                width: '100%',
                background: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                borderRadius: '10px',
                padding: '10px',
                fontSize: '13px',
                color: 'var(--text-main)',
                resize: 'none',
              }}
            />

            <button
              onClick={() => alert('Reflection saved!')}
              style={{
                alignSelf: 'flex-end',
                background: '#6366F1',
                color: '#FFF',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              WRITE REFLECTION
            </button>
          </div>
        </div>
      </div>

      {/* CHARTS ROW: TIME DISTRIBUTION PIE & MULTI-SERIES TREND AREA */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        <PieDistributionCard
          title="Daily Time Distribution"
          subtitle="Part-to-whole breakdown of hours spent across daily activities"
          data={timeDistributionData}
          unit=" hrs"
          height={210}
        />

        <AreaTrendChartCard
          title="30-Day Cognitive & Energy Trends"
          subtitle="Historical tracking of focus, energy, and stress scores"
          data={mockMindData.mindTrends30Days}
          series={mindSeries}
          height={210}
        />
      </div>
    </div>
  );
}
