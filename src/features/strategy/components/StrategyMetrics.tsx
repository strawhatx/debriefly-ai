import { useStrategyMetrics } from "../hooks/use-strategy-metrics";

interface Position {
  id: string;
  strategy: string;
  pnl: number;
  risk: number;
  reward: number;
  isWin: boolean;
}

export const StrategyMetrics = ({ positions }: { positions: Position[] | null }) => {
  // Use the custom hook to calculate metrics
  const metrics = useStrategyMetrics(positions);

  // Reusable MetricCard component
  const MetricCard = ({
    title,
    value,
    subtitle,
  }: {
    title: string;
    value: string;
    subtitle?: string;
  }) => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <span className="text-gray-400">{title}</span>
      <div className="text-2xl font-bold text-emerald-400 mt-1">{value}</div>
      {subtitle && <div className="text-sm text-gray-400">{subtitle}</div>}
    </div>
  );

  return (
    <section className="grid grid-cols-4 gap-6">
      <MetricCard
        title="Best Strategy"
        value={metrics.bestStrategy}
        subtitle={`${metrics.winRate} Win Rate`}
      />
      <MetricCard
        title="Avg R:R Ratio"
        value={metrics.avgRRRatio}
        subtitle="+/- vs Last Month" // Replace with actual comparison logic if available
      />
      <MetricCard
        title="Consistency Score"
        value={`${metrics.consistencyScore}/10`}
        subtitle={
          parseFloat(metrics.consistencyScore) > 7
            ? "High Consistency"
            : "Low Consistency"
        }
      />
      <MetricCard
        title="Strategy Health"
        value={metrics.strategyHealth}
        subtitle={
          metrics.strategyHealth === "Strong"
            ? "All Metrics Positive"
            : "Needs Improvement"
        }
      />
    </section>
  );
};
