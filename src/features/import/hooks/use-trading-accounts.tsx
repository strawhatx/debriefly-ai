import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface TradingAccount {
    id: string;
    account_name: string;
    broker_id: string;
}

export const useTradingAccounts = (brokerId: string) => {
    const [tradingAccounts, setTradingAccounts] = useState<TradingAccount[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const fetchTradingAccounts = async () => {
        if (!brokerId) return;
        setIsLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from("trading_accounts")
                .select("id, account_name, broker_id")
                .eq("broker_id", brokerId)
                .eq("user_id", user.id);

            if (error) throw error;

            setTradingAccounts(data || []);
        } catch (error) {
            console.error("Error fetching trading accounts:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {

        fetchTradingAccounts();
    }, []);

    return { tradingAccounts, refresh: fetchTradingAccounts, isLoading };
};
