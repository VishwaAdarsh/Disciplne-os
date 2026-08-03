import { Smile, Target, Zap, ShieldAlert, Brain, BookOpen } from 'lucide-react';
import { useMindStore } from '../../store/mindStore';
import AreaTrendChartCard from '../charts/AreaTrendChartCard';
import BarChartCard from '../charts/BarChartCard';

export default function MindAnalyticsTab() {
  const { mindTrends30Days, mindScore, calculateScoreBreakdown } = useMindStore();
  const breakdown = calculateScoreBreakdown();

  const moodTrendData = mindTrends30Days.map((t) => ({
    date: t.date,
    mood: Math.round(t.mood * 20), // Scale 1-5 to 100%
  }));

  const focusTrendData = mindTrends30Days.map((t) => ({
    date: t.date,
    focus: t.focus * 10,
  }));

  const stressTrendData = mindTrends30Days.map((t) => ({
    date: t.date,
    stress: t.stress * 10,
  }));

  const meditationHistoryData = [
    { name: 'Mon', value: 10 },
    { name: 'Tue', value: 15 },
    { name: 'Wed', value: 15 },
    { name: 'Thu', value: 20 },
    { name: 'Fri', value: 10 },
    { name: 'Sat', value: 15 },
    { name: 'Sun', value: 15 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* MIND SCORE BREAKDOWN CARD */}
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
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Mind Performance Score Breakdown</h3>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Overall Score: <strong style={{ color: '#8B5CF6', fontSize: '14px' }}>{mindScore}%</strong> (feeds Performance Engine)
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
          <div style={{ background: 'var(--surface-bg, #1F2937)', padding: '12px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#8B5CF6', fontWeight: 700 }}>
              <Smile size={14} /> Mood
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>{breakdown.moodScore}%</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>20% Weight</div>
          </div>

          <div style={{ background: 'var(--surface-bg, #1F2937)', padding: '12px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6366F1', fontWeight: 700 }}>
              <Target size={14} /> Focus
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>{breakdown.focusScore}%</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>20% Weight</div>
          </div>

          <div style={{ background: 'var(--surface-bg, #1F2937)', padding: '12px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#F59E0B', fontWeight: 700 }}>
              <Zap size={14} /> Energy
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>{breakdown.energyScore}%</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>15% Weight</div>
          </div>

          <div style={{ background: 'var(--surface-bg, #1F2937)', padding: '12px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#10B981', fontWeight: 700 }}>
              <ShieldAlert size={14} /> Stress
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>{breakdown.stressScore}%</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>15% Weight (Inv)</div>
          </div>

          <div style={{ background: 'var(--surface-bg, #1F2937)', padding: '12px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#38BDF8', fontWeight: 700 }}>
              <Brain size={14} /> Meditation
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>{breakdown.meditationScore}%</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>15% Weight</div>
          </div>

          <div style={{ background: 'var(--surface-bg, #1F2937)', padding: '12px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#EC4899', fontWeight: 700 }}>
              <BookOpen size={14} /> Journal
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>{breakdown.journalScore}%</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>15% Weight</div>
          </div>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        <AreaTrendChartCard
          title="Cognitive Focus Level Trend"
          subtitle="30-day focus clarity rating (scaled %)"
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

        <AreaTrendChartCard
          title="Emotional Mood Trend"
          subtitle="30-day self-reported mood progression"
          data={moodTrendData}
          dataKey="mood"
          color="#8B5CF6"
          height={200}
          unit="%"
        />

        <BarChartCard
          title="Weekly Meditation History"
          subtitle="Minutes of mindfulness logged per day"
          data={meditationHistoryData}
          defaultColor="#8B5CF6"
          unit=" min"
          height={200}
        />
      </div>
    </div>
  );
}
