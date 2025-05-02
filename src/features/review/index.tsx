import { useTrades } from "@/hooks/use-trades";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useEventBus } from "@/store/event";
import { SummaryCards } from "./components/SummaryCards";
import { TradeTable } from "./components/TradeTable";
import { Columns } from "./components/Columns";
import { TradeList } from "./components/TradeList";
import { Button } from "@/components/ui/button";
import { useAnalysis } from "./hooks/use-analysis";

export const Review = () => {
  const [mappedTrades, setMappedTrades] = useState([]);
  const { trades, setTrades, fetchTrades, saveTrades, error } = useTrades(true);
  const { hasUnanalyzedTrades, isLoading, runTradeAnalysis, checkForUnanalyzedTrades } = useAnalysis();
  const { publish, subscribe } = useEventBus();
  const { toast } = useToast();

  const handleUpdate = (id, key, value) => {
    setTrades((prevTrades) =>
      prevTrades.map((trade) =>
        trade.id === id ? { ...trade, [key]: value } : trade
      )
    );
  };

  const handleSave = async () => {
    try {
      await saveTrades(mappedTrades);

      toast({
        title: "Success",
        description: "Changes saved successfully!",
        variant: "success",
      });

      publish("review_trades_refresh", { tradeCount: trades.length, refresh: fetchTrades }); // send the refresh event
    } catch (err) {
      console.error("Error saving trades:", err);

      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Subscribe to the event when the component mounts
    const unsubscribe = subscribe('review_trade_save', (data: { setSaving: (value: boolean) => void }) => {
      handleSave();
      data.setSaving(false);
    });

    // Cleanup function: Unsubscribe when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [subscribe]);

  useEffect(() => {
    const result = trades.map((trade) => ({
      id: trade.id,
      user_id: trade.user_id,
      date: trade.entry_date,
      asset: trade.symbol,
      type: trade.position_type,
      market: trade.asset_type,
      entry: trade.fill_price,
      exit: trade.stop_price,
      pnl: trade.pnl,
      strategy: trade.strategy,
      reward: trade.reward,
      tags: trade.tags || null,
    }));

    setMappedTrades(result);
  }, [trades]);

  useEffect(() => {
    if (trades && trades.length > 0) return;

    checkForUnanalyzedTrades();
  }, [trades]);

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
      {/* Trade Statistics */}
      {(!mappedTrades || mappedTrades.length === 0) ? (
        <section className="text-gray-400 text-center p-4 bg-gray-800 rounded-xl border border-gray-700">
          {hasUnanalyzedTrades ? (
            <div className="space-y-4">
              <p>
                {isLoading ? "" : "No trades needed to review."}

                <Button variant="link" onClick={runTradeAnalysis} disabled={isLoading}
                  className="px-1 py-1 text-gray-400 font-normal text-md hover:text-emerald-400">
                  {isLoading ? " Running Analysis..." : " Click here to start the analysis"}
                </Button>
              </p>
            </div>
          ) : (
            <p>No trades needed to review.</p>
          )}
        </section>
      ) : (
        <>
          <SummaryCards trades={mappedTrades} />

          {/* Desktop-only Component */}
          <div className="hidden lg:block">
            <TradeTable columns={Columns(handleUpdate)} data={mappedTrades} />
          </div>

          {/* Mobile-only Component */}
          <div className="block lg:hidden">
            <TradeList data={mappedTrades} refresh={fetchTrades} />
          </div>
        </>
      )}
    </div>
  );
};