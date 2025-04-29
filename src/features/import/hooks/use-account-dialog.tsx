import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type MARKET = 'STOCKS'| 'OPTIONS'| 'CRYPTO'| 'FOREX'|'FUTURES';

export interface EditingAccount {
  id: string;
  isNew?: boolean;
  account_name: string;
  broker_id: string;
  market: MARKET;
  account_balance: number;
  created_at: string;
}

export const useAccountDialog = () => {
  const { toast } = useToast();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [account, setAccount] = useState<EditingAccount>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Validate and Save Account
  const handleSave = async () => {
    if (!account) return;

    if (!account.account_name?.trim()) {
      toast({ title: "Error", description: "Please enter an account name", variant: "destructive" });
      return;
    }

    if (!account.broker_id) {
      toast({ title: "Error", description: "Please select a broker", variant: "destructive" });
      return;
    }

    if (!account.account_balance || isNaN(Number(account.account_balance)) || Number(account.account_balance) < 0) {
      toast({ title: "Error", description: "Please enter a valid account balance", variant: "destructive" });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('trading_accounts')
        .insert([{
          account_name: account.account_name,
          user_id: user.id,
          broker_id: account.broker_id,
          market: account.market,
          account_balance: Number(account.account_balance),
        }]);

      if (error) {
        if (error.message.includes('Trading account limit reached')) {
          toast({
            title: "Account Limit Reached",
            description: "You've reached the maximum number of trading accounts for your subscription tier. Please upgrade to add more accounts.",
            variant: "destructive",
          });
          setAccount(null);
          return;
        }
        throw error;
      }

      setAccount(null);
      toast({variant:"success", title: "Success", description: `Trading account added successfully` });
    } catch (error: any) {
      console.error('Error saving trading account:', error);
      toast({ title: "Error", description: error.message || `Failed to add trading account`, variant: "destructive" });
    }
  };

  return {
    uploadOpen,
    setUploadOpen,
    account,
    setAccount,
    isUploading,
    handleSave,
  };
};
