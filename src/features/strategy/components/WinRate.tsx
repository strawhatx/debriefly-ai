import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface Trade {
  pnl: number; // Profit or loss for the trade
  strategy: string; // Strategy associated with the trade
}

interface WinRateProps {
  trades: Trade[];
}

export const WinRate = ({ trades }: WinRateProps) => {
  const winRates = useMemo(() => {
    const strategyStats = trades.reduce((acc, trade) => {
      const { pnl, strategy } = trade;

      // Ensure strategy exists
      if (!strategy) return acc;

      if (!acc[strategy]) acc[strategy] = { wins: 0, total: 0 };

      acc[strategy].total += 1;
      if (pnl > 0) acc[strategy].wins += 1;

      return acc;
    }, {} as Record<string, { wins: number; total: number }>);

    return Object.entries(strategyStats).map(([strategy, stats]) => ({
      strategy,
      winRate: Number(((stats.wins / stats.total) * 100).toFixed(0)),
    }));
  }, [trades]);

  return (
    <Card className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Activity className="text-blue-400" />
        Win Rate by Strategy
      </h2>

      {winRates.length === 0 ? (
        <p className="text-gray-400 flex items-center justify-center text-sm min-h-44">
          No valid trade data available.
        </p>
      ) : (
        <div className="space-y-2">
          {winRates.map(({ strategy, winRate }) => (
            <div key={strategy} className="flex justify-between items-center">
              <span>{strategy}</span>
              <span
                className={
                  winRate >= 60
                    ? "text-emerald-400"
                    : winRate >= 40
                    ? "text-amber-400"
                    : "text-red-400"
                }
              >
                {winRate}%
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
