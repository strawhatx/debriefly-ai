import { supabase } from "@/integrations/supabase/client";
import useTradingAccountStore from "@/store/trading-account";
import { useEffect, useState } from "react";

interface Analysis {
  what_went_well: string[],
  areas_for_improvement: string[],
  strategy_recommendations: {
    title: string;
    description: string;
    predicted_win_rate_increase: string;
  }[],
  behavior_insights: {
    title: string;
    description: string;
    recommendation: string;
  }[]
}

export const useAnalysis = () => {
  const [analysis, setAnalysis] = useState<Analysis>();
  const [day, setDay] = useState<Date>(new Date());

  const selectedAccount = useTradingAccountStore((state) => state.selected);

  const fetchAnalysis = async () => {
    const date = day.toISOString().split('T')[0];

    var query = supabase
      .from('trade_analysis').select(`analysis`).eq('session_date', date);

    if (selectedAccount) {
      query = query.eq("trading_account_id", selectedAccount);
    }

    const { data, error } = await query;
    if (error) throw error;

    if (!data || data.length === 0) {
      setAnalysis(null);
      return;
    }

    setAnalysis(data[0].analysis);
  }

  useEffect(() => {
    fetchAnalysis();
  }, [day]);

  return { analysis, setDay, day };
};