import { useEffect, useState } from 'react';
import { reflectionsAPI, analyticsAPI } from '../api/client';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

const QUESTIONS = [
  { key:'overallScore', text:'How disciplined were you this week overall?' },
  { key:'nonnegScore', text:'Did you honor your non-negotiables?' },
  { key:'clarityScore', text:'How was your mental clarity and focus?' },
  { key:'progressScore', text:'Did you make progress on long-term goals?' },
] as const;

export default function Reflect() {
  const { reflections, setReflections, setDashboard } = useStore();
  const [ratings, setRatings] = useState<Record<string, number>>({ overallScore:0, nonnegScore:0, clarityScore:0, progressScore:0 });
  const [wentWell, setWentWell] = useState('');
  const [brokeDown, setBrokeDown] = useState('');
  const [commitment, setCommitment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { reflectionsAPI.list().then(r => setReflections(r.data)); }, []);

  const canSubmit = Object.values(ratings).every(v => v > 0) && wentWell.length >= 10 && brokeDown.length >= 10 && commitment.length >= 5;

  const submit = async () => {
    if (!canSubmit) { setError('Please rate all questions and fill in at least 10 characters for reflections.'); return; }
    setSubmitting(true); setError('');
    try {
      await reflectionsAPI.create({ ...ratings, wentWell, brokeDown, commitment } as any);
      const [rRes, dashRes] = await Promise.all([
        reflectionsAPI.list(),
        analyticsAPI.dashboard()
      ]);
      setReflections(rRes.data);
      setDashboard(dashRes.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setRatings({ overallScore:0, nonnegScore:0, clarityScore:0, progressScore:0 });
      setWentWell(''); setBrokeDown(''); setCommitment('');
    } catch (e: any) {
      setError(e.response?.data?.error || 'Failed to submit');
    } finally { setSubmitting(false); }
  };

  const Card = ({ children, style = {} }: any) => (
    <div style={{ background:'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:'var(--card-radius, 16px)', boxShadow:'var(--card-shadow)', padding:'22px', transition:'all 0.2s ease', ...style }}>{children}</div>
  );

  const inputStyle = { width:'100%', background:'var(--input-bg)', border:'1px solid var(--input-border)', borderRadius:'8px', padding:'10px 14px', fontSize:'14px', color:'var(--text-main)', outline:'none', fontFamily:'Inter', resize:'vertical' as const };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'20px', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <h1 className="font-sekuya" style={{ fontSize:'24px', fontWeight:700, margin:0, color:'var(--text-main)' }}>Weekly Reflection</h1>
          <div style={{ fontSize:'13px', color:'var(--text-muted)', marginTop:'2px' }}>Honest self-assessment drives real growth.</div>
        </div>
        <button onClick={submit} disabled={submitting}
          style={{ background:'#6366F1', border:'none', borderRadius:'8px', padding:'8px 18px', color:'#fff', fontWeight:500, cursor:'pointer', opacity: submitting ? 0.6 : 1 }}>
          {submitting ? 'Submitting…' : 'Submit Reflection'}
        </button>
      </div>

      {success && (
        <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
          style={{ background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:'8px', padding:'12px 16px', fontSize:'13px', color:'#10B981', marginBottom:'16px' }}>
          ✓ Reflection submitted! Your discipline score has been updated.
        </motion.div>
      )}
      {error && <div style={{ background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'8px', padding:'12px 16px', fontSize:'13px', color:'#EF4444', marginBottom:'16px' }}>{error}</div>}

      <div className="grid-responsive-2" style={{ marginBottom:'20px' }}>
        <Card>
          <h2 className="font-sekuya" style={{ fontSize:'18px', fontWeight:700, margin:'0 0 16px', color:'var(--text-main)' }}>Self-Assessment</h2>
          {QUESTIONS.map(q => (
            <div key={q.key} style={{ background:'var(--input-bg)', border:'1px solid var(--card-border)', borderRadius:'10px', padding:'16px', marginBottom:'12px' }}>
              <div style={{ fontSize:'14px', fontWeight:500, color:'var(--text-main)', marginBottom:'10px' }}>{q.text}</div>
              <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setRatings({...ratings, [q.key]: n})}
                    style={{ width:'28px', height:'28px', borderRadius:'6px', border:`1px solid ${ratings[q.key]>=n ? '#6366F1' : 'var(--input-border)'}`,
                      background: ratings[q.key]>=n ? 'rgba(99,102,241,0.15)' : 'none', color: ratings[q.key]>=n ? '#6366F1' : 'var(--text-muted)',
                      fontSize:'13px', fontWeight:600, cursor:'pointer', fontFamily:'JetBrains Mono' }}>{n}</button>
                ))}
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <div style={{ fontSize:'15px', fontWeight:600, fontFamily:'Space Grotesk', marginBottom:'16px', color:'var(--text-main)' }}>Written Reflection</div>
          <div style={{ marginBottom:'16px' }}>
            <label style={{ display:'block', fontSize:'12px', color:'var(--text-muted)', marginBottom:'6px', textTransform:'uppercase' }}>What went well this week?</label>
            <textarea value={wentWell} onChange={e=>setWentWell(e.target.value)} style={{ ...inputStyle, minHeight:'80px' }} placeholder="Be specific — vague answers don't create growth."/>
          </div>
          <div style={{ marginBottom:'16px' }}>
            <label style={{ display:'block', fontSize:'12px', color:'var(--text-muted)', marginBottom:'6px', textTransform:'uppercase' }}>What broke down and why?</label>
            <textarea value={brokeDown} onChange={e=>setBrokeDown(e.target.value)} style={{ ...inputStyle, minHeight:'80px' }} placeholder="Identify the exact failure point, not the excuse."/>
          </div>
          <div>
            <label style={{ display:'block', fontSize:'12px', color:'#6B7280', marginBottom:'6px', textTransform:'uppercase' }}>One concrete commitment for next week</label>
            <input value={commitment} onChange={e=>setCommitment(e.target.value)} style={inputStyle} placeholder="Make it specific and measurable."/>
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ fontSize:'15px', fontWeight:600, fontFamily:'Space Grotesk', marginBottom:'16px' }}>Past Reflections</div>
        {reflections.length === 0 ? (
          <div style={{ textAlign:'center', padding:'30px', color:'#4B5563', fontSize:'14px' }}>No reflections yet. Submit your first one above.</div>
        ) : reflections.map(r => (
          <div key={r.id} style={{ display:'flex', alignItems:'center', gap:'16px', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize:'12px', color:'#6B7280', minWidth:'90px' }}>{r.weekStart}</div>
            <div style={{ flex:1, fontSize:'13px', color:'#E2E8F0' }}>{r.commitment}</div>
            <div style={{ fontFamily:'JetBrains Mono', fontSize:'14px', fontWeight:600, color:'#6366F1' }}>{r.avgScore}/5</div>
          </div>
        ))}
      </Card>
    </div>
  );
}
