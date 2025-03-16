import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import useTradingAccountStore from "@/store/trading-account";

export const useTrades = () => {
  const selectedAccount = useTradingAccountStore((state) => state.selected);
  const [trades, setTrades] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTrades = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let query = supabase
        .from("positions")
        .select(`id, trading_account_id, symbol, asset_type, position_type, fill_price, stop_price, entry_date, fees, 
          quantity, closing_date, pnl, emotional_tags ( tags )`)
        .eq("user_id", user.id)
        .order("entry_date", { ascending: false });

      if (selectedAccount) {
        query = query.eq("trading_account_id", selectedAccount);
      }

      const { data, error } = await query;
      if (error) throw error;

      setTrades(data.map(trade => ({
        id: trade.id,
        symbol: trade.symbol,
        entry_date: trade.entry_date,
        closing_date: trade.closing_date,
        fill_price: trade.fill_price,
        stop_price: trade.stop_price,
        quantity: trade.quantity,
        side: trade.position_type,
        pnl: trade.pnl,
        fees: trade.fees || 0,
        emotional_tags: trade.emotional_tags ? JSON.parse(trade.emotional_tags.tags) : null
      })));
    };

    fetchTrades();
  }, [selectedAccount]);

  const filteredTrades = searchQuery.trim() === "" 
    ? trades 
    : trades.filter(trade => trade.symbol.toLowerCase().includes(searchQuery.toLowerCase()));

  return { trades: filteredTrades, searchQuery, setSearchQuery };
};
