import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { Broker } from "@/types/broker";

interface BrokerState {
  brokers: Broker[];
  selected: Broker | null;
  isLoading: boolean;
  fetchBrokers: () => Promise<void>;
  update: (broker_id: string) => void;
}

const useBrokerStore = create<BrokerState>((set, get) => ({
  brokers: [],
  selected: null,
  isLoading: false,

  fetchBrokers: async () => {
    if (get().brokers.length > 0) return; // Prevent multiple fetches

    set({ isLoading: true });

    try {
      const { data, error } = await supabase.from("brokers").select("*");
      if (error) throw error;

      set({ brokers: data as Broker[] || [] });
    } catch (error) {
      console.error("Error fetching brokers:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  update: (broker_id) => {
    const broker = get().brokers.find((b) => b.id === broker_id) || null;
    set({ selected: broker });
  },
}));

export default useBrokerStore;
