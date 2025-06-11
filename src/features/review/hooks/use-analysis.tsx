import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import useTradingAccountStore from "@/store/trading-account";
import { useState } from "react";

export const useAnalysis = () => {
    const [hasUnanalyzedTrades, setHasUnanalyzedTrades] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // State to track loading
    const selectedAccount = useTradingAccountStore((state) => state.selected);

    const runTradeAnalysis = async () => {
        try {
          setIsLoading(true); // Start the loader
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
            setIsLoading(false); // Stop the loader
            return;
          }
    
          const API_URL = `${import.meta.env.VITE_SUPABASE_API}/ai-analysis`;
          const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: user.id, trading_account_id: selectedAccount }),
          });
    
          if (!response.ok) {
            throw new Error("Failed to run analysis");
          }
    
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
          setIsLoading(false); // Stop the loader
        }
      };
    
      const checkForUnanalyzedTrades = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;
    
          const { data, error } = await supabase
            .rpc('get_unanalyzed_positions', { 
                user_id_param: user.id, trading_account_id_param: selectedAccount 
            });
    
          if (error) throw error;
          setHasUnanalyzedTrades(data && data.length > 0);
        } catch (error) {
          console.error("Error checking for unanalyzed trades:", error);
        }
      };

  return {
    hasUnanalyzedTrades,
    isLoading, // Expose the loading state
    runTradeAnalysis,
    checkForUnanalyzedTrades
  }
};
