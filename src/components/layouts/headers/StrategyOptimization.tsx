
import {  Settings } from "lucide-react";
import { useState } from "react";

export const StrategyOptimizationHeader = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
    return (
        <div className="flex gap-4">
        <select
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
        </select>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg">
          <Settings className="w-4 h-4" />
          Apply Changes
        </button>
      </div>
    );
};