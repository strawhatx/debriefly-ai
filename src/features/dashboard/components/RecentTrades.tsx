import { ArrowDownRight, ArrowUpRight, ChevronRight, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo } from "react";

interface Trade {
  id: number;
  symbol: string; // Asset name (e.g., BTC/USD)
  type: "Long" | "Short"; // Trade type
  entry: number; // Entry price
  exit: number; // Exit price
  pnl: number; // Profit or loss
  date: string; // Time of the trade
}

interface RecentTradesProps {
  trades: Trade[]; // List of recent trades
}

export const RecentTrades = ({ trades }: RecentTradesProps) => {
  // Memoized trades to avoid unnecessary re-renders
  const recentTrades = useMemo(() => trades.slice(0, 5), [trades]); // Show only the 5 most recent trades

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <ClipboardList className="text-blue-400" />
          Recent Trades
        </h2>
        <Link
          to="/history"
          className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="space-y-4">
        {recentTrades.length > 0 ? (
          recentTrades.map((trade) => (
            <TradeCard key={trade.id} trade={trade} />
          ))
        ) : (
          <p className="text-gray-400 text-center">No recent trades available.</p>
        )}
      </div>
    </div>
  );
};

// Reusable TradeCard Component
const TradeCard = ({ trade }: { trade: Trade }) => {
  return (
    <div className="p-4 bg-gray-900/50 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1 ${
              trade.type === "Long" ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {trade.type === "Long" ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            {trade.asset}
          </span>
        </div>
        <span className="text-sm text-gray-400">{trade.time}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-300">
          {trade.entry} → {trade.exit}
        </span>
        <span
          className={`font-medium ${
            trade.pnl >= 0 ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {trade.pnl >= 0 ? "+" : ""}
          {trade.pnl}
        </span>
      </div>
    </div>
  );
};