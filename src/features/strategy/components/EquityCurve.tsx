import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";
  import { TrendingUp } from "lucide-react";
  import { useMemo } from "react";
  
  interface Trade {
    pnl: number;
  }
  
  interface EquityCurveProps {
    trades?: Trade[] | null;
  }
  
  export const EquityCurve = ({ trades }: EquityCurveProps) => {
    const equityCurveData = useMemo(() => {
      if (!Array.isArray(trades) || trades.length === 0) return [];
  
      return trades.reduce((acc, trade, index) => {
        const prevPnl = acc[index - 1]?.cumulativePnl ?? 0;
        const currentPnl = typeof trade?.pnl === "number" ? trade.pnl : 0;
  
        acc.push({
          tradeIndex: index + 1,
          cumulativePnl: prevPnl + currentPnl,
        });
  
        return acc;
      }, [] as { tradeIndex: number; cumulativePnl: number }[]);
    }, [trades]);
  
    const hasData = equityCurveData.length > 0;
  
    return (
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="text-green-400" />
          Equity Curve
        </h2>
  
        <div className="h-64">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={equityCurveData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="tradeIndex"
                  stroke="#9CA3AF"
                  tick={{ fill: "#9CA3AF" }}
                />
                <YAxis
                  dataKey="cumulativePnl"
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
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm italic">
              No equity curve data available.
            </div>
          )}
        </div>
      </div>
    );
  };
  