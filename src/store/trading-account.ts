// src/store/trading-account.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TradingAccountState {
    selected: string | null;
    update: (value: string) => void;
}

const useTradingAccountStore = create<TradingAccountState>()(persist((set) => ({
    selected: null,
    update: (value) => set({ selected: value }),
}), { name: 'trading-account-store' }));


export default useTradingAccountStore;