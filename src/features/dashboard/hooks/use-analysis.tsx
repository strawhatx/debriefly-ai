
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useDateStore } from "@/store/date";
import useTradingAccountStore from "@/store/trading-account";

export interface Recommendation {
  title: string,
  description: string,
  count?: number;
}

export const useAnalysis = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
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
      setRecommendations([]);
      return;
    }

    const recommendationMap: Record<string, Recommendation & { count: number }> = {};

    for (const entry of data) {
      // Type assertion for JSON data
      const analysis = entry.analysis as any;
      const recommendations = analysis?.strategy_recommendations || [];
      
      for (const recommendation of recommendations) {
        const key = recommendation.title;
        if (!recommendationMap[key]) {
          recommendationMap[key] = { ...recommendation, count: 0 };
        }
        recommendationMap[key].count += 1;
      }
    }

    const topRecommendations = Object.values(recommendationMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    setRecommendations(topRecommendations);
  }, [days, selectedAccount]);

  useEffect(() => {
    fetchAnalysis();
  }, [fetchAnalysis]);

  return { recommendations };
};
