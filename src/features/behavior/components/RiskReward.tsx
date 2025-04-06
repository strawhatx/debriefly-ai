import { Card } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface Trade {
  tags: string[]; // Tags (emotions) associated with the trade
  riskReward?: number; // Optional risk/reward ratio for the trade
}

interface RiskRewardProps {
  trades: Trade[];
}

export const RiskReward = ({ trades }: RiskRewardProps) => {
  // Group trades by tags and calculate average risk/reward
  const riskRewardByEmotion = trades.reduce((acc, trade) => {
    const { tags, riskReward } = trade;

    // Ensure tags exist and are valid
    if (!Array.isArray(tags)) return acc;

    tags.forEach((tag) => {
      if (!acc[tag]) {
        acc[tag] = { totalRiskReward: 0, count: 0 };
      }

      // Use provided risk/reward ratio or fallback to a default value
      const rr = typeof riskReward === "number" ? riskReward : 1; // Default to 1 if missing
      acc[tag].totalRiskReward += rr;
      acc[tag].count += 1;
    });

    return acc;
  }, {} as Record<string, { totalRiskReward: number; count: number }>);

  // Calculate average risk/reward ratios
  const riskRewardRatios = Object.entries(riskRewardByEmotion).map(([emotion, stats]) => {
    const averageRiskReward = (stats.totalRiskReward / stats.count).toFixed(2); // Calculate average
    return { emotion, riskReward: averageRiskReward };
  });

  return (
    <Card className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Activity className="text-blue-400" />
        Risk/Reward by Emotion
      </h2>

      <div className="space-y-2">
        {riskRewardRatios.length === 0 ? (
          <p className="text-gray-400 text-sm">No valid trade data available.</p>
        ) : (
          riskRewardRatios.map(({ emotion, riskReward }) => (
            <div key={emotion} className="flex justify-between items-center">
              <span>{emotion}</span>
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
