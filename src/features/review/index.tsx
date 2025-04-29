import { useTrades } from "@/hooks/use-trades";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useEventStore } from "@/store/event";
import { SummaryCards } from "./components/SummaryCards";
import { TradeTable } from "./components/TradeTable";
import { Columns } from "./components/Columns";
import { TradeList } from "./components/TradeList";
import { Button } from "@/components/ui/button";
import { useAnalysis } from "./hooks/use-analysis";

export const Review = () => {
  const [mappedTrades, setMappedTrades] = useState([]);
  const { trades, setTrades, fetchTrades, saveTrades, error } = useTrades(true);
  const { hasUnanalyzedTrades, runTradeAnalysis, checkForUnanalyzedTrades } = useAnalysis();
  const { event, setLoading, setEvent } = useEventStore();
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
        variant: "default",
      });
      
      setLoading(false);
    } catch (err) {
      console.error("Error saving trades:", err);

      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });

      setLoading(false);
    }
  };

  useEffect(() => {
    if (event !== "review_trade_save") return;

    handleSave();
    setLoading(false);
    setEvent("");
  }, [event]);

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
                No trades needed to review. Click
                <Button variant="link" onClick={runTradeAnalysis}
                  className="px-1 py-1 text-primary hover:text-emerald-700">
                  here to start the analysis
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