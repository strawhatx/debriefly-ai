import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import useTradingAccountStore from "@/store/trading-account";

interface Trade {
  id: string;
  asset: string;
  type: "LONG" | "SHORT";
  entry: number;
  exit: number;
  date: string;
  quantity: number;
  strategy: string | null;
  risk: number;
  reward: number;
  pnl: number;
  tags: string[] | null;
}

export const useTrades = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const selectedAccount = useTradingAccountStore((state) => state.selected);

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
          id, symbol, position_type, fill_price, stop_price, entry_date, 
          quantity, pnl, strategy, risk, reward, tags
        `)
        .eq("user_id", user.id)
        .eq("state", "DRAFT")
        .order("entry_date", { ascending: false });

      if (selectedAccount) {
        query = query.eq("trading_account_id", selectedAccount);
      }

      const { data, error } = await query;
      if (error) throw error;

      const formattedTrades: Trade[] = data.map((trade) => ({
        id: trade.id,
        date: new Date(trade.entry_date).toLocaleDateString(),
        asset: trade.symbol,
        type: trade.position_type,
        entry: trade.fill_price,
        exit: trade.stop_price,
        quantity: trade.quantity,
        pnl: trade.pnl,
        strategy: trade.strategy || null,
        risk: trade.risk || 0,
        reward: trade.reward || 0,
        tags: trade.tags || null,
      }));

      setTrades(formattedTrades);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch trades"));
      console.error("Error fetching trades:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Save trades to the database
  const saveTrades = async (updatedTrades: Trade[]) => {
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
  }, [selectedAccount]);

  return { trades, setTrades, isLoading, error, fetchTrades, saveTrades };
};
