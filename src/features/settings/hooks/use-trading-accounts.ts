
import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TradingAccount, EditingAccount } from "@/types/trading";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useTradingAccounts = (initialAccounts: TradingAccount[]) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [tradingAccounts, setTradingAccounts] = useState<TradingAccount[]>(initialAccounts);
  const [editingAccount, setEditingAccount] = useState<EditingAccount | null>(null);

  const { data: brokers = [] } = useQuery({
    queryKey: ["availableBrokers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("brokers").select("*");
      if (error) throw error;
      return data;
    },
  });

  const handleStartEdit = useCallback((account: TradingAccount) => setEditingAccount(account), []);

  const handleStartCreate = useCallback(() => {
    setEditingAccount({
      isNew: true,
      broker_id: brokers.length > 0 ? brokers[0].id : null,
      market: "STOCKS",
      account_balance: 0,
    });
  }, [brokers]);

  const handleCancelEdit = useCallback(() => setEditingAccount(null), []);

  const validateAccount = (account: EditingAccount) => {
    if (!account.account_name?.trim()) return "Please enter an account name.";
    if (!account.broker_id) return "Please select a broker.";
    if (isNaN(Number(account.account_balance)) || Number(account.account_balance) < 0) {
      return "Please enter a valid account balance.";
    }
    return null;
  };

  const saveAccount = useMutation({
    mutationFn: async () => {
      if (!editingAccount) throw new Error("No account is being edited.");
      const validationError = validateAccount(editingAccount);
      if (validationError) throw new Error(validationError);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated.");

      const payload = {
        account_name: editingAccount.account_name,
        user_id: user.id,
        broker_id: editingAccount.broker_id,
        market: editingAccount.market,
        account_balance: Number(editingAccount.account_balance),
      };

      if (editingAccount.isNew) {
        const { data, error } = await supabase.from("trading_accounts")
          .insert([payload]).select();

        if (error) throw error;
        return { type: "add", account: data[0] };
      } else {
        const { data, error } = await supabase.from("trading_accounts")
          .update(payload).eq("id", editingAccount.id).select();

        if (error) {
          if (error.code === 'PGRST116') {
            throw new Error(`Trading account with ID ${editingAccount.id} not found`);
          }
          throw error;
        }
        return { type: "update", account: data[0] };
      }
    },
    onSuccess: ({ type, account }) => {
      setTradingAccounts((prev) => 
        type === "add" ? [account as TradingAccount, ...prev] : prev.map((a) => (a.id === account.id ? account as TradingAccount : a))
      );
      toast({
        variant:"success",
        title: "Success",
        description: `Trading account ${type === "add" ? "added" : "updated"} successfully.`,
      });
      setEditingAccount(null);
      queryClient.invalidateQueries({ queryKey: ["tradingAccounts"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save trading account.",
        variant: "destructive",
      });
    },
  });

  const deleteAccount = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("trading_accounts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, id) => {
      setTradingAccounts((prev) => prev.filter((account) => account.id !== id));
      toast({
        variant:"success",
        title: "Success",
        description: "Trading account deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["tradingAccounts"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete trading account.",
        variant: "destructive",
      });
    },
  });

  return {
    tradingAccounts,
    editingAccount,
    setEditingAccount,
    handleStartEdit,
    handleStartCreate,
    handleCancelEdit,
    handleSave: saveAccount.mutate,
    handleDelete: deleteAccount.mutate,
  };
};
