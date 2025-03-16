import { Search, SortAsc } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { SelectAccount } from "@/components/SelectAccount";
import { TradeStatistics } from "./components/TradeStatistics";
import { TradeExport } from "./components/TradeExport";
import { TradeRow } from "./components/TradeRow";
import { useTrades } from "./hooks/use-trades";

export const History = () => {
  const { trades, searchQuery, setSearchQuery } = useTrades();

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
          <TradeExport trades={trades} />
        </div>
      </div>

      {/* Trade Statistics */}
      <TradeStatistics trades={trades} />

      {/* Trade Table */}
      {trades.length === 0 ? (
        <p className="text-gray-400">No trades found for this account.</p>
      ) : (
        <section className="bg-gray-800 rounded-xl border border-gray-700">
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
              {trades.map((trade) => (
                <TradeRow key={trade.id} trade={trade} />
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
};
