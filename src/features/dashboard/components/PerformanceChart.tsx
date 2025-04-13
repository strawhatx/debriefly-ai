import { LineChart as IconLineChart } from "lucide-react";
import { Link } from "react-router-dom";
import {
  LineChart as RechartsLineChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo } from "react";

interface Trade {
  date: string; // Time of the trade (e.g., "9:30")
  pnl: number;  // Profit or loss for the trade
}

interface PerformanceChartProps {
  trades: Trade[]; // List of trades
}

export const PerformanceChart = ({ trades }: PerformanceChartProps) => {
  // Calculate cumulative PnL over time
  const performanceData = useMemo(() => {
    return trades.reduce((acc, trade, index) => {
      const cumulativePnl = (acc[index - 1]?.cumulativePnl || 0) + trade.pnl;
      acc.push({ time: trade.time, cumulativePnl });
      return acc;
    }, [] as { time: string; cumulativePnl: number }[]);
  }, [trades]);

  return (
    <Link
      to="/history"
      className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-emerald-500/50 transition-colors"
    >
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <IconLineChart className="text-blue-400" />
        Today's Performance
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="time"
              stroke="#9CA3AF"
              tick={{ fill: "#9CA3AF" }}
              label={{ value: "Time", position: "insideBottom", fill: "#9CA3AF" }}
            />
            <YAxis
              stroke="#9CA3AF"
              tick={{ fill: "#9CA3AF" }}
              label={{
                value: "Cumulative PnL",
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
            <Line
              type="monotone"
              dataKey="cumulativePnl"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: "#10B981", strokeWidth: 2 }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </Link>
  );
};