import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import useTradingAccountStore from "@/store/trading-account";
import { useDateStore } from "@/store/date";
import { format } from "date-fns";

interface Trade {
  id: string;
  symbol: string;
  pnl: number;
  strategy: string;
  risk: number;
  reward: number;
  isWin: boolean;
}

export const useTrades = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const selectedAccount = useTradingAccountStore((state) => state.selected);
  const days = useDateStore((state) => state.days);

  // Fetch trades from the database
  // Fetch trades from the database
  const fetchTrades = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const today = new Date();
      const end_date = new Date(today);
      end_date.setDate(today.getDate() - days);

      // Adjust the date range for the query
      const startDate = today.toISOString();
      const endDate = end_date.toISOString();

      let query = supabase
        .from("positions")
        .select(`
            id,
            symbol, 
            pnl,
            strategy, 
            risk, 
            reward
          `)
        .eq("user_id", user.id)
        //range filter for the date
        .gte("entry_date", endDate)
        .lte("entry_date", startDate);

      if (selectedAccount) {
        query = query.eq("trading_account_id", selectedAccount);
      }

      const { data, error } = await query;
      if (error) throw error;

      setTrades(data.map((trade) => ({
        ...trade,
        isWin: trade.pnl > 0,
      })));

    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch trades"));
      console.error("Error fetching trades:", err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchTrades();
  }, [selectedAccount, days]);

  return { trades, isLoading, error };
};