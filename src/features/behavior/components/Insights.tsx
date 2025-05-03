import { Target } from 'lucide-react';
import { BehaviorInsight } from '../hooks/use-analysis';

interface InsightProps {
    insights: BehaviorInsight[];
}

// Reusable empty state component
const EmptyState = () => (
    <div className="text-gray-400 text-sm italic flex items-center justify-center p-4 min-h-44">
        No insights & recommendations available
    </div>
);

// Reusable recommendation card component
const InsightCard = ({ insight }: { insight: BehaviorInsight }) => (
    <div className="p-4 bg-gray-900/50 rounded-lg transition-all hover:bg-gray-900/70">
        <h6 className="font-medium mb-2 text-gray-100">{insight.title}</h6>
        <p className="text-gray-300 mb-2 text-sm leading-relaxed">
            {insight.description}
        </p>

        <div className="bg-gray-800/70 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-emerald-400 mb-1">Recommendation</h4>
            <p className="text-sm text-gray-300">
                {insight.recommendation}
            </p>
        </div>
    </div>
);

export const Insights = ({ insights = [] }: Partial<InsightProps>) => {

    return (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 min-h-44">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="text-blue-400" />
                AI-Powered Insights & Recommendations
            </h2>
            <div className="space-y-4">
                {!insights.length ? (
                    <EmptyState />
                ) : (
                    insights.map((insight, index) => (
                        <InsightCard
                            key={`ins-${index}-${insight.title}`}
                            insight={insight}
                        />
                    ))
                )}
            </div>
        </div>
    );
};