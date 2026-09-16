/**
 * Real-Time Status Store (SPR-316 / ARCH-003)
 */

import { create } from 'zustand';
import type { ConnectionStatus } from '../types/realtime';

interface RealtimeState {
  status: ConnectionStatus;
  lastEventAt: string | null;
  lastEventTitle: string | null;

  setStatus: (status: ConnectionStatus) => void;
  recordEvent: (title?: string) => void;
}

export const useRealtimeStore = create<RealtimeState>((set) => ({
  status: 'disconnected',
  lastEventAt: null,
  lastEventTitle: null,

  setStatus: (status) => set({ status }),
  recordEvent: (title) =>
    set({
      lastEventAt: new Date().toISOString(),
      lastEventTitle: title || null,
    }),
}));
