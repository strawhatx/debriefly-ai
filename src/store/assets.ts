// src/store/assets.ts
import { supabase } from "@/integrations/supabase/client";
import { create } from 'zustand';
import { persist } from 'zustand/middleware'

interface Multiplier {
    symbol: string;
    tick_size: number;
    tick_value: number; 
    point_value: number;
}

interface AssetState {
    futures_multipliers: Multiplier[];
    get_futures_multipliers: () => void,
}

const useAssetStore = create<AssetState>()(
    persist((set) => ({
        futures_multipliers: [],

        get_futures_multipliers: async () => {
            try {
                const { data, error } = await supabase.from('futures_multipliers')
                    .select('symbol, tick_size, tick_value, point_value');

                if (error) throw error;

                set({ futures_multipliers: data });
            }

            catch (error) {
                console.error('Error loading futures multipliers:', error);
            }
        },
    }),
        { name: 'asset-store' }));

export default useAssetStore;