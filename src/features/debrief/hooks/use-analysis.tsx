import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface Analysis {
  what_went_well: string[],
  areas_for_improvement: string[],
  strategy_recommendations: { 
    title:string; 
    description:string; 
    predicted_win_rate_increase:string;
  }[],
  behavior_insights: { 
    title:string; 
    description:string; 
    recommendation:string;
  }[]
}

export const useAnalysis = () => {
  const [analysis, setAnalysis] = useState<Analysis>();

  const fetchAnalysis = async () => {
    const today = new Date().toISOString().split('T')[0];

    const { data, error: fetchError } = await supabase
      .from('trade_analysis').select(`analysis`)
      .eq('entry_date', today);

    if (fetchError) throw new Error(fetchError.message);
    if (!data) throw new Error('No data received from database');

    setAnalysis(data[0].analysis);
  }

  useEffect(() => {
    fetchAnalysis();
  }, []);

  return { analysis };
};