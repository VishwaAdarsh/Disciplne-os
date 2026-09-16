import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  Flame,
  Zap,
  Target,
  Brain,
  Utensils,
  TrendingUp,
  Info,
  Clock,
  ArrowRight,
  ChevronLeft,
  Plus,
} from 'lucide-react';
import { useNotificationStore } from '../store/notificationStore';
import type { NotificationType, NotificationItem } from '../types/notifications';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return 'Recently';
  }
}

function getTypeIcon(type: NotificationType | string) {
  switch (type) {
    case 'goal':
      return <Target size={15} color="#10B981" />;
    case 'discipline':
      return <Zap size={15} color="#6366F1" />;
    case 'body':
      return <Flame size={15} color="#EF4444" />;
    case 'nutrition':
      return <Utensils size={15} color="#10B981" />;
    case 'mind':
      return <Brain size={15} color="#8B5CF6" />;
    case 'performance':
      return <TrendingUp size={15} color="#F59E0B" />;
    case 'reminder':
    case 'routine':
      return <Clock size={15} color="#06B6D4" />;
    case 'system':
    default:
      return <Info size={15} color="#6B7280" />;
  }
}

function getTypeBg(type: NotificationType | string): string {
  switch (type) {
    case 'goal':
      return 'rgba(16, 185, 129, 0.12)';
    case 'discipline':
      return 'rgba(99, 102, 241, 0.12)';
    case 'body':
      return 'rgba(239, 68, 68, 0.12)';
    case 'nutrition':
      return 'rgba(16, 185, 129, 0.12)';
    case 'mind':
      return 'rgba(139, 92, 246, 0.12)';
    case 'performance':
      return 'rgba(245, 158, 11, 0.12)';
    case 'reminder':
    case 'routine':
      return 'rgba(6, 182, 212, 0.12)';
    case 'system':
    default:
      return 'rgba(107, 114, 128, 0.12)';
  }
}

