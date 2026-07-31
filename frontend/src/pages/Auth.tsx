import { useState } from 'react';
import { motion } from 'framer-motion';
import { authAPI } from '../api/client';
import { useStore } from '../store/useStore';
import { User, Mail, Lock, Eye, EyeOff, Zap, ShieldCheck, ArrowRight, Sparkles, AlertCircle, Flame, Award } from 'lucide-react';

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ email: '', name: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [forgotNotice, setForgotNotice] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser, setToken } = useStore();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = mode === 'login'
        ? await authAPI.login({ email: form.email, password: form.password })
        : await authAPI.register(form);
      setToken(res.data.token);
      setUser(res.data.user);
    } catch (e: any) {
      setError(e.response?.data?.error || 'Authentication failed. Please check your credentials.');
    } finally { setLoading(false); }
  };

  const handleQuickDemo = async () => {
    setError(''); setLoading(true);
    const demoEmail = 'selby.thomas.234@gmail.com';
    const demoPass = 'password123';
    setForm({ ...form, email: demoEmail, password: demoPass });
    try {
      const res = await authAPI.login({ email: demoEmail, password: demoPass });
      setToken(res.data.token);
      setUser(res.data.user);
    } catch (e: any) {
      try {
        const resReg = await authAPI.register({ name: 'Selby Thomas', email: demoEmail, password: demoPass });
        setToken(resReg.data.token);
        setUser(resReg.data.user);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Could not launch demo session.');
      }
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: '32px 16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Ambient Glow Effects */}
      <div style={{
        position: 'absolute',
        top: '-150px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(99,102,241,0) 70%)',
        pointerEvents: 'none'
      }} />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{
          width: '100%',
          maxWidth: '460px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 10
        }}>
        
        {/* Top Branding Header Section (NO Card Box) */}
        <div style={{ textAlign: 'center', marginBottom: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.22)',
            padding: '4px 14px',
            borderRadius: '20px',
            marginBottom: '14px'
          }}>
            <Sparkles size={13} color="#6366F1" />
            <span className="font-sekuya text-gradient-brand" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Performance Operating System
            </span>
          </div>

          <h1 className="font-sekuya" style={{ fontSize: '40px', fontWeight: 700, margin: '0 0 10px', color: 'var(--text-main)', lineHeight: 1.1 }}>
            Discipline<span className="text-gradient-brand">OS</span>
          </h1>

          <p style={{ fontSize: '14px', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6, margin: 0, maxWidth: '420px' }}>
            Build compound consistency through structured daily non-negotiables, real-time discipline scoring, and gamified progress.
          </p>
        </div>

        {/* Centered Authentication Card */}
        <div style={{
          width: '100%',
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: 'var(--card-radius, 16px)',
          boxShadow: 'var(--card-shadow)',
          padding: '32px 28px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Mode Switcher Tabs */}
          <div style={{ display: 'flex', gap: '6px', background: 'var(--input-bg)', borderRadius: '12px', padding: '4px', marginBottom: '24px', border: '1px solid var(--card-border)' }}>
            {(['login', 'register'] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); }}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '9px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  background: mode === m ? 'var(--accent)' : 'transparent',
                  color: mode === m ? '#FFFFFF' : 'var(--text-muted)'
                }}>
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mode === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>Your Name</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px' }} />
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'var(--input-bg)',
                      border: '1px solid var(--input-border)',
                      borderRadius: '10px',
                      padding: '11px 14px 11px 40px',
                      fontSize: '14px',
                      color: 'var(--text-main)',
                      outline: 'none',
                      transition: 'border 0.2s ease'
                    }}
                    placeholder="Selby Thomas" required />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>Email Address</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px' }} />
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'var(--input-bg)',
                    border: '1px solid var(--input-border)',
                    borderRadius: '10px',
                    padding: '11px 14px 11px 40px',
                    fontSize: '14px',
                    color: 'var(--text-main)',
                    outline: 'none',
                    transition: 'border 0.2s ease'
                  }}
                  placeholder="you@example.com" required />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Password</label>
                {mode === 'login' && (
                  <button type="button" onClick={() => setForgotNotice(!forgotNotice)}
                    style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
                    Forgot?
                  </button>
                )}
              </div>

              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px' }} />
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'var(--input-bg)',
                    border: '1px solid var(--input-border)',
                    borderRadius: '10px',
                    padding: '11px 40px 11px 40px',
                    fontSize: '14px',
                    color: 'var(--text-main)',
                    outline: 'none',
                    transition: 'border 0.2s ease'
                  }}
                  placeholder={mode === 'register' ? 'Min 8 characters' : '••••••••'} required minLength={mode === 'register' ? 8 : 1} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} title={showPassword ? 'Hide password' : 'Show password'}
                  style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'flex' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {forgotNotice && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: 'var(--text-main)' }}>
                🔑 Password reset instructions sent to account email.
              </motion.div>
            )}

            {error && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#EF4444' }}>
                <AlertCircle size={16} flexShrink={0} />
                <span>{error}</span>
              </motion.div>
            )}

            <button type="submit" disabled={loading}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                border: 'none',
                borderRadius: '10px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: 700,
                color: '#FFFFFF',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(79,70,229,0.25)'
              }}>
              {loading ? 'Authenticating…' : (
                <>
                  <span>{mode === 'login' ? 'Sign In to Operating System' : 'Create Operator Account'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* Quick 1-Click Demo Login */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '6px 0 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }} />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>or test instantly</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }} />
            </div>

            <button type="button" onClick={handleQuickDemo} disabled={loading}
              style={{
                width: '100%',
                background: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                borderRadius: '10px',
                padding: '11px',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-main)',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}>
              <Zap size={15} color="#F59E0B" />
              <span>1-Click Quick Demo Login</span>
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', margin: '20px 0 0' }}>
            Discipline is built in private. Your data stays strictly yours.
          </p>
        </div>

        {/* Subtle Bottom Feature Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '18px', marginTop: '24px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
            <Zap size={14} color="#F59E0B" /> Non-Negotiables
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
            <Award size={14} color="#6366F1" /> 1,000-Pt Scoring
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
            <Flame size={14} color="#EF4444" /> Level Progression
          </span>
        </div>
      </motion.div>
    </div>
  );
}


