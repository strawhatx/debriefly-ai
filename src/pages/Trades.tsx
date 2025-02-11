
import { Card } from "@/components/ui/card";

const Trades = () => {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Trade History</h1>
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">My Trades</h2>
          <p className="text-muted-foreground">
            Coming soon: A comprehensive view of all your trades with detailed analytics.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Trades;
