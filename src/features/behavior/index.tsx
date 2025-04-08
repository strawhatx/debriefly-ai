
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { DetectedBehaviorPatterns } from './components/DetectedBehaviorPatterns';
import { useTrades } from './hooks/use-trades';
import { AiSummary } from './components/AiSummary';
import { useAnalysis } from './hooks/use-analysis';
import { Insights } from './components/Insights';
import { WinRate } from './components/WinRate';
import { RiskReward } from './components/RiskReward';
import { TradeReview } from './components/TradeReview';
import { BehaviorChart } from './components/BehaviorChart';
import { ChevronRight, Lock, ThumbsUp } from 'lucide-react';

export const Behavior = () => {
  const { trades } = useTrades();
  const { insights } = useAnalysis();

  return (
    <div className="space-y-4 animate-fade-up">
      {/* Section 1: Behavior Summary Overview */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Key Behavior Tags */}
        <DetectedBehaviorPatterns trades={trades} />

        {/* AI Insights Summary Card */}
        <AiSummary insights={insights} />
      </section>

      {/* Emotional Patterns Overview */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WinRate trades={trades} />
        <RiskReward trades={trades} />
      </section>

      {/* Behavioral Trend Graph */}
      <section>
        <BehaviorChart trades={trades} />
      </section>

      {/* Section 3: AI-Powered Insights */}
      <section>
        <Insights insights={insights} />
      </section>

      {/* Section 4: Detailed Trade Review */}
      <section>
        <TradeReview trades={trades} />
      </section>

      {/* Section 5: Call to Action */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border border-gray-700 p-6 flex flex-col items-start">
          <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
            <ThumbsUp className="text-emerald-400" />
            View Your Full Trading Session Analysis
          </h3>
          <p className="text-gray-300 mb-4">
            Get a comprehensive debrief of your recent trading sessions with deeper insights and personalized tips.
          </p>
          <Link to="/app/debrief">
            <Button className="hover-scale">
              Go to Debrief
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 flex flex-col items-start">
          <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
            <Lock className="text-purple-400" />
            Unlock Advanced Behavioral Analytics
          </h3>
          <p className="text-gray-300 mb-4">
            Upgrade to Pro for AI-powered pattern recognition, automated behavior alerts, and personalized coaching.
          </p>
          <Button variant="glow" className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover-scale">
            Upgrade to Pro
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Card>
      </section>
    </div>
  );
}
