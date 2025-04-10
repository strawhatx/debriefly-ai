
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
  const [mappedOverviewPositions, setMappedOverviewPositions] = useState<OverviewPosition[] | null>();
  const [mappedSessionPositions, setMappedSessionPositions] = useState<SessionPosition[] | null>();

  const { positions, isLoading, setDay: setDebriefDate } = useDebrief();
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

  return (
    <div className="space-y-4">
      {/* Performance Overview */}
      <PerformanceOverview positions={mappedOverviewPositions} />

      {/* Performance Chart and AI Analysis */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SessionPerformance
          positions={mappedSessionPositions}
          isLoading={isLoading}
        />

        <AiAnalysis areas_for_improvement={analysis?.areas_for_improvement} what_went_well={analysis?.what_went_well} />
      </div>

      {/* Trade List */}
      <SessionTrades positions={positions} />

      {/* Strategy Adjustments */}
      <StrategyAdjustments strategy_recommendations={analysis?.strategy_recommendations} />

      {/* Action Buttons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium">
          <Save className="w-5 h-5" />
          Save Debrief
        </button>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">
          <History className="w-5 h-5" />
          Compare Past Sessions
        </button>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium group">
          Set AI Coaching Goal
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}