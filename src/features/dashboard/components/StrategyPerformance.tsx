import { CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, Cell } from "recharts";
import { Link } from "react-router-dom";
import { BarChart4 } from "lucide-react";

// Mock data for strategy performance
const strategyData = [
  { name: 'Breakouts', winRate: 68 },
  { name: 'Pullbacks', winRate: 72 },
  { name: 'Reversals', winRate: 58 },
  { name: 'Range', winRate: 65 }
];


export const StrategyPerformance = () => {
  return (
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
  );
}