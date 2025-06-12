import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import useTradingAccountStore from "@/store/trading-account";
import { useState } from "react";

export const useAnalysis = () => {
  const [hasUnanalyzedTrades, setHasUnanalyzedTrades] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const selectedAccount = useTradingAccountStore((state) => state.selected);

  const runTradeAnalysis = async () => {
    try {
      setIsLoading(true);
      toast({
        title: "Starting Analysis",
        description: "Queuing trades for analysis...",
        variant: "default",
      });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to run analysis",
          variant: "destructive",
        });
        return;
      }

      // Get unanalyzed positions
      const { data: sessions, error: rpcError } = await supabase
        .rpc('get_unanalyzed_positions', {
          user_id_param: user.id,
          trading_account_id_param: selectedAccount
        });

      if (rpcError) {
        throw new Error(`Failed to fetch unanalyzed positions: ${rpcError.message}`);
      }

      if (!sessions || sessions.length === 0) {
        toast({
          title: "No trades to analyze",
          description: "All your trades have been analyzed.",
          variant: "default",
        });
        return;
      }

      // Create analysis jobs for each session
      const jobPromises = sessions.map(session => 
        supabase
          .from('analysis_jobs')
          .insert({
            user_id: user.id,
            trading_account_id: selectedAccount,
            session_date: session.trade_day,
            trades: session.trades,
            status: 'pending'
          })
      );

      const results = await Promise.all(jobPromises);
      const errors = results.filter(r => r.error).map(r => r.error);
      
      if (errors.length > 0) {
        throw new Error(`Failed to create some analysis jobs: ${errors.map(e => e.message).join(', ')}`);
      }

      toast({
        title: "Analysis Started",
        description: `Queued ${sessions.length} trading sessions for analysis. This may take a few minutes.`,
        variant: "success",
      });

      await checkForUnanalyzedTrades();

    } catch (error) {
      console.error("❌ Error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start analysis. Please try again.",
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
          trading_account_id_param: selectedAccount
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
