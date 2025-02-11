
import { Card } from "@/components/ui/card";

const Journal = () => {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Trading Journal</h1>
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">My Trading Journal</h2>
          <p className="text-muted-foreground">
            Coming soon: A detailed journal to record and analyze your trading thoughts and strategies.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Journal;
