import { abbreviateNumber } from "@/utils/utils";
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

interface Trade {
  date: string; // Format like "YYYY-MM-DD"
  pnl: number;
}

interface PerformanceChartProps {
  trades: Trade[];
}

export const PerformanceChart = ({ trades }: PerformanceChartProps) => {
  const hasData = trades.length > 0;

  // Group trades by date and calculate total PnL for each day
  const groupedData = hasData
    ? trades.reduce((acc, trade) => {
        const existing = acc.find((item) => item.date === trade.date);
        if (existing) {
          existing.pnl += trade.pnl;
        } else {
          acc.push({ date: trade.date, pnl: trade.pnl });
        }
        return acc;
      }, [] as { date: string; pnl: number }[])
    : [];

  // Calculate cumulative PnL for the grouped data
  const performanceData = groupedData.reduce((acc, trade, index) => {
    const cumulativePnl = (acc[index - 1]?.cumulativePnl || 0) + trade.pnl;
    acc.push({ date: trade.date, cumulativePnl });
    return acc;
  }, [] as { date: string; cumulativePnl: number }[]);

  return (
    <Link
      to="/history"
      className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-emerald-500/50 transition-colors block"
    >
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <IconLineChart className="text-blue-400" />
        Months Performance
      </h2>

      {hasData ? (
        <div className="h-64 text-sm">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                tick={{ fill: "#9CA3AF" }}
              />
              <YAxis
                stroke="#9CA3AF"
                tick={{ fill: "#9CA3AF" }}
                tickFormatter={abbreviateNumber} // Use custom formatter
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
      ) : (
        <div className="text-gray-400 text-sm h-40 flex items-center justify-center border border-dashed border-gray-600 rounded-md">
          No performance data yet.
        </div>
      )}
    </Link>
  );
};
