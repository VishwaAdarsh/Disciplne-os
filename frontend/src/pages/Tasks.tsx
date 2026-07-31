import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tasksAPI, analyticsAPI } from '../api/client';
import { useStore } from '../store/useStore';
import { Plus, X, Trash2, Flame } from 'lucide-react';
import type { Task } from '../types';

const TYPE_META: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  nonneg: { label: 'MUST DO', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', icon: '⚡' },
  habit: { label: 'DAILY', color: '#A5B4FC', bg: 'rgba(99,102,241,0.15)', icon: '🔁' },
  goal: { label: 'ONGOING', color: '#10B981', bg: 'rgba(16,185,129,0.12)', icon: '🎯' },
};

function TaskRow({ task, onToggle, onDelete }: { task: Task; onToggle: () => void; onDelete: () => void }) {
  const meta = TYPE_META[task.type];
  return (
    <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
      style={{ display:'flex', alignItems:'center', gap:'12px', padding:'12px 14px', borderRadius:'8px',
        border:'1px solid var(--card-border)', marginBottom:'8px', background: task.done ? 'rgba(16,185,129,0.06)' : 'var(--input-bg)', transition:'all 0.2s' }}>
      <div onClick={onToggle} style={{ cursor:'pointer', width:'20px', height:'20px', borderRadius:'50%',
        border:`2px solid ${task.done ? '#10B981' : meta.color}`, background: task.done ? '#10B981' : 'transparent',
        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        {task.done && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>}
      </div>
      <div style={{ flex:1, cursor:'pointer' }} onClick={onToggle}>
        <div style={{ fontSize:'14px', fontWeight:500, color: task.done ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: task.done ? 'line-through' : 'none' }}>{task.name}</div>
        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginTop:'4px' }}>
          <span style={{ fontSize:'11px', padding:'2px 7px', borderRadius:'20px', fontWeight:500, background: meta.bg, color: meta.color }}>{meta.icon} {meta.label}</span>
          {task.streak > 0 && <span style={{ fontSize:'11px', color:'var(--text-muted)', fontFamily:'JetBrains Mono', display:'flex', alignItems:'center', gap:'2px' }}><Flame size={10}/> {task.streak}d</span>}
          {task.timeTarget && <span style={{ fontSize:'11px', color:'var(--text-muted)' }}>{task.timeTarget}</span>}
        </div>
      </div>
      <button onClick={onDelete} style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', padding:'4px' }}><Trash2 size={14}/></button>
    </motion.div>
  );
}

