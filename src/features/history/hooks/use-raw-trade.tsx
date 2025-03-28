import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface RawTrade {
  account_name: string;
  symbol: string;
  order_type: string;
  side: string;
  fill_price: number;
  stop_price: number;
  quantity: number;
  entry_date: string;
  closing_date: string;
  fees: number;
  order_id: string;
  status: string;
  leverage: number;
}

export const useRawTrade = (positionId: string | null) => {
  const [data, setData] = useState<RawTrade[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchRawTrade = async () => {
    if (!positionId) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase.rpc("get_position_history", {pos_id: positionId});

      if (error) throw error;
      setData(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch raw trade data'));
      console.error('Error fetching raw trade:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRawTrade();
  }, [positionId]);

  return { data, isLoading, error };
}; 