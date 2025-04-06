import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import useTradingAccountStore from "@/store/trading-account";
import { useDateStore } from "@/store/date";

interface Trade {
  id: string;
  date: string;
  symbol: string;
  type: 'LONG' | 'SHORT';
  pnl: number;
  reward: number;
  tags: string[] | null;
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

      let query = supabase
        .from("positions")
        .select(`
            id, entry_date, symbol, position_type, tags, pnl, reward
          `)
        .eq("user_id", user.id)
        //range filter for the date
        .gte("entry_date", today.toISOString())
        .lte("entry_date", `${end_date.toLocaleDateString()} 23:59:59`);

      if (selectedAccount) {
        query = query.eq("trading_account_id", selectedAccount);
      }

      const { data, error } = await query;
      if (error) throw error;

      setTrades(data.map(({id, entry_date, symbol, position_type, pnl, reward, tags }) => ({
        id, date: entry_date, symbol, type: position_type, pnl, reward, tags
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