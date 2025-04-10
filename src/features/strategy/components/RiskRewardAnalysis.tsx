import { Card } from "@/components/ui/card";
import { Target } from "lucide-react";
import {
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Trade {
  strategy: string; // Strategy associated with the trade
  risk: number; // Risk value for the trade
  reward: number; // Reward value for the trade
}

interface RiskRewardProps {
  trades: Trade[];
}

export const RiskRewardAnalysis = ({ trades }: RiskRewardProps) => {
  // Process trades to prepare data for the chart
  const riskRewardData = trades.map((trade) => ({
    risk: trade.risk,
    reward: trade.reward,
    success: trade.reward > trade.risk, // Determine if the trade was successful
  }));

  return (
    <Card className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Target className="text-red-400" />
        Risk vs Reward Analysis
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              type="number"
              dataKey="risk"
              name="Risk"
              stroke="#9CA3AF"
              tick={{ fill: "#9CA3AF" }}
              domain={[0, Math.max(...trades.map((t) => t.risk), 2.5)]} // Dynamically adjust domain
            />
            <YAxis
              type="number"
              dataKey="reward"
              name="Reward"
              stroke="#9CA3AF"
              tick={{ fill: "#9CA3AF" }}
              domain={[0, Math.max(...trades.map((t) => t.reward), 3)]} // Dynamically adjust domain
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "0.5rem",
              }}
              labelStyle={{ color: "#9CA3AF" }}
            />
            <Scatter name="Trades" data={riskRewardData}>
              {riskRewardData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.success ? "#10B981" : "#EF4444"} // Green for success, red for failure
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
