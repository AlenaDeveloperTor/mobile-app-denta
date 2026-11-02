import { authAPI } from '@/api/auth';
import type { LoyaltyTransaction } from '@/api/loyalty';
import { create } from 'zustand';

interface LoyaltyState {
  balance: number;
  history: LoyaltyTransaction[];
  loading: boolean;
  error: string | null;
  fetchBalance: () => Promise<void>;
  setBalance: (balance: number) => void;
  clear: () => void;
}

export const useLoyaltyStore = create<LoyaltyState>((set) => ({
  balance: 0,
  history: [],
  loading: false,
  error: null,
  fetchBalance: async () => {
    set({ loading: true, error: null });
    try {
      const res = await authAPI.getProfile();
      if (res.data.loyalty_balance !== undefined) {
        set({
          balance: res.data.loyalty_balance,
          loading: false,
        });
      } else {
        set({ loading: false });
      }
    } catch {
      set({ loading: false });
    }
  },
  setBalance: (balance) => set({ balance }),
  clear: () => set({ balance: 0, history: [], loading: false, error: null }),
}));