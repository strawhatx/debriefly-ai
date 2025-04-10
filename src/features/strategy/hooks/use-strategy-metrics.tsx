import { useMemo } from "react";

interface Position {
  id: string;
  strategy: string;
  pnl: number;
  risk: number;
  reward: number;
  isWin: boolean;
}

interface StrategyMetrics {
  bestStrategy: string;
  winRate: string;
  avgRRRatio: string;
  consistencyScore: string;
  strategyHealth: string;
}

export const useStrategyMetrics = (positions: Position[] | null): StrategyMetrics => {
  return useMemo(() => {
    if (!positions || positions.length === 0) {
      return {
        bestStrategy: "N/A",
        winRate: "N/A",
        avgRRRatio: "N/A",
        consistencyScore: "N/A",
        strategyHealth: "N/A",
      };
    }

    // Group trades by strategy
    const strategyStats = positions.reduce((acc, position) => {
      const { strategy, isWin, pnl, risk, reward } = position;
      if (!acc[strategy]) {
        acc[strategy] = { wins: 0, total: 0, pnl: 0, riskRewardRatios: [] };
      }
      acc[strategy].wins += isWin ? 1 : 0;
      acc[strategy].total += 1;
      acc[strategy].pnl += pnl;
      acc[strategy].riskRewardRatios.push(reward / risk);
      return acc;
    }, {} as Record<string, { wins: number; total: number; pnl: number; riskRewardRatios: number[] }>);

    // Determine the best strategy by win rate
    const bestStrategy = Object.entries(strategyStats).reduce(
      (best, [strategy, stats]) => {
        const winRate = stats.wins / stats.total;
        return winRate > best.winRate ? { strategy, winRate } : best;
      },
      { strategy: "N/A", winRate: 0 }
    ).strategy;

    // Calculate overall metrics
    const totalWins = positions.filter((p) => p.isWin).length;
    const winRate = ((totalWins / positions.length) * 100).toFixed(1) + "%";
    const avgRRRatio =
      (
        positions.reduce((sum, p) => sum + p.reward / p.risk, 0) / positions.length
      ).toFixed(2);
    const consistencyScore = Math.min(
      10,
      (totalWins / positions.length) * 10
    ).toFixed(1);
    const strategyHealth =
      totalWins / positions.length > 0.7 ? "Strong" : "Needs Improvement";

    return {
      bestStrategy,
      winRate,
      avgRRRatio,
      consistencyScore,
      strategyHealth,
    };
  }, [positions]);
};