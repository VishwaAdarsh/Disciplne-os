import { useState } from 'react';
import {
  Utensils,
  Plus,
  Droplet,
  Zap,
  Flame,
  Award,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import MetricCard from '../components/MetricCard';
import BarChartCard from '../components/charts/BarChartCard';
import AreaTrendChartCard from '../components/charts/AreaTrendChartCard';
import { useNutritionStore } from '../store/nutritionStore';

// Nutrition Subcomponents
import LogMealModal from '../components/nutrition/LogMealModal';
import LogWaterModal from '../components/nutrition/LogWaterModal';
import MealTimelineCard from '../components/nutrition/MealTimelineCard';
import MacroProgressCard from '../components/nutrition/MacroProgressCard';
import NutritionInsightsCard from '../components/nutrition/NutritionInsightsCard';
import NutritionAnalyticsTab from '../components/nutrition/NutritionAnalyticsTab';
import NutritionActivityTimeline from '../components/nutrition/NutritionActivityTimeline';

export default function NutritionPage() {
  const {
    nutritionScore,
    calories,
    protein,
    carbs,
    fat,
    water,
    weeklyHistory,
    addWater,
  } = useNutritionStore();

  const [activeCategory, setActiveCategory] = useState<string>('Overview');

  // Modal open states
  const [isLogMealOpen, setIsLogMealOpen] = useState(false);
  const [isLogWaterOpen, setIsLogWaterOpen] = useState(false);

  const calorieBarData = weeklyHistory.map((h) => ({
    name: h.day,
    value: h.calories,
    color: '#10B981',
  }));

  const waterTrendData = weeklyHistory.map((h) => ({
    date: h.day,
    water: h.water,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', position: 'relative' }}>
      {/* MODALS */}
      <LogMealModal isOpen={isLogMealOpen} onClose={() => setIsLogMealOpen(false)} />
      <LogWaterModal isOpen={isLogWaterOpen} onClose={() => setIsLogWaterOpen(false)} />

      {/* HEADER WITH CATEGORIES */}
      <PageHeader
        title="Nutrition & Fuel"
        subtitle="Track daily meals, hydration targets, calories, and macronutrient balance."
        categories={['Overview', 'Meals', 'Macros', 'Hydration', 'Analytics', 'Insights']}
        onSelectCategory={(cat) => setActiveCategory(cat)}
      />

      {/* TOP STATS MACROS CARDS GRID */}
      <div className="mobile-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
        {/* NUTRITION SCORE CARD */}
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
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>NUTRITION SCORE</span>
            <Award size={16} color="#10B981" />
          </div>
          <div style={{ margin: '8px 0' }}>
            <span style={{ fontSize: '32px', fontWeight: 900, color: '#10B981' }}>{nutritionScore}%</span>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Dietary consistency & balance
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
            <div style={{ height: '100%', width: `${nutritionScore}%`, background: '#10B981' }} />
          </div>
        </div>

        <MetricCard
          title="Calories"
          value={`${calories.current.toLocaleString()} / ${calories.target.toLocaleString()}`}
          subtext={`${Math.max(0, calories.target - calories.current)} kcal remaining`}
          badge={`${Math.round((calories.current / calories.target) * 100)}%`}
          badgeColor="#10B981"
          sparklineData={[1450, 1520, 1600, 1650, 1700, calories.current]}
          sparklineColor="#10B981"
          progressPercent={(calories.current / calories.target) * 100}
          progressColor="linear-gradient(90deg, #10B981, #14B8A6)"
          icon={<Flame size={18} color="#10B981" />}
        />

        <MetricCard
          title="Protein"
          value={`${protein.current} / ${protein.target}g`}
          subtext={`${Math.max(0, protein.target - protein.current)}g remaining`}
          badge={`${Math.round((protein.current / protein.target) * 100)}%`}
          badgeColor="#6366F1"
          sparklineData={[60, 65, 70, 75, 80, protein.current]}
          sparklineColor="#6366F1"
          progressPercent={(protein.current / protein.target) * 100}
          progressColor="linear-gradient(90deg, #6366F1, #818CF8)"
          icon={<Zap size={18} color="#6366F1" />}
        />

        <MetricCard
          title="Carbs"
          value={`${carbs.current} / ${carbs.target}g`}
          subtext={`${Math.max(0, carbs.target - carbs.current)}g remaining`}
          badge={`${Math.round((carbs.current / carbs.target) * 100)}%`}
          badgeColor="#F59E0B"
          sparklineData={[120, 140, 155, 165, 175, carbs.current]}
          sparklineColor="#F59E0B"
          progressPercent={(carbs.current / carbs.target) * 100}
          progressColor="linear-gradient(90deg, #F59E0B, #F97316)"
        />

        <MetricCard
          title="Fat"
          value={`${fat.current} / ${fat.target}g`}
          subtext={`${Math.max(0, fat.target - fat.current)}g remaining`}
          badge={`${Math.round((fat.current / fat.target) * 100)}%`}
          badgeColor="#8B5CF6"
          sparklineData={[35, 40, 42, 45, 46, fat.current]}
          sparklineColor="#8B5CF6"
          progressPercent={(fat.current / fat.target) * 100}
          progressColor="linear-gradient(90deg, #8B5CF6, #C026D3)"
        />

        <MetricCard
          title="Water Intake"
          value={`${water.currentLiters} / ${water.targetLiters}L`}
          subtext={`${Math.round((water.currentLiters / water.targetLiters) * 100)}% reached`}
          badge="HYDRATED"
          badgeColor="#0EA5E9"
          sparklineData={[1.2, 1.5, 1.8, 1.9, 2.0, water.currentLiters]}
          sparklineColor="#0EA5E9"
          progressPercent={(water.currentLiters / water.targetLiters) * 100}
          progressColor="linear-gradient(90deg, #38BDF8, #0284C7)"
          icon={<Droplet size={18} color="#0EA5E9" />}
        />
      </div>

      {/* QUICK ACTIONS BAR */}
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
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>QUICK NUTRITION ACTIONS</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <button
            onClick={() => setIsLogMealOpen(true)}
            style={{
              padding: '8px 16px',
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
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            }}
          >
            <Plus size={14} />
            <span>+ LOG MEAL</span>
          </button>

          <button
            onClick={() => setIsLogWaterOpen(true)}
            style={{
              padding: '8px 16px',
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
            onClick={() => addWater(250)}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.1)',
              color: '#38BDF8',
              border: '1px dashed rgba(56, 189, 248, 0.3)',
              fontWeight: 600,
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            +250ml Glass
          </button>

          <button
            onClick={() => addWater(500)}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.1)',
              color: '#38BDF8',
              border: '1px dashed rgba(56, 189, 248, 0.3)',
              fontWeight: 600,
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            +500ml Bottle
          </button>
        </div>
      </div>

      {/* RENDER CATEGORY SUBVIEWS */}
      {activeCategory === 'Overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* MEAL TIMELINE & MACRO PROGRESS GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <MealTimelineCard onOpenLogModal={() => setIsLogMealOpen(true)} />
            <MacroProgressCard />
          </div>

          {/* INSIGHTS & ACTIVITY FEED GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <NutritionInsightsCard />
            <NutritionActivityTimeline />
          </div>

          {/* CHARTS ROW: CALORIE FREQUENCY & WATER TREND */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <BarChartCard
              title="Daily Calorie History"
              subtitle="Total calories logged per day vs 2,200 kcal goal"
              data={calorieBarData}
              defaultColor="#10B981"
              unit=" kcal"
              height={200}
            />

            <AreaTrendChartCard
              title="Daily Hydration Trend"
              subtitle="Liters of water consumed per day"
              data={waterTrendData}
              dataKey="water"
              color="#0EA5E9"
              height={200}
              unit=" L"
            />
          </div>
        </div>
      )}

      {activeCategory === 'Meals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <MealTimelineCard onOpenLogModal={() => setIsLogMealOpen(true)} />
          <BarChartCard
            title="Weekly Calorie History"
            subtitle="Total calories logged per day"
            data={calorieBarData}
            defaultColor="#10B981"
            unit=" kcal"
            height={220}
          />
        </div>
      )}

      {activeCategory === 'Macros' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <MacroProgressCard />
          <BarChartCard
            title="Weekly Protein Intake"
            subtitle="Protein logged per day in grams vs 120g target"
            data={weeklyHistory.map((h) => ({ name: h.day, value: h.protein }))}
            defaultColor="#6366F1"
            unit="g"
            height={220}
          />
        </div>
      )}

      {activeCategory === 'Hydration' && (
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Droplet size={20} color="#0EA5E9" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Hydration Tracker</h3>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Current: {water.currentLiters}L / Goal: {water.targetLiters}L ({Math.round((water.currentLiters / water.targetLiters) * 100)}%)
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => addWater(250)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38BDF8',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                +250ml
              </button>
              <button
                onClick={() => addWater(500)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(56, 189, 248, 0.2)',
                  color: '#38BDF8',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                +500ml
              </button>
            </div>
          </div>

          <AreaTrendChartCard
            title="7-Day Hydration History"
            subtitle="Water intake per day in Liters"
            data={waterTrendData}
            dataKey="water"
            color="#0EA5E9"
            height={240}
            unit=" L"
          />
        </div>
      )}

      {activeCategory === 'Analytics' && <NutritionAnalyticsTab />}

      {activeCategory === 'Insights' && <NutritionInsightsCard />}

      {/* FLOATING ACTION BUTTON FOR MEAL LOGGING */}
      <button
        onClick={() => setIsLogMealOpen(true)}
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
        <Plus size={18} />
        <span>+ LOG MEAL</span>
      </button>
    </div>
  );
}
