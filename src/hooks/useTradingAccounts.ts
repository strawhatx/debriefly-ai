
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TradingAccount, EditingAccount } from "@/types/trading";
import { useQuery } from "@tanstack/react-query";

export const useTradingAccounts = (
  tradingAccounts: TradingAccount[],
  setTradingAccounts: (accounts: TradingAccount[]) => void
) => {
  const { toast } = useToast();
  const [editingAccount, setEditingAccount] = useState<EditingAccount | null>(null);

  const { data: brokers } = useQuery({
    queryKey: ["availableBrokers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brokers")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const handleStartEdit = (account: TradingAccount) => {
    setEditingAccount(account);
  };

  const handleStartCreate = () => {
    const defaultBrokerId = brokers && brokers.length > 0 ? brokers[0].id : null;
    
    setEditingAccount({
      isNew: true,
      broker_id: defaultBrokerId,
      profit_calculation_method: "FIFO",
      account_balance: 0,
    });
  };

  const handleCancelEdit = () => {
    setEditingAccount(null);
  };

  const handleSave = async () => {
    if (!editingAccount) return;

    if (!editingAccount.account_name?.trim()) {
      toast({
        title: "Error",
        description: "Please enter an account name",
        variant: "destructive",
      });
      return;
    }

    if (!editingAccount.broker_id) {
      toast({
        title: "Error",
        description: "Please select a broker",
        variant: "destructive",
      });
      return;
    }

    if (!editingAccount.account_balance || isNaN(Number(editingAccount.account_balance)) || Number(editingAccount.account_balance) < 0) {
      toast({
        title: "Error",
        description: "Please enter a valid account balance",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (editingAccount.isNew) {
        const { data, error } = await supabase
          .from('trading_accounts')
          .insert([{
            account_name: editingAccount.account_name,
            user_id: user.id,
            broker_id: editingAccount.broker_id,
            profit_calculation_method: editingAccount.profit_calculation_method,
            account_balance: Number(editingAccount.account_balance)
          }])
          .select(`
            *,
            broker:brokers(*)
          `)
          .single();

        if (error) {
          if (error.message.includes('Trading account limit reached')) {
            toast({
              title: "Account Limit Reached",
              description: "You've reached the maximum number of trading accounts for your subscription tier. Please upgrade to add more accounts.",
              variant: "destructive",
            });
            setEditingAccount(null);
            return;
          }
          throw error;
        }
        
        setTradingAccounts([data, ...tradingAccounts]);
      } else {
        const { data, error } = await supabase
          .from('trading_accounts')
          .update({
            account_name: editingAccount.account_name,
            broker_id: editingAccount.broker_id,
            profit_calculation_method: editingAccount.profit_calculation_method,
            account_balance: Number(editingAccount.account_balance)
          })
          .eq('id', editingAccount.id)
          .select(`
            *,
            broker:brokers(*)
          `)
          .single();

        if (error) throw error;
        setTradingAccounts(
          tradingAccounts.map(acc => acc.id === data.id ? data : acc)
        );
      }

      setEditingAccount(null);
      toast({
        title: "Success",
        description: `Trading account ${editingAccount.isNew ? 'added' : 'updated'} successfully`,
      });
    } catch (error: any) {
      console.error('Error saving trading account:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${editingAccount.isNew ? 'add' : 'update'} trading account`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('trading_accounts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTradingAccounts(tradingAccounts.filter(account => account.id !== id));
      toast({
        title: "Success",
        description: "Trading account deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting trading account:', error);
      toast({
        title: "Error",
        description: "Failed to delete trading account",
        variant: "destructive",
      });
    }
  };

  return {
    editingAccount,
    setEditingAccount,
    handleStartEdit,
    handleStartCreate,
    handleCancelEdit,
    handleSave,
    handleDelete,
  };
};
