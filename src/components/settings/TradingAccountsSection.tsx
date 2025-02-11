
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { TradingAccountForm } from "./TradingAccountForm";
import { TradingAccountRow } from "./TradingAccountRow";
import { TradingAccount, EditingAccount } from "@/types/trading";
import { useQuery } from "@tanstack/react-query";

interface TradingAccountsSectionProps {
  tradingAccounts: TradingAccount[];
  setTradingAccounts: (accounts: TradingAccount[]) => void;
}

export const TradingAccountsSection = ({ 
  tradingAccounts, 
  setTradingAccounts 
}: TradingAccountsSectionProps) => {
  const { toast } = useToast();
  const [editingAccount, setEditingAccount] = useState<EditingAccount | null>(null);

  // Fetch available brokers to get their IDs
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
    // Use the first broker's ID as default, or null if no brokers available
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

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Trading Accounts</h3>
          <Button onClick={handleStartCreate} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Account
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account Name</TableHead>
              <TableHead>Broker</TableHead>
              <TableHead>Profit Calculation</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {editingAccount?.isNew && (
              <TableRow>
                <TradingAccountForm
                  editingAccount={editingAccount}
                  onUpdate={setEditingAccount}
                  onSave={handleSave}
                  onCancel={handleCancelEdit}
                />
              </TableRow>
            )}
            {tradingAccounts.map((account) => (
              <TableRow key={account.id}>
                {editingAccount?.id === account.id ? (
                  <TradingAccountForm
                    editingAccount={editingAccount}
                    onUpdate={setEditingAccount}
                    onSave={handleSave}
                    onCancel={handleCancelEdit}
                  />
                ) : (
                  <TradingAccountRow
                    account={account}
                    onEdit={handleStartEdit}
                    onDelete={handleDelete}
                  />
                )}
              </TableRow>
            ))}
            {tradingAccounts.length === 0 && !editingAccount?.isNew && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-4">
                  No trading accounts yet. Click "Add Account" to create your first one!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
