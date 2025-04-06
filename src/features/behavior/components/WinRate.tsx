import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface Trade {
    pnl: number;
    tags: string[] | null | undefined;
}

interface WinRateProps {
    trades: Trade[];
}

export const WinRate = ({ trades }: WinRateProps) => {
    const winRates = useMemo(() => {
        const emotionStats = trades.reduce((acc, trade) => {
            const { pnl, tags } = trade;

            // Ensure tags exist and are an array
            if (!Array.isArray(tags)) return acc;

            // Ensure pnl is a number
            if (typeof pnl !== "number") return acc;

            tags.forEach((tag) => {
                if (!tag) return; // skip empty/null tags
                if (!acc[tag]) acc[tag] = { wins: 0, total: 0 };
                acc[tag].total += 1;
                if (pnl > 0) acc[tag].wins += 1;
            });

            return acc;
        }, {} as Record<string, { wins: number; total: number }>);

        return Object.entries(emotionStats).map(([emotion, stats]) => ({
            emotion,
            winRate: Number(((stats.wins / stats.total) * 100).toFixed(0)),
        }));
    }, [trades]);

    return (
        <Card className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="text-blue-400" />
                Win Rate by Emotion
            </h2>

            {winRates.length === 0 ? (
                <p className="text-gray-400 text-sm">No valid trade data available.</p>
            ) : (
                <div className="space-y-2">
                    {winRates.map(({ emotion, winRate }) => (
                        <div key={emotion} className="flex justify-between items-center">
                            <span>{emotion}</span>
                            <span className={
                                    winRate >= 60
                                        ? "text-emerald-400"
                                        : winRate >= 40 ? "text-amber-400" : "text-red-400"
                                }
                            >
                                {winRate}%
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};
