import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import useTradingAccountStore from "@/store/trading-account";
import React from "react";
import { TradingAccount } from "@/types/trading";

export const SelectAccount = () => {
    const account = useTradingAccountStore((state) => state.selected);
    const setAccount = useTradingAccountStore((state) => state.update);

    const { data: tradingAccounts, error, isLoading } = useQuery<TradingAccount[]>({
        queryKey: ["tradingAccounts"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("trading_accounts")
                .select("id, account_name, broker_id, market, account_balance, created_at");
            if (error) {
                console.error("Error fetching trading accounts:", error);
                return [];
            }
            return data || [];
        },
    });

    const accountOptions = React.useMemo(() => {
        if (!tradingAccounts) return [];
        return tradingAccounts.map((acct) => ({
            id: acct.id,
            name: acct.account_name,
        }));
    }, [tradingAccounts]);

    if (error) {
        return <div className="text-red-500">Failed to load accounts. Please try again later.</div>;
    }

    return (
        <div className="relative w-full">
            <select
                className="w-full rounded-md py-1 pr-2 pl-3 text-left text-white bg-gray-900 sm:text-sm"
                value={account || ""}
                onChange={(e) => setAccount(e.target.value)}
                disabled={isLoading}
            >
                <option value="" disabled>
                    {isLoading ? "Loading..." : "Select Account"}
                </option>
                <option value="all">All</option>
                {accountOptions.map((acct) => (
                    <option key={acct.id} value={acct.id}>
                        {acct.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

