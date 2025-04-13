import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export const PerformanceOverview = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
        <Link 
          to="/history"
          className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-emerald-500/50 transition-colors"
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
  );
}