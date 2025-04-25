
import {
  Save,
  History,
  ArrowRight
} from 'lucide-react';
import { PerformanceOverview } from './components/PerformanceOverview';
import { useDebrief } from './hooks/use-debrief';
import { SessionPerformance } from './components/SessionPerformance';
import { SessionTrades } from './components/SessionTrades';
import { AiAnalysis } from './components/AiAnalysis';
import { StrategyAdjustments } from '../../components/StrategyAdjustments';
import { useAnalysis } from './hooks/use-analysis';
import { useEffect, useState } from 'react';
import { useDateStore } from '@/store/date';
import { NoDataModal } from '@/components/NoDataModal';
import { TradeList } from './components/TradeList';

interface OverviewPosition {
  risk: number;
  reward: number;
  outcome: "WIN" | "LOSS";
}

interface SessionPosition {
  time: string;
  pnl: number;
}

export const Debrief = () => {
  const [showModal, setShowModal] = useState(false);
  const [mappedOverviewPositions, setMappedOverviewPositions] = useState<OverviewPosition[] | null>();
  const [mappedSessionPositions, setMappedSessionPositions] = useState<SessionPosition[] | null>();

  const { positions, isLoading: positionsLoading, setDay: setDebriefDate } = useDebrief();
  const { analysis, setDay: setAnalysisDate } = useAnalysis();
  const date = useDateStore((state) => state.date);

  useEffect(() => {
    if (date) {
      setDebriefDate(date);
      setAnalysisDate(date);
    }
  }, [date]);


  useEffect(() => {
    // Perform any side effects or data fetching here
    if (positions) {
      const overviewPositions = positions.map(({ risk, reward, outcome }) => ({
        risk,
        reward,
        outcome,
      }));
      const sessionPositions = positions.map(({ time, pnl }) => ({
        time,
        pnl,
      }));

      setMappedOverviewPositions(overviewPositions);
      setMappedSessionPositions(sessionPositions);
    }
  }, [positions, date]);

  useEffect(() => {
    if (positionsLoading) return; // Don't run until data is done loading
  
    if (!positions || positions.length === 0) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [positions, positionsLoading]);


  return (
    <div className="space-y-4">
      <NoDataModal open={showModal} onClose={() => setShowModal(false)} />
      
      {/* Performance Overview */}
      <PerformanceOverview positions={mappedOverviewPositions} />

      {/* Performance Chart and AI Analysis */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SessionPerformance
          positions={mappedSessionPositions}
          isLoading={positionsLoading}
        />

        <AiAnalysis areas_for_improvement={analysis?.areas_for_improvement} what_went_well={analysis?.what_went_well} />
      </div>

      {/* Trade List */}
      
      {/* Desktop-only Component */}
      <div className="hidden lg:block">
        <SessionTrades positions={positions} />
      </div>

      {/* Mobile-only Component */}
      <div className="block lg:hidden">
        <TradeList data={positions} />
      </div>

      {/* Strategy Adjustments */}
      <StrategyAdjustments strategy_recommendations={analysis?.strategy_recommendations} />
    </div>
  );
}