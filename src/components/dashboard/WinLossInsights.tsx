
import { Card } from "@/components/ui/card";

const insights = [
  {
    title: "Longest Win Streak",
    value: "7 trades",
    description: "Achieved in March 2024",
  },
  {
    title: "Best Trading Day",
    value: "Wednesday",
    description: "68% win rate on Wednesdays",
  },
  {
    title: "Most Profitable Time",
    value: "10:00 AM - 11:00 AM",
    description: "Average profit of $245 per trade",
  },
  {
    title: "Risk Management",
    value: "1.8:1",
    description: "Average reward-to-risk ratio",
  },
];

const WinLossInsights = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {insights.map((insight) => (
        <Card key={insight.title} className="p-6">
          <h3 className="font-medium text-muted-foreground">{insight.title}</h3>
          <p className="text-2xl font-bold mt-2">{insight.value}</p>
          <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
        </Card>
      ))}
    </div>
  );
};

export default WinLossInsights;
