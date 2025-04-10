import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { PieChart } from "lucide-react";

interface WinLossDistributionProps {
  trades: { pnl: number }[];
}

export const WinLossDistribution = ({ trades }: WinLossDistributionProps) => {
  const winLossDistribution = [
    {
      name: "Wins",
      value: trades.filter((trade) => trade.pnl > 0).length,
      color: "#10B981",
    },
    {
      name: "Losses",
      value: trades.filter((trade) => trade.pnl <= 0).length,
      color: "#EF4444",
    },
  ];

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <PieChart className="text-red-400" />
        Win/Loss Distribution
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={winLossDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
            <YAxis stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "0.5rem",
              }}
              labelStyle={{ color: "#9CA3AF" }}
            />
            <Bar dataKey="value">
              {winLossDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};