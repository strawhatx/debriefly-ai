
import { useState } from "react";
import {
  Search,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  SortAsc
} from 'lucide-react';
import { TradesDataTable, Trade } from "@/components/trades/TradesDataTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const TradeHistory = () => {
  const [selectedAccount, setSelectedAccount] = useState<string>("all");

  const trades = [
    {
      id: 1,
      date: '2024-03-15',
      asset: 'BTC/USD',
      type: 'Long',
      entry: 65432,
      exit: 67890,
      pnl: 2458,
      emotion: 'Calm',
    },
    {
      id: 2,
      date: '2024-03-15',
      asset: 'ETH/USD',
      type: 'Short',
      entry: 3200,
      exit: 3150,
      pnl: 50,
      emotion: 'Confident',
    },
    {
      id: 3,
      date: '2024-03-14',
      asset: 'BTC/USD',
      type: 'Short',
      entry: 68000,
      exit: 67500,
      pnl: 500,
      emotion: 'Hesitant',
    },
  ];

  const { data: tradingAccounts } = useQuery({
    queryKey: ["tradingAccounts"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("trading_accounts")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      return data;
    },
  });

  const { data: tradeHistory, isLoading } = useQuery({
    queryKey: ["trades", selectedAccount],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let query = supabase
        .from("positions")
        .select(`
          id, trading_account_id, symbol, asset_type, position_type, fill_price, stop_price entry_date, pnl,
          emotional_tags ( tags )
        `)
        .eq("user_id", user.id)
        .order("entry_date", { ascending: false });

      if (selectedAccount !== "all") {
        query = query.eq("trading_account_id", selectedAccount);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Map the trade history to our Trade interface
      const trades: Trade[] = data.map(trade => ({
        id: trade.id,
        symbol: trade.symbol,
        entry_date: trade.entry_date,
        closing_date: trade.closing_date,
        fill_price: trade.fill_price,
        quantity: trade.quantity,
        side: trade.side,
        pnl: null, // Set PnL to null since it's not in the trade_history table
        fees: trade.fees || 0,
        trading_accounts: {
          account_name: trade.trading_accounts.account_name
        }
      }));

      return trades;
    },
    enabled: true,
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Trade History</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search trades..."
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Trade Statistics */}
      <section className="grid grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <span className="text-gray-400">Total Trades</span>
          <div className="text-2xl font-semibold mt-1">156</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <span className="text-gray-400">Win Rate</span>
          <div className="text-2xl font-semibold text-emerald-400 mt-1">65%</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <span className="text-gray-400">Total P&L</span>
          <div className="text-2xl font-semibold text-emerald-400 mt-1">+$12,450</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <span className="text-gray-400">Avg Trade</span>
          <div className="text-2xl font-semibold text-emerald-400 mt-1">+$79.80</div>
        </div>
      </section>

      {/* Trade Table */}
      <section className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-6 py-3 text-left">
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
                <th className="px-6 py-3 text-left">Emotion</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="px-6 py-4">{trade.date}</td>
                  <td className="px-6 py-4">{trade.asset}</td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1 ${trade.type === 'Long' ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                      {trade.type === 'Long' ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      {trade.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">{trade.entry}</td>
                  <td className="px-6 py-4">{trade.exit}</td>
                  <td className={`px-6 py-4 ${trade.pnl > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {trade.pnl > 0 ? '+' : '-'}${Math.abs(trade.pnl)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-700 rounded-full text-sm">
                      {trade.emotion}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
