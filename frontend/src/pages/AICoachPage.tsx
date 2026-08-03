import React from 'react';
import PageHeader from '../components/PageHeader';
import { DailyBriefingCard } from '../components/ai/DailyBriefingCard';
import { AIChatWidget } from '../components/ai/AIChatWidget';
import { PatternPredictionWidget } from '../components/ai/PatternPredictionWidget';
import { SmartScheduleWidget } from '../components/ai/SmartScheduleWidget';
import { AIReportsWidget } from '../components/ai/AIReportsWidget';
import { useOverviewStore } from '../store/overviewStore';

export default function AICoachPage() {
  const { data } = useOverviewStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PageHeader
        user={data.user}
        title="AI Coach & Intelligence Engine"
        subtitle="Proactive personal performance operating system & behavior intelligence"
        categories={['All', 'Discipline', 'Body', 'Mind', 'Nutrition', 'Goals']}
      />

      {/* 1. DAILY BRIEFING & EVENING REVIEW */}
      <DailyBriefingCard />

      {/* 2. CONVERSATIONAL AI COACH & CHAT */}
      <AIChatWidget />

      {/* 3. PATTERN DETECTOR & GOAL FORECASTING */}
      <PatternPredictionWidget />

      {/* 4. SMART SCHEDULING ENGINE */}
      <SmartScheduleWidget />

      {/* 5. AI REPORTS & REFLECTION THEMES */}
      <AIReportsWidget />
    </div>
  );
}
