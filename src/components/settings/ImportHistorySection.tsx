
import { Card } from "@/components/ui/card";

export const ImportHistorySection = () => {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Import History</h3>
        <div className="space-y-4">
          <p className="text-muted-foreground text-center py-4">
            No import history available yet.
          </p>
        </div>
      </div>
    </Card>
  );
};
