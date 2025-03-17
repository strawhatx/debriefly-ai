
import React, { useState } from 'react';
import { 
  Brain, 
  Calendar, 
  TrendingDown, 
  AlertTriangle,
  Activity,
  Clock,
  BarChart2,
  LineChart as LineChartIcon,
  ChevronRight,
  ArrowUpRight,
  Filter,
  ThumbsUp,
  Lock
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { Link } from 'react-router-dom';

// Sample data for trend graphs
const behaviorTrendData = [
  { date: 'Mon', FOMO: 5, Hesitation: 3, Revenge: 2, Calm: 8 },
  { date: 'Tue', FOMO: 3, Hesitation: 2, Revenge: 1, Calm: 7 },
  { date: 'Wed', FOMO: 2, Hesitation: 4, Revenge: 1, Calm: 6 },
  { date: 'Thu', FOMO: 4, Hesitation: 2, Revenge: 3, Calm: 5 },
  { date: 'Fri', FOMO: 6, Hesitation: 3, Revenge: 4, Calm: 4 },
  { date: 'Sat', FOMO: 4, Hesitation: 2, Revenge: 2, Calm: 8 },
  { date: 'Sun', FOMO: 2, Hesitation: 1, Revenge: 1, Calm: 9 },
];

const performanceData = [
  { name: 'Calm', winRate: 72, avgRR: 2.1, color: '#10b981' },
  { name: 'FOMO', winRate: 45, avgRR: 1.2, color: '#f59e0b' },
  { name: 'Hesitation', winRate: 51, avgRR: 0.9, color: '#3b82f6' },
  { name: 'Revenge', winRate: 28, avgRR: 0.6, color: '#ef4444' },
];

// Sample trade data
const tradeData = [
  { 
    id: 1, 
    date: '2024-06-14', 
    asset: 'BTC/USD', 
    side: 'Long', 
    entry: 65000, 
    exit: 66500, 
    pnl: 1500, 
    behavior: 'Calm' 
  },
  { 
    id: 2, 
    date: '2024-06-14', 
    asset: 'ETH/USD', 
    side: 'Short', 
    entry: 3200, 
    exit: 3150, 
    pnl: 50, 
    behavior: 'FOMO' 
  },
  { 
    id: 3, 
    date: '2024-06-13', 
    asset: 'BTC/USD', 
    side: 'Long', 
    entry: 64500, 
    exit: 64000, 
    pnl: -500, 
    behavior: 'Revenge' 
  },
  { 
    id: 4, 
    date: '2024-06-12', 
    asset: 'SOL/USD', 
    side: 'Long', 
    entry: 145, 
    exit: 152, 
    pnl: 700, 
    behavior: 'Hesitation' 
  },
];

export const BehaviorialPatternsPage = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedBehavior, setSelectedBehavior] = useState<string | null>(null);
  
  // Filter trades by selected behavior
  const filteredTrades = selectedBehavior 
    ? tradeData.filter(trade => trade.behavior === selectedBehavior)
    : tradeData;

  return (
    <div className="p-6 space-y-6 animate-fade-up">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Behavior Analysis</h1>
          <p className="text-muted-foreground">Analyze emotional patterns that impact your trading decisions</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
        </div>
      </div>

      {/* Section 1: Behavior Summary Overview */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Key Behavior Tags */}
        <Card className="bg-gray-800 border border-gray-700 p-6 col-span-2">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Brain className="text-purple-400" />
            Detected Behavior Patterns
          </h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Badge className="py-2 px-3 bg-red-900/50 text-red-400 border border-red-500/50 hover:bg-red-900/70">
                🚨 Overtrading (24%)
              </Badge>
              <Badge className="py-2 px-3 bg-amber-900/50 text-amber-400 border border-amber-500/50 hover:bg-amber-900/70">
                ⚠️ Hesitation (18%)
              </Badge>
              <Badge className="py-2 px-3 bg-emerald-900/50 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-900/70">
                ✅ Patience Improved (32%)
              </Badge>
              <Badge className="py-2 px-3 bg-blue-900/50 text-blue-400 border border-blue-500/50 hover:bg-blue-900/70">
                🔄 Early Exits (15%)
              </Badge>
              <Badge className="py-2 px-3 bg-purple-900/50 text-purple-400 border border-purple-500/50 hover:bg-purple-900/70">
                🤔 Analysis Paralysis (11%)
              </Badge>
            </div>
            
            <div className="p-4 bg-gray-900/70 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Emotional Control Score</span>
                <span className="text-lg font-bold text-emerald-400">7.2/10</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full">
                <div className="h-full w-[72%] bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full"></div>
              </div>
              <p className="text-xs text-gray-400 mt-2">Score based on your last 50 trades. Showing improvement from last month's 6.4/10.</p>
            </div>
          </div>
        </Card>

        {/* AI Insights Summary Card */}
        <Card className="bg-gray-800 border border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="text-blue-400" />
            AI Quick Insights
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-900/70 rounded-lg">
              <p className="text-sm text-gray-300">
                <span className="block font-medium text-white mb-1">Patience is improving</span>
                Your ability to wait for better entries has increased by 32% this month, resulting in better R:R ratios.
              </p>
            </div>
            <div className="p-4 bg-gray-900/70 rounded-lg">
              <p className="text-sm text-gray-300">
                <span className="block font-medium text-white mb-1">Emotional trigger: Market volatility</span>
                You tend to overtrade during high volatility periods. Consider limiting trade frequency during market extremes.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Section 2: Behavioral Trend Graph */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <LineChartIcon className="text-blue-400" />
            Behavior Frequency Over Time
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={behaviorTrendData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                  labelStyle={{ color: '#f9fafb' }}
                />
                <Legend />
                <Line type="monotone" dataKey="FOMO" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="Hesitation" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="Revenge" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="Calm" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="bg-gray-800 border border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BarChart2 className="text-emerald-400" />
            Behavior Performance Impact
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={performanceData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                  labelStyle={{ color: '#f9fafb' }}
                />
                <Legend />
                <Bar dataKey="winRate" name="Win Rate %" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgRR" name="Avg R:R Ratio" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      {/* Section 3: AI-Powered Insights */}
      <section>
        <Card className="bg-gray-800 border border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Brain className="text-purple-400" />
            AI-Powered Insights & Recommendations
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-900/70 rounded-lg border-l-4 border-amber-500">
              <h3 className="text-lg font-medium mb-2">Hesitation After Losses</h3>
              <p className="text-gray-300 mb-3">
                You tend to hesitate after experiencing a loss, missing potentially profitable re-entry opportunities. 
                This pattern has occurred in 68% of cases following a losing trade.
              </p>
              <div className="bg-gray-800/70 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-emerald-400 mb-1">Recommendation</h4>
                <p className="text-sm text-gray-300">
                  Consider developing predefined re-entry criteria that can be objectively applied regardless of emotional state.
                  Try setting alerts for key levels where you would consider re-entry to remove emotion from the decision.
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-900/70 rounded-lg border-l-4 border-emerald-500">
              <h3 className="text-lg font-medium mb-2">Improved Patience</h3>
              <p className="text-gray-300 mb-3">
                Your patience has improved significantly when trading during mid-day sessions (10 AM - 2 PM). 
                Trades placed in this period show a 72% win rate compared to 45% during opening hour.
              </p>
              <div className="bg-gray-800/70 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-emerald-400 mb-1">Recommendation</h4>
                <p className="text-sm text-gray-300">
                  Continue applying this patient approach to other trading sessions. Consider allocating more capital 
                  to trades during your most successful time periods.
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-900/70 rounded-lg border-l-4 border-red-500">
              <h3 className="text-lg font-medium mb-2">Revenge Trading</h3>
              <p className="text-gray-300 mb-3">
                After experiencing losses exceeding 2% of your account, you tend to enter "revenge trades" within 
                30 minutes. These trades have a significantly lower win rate of 28%.
              </p>
              <div className="bg-gray-800/70 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-emerald-400 mb-1">Recommendation</h4>
                <p className="text-sm text-gray-300">
                  Implement a mandatory cooling-off period of at least 1 hour after any trade with a loss exceeding 2%. 
                  Use this time to analyze the market objectively before re-entering.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Section 4: Detailed Trade Review */}
      <section>
        <Card className="bg-gray-800 border border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="text-blue-400" />
              Detailed Trade Review
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Filter by behavior:</span>
              <select 
                className="px-3 py-1 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={selectedBehavior || ''}
                onChange={(e) => setSelectedBehavior(e.target.value || null)}
              >
                <option value="">All Behaviors</option>
                <option value="Calm">Calm</option>
                <option value="FOMO">FOMO</option>
                <option value="Revenge">Revenge</option>
                <option value="Hesitation">Hesitation</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Asset</th>
                  <th className="px-4 py-3 text-left">Side</th>
                  <th className="px-4 py-3 text-left">P&L</th>
                  <th className="px-4 py-3 text-left">Behavior</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrades.map((trade) => (
                  <tr key={trade.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="px-4 py-3">{trade.date}</td>
                    <td className="px-4 py-3">{trade.asset}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center ${
                        trade.side === 'Long' ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {trade.side === 'Long' ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                        {trade.side}
                      </span>
                    </td>
                    <td className={`px-4 py-3 font-medium ${
                      trade.pnl > 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {trade.pnl > 0 ? '+' : ''}{trade.pnl}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`
                        ${trade.behavior === 'Calm' ? 'bg-emerald-900/50 text-emerald-400 border-emerald-500/50' : ''}
                        ${trade.behavior === 'FOMO' ? 'bg-amber-900/50 text-amber-400 border-amber-500/50' : ''}
                        ${trade.behavior === 'Revenge' ? 'bg-red-900/50 text-red-400 border-red-500/50' : ''}
                        ${trade.behavior === 'Hesitation' ? 'bg-blue-900/50 text-blue-400 border-blue-500/50' : ''}
                        border
                      `}>
                        {trade.behavior}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* Section 5: Call to Action */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border border-gray-700 p-6 flex flex-col items-start">
          <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
            <ThumbsUp className="text-emerald-400" />
            View Your Full Trading Session Analysis
          </h3>
          <p className="text-gray-300 mb-4">
            Get a comprehensive debrief of your recent trading sessions with deeper insights and personalized tips.
          </p>
          <Link to="/app/debrief">
            <Button className="hover-scale">
              Go to Debrief
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 flex flex-col items-start">
          <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
            <Lock className="text-purple-400" />
            Unlock Advanced Behavioral Analytics
          </h3>
          <p className="text-gray-300 mb-4">
            Upgrade to Pro for AI-powered pattern recognition, automated behavior alerts, and personalized coaching.
          </p>
          <Button variant="glow" className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover-scale">
            Upgrade to Pro
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Card>
      </section>
    </div>
  );
}
