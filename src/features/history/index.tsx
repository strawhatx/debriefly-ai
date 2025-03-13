import { useEffect, useState } from "react";
import { Search, ArrowUpRight, ArrowDownRight, Filter, SortAsc } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import useTradingAccountStore from "@/store/trading-account";
import { Input } from "@/components/ui/input";
import { SelectAccount } from "@/components/SelectAccount";
import { format } from "date-fns";
import { TradeStatistics } from "./components/TradeStatistics";
import { TradeExport } from "./components/TradeExport";

export const History = () => {
  const selectedAccount = useTradingAccountStore((state) => state.selected);
  const [trades, setTrades] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handlePositions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    let query = supabase
      .from("positions")
      .select(`id, trading_account_id, symbol, asset_type, position_type, fill_price, stop_price, entry_date, fees, 
        quantity, closing_date, pnl,  emotional_tags ( tags )`)
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
  }

  const filteredTrades = searchQuery.trim() === "" ? trades : trades.filter(trade =>
    trade.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {

    handlePositions();
  }, [selectedAccount])

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Trade History</h1>
        <div className="flex gap-4 align-middle">
          <SelectAccount />
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              value={searchQuery}
              placeholder="Search trades..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <TradeExport trades={filteredTrades} />
        </div>
      </div>

      {/* Trade Statistics */}
      <TradeStatistics trades={filteredTrades} />

      {/* Trade Table */}
      {(filteredTrades && filteredTrades.length === 0) ? (
        <p className="text-gray-400">No trades found for this account.</p>
      ) : (
        <section className="bg-gray-800 rounded-xl border border-gray-700">
          <div >
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-3 py-3 text-left">
                    <div className="flex items-center gap-2">
                      Date
                      <SortAsc className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left">Asset</th>
                  <th className="px-6 py-3 text-left">Type</th>
                  <th className="px-6 py-3 text-left">Entry</th>
                  <th className="px-6 py-3 text-left">Exit</th>
                  <th className="px-6 py-3 text-left">P&L</th>
                  <th className="px-6 py-3 text-left">Top Emotion</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrades.map((trade) => {
                  let is_buy = trade.side?.toUpperCase() === 'LONG' || trade.side?.toUpperCase() === 'CALL';
                  return (
                    <tr key={trade.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="px-6 py-4">{format(new Date(trade.entry_date), "MMM dd yyyy")}</td>
                      <td className="px-6 py-4">{trade.symbol}</td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1 ${is_buy ? 'text-emerald-400' : 'text-red-400'}`}>
                          {is_buy ? (<ArrowUpRight className="w-4 h-4" />) : (<ArrowDownRight className="w-4 h-4" />)}
                          {trade.side}
                        </span>
                      </td>
                      <td className="px-6 py-4">{trade.fill_price}</td>
                      <td className="px-6 py-4">{trade.stop_price}</td>
                      <td className={`px-6 py-4 ${trade.pnl > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {trade.pnl > 0 ? '+' : '-'}${Math.abs(trade.pnl.toFixed(2))}
                      </td>
                      <td className="px-4 py-4">
                        {(trade.emotional_tags && trade.emotional_tags.length > 0) && (
                          <span className="px-2 py-1 bg-gray-700 rounded-full text-sm">
                            {trade.emotional_tags[0]}
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};
