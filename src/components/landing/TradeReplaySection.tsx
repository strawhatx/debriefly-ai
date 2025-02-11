
import { Card } from "@/components/ui/card";
import { History } from "lucide-react";

const TradeReplaySection = () => (
  <div className="relative w-full rounded-xl overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 animate-pulse"></div>
    <Card className="relative p-8 border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-lg bg-primary/10">
          <History className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold">Trade Replay & Backtesting</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-medium">Coming Soon</h3>
          <p className="text-muted-foreground">
            Visualize and replay your trades in real-time. Test your strategies
            with our advanced backtesting engine powered by TradingView
            integration.
          </p>
        </div>
        <div className="rounded-lg bg-primary/5 h-[200px] flex items-center justify-center">
          <p className="text-muted-foreground text-sm">
            Trade visualization preview
          </p>
        </div>
      </div>
    </Card>
  </div>
);

export default TradeReplaySection;
