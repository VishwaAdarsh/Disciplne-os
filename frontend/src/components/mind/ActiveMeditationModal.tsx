import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, Brain, Wind, Volume2 } from 'lucide-react';
import { useMindStore } from '../../store/mindStore';

export default function ActiveMeditationModal() {
  const { activeMeditation, pauseMeditation, resumeMeditation, tickMeditationTimer, finishMeditation, cancelMeditation } =
    useMindStore();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (activeMeditation.status === 'running') {
      interval = setInterval(() => {
        tickMeditationTimer();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeMeditation.status, tickMeditationTimer]);

  if (activeMeditation.status === 'idle') return null;

  const minutes = Math.floor(activeMeditation.elapsedSeconds / 60);
  const seconds = activeMeditation.elapsedSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const getIcon = () => {
    if (activeMeditation.type === 'breathing') return <Wind size={24} color="#8B5CF6" />;
    return <Brain size={24} color="#8B5CF6" />;
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{
            background: 'var(--card-bg, #111827)',
            border: '1px solid var(--card-border, #1F2937)',
            borderRadius: '28px',
            width: '100%',
            maxWidth: '440px',
            padding: '32px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6)',
            color: 'var(--text-main, #FFFFFF)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(139, 92, 246, 0.15)',
              color: '#8B5CF6',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 700,
            }}
          >
            {getIcon()}
            <span>MEDITATION SESSION</span>
          </div>

          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px 0' }}>{activeMeditation.title}</h2>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Type: {activeMeditation.type.toUpperCase()} · Target: {activeMeditation.targetMinutes} min
            </div>
          </div>

          {/* BREATHING PULSING RING */}
          <div
            style={{
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, rgba(139,92,246,0.05) 70%)',
              border: `2px solid ${activeMeditation.status === 'running' ? '#8B5CF6' : '#F59E0B'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: activeMeditation.status === 'running' ? '0 0 40px rgba(139,92,246,0.3)' : 'none',
              transition: 'all 0.5s ease',
            }}
          >
            <div style={{ fontSize: '42px', fontWeight: 900, fontFamily: 'monospace', color: '#FFF' }}>
              {formattedTime}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: 'var(--text-muted)',
              background: 'rgba(255,255,255,0.03)',
              padding: '6px 12px',
              borderRadius: '12px',
            }}
          >
            <Volume2 size={14} color="#8B5CF6" />
            <span>Focus on your breath. Inhale clarity, exhale tension.</span>
          </div>

          {/* CONTROLS */}
          <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
            {activeMeditation.status === 'running' ? (
              <button
                onClick={pauseMeditation}
                style={{
                  flex: 1,
                  background: '#F59E0B',
                  color: '#000',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Pause size={18} />
                <span>PAUSE</span>
              </button>
            ) : (
              <button
                onClick={resumeMeditation}
                style={{
                  flex: 1,
                  background: '#8B5CF6',
                  color: '#FFF',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Play size={18} />
                <span>RESUME</span>
              </button>
            )}

            <button
              onClick={finishMeditation}
              style={{
                flex: 1,
                background: 'linear-gradient(90deg, #8B5CF6, #6366F1)',
                color: '#FFF',
                border: 'none',
                padding: '14px',
                borderRadius: '14px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)',
              }}
            >
              <Square size={18} />
              <span>FINISH</span>
            </button>
          </div>

          <button
            onClick={cancelMeditation}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '12px',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Cancel Session
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
