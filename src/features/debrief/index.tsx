
import {
  Target,
  Save,
  History,
  ArrowRight
} from 'lucide-react';
import { PerformanceOverview } from './components/PerformanceOverview';
import { useDebrief } from './hooks/use-debrief';
import { SessionPerformance } from './components/SessionPerformance';
import { SessionTrades } from './components/SessionTrades';
import { BehavioralTrends } from './components/BehavioralTrends';
import { AiAnalysis } from './components/AiAnalysis';
import { StrategyAdjustments } from './components/StrategyAdjustments';
import { useAnalysis } from './hooks/use-analysis';
export const Debrief = () => {
  const { positions, isLoading, error } = useDebrief();
  const { analysis } = useAnalysis();
  const mappedOverviewPositions = positions?.map(({ risk, reward, outcome }) => ({ risk, reward, outcome }));
  const mappedSessionPositions = positions?.map(({ time, pnl }) => ({ time, pnl }));

  return (
    <div className="space-y-4">
      {/* Performance Overview */}
      <PerformanceOverview positions={mappedOverviewPositions} />

      {/* Performance Chart and AI Analysis */}

      <div className="grid grid-cols-2 gap-4">
        <SessionPerformance
          positions={mappedSessionPositions}
          isLoading={isLoading}
        />

        <AiAnalysis areas_for_improvement={analysis?.areas_for_improvement} what_went_well={analysis?.what_went_well} />
      </div>

      {/* Trade List */}
      <SessionTrades positions={positions} />

      {/* Behavioral Trends and Strategy Adjustments */}
      <div className="grid grid-cols-2 gap-6">
        <BehavioralTrends
          positions={positions}
          isLoading={isLoading}
          className=""
        />

        <StrategyAdjustments strategy_recommendations={analysis?.strategy_recommendations} />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-6">
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