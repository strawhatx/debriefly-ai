import { 
  LineChart, 
  TrendingUp, 
  ArrowUpRight,
  Settings,
  Target,
  Zap
} from 'lucide-react';

export const StrategyOptimization = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Strategy Optimization</h1>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg">
            <Settings className="w-4 h-4" />
            Apply Changes
          </button>
        </div>
      </div>

      {/* Performance Metrics */}
      <section className="grid grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <span className="text-gray-400">Win Rate</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-semibold">65%</span>
            <ArrowUpRight className="text-emerald-400 w-4 h-4" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <span className="text-gray-400">Profit Factor</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-semibold">1.8</span>
            <ArrowUpRight className="text-emerald-400 w-4 h-4" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <span className="text-gray-400">Avg RR Ratio</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-semibold">1:2.5</span>
            <ArrowUpRight className="text-emerald-400 w-4 h-4" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <span className="text-gray-400">Sharpe Ratio</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-semibold">2.1</span>
            <ArrowUpRight className="text-emerald-400 w-4 h-4" />
          </div>
        </div>
      </section>

      {/* Strategy Analysis */}
      <section className="grid grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <LineChart className="text-blue-400" />
            Strategy Performance
          </h2>
          <div className="h-64 bg-gray-900/50 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Performance Chart Placeholder</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="text-purple-400" />
            Optimization Suggestions
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="text-amber-400 w-4 h-4" />
                <h3 className="font-medium">Entry Optimization</h3>
              </div>
              <p className="text-gray-400">Adjust pullback entry criteria by waiting for confirmation candle</p>
              <div className="mt-2 flex gap-2">
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-sm">+12% Win Rate</span>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-sm">-5% Drawdown</span>
              </div>
            </div>
            
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="text-amber-400 w-4 h-4" />
                <h3 className="font-medium">Stop Loss Placement</h3>
              </div>
              <p className="text-gray-400">Increase stop loss distance by 0.5% on breakout trades</p>
              <div className="mt-2 flex gap-2">
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-sm">+8% Win Rate</span>
                <span className="px-2 py-1 bg-amber-500/20 text-amber-300 rounded text-sm">+3% Risk</span>
              </div>
            </div>

            <div className="p-4 bg-gray-900/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="text-amber-400 w-4 h-4" />
                <h3 className="font-medium">Take Profit Strategy</h3>
              </div>
              <p className="text-gray-400">Implement scaled exit strategy at key resistance levels</p>
              <div className="mt-2 flex gap-2">
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-sm">+15% Profit</span>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-sm">Better R:R</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}