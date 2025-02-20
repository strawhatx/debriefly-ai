// src/store/assets.ts
import { supabase } from "@/integrations/supabase/client";
import { create } from 'zustand';
import { persist } from 'zustand/middleware'


interface AssetState {
    currency_codes: Set<string> | null;
    futures_multipliers: Map<string, number> | null

    get_currency_codes: () => void,
    get_futures_multipliers: () => void,
}

const useAssetStore = create<AssetState>()(
    persist((set) => ({
        currency_codes: null,
        futures_multipliers: null,

        get_currency_codes: async () => {
            try {
                const { data, error } = await supabase.from('currency_codes').select('code');

                if (error) throw error;

                set({ currency_codes: new Set(data.map((row: { code: string }) => row.code)) });
            }
            catch (error) {
                console.error('Error loading currency codes:', error);
                set({ currency_codes: new Set(['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD']) });
            }
        },
        get_futures_multipliers: async () => {
            try {
                const { data, error } = await supabase.from('futures_multipliers').select('symbol, multiplier');

                if (error) throw error;

                set({
                    futures_multipliers: new Map(
                        data.map((row: { symbol: string; multiplier: number }) => [row.symbol, row.multiplier])
                    )
                });
            }

            catch (error) {
                console.error('Error loading futures multipliers:', error);
            }
        },
    }), 
    { name: 'asset-store' }));

export default useAssetStore;