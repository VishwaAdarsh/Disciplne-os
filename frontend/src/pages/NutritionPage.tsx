import { useState } from 'react';
import { Utensils, Plus, Droplet, CheckCircle, Clock } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import MetricCard from '../components/MetricCard';
import PieDistributionCard from '../components/charts/PieDistributionCard';
import DonutChartCard from '../components/charts/DonutChartCard';
import HorizontalProgressBar from '../components/charts/HorizontalProgressBar';
import { mockNutritionData } from '../mock/nutritionData';

export default function NutritionPage() {
  const [waterLiters, setWaterLiters] = useState(mockNutritionData.water.currentLiters);
  const [meals] = useState(mockNutritionData.meals);

  const handleAddWater = () => {
    setWaterLiters((prev) => Math.min(mockNutritionData.water.targetLiters, Number((prev + 0.25).toFixed(2))));
  };

  const handleLogMeal = () => {
    alert('Meal logging modal triggered! (Visual mock UI)');
  };

  const macroPieData = [
    { name: 'Protein', value: mockNutritionData.protein.current, color: '#6366F1' },
    { name: 'Carbs', value: mockNutritionData.carbs.current, color: '#F59E0B' },
    { name: 'Fat', value: mockNutritionData.fat.current, color: '#8B5CF6' },
  ];

  const calorieDonutData = [
    { name: 'Consumed', value: mockNutritionData.calories.current, color: '#10B981' },
    { name: 'Remaining', value: Math.max(0, mockNutritionData.calories.target - mockNutritionData.calories.current), color: '#6366F1' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <PageHeader
        title="Nutrition & Fuel"
        subtitle="Track calorie intake, macronutrients, meals, and hydration targets."
        categories={['Overview', 'Macros', 'Meals', 'Hydration']}
        onSelectCategory={() => {}}
        actionRight={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleAddWater}
              style={{
                background: 'rgba(14,165,233,0.12)',
                color: '#0EA5E9',
                border: '1px solid rgba(14,165,233,0.25)',
                borderRadius: '10px',
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Droplet size={14} />
              <span>+250 ML WATER</span>
            </button>

            <button
              onClick={handleLogMeal}
              style={{
                background: '#10B981',
                color: '#FFF',
                border: 'none',
                borderRadius: '10px',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)',
              }}
            >
              <Plus size={15} />
              <span>+ LOG MEAL</span>
            </button>
          </div>
        }
      />

      {/* TOP MACROS CARDS GRID WITH HORIZONTAL PROGRESS BARS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <MetricCard
          title="Calories"
          value={`${mockNutritionData.calories.current.toLocaleString()} / ${mockNutritionData.calories.target.toLocaleString()}`}
          subtext={`${mockNutritionData.calories.target - mockNutritionData.calories.current} kcal remaining`}
          badge="78%"
          badgeColor="#10B981"
          sparklineData={[1450, 1520, 1600, 1650, 1700, 1720]}
          sparklineColor="#10B981"
          progressPercent={(mockNutritionData.calories.current / mockNutritionData.calories.target) * 100}
          progressColor="linear-gradient(90deg, #10B981, #14B8A6)"
          icon={<Utensils size={18} color="#10B981" />}
        />

        <MetricCard
          title="Protein"
          value={`${mockNutritionData.protein.current} / ${mockNutritionData.protein.target}g`}
          subtext={`${mockNutritionData.protein.target - mockNutritionData.protein.current}g remaining`}
          badge="68%"
          badgeColor="#6366F1"
          sparklineData={[60, 65, 70, 75, 80, 82]}
          sparklineColor="#6366F1"
          progressPercent={(mockNutritionData.protein.current / mockNutritionData.protein.target) * 100}
          progressColor="linear-gradient(90deg, #6366F1, #818CF8)"
        />

        <MetricCard
          title="Carbs"
          value={`${mockNutritionData.carbs.current} / ${mockNutritionData.carbs.target}g`}
          subtext={`${mockNutritionData.carbs.target - mockNutritionData.carbs.current}g remaining`}
          badge="72%"
          badgeColor="#F59E0B"
          sparklineData={[120, 140, 155, 165, 175, 180]}
          sparklineColor="#F59E0B"
          progressPercent={(mockNutritionData.carbs.current / mockNutritionData.carbs.target) * 100}
          progressColor="linear-gradient(90deg, #F59E0B, #F97316)"
        />

        <MetricCard
          title="Fat"
          value={`${mockNutritionData.fat.current} / ${mockNutritionData.fat.target}g`}
          subtext={`${mockNutritionData.fat.target - mockNutritionData.fat.current}g remaining`}
          badge="69%"
          badgeColor="#8B5CF6"
          sparklineData={[35, 40, 42, 45, 46, 48]}
          sparklineColor="#8B5CF6"
          progressPercent={(mockNutritionData.fat.current / mockNutritionData.fat.target) * 100}
          progressColor="linear-gradient(90deg, #8B5CF6, #C026D3)"
        />

        <MetricCard
          title="Water Intake"
          value={`${waterLiters} / ${mockNutritionData.water.targetLiters}L`}
          subtext={`${Math.round((waterLiters / mockNutritionData.water.targetLiters) * 100)}% reached`}
          badge="HYDRATED"
          badgeColor="#0EA5E9"
          sparklineData={[1.2, 1.5, 1.8, 1.9, 2.0, waterLiters]}
          sparklineColor="#0EA5E9"
          progressPercent={(waterLiters / mockNutritionData.water.targetLiters) * 100}
          progressColor="linear-gradient(90deg, #38BDF8, #0284C7)"
          icon={<Droplet size={18} color="#0EA5E9" />}
        />
      </div>

      {/* CHARTS ROW: MACRONUTRIENT DISTRIBUTION & CALORIE PROGRESS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        <PieDistributionCard
          title="Macronutrient Distribution"
          subtitle="Part-to-whole breakdown of today's consumed macros (g)"
          data={macroPieData}
          unit="g"
          height={200}
        />

        <DonutChartCard
          title="Caloric Goal Progress"
          subtitle="Calories consumed vs remaining daily allowance"
          data={calorieDonutData}
          centerLabel={`${mockNutritionData.calories.current}`}
          centerSublabel="kcal consumed"
          height={200}
          unit=" kcal"
        />
      </div>

      {/* DETAILED HORIZONTAL MACRO TARGETS */}
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
        <h3 className="font-sekuya" style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
          Detailed Target Progress
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <HorizontalProgressBar
            label="Daily Caloric Goal"
            current={mockNutritionData.calories.current}
            max={mockNutritionData.calories.target}
            unit="kcal"
            color="#10B981"
            targetMarker={mockNutritionData.calories.target}
          />
          <HorizontalProgressBar
            label="Protein Requirement"
            current={mockNutritionData.protein.current}
            max={mockNutritionData.protein.target}
            unit="g"
            color="#6366F1"
            targetMarker={mockNutritionData.protein.target}
          />
          <HorizontalProgressBar
            label="Carbohydrate Intake"
            current={mockNutritionData.carbs.current}
            max={mockNutritionData.carbs.target}
            unit="g"
            color="#F59E0B"
            targetMarker={mockNutritionData.carbs.target}
          />
          <HorizontalProgressBar
            label="Healthy Fats Intake"
            current={mockNutritionData.fat.current}
            max={mockNutritionData.fat.target}
            unit="g"
            color="#8B5CF6"
            targetMarker={mockNutritionData.fat.target}
          />
          <HorizontalProgressBar
            label="Hydration Goal"
            current={waterLiters}
            max={mockNutritionData.water.targetLiters}
            unit="L"
            color="#0EA5E9"
            targetMarker={mockNutritionData.water.targetLiters}
          />
        </div>
      </div>

      {/* MEALS LOG TABLE / LIST CARD */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Utensils size={18} color="#10B981" />
            <h2 className="font-sekuya" style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
              Today's Meals
            </h2>
          </div>
          <span style={{ fontSize: '11px', background: 'rgba(16,185,129,0.12)', color: '#10B981', padding: '3px 10px', borderRadius: '12px', fontWeight: 700 }}>
            {meals.filter((m) => m.logged).length} / {meals.length} LOGGED
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {meals.map((m) => (
            <div
              key={m.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderRadius: '12px',
                background: m.logged ? 'var(--input-bg)' : 'transparent',
                border: m.logged ? '1px solid var(--card-border)' : '1px dashed var(--card-border)',
                opacity: m.logged ? 1 : 0.7,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: m.logged ? 'rgba(16,185,129,0.12)' : 'var(--input-bg)',
                    color: m.logged ? '#10B981' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    fontWeight: 700,
                  }}
                >
                  {m.logged ? <CheckCircle size={16} /> : <Clock size={16} />}
                </div>

                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>{m.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {m.logged ? `${m.time} · P: ${m.proteinGrams}g · C: ${m.carbsGrams}g · F: ${m.fatGrams}g` : 'Not logged yet'}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div className="font-sekuya" style={{ fontSize: '16px', fontWeight: 700, color: m.logged ? 'var(--text-main)' : 'var(--text-muted)' }}>
                  {m.logged ? `${m.calories} kcal` : '—'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
