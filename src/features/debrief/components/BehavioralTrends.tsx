import { useMemo } from 'react';
import {
  CartesianGrid,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { Brain } from 'lucide-react';
import { calculateBehaviorScore } from '../utils/calculate-behavioral-score';

interface Position {
  date: string;
  score: number;
}

interface BehaviorDataPoint {
  date: string;
  score: number;
}

interface BehavioralTrendsProps {
  positions: Position[] | null;
  className?: string;
  isLoading?: boolean;
}

const CHART_CONFIG = {
  height: 256,
  colors: {
    line: '#8B5CF6',
    grid: '#374151',
    text: '#9CA3AF',
    background: '#1F2937',
    border: '#374151',
  },
  domain: {
    min: 0,
    max: 100,
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
      <p className="text-gray-400">{`Date: ${label}`}</p>
      <p className="text-purple-400 font-semibold">
        {`Score: ${payload[0].value?.toFixed(1)}`}
      </p>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-64 bg-gray-700/20 rounded-lg" />
  </div>
);

const EmptyState = () => (
  <div className="h-64 flex items-center justify-center">
    <p className="text-gray-500">No behavioral data available</p>
  </div>
);

export const BehavioralTrends = ({
  positions,
  className = '',
  isLoading = false,
}: BehavioralTrendsProps) => {

  const renderChart = () => {
    if (isLoading) return <LoadingSkeleton />;
    if (!positions.length) return <EmptyState />;

    return (
      <ResponsiveContainer width="100%" height={CHART_CONFIG.height}>
        <RechartsLineChart data={positions}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={CHART_CONFIG.colors.grid} 
          />
          <XAxis
            dataKey="date"
            stroke={CHART_CONFIG.colors.text}
            tick={{ fill: CHART_CONFIG.colors.text }}
          />
          <YAxis
            stroke={CHART_CONFIG.colors.text}
            tick={{ fill: CHART_CONFIG.colors.text }}
            domain={[CHART_CONFIG.domain.min, CHART_CONFIG.domain.max]}
            tickFormatter={(value) => value.toFixed(0)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="score"
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
    );
  };

  return (
    <div className={`bg-gray-800 rounded-xl p-6 border border-gray-700 ${className}`}>
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Brain className="text-purple-400" />
        Behavioral Trends
      </h2>
      <div className="h-64">
        {renderChart()}
      </div>
    </div>
  );
};
