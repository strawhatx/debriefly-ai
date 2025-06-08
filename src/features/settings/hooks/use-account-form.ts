
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MARKETS, TradingAccount, EditingAccount } from "@/types/trading";
import { toast } from "sonner";

export const useAccountForm = () => {
  const [editingAccount, setEditingAccount] = useState<EditingAccount | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = (account?: TradingAccount) => {
    if (account) {
      setEditingAccount({
        ...account,
        // Ensure market is one of the allowed types or null
        market: MARKETS.includes(account.market as any) ? account.market as typeof MARKETS[number] : null,
        isNew: false,
      });
    } else {
      setEditingAccount({
        account_name: "",
        broker_id: "",
        market: null,
        account_balance: 0,
        isNew: true,
      });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setEditingAccount(null);
    setIsDialogOpen(false);
  };

  const saveAccount = async (accountData: EditingAccount) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Ensure market is properly typed
      const market = accountData.market && MARKETS.includes(accountData.market as any) 
        ? accountData.market as typeof MARKETS[number]
        : null;

      if (accountData.isNew) {
        const { error } = await supabase
          .from("trading_accounts")
          .insert([
            {
              account_name: accountData.account_name!,
              broker_id: accountData.broker_id!,
              market,
              account_balance: accountData.account_balance || 0,
              user_id: user.id,
            },
          ]);

        if (error) throw error;
        toast.success("Trading account created successfully");
      } else {
        const { error } = await supabase
          .from("trading_accounts")
          .update({
            account_name: accountData.account_name,
            broker_id: accountData.broker_id,
            market,
            account_balance: accountData.account_balance,
          })
          .eq("id", accountData.id!);

        if (error) throw error;
        toast.success("Trading account updated successfully");
      }

      closeDialog();
      return true;
    } catch (error) {
      console.error("Error saving account:", error);
      toast.error("Failed to save account");
      return false;
    }
  };

  const deleteAccount = async (accountId: string) => {
    try {
      const { error } = await supabase
        .from("trading_accounts")
        .delete()
        .eq("id", accountId);

      if (error) throw error;
      toast.success("Trading account deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
      return false;
    }
  };

  return {
    editingAccount,
    isDialogOpen,
    openDialog,
    closeDialog,
    saveAccount,
    deleteAccount,
  };
};
