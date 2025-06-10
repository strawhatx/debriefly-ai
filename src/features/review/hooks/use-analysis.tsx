import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import useTradingAccountStore from "@/store/trading-account";
import { useState } from "react";
import { fetchWithAuth } from "@/utils/api";

export const useAnalysis = () => {
  const [hasUnanalyzedTrades, setHasUnanalyzedTrades] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const selectedAccount = useTradingAccountStore((state) => state.selected);

  const runTradeAnalysis = async () => {
    try {
      setIsLoading(true);
      toast({
        title: "Running Analysis",
        description: "Please wait while the analysis is running...",
        variant: "default",
      });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to run analysis",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      await fetchWithAuth("/ai-analysis", {
        method: "POST",
        body: JSON.stringify({ user_id: user.id, trading_account_id: selectedAccount }),
      });

      toast({
        title: "Success",
        description: "Analysis completed successfully!",
        variant: "success",
      });

      await checkForUnanalyzedTrades();

    } catch (error) {
      console.error("❌ Error:", error);
      toast({
        title: "Error",
        description: "Failed to run analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkForUnanalyzedTrades = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .rpc('get_unanalyzed_positions', {
          user_id_param: user.id,
          trading_account_id_param: selectedAccount // Fixed typo
        });

      if (error) throw error;
      setHasUnanalyzedTrades(data && data.length > 0);
    } catch (error) {
      console.error("Error checking for unanalyzed trades:", error);
    }
  };

  return {
    hasUnanalyzedTrades,
    isLoading,
    runTradeAnalysis,
    checkForUnanalyzedTrades
  }
};
