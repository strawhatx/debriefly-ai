import { Brain, ThumbsUp, AlertTriangle, Download, Share2, TrendingUp, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DebriefOverview } from '@/components/debrief/DebriefOverview';

export const Debrief = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Session Debrief</h1>
        <div className="flex gap-4">
          <Button variant='link' className="">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
          <Button className=" bg-primary hover:bg-emerald-300">
            <Share2 className="w-4 h-4" />
            Share Report
          </Button>
        </div>
      </div>

      {/* Session Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <DebriefOverview />
      </div>

      {/* AI Analysis Section */}
      <section className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Brain className="text-purple-400" />
            Emotional Analysis
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <h3 className="text-lg font-medium mb-2">What Went Well</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <ThumbsUp className="w-4 h-4 text-emerald-400 mt-1" />
                  <span>Maintained composure during market volatility</span>
                </li>
                <li className="flex items-start gap-2">
                  <ThumbsUp className="w-4 h-4 text-emerald-400 mt-1" />
                  <span>Followed stop-loss rules consistently</span>
                </li>
              </ul>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Areas for Improvement</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-1" />
                  <span>Signs of hesitation on profitable trade exits</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-1" />
                  <span>Consider reducing position size during high volatility</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="text-blue-400" />
            Strategy Performance
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400">Win Rate</span>
                <span className="text-emerald-400">65%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full w-[65%] bg-emerald-400 rounded-full"></div>
              </div>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Strategy Adjustments</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <LineChart className="w-4 h-4 text-blue-400 mt-1" />
                  <span>Pullback entries showing higher success rate</span>
                </li>
                <li className="flex items-start gap-2">
                  <LineChart className="w-4 h-4 text-blue-400 mt-1" />
                  <span>Consider tightening stop-loss on breakout trades</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
