// src/store/Trade.ts

import { create } from 'zustand';

interface Trade {
    id: string;
    symbol: string;
    quantity:number;
    fees:number;
    position_type: string;
    pnl: number;
    fill_price: number;
    stop_price: number;
    entry_date: string;
}

interface TradeState {
    selected: Trade | null;

    update: (selected: Trade) => void,
}

const useTradeStore = create<TradeState>((set) => ({
    selected: null,

    update: (selected) => set({ selected }),
}));

export default useTradeStore;