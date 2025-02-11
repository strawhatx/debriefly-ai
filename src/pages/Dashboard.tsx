
import { Card } from "@/components/ui/card";
import TradingAccountsOverview from "@/components/dashboard/TradingAccountsOverview";
import TradeCalendar from "@/components/dashboard/TradeCalendar";
import WinLossInsights from "@/components/dashboard/WinLossInsights";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Import } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const [selectedAccount, setSelectedAccount] = useState<string>("");

  const { data: tradingAccounts } = useQuery({
    queryKey: ["tradingAccounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trading_accounts")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8 bg-background/60 backdrop-blur-sm sticky top-0 z-10 -mt-8 p-8 border-b">
        <h1 className="text-4xl font-bold">Trading Dashboard</h1>
        <div className="flex items-center gap-4">
          <Select value={selectedAccount} onValueChange={setSelectedAccount}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select trading account" />
            </SelectTrigger>
            <SelectContent>
              {tradingAccounts?.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.account_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="gap-2">
            <Import className="w-4 h-4" />
            Import Trades
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <TradingAccountsOverview />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Trading Calendar</h2>
          <TradeCalendar />
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Performance Insights</h2>
          <WinLossInsights />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
