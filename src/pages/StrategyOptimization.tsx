import { useState } from 'react';
import { 
  Settings,
  Target,
  Zap,
  Brain,
  BarChart as BarChartIcon,
  PieChart,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  PlayCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  Legend
} from 'recharts';

// Mock data for strategy performance
const strategyData = [
  { name: 'Breakouts', winRate: 68, trades: 45 },
  { name: 'Pullbacks', winRate: 72, trades: 38 },
  { name: 'Reversals', winRate: 58, trades: 25 },
  { name: 'Range', winRate: 65, trades: 30 }
];

// Mock data for risk/reward scatter plot
const riskRewardData = [
  { risk: 1.2, reward: 2.4, success: true, value: 500 },
  { risk: 0.8, reward: 1.6, success: true, value: 300 },
  { risk: 1.5, reward: 1.2, success: false, value: -400 },
  { risk: 1.0, reward: 2.8, success: true, value: 600 },
  { risk: 2.0, reward: 1.5, success: false, value: -800 },
  { risk: 0.5, reward: 1.8, success: true, value: 250 },
  { risk: 1.3, reward: 2.2, success: true, value: 450 },
  { risk: 1.7, reward: 1.4, success: false, value: -600 }
];

// Mock data for risk distribution pie chart
const riskDistributionData = [
  { name: 'Low Risk (0.5-1%)', value: 40, color: '#10B981' },
  { name: 'Medium Risk (1-1.5%)', value: 35, color: '#3B82F6' },
  { name: 'High Risk (1.5-2%)', value: 25, color: '#EF4444' }
];

export const StrategyOptimizationPage = () => {
  const [showBacktestModal, setShowBacktestModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Strategy Overview Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <span className="text-gray-400">Best Strategy</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">Pullbacks</div>
          <div className="text-sm text-gray-400">72% Win Rate</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <span className="text-gray-400">Avg R:R Ratio</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">1:2.1</div>
          <div className="text-sm text-gray-400">+0.3 vs Last Month</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <span className="text-gray-400">Consistency Score</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">8.5/10</div>
          <div className="text-sm text-gray-400">High Consistency</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <span className="text-gray-400">Strategy Health</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">Strong</div>
          <div className="text-sm text-gray-400">All Metrics Positive</div>
        </div>
      </div>

      {/* Strategy Performance Analysis */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BarChartIcon className="text-blue-400" />
            Strategy Win Rates
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={strategyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                  }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Bar dataKey="winRate" fill="#10B981">
                  {strategyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={entry.winRate > 65 ? '#10B981' : '#F59E0B'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Brain className="text-purple-400" />
            AI Recommendations
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-emerald-400 w-5 h-5" />
                <h3 className="font-medium">Pullback Strategy Optimization</h3>
              </div>
              <p className="text-gray-300 mb-2">
                Increase position size on pullback trades by 25% while maintaining same risk percentage.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-sm">
                  +15% Potential Return
                </span>
              </div>
            </div>

            <div className="p-4 bg-gray-900/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="text-amber-400 w-5 h-5" />
                <h3 className="font-medium">Breakout False Signal Filter</h3>
              </div>
              <p className="text-gray-300 mb-2">
                Add volume confirmation to breakout strategy to reduce false signals.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-sm">
                  -40% False Breakouts
                </span>
              </div>
            </div>

            <div className="p-4 bg-gray-900/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="text-blue-400 w-5 h-5" />
                <h3 className="font-medium">Risk Management Update</h3>
              </div>
              <p className="text-gray-300 mb-2">
                Implement scaled exit strategy for trades exceeding 2R profit.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-sm">
                  +20% Profit Retention
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Analysis Section */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="text-red-400" />
            Risk vs Reward Analysis
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  type="number" 
                  dataKey="risk" 
                  name="Risk" 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                  domain={[0, 2.5]}
                />
                <YAxis 
                  type="number" 
                  dataKey="reward" 
                  name="Reward" 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                  domain={[0, 3]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                  }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Scatter name="Trades" data={riskRewardData}>
                  {riskRewardData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={entry.success ? '#10B981' : '#EF4444'}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <PieChart className="text-blue-400" />
            Risk Distribution
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                  }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => (
                    <span className="text-gray-300">{value}</span>
                  )}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-6">
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium">
          <Settings className="w-5 h-5" />
          Apply Strategy Changes
        </button>
        <button 
          onClick={() => setShowBacktestModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
        >
          <PlayCircle className="w-5 h-5" />
          Backtest Changes
        </button>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium group">
          View Full Analysis
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Backtest Modal */}
      {showBacktestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-lg w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Backtest Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Timeframe
                </label>
                <select className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500">
                  <option value="1m">Last Month</option>
                  <option value="3m">Last 3 Months</option>
                  <option value="6m">Last 6 Months</option>
                  <option value="1y">Last Year</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Market Conditions
                </label>
                <select className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500">
                  <option value="all">All Conditions</option>
                  <option value="trending">Trending Only</option>
                  <option value="ranging">Ranging Only</option>
                  <option value="volatile">High Volatility</option>
                </select>
              </div>
              <div className="flex gap-4 mt-6">
                <button 
                  onClick={() => setShowBacktestModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg">
                  Start Backtest
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}