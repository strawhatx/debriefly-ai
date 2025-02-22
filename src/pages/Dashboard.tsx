
import { Card } from "@/components/ui/card";
import TradingAccountsOverview from "@/components/dashboard/TradingAccountsOverview";
import { TradingCalendar } from "@/components/dashboard/TradingCalendar";
import WinLossInsights from "@/components/dashboard/WinLossInsights";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Import, LineChart, ThumbsUp, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6 bg-background/60 backdrop-blur-sm sticky top-0 z-10 -mt-6 py-4 px-6 border-b">
        <h1 className="text-2xl font-semibold">Trading Dashboard</h1>
        <div className="flex items-center gap-3">
          <Select value={selectedAccount} onValueChange={setSelectedAccount}>
            <SelectTrigger className="w-[200px] h-9 text-sm">
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
          <Button
            size="sm"
            className="gap-2 text-sm h-9"
            onClick={() => navigate("/app/trade-entry")}
          >
            <Import className="w-3.5 h-3.5" />
            Import Trades
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <TradingAccountsOverview />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="p-6 col-span-2">
          <TradingCalendar />
        </Card>

        <div className="col-span-1 grid grid-rows-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <LineChart className="text-purple-400" />
              Emotion Analysis
            </h2>
            <div className="h-32 bg-gray-900/50 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Emotion Chart Placeholder</span>
            </div>
            <div className="mt-4 flex gap-2 flex-wrap">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                Calm Trading
              </span>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-sm">
                Minor Hesitation
              </span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="text-blue-400" />
              Strategy Performance
            </h2>
            <div className="h-32 bg-gray-900/50 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Strategy Chart Placeholder</span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <ThumbsUp className="w-4 h-4 text-emerald-400" />
                <span>Strong execution on breakout trades</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Consider tighter stops on pullback entries</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
