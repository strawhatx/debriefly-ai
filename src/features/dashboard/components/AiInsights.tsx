import { AlertTriangle, Brain, Target, ThumbsUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo } from "react";

interface Analysis {
  id: string;
  title: string;
  description: string;
  icon: "ThumbsUp" | "Target" | "AlertTriangle"; // Icon type
  iconColor: string; // Tailwind color class for the icon
}

interface AiInsightsProps {
  analysis: Analysis[]; // List of analysis insights
}

export const AiInsights = ({ analysis }: AiInsightsProps) => {
  // Memoized insights to avoid unnecessary re-renders
  const insights = useMemo(() => analysis, [analysis]);

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
        {insights.map(({ id, title, description, icon, iconColor }) => (
          <InsightCard
            key={id}
            title={title}
            description={description}
            icon={icon}
            iconColor={iconColor}
          />
        ))}
      </div>
    </Link>
  );
};

// Reusable InsightCard Component
const InsightCard = ({
  title,
  description,
  icon,
  iconColor,
}: {
  title: string;
  description: string;
  icon: "ThumbsUp" | "Target" | "AlertTriangle";
  iconColor: string;
}) => {
  // Map icon names to actual Lucide icons
  const IconComponent = {
    ThumbsUp,
    Target,
    AlertTriangle,
  }[icon];

  return (
    <div className="p-4 bg-gray-900/50 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <IconComponent className={`w-5 h-5 ${iconColor}`} />
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};