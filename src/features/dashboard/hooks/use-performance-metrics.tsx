import { useMemo } from "react";

interface Trade {
  pnl: number; // Profit or loss for the trade
  risk: number; // Risk value for the trade
  reward: number; // Reward value for the trade
  isWin: boolean; // Whether the trade was a win
  score?: number; // Optional emotional score for the trade
}

export const usePerformanceMetrics = (trades: Trade[]) => {
  return useMemo(() => {
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
      trades.reduce((sum, trade) => sum + (trade.score || 0), 0) /
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
};