// src/store/trading-account.ts
import { create } from 'zustand';

export interface TradingAccount {
    id: string;
    account_name: string;
  }

interface TradingAccountState {
    selected: TradingAccount | null;
    update: (selected: TradingAccount) => void;
}

const useTradingAccountStore = create<TradingAccountState>((set) => ({
    selected: null,
    update: (selected) => set({ selected }),
}));

export default useTradingAccountStore;