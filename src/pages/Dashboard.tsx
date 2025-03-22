
import { Card } from "@/components/ui/card";
import TradingAccountsOverview from "@/features/dashboard/components/TradingAccountsOverview";
import { TradingCalendar } from "@/features/dashboard/components/TradingCalendar";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Import, LineChart, ThumbsUp, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SelectAccount } from "@/components/SelectAccount";

export const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">

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
