import { Card } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { BehaviorInsight } from "../hooks/use-analysis";

interface AiSummaryProps {
  insights?: BehaviorInsight[]; // Allow `insights` to be optional
}

export const AiSummary = ({ insights }: AiSummaryProps) => {
  const limitedInsights = insights?.slice(0, 2) || []; // Safely handle null or undefined

  if (limitedInsights.length === 0) {
    return (
      <Card className="bg-gray-800 border border-gray-700 p-6 col-span-2">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="text-blue-400" />
          AI Quick Insights
        </h2>
        <p className="text-gray-400 flex items-center justify-center text-sm min-h-44">No insights available at the moment.</p>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border border-gray-700 p-6 col-span-2">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Activity className="text-blue-400" />
        AI Quick Insights
      </h2>
      <div className="space-y-4">
        {limitedInsights.map((insight, index) => (
          <div key={index} className="p-4 bg-gray-900/70 rounded-lg">
            <p className="text-sm text-gray-300">
              <span className="block text-white mb-1">{insight.title}</span>
              {insight.description}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};
