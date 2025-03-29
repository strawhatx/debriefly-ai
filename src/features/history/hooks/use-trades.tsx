import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import useTradingAccountStore from "@/store/trading-account";

interface EmotionalTags {
  tags: string[];
}

export interface Trade {
  id: string;
  date: string;
  asset: string;
  type: 'LONG' | 'SHORT';
  entry: number;
  exit: number;
  pnl: number;
  topEmotion: string;
  fees: number;
  emotional_tags: string[] | null;
}

interface SupabaseTrade {
  id: string;
  trading_account_id: string;
  symbol: string;
  asset_type: string;
  position_type: 'LONG' | 'SHORT';
  fill_price: number;
  stop_price: number;
  entry_date: string;
  fees: number;
  quantity: number;
  closing_date: string;
  pnl: number;
  emotional_tags: EmotionalTags | null;
}

export const useTrades = () => {
  const selectedAccount = useTradingAccountStore((state) => state.selected);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        let query = supabase
          .from("positions")
          .select(`
            id, 
            trading_account_id, 
            symbol, 
            asset_type, 
            position_type, 
            fill_price, 
            stop_price, 
            entry_date, 
            fees, 
            quantity, 
            closing_date, 
            pnl, 
            tags
          `)
          .eq("user_id", user.id)
          .order("entry_date", { ascending: false });

        if (selectedAccount) {
          query = query.eq("trading_account_id", selectedAccount);
        }

        const { data, error } = await query;
        if (error) throw error;

        const formattedTrades: Trade[] = (data as SupabaseTrade[]).map(trade => ({
          id: trade.id,
          date: new Date(trade.entry_date).toLocaleDateString(),
          asset: trade.symbol,
          type: trade.position_type,
          entry: trade.fill_price,
          exit: trade.stop_price,
          pnl: trade.pnl,
          fees: trade.fees || 0,
          topEmotion: trade.emotional_tags?.tags[0] || 'N/A',
          emotional_tags: trade.emotional_tags?.tags || null
        }));

        setTrades(formattedTrades);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch trades'));
        console.error('Error fetching trades:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrades();
  }, [selectedAccount]);

  return { trades, isLoading, error };
};
