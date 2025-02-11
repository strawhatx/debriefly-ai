
import { Card } from "@/components/ui/card";

const Insights = () => {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Trading Insights</h1>
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Performance Analytics</h2>
          <p className="text-muted-foreground">
            Coming soon: Advanced analytics and insights about your trading performance.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Insights;
