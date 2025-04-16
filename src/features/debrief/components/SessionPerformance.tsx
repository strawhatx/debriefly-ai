import { useMemo } from 'react';
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, TooltipProps } from "recharts";
import { LineChart as LineChartIcon } from "lucide-react";

interface Position {
  time: string;
  pnl: number;
}

interface SessionPerformanceProps {
  positions: Position[] | null;
  isLoading?: boolean;
  className?: string;
}

const CHART_CONFIG = {
  height: 256,
  colors: {
    line: '#10B981',
    grid: '#374151',
    text: '#9CA3AF',
    background: '#1F2937',
    border: '#374151',
  },
  tooltipStyle: {
    backgroundColor: '#1F2937',
    border: '1px solid #374151',
    borderRadius: '0.5rem',
  },
} as const;

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
      <p className="text-gray-400">{`Time: ${label}`}</p>
      <p className="text-emerald-500 font-semibold">
        {`PNL: ${payload[0].value?.toFixed(2)}`}
      </p>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-44 bg-gray-700/20 rounded-lg" />
  </div>
);

const EmptyState = () => (
  <div className="h-44 flex items-center justify-center">
    <p className="text-gray-500">No performance data available</p>
  </div>
);

export const SessionPerformance = ({
  positions,
  isLoading = false,
  className = '',
}: SessionPerformanceProps) => {
  const chartData = useMemo(() => positions || [], [positions]);

  // Function to abbreviate large numbers
  const abbreviateNumber = (value: number) => {
    if (value >= 1_000_000) return `${(value / 1_000_000)}M`;
    if (value >= 1_000) return `${(value / 1_000)}K`;
    return value.toString();
  };

  if (isLoading) {
    return (
      <div className={`bg-gray-800 rounded-xl p-6 border border-gray-700 ${className}`}>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <LineChartIcon className="text-blue-400" />
          Session Performance
        </h2>
        <LoadingSkeleton />
      </div>
    );
  }

  if (!positions?.length) {
    return (
      <div className={`bg-gray-800 rounded-xl p-6 border border-gray-700 ${className}`}>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <LineChartIcon className="text-blue-400" />
          Session Performance
        </h2>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className={`bg-gray-800 rounded-xl p-6 border border-gray-700 ${className}`}>
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <LineChartIcon className="text-blue-400" />
        Session Performance
      </h2>
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={chartData}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={CHART_CONFIG.colors.grid} 
            />
            <XAxis
              dataKey="time"
              stroke={CHART_CONFIG.colors.text}
              tick={{ fill: CHART_CONFIG.colors.text }}
            />
            <YAxis
              stroke={CHART_CONFIG.colors.text}
              tick={{ fill: CHART_CONFIG.colors.text }}
              tickFormatter={abbreviateNumber} // Use custom formatter
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="pnl"
              stroke={CHART_CONFIG.colors.line}
              strokeWidth={2}
              dot={{ 
                fill: CHART_CONFIG.colors.line, 
                strokeWidth: 2 
              }}
              activeDot={{ 
                r: 6, 
                fill: CHART_CONFIG.colors.line 
              }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
