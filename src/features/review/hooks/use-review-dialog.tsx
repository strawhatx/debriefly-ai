import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface Trade {
  id: string;
  user_id: string;
  date: string;
  symbol: string;
  type: 'LONG' | 'SHORT';
  pnl: number;
  strategy: string | null;
  reward: number;
  tags: string[];
}

interface ValidationErrors {
  strategy?: string;
  reward?: string;
  tags?: string;
}

export const useReviewDialog = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [trade, setTrade] = useState<Trade>({
    id: "",
    user_id: "",
    date: new Date().toLocaleDateString(),
    symbol: "",
    type: "LONG",
    pnl: 0,
    strategy: "",
    reward: 0,
    tags: []
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Reset state when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setErrors({});
      setIsSaving(false);
    }
  };

  // Validate trade data
  const validateTrade = (trade: Trade): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!trade.strategy?.trim()) {
      errors.strategy = "Please select a strategy";
    }

    if (!trade.reward || trade.reward < 0.5 || trade.reward > 10) {
      errors.reward = "Please enter a valid risk reward between 0.5 and 10";
    }

    if (!trade.tags || trade.tags.length === 0) {
      errors.tags = "Please add at least one emotional tag";
    }

    return errors;
  };

  // Save trade data
  const handleSave = async () => {
    if (!trade) return;

    // Validate trade data
    const validationErrors = validateTrade(trade);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('positions')
        .update({
          id: trade.id,
          user_id: trade.user_id,
          strategy: trade.strategy,
          reward: trade.reward,
          tags: trade.tags,
          state: "PUBLISHED",
        })
        .eq('id', trade.id)
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Trade updated successfully",
        variant: "default"
      });

      setOpen(false);
    } catch (error: any) {
      console.error('Error saving position:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save trade",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    open,
    setOpen: handleOpenChange,
    trade,
    setTrade,
    handleSave,
    isSaving,
    errors
  };
};
