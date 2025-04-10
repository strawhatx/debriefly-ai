import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

interface EquityCurveProps {
  trades: { pnl: number }[];
}

export const EquityCurve = ({ trades }: EquityCurveProps) => {
  const equityCurveData = trades.reduce(
    (acc, trade, index) => {
      const cumulativePnl = acc[index - 1]?.cumulativePnl || 0;
      acc.push({
        tradeIndex: index + 1,
        cumulativePnl: cumulativePnl + trade.pnl,
      });
      return acc;
    },
    [] as { tradeIndex: number; cumulativePnl: number }[]
  );

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <TrendingUp className="text-green-400" />
        Equity Curve
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={equityCurveData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="tradeIndex"
              name="Trade Index"
              stroke="#9CA3AF"
              tick={{ fill: "#9CA3AF" }}
            />
            <YAxis
              dataKey="cumulativePnl"
              name="Cumulative PnL"
              stroke="#9CA3AF"
              tick={{ fill: "#9CA3AF" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "0.5rem",
              }}
              labelStyle={{ color: "#9CA3AF" }}
            />
            <Line
              type="monotone"
              dataKey="cumulativePnl"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};