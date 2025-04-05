import { TradeExport } from "@/features/history/components/TradeExport";
import { useTrades } from "@/hooks/use-trades";
import { useEffect, useState } from "react";


export const TradeHistoryHeader = () => {
  const [mappedTrades, setMappedTrades] = useState(null);
  const { trades } = useTrades();

  useEffect(() => {
    // Perform any side effects or data fetching here
    // For example, you might want to fetch trades or update the state
    var result = trades.map((trade) => {
      return {
        id: trade.id,
        date: trade.entry_date,
        asset: trade.symbol,
        type: trade.position_type,
        entry: trade.fill_price,
        exit: trade.stop_price,
        pnl: trade.pnl,
        topEmotion: trade.tags[0] || "None",
        fees: trade.fees,
        emotional_tags: trade.tags || null,
      }
    });

    setMappedTrades(result);
  }, [trades]);
  return (
    <TradeExport trades={mappedTrades} />
  );
};