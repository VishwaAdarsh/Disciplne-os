import { useState } from 'react';
import { Settings, Sun, Moon, Bell, Shield, User, Save } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useStore } from '../store/useStore';

export default function SettingsPage() {
  const { user, theme, setTheme } = useStore();
  const [resetTime, setResetTime] = useState('04:00 AM');
  const [reflectionDay, setReflectionDay] = useState('Sunday');
  const [streakAlerts, setStreakAlerts] = useState(true);
  const [publicScore, setPublicScore] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <PageHeader
        title="Settings & Preferences"
        subtitle="Configure your DisciplineOS environment, targets, and system parameters."
      />

      <div
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: 'var(--card-radius, 16px)',
          boxShadow: 'var(--card-shadow)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* PROFILE SECTION */}
        <div>
          <h3 className="font-sekuya" style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 12px', color: 'var(--text-main)' }}>
            Operator Profile
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Name</label>
              <input
                type="text"
                defaultValue={user?.name || 'Adarsh'}
                style={{
                  width: '100%',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--input-border)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '13px',
                  color: 'var(--text-main)',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Email</label>
              <input
                type="email"
                defaultValue={user?.email || 'adarsh@disciplineos.app'}
                style={{
                  width: '100%',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--input-border)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '13px',
                  color: 'var(--text-main)',
                }}
              />
            </div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--card-border)' }} />

        {/* SYSTEM THEME & TIMING */}
        <div>
          <h3 className="font-sekuya" style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 12px', color: 'var(--text-main)' }}>
            System Parameters
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Theme</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setTheme('light')}
                  style={{
                    flex: 1,
                    background: theme === 'light' ? '#6366F1' : 'var(--input-bg)',
                    color: theme === 'light' ? '#FFF' : 'var(--text-muted)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '10px',
                    padding: '10px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Sun size={15} /> Light
                </button>

                <button
                  onClick={() => setTheme('dark')}
                  style={{
                    flex: 1,
                    background: theme === 'dark' ? '#6366F1' : 'var(--input-bg)',
                    color: theme === 'dark' ? '#FFF' : 'var(--text-muted)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '10px',
                    padding: '10px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Moon size={15} /> Dark
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Daily Reset Hour</label>
              <select
                value={resetTime}
                onChange={(e) => setResetTime(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--input-border)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '13px',
                  color: 'var(--text-main)',
                }}
              >
                <option value="04:00 AM">04:00 AM (Default)</option>
                <option value="05:00 AM">05:00 AM</option>
                <option value="12:00 AM">Midnight 12:00 AM</option>
              </select>
            </div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--card-border)' }} />

        {/* NOTIFICATIONS & TOGGLES */}
        <div>
          <h3 className="font-sekuya" style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 12px', color: 'var(--text-main)' }}>
            Notifications & Alerts
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>Streak Protection Alerts</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Get notified 2 hours before daily reset if tasks remain incomplete.</div>
              </div>
              <input
                type="checkbox"
                checked={streakAlerts}
                onChange={(e) => setStreakAlerts(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#6366F1', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>Public Operator Score</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Allow your level & streak to appear on community leaderboard.</div>
              </div>
              <input
                type="checkbox"
                checked={publicScore}
                onChange={(e) => setPublicScore(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#6366F1', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => alert('Settings saved successfully!')}
          style={{
            marginTop: '10px',
            alignSelf: 'flex-start',
            background: '#6366F1',
            color: '#FFF',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 20px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 10px rgba(99, 102, 241, 0.3)',
          }}
        >
          <Save size={15} />
          <span>SAVE PREFERENCES</span>
        </button>
      </div>
    </div>
  );
}
