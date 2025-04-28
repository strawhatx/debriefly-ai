import { useStrategyMetrics } from "../hooks/use-strategy-metrics";
import { useMemo } from "react";

interface Position {
  id: string;
  strategy: string;
  pnl: number;
  risk: number;
  reward: number;
  isWin: boolean;
}

interface StrategyMetricsProps {
  positions: Position[] | null | undefined;
}

export const StrategyMetrics = ({ positions }: StrategyMetricsProps) => {
  const metrics = useStrategyMetrics(positions ?? []);

  const MetricCard = useMemo(
    () =>
      ({
        title,
        value,
        subtitle,
      }: {
        title: string;
        value: string | number;
        subtitle?: string;
      }) => (
        <div className="flex flex-col justify-between bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div>
            <span className="text-gray-400">{title}</span>
            <div className="text-xl font-bold text-emerald-400 mt-1">
              {value ?? "-"}
            </div>
          </div>

          {subtitle && <div className="text-sm text-gray-400 mt-2">{subtitle}</div>}
        </div>
      ),
    []
  );

  const isValidMetrics =
    metrics &&
    typeof metrics === "object" &&
    metrics.bestStrategy &&
    metrics.strategyHealth;

  if (!isValidMetrics) {
    return (
      <div className="text-gray-400 italic p-4">
        No strategy metrics available.
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Best Strategy"
        value={metrics.bestStrategy}
        subtitle={`${metrics.winRate ?? 0}% Win Rate`}
      />
      <MetricCard
        title="Avg R:R Ratio"
        value={metrics.avgRRRatio ?? "-"}
        subtitle="+/- vs Last Month"
      />
      <MetricCard
        title="Consistency Score"
        value={`${metrics.consistencyScore ?? 0}/10`}
        subtitle={
          parseFloat(metrics.consistencyScore ?? "0") > 7
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
