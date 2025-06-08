
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MARKETS, TradingAccount, EditingAccount } from "@/types/trading";
import { toast } from "sonner";

export const useAccountForm = () => {
  const [editingAccount, setEditingAccount] = useState<EditingAccount | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EditingAccount>({
    defaultValues: {
      account_name: "",
      broker_id: "",
      market: null,
      account_balance: 0,
    },
  });

  const { data: brokers = [] } = useQuery({
    queryKey: ["brokers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("brokers").select("*");
      if (error) throw error;
      return data;
    },
  });

  const openDialog = (account?: TradingAccount) => {
    if (account) {
      const editingData = {
        ...account,
        market: MARKETS.includes(account.market as any) ? account.market as typeof MARKETS[number] : null,
        isNew: false,
      };
      setEditingAccount(editingData);
      form.reset(editingData);
    } else {
      const newAccount = {
        account_name: "",
        broker_id: "",
        market: null,
        account_balance: 0,
        isNew: true,
      };
      setEditingAccount(newAccount);
      form.reset(newAccount);
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setEditingAccount(null);
    setIsDialogOpen(false);
    form.reset();
  };

  const onSubmit = async (data: EditingAccount) => {
    setIsLoading(true);
    const success = await saveAccount(data);
    setIsLoading(false);
    if (success) {
      closeDialog();
    }
  };

  const saveAccount = async (accountData: EditingAccount) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

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
    isLoading,
    form,
    brokers,
    openDialog,
    closeDialog,
    saveAccount,
    deleteAccount,
    onSubmit,
    setEditingAccount,
  };
};
