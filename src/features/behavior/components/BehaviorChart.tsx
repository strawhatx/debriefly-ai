
import { Card } from "@/components/ui/card";
import { LineChartIcon } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";
import { useDateStore } from "@/store/date";
import { calculateConfidence } from "@/utils/calculate-confidence";
import { calculateDiscipline } from "@/utils/calculate-discipline";
import { calculateBehaviorScore } from "@/utils/calculate-behavioral-score";

interface Trade {
  id: string;
  date: string;
  symbol: string;
  market: string;
  type: 'LONG' | 'SHORT';
  entry: number;
  exit: number;
  pnl: number;
  entry_date: string; // Changed from Date to string
  closing_date: string; // Changed from Date to string
  risk: number;
  reward: number;
  strategy: string | null;
  tags: string[];
}

interface BehaviorChartProps {
  trades: Trade[] | null | undefined;
}

export const BehaviorChart = ({ trades }: BehaviorChartProps) => {
  const days = useDateStore((state) => state.days);

  const trendData = useMemo(() => {
    if (!trades || trades.length === 0) return [];

    const sortedTrades = trades
      .filter((trade) => trade?.date)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const points = sortedTrades.map((trade) => {
      const emotionalScore = calculateBehaviorScore(trade) ?? 0;
      const discipline = calculateDiscipline(trade) ?? 0;
      const confidence = calculateConfidence(trade) ?? 0;

      return {
        date: trade?.date
          ? new Date(trade.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          : "Unknown Date",
        emotionalScore,
        discipline,
        confidence,
      };
    });

    // Reduce to ~30 points max for clarity if necessary
    const MAX_POINTS = 30;
    if (points.length <= MAX_POINTS) return points;

    const chunkSize = Math.ceil(points.length / MAX_POINTS);
    const batched = [];

    for (let i = 0; i < points.length; i += chunkSize) {
      const chunk = points.slice(i, i + chunkSize);
      const avg = (key: keyof typeof chunk[0]) =>
        chunk.reduce((sum, p) => sum + (p[key] as number), 0) / chunk.length;

      batched.push({
        date: `${chunk[0].date} - ${chunk[chunk.length - 1].date}`,
        emotionalScore: avg("emotionalScore"),
        discipline: avg("discipline"),
        confidence: avg("confidence"),
      });
    }

    return batched;
  }, [trades, days]);

  // Null check for trendData before rendering the chart
  if (!trendData || trendData.length === 0) {
    return (
      <Card className="bg-gray-800 border border-gray-700 p-4 ">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
          <LineChartIcon className="text-blue-400" />
          Behavior Metrics Over Time
        </h2>
        <p className="text-gray-400 flex items-center justify-center text-sm min-h-44">No data available to display.</p>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border border-gray-700 p-4 min-h-44">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
        <LineChartIcon className="text-blue-400" />
        Behavior Metrics Over Time
      </h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              stroke="#9CA3AF"
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              minTickGap={10}
            />
            <YAxis
              stroke="#9CA3AF"
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              domain={[0, 10]}
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
              dataKey="emotionalScore"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: "#10B981", strokeWidth: 2 }}
              name="Emotional Score"
            />
            <Line
              type="monotone"
              dataKey="discipline"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: "#3B82F6", strokeWidth: 2 }}
              name="Discipline"
            />
            <Line
              type="monotone"
              dataKey="confidence"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={{ fill: "#8B5CF6", strokeWidth: 2 }}
              name="Confidence"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
