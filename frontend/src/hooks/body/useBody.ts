/**
 * Custom Body Hook (SPR-308)
 */

import { useState } from 'react';
import { useBodyStore } from '../../store/bodyStore';

export function useBody() {
  const store = useBodyStore();

  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [activeTab, setActiveTab] = useState<string>('Overview');

  // Quick hydration handler
  const handleQuickAddWater = (amountMl: number) => {
    store.addWater(amountMl);
  };

  const toggleUnitSystem = () => {
    setUnitSystem((prev) => (prev === 'metric' ? 'imperial' : 'metric'));
  };

  return {
    ...store,
    unitSystem,
    activeTab,
    setActiveTab,
    toggleUnitSystem,
    handleQuickAddWater,
  };
}
