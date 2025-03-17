import { Card } from "@/components/ui/card";
import { DollarSign, TrendingUp, LineChart, Calculator, Radical } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // Make sure this import path is correct

interface PositionStats {
  totalTrades: number;
  profitFactor: number;
  averageRR: number;
  totalTradesChange: number;
  profitFactorChange: number;
  rrChange: number;
}

export const PerformanceOverview = () => {
  const [stats, setStats] = useState<PositionStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTodayStats = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        
        // Fetch today's positions
        const { data: todayPositions, error: todayError } = await supabase
          .from('positions')
          .select('*')
          .eq('date', today);

        if (todayError) throw todayError;

        // Calculate stats
        const stats = calculateStats(todayPositions);
        setStats(stats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodayStats();
  }, []);

  const statsData = [
    {
      title: "Total Trades",
      value: stats?.totalTrades.toString() || "0",
      icon: Calculator,
      trend: `${stats?.totalTradesChange >= 0 ? '+' : ''}${stats?.totalTradesChange}%`,
      trendUp: (stats?.totalTradesChange || 0) >= 0,
    },
    {
      title: "Profit Factor",
      value: stats?.profitFactor.toFixed(2) || "0",
      icon: Radical,
      trend: `${stats?.profitFactorChange >= 0 ? '+' : ''}${stats?.profitFactorChange}`,
      trendUp: (stats?.profitFactorChange || 0) >= 0,
    },
    {
      title: "Average R:R Ratio",
      value: `1:${stats?.averageRR.toFixed(2) || "0"}`,
      icon: TrendingUp,
      trend: `${stats?.rrChange >= 0 ? '+' : ''}${stats?.rrChange}%`,
      trendUp: (stats?.rrChange || 0) >= 0,
    },
  ];

  return (
    <>
      {statsData.map((stat) => (
        <Card key={stat.title} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            <div className={`rounded-full p-2 ${stat.trendUp ? 'bg-green-100' : 'bg-red-100'}`}>
              <stat.icon className={`w-4 h-4 ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
          <div className="mt-2">
            <span className={`text-sm ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
              {stat.trend}
            </span>
            <span className="text-sm text-muted-foreground"> vs last month</span>
          </div>
        </Card>
      ))}
    </>
  );
};
