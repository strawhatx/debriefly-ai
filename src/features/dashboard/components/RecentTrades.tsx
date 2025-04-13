import { ArrowDownRight, ArrowUpRight, ChevronRight, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for recent trades
const recentTrades = [
  {
    id: 1,
    asset: 'BTC/USD',
    type: 'Long',
    entry: 65000,
    exit: 67000,
    pnl: 2000,
    time: '12:45'
  },
  {
    id: 2,
    asset: 'ETH/USD',
    type: 'Short',
    entry: 3200,
    exit: 3150,
    pnl: 50,
    time: '11:30'
  },
  {
    id: 3,
    asset: 'BTC/USD',
    type: 'Long',
    entry: 64500,
    exit: 64000,
    pnl: -500,
    time: '10:15'
  }
];

export const RecentTrades = () => {
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
      {recentTrades.map((trade) => (
        <div key={trade.id} className="p-4 bg-gray-900/50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className={`flex items-center gap-1 ${trade.type === 'Long' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                {trade.type === 'Long' ? (
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
            <span className={`font-medium ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
              {trade.pnl >= 0 ? '+' : ''}{trade.pnl}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
}