import { loyaltyAPI, type LoyaltyTransaction } from '@/api/loyalty';
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
      const res = await loyaltyAPI.getBalance();
      set({
        balance: res.data.balance,
        history: res.data.points_history,
        loading: false,
      });
    } catch {
      set({ loading: false, error: 'Не удалось загрузить бонусы' });
    }
  },
  setBalance: (balance) => set({ balance }),
  clear: () => set({ balance: 0, history: [], loading: false, error: null }),
}));
