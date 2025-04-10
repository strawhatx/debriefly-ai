import { Card } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface Trade {
  strategy: string; // Strategy associated with the trade
  reward?: number; // Optional risk/reward ratio for the trade
}

interface RiskRewardProps {
  trades: Trade[];
}

export const RiskReward = ({ trades }: RiskRewardProps) => {
  // Group trades by strategy and calculate average risk/reward
  const riskRewardByStrategy = trades.reduce((acc, trade) => {
    const { strategy, reward } = trade;

    // Ensure strategy exists
    if (!strategy) return acc;

    if (!acc[strategy]) {
      acc[strategy] = { totalRiskReward: 0, count: 0 };
    }

    // Use provided risk/reward ratio or fallback to a default value
    const rr = reward ?? 1; // Default to 1 if missing
    acc[strategy].totalRiskReward += rr;
    acc[strategy].count += 1;

    return acc;
  }, {} as Record<string, { totalRiskReward: number; count: number }>);

  // Calculate average risk/reward ratios
  const riskRewardRatios = Object.entries(riskRewardByStrategy).map(([strategy, stats]) => {
    const averageRiskReward = (stats.totalRiskReward / stats.count).toFixed(2); // Calculate average
    return { strategy, riskReward: averageRiskReward };
  });

  return (
    <Card className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Activity className="text-blue-400" />
        Risk/Reward by Strategy
      </h2>

      <div className="space-y-2">
        {riskRewardRatios.length === 0 ? (
          <p className="text-gray-400 flex items-center justify-center text-sm min-h-44">
            No valid trade data available.
          </p>
        ) : (
          riskRewardRatios.map(({ strategy, riskReward }) => (
            <div key={strategy} className="flex justify-between items-center">
              <span>{strategy}</span>
              <span
                className={
                  parseFloat(riskReward) >= 2
                    ? "text-emerald-400"
                    : parseFloat(riskReward) >= 1
                    ? "text-amber-400"
                    : "text-red-400"
                }
              >
                1:{riskReward}
              </span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
