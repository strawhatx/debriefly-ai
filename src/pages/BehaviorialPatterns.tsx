import React from 'react';
import { 
  Brain, 
  Calendar, 
  TrendingDown, 
  AlertTriangle,
  Activity,
  Clock
} from 'lucide-react';
import { Card } from '@/components/ui/card';

export const BehaviorialPatterns = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Behavior Analysis</h1>
        <div className="flex items-center gap-4">
          <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500">
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
        </div>
      </div>

      {/* Emotional Patterns Overview */}
      <section className="grid grid-cols-2 gap-6">
        <Card className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Brain className="text-purple-400" />
            Emotional Pattern Distribution
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span>Calm Trading</span>
                <span className="text-emerald-400">45%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full">
                <div className="h-full w-[45%] bg-emerald-400 rounded-full"></div>
              </div>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span>FOMO</span>
                <span className="text-amber-400">25%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full">
                <div className="h-full w-[25%] bg-amber-400 rounded-full"></div>
              </div>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span>Revenge Trading</span>
                <span className="text-red-400">15%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full">
                <div className="h-full w-[15%] bg-red-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="text-blue-400" />
            Performance Impact
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Win Rate by Emotion</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Calm Trading</span>
                  <span className="text-emerald-400">72%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>FOMO</span>
                  <span className="text-amber-400">45%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Revenge Trading</span>
                  <span className="text-red-400">28%</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Behavioral Triggers */}
      <section className="grid grid-cols-3 gap-6">
        <Card className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Clock className="text-emerald-400" />
            Time-Based Patterns
          </h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 mt-1" />
              <span>Higher FOMO during market opens</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 mt-1" />
              <span>Better performance in afternoon sessions</span>
            </li>
          </ul>
        </Card>

        <Card className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <TrendingDown className="text-red-400" />
            Loss Response
          </h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 mt-1" />
              <span>Tendency to double down after losses</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 mt-1" />
              <span>Increased position sizing after drawdown</span>
            </li>
          </ul>
        </Card>

        <Card className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Calendar className="text-blue-400" />
            Calendar Patterns
          </h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 mt-1" />
              <span>Lower win rate on Mondays</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 mt-1" />
              <span>Best performance mid-week</span>
            </li>
          </ul>
        </Card>
      </section>
    </div>
  );
}