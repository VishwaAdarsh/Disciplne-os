import { useState } from 'react';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InsightItem {
  id: string;
  category: 'Tips' | 'Insights' | 'Suggestions';
  title: string;
  description: string;
  impact: string;
}

interface PersonalInsightsCardProps {
  insights: InsightItem[];
}

export default function PersonalInsightsCard({ insights }: PersonalInsightsCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!insights || insights.length === 0) {
    return null;
  }

  const currentInsight = insights[currentIndex % insights.length];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % insights.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + insights.length) % insights.length);
  };

  return (
    <div
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--card-radius, 16px)',
        boxShadow: 'var(--card-shadow)',
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="#8B5CF6" />
          <h2 className="font-sekuya" style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
            AI Engine Insights
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={handlePrev}
            style={{
              background: 'var(--input-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-main)',
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
            {currentIndex + 1} / {insights.length}
          </span>
          <button
            onClick={handleNext}
            style={{
              background: 'var(--input-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-main)',
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentInsight.id}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(99,102,241,0.03))',
            border: '1px solid rgba(139,92,246,0.2)',
            borderRadius: '14px',
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                background: 'rgba(139,92,246,0.18)',
                color: '#8B5CF6',
                padding: '2px 8px',
                borderRadius: '10px',
              }}
            >
              {currentInsight.category}
            </span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#10B981' }}>{currentInsight.impact}</span>
          </div>

          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>{currentInsight.title}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.4 }}>"{currentInsight.description}"</div>
        </motion.div>
      </AnimatePresence>

      {/* Dots Indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
        {insights.map((_, idx) => (
          <div
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            style={{
              width: idx === currentIndex ? '18px' : '6px',
              height: '6px',
              borderRadius: '4px',
              background: idx === currentIndex ? '#8B5CF6' : 'var(--card-border)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}
