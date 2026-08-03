import { useState } from 'react';
import { BookOpen, Search, Trash2, Tag, Calendar } from 'lucide-react';
import { useMindStore } from '../../store/mindStore';

interface Props {
  onOpenCreate: () => void;
}

export default function JournalEntriesList({ onOpenCreate }: Props) {
  const { journal, deleteJournalEntry } = useMindStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = journal.entries.filter((entry) => {
    const q = searchQuery.toLowerCase();
    return (
      entry.title.toLowerCase().includes(q) ||
      entry.reflection.toLowerCase().includes(q) ||
      (entry.wentWell && entry.wentWell.toLowerCase().includes(q)) ||
      (entry.moodTag && entry.moodTag.toLowerCase().includes(q))
    );
  });

  return (
    <div
      style={{
        background: 'var(--card-bg, #111827)',
        border: '1px solid var(--card-border, #1F2937)',
        borderRadius: 'var(--card-radius, 16px)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={20} color="#6366F1" />
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Journal & Daily Reflections</h3>
        </div>
        <button
          onClick={onOpenCreate}
          style={{
            padding: '8px 14px',
            borderRadius: '10px',
            background: 'linear-gradient(90deg, #6366F1, #8B5CF6)',
            border: 'none',
            color: '#FFF',
            fontWeight: 700,
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          + Write Entry
        </button>
      </div>

      {/* SEARCH BAR */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--surface-bg, rgba(255,255,255,0.03))',
          border: '1px solid var(--card-border, #1F2937)',
          borderRadius: '12px',
          padding: '8px 14px',
        }}
      >
        <Search size={16} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="Search journal entries or reflections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-main, #FFF)',
            fontSize: '13px',
            width: '100%',
          }}
        />
      </div>

      {/* ENTRIES LIST */}
      {filteredEntries.length === 0 ? (
        <div
          style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '13px',
          }}
        >
          <BookOpen size={36} style={{ marginBottom: '12px', opacity: 0.5 }} />
          <p style={{ margin: '0 0 8px 0', color: 'var(--text-main)', fontWeight: 700 }}>No journal entries found</p>
          <span>Write your first reflection to begin understanding your mental patterns.</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              style={{
                background: 'var(--surface-bg, rgba(255,255,255,0.02))',
                border: '1px solid var(--card-border, #1F2937)',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '18px' }}>{entry.emoji || '📝'}</span>
                    <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>{entry.title}</span>
                    {entry.moodTag && (
                      <span
                        style={{
                          fontSize: '10px',
                          background: 'rgba(99, 102, 241, 0.15)',
                          color: '#6366F1',
                          padding: '2px 8px',
                          borderRadius: '8px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Tag size={10} />
                        {entry.moodTag}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <Calendar size={12} />
                    <span>{entry.dateStr}</span>
                  </div>
                </div>

                <button
                  onClick={() => deleteJournalEntry(entry.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                  title="Delete entry"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {entry.reflection && (
                <div style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.5' }}>
                  {entry.reflection}
                </div>
              )}

              {(entry.wentWell || entry.challenged || entry.improveTomorrow) && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '8px',
                    marginTop: '4px',
                    paddingTop: '8px',
                    borderTop: '1px dashed var(--card-border, #1F2937)',
                  }}
                >
                  {entry.wentWell && (
                    <div style={{ fontSize: '11px' }}>
                      <strong style={{ color: '#10B981', display: 'block' }}>Went Well:</strong>
                      <span style={{ color: 'var(--text-muted)' }}>{entry.wentWell}</span>
                    </div>
                  )}
                  {entry.challenged && (
                    <div style={{ fontSize: '11px' }}>
                      <strong style={{ color: '#F59E0B', display: 'block' }}>Challenged:</strong>
                      <span style={{ color: 'var(--text-muted)' }}>{entry.challenged}</span>
                    </div>
                  )}
                  {entry.improveTomorrow && (
                    <div style={{ fontSize: '11px' }}>
                      <strong style={{ color: '#8B5CF6', display: 'block' }}>Improve Tomorrow:</strong>
                      <span style={{ color: 'var(--text-muted)' }}>{entry.improveTomorrow}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
