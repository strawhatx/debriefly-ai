import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import useTradingAccountStore from "@/store/trading-account";

// Define proper types for all entities
interface Trade {
  id: string;
  user_id: string;
  trading_account_id: string;
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
  state?: "DRAFT" | "PUBLISHED";
}

interface TradeUpdate {
  id: string;
  strategy: string | null;
  reward: number;
  tags: string[] | null;
  trading_account_id: string;
  user_id: string;
}

interface UseTradesResult {
  trades: Trade[];
  setTrades: React.Dispatch<React.SetStateAction<Trade[]>>;
  isLoading: boolean;
  error: Error | null;
  fetchTrades: () => Promise<void>;
  saveTrade: (updatedTrade: TradeUpdate) => Promise<void>;
}

// Validation functions
const validateTrade = (trade: TradeUpdate): boolean => {
  if (!trade.id) {
    console.warn("Trade missing ID, skipping:", trade);
    return false;
  }

  if (trade.strategy !== null && typeof trade.strategy !== 'string') {
    console.warn(`Invalid strategy for trade ${trade.id}: ${trade.strategy}`);
    return false;
  }

  if (typeof trade.reward !== 'number' || isNaN(trade.reward)) {
    console.warn(`Invalid reward for trade ${trade.id}: ${trade.reward}`);
    return false;
  }

  if (trade.tags !== null && (!Array.isArray(trade.tags) || !trade.tags.every(tag => typeof tag === 'string'))) {
    console.warn(`Invalid tags for trade ${trade.id}: ${trade.tags}`);
    return false;
  }

  return true;
};

export const useTrades = (isReview: boolean = false): UseTradesResult => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const selectedAccount = useTradingAccountStore((state) => state.selected);

  // Memoize the query builder to prevent unnecessary re-renders
  const buildTradesQuery = useCallback(() => {
    let query = supabase
      .from("positions")
      .select(`
        id, user_id, trading_account_id, symbol, asset_type, position_type, fill_price, stop_price, entry_date, 
        closing_date, leverage, fees, quantity, pnl, strategy, risk, reward, tags, score
      `)
      .order("entry_date", { ascending: false });

    if (isReview) {
      query = query.eq("state", "DRAFT");
    }

    if (selectedAccount) {
      query = query.eq("trading_account_id", selectedAccount);
    }

    return query;
  }, [isReview, selectedAccount]);

  // Fetch trades from the database
  const fetchTrades = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const query = buildTradesQuery();
      const { data, error } = await query.eq("user_id", user.id);

      if (error) throw error;
      setTrades(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch trades";
      setError(new Error(errorMessage));
      console.error("Error fetching trades:", err);
    } finally {
      setIsLoading(false);
    }
  }, [buildTradesQuery]);

  // Save trades to the database
  const saveTrade = useCallback(async (updatedTrade: TradeUpdate) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Validate trades before saving
      const validatedTrade = validateTrade(updatedTrade);

      if (!validatedTrade) {
        throw new Error("No valid trades to save after validation");
      }

      // Batch updates for better performance
      const update = {
        id: updatedTrade.id,
        strategy: updatedTrade.strategy,
        reward: updatedTrade.reward,
        tags: updatedTrade.tags,
        state: "PUBLISHED" as const,
        trading_account_id: updatedTrade.trading_account_id,
        user_id: updatedTrade.user_id
      };


      const { error } = await supabase
        .from("positions")
        .update({
          strategy: update.strategy,
          reward: update.reward,
          tags: update.tags,
          state: update.state,
          trading_account_id: update.trading_account_id,
          user_id: update.user_id
        })
        .eq('id', update.id);

      if (error) throw error;

      // Update local state after saving
      await fetchTrades();
    }
    catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update trades";
      setError(new Error(errorMessage));
      console.error("Error updating trades:", err);
    }
    finally {
      setIsLoading(false);
    }
  }, [fetchTrades]);

  // Memoize the result to prevent unnecessary re-renders
  const result = useMemo(() => ({
    trades,
    setTrades,
    isLoading,
    error,
    fetchTrades,
    saveTrade
  }), [trades, isLoading, error, fetchTrades, saveTrade]);

  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  return result;
};