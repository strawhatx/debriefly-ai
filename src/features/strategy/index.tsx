import { useEffect, useState } from 'react';
import { Settings, ArrowRight, PlayCircle } from 'lucide-react';
import { StrategyMetrics } from './components/StrategyMetrics';
import { WinRate } from './components/WinRate';
import { RiskReward } from './components/RiskReward';
import { StrategyAdjustments } from '@/components/StrategyAdjustments';
import { useTrades } from './hooks/use-trades';
import { useAnalysis } from './hooks/use-analysis';
import { EquityCurve } from './components/EquityCurve';
import { WinLossDistribution } from './components/WinLossDistribution';
import { NoDataModal } from '@/components/NoDataModal';

export const Strategy = () => {
    const [showModal, setShowModal] = useState(false);
    const { trades, isLoading: tradesLoading } = useTrades();
    const { recommendations } = useAnalysis();

    useEffect(() => {
        if (tradesLoading) return; // Don't run until data is done loading
      
        if (!trades || trades.length === 0) {
          setShowModal(true);
        } else {
          setShowModal(false);
        }
      }, [trades, tradesLoading]);

    return (
        <div className="space-y-4">
            <NoDataModal open={showModal} onClose={() => setShowModal(false)} />

            {/* Strategy Overview Section */}
            {/* Strategy Overview Cards */}
            <StrategyMetrics positions={trades} />

            {/* Strategy Patterns Overview */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <WinRate trades={trades} />
                <RiskReward trades={trades} />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <EquityCurve trades={trades} />

                {/* Win/Loss Distribution Chart */}
                <WinLossDistribution trades={trades} />
            </div>

            {/* AI Recommendations Secti                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     on */}
            <section>
                <StrategyAdjustments strategy_recommendations={recommendations} />
            </section>
        </div>
    );
}