import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyticsAPI, tasksAPI } from '../api/client';
import { useStore } from '../store/useStore';
import { Flame, Zap, CheckCircle2, Award, Calendar, Sparkles, TrendingUp, Target, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

function ScoreRing({ score }: { score: number }) {
  const r = 52, circ = 2 * Math.PI * r;
  const maxScore = 1000;
  const offset = circ - (circ * Math.min(score, maxScore)) / maxScore;

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="140" height="140" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="scoreRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="50%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--card-border)" strokeWidth="8" />
        <motion.circle cx="60" cy="60" r={r} fill="none" stroke="url(#scoreRingGrad)" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} transform="rotate(-90 60 60)" />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span className="font-sekuya text-gradient-score" style={{ fontSize: '32px', fontWeight: 700, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginTop: '2px' }}>Points</span>
      </div>
    </div>
  );
}

function StreakDots({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '12px' }}>
      {Array.from({ length: Math.min(28, Math.max(current + 4, 14)) }, (_, i) => (
        <div key={i} title={i < current ? `Day ${i + 1}: Active` : `Day ${i + 1}: Upcoming`} style={{
          width: '9px', height: '9px', borderRadius: '50%',
          background: i < current ? '#F59E0B' : 'var(--card-border)',
          transition: 'all 0.2s ease'
        }} />
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { user, dashboard, setDashboard, tasks, setTasks, toggleTaskDone } = useStore();
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      await analyticsAPI.updateStreak();
      const [dashRes, tasksRes] = await Promise.all([
        analyticsAPI.dashboard(),
        tasksAPI.list()
      ]);
      setDashboard(dashRes.data);
      setTasks(tasksRes.data);
    }
    loadData();
  }, []);

  const handleToggle = async (taskId: string, done: boolean) => {
    setToggling(taskId);
    try {
      await tasksAPI.toggle(taskId);
      toggleTaskDone(taskId, !done);
      await analyticsAPI.updateStreak();
      const dash = await analyticsAPI.dashboard();
      setDashboard(dash.data);
    } finally { setToggling(null); }
  };

  const nonnegTasks = tasks.filter(t => t.type === 'nonneg');
  const chartData = dashboard?.history?.slice(-14) ?? [];
  const score = dashboard?.score ?? 0;
  const tier = dashboard?.tier ?? '—';
  const tierColor = tier === 'Elite' ? '#10B981' : tier === 'Consistent' ? '#6366F1' : tier === 'Building' ? '#F59E0B' : '#64748B';

  const level = Math.floor(score / 100) + 1;
  const currentLevelXp = score % 100;
  const pendingNonnegCount = nonnegTasks.filter(t => !t.done).length;

  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const formattedDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  const Card = ({ children, style = {}, className = '' }: any) => (
    <div className={className} style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      borderRadius: 'var(--card-radius, 16px)',
      boxShadow: 'var(--card-shadow)',
      padding: '22px',
      transition: 'all 0.2s ease',
      ...style
    }}>
      {children}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Daily Hero Banner */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(79,70,229,0.06), rgba(124,58,237,0.02))',
          border: '1px solid rgba(99,102,241,0.18)',
          borderRadius: 'var(--card-radius, 16px)',
          padding: '24px 28px',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} /> {formattedDate}
            </span>
            <span style={{ fontSize: '12px', background: 'rgba(99,102,241,0.1)', color: 'var(--accent)', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
              Performance OS
            </span>
          </div>
          <h1 className="font-sekuya" style={{ fontSize: '28px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
            {timeGreeting}, <span className="text-gradient-brand">{user?.name || 'Operator'}</span>
          </h1>
          {dashboard?.motivation && (
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '8px 0 0', fontStyle: 'italic', maxWidth: '600px' }}>
              "{dashboard.motivation.message}"
            </p>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: pendingNonnegCount > 0 ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {pendingNonnegCount > 0 ? <Zap size={18} color="#EF4444" /> : <CheckCircle2 size={18} color="#10B981" />}
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Must Do</div>
              <div className={pendingNonnegCount > 0 ? 'text-gradient-danger' : 'text-gradient-success'} style={{ fontSize: '14px', fontWeight: 700 }}>
                {pendingNonnegCount > 0 ? `${pendingNonnegCount} Pending` : 'All Complete!'}
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flame size={18} color="#F59E0B" />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Streak</div>
              <div className="font-sekuya text-gradient-streak" style={{ fontSize: '15px', fontWeight: 700 }}>
                {dashboard?.streak.current ?? 0} Days Active
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main KPI Grid */}
      <div className="grid-responsive-3">
        {/* Primary KPI: Discipline Score Radial Progress */}
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Discipline Score</span>
            <span style={{ fontSize: '11px', background: `${tierColor}18`, color: tierColor, padding: '2px 10px', borderRadius: '20px', fontWeight: 700 }}>
              {tier}
            </span>
          </div>

          <ScoreRing score={score} />

          <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={15} color="#7C3AED" />
            <span className="font-sekuya text-gradient-xp" style={{ fontSize: '14px', fontWeight: 700 }}>Level {level} Operator</span>
          </div>
        </Card>

        {/* KPI 2: Level Progression & XP */}
        <Card style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Level Progress</span>
              <span className="font-sekuya text-gradient-xp" style={{ fontSize: '13px', fontWeight: 700 }}>Lvl {level}</span>
            </div>
            <div className="font-sekuya text-gradient-xp" style={{ fontSize: '32px', fontWeight: 700, marginBottom: '4px' }}>
              {currentLevelXp} <span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: 500 }} className="font-inter">/ 100 XP</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {100 - currentLevelXp} XP remaining for Level {level + 1}
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <div style={{ background: 'var(--input-bg)', borderRadius: '20px', height: '10px', overflow: 'hidden', border: '1px solid var(--card-border)' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${currentLevelXp}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                style={{ height: '100%', background: 'linear-gradient(90deg, #7C3AED, #C026D3)', borderRadius: '20px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
              <span className="font-sekuya">Lvl {level}</span>
              <span className="font-sekuya">Lvl {level + 1}</span>
            </div>
          </div>
        </Card>

        {/* KPI 3: Streak & Today's Tasks */}
        <Card style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Today's Execution</span>
              <span className="font-sekuya text-gradient-success" style={{ fontSize: '13px', fontWeight: 700 }}>{dashboard?.today.rate ?? 0}%</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-main)' }}>
              <span className="font-sekuya">{dashboard?.today.done ?? 0}</span> <span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: 400 }}>/ {dashboard?.today.total ?? 0}</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>tasks completed today</div>
          </div>

          <div>
            <div style={{ background: 'var(--input-bg)', borderRadius: '20px', height: '8px', overflow: 'hidden', margin: '14px 0 10px', border: '1px solid var(--card-border)' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${dashboard?.today.rate ?? 0}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ height: '100%', background: 'linear-gradient(90deg, #10B981, #14B8A6)', borderRadius: '20px' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={18} color="#F59E0B" />
              <span className="font-sekuya text-gradient-streak" style={{ fontSize: '14px', fontWeight: 700 }}>{dashboard?.streak.current ?? 0}d streak</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: 'auto' }}>Best: {dashboard?.streak.best ?? 0}d</span>
            </div>
            <StreakDots current={dashboard?.streak.current ?? 0} />
          </div>
        </Card>
      </div>

      {/* Main Section: Non-Negotiables & 14-Day Trend */}
      <div className="grid-responsive-2">
        {/* Interactive Non-Negotiables Card */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="#F59E0B" />
              <h2 className="font-sekuya" style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Non-Negotiables</h2>
            </div>
            <span style={{ fontSize: '11px', background: 'rgba(245,158,11,0.12)', color: '#F59E0B', padding: '3px 8px', borderRadius: '12px', fontWeight: 700 }}>
              MUST EXECUTE
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 16px' }}>Core daily actions. Zero compromises allowed.</p>

          {nonnegTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)', fontSize: '13px', border: '1px dashed var(--card-border)', borderRadius: '12px' }}>
              No non-negotiables configured yet. Add them in the Tasks section.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {nonnegTasks.map(task => (
                <motion.div key={task.id} whileHover={{ x: 2 }} onClick={() => handleToggle(task.id, task.done)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: task.done ? '1px solid rgba(16,185,129,0.25)' : '1px solid var(--card-border)',
                    background: task.done ? 'rgba(16,185,129,0.05)' : 'var(--input-bg)',
                    cursor: 'pointer',
                    opacity: toggling === task.id ? 0.6 : 1,
                    transition: 'all 0.2s ease'
                  }}>
                  <motion.div animate={{ scale: task.done ? [1, 1.2, 1] : 1 }}
                    style={{
                      width: '22px', height: '22px', borderRadius: '50%',
                      border: `2px solid ${task.done ? '#10B981' : '#F59E0B'}`,
                      background: task.done ? '#10B981' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transition: 'all 0.2s ease'
                    }}>
                    {task.done && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>}
                  </motion.div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: task.done ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: task.done ? 'line-through' : 'none' }}>
                      {task.name}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '3px' }}>
                      {task.timeTarget && <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>⏰ {task.timeTarget}</span>}
                      {task.streak > 0 && <span className="font-sekuya text-gradient-streak" style={{ fontSize: '12px', fontWeight: 700 }}>🔥 {task.streak}d streak</span>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        {/* 14-Day Performance Trend Chart */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="var(--accent)" />
              <h2 className="font-sekuya" style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>14-Day Consistency Trend</h2>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Completion %</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 16px' }}>Daily task execution history</p>

          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickFormatter={d => d.slice(5)} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickFormatter={v => v + '%'} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '10px', color: 'var(--text-main)', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} formatter={(v: any) => [`${v}%`, 'Completion Rate']} />
              <Area type="monotone" dataKey="rate" stroke="#4F46E5" strokeWidth={2.5} fill="url(#scoreGrad)" dot={{ fill: '#4F46E5', r: 3.5 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Score Weight Breakdown */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 className="font-sekuya" style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Discipline Score Breakdown</h2>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>How your 1,000 max score is calculated daily</div>
          </div>
        </div>

        <div className="grid-responsive-3">
          {[
            { label: 'Task Completion', value: `${dashboard?.today.rate ?? 0}%`, contrib: '40% max weight', colorClass: 'text-gradient-score', pct: dashboard?.today.rate ?? 0 },
            { label: 'Streak Consistency', value: `${dashboard?.streak.current ?? 0} days`, contrib: '30% max weight', colorClass: 'text-gradient-streak', pct: Math.min(100, ((dashboard?.streak.current ?? 0) / 30) * 100) },
            { label: 'Reflection Quality', value: `${dashboard?.reflectionCount ?? 0} logs`, contrib: '30% max weight', colorClass: 'text-gradient-success', pct: Math.min(100, (dashboard?.reflectionCount ?? 0) * 25) },
          ].map(({ label, value, contrib, colorClass, pct }) => (
            <div key={label} style={{ background: 'var(--input-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>{label}</div>
              <div className={`font-sekuya ${colorClass}`} style={{ fontSize: '24px', fontWeight: 700, marginBottom: '6px' }}>{value}</div>
              <div style={{ background: 'var(--card-border)', borderRadius: '20px', height: '5px', overflow: 'hidden', marginBottom: '8px' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.2 }}
                  style={{ height: '100%', background: 'linear-gradient(90deg, #4F46E5, #7C3AED)', borderRadius: '20px' }} />
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{contrib}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

