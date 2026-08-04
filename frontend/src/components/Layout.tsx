import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { LayoutDashboard, CheckSquare, Heart, Brain, Utensils, Target, Sun, Moon, Bell, LogOut, MoreHorizontal, Sparkles } from 'lucide-react';
import NotificationsModal from './NotificationsModal';
import MoreMobileNav from './MoreMobileNav';

const DESKTOP_NAV = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/ai-coach', label: 'AI Coach', icon: Sparkles },
  { to: '/discipline', label: 'Discipline', icon: CheckSquare },
  { to: '/body', label: 'Body', icon: Heart },
  { to: '/mind', label: 'Mind', icon: Brain },
  { to: '/nutrition', label: 'Nutrition', icon: Utensils },
  { to: '/goals', label: 'Goals', icon: Target },
];

const MOBILE_PRIMARY_NAV = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/discipline', label: 'Discipline', icon: CheckSquare },
  { to: '/body', label: 'Body', icon: Heart },
  { to: '/mind', label: 'Mind', icon: Brain },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { user, logout, dashboard, theme, setTheme } = useStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMore, setShowMobileMore] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSignOut = () => {
    localStorage.removeItem('dos_token');
    localStorage.removeItem('dos_refresh_token');
    logout();
  };

  const streak = dashboard?.streak?.current ?? 12;
  const score = dashboard?.score ?? 742;
  const level = Math.floor(score / 100) + 1;
  const formattedLevel = level < 10 ? `LVL 0${level}` : `LVL ${level}`;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* DESKTOP TOP HEADER */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          height: '60px',
          borderBottom: '1px solid var(--nav-border)',
          background: 'var(--nav-bg)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Left: DisciplineOS Brand Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div className="font-sekuya" style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Discipline<span className="text-gradient-brand">OS</span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Bar */}
        <div className="hide-mobile" style={{ display: 'flex', gap: '3px', background: 'var(--input-bg)', borderRadius: '10px', padding: '4px', border: '1px solid var(--input-border)' }}>
          {DESKTOP_NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || (to !== '/' && pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  transition: 'all 0.15s ease',
                  background: active ? '#6366F1' : 'transparent',
                  color: active ? '#FFFFFF' : 'var(--text-muted)',
                  boxShadow: active ? '0 2px 8px rgba(99,102,241,0.25)' : 'none',
                }}
              >
                <Icon size={14} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right: Quick Stats, Theme Toggle, Notifications, User Profile & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Flame Streak Indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(245,158,11,0.12)',
              border: '1px solid rgba(245,158,11,0.25)',
              borderRadius: '20px',
              padding: '4px 10px',
            }}
          >
            <span style={{ fontSize: '13px' }}>🔥</span>
            <span className="font-sekuya text-gradient-streak" style={{ fontSize: '13px', fontWeight: 700 }}>
              {streak}
            </span>
          </div>

          {/* Level Badge */}
          <div
            className="hide-mobile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'rgba(124,58,237,0.12)',
              border: '1px solid rgba(124,58,237,0.25)',
              borderRadius: '20px',
              padding: '4px 10px',
            }}
          >
            <span className="font-sekuya text-gradient-xp" style={{ fontSize: '12px', fontWeight: 700 }}>
              {formattedLevel}
            </span>
          </div>

          {/* Theme Toggle Button */}
          <button
            className="hide-mobile"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
              background: 'var(--input-bg)',
              border: '1px solid var(--input-border)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px 10px',
              borderRadius: '8px',
              transition: 'all 0.2s',
            }}
          >
            {theme === 'dark' ? <Sun size={15} color="#F59E0B" /> : <Moon size={15} color="#6366F1" />}
          </button>

          {/* Notifications Button */}
          <button
            className="hide-mobile"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
            style={{
              background: 'var(--input-bg)',
              border: '1px solid var(--input-border)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px 10px',
              borderRadius: '8px',
              position: 'relative',
            }}
          >
            <Bell size={15} color="var(--text-muted)" />
            <span style={{ position: 'absolute', top: '4px', right: '4px', width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444' }} />
          </button>

          {/* Profile Details & Sign Out Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link to="/settings" title="Profile & Settings" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366F1, #7C3AED)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'O'}
              </div>
              <div className="hide-mobile" style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.2 }}>
                  {user?.name || 'Operator'}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  {user?.email || 'authenticated'}
                </span>
              </div>
            </Link>

            <button
              className="hide-mobile"
              onClick={handleSignOut}
              title="Sign Out of Operating System"
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 10px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                transition: 'all 0.15s ease',
              }}
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Notifications Popover */}
      <NotificationsModal isOpen={showNotifications} onClose={() => setShowNotifications(false)} />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '20px 16px', maxWidth: '1140px', margin: '0 auto', width: '100%', paddingBottom: '90px' }}>
        {children}
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div
        className="show-mobile-only"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '62px',
          background: 'var(--nav-bg)',
          borderTop: '1px solid var(--nav-border)',
          backdropFilter: 'blur(12px)',
          zIndex: 100,
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '0 8px',
        }}
      >
        {MOBILE_PRIMARY_NAV.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || (to !== '/' && pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                padding: '6px 12px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '11px',
                fontWeight: 600,
                transition: 'all 0.15s ease',
                color: active ? '#6366F1' : 'var(--text-muted)',
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}

        {/* More Button */}
        <button
          onClick={() => setShowMobileMore(true)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            padding: '6px 12px',
            borderRadius: '8px',
            background: 'none',
            border: 'none',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <MoreHorizontal size={18} />
          <span>More</span>
        </button>
      </div>

      {/* Mobile More Slide-over Drawer */}
      <MoreMobileNav isOpen={showMobileMore} onClose={() => setShowMobileMore(false)} />

      {/* Desktop Footer */}
      <footer className="hide-mobile" style={{ padding: '14px 24px', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
        <span>DisciplineOS · Personal Performance Operating System</span>
        <span>
          Discipline Score: <strong className="font-sekuya text-gradient-score">{score}</strong> / 1000
        </span>
      </footer>
    </div>
  );
}
