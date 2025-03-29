
import { Button } from "@/components/ui/button";
import { useTrades } from "@/features/review/hooks/use-trades";
import { useToast } from "@/hooks/use-toast";

export const ReviewHeader = () => {
  const { trades, saveTrades, isLoading } = useTrades();
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      await saveTrades(trades);
      toast({
        title: "Success",
        description: "Changes saved successfully!",
        variant: "default",
      });
    }
    catch (err) {
      console.error("Error saving trades:", err);
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={handleSave}
      size="sm"
      className="gap-2 text-sm"
      disabled={isLoading}
    >
      {isLoading ? "Saving..." : "Save & Publish"}
    </Button>
  );
};