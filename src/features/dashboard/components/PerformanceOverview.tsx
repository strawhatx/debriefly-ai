import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { usePerformanceMetrics } from "../hooks/use-performance-metrics";

interface Trade {
    pnl: number;
    risk: number;
    reward: number;
    isWin: boolean;
    score?: number;
}

interface PerformanceOverviewProps {
    trades: Trade[];
}

export const PerformanceOverview = ({ trades }: PerformanceOverviewProps) => {
    const {
        dailyPnl,
        winRate,
        avgRiskReward,
        emotionalScore,
        totalTrades,
        winningTrades,
    } = usePerformanceMetrics(trades);

    const hasTrades = trades.length > 0;

    const cardClass =
        "bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-emerald-500/50 transition-colors";

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Daily PnL */}
            <Link to="/history" className={cardClass}>
                <span className="text-gray-400">Daily P&L</span>
                <div
                    className={`text-2xl font-bold mt-1 ${dailyPnl >= 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                >
                    {dailyPnl >= 0 ? "+" : "-"}${Math.abs(dailyPnl).toFixed(2)}
                </div>
                <div className="flex items-center gap-1 text-sm text-emerald-400">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>
                        {((dailyPnl / 10000) * 100).toFixed(2)}% today
                    </span>
                </div>
            </Link>

            {/* Win Rate */}
            <Link to="/strategy" className={cardClass}>
                <span className="text-gray-400">Win Rate</span>
                <div className="text-2xl font-bold text-emerald-400 mt-1">
                    {hasTrades ? `${winRate.toFixed(1)}%` : "—"}
                </div>
                <div className="text-sm text-gray-400">
                    {hasTrades ? `${winningTrades}/${totalTrades} winning trades` : "No trades yet"}
                </div>
            </Link>

            {/* Avg Risk/Reward */}
            <Link to="/strategy" className={cardClass}>
                <span className="text-gray-400">Avg R:R Ratio</span>
                <div className="text-2xl font-bold text-emerald-400 mt-1">
                    {hasTrades ? `1:${avgRiskReward.toFixed(1)}` : "—"}
                </div>
                <div className="text-sm text-gray-400">
                    {hasTrades ? "Above target (1:1.5)" : "N/A"}
                </div>
            </Link>

            {/* Emotional Score */}
            <Link to="/behavior" className={cardClass}>
                <span className="text-gray-400">Emotional Score</span>
                <div className="text-2xl font-bold text-emerald-400 mt-1">
                    {hasTrades ? `${emotionalScore.toFixed(1)}/10` : "—"}
                </div>
                <div className="text-sm text-emerald-400">
                    {hasTrades ? "Disciplined Trading" : "No data yet"}
                </div>
            </Link>
        </div>
    );
};
