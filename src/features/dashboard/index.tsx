import { Link } from 'react-router-dom';
import { PerformanceOverview } from './components/PerformanceOverview';
import { PerformanceChart } from './components/PerformanceChart';
import { StrategyPerformance } from './components/StrategyPerformance';
import { AiInsights } from './components/AiInsights';
import { RecentTrades } from './components/RecentTrades';
import { ClipboardList, PlusCircle } from 'lucide-react';
import { useTrades } from './hooks/use-trades';
import { useAnalysis } from './hooks/use-analysis';
import { useEffect, useState } from 'react';
import { NoDataModal } from '@/components/NoDataModal';

export const Dashboard = () => {  
  const [showModal, setShowModal] = useState(false);
  const { trades } = useTrades();
  const { recommendations } = useAnalysis();

  useEffect(() => {
    // Example: data fetching
    // setData(fetchedData)
    if (!trades || trades.length === 0) {
      setShowModal(true);
    }
    else if (showModal) {
      setShowModal(false);
    }
  }, [trades]);

  return (
    <div className="space-y-4">
      <NoDataModal open={showModal} onClose={() => setShowModal(false)} />

      {/* Performance Overview Cards */}
      <PerformanceOverview trades={trades} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Performance Chart */}
        <PerformanceChart trades={trades} />

        {/* Strategy Performance */}
        <StrategyPerformance trades={trades} />
      </div>

      {/* AI Insights and Recent Trades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* AI Insights */}
        <AiInsights analysis={recommendations} />

        {/* Recent Trades */}
        <RecentTrades trades={trades} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/trade-entry"
          className="bg-emerald-600 hover:bg-emerald-700 p-4 rounded-lg text-white font-medium flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Add New Trade
        </Link>
        <Link to="/debrief"
          className="bg-blue-600 hover:bg-blue-700 p-4 rounded-lg text-white font-medium flex items-center justify-center gap-2"
        >
          <ClipboardList className="w-5 h-5" />
          Start Debrief
        </Link>
      </div>
    </div>
  );
}