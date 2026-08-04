/**
 * Custom Nutrition Hook (SPR-310)
 */

import { useState } from 'react';
import { useNutritionStore } from '../../store/nutritionStore';

export function useNutrition() {
  const store = useNutritionStore();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isEditingGoals, setIsEditingGoals] = useState(false);

  return {
    ...store,
    activeTab,
    setActiveTab,
    isEditingGoals,
    setIsEditingGoals,
  };
}
