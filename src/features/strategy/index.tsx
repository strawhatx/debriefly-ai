import { useState } from 'react';
import {
    Settings,
    PieChart,
    ArrowRight,
    PlayCircle
} from 'lucide-react';
import {
    Tooltip,
    ResponsiveContainer,
    Cell,
    Pie,
    PieChart as RechartsPieChart,
    Legend
} from 'recharts';
import { StrategyMetrics } from './components/StrategyMetrics';
import { WinRate } from './components/WinRate';
import { RiskReward } from './components/RiskReward';
import { StrategyAdjustments } from '@/components/StrategyAdjustments';
import { RiskRewardAnalysis } from './components/RiskRewardAnalysis';
import { useTrades } from './hooks/use-trades';
import { useAnalysis } from './hooks/use-analysis';

// Mock data for risk distribution pie chart
const riskDistributionData = [
    { name: 'Low Risk (0.5-1%)', value: 40, color: '#10B981' },
    { name: 'Medium Risk (1-1.5%)', value: 35, color: '#3B82F6' },
    { name: 'High Risk (1.5-2%)', value: 25, color: '#EF4444' }
];

export const Strategy = () => {
    const [showBacktestModal, setShowBacktestModal] = useState(false);

    const { trades } = useTrades();
      const { recommendations } = useAnalysis();

    return (
        <div className="space-y-6">
            {/* Strategy Overview Cards */}
            <StrategyMetrics positions={trades} />

            {/* Strategy Patterns Overview */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <WinRate trades={trades} />
                <RiskReward trades={trades} />
            </section>


            {/* Risk Analysis Section */}
            <div className="grid grid-cols-2 gap-6">
                {/* Risk vs Reward Analysis */} 
                <RiskRewardAnalysis trades={trades} />

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
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

            {/* AI Recommendations Secti                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     on */}
            <section>
                <StrategyAdjustments strategy_recommendations={recommendations} />
            </section>

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
                        <h3 className="text-lg font-semibold mb-4">Backtest Configuration</h3>
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