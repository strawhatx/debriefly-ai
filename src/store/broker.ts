// src/store/broker.ts
import { Broker } from '@/components/import/types';
import { create } from 'zustand';

interface BrokerState {
    selectedBroker: Broker | null;

    updateSelectedBroker:(selected: Broker) => void,
}

const useBrokerStore = create<BrokerState>((set) => ({
    selectedBroker: null,

    updateSelectedBroker: async (selected: Broker) => {
        set({ selectedBroker: selected });
    },
}));

export default useBrokerStore;