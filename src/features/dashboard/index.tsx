import React from 'react';
import { Link } from 'react-router-dom';
import { LineChart, BarChart4, TrendingUp, AlertTriangle, ThumbsUp, ArrowUpRight, ArrowDownRight, Brain, Target, Clock, Calendar, PlusCircle, ClipboardList, ChevronRight, Bell as Cell } from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

// Mock data for performance chart
const performanceData = [
  { time: '9:30', pnl: 0 },
  { time: '10:00', pnl: 250 },
  { time: '10:30', pnl: -150 },
  { time: '11:00', pnl: 400 },
  { time: '11:30', pnl: 300 },
  { time: '12:00', pnl: 800 },
  { time: '12:30', pnl: 600 },
  { time: '13:00', pnl: 1200 }
];

// Mock data for strategy performance
const strategyData = [
  { name: 'Breakouts', winRate: 68 },
  { name: 'Pullbacks', winRate: 72 },
  { name: 'Reversals', winRate: 58 },
  { name: 'Range', winRate: 65 }
];

// Mock data for recent trades
const recentTrades = [
  {
    id: 1,
    asset: 'BTC/USD',
    type: 'Long',
    entry: 65000,
    exit: 67000,
    pnl: 2000,
    time: '12:45'
  },
  {
    id: 2,
    asset: 'ETH/USD',
    type: 'Short',
    entry: 3200,
    exit: 3150,
    pnl: 50,
    time: '11:30'
  },
  {
    id: 3,
    asset: 'BTC/USD',
    type: 'Long',
    entry: 64500,
    exit: 64000,
    pnl: -500,
    time: '10:15'
  }
];

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Trading Dashboard</h1>
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
        <div className="flex gap-4">
          <Link 
            to="/trade-entry"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg"
          >
            <PlusCircle className="w-4 h-4" />
            New Trade
          </Link>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">
            <Calendar className="w-4 h-4" />
            Mar 15, 2024
          </button>
        </div>
      </div>

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-4 gap-6">
        <Link 
          to="/history"
          className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-emerald-500/50 transition-colors"
        >
          <span className="text-gray-400">Daily P&L</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">+$1,200</div>
          <div className="flex items-center gap-1 text-sm text-emerald-400">
            <ArrowUpRight className="w-4 h-4" />
            <span>+2.4% today</span>
          </div>
        </Link>
        <Link 
          to="/strategy"
          className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-emerald-500/50 transition-colors"
        >
          <span className="text-gray-400">Win Rate</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">67%</div>
          <div className="text-sm text-gray-400">8/12 winning trades</div>
        </Link>
        <Link 
          to="/strategy"
          className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-emerald-500/50 transition-colors"
        >
          <span className="text-gray-400">Avg R:R Ratio</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">1:2.1</div>
          <div className="text-sm text-gray-400">Above target (1:1.5)</div>
        </Link>
        <Link 
          to="/behavior"
          className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-emerald-500/50 transition-colors"
        >
          <span className="text-gray-400">Emotional Score</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">8.5/10</div>
          <div className="text-sm text-emerald-400">Disciplined Trading</div>
        </Link>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Link 
          to="/history"
          className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-emerald-500/50 transition-colors"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <LineChart className="text-blue-400" />
            Today's Performance
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
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
                <Line 
                  type="monotone" 
                  dataKey="pnl" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2 }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </Link>

        {/* Strategy Performance */}
        <Link 
          to="/strategy"
          className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-emerald-500/50 transition-colors"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BarChart4 className="text-purple-400" />
            Strategy Performance
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
                <Bar dataKey="winRate" fill="#8B5CF6">
                  {strategyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={entry.winRate > 65 ? '#8B5CF6' : '#F59E0B'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Link>
      </div>

      {/* AI Insights and Recent Trades */}
      <div className="grid grid-cols-2 gap-6">
        {/* AI Insights */}
        <Link 
          to="/behavior"
          className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-emerald-500/50 transition-colors"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Brain className="text-emerald-400" />
            AI Trading Insights
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ThumbsUp className="w-5 h-5 text-emerald-400" />
                <h3 className="font-medium">Strong Performance</h3>
              </div>
              <p className="text-gray-300">
                Pullback strategy showing excellent results. Consider increasing position size while maintaining risk levels.
              </p>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-blue-400" />
                <h3 className="font-medium">Opportunity Detected</h3>
              </div>
              <p className="text-gray-300">
                Market conditions favorable for breakout trades. Watch for volume confirmation.
              </p>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="font-medium">Risk Alert</h3>
              </div>
              <p className="text-gray-300">
                Higher than usual market volatility. Consider adjusting position sizes accordingly.
              </p>
            </div>
          </div>
        </Link>

        {/* Recent Trades */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ClipboardList className="text-blue-400" />
              Recent Trades
            </h2>
            <Link 
              to="/history"
              className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentTrades.map((trade) => (
              <div key={trade.id} className="p-4 bg-gray-900/50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 ${
                      trade.type === 'Long' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {trade.type === 'Long' ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      {trade.asset}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">{trade.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">
                    {trade.entry} → {trade.exit}
                  </span>
                  <span className={`font-medium ${
                    trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {trade.pnl >= 0 ? '+' : ''}{trade.pnl}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
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