import { BarChartCard, DonutChartCard } from './charts';
import { Flame, Calendar, Activity, CheckCircle, Clock } from 'lucide-react';
import type { DisciplineAnalyticsData } from '../types/discipline';

interface DisciplineAnalyticsCardProps {
  analytics: DisciplineAnalyticsData;
}

export default function DisciplineAnalyticsCard({ analytics }: DisciplineAnalyticsCardProps) {
  const {
    completionRate,
    disciplineScore,
    weeklyConsistency,
    totalFocusHours,
    currentStreak,
    bestStreak,
    missedTasksCount,
    heatmapData,
    weeklyFocusTrend,
  } = analytics;

  const focusChartData = weeklyFocusTrend.map((w) => ({
    name: w.day,
    value: w.hours,
    color: '#6366F1',
  }));

  const consistencyDonutData = [
    { name: 'Executed', value: weeklyConsistency, color: '#10B981' },
    { name: 'Missed / Skipped', value: 100 - weeklyConsistency, color: '#F59E0B' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Analytics KPI Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>
            <Activity size={14} color="#6366F1" /> DISCIPLINE SCORE
          </div>
          <div className="font-sekuya text-gradient-score" style={{ fontSize: '24px', fontWeight: 800 }}>
            {disciplineScore} / 100
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Contributed to Engine</span>
        </div>

        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>
            <CheckCircle size={14} color="#10B981" /> EXECUTION RATE
          </div>
          <div className="font-sekuya" style={{ fontSize: '24px', fontWeight: 800, color: '#10B981' }}>
            {completionRate}%
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Daily tasks completed</span>
        </div>

        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>
            <Flame size={14} color="#F59E0B" /> STREAK STATUS
          </div>
          <div className="font-sekuya text-gradient-streak" style={{ fontSize: '24px', fontWeight: 800 }}>
            🔥 {currentStreak} Days
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Best: {bestStreak} Days</span>
        </div>

        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>
            <Clock size={14} color="#8B5CF6" /> TOTAL FOCUS
          </div>
          <div className="font-sekuya text-gradient-xp" style={{ fontSize: '24px', fontWeight: 800 }}>
            {totalFocusHours} hrs
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Logged today</span>
        </div>
      </div>

      {/* Heatmap Calendar Section */}
      <div
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: 'var(--card-radius, 16px)',
          boxShadow: 'var(--card-shadow)',
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="#6366F1" />
            <h2 className="font-sekuya" style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
              28-Day Execution Heatmap
            </h2>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Consistency Matrix</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
          {heatmapData.map((d, i) => {
            let bg = 'rgba(99, 102, 241, 0.1)';
            if (d.rate >= 90) bg = '#10B981';
            else if (d.rate >= 70) bg = 'rgba(16, 185, 129, 0.6)';
            else if (d.rate >= 40) bg = 'rgba(245, 158, 11, 0.5)';
            return (
              <div
                key={i}
                title={`${d.date}: ${d.rate}% completed`}
                style={{
                  height: '28px',
                  borderRadius: '6px',
                  background: bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: d.rate >= 70 ? '#FFFFFF' : 'var(--text-main)',
                }}
              >
                {d.rate}%
              </div>
            );
          })}
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        <BarChartCard
          title="Daily Focus Hours Trend"
          subtitle="Deep Work hours logged per day"
          data={focusChartData}
          defaultColor="#6366F1"
          unit=" hrs"
          height={200}
        />

        <DonutChartCard
          title="Weekly Protocol Consistency"
          subtitle="Proportion of completed vs missed protocols"
          data={consistencyDonutData}
          centerLabel={`${weeklyConsistency}%`}
          centerSublabel="Consistency"
          height={200}
        />
      </div>
    </div>
  );
}
