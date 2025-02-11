
import { Card } from "@/components/ui/card";

const Replay = () => {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Trade Replay</h1>
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Market Replay</h2>
          <p className="text-muted-foreground">
            Coming soon: Replay and analyze your trades in detail.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Replay;
