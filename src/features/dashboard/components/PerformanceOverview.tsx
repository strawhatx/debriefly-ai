import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo } from "react";

interface Trade {
  pnl: number; // Profit or loss for the trade
  risk: number; // Risk value for the trade
  reward: number; // Reward value for the trade
  isWin: boolean; // Whether the trade was a win
  emotionalScore?: number; // Optional emotional score for the trade
}

interface PerformanceOverviewProps {
  trades: Trade[];
}

export const PerformanceOverview = ({ trades }: PerformanceOverviewProps) => {
  // Memoized calculations for performance metrics
  const metrics = useMemo(() => {
    if (!trades || trades.length === 0) {
      return {
        dailyPnl: 0,
        winRate: 0,
        avgRiskReward: 0,
        emotionalScore: 0,
        totalTrades: 0,
        winningTrades: 0,
      };
    }

    const totalPnl = trades.reduce((sum, trade) => sum + trade.pnl, 0);
    const winningTrades = trades.filter((trade) => trade.isWin).length;
    const totalTrades = trades.length;
    const winRate = (winningTrades / totalTrades) * 100;

    const avgRiskReward =
      trades.reduce((sum, trade) => sum + trade.reward / trade.risk, 0) /
      totalTrades;

    const emotionalScore =
      trades.reduce((sum, trade) => sum + (trade.emotionalScore || 0), 0) /
      totalTrades;

    return {
      dailyPnl: totalPnl,
      winRate,
      avgRiskReward,
      emotionalScore,
      totalTrades,
      winningTrades,
    };
  }, [trades]);

  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Daily P&L */}
      <Link
        to="/history"
        className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-emerald-500/50 transition-colors"
      >
        <span className="text-gray-400">Daily P&L</span>
        <div
          className={`text-2xl font-bold mt-1 ${
            metrics.dailyPnl >= 0 ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {metrics.dailyPnl >= 0 ? "+" : ""}
          ${metrics.dailyPnl.toFixed(2)}
        </div>
        <div className="flex items-center gap-1 text-sm text-emerald-400">
          <ArrowUpRight className="w-4 h-4" />
          <span>
            {metrics.dailyPnl >= 0 ? "+" : ""}
            {((metrics.dailyPnl / 10000) * 100).toFixed(2)}% today
          </span>
        </div>
      </Link>

      {/* Win Rate */}
      <Link
        to="/strategy"
        className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-emerald-500/50 transition-colors"
      >
        <span className="text-gray-400">Win Rate</span>
        <div className="text-2xl font-bold text-emerald-400 mt-1">
          {metrics.winRate.toFixed(1)}%
        </div>
        <div className="text-sm text-gray-400">
          {metrics.winningTrades}/{metrics.totalTrades} winning trades
        </div>
      </Link>

      {/* Average Risk/Reward Ratio */}
      <Link
        to="/strategy"
        className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-emerald-500/50 transition-colors"
      >
        <span className="text-gray-400">Avg R:R Ratio</span>
        <div className="text-2xl font-bold text-emerald-400 mt-1">
          1:{metrics.avgRiskReward.toFixed(1)}
        </div>
        <div className="text-sm text-gray-400">Above target (1:1.5)</div>
      </Link>

      {/* Emotional Score */}
      <Link
        to="/behavior"
        className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-emerald-500/50 transition-colors"
      >
        <span className="text-gray-400">Emotional Score</span>
        <div className="text-2xl font-bold text-emerald-400 mt-1">
          {metrics.emotionalScore.toFixed(1)}/10
        </div>
        <div className="text-sm text-emerald-400">Disciplined Trading</div>
      </Link>
    </div>
  );
};