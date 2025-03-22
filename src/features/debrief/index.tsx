import React, { useState } from 'react';
import {
  Brain,
  ThumbsUp,
  AlertTriangle,
  Target,
  Save,
  History,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer
} from 'recharts';
import { PerformanceOverview } from './components/PerformanceOverview';
import { useDebrief } from './hooks/use-debrief';
import { HeaderSection } from './components/HeaderSection';
import { SessionPerformance } from './components/SessionPerformance';
import { SessionTrades } from './components/SessionTrades';
import { BehavioralTrends } from './components/BehavioralTrends';

export const Debrief = () => {
  const { positions, isLoading, error } = useDebrief();
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

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Brain className="text-purple-400" />
            AI Analysis
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <ThumbsUp className="w-4 h-4 text-emerald-400" />
                What Went Well
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-400 flex items-center justify-center mt-1">
                    <span className="text-sm text-gray-900">✓</span>
                  </div>
                  <span>Maintained consistent position sizing throughout session</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-400 flex items-center justify-center mt-1">
                    <span className="text-sm text-gray-900">✓</span>
                  </div>
                  <span>Successfully avoided revenge trading after loss</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-gray-900/50 rounded-lg">
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Areas for Improvement
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-1" />
                  <span>Consider wider stops on breakout trades</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-1" />
                  <span>Watch for FOMO entries during high volatility</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Trade List */}
      <SessionTrades positions={positions} />

      {/* Behavioral Trends and Strategy Adjustments */}
      <div className="grid grid-cols-2 gap-6">
        <BehavioralTrends
          positions={positions}
          isLoading={isLoading}
          className="mt-4"
        />

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="text-blue-400" />
            Strategy Adjustments
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <h3 className="font-medium mb-2">Risk Management</h3>
              <p className="text-gray-300 mb-2">
                Consider widening stop-losses by 5% on breakout trades to account for volatility.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-sm">
                  +12% Win Rate Potential
                </span>
              </div>
            </div>

            <div className="p-4 bg-gray-900/50 rounded-lg">
              <h3 className="font-medium mb-2">Entry Criteria</h3>
              <p className="text-gray-300 mb-2">
                Add volume confirmation to your breakout entry checklist.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-sm">
                  Reduces False Breakouts
                </span>
              </div>
            </div>

            <div className="p-4 bg-gray-900/50 rounded-lg">
              <h3 className="font-medium mb-2">Position Sizing</h3>
              <p className="text-gray-300 mb-2">
                Current position sizing is optimal. Maintain 1% risk per trade.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-sm">
                  Consistent Risk Management
                </span>
              </div>
            </div>
          </div>
        </div>
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