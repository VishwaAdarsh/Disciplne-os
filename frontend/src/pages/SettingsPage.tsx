import { useEffect, useState } from 'react';
import { settingsAPI } from '../api/client';
import { useStore } from '../store/useStore';

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div onClick={() => onChange(!checked)} style={{ position:'relative', width:'40px', height:'22px', cursor:'pointer', flexShrink:0 }}>
      <div style={{ position:'absolute', inset:0, background: checked ? '#6366F1' : 'rgba(255,255,255,0.1)', borderRadius:'20px', transition:'background 0.2s' }}/>
      <div style={{ position:'absolute', top:'3px', left: checked ? '21px' : '3px', width:'16px', height:'16px', background:'#fff', borderRadius:'50%', transition:'left 0.2s' }}/>
    </div>
  );
}

export default function SettingsPage() {
  const { user, settings, setSettings, theme, setTheme } = useStore();
  const [saved, setSaved] = useState(false);

  useEffect(() => { settingsAPI.get().then(r => setSettings(r.data)); }, []);

  const update = async (patch: Partial<typeof settings>) => {
    if (!settings) return;
    const next = { ...settings, ...patch };
    setSettings(next as any);
    await settingsAPI.update(patch as any);
    setSaved(true); setTimeout(() => setSaved(false), 1500);
  };

  const Card = ({ children, style = {} }: any) => (
    <div style={{ background:'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:'var(--card-radius, 16px)', boxShadow:'var(--card-shadow)', padding:'22px', transition:'all 0.2s ease', ...style }}>{children}</div>
  );

  if (!settings) return <div style={{ color:'var(--text-muted)' }}>Loading settings…</div>;

  return (
    <div>
      <div style={{ marginBottom:'20px' }}>
        <h1 className="font-sekuya" style={{ fontSize:'24px', fontWeight:700, margin:0, color:'var(--text-main)' }}>Settings & Profile</h1>
        <div style={{ fontSize:'13px', color:'var(--text-muted)', marginTop:'2px' }}>Configure your discipline system.</div>
      </div>

      <div className="grid-responsive-2">
        <Card>
          <h2 className="font-sekuya" style={{ fontSize:'18px', fontWeight:700, margin:'0 0 16px', color:'var(--text-main)' }}>Profile & Appearance</h2>
          <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'20px' }}>
            <div style={{ width:'48px', height:'48px', borderRadius:'50%', background:'rgba(99,102,241,0.15)', border:'1.5px solid #6366F1', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', fontWeight:600, color:'#6366F1' }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div style={{ fontSize:'15px', fontWeight:500, color:'var(--text-main)' }}>{user?.name}</div>
              <div style={{ fontSize:'12px', color:'var(--text-muted)' }}>{user?.email}</div>
            </div>
          </div>

          <div style={{ marginBottom:'16px' }}>
            <label style={{ display:'block', fontSize:'12px', color:'var(--text-muted)', marginBottom:'6px', textTransform:'uppercase' }}>Theme Mode</label>
            <div style={{ display:'flex', gap:'8px', background:'var(--input-bg)', borderRadius:'8px', padding:'4px', border:'1px solid var(--input-border)' }}>
              {(['dark', 'light'] as const).map(t => (
                <button key={t} onClick={() => setTheme(t)}
                  style={{ flex:1, padding:'8px', borderRadius:'6px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:500,
                    background: theme === t ? '#6366F1' : 'transparent',
                    color: theme === t ? '#fff' : 'var(--text-muted)', transition:'all 0.15s' }}>
                  {t === 'dark' ? '🌙 Dark Mode' : '☀️ Bright Mode'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom:'16px' }}>
            <label style={{ display:'block', fontSize:'12px', color:'var(--text-muted)', marginBottom:'6px', textTransform:'uppercase' }}>Daily Reset Time</label>
            <select value={settings.resetTime} onChange={e => update({ resetTime: e.target.value })}
              style={{ width:'100%', background:'var(--input-bg)', border:'1px solid var(--input-border)', borderRadius:'8px', padding:'10px 14px', fontSize:'14px', color:'var(--text-main)' }}>
              <option value="04:00">4:00 AM</option><option value="05:00">5:00 AM</option><option value="06:00">6:00 AM</option><option value="00:00">Midnight</option>
            </select>
          </div>
          <div>
            <label style={{ display:'block', fontSize:'12px', color:'var(--text-muted)', marginBottom:'6px', textTransform:'uppercase' }}>Weekly Reflection Day</label>
            <select value={settings.reflectionDay} onChange={e => update({ reflectionDay: e.target.value })}
              style={{ width:'100%', background:'var(--input-bg)', border:'1px solid var(--input-border)', borderRadius:'8px', padding:'10px 14px', fontSize:'14px', color:'var(--text-main)' }}>
              <option>Sunday</option><option>Saturday</option><option>Friday</option>
            </select>
          </div>
          {saved && <div style={{ marginTop:'12px', fontSize:'12px', color:'#10B981' }}>✓ Saved</div>}
        </Card>

        <Card>
          <div style={{ fontSize:'15px', fontWeight:600, fontFamily:'Space Grotesk', marginBottom:'16px', color:'var(--text-main)' }}>Accountability Mode</div>
          {[
            { key:'streakAlerts', name:'Streak Protection Alerts', desc:'Warn when streak is at risk by 8 PM' },
            { key:'publicScore', name:'Public Score Sharing', desc:'Share your discipline score link' },
            { key:'reflectReminder', name:'Weekly Reflection Reminder', desc:'Reminder to reflect on your set day' },
            { key:'comebackMode', name:'Comeback Mode', desc:'Softer streak reset after 1–2 miss days' },
          ].map(({ key, name, desc }) => (
            <div key={key} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'14px 16px', background:'var(--input-bg)', border:'1px solid var(--card-border)', borderRadius:'10px', marginBottom:'10px' }}>
              <Toggle checked={(settings as any)[key]} onChange={(v) => update({ [key]: v } as any)} />
              <div>
                <div style={{ fontSize:'14px', fontWeight:500, color:'var(--text-main)' }}>{name}</div>
                <div style={{ fontSize:'12px', color:'var(--text-muted)', marginTop:'2px' }}>{desc}</div>
              </div>
            </div>
          ))}
          {settings.publicScore && (
            <div style={{ marginTop:'12px', padding:'14px', background:'rgba(99,102,241,0.08)', borderRadius:'8px', border:'1px solid rgba(99,102,241,0.2)' }}>
              <div style={{ fontSize:'12px', fontWeight:600, color:'#A5B4FC', marginBottom:'6px' }}>Your Shareable Score Link</div>
              <div style={{ fontFamily:'JetBrains Mono', fontSize:'12px', color:'var(--text-muted)', wordBreak:'break-all' }}>
                disciplineos.app/score/{user?.id.slice(0,8)}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
