import { CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, Cell } from "recharts";
import { Link } from "react-router-dom";
import { BarChart4 } from "lucide-react";
import { useMemo } from "react";

interface Trade {
  strategy: string; // Strategy name
  isWin: boolean;   // Whether the trade was a win
}

interface StrategyPerformanceProps {
  trades: Trade[]; // List of trades
}

export const StrategyPerformance = ({ trades }: StrategyPerformanceProps) => {
  // Calculate win rates for each strategy
  const strategyData = useMemo(() => {
    if (!trades || trades.length === 0) return [];

    const strategyStats = trades.reduce((acc, trade) => {
      const { strategy, isWin } = trade;

      if (!acc[strategy]) {
        acc[strategy] = { wins: 0, total: 0 };
      }

      acc[strategy].total += 1;
      if (isWin) acc[strategy].wins += 1;

      return acc;
    }, {} as Record<string, { wins: number; total: number }>);

    return Object.entries(strategyStats).map(([strategy, stats]) => ({
      name: strategy,
      winRate: Math.round((stats.wins / stats.total) * 100), // Calculate win rate as a percentage
    }));
  }, [trades]);

  return (
    <Link
      to="/strategy"
      className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-emerald-500/50 transition-colors"
    >
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <BarChart4 className="text-purple-400" />
        Strategy Performance
      </h2>
      <div className="h-64 text-sm">
        {strategyData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={strategyData} margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="name"
                stroke="#9CA3AF"
                tick={{ fill: "#9CA3AF", fontSize: 12 }}

                angle={-45}
                textAnchor="end"
                
              />
              <YAxis
                stroke="#9CA3AF"
                tick={{ fill: "#9CA3AF" }}
                label={{
                  value: "Win Rate (%)",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#9CA3AF",
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "0.5rem",
                }}
                labelStyle={{ color: "#9CA3AF" }}
              />
              <Bar dataKey="winRate" fill="#8B5CF6">
                {strategyData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.winRate > 65 ? "#8B5CF6" : "#F59E0B"} // Purple for high win rates, amber for lower
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400 h-full text-sm flex items-center justify-center">No strategy data available.</p>
        )}
      </div>
    </Link>
  );
};