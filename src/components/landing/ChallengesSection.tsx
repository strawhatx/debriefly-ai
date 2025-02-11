
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const ChallengesSection = () => (
  <section className="relative">
    <div className="absolute inset-0 bg-gradient-to-r from-destructive/5 to-destructive/10 rounded-3xl" />
    <Card className="relative p-8 border-2 border-destructive/20 bg-card/50 backdrop-blur-sm">
      <h2 className="text-3xl font-bold mb-8 text-center">Common Trading Challenges We Solve</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Emotional Trading",
            description: "AI helps you identify and overcome emotional biases in your trading decisions"
          },
          {
            title: "Inconsistent Performance",
            description: "Track and analyze patterns to maintain consistent trading strategies"
          },
          {
            title: "Poor Risk Management",
            description: "Get real-time feedback on position sizing and risk-reward ratios"
          }
        ].map((issue) => (
          <div key={issue.title} className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <h3 className="font-semibold text-lg">{issue.title}</h3>
            </div>
            <p className="text-muted-foreground">{issue.description}</p>
          </div>
        ))}
      </div>
    </Card>
  </section>
);

export default ChallengesSection;
