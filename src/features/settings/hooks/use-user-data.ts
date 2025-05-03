import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

// Define types for state and API responses
type TradingAccount = {
  id: string;
  account_name: string;
  account_balance: number;
  market: string;
  broker_id: string;
  broker: { id: string; name: string; };
  created_at: string;
};

type UserDataState = {
  loading: boolean;
  email: string | null;
  tradingAccounts: TradingAccount[];
  profile: any; // Replace `any` with a proper type if available
};

export const useUserData = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [state, setState] = useState<UserDataState>({
    loading: true,
    email: null,
    tradingAccounts: [],
    profile: null,
  });

  const fetchUserData = useCallback(async () => {
    try {
      // Fetch the authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw new Error("Failed to fetch user information.");

      if (!user) {
        navigate("/login");
        return;
      }

      // Fetch trading accounts for the user
      const { data: tradingAccountsData, error: accountsError } = await supabase
        .from("trading_accounts")
        .select(`
          id,
          account_name,
          account_balance,
          market,
          broker_id,
          broker: brokers ( id, name ),
          created_at
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (accountsError) throw new Error("Failed to fetch trading accounts.");

      // Update state with user data
      setState({
        loading: false,
        email: user.email,
        tradingAccounts: tradingAccountsData || [],
        profile: null, // Add profile fetching logic if needed
      });
    } catch (error: any) {
      console.error("Error fetching user data:", error.message);
      toast({
        title: "Error",
        description: error.message || "Failed to load user data.",
        variant: "destructive",
      });
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [navigate, toast]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return { ...state, fetchUserData };
};