export default function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    totalCount,
    loading,
    filter,
    preferences,
    reminders,
    fetchNotifications,
    fetchPreferences,
    fetchReminders,
    setFilter,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    updatePreferences,
    toggleReminder,
    createReminder,
    deleteReminder,
  } = useNotificationStore();

  const [activeTab, setActiveTab] = useState<'inbox' | 'reminders' | 'preferences'>('inbox');

  // Add Reminder Form State
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('discipline');
  const [newTime, setNewTime] = useState('08:00');
  const [isSubmittingReminder, setIsSubmittingReminder] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
      fetchPreferences();
      fetchReminders();
    }
  }, [isOpen, fetchNotifications, fetchPreferences, fetchReminders]);

  if (!isOpen) return null;

  const handleActionClick = async (notif: NotificationItem) => {
    if (!notif.isRead) {
      await markAsRead(notif.id);
    }
    if (notif.actionUrl) {
      onClose();
      navigate(notif.actionUrl);
    }
  };

  const handleCreateReminderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTime) return;

    setIsSubmittingReminder(true);
    try {
      await createReminder({
        title: newTitle.trim(),
        category: newCategory,
        timeOfDay: newTime,
        isEnabled: true,
      });
      setNewTitle('');
      setShowAddReminder(false);
    } catch (err) {
      console.error('Failed to create reminder:', err);
    } finally {
      setIsSubmittingReminder(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '64px',
        right: '16px',
        width: '390px',
        maxWidth: 'calc(100vw - 32px)',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '16px',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.22)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '82vh',
        overflow: 'hidden',
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          borderBottom: '1px solid var(--card-border)',
          background: 'var(--input-bg)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {activeTab === 'preferences' ? (
            <button
              onClick={() => setActiveTab('inbox')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
              }}
              title="Back"
            >
              <ChevronLeft size={18} />
            </button>
          ) : (
            <Bell size={16} color="#6366F1" />
          )}

          <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)' }}>
            {activeTab === 'preferences'
              ? 'Notification Preferences'
              : activeTab === 'reminders'
              ? 'Scheduled Reminders'
              : 'Notifications'}
          </span>

          {activeTab === 'inbox' && unreadCount > 0 && (
            <span
              style={{
                background: '#6366F1',
                color: '#FFFFFF',
                fontSize: '10px',
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: '10px',
              }}
            >
              {unreadCount}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {activeTab === 'inbox' && (
            <>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  title="Mark all as read"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px',
                    borderRadius: '6px',
                  }}
                >
                  <CheckCheck size={16} />
                </button>
              )}

              {totalCount > 0 && (
                <button
                  onClick={() => clearAll(true)}
                  title="Clear read notifications"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px',
                    borderRadius: '6px',
                  }}
                >
                  <Trash2 size={15} />
                </button>
              )}
            </>
          )}

          <button
            onClick={() => setActiveTab(activeTab === 'preferences' ? 'inbox' : 'preferences')}
            title="Notification settings"
            style={{
              background: activeTab === 'preferences' ? 'rgba(99,102,241,0.15)' : 'none',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'preferences' ? '#6366F1' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
              borderRadius: '6px',
            }}
          >
            <Settings size={15} />
          </button>

          <button
            onClick={onClose}
            title="Close"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* SEGMENTED VIEW SWITCHER (INBOX / REMINDERS) */}
      {activeTab !== 'preferences' && (
        <div
          style={{
            display: 'flex',
            padding: '6px 12px',
            background: 'var(--card-bg)',
            borderBottom: '1px solid var(--card-border)',
            gap: '6px',
          }}
        >
          <button
            onClick={() => setActiveTab('inbox')}
            style={{
              flex: 1,
              padding: '6px 10px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'inbox' ? 'var(--input-bg)' : 'transparent',
              color: activeTab === 'inbox' ? 'var(--text-main)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Bell size={13} />
            <span>Inbox</span>
            {unreadCount > 0 && (
              <span
                style={{
                  background: '#EF4444',
                  color: '#FFF',
                  fontSize: '9px',
                  fontWeight: 700,
                  padding: '1px 5px',
                  borderRadius: '10px',
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('reminders')}
            style={{
              flex: 1,
              padding: '6px 10px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'reminders' ? 'var(--input-bg)' : 'transparent',
              color: activeTab === 'reminders' ? 'var(--text-main)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Clock size={13} />
            <span>Reminders</span>
            {reminders.length > 0 && (
              <span
                style={{
                  background: 'var(--card-border)',
                  color: 'var(--text-muted)',
                  fontSize: '9px',
                  fontWeight: 700,
                  padding: '1px 5px',
                  borderRadius: '10px',
                }}
              >
                {reminders.length}
              </span>
            )}
          </button>
        </div>
      )}

      {/* VIEW 1: PREFERENCES */}
      {activeTab === 'preferences' && (
        <div style={{ padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 12px',
              borderRadius: '10px',
              background: 'var(--input-bg)',
              border: '1px solid var(--input-border)',
            }}
          >
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
                Global Notifications
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Master switch for system notifications
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences?.enabled ?? true}
              onChange={(e) => updatePreferences({ enabled: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: '#6366F1', cursor: 'pointer' }}
            />
          </div>

          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            Category Subscriptions
          </div>

          {[
            { key: 'disciplineEnabled', label: 'Discipline', desc: 'Tasks, habits, and daily execution' },
            { key: 'bodyEnabled', label: 'Body', desc: 'Workouts, hydration, and sleep logs' },
            { key: 'mindEnabled', label: 'Mind', desc: 'Meditation, stress, and reflections' },
            { key: 'nutritionEnabled', label: 'Nutrition', desc: 'Meal tracking and macro updates' },
            { key: 'goalsEnabled', label: 'Goals', desc: 'Milestones, completions, and deadlines' },
            { key: 'performanceEnabled', label: 'Performance', desc: 'Score snapshots and streak changes' },
            { key: 'remindersEnabled', label: 'Reminders', desc: 'Scheduled morning, midday, and evening routines' },
          ].map(({ key, label, desc }) => {
            const isChecked = preferences ? (preferences as any)[key] : true;
            return (
              <div
                key={key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: '1px solid var(--card-border)',
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}>{label}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{desc}</div>
                </div>
                <input
                  type="checkbox"
                  disabled={!preferences?.enabled}
                  checked={isChecked}
                  onChange={(e) => updatePreferences({ [key]: e.target.checked })}
                  style={{ width: '16px', height: '16px', accentColor: '#6366F1', cursor: 'pointer' }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: REMINDERS */}
      {activeTab === 'reminders' && (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          <div
            style={{
              padding: '10px 14px',
              borderBottom: '1px solid var(--card-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--card-bg)',
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
              Active Timers ({reminders.filter((r) => r.isEnabled).length} active)
            </span>
            <button
              onClick={() => setShowAddReminder(!showAddReminder)}
              style={{
                background: showAddReminder ? 'var(--input-bg)' : '#6366F1',
                color: showAddReminder ? 'var(--text-muted)' : '#FFF',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {showAddReminder ? <X size={12} /> : <Plus size={12} />}
              <span>{showAddReminder ? 'Cancel' : 'Add Reminder'}</span>
            </button>
          </div>

          {/* INLINE ADD REMINDER FORM */}
          {showAddReminder && (
            <form
              onSubmit={handleCreateReminderSubmit}
              style={{
                padding: '12px 14px',
                background: 'var(--input-bg)',
                borderBottom: '1px solid var(--card-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <input
                type="text"
                placeholder="Reminder title (e.g. Take Electrolytes)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--input-border)',
                  background: 'var(--card-bg)',
                  color: 'var(--text-main)',
                  fontSize: '12px',
                }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--input-border)',
                    background: 'var(--card-bg)',
                    color: 'var(--text-main)',
                    fontSize: '12px',
                  }}
                >
                  <option value="discipline">Discipline (Tasks/Habits)</option>
                  <option value="body">Body (Workouts/Water)</option>
                  <option value="nutrition">Nutrition (Meals)</option>
                  <option value="mind">Mind (Meditation)</option>
                  <option value="goals">Goals (Milestones)</option>
                </select>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  required
                  style={{
                    width: '110px',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: '1px solid var(--input-border)',
                    background: 'var(--card-bg)',
                    color: 'var(--text-main)',
                    fontSize: '12px',
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmittingReminder || !newTitle.trim()}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#6366F1',
                  color: '#FFF',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  opacity: isSubmittingReminder ? 0.7 : 1,
                }}
              >
                {isSubmittingReminder ? 'Adding...' : 'Save Scheduled Reminder'}
              </button>
            </form>
          )}

          {/* REMINDERS LIST */}
          <div style={{ padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            {reminders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                No active reminders configured.
              </div>
            ) : (
              reminders.map((r) => (
                <div
                  key={r.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: r.isEnabled ? 'var(--input-bg)' : 'transparent',
                    border: `1px solid ${r.isEnabled ? 'var(--input-border)' : 'var(--card-border)'}`,
                    opacity: r.isEnabled ? 1 : 0.65,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: getTypeBg(r.category),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {getTypeIcon(r.category)}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: 'var(--text-main)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {r.title}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', gap: '6px' }}>
                        <span style={{ fontWeight: 700, color: '#6366F1' }}>{r.timeOfDay}</span>
                        <span>· Daily routine</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '8px' }}>
                    <input
                      type="checkbox"
                      checked={r.isEnabled}
                      onChange={(e) => toggleReminder(r.id, e.target.checked)}
                      title={r.isEnabled ? 'Disable reminder' : 'Enable reminder'}
                      style={{ width: '16px', height: '16px', accentColor: '#6366F1', cursor: 'pointer' }}
                    />
                    <button
                      onClick={() => deleteReminder(r.id)}
                      title="Delete reminder"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: INBOX (NOTIFICATIONS LIST) */}
      {activeTab === 'inbox' && (
        <>
          {/* TABS (ALL / UNREAD) */}
          <div
            style={{
              display: 'flex',
              gap: '4px',
              padding: '8px 16px',
              borderBottom: '1px solid var(--card-border)',
              background: 'var(--card-bg)',
            }}
          >
            <button
              onClick={() => setFilter('all')}
              style={{
                flex: 1,
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none',
                background: filter === 'all' ? '#6366F1' : 'transparent',
                color: filter === 'all' ? '#FFFFFF' : 'var(--text-muted)',
                transition: 'all 0.15s ease',
              }}
            >
              All {totalCount > 0 && `(${totalCount})`}
            </button>
            <button
              onClick={() => setFilter('unread')}
              style={{
                flex: 1,
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none',
                background: filter === 'unread' ? '#6366F1' : 'transparent',
                color: filter === 'unread' ? '#FFFFFF' : 'var(--text-muted)',
                transition: 'all 0.15s ease',
              }}
            >
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </button>
          </div>

          {/* LIST */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '12px',
              overflowY: 'auto',
              flex: 1,
            }}
          >
            {loading && notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '32px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--text-muted)',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--input-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '4px',
                  }}
                >
                  <Bell size={20} color="var(--text-muted)" />
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
                  {filter === 'unread' ? 'All caught up!' : 'No notifications'}
                </div>
                <div style={{ fontSize: '11px', maxWidth: '220px' }}>
                  {filter === 'unread'
                    ? 'You have completed all active items.'
                    : 'System notifications, reminders, and deadline alerts will appear here.'}
                </div>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: n.isRead ? 'transparent' : 'var(--input-bg)',
                    border: `1px solid ${n.isRead ? 'var(--card-border)' : 'var(--input-border)'}`,
                    position: 'relative',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {/* TYPE ICON BADGE */}
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: getTypeBg(n.type),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    {getTypeIcon(n.type)}
                  </div>

                  {/* BODY */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.3 }}>
                        {n.title}
                      </span>
                      {n.priority === 'high' && (
                        <span
                          style={{
                            background: 'rgba(239,68,68,0.15)',
                            color: '#EF4444',
                            fontSize: '9px',
                            fontWeight: 700,
                            padding: '1px 5px',
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                          }}
                        >
                          High
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4, wordBreak: 'break-word' }}>
                      {n.message}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        {formatRelativeTime(n.createdAt)}
                      </span>

                      {n.actionUrl && (
                        <button
                          onClick={() => handleActionClick(n)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#6366F1',
                            fontSize: '11px',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            padding: '0',
                          }}
                        >
                          View <ArrowRight size={11} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ACTIONS: MARK READ & DELETE */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginLeft: '4px' }}>
                    {!n.isRead && (
                      <button
                        onClick={() => markAsRead(n.id)}
                        title="Mark as read"
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--text-muted)',
                          padding: '2px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Check size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(n.id)}
                      title="Dismiss"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
