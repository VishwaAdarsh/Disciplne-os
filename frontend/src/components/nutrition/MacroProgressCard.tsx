import { Utensils } from 'lucide-react';
import { useNutritionStore } from '../../store/nutritionStore';
import DonutChartCard from '../charts/DonutChartCard';
import HorizontalProgressBar from '../charts/HorizontalProgressBar';

export default function MacroProgressCard() {
  const { calories, protein, carbs, fat } = useNutritionStore();

  const remainingCalories = Math.max(0, calories.target - calories.current);

  const calorieDonutData = [
    { name: 'Consumed', value: calories.current, color: '#10B981' },
    { name: 'Remaining', value: remainingCalories, color: '#1F2937' },
  ];

  return (
    <div
      style={{
        background: 'var(--card-bg, #111827)',
        border: '1px solid var(--card-border, #1F2937)',
        borderRadius: 'var(--card-radius, 16px)',
        boxShadow: 'var(--card-shadow)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Utensils size={18} color="#10B981" />
          <span className="font-sekuya" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
            Macronutrients & Calorie Breakdown
          </span>
        </div>
        <span
          style={{
            fontSize: '11px',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#10B981',
            padding: '3px 10px',
            borderRadius: '12px',
            fontWeight: 700,
          }}
        >
          {calories.current} / {calories.target} KCAL
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {/* CALORIE DONUT CHART */}
        <DonutChartCard
          title="Calorie Budget"
          subtitle={`${remainingCalories} kcal remaining`}
          data={calorieDonutData}
          centerLabel={`${calories.current}`}
          centerSublabel="kcal consumed"
          height={160}
        />

        {/* MACRO PROGRESS BARS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
          <HorizontalProgressBar
            label="Protein Goal"
            current={protein.current}
            max={protein.target}
            unit="g"
            color="#6366F1"
            targetMarker={protein.target}
          />
          <HorizontalProgressBar
            label="Carbohydrates Goal"
            current={carbs.current}
            max={carbs.target}
            unit="g"
            color="#F59E0B"
            targetMarker={carbs.target}
          />
          <HorizontalProgressBar
            label="Fat Goal"
            current={fat.current}
            max={fat.target}
            unit="g"
            color="#8B5CF6"
            targetMarker={fat.target}
          />
        </div>
      </div>
    </div>
  );
}
