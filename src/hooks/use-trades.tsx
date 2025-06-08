
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
  state?: "DRAFT" | "OPEN" | "CLOSED" | "CANCELLED";
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
  saveTrades: (updatedTrades: TradeUpdate[]) => Promise<void>;
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
        closing_date, leverage, fees, quantity, pnl, strategy, risk, reward, tags, score, state
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
      
      // Transform data to match our Trade interface
      const transformedTrades: Trade[] = (data || []).map(trade => ({
        ...trade,
        position_type: trade.position_type as "LONG" | "SHORT",
        state: trade.state as "DRAFT" | "OPEN" | "CLOSED" | "CANCELLED" | undefined,
        tags: Array.isArray(trade.tags) ? trade.tags as string[] : trade.tags ? [trade.tags as string] : null
      }));
      
      setTrades(transformedTrades);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch trades";
      setError(new Error(errorMessage));
      console.error("Error fetching trades:", err);
    } finally {
      setIsLoading(false);
    }
  }, [buildTradesQuery]);

  // Save trades to the database
  const saveTrades = useCallback(async (updatedTrades: TradeUpdate[]) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Validate trades before saving
      const validatedTrades = updatedTrades.filter(validateTrade);

      if (validatedTrades.length === 0) {
        throw new Error("No valid trades to save after validation");
      }

      // Batch updates for better performance
      const updates = validatedTrades.map((trade) => ({
        id: trade.id,
        strategy: trade.strategy,
        reward: trade.reward,
        tags: trade.tags,
        state: "CLOSED" as const, // Use CLOSED instead of PUBLISHED
        trading_account_id: trade.trading_account_id,
        user_id: trade.user_id
      }));

      // Update each trade individually
      for (const update of updates) {
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
      }

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
    saveTrades
  }), [trades, isLoading, error, fetchTrades, saveTrades]);

  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  return result;
};
