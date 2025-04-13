import { AlertTriangle, Brain, Target, ThumbsUp } from "lucide-react";
import { Link } from "react-router-dom";

export const AiInsights = () => {
  return (
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

  );
}