import { useTrades } from "@/hooks/use-trades";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useEventStore } from "@/store/event";
import { SummaryCards } from "./components/SummaryCards";
import { TradeTable } from "./components/TradeTable";
import { Columns } from "./components/Columns";
import { NoDataModal } from "@/components/NoDataModal";

export const Review = () => {
  const [showModal, setShowModal] = useState(false);
  const [mappedTrades, setMappedTrades] = useState([]);
  const { trades, setTrades, saveTrades, isLoading: tradesLoading, error } = useTrades(true);
  const { event, setLoading } = useEventStore();
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
    if (event !== "review_trade_save") return;

    handleSave();
    setLoading(false);
  }, [event]);

  useEffect(() => {
    const result = trades.map((trade) => ({
      id: trade.id,
      date: trade.entry_date,
      asset: trade.symbol,
      type: trade.position_type,
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
    if (tradesLoading) return; // Don't run until data is done loading
  
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
      {(!mappedTrades || mappedTrades.length === 0) ? (
        <section className="text-gray-400 text-center p-4 bg-gray-800 rounded-xl border border-gray-700">
          No trade data available.
        </section>
      ) : (
        <>
          <SummaryCards trades={mappedTrades} />
          <TradeTable columns={Columns(handleUpdate)} data={mappedTrades} />
        </>
      )}
    </div>
  );
};