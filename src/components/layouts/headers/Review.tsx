
import { Button } from "@/components/ui/button";
import { useTrades } from "@/hooks/use-trades";
import { useEventStore } from "@/store/event";
import { useEffect, useState } from "react";

export const ReviewHeader = () => {
  const [visible, setVisible] = useState(true);
  const { loading, setLoading, setEvent } = useEventStore();
  const { trades, isLoading } = useTrades(true);

  const handleSave = () => {
    setEvent("review_trade_save");
    setLoading(true);
  }

  useEffect(() => {
    if (isLoading) return;

    setVisible(trades.length > 0)
  }, [trades])

  return (
    <div className="hidden lg:block">
      { visible && (
        <Button
          onClick={handleSave}
          size="sm"
          className="gap-2 text-sm"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save & Publish"}
        </Button>
      )}
    </div>
  );
};