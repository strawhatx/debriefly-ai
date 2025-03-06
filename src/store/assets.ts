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

interface Currency {
    code: string;
}

interface AssetState {
    currency_codes: Currency[];
    futures_multipliers: Multiplier[];

    get_currency_codes: () => void,
    get_futures_multipliers: () => void,
}

const useAssetStore = create<AssetState>()(
    persist((set) => ({
        currency_codes: [],
        futures_multipliers: [],

        get_currency_codes: async () => {
            try {
                const { data, error } = await supabase.from('currency_codes').select('code');

                if (error) throw error;

                set({ currency_codes: data });
            }
            catch (error) {
                console.error('Error loading currency codes:', error);
                set({
                    currency_codes: [
                        { code: 'USD' }, { code: 'EUR' }, { code: 'GBP' }, { code: 'JPY' },
                        { code: 'AUD' }, { code: 'CAD' }, { code: 'CHF' }, { code: 'NZD' }
                    ]
                });
            }
        },

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