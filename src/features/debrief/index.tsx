import React, { useState } from 'react';
import {
  Brain,
  ThumbsUp,
  AlertTriangle,
  Download,
  Share2,
  TrendingUp,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Filter,
  SortAsc,
  Target,
  Save,
  History,
  ArrowRight
} from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { PerformanceOverview } from './components/PerformanceOverview';
import { useDebrief } from './hooks/use-debrief';
import { HeaderSection } from './components/HeaderSection';
import { SessionPerformance } from './components/SessionPerformance';

// Mock data for trades
const trades = [
  {
    id: 1,
    time: '09:45',
    symbol: 'BTC/USD',
    type: 'Long',
    entry: 65000,
    exit: 65500,
    rr: 2.5,
    pnl: 500,
    tags: ['Disciplined', 'Planned'],
  },
  {
    id: 2,
    time: '10:15',
    symbol: 'ETH/USD',
    type: 'Short',
    entry: 3200,
    exit: 3150,
    rr: 1.2,
    pnl: -100,
    tags: ['FOMO', 'Rushed'],
  },
  {
    id: 3,
    time: '11:30',
    symbol: 'BTC/USD',
    type: 'Long',
    entry: 64800,
    exit: 65300,
    rr: 2.0,
    pnl: 800,
    tags: ['Confident', 'Planned'],
  },
];

// Mock data for behavioral trends
const behaviorData = [
  { date: 'Mon', score: 7.5 },
  { date: 'Tue', score: 8.2 },
  { date: 'Wed', score: 6.8 },
  { date: 'Thu', score: 8.5 },
  { date: 'Fri', score: 9.0 },
];

export const Debrief = () => {
  const { positions, isLoading, error } = useDebrief();
  const mappedOverviewPositions = positions?.map(({ risk, reward, outcome }) => ({ risk, reward, outcome }));
  const mappedSessionPositions = positions?.map(({ time, pnl }) => ({ time, pnl }));
  
  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <HeaderSection />

      {/* Performance Overview */}
      <PerformanceOverview positions={mappedOverviewPositions} />

      {/* Performance Chart and AI Analysis */}

      <div className="grid grid-cols-2 gap-6">
        <SessionPerformance
          positions={mappedSessionPositions}
          isLoading={isLoading}
          className="mt-4"
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
                    <span className="text-xs text-gray-900">✓</span>
                  </div>
                  <span>Maintained consistent position sizing throughout session</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-400 flex items-center justify-center mt-1">
                    <span className="text-xs text-gray-900">✓</span>
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
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Session Trades</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => toggleSort('time')}
                    className="flex items-center gap-2"
                  >
                    Time
                    <SortAsc className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">Symbol</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Entry</th>
                <th className="px-6 py-3 text-left">Exit</th>
                <th className="px-6 py-3 text-left">R:R</th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => toggleSort('pnl')}
                    className="flex items-center gap-2"
                  >
                    P&L
                    <SortAsc className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">Tags</th>
              </tr>
            </thead>
            <tbody>
              {sortedTrades.map((trade) => (
                <tr key={trade.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="px-6 py-4">{trade.time}</td>
                  <td className="px-6 py-4">{trade.symbol}</td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1 ${trade.type === 'Long' ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                      {trade.type === 'Long' ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      {trade.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">{trade.entry}</td>
                  <td className="px-6 py-4">{trade.exit}</td>
                  <td className="px-6 py-4">{trade.rr}</td>
                  <td className={`px-6 py-4 ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {trade.pnl >= 0 ? '+' : ''}{trade.pnl}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {trade.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 rounded-full text-xs ${tag === 'Disciplined' || tag === 'Planned' || tag === 'Confident'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500/20 text-amber-300'
                            }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Behavioral Trends and Strategy Adjustments */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Brain className="text-purple-400" />
            Behavioral Trends
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={behaviorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                  domain={[0, 10]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                  }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2 }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>

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