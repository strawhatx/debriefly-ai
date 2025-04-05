import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import useTradingAccountStore from "@/store/trading-account";

interface Trade {
  id: string;
  symbol: string;
  position_type: "LONG" | "SHORT";
  fill_price: number;
  stop_price: number;
  entry_date: string; // ISO date string
  closing_date: string | null; // ISO date string or null, 
  asset_type: string;
  fees: number;
  quantity: number;
  strategy: string | null;
  risk: number;
  reward: number;
  pnl: number;
  tags: string[] | null;
  score: number;
  leverage: number | null;
}

export const useTrades = (isReview: boolean = false) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const selectedAccount = useTradingAccountStore((state) => state.selected);

  // Fetch trades from the database
  // Fetch trades from the database
  const fetchTrades = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let query = supabase
        .from("positions")
        .select(`
            id, symbol, asset_type,  position_type, fill_price, stop_price, entry_date, 
            closing_date, leverage, fees, quantity, pnl, strategy, risk, reward, tags, score
          `)
        .eq("user_id", user.id)
        .order("entry_date", { ascending: false });

      if (isReview) {
        query = query.eq("state", "DRAFT");
      }
      if (selectedAccount) {
        query = query.eq("trading_account_id", selectedAccount);
      }

      const { data, error } = await query;
      if (error) throw error;

      setTrades(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch trades"));
      console.error("Error fetching trades:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Save trades to the database
  const saveTrades = async (updatedTrades: any[]) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const updates = updatedTrades.map((trade) => ({
        id: trade.id,
        strategy: trade.strategy,
        reward: trade.reward,
        tags: trade.tags,
        state: "PUBLISHED",
      }));

      const { error } = await supabase.from("positions").upsert(updates, { onConflict: "id" });

      if (error) throw error;

      // Update local state after saving
      setTrades((prevTrades) =>
        prevTrades.map((trade) =>
          updatedTrades.find((updated) => updated.id === trade.id) || trade
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to save trades"));
      console.error("Error saving trades:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, [selectedAccount, isReview]);

  return { trades, setTrades, isLoading, error, fetchTrades, saveTrades };
};