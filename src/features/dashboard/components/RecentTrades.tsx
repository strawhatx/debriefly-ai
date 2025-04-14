import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronRight,
  ClipboardList,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo } from "react";

interface Trade {
  id: string;
  symbol: string;
  type: "LONG" | "SHORT";
  entry: number;
  exit: number;
  pnl: number;
  date: string;
}

interface RecentTradesProps {
  trades: Trade[];
}

export const RecentTrades = ({ trades }: RecentTradesProps) => {
  const recentTrades = useMemo(() => trades.slice(0, 5), [trades]);

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
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
      <div className="space-y-4 ">
        {recentTrades?.length > 0 ? (
          recentTrades.map((trade) => <TradeCard key={trade.id} trade={trade} />)
        ) : (
          <p className="text-gray-400 text-sm h-44 flex items-center justify-center">No recent trades available.</p>
        )}
      </div>
    </div>
  );
};

const TradeCard = ({ trade }: { trade: Trade }) => {
  const isWin = trade.pnl >= 0;
  const pnlColor = isWin ? "text-emerald-400" : "text-red-400";
  const arrowIcon =
    trade.type === "LONG" ? (
      <ArrowUpRight className="w-4 h-4" />
    ) : (
      <ArrowDownRight className="w-4 h-4" />
    );

  return (
    <div className="p-4 bg-gray-900/50 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1 ${pnlColor}`}>
            {arrowIcon}
            {trade.symbol}
          </span>
        </div>
        <span className="text-sm text-gray-400">{trade.date}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-300">
          {trade.entry} → {trade.exit}
        </span>
        <span className={`font-medium ${pnlColor}`}>
          {isWin ? "+" : "-"}${Math.abs(trade.pnl).toFixed(2)}
        </span>
      </div>
    </div>
  );
};
