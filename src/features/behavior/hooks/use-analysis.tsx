
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useDateStore } from "@/store/date";
import useTradingAccountStore from "@/store/trading-account";

export interface BehaviorInsight {
  title: string;
  description: string;
  recommendation: string;
  count?: number;
}

export const useAnalysis = () => {
  const [insights, setInsights] = useState<BehaviorInsight[]>([]);
  const selectedAccount = useTradingAccountStore((state) => state.selected);
  const days = useDateStore((state) => state.days);

  const fetchAnalysis = useCallback(async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("Authentication error:", userError);
      return;
    }

    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() - days);

    let query = supabase
      .from("trade_analysis")
      .select("analysis")
      .gte("session_date", endDate.toISOString())
      .lte("session_date", today.toISOString());

    if (selectedAccount) {
      query = query.eq("trading_account_id", selectedAccount);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching trade analysis:", error);
      return;
    }

    if (!data || data.length === 0) {
      setInsights([]);
      return;
    }

    const insightMap: Record<string, BehaviorInsight & { count: number }> = {};

    for (const entry of data) {
      // Type assertion for JSON data
      const analysis = entry.analysis as any;
      const insightsArray = analysis?.behavior_insights || [];
      
      for (const insight of insightsArray) {
        const key = insight.title;
        if (!insightMap[key]) {
          insightMap[key] = { ...insight, count: 0 };
        }
        insightMap[key].count += 1;
      }
    }

    const topInsights = Object.values(insightMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setInsights(topInsights);
  }, [days, selectedAccount]);

  useEffect(() => {
    fetchAnalysis();
  }, [fetchAnalysis]);

  return { insights };
};
