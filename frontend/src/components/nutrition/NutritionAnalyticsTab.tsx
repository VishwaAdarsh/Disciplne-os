import { Utensils, Droplet, Zap, Award } from 'lucide-react';
import { useNutritionStore } from '../../store/nutritionStore';
import BarChartCard from '../charts/BarChartCard';
import AreaTrendChartCard from '../charts/AreaTrendChartCard';

export default function NutritionAnalyticsTab() {
  const { weeklyHistory, nutritionScore, calculateScoreBreakdown } = useNutritionStore();
  const breakdown = calculateScoreBreakdown();

  const calorieData = weeklyHistory.map((h) => ({
    name: h.day,
    value: h.calories,
  }));

  const proteinData = weeklyHistory.map((h) => ({
    name: h.day,
    value: h.protein,
  }));

  const waterData = weeklyHistory.map((h) => ({
    date: h.day,
    water: h.water,
  }));

  const scoreData = weeklyHistory.map((h) => ({
    date: h.day,
    score: h.score,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* NUTRITION SCORE BREAKDOWN CARD */}
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
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Nutrition Performance Breakdown</h3>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Overall Score: <strong style={{ color: '#10B981', fontSize: '14px' }}>{nutritionScore}%</strong> (feeds Performance Engine)
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
          <div style={{ background: 'var(--surface-bg, #1F2937)', padding: '12px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#10B981', fontWeight: 700 }}>
              <Utensils size={14} /> Meals
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>{breakdown.mealScore}%</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>25% Weight</div>
          </div>

          <div style={{ background: 'var(--surface-bg, #1F2937)', padding: '12px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#F59E0B', fontWeight: 700 }}>
              <Utensils size={14} /> Calories
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>{breakdown.calorieScore}%</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>25% Weight</div>
          </div>

          <div style={{ background: 'var(--surface-bg, #1F2937)', padding: '12px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6366F1', fontWeight: 700 }}>
              <Zap size={14} /> Protein
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>{breakdown.proteinScore}%</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>25% Weight</div>
          </div>

          <div style={{ background: 'var(--surface-bg, #1F2937)', padding: '12px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#0EA5E9', fontWeight: 700 }}>
              <Droplet size={14} /> Water
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>{breakdown.waterScore}%</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>15% Weight</div>
          </div>

          <div style={{ background: 'var(--surface-bg, #1F2937)', padding: '12px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#8B5CF6', fontWeight: 700 }}>
              <Award size={14} /> Timing
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>{breakdown.timingScore}%</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>10% Weight</div>
          </div>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        <BarChartCard
          title="Daily Calorie History"
          subtitle="Calories consumed vs 2,200 kcal goal"
          data={calorieData}
          defaultColor="#10B981"
          unit=" kcal"
          height={200}
        />

        <BarChartCard
          title="Weekly Protein Intake"
          subtitle="Protein in grams vs 120g daily target"
          data={proteinData}
          defaultColor="#6366F1"
          unit="g"
          height={200}
        />

        <AreaTrendChartCard
          title="Daily Hydration Trend"
          subtitle="Water logged per day in Liters"
          data={waterData}
          dataKey="water"
          color="#0EA5E9"
          height={200}
          unit=" L"
        />

        <AreaTrendChartCard
          title="Nutrition Score Trend"
          subtitle="Weekly nutrition performance score"
          data={scoreData}
          dataKey="score"
          color="#8B5CF6"
          height={200}
          unit="%"
        />
      </div>
    </div>
  );
}
