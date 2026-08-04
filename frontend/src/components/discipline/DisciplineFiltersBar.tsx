/**
 * DisciplineFiltersBar Component (SPR-307)
 */

import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

interface DisciplineFiltersBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedPriority: string;
  onPriorityChange: (p: string) => void;
  selectedStatus: string;
  onStatusChange: (s: string) => void;
  sortBy: 'priority' | 'time' | 'category';
  onSortChange: (sort: 'priority' | 'time' | 'category') => void;
}

export const DisciplineFiltersBar: React.FC<DisciplineFiltersBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedPriority,
  onPriorityChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
}) => {
  const categories = ['all', 'Study', 'Work', 'Fitness', 'Health', 'Personal', 'Finance', 'Custom'];
  const priorities = ['all', 'low', 'medium', 'high', 'critical'];
  const statuses = ['all', 'pending', 'completed', 'overdue', 'archived'];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '14px',
        padding: '14px 16px',
      }}
    >
      {/* Search Input Bar */}
      <div style={{ position: 'relative', width: '100%' }}>
        <Search
          size={16}
          color="var(--text-muted)"
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks by title, category, description..."
          style={{
            width: '100%',
            padding: '9px 12px 9px 36px',
            background: 'var(--input-bg)',
            border: '1px solid var(--input-border)',
            borderRadius: '10px',
            color: 'var(--text-main)',
            fontSize: '13px',
            outline: 'none',
          }}
        />
      </div>

      {/* Filter Controls Group */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        {/* Category Scrollable Pills */}
        <div
          className="no-scrollbar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            overflowX: 'auto',
            maxWidth: '100%',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              style={{
                background: selectedCategory === cat ? '#6366F1' : 'var(--input-bg)',
                color: selectedCategory === cat ? '#FFFFFF' : 'var(--text-muted)',
                border: '1px solid var(--input-border)',
                borderRadius: '8px',
                padding: '5px 10px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                textTransform: cat === 'all' ? 'capitalize' : 'none',
              }}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        {/* Priority, Status & Sort Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <Filter size={13} />
            <span>Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => onPriorityChange(e.target.value)}
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                color: 'var(--text-main)',
                borderRadius: '6px',
                padding: '4px 6px',
                fontSize: '12px',
              }}
            >
              {priorities.map((p) => (
                <option key={p} value={p}>
                  {p.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span>Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                color: 'var(--text-main)',
                borderRadius: '6px',
                padding: '4px 6px',
                fontSize: '12px',
              }}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <ArrowUpDown size={13} />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                color: 'var(--text-main)',
                borderRadius: '6px',
                padding: '4px 6px',
                fontSize: '12px',
              }}
            >
              <option value="time">Sort by Time</option>
              <option value="priority">Sort by Priority</option>
              <option value="category">Sort by Category</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
