
import { DetectedBehaviorPatterns } from './components/DetectedBehaviorPatterns';
import { useTrades } from './hooks/use-trades';
import { AiSummary } from './components/AiSummary';
import { useAnalysis } from './hooks/use-analysis';
import { Insights } from './components/Insights';
import { WinRate } from './components/WinRate';
import { RiskReward } from './components/RiskReward';
import { TradeReview } from './components/TradeReview';
import { BehaviorChart } from './components/BehaviorChart';
import { useEffect, useState } from 'react';
import { NoDataModal } from '@/components/NoDataModal';
import { TradeList } from './components/TradeList';

export const Behavior = () => {
  const [showModal, setShowModal] = useState(false);
  const { trades, isLoading: tradesLoading } = useTrades();
  const { insights } = useAnalysis();

  useEffect(() => {
    if (tradesLoading) return; // Don't run until data is done loading
  
    if (!trades || trades.length === 0) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [trades, tradesLoading]);

  // Transform trades to match the expected interface for components
  const transformedTrades = trades.map(trade => ({
    ...trade,
    entry_date: new Date(trade.entry_date), // Convert back to Date for BehaviorChart
    closing_date: new Date(trade.closing_date || trade.entry_date), // Convert back to Date
    tags: trade.tags || []
  }));

  return (
    <div className="space-y-4 animate-fade-up">
      <NoDataModal open={showModal} onClose={() => setShowModal(false)} />
      
      {/* Section 1: Behavior Summary Overview */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Key Behavior Tags */}
        <DetectedBehaviorPatterns trades={trades} />

        {/* AI Insights Summary Card */}
        <AiSummary insights={insights} />
      </section>

      {/* Emotional Patterns Overview */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WinRate trades={trades} />
        <RiskReward trades={trades} />
      </section>

      {/* Behavioral Trend Graph */}
      <section>
        <BehaviorChart trades={transformedTrades} />
      </section>

      {/* Section 3: AI-Powered Insights */}
      <section>
        <Insights insights={insights} />
      </section>

      {/* Section 4: Detailed Trade Review */}
      <section>
        
          {/* Desktop-only Component */}
      <div className="hidden lg:block">
       <TradeReview trades={trades} />
      </div>

      {/* Mobile-only Component */}
      <div className="block lg:hidden">
        <TradeList data={trades} />
      </div>
      </section>
    </div>
  );
}
