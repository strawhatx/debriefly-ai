
import { Button } from "@/components/ui/button";
import { useTrades } from "@/hooks/use-trades";
import { useEventBus } from "@/store/event";
import { useEffect, useState } from "react";

export const ReviewHeader = () => {
  const [visible, setVisible] = useState(true);
  const [saving, setSaving] = useState(true);
  const { trades, isLoading } = useTrades(true);
  const publish = useEventBus((state) => state.publish);

  const handleSave = () => {
    setSaving(true);
    publish("review_trade_save", { setSaving });
  }

  useEffect(() => {
    if (isLoading) return;

    setVisible(trades.length > 0)
  }, [trades])

  return (
    <div className="hidden lg:block">
      {visible && (
        <Button
          onClick={handleSave}
          size="sm"
          className="gap-2 text-sm"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save & Publish"}
        </Button>
      )}
    </div>
  );
};