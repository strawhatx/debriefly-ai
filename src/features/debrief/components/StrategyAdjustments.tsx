import { Target } from 'lucide-react';

interface StrategyRecommendation {
    title: string;
    description: string;
    predicted_win_rate_increase: string;
}

interface StrategyProps {
    strategy_recommendations: StrategyRecommendation[];
}

// Reusable empty state component
const EmptyState = () => (
    <div className="text-gray-400 text-sm italic flex items-center justify-center p-4">
        No strategy recommendations available
    </div>
);

// Reusable recommendation card component
const RecommendationCard = ({ recommendation }: { recommendation: StrategyRecommendation }) => (
    <div className="p-4 bg-gray-900/50 rounded-lg transition-all hover:bg-gray-900/70">
        <h3 className="font-medium mb-2 text-gray-100">{recommendation.title}</h3>
        <p className="text-gray-300 mb-2 text-sm leading-relaxed">
            {recommendation.description}
        </p>
        <div className="flex gap-2">
            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-sm">
                +{recommendation.predicted_win_rate_increase} Win Rate Potential
            </span>
        </div>
    </div>
);

export const StrategyAdjustments = ({
    strategy_recommendations = [] }: Partial<StrategyProps>) => {
   
    return (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Target className="text-blue-400" />
                Strategy Adjustments
            </h2>
            <div className="space-y-4">
                {!strategy_recommendations.length ? (
                    <EmptyState />
                ) : (
                    strategy_recommendations.map((recommendation, index) => (
                        <RecommendationCard
                            key={`strategy-${index}-${recommendation.title}`}
                            recommendation={recommendation}
                        />
                    ))
                )}
            </div>
        </div>
    );
};