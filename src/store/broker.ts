// src/store/broker.ts
import { Broker } from '../types/broker';
import { create } from 'zustand';

interface BrokerState {
    selected: Broker | null;

    update: (selected: Broker) => void,
}

const useBrokerStore = create<BrokerState>((set) => ({
    selected: null,

    update: (selected) => set({ selected }),
}));

export default useBrokerStore;