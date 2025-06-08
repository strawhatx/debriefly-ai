
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import useTradingAccountStore from "@/store/trading-account";
import { useDateStore } from "@/store/date";
import { format } from "date-fns";

interface Trade {
  id: string;
  date: string;
  market: string;
  symbol: string;
  type: 'LONG' | 'SHORT';
  asset_type: string;
  position_type: string;
  entry: number;
  exit: number;
  fill_price: number;
  stop_price: number;
  pnl: number;
  entry_date: string; // Changed to string for consistency
  closing_date: string; // Changed to string for consistency
  strategy: string;
  risk: number;
  reward: number;
  tags: string[] | null;
}

export const useTrades = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const selectedAccount = useTradingAccountStore((state) => state.selected);
  const days = useDateStore((state) => state.days);

  const fetchTrades = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const today = new Date();
      const end_date = new Date(today);
      end_date.setDate(today.getDate() - days);

      const startDate = today.toISOString();
      const endDate = end_date.toISOString();

      let query = supabase
        .from("positions")
        .select(`
            id,
            symbol, 
            asset_type, 
            position_type, 
            fill_price, 
            stop_price, 
            pnl, 
            entry_date, 
            closing_date, 
            strategy, 
            risk, 
            reward, 
            tags, 
            score
          `)
        .eq("user_id", user.id)
        .gte("entry_date", endDate)
        .lte("entry_date", startDate);

      if (selectedAccount) {
        query = query.eq("trading_account_id", selectedAccount);
      }

      const { data, error } = await query;
      if (error) throw error;

      setTrades(data.map((trade) => ({
        ...trade,
        date: format(new Date(trade.entry_date), 'MMM d, yyyy'),
        market: trade.asset_type,
        type: trade.position_type as 'LONG' | 'SHORT',
        entry: trade.fill_price,
        exit: trade.stop_price,
        entry_date: trade.entry_date,
        closing_date: trade.closing_date || '',
        tags: Array.isArray(trade.tags) ? trade.tags as string[] : trade.tags ? [trade.tags as string] : []
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
