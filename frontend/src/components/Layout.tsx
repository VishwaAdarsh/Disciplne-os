import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { LayoutDashboard, CheckSquare, BarChart2, BookOpen, Settings, LogOut, Sun, Moon } from 'lucide-react';

const NAV = [
  { to:'/', label:'Dashboard', icon:LayoutDashboard },
  { to:'/tasks', label:'Tasks', icon:CheckSquare },
  { to:'/analytics', label:'Analytics', icon:BarChart2 },
  { to:'/reflect', label:'Reflect', icon:BookOpen },
  { to:'/settings', label:'Settings', icon:Settings },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { user, logout, dashboard, theme, setTheme } = useStore();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', background:'var(--bg)' }}>
      {/* Top Header Bar */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px', height:'56px', borderBottom:'1px solid var(--nav-border)', background:'var(--nav-bg)', position:'sticky', top:0, zIndex:50, backdropFilter:'blur(10px)' }}>
        <div className="font-sekuya" style={{ fontSize:'20px', fontWeight:700, color:'var(--text-main)', letterSpacing:'-0.02em' }}>
          Discipline<span className="text-gradient-brand">OS</span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hide-mobile" style={{ display:'flex', gap:'2px', background:'var(--input-bg)', borderRadius:'10px', padding:'4px' }}>
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link key={to} to={to}
                style={{ display:'flex', alignItems:'center', gap:'6px', padding:'6px 12px', borderRadius:'7px', textDecoration:'none', fontSize:'13px', fontWeight:500, transition:'all 0.15s',
                  background: active ? '#6366F1' : 'transparent',
                  color: active ? '#fff' : 'var(--text-muted)' }}>
                <Icon size={14} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          {dashboard && (
            <div style={{ display:'flex', alignItems:'center', gap:'8px', background:'var(--input-bg)', border:'1px solid var(--input-border)', borderRadius:'20px', padding:'4px 10px' }}>
              <span className="font-sekuya text-gradient-xp" style={{ fontSize:'12px', fontWeight:700, textTransform:'uppercase' }}>Lvl {Math.floor((dashboard.score ?? 0) / 100) + 1}</span>
              <span style={{ color:'var(--card-border)' }}>|</span>
              <div style={{ fontFamily:'JetBrains Mono', fontSize:'12px', fontWeight:700, color:'var(--text-main)' }}>
                <span className="font-sekuya text-gradient-score">{dashboard.score}</span><span style={{ color:'var(--text-muted)', fontWeight:400 }}> pts</span>
              </div>
            </div>
          )}
          
          {/* Theme Toggle Button */}
          <button onClick={toggleTheme} title={theme === 'dark' ? 'Switch to Bright Mode' : 'Switch to Dark Mode'}
            style={{ background:'var(--input-bg)', border:'1px solid var(--input-border)', color:'var(--text-main)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', padding:'6px 10px', borderRadius:'8px', transition:'all 0.2s' }}>
            {theme === 'dark' ? <Sun size={15} color="#F59E0B" /> : <Moon size={15} color="#6366F1" />}
          </button>

          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'rgba(99,102,241,0.15)', border:'1.5px solid #6366F1', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:600, color:'#6366F1' }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <button onClick={logout} title="Sign out"
              style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', display:'flex', alignItems:'center', padding:'4px' }}>
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Page Content Container */}
      <main style={{ flex:1, padding:'16px', maxWidth:'1100px', margin:'0 auto', width:'100%', paddingBottom:'80px' }}>
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="show-mobile-only" style={{ position:'fixed', bottom:0, left:0, right:0, height:'60px', background:'var(--nav-bg)', borderTop:'1px solid var(--nav-border)', backdropFilter:'blur(12px)', zIndex:100, justifyContent:'space-around', alignItems:'center', padding:'0 8px' }}>
        {NAV.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link key={to} to={to}
              style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'2px', padding:'6px 10px', borderRadius:'8px', textDecoration:'none', fontSize:'11px', fontWeight:500, transition:'all 0.15s',
                color: active ? '#6366F1' : 'var(--text-muted)' }}>
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <footer className="hide-mobile" style={{ padding:'12px 24px', borderTop:'1px solid var(--card-border)', display:'flex', justifyContent:'space-between', fontSize:'12px', color:'var(--text-muted)' }}>
        <span>DisciplineOS · Built for consistency, not motivation spikes.</span>
        <span style={{ fontFamily:'JetBrains Mono' }}>Score: <strong style={{ color:'#6366F1' }}>{dashboard?.score ?? '—'}</strong> / 1000</span>
      </footer>
    </div>
  );
}
