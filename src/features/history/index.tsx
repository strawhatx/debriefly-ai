import { useEffect, useState } from "react";
import { TradeStatistics } from "./components/TradeStatistics";
import { useRawTrade } from "./hooks/use-raw-trade";
import { RawTradeModal } from "./components/RawTradeModal";
import { useTrades } from "@/hooks/use-trades";
import { NoDataModal } from "@/components/NoDataModal";
import { TradesTable } from "./components/TradesTable";
import { TradeList } from "./components/TradeList";

interface Trade {
  id: string;
  date: string;
  asset: string;
  market: string;
  type: 'LONG' | 'SHORT';
  entry: number;
  exit: number;
  pnl: number;
  topEmotion: string;
  fees: number;
  emotional_tags: string[] | null;
}

export const History = () => {
  const [showModal, setShowModal] = useState(false);
  const [mappedTrades, setMappedTrades] = useState<Trade[]>(null);
  const { trades, isLoading: tradesLoading, error } = useTrades();
  const [selectedTradeId, setSelectedTradeId] = useState<string | null>(null);
  const { data: rawTrade, isLoading: isLoadingRaw, error: rawError } = useRawTrade(selectedTradeId);

  const handleViewRawData = (tradeId: string) => setSelectedTradeId(tradeId);

  useEffect(() => {
    var result = trades.map((trade) => {
      return {
        id: trade.id,
        date: trade.entry_date,
        asset: trade.symbol,
        market: trade.asset_type,
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

  useEffect(() => {
    if (tradesLoading) return;

    if (!trades || trades.length === 0) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [trades, tradesLoading]);

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-500">Error: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <NoDataModal open={showModal} onClose={() => setShowModal(false)} />

      {/* Trade Statistics */}
      <TradeStatistics trades={trades} />

      {/* Desktop-only Component */}
      <div className="hidden lg:block">
        <TradesTable trades={mappedTrades} onViewRawData={handleViewRawData} />
      </div>

      {/* Mobile-only Component */}
      <div className="block lg:hidden">
        <TradeList data={mappedTrades} onViewRawData={handleViewRawData} />
      </div>

      {/* Raw Trade Modal */}
      <RawTradeModal
        isOpen={!!selectedTradeId}
        onClose={() => setSelectedTradeId(null)}
        data={rawTrade}
        isLoading={isLoadingRaw}
        error={rawError}
      />
    </div>
  );
};
