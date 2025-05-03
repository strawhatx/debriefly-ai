import { Brain } from "lucide-react";
import { Link } from "react-router-dom";

interface Analysis {
  title: string;
  description: string;
}

interface AiInsightsProps {
  analysis: Analysis[];
}

export const AiInsights = ({ analysis }: AiInsightsProps) => {
  const hasInsights = analysis.length > 0;

  return (
    <Link
      to="/behavior"
      className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-emerald-500/50 transition-colors block"
    >
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Brain className="text-emerald-400" />
        AI Trading Insights
      </h2>

      {hasInsights ? (
        <div className="space-y-4">
          {analysis.map(({ title, description }, index) => (
            <InsightCard key={index} title={title} description={description} />
          ))}
        </div>
      ) : (
        <div className="text-gray-400 text-sm h-40 flex items-center justify-center border border-dashed border-gray-600 rounded-md">
          No insights available yet.
        </div>
      )}
    </Link>
  );
};

const InsightCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="p-4 bg-gray-900/50 rounded-lg">
    <h6 className="font-medium text-white mb-1">{title}</h6>
    <p className="text-gray-300 text-sm">{description}</p>
  </div>
);