export default function Tasks() {
  const { tasks, setTasks, toggleTaskDone, addTask, removeTask, setDashboard } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name:'', type:'nonneg', timeTarget:'', why:'' });

  useEffect(() => { tasksAPI.list().then(r => setTasks(r.data)); }, []);

  const handleToggle = async (task: Task) => {
    await tasksAPI.toggle(task.id);
    toggleTaskDone(task.id, !task.done);
    const dash = await analyticsAPI.dashboard();
    setDashboard(dash.data);
  };

  const handleDelete = async (id: string) => {
    await tasksAPI.delete(id);
    removeTask(id);
    const dash = await analyticsAPI.dashboard();
    setDashboard(dash.data);
  };

  const handleAdd = async () => {
    if (!form.name.trim()) return;
    const res = await tasksAPI.create({ name: form.name, type: form.type, timeTarget: form.timeTarget || undefined, why: form.why || undefined });
    addTask({ ...res.data, done: false, streak: 0, createdAt: new Date().toISOString() });
    setForm({ name:'', type:'nonneg', timeTarget:'', why:'' });
    setModalOpen(false);
    const dash = await analyticsAPI.dashboard();
    setDashboard(dash.data);
  };

  const grouped = { nonneg: tasks.filter(t=>t.type==='nonneg'), habit: tasks.filter(t=>t.type==='habit'), goal: tasks.filter(t=>t.type==='goal') };

  const Card = ({ children, style = {} }: any) => (
    <div style={{ background:'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:'var(--card-radius, 16px)', boxShadow:'var(--card-shadow)', padding:'22px', transition:'all 0.2s ease', ...style }}>{children}</div>
  );

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <h1 className="font-sekuya" style={{ fontSize:'24px', fontWeight:700, margin:0, color:'var(--text-main)' }}>Task Command Center</h1>
          <div style={{ fontSize:'13px', color:'var(--text-muted)', marginTop:'2px' }}>Build habits through structured, repeatable execution.</div>
        </div>
        <button onClick={() => setModalOpen(true)}
          style={{ display:'flex', alignItems:'center', gap:'6px', background:'#6366F1', border:'none', borderRadius:'8px', padding:'8px 16px', color:'#fff', fontSize:'13px', fontWeight:500, cursor:'pointer' }}>
          <Plus size={14}/> New Task
        </button>
      </div>

      <div className="grid-responsive-2" style={{ marginBottom:'16px' }}>
        <Card>
          <div className="font-sekuya" style={{ fontSize:'14px', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:'12px' }}>Non-Negotiables</div>
          <AnimatePresence>
            {grouped.nonneg.length === 0 ? <div style={{ textAlign:'center', padding:'30px', color:'var(--text-muted)', fontSize:'13px' }}>No non-negotiables yet.</div> :
              grouped.nonneg.map(t => <TaskRow key={t.id} task={t} onToggle={() => handleToggle(t)} onDelete={() => handleDelete(t.id)} />)}
          </AnimatePresence>
        </Card>
        <Card>
          <div className="font-sekuya" style={{ fontSize:'14px', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:'12px' }}>Habit Stack</div>
          <AnimatePresence>
            {grouped.habit.length === 0 ? <div style={{ textAlign:'center', padding:'30px', color:'var(--text-muted)', fontSize:'13px' }}>No habits yet.</div> :
              grouped.habit.map(t => <TaskRow key={t.id} task={t} onToggle={() => handleToggle(t)} onDelete={() => handleDelete(t.id)} />)}
          </AnimatePresence>
        </Card>
      </div>

      <Card>
        <div className="font-sekuya" style={{ fontSize:'14px', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:'12px' }}>Long-term Goals</div>
        <AnimatePresence>
          {grouped.goal.length === 0 ? <div style={{ textAlign:'center', padding:'30px', color:'var(--text-muted)', fontSize:'13px' }}>No goals yet.</div> :
            grouped.goal.map(t => <TaskRow key={t.id} task={t} onToggle={() => handleToggle(t)} onDelete={() => handleDelete(t.id)} />)}
        </AnimatePresence>
      </Card>

      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:'16px' }}
            onClick={() => setModalOpen(false)}>
            <motion.div initial={{ scale:0.95, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.95, opacity:0 }}
              onClick={e => e.stopPropagation()}
              style={{ background:'var(--card-bg)', border:'1px solid var(--input-border)', borderRadius:'16px', padding:'24px', width:'420px', maxWidth:'100%' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
                <div style={{ fontSize:'18px', fontWeight:600, fontFamily:'Space Grotesk', color:'var(--text-main)' }}>Add New Task</div>
                <button onClick={() => setModalOpen(false)} style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer' }}><X size={18}/></button>
              </div>
              <div style={{ marginBottom:'16px' }}>
                <label style={{ display:'block', fontSize:'12px', color:'var(--text-muted)', marginBottom:'6px', textTransform:'uppercase' }}>Task Name</label>
                <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Morning run, Deep work block…"
                  style={{ width:'100%', background:'var(--input-bg)', border:'1px solid var(--input-border)', borderRadius:'8px', padding:'10px 14px', fontSize:'14px', color:'var(--text-main)', outline:'none' }}/>
              </div>
              <div className="grid-responsive-2" style={{ marginBottom:'16px' }}>
                <div>
                  <label style={{ display:'block', fontSize:'12px', color:'var(--text-muted)', marginBottom:'6px', textTransform:'uppercase' }}>Type</label>
                  <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}
                    style={{ width:'100%', background:'var(--input-bg)', border:'1px solid var(--input-border)', borderRadius:'8px', padding:'10px 14px', fontSize:'14px', color:'var(--text-main)' }}>
                    <option value="nonneg">Non-Negotiable</option>
                    <option value="habit">Daily Habit</option>
                    <option value="goal">Long-term Goal</option>
                  </select>
                </div>
                <div>
                  <label style={{ display:'block', fontSize:'12px', color:'var(--text-muted)', marginBottom:'6px', textTransform:'uppercase' }}>Time Target</label>
                  <input value={form.timeTarget} onChange={e=>setForm({...form,timeTarget:e.target.value})} placeholder="6:00 AM"
                    style={{ width:'100%', background:'var(--input-bg)', border:'1px solid var(--input-border)', borderRadius:'8px', padding:'10px 14px', fontSize:'14px', color:'var(--text-main)' }}/>
                </div>
              </div>
              <div style={{ marginBottom:'20px' }}>
                <label style={{ display:'block', fontSize:'12px', color:'var(--text-muted)', marginBottom:'6px', textTransform:'uppercase' }}>Why it matters (optional)</label>
                <input value={form.why} onChange={e=>setForm({...form,why:e.target.value})} placeholder="Connects to your deeper goal…"
                  style={{ width:'100%', background:'var(--input-bg)', border:'1px solid var(--input-border)', borderRadius:'8px', padding:'10px 14px', fontSize:'14px', color:'var(--text-main)' }}/>
              </div>
              <div style={{ display:'flex', gap:'10px' }}>
                <button onClick={handleAdd} style={{ flex:1, background:'#6366F1', border:'none', borderRadius:'8px', padding:'10px', color:'#fff', fontWeight:500, cursor:'pointer' }}>Add Task</button>
                <button onClick={() => setModalOpen(false)} style={{ flex:1, background:'none', border:'1px solid var(--input-border)', borderRadius:'8px', padding:'10px', color:'var(--text-muted)', fontWeight:500, cursor:'pointer' }}>Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
