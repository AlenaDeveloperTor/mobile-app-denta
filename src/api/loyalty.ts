import { api } from './client';

/** Операция по бонусной программе */
export interface LoyaltyTransaction {
  id: string;
  amount: number;
  reason: string;
  created_at: string;
}

/** Баланс бонусов */
export interface LoyaltyBalance {
  balance: number;
  points_history: LoyaltyTransaction[];
}

export const loyaltyAPI = {
  /** Текущий баланс бонусов */
  getBalance: () => api.get<LoyaltyBalance>('/loyalty/balance'),

  /** История начисления/списания */
  getHistory: () => api.get<LoyaltyTransaction[]>('/loyalty/history'),
};
