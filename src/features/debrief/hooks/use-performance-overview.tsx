import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { calculateStats } from "../utils/calculate-stats";
import { Calculator, Radical, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Define strict types for our data structures
interface Position {
  risk: number;
  reward: number;
  outcome: 'WIN' | 'LOSS';
}

interface PositionStats {
  totalTrades: number;
  profitFactor: number;
  averageRR: number;
  totalTradesChange: number;
  profitFactorChange: number;
  rrChange: number;
}

export interface StatCard {
  title: string;
  value: string;
  icon: LucideIcon;
  trend: string;
  trendUp: boolean;
}

interface PerformanceOverviewReturn {
  stats: PositionStats | null;
  isLoading: boolean;
  error: Error | null;
  statsCards: StatCard[];
}

const formatTrend = (value: number | undefined, includePercentage = true): string => {
  if (value === undefined) return '0';
  const prefix = value >= 0 ? '+' : '';
  return `${prefix}${value}${includePercentage ? '%' : ''}`;
};

export const usePerformanceOverview = (): PerformanceOverviewReturn => {
  const [stats, setStats] = useState<PositionStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTodayStats = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        const { data, error: fetchError } = await supabase
          .from('positions')
          .select('pnl, journal_entries(risk, reward)')
          .eq('date', today);

        if (fetchError) throw new Error(fetchError.message);
        if (!data) throw new Error('No data received from database');

        const positions: Position[] = data.map((position) => ({
          risk: position.journal_entries.risk,
          reward: position.journal_entries.reward,
          outcome: position.pnl > 0 ? 'WIN' : 'LOSS',
        }));

        const calculatedStats = calculateStats(positions);
        setStats(calculatedStats);
        setError(null);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setStats(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodayStats();
  }, []);

  const statsCards: StatCard[] = [
    {
      title: "Total Trades",
      value: stats?.totalTrades.toString() ?? "0",
      icon: Calculator,
      trend: formatTrend(stats?.totalTradesChange),
      trendUp: (stats?.totalTradesChange ?? 0) >= 0,
    },
    {
      title: "Profit Factor",
      value: stats?.profitFactor.toFixed(2) ?? "0",
      icon: Radical,
      trend: formatTrend(stats?.profitFactorChange, false),
      trendUp: (stats?.profitFactorChange ?? 0) >= 0,
    },
    {
      title: "Average R:R Ratio",
      value: `1:${stats?.averageRR.toFixed(2) ?? "0"}`,
      icon: TrendingUp,
      trend: formatTrend(stats?.rrChange),
      trendUp: (stats?.rrChange ?? 0) >= 0,
    },
  ];

  return { stats, isLoading, error, statsCards };
};
