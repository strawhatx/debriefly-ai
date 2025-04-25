import { Card } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { emotionAttributes } from "@/utils/constants";
import { Brain } from "lucide-react";
import { useMemo } from "react";
import { calculateEmotionalControlScore } from "@/utils/calculate-emotional-control-score";

interface DetectedBehaviorPatternsProps {
  trades: { tags: string[] }[]; // Assuming each trade has a `tags` array
}

export const DetectedBehaviorPatterns = ({ trades }: DetectedBehaviorPatternsProps) => {
  // Memoize tag counts and percentages
  const { tagPercentages, totalTrades } = useMemo(() => {
    if (!trades.length) return { tagPercentages: [], totalTrades: 0 };

    const tagCounts: Record<string, number> = {};
    trades.forEach((trade) => {
      trade.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const totalTrades = trades.length;
    const tagPercentages = Object.entries(tagCounts).map(([tag, count]) => ({
      tag,
      percentage: ((count / totalTrades) * 100).toFixed(0), // Calculate percentage
    }));

    return { tagPercentages, totalTrades };
  }, [trades]);

  // Calculate emotional control score
  const emotionalControlScore = useMemo(() => {
    return calculateEmotionalControlScore(tagPercentages);
  }, [tagPercentages]);

  // Handle empty trades
  if (!totalTrades) {
    return (
      <Card className="bg-gray-800 border border-gray-700 p-6 col-span-3">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Brain className="text-purple-400" />
          Detected Behavior Patterns
        </h2>
        <p className="text-gray-400 text-sm flex items-center justify-center min-h-44">No trades available to analyze.</p>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border border-gray-700 p-6 col-span-3">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Brain className="text-purple-400" />
        Detected Behavior Patterns
      </h2>
      <div className="space-y-4">
        {/* Render tag badges */}
        <div className="flex flex-wrap gap-3">
          {tagPercentages.map(({ tag, percentage }) => {
            const { colorClass, icon } = emotionAttributes[tag] || {
              colorClass: "text-gray-400 bg-gray-900/50",
              icon: "❓",
            };
            return (
              <Badge
                key={tag}
                className={`py-2 px-3 text-sm border border-gray-500/50 hover:bg-gray-900/70 ${colorClass}`}
              >
                {icon} {tag} ({percentage})%
              </Badge>
            );
          })}
        </div>

        {/* Emotional Control Score */}
        <div className="p-4 bg-gray-900/70 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Emotional Control Score</span>
            <span className="text-lg font-bold text-emerald-400">{emotionalControlScore}/10</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full"
              style={{ width: `${emotionalControlScore * 10}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Score based on your last {totalTrades} trades. {emotionalControlScore >= 7 ? "Showing good emotional control." : "Consider focusing on emotional discipline."}
          </p>
        </div>
      </div>
    </Card>
  );
};
