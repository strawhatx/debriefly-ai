import { LineChart } from "lucide-react";
import { Link } from "react-router-dom";
import { LineChart as RechartsLineChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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

export const PerformanceChart = () => {
  return (
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

  );
}