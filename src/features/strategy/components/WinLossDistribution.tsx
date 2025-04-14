import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
  } from "recharts";
  import { PieChart } from "lucide-react";
  import { useMemo } from "react";
  
  interface WinLossDistributionProps {
    trades: { pnl: number }[];
  }
  
  export const WinLossDistribution = ({ trades }: WinLossDistributionProps) => {
    const hasTrades = trades.length > 0;
  
    const winLossDistribution = useMemo(() => [
      {
        name: "Wins",
        value: trades.filter((trade) => trade.pnl > 0).length,
        color: "#10B981", // Emerald
      },
      {
        name: "Losses",
        value: trades.filter((trade) => trade.pnl <= 0).length,
        color: "#EF4444", // Red
      },
    ], [trades]);
  
    const axisStyle = { fill: "#9CA3AF" };
    const tooltipStyle = {
      backgroundColor: "#1F2937",
      border: "1px solid #374151",
      borderRadius: "0.5rem",
    };
  
    return (
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <h2
          className="text-lg font-semibold mb-4 flex items-center gap-2"
          aria-label="Win/Loss Distribution Chart"
        >
          <PieChart className="text-red-400" />
          Win/Loss Distribution
        </h2>
  
        {hasTrades ? (
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={winLossDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke={axisStyle.fill} tick={axisStyle} />
                <YAxis stroke={axisStyle.fill} tick={axisStyle} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={axisStyle} />
                <Bar dataKey="value">
                  {winLossDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-gray-400 text-sm h-44 flex items-center justify-center border border-dashed border-gray-600 rounded-md">
            No trade data available.
          </div>
        )}
      </div>
    );
  };
  