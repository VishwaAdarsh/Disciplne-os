/**
 * Custom Mind Hook (SPR-309)
 */

import { useState } from 'react';
import { useMindStore } from '../../store/mindStore';

export function useMind() {
  const store = useMindStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Overview');

  const filteredJournals = store.journal.entries.filter((entry) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      entry.title.toLowerCase().includes(query) ||
      entry.reflection.toLowerCase().includes(query) ||
      (entry.tags && entry.tags.some((t) => t.toLowerCase().includes(query)))
    );
  });

  return {
    ...store,
    searchQuery,
    setSearchQuery,
    filteredJournals,
    activeTab,
    setActiveTab,
  };
}
