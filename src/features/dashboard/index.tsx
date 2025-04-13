import { Link } from 'react-router-dom';
import { PerformanceOverview } from './components/PerformanceOverview';
import { PerformanceChart } from './components/PerformanceChart';
import { StrategyPerformance } from './components/StrategyPerformance';
import { AiInsights } from './components/AiInsights';
import { RecentTrades } from './components/RecentTrades';
import { ClipboardList, PlusCircle } from 'lucide-react';

export const Dashboard = () => {
  return (
    <div className="space-y-4">
      {/* Performance Overview Cards */}
      <PerformanceOverview />

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Performance Chart */}
        <PerformanceChart />

        {/* Strategy Performance */}
        <StrategyPerformance />
      </div>

      {/* AI Insights and Recent Trades */}
      <div className="grid grid-cols-2 gap-6">
        {/* AI Insights */}
        <AiInsights />

        {/* Recent Trades */}
        <RecentTrades />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-6">
        <Link
          to="/trade-entry"
          className="bg-emerald-600 hover:bg-emerald-700 p-4 rounded-lg text-white font-medium flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Add New Trade
        </Link>
        <Link
          to="/debrief"
          className="bg-blue-600 hover:bg-blue-700 p-4 rounded-lg text-white font-medium flex items-center justify-center gap-2"
        >
          <ClipboardList className="w-5 h-5" />
          Start Debrief
        </Link>
      </div>
    </div>
  );
}