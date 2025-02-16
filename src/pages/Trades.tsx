
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { TradesDataTable } from "@/components/trades/TradesDataTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Trades = () => {
  const [selectedAccount, setSelectedAccount] = useState<string>("all");

  const { data: tradingAccounts } = useQuery({
    queryKey: ["tradingAccounts"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("trading_accounts")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      return data;
    },
  });

  const { data: trades, isLoading } = useQuery({
    queryKey: ["trades", selectedAccount],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let query = supabase
        .from("trade_history")
        .select(`
          *,
          trading_accounts (
            account_name
          )
        `)
        .eq("user_id", user.id)
        .order("entry_date", { ascending: false });

      if (selectedAccount !== "all") {
        query = query.eq("trading_account_id", selectedAccount);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: true,
  });

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Trade History</h1>
      <div className="space-y-6">
        <Card className="p-6">
          <TradesDataTable 
            trades={trades || []} 
            isLoading={isLoading}
            tradingAccounts={tradingAccounts || []}
            selectedAccount={selectedAccount}
            onAccountChange={setSelectedAccount}
          />
        </Card>
      </div>
    </div>
  );
};

export default Trades;
