
import { Button } from "@/components/ui/button";
import { useEventStore } from "@/store/event";

export const ReviewHeader = () => {
  const {loading, setLoading, setEvent}= useEventStore();

  const handleSave = () => {
    setEvent("review_trade_save");
    setLoading(true);
  }

  return (
    <Button
      onClick={handleSave}
      size="sm"
      className="gap-2 text-sm"
      disabled={loading}
    >
      {loading ? "Saving..." : "Save & Publish"}
    </Button>
  );
};