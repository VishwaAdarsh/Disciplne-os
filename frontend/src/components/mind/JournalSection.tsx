/**
 * JournalSection Component (SPR-309)
 */

import React, { useState } from 'react';
import { BookOpen, Plus, Search, Lock, Trash2 } from 'lucide-react';
import { useMindStore } from '../../store/mindStore';

interface JournalSectionProps {
  onOpenCreate: () => void;
}

export const JournalSection: React.FC<JournalSectionProps> = ({ onOpenCreate }) => {
  const { journal, deleteJournalEntry } = useMindStore();
  const [search, setSearch] = useState('');

  const filteredEntries = journal.entries.filter((entry) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      entry.title.toLowerCase().includes(q) ||
      entry.reflection.toLowerCase().includes(q)
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={20} color="#6366F1" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>Private Journal & Reflections</h3>
            <span
              style={{
                fontSize: '10px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10B981',
                padding: '2px 8px',
                borderRadius: '10px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <Lock size={10} />
              <span>PRIVATE</span>
            </span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {journal.entries.length} Entries logged · Private self-reflections
          </div>
        </div>

        <button
          onClick={onOpenCreate}
          style={{
            padding: '9px 16px',
            borderRadius: '10px',
            background: 'linear-gradient(90deg, #6366F1, #8B5CF6)',
            border: 'none',
            color: '#FFF',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Plus size={16} />
          <span>New Journal Entry</span>
        </button>
      </div>

      {/* SEARCH BAR */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--input-bg)',
          border: '1px solid var(--input-border)',
          borderRadius: '10px',
          padding: '8px 12px',
        }}
      >
        <Search size={16} color="var(--text-muted)" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search private journal entries..."
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-main)',
            fontSize: '13px',
            width: '100%',
          }}
        />
      </div>

      {/* ENTRIES LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredEntries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '13px' }}>
            No journal entries found matching your search.
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div
              key={entry.id}
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                borderRadius: '12px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>{entry.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{entry.dateStr}</span>
                  <button
                    onClick={() => deleteJournalEntry(entry.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>"{entry.reflection}"</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
