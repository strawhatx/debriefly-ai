
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
import { DetectedBehaviorPatterns } from './components/DetectedBehaviorPatterns';
import { useTrades } from './hooks/use-trades';
import { AiSummary } from './components/AiSummary';
import { useAnalysis } from './hooks/use-analysis';
import { Insights } from './components/Insights';
import { WinRate } from './components/WinRate';
import { RiskReward } from './components/RiskReward';
import { TradeReview } from './components/TradeReview';

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


export const Behavior = () => {
  
  const { trades, isLoading, error } = useTrades();
  const { insights } = useAnalysis();

  return (
    <div className="space-y-4 animate-fade-up">
      {/* Section 1: Behavior Summary Overview */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Key Behavior Tags */}
        <DetectedBehaviorPatterns trades={trades} />

        {/* AI Insights Summary Card */}
        <AiSummary insights={insights} />
      </section>

      {/* Emotional Patterns Overview */}
      <section className="grid grid-cols-2 gap-4">
        <WinRate trades={trades} />
        <RiskReward trades={trades} />
      </section>

      {/* Behavioral Trend Graph */}
      <section>
        <Card className="bg-gray-800 border border-gray-700 p-4">
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
      </section>

      {/* Section 3: AI-Powered Insights */}
      <section>
        <Insights insights={insights} />
      </section>

      {/* Section 4: Detailed Trade Review */}
      <section>
        <TradeReview trades={trades} />
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
