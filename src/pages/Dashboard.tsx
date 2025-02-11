
import { Card } from "@/components/ui/card";
import TradingAccountsOverview from "@/components/dashboard/TradingAccountsOverview";
import TradeCalendar from "@/components/dashboard/TradeCalendar";
import WinLossInsights from "@/components/dashboard/WinLossInsights";

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Trading Dashboard</h1>
      
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
