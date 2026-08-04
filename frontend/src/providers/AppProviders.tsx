/**
 * Clean Top-Level Application Providers Wrapper (SPR-301)
 */

import React, { ReactNode } from 'react';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <React.StrictMode>
      {/* Container for future top-level Query, Theme, & Context providers */}
      {children}
    </React.StrictMode>
  );
};

export default AppProviders;
