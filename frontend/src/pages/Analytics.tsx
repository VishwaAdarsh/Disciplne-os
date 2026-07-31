import { useEffect, useState } from 'react';
import { analyticsAPI } from '../api/client';
import { useStore } from '../store/useStore';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Analytics() {
  const { dashboard, tasks } = useStore();
  const [weekly, setWeekly] = useState<{ date: string; rate: number }[]>([]);

  useEffect(() => { analyticsAPI.weekly().then(r => setWeekly(r.data.weekly)); }, []);

  const Card = ({ children, style = {} }: any) => (
    <div style={{ background:'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:'var(--card-radius, 16px)', boxShadow:'var(--card-shadow)', padding:'22px', transition:'all 0.2s ease', ...style }}>{children}</div>
  );

  const avgRate = dashboard?.history?.length ? Math.round(dashboard.history.reduce((s,h)=>s+h.rate,0)/dashboard.history.length) : 0;
  const totalDone = tasks.filter(t=>t.done).length;
  const heatVals = (dashboard?.history ?? []).slice(-21).map(h => h.rate === 0 ? 0 : h.rate < 30 ? 1 : h.rate < 60 ? 2 : h.rate < 90 ? 3 : 4);

  return (
    <div>
      <div style={{ marginBottom:'20px' }}>
        <h1 className="font-sekuya" style={{ fontSize:'24px', fontWeight:700, margin:0, color:'var(--text-main)' }}>Performance Analytics</h1>
        <div style={{ fontSize:'13px', color:'var(--text-muted)', marginTop:'2px' }}>Data-driven insights into your discipline patterns.</div>
      </div>

      <div className="grid-responsive-3" style={{ marginBottom:'20px' }}>
        <Card style={{ padding:'16px' }}>
          <div style={{ fontSize:'11px', color:'var(--text-muted)', textTransform:'uppercase', marginBottom:'6px', fontWeight:700 }}>Avg Daily Completion</div>
          <div className="font-sekuya text-gradient-score" style={{ fontSize:'26px', fontWeight:700 }}>{avgRate}%</div>
        </Card>
        <Card style={{ padding:'16px' }}>
          <div style={{ fontSize:'11px', color:'var(--text-muted)', textTransform:'uppercase', marginBottom:'6px', fontWeight:700 }}>Longest Streak</div>
          <div className="font-sekuya text-gradient-streak" style={{ fontSize:'26px', fontWeight:700 }}>{dashboard?.streak.best ?? 0}d</div>
        </Card>
        <Card style={{ padding:'16px' }}>
          <div style={{ fontSize:'11px', color:'var(--text-muted)', textTransform:'uppercase', marginBottom:'6px', fontWeight:700 }}>Tasks Done Today</div>
          <div className="font-sekuya text-gradient-success" style={{ fontSize:'26px', fontWeight:700 }}>{totalDone}</div>
        </Card>
      </div>

      <Card style={{ marginBottom:'20px' }}>
        <h2 className="font-sekuya" style={{ fontSize:'18px', fontWeight:700, marginBottom:'4px', color:'var(--text-main)', margin:0 }}>Daily Completion Rate — Last 30 Days</h2>
        <div style={{ fontSize:'12px', color:'var(--text-muted)', marginBottom:'12px' }}>Percentage of tasks completed each day</div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={dashboard?.history ?? []}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false}/>
            <XAxis dataKey="date" tick={{ fill:'var(--text-muted)', fontSize:10 }} tickFormatter={d => d.slice(5)} minTickGap={30}/>
            <YAxis domain={[0,100]} tick={{ fill:'var(--text-muted)', fontSize:10 }} tickFormatter={v=>v+'%'}/>
            <Tooltip contentStyle={{ background:'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:'8px', color:'var(--text-main)', fontSize:'12px' }}/>
            <Line type="monotone" dataKey="rate" stroke="#6366F1" strokeWidth={2} dot={false}/>
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid-responsive-2">
        <Card>
          <div style={{ fontSize:'15px', fontWeight:600, fontFamily:'Space Grotesk', marginBottom:'4px', color:'var(--text-main)' }}>Weekly Breakdown</div>
          <div style={{ fontSize:'12px', color:'var(--text-muted)', marginBottom:'12px' }}>Last 7 days</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={weekly}>
              <XAxis dataKey="date" tick={{ fill:'var(--text-muted)', fontSize:10 }} tickFormatter={d => d.slice(5)}/>
              <YAxis domain={[0,100]} tick={{ fill:'var(--text-muted)', fontSize:10 }} tickFormatter={v=>v+'%'}/>
              <Tooltip contentStyle={{ background:'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:'8px', color:'var(--text-main)', fontSize:'12px' }}/>
              <Line type="monotone" dataKey="rate" stroke="#F59E0B" strokeWidth={2} dot={{ fill:'#F59E0B', r:3 }}/>
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <div style={{ fontSize:'15px', fontWeight:600, fontFamily:'Space Grotesk', marginBottom:'4px', color:'var(--text-main)' }}>Activity Heatmap</div>
          <div style={{ fontSize:'12px', color:'var(--text-muted)', marginBottom:'12px' }}>21-day completion intensity</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'4px' }}>
            {heatVals.map((v,i) => {
              const colors = ['var(--input-bg)','rgba(99,102,241,0.25)','rgba(99,102,241,0.5)','rgba(99,102,241,0.75)','#6366F1'];
              return <div key={i} style={{ height:'14px', borderRadius:'3px', background: colors[v] }}/>;
            })}
          </div>
          <div style={{ display:'flex', gap:'8px', alignItems:'center', fontSize:'11px', color:'var(--text-muted)', marginTop:'14px' }}>
            Less
            {['var(--input-bg)','rgba(99,102,241,0.25)','rgba(99,102,241,0.5)','rgba(99,102,241,0.75)','#6366F1'].map((c,i) => (
              <div key={i} style={{ width:'10px', height:'10px', borderRadius:'2px', background:c }}/>
            ))}
            More
          </div>
        </Card>
      </div>
    </div>
  );
}
