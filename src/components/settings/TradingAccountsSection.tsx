
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, X, Plus, Pencil } from "lucide-react";

const BROKERS = [
  'Coinbase',
  'Webull',
  'Robinhood',
  'Tradovate',
  'Charles Schwab',
  'Oanda',
  'Forex.com',
  'TradeStation'
] as const;

const PROFIT_CALC_METHODS = ['FIFO', 'LIFO'] as const;

interface TradingAccount {
  id: string;
  account_name: string;
  broker: typeof BROKERS[number];
  profit_calculation_method: typeof PROFIT_CALC_METHODS[number];
  account_balance: number;
  created_at: string;
}

interface EditingAccount extends Partial<TradingAccount> {
  isNew?: boolean;
}

interface TradingAccountsSectionProps {
  tradingAccounts: TradingAccount[];
  setTradingAccounts: (accounts: TradingAccount[]) => void;
}

export const TradingAccountsSection = ({ tradingAccounts, setTradingAccounts }: TradingAccountsSectionProps) => {
  const { toast } = useToast();
  const [editingAccount, setEditingAccount] = useState<EditingAccount | null>(null);

  const handleStartEdit = (account: TradingAccount) => {
    setEditingAccount(account);
  };

  const handleStartCreate = () => {
    setEditingAccount({
      isNew: true,
      broker: "Coinbase",
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
            broker: editingAccount.broker,
            profit_calculation_method: editingAccount.profit_calculation_method,
            account_balance: Number(editingAccount.account_balance)
          }])
          .select()
          .single();

        if (error) {
          // If we hit the account limit, just cancel the creation
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
            broker: editingAccount.broker,
            profit_calculation_method: editingAccount.profit_calculation_method,
            account_balance: Number(editingAccount.account_balance)
          })
          .eq('id', editingAccount.id)
          .select()
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
                <TableCell>
                  <Input
                    value={editingAccount.account_name || ''}
                    onChange={(e) => setEditingAccount({ ...editingAccount, account_name: e.target.value })}
                    placeholder="Enter account name"
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={editingAccount.broker}
                    onValueChange={(value) => setEditingAccount({ ...editingAccount, broker: value as typeof BROKERS[number] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select broker" />
                    </SelectTrigger>
                    <SelectContent>
                      {BROKERS.map((broker) => (
                        <SelectItem key={broker} value={broker}>
                          {broker}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={editingAccount.profit_calculation_method}
                    onValueChange={(value) => setEditingAccount({ ...editingAccount, profit_calculation_method: value as typeof PROFIT_CALC_METHODS[number] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROFIT_CALC_METHODS.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editingAccount.account_balance || ''}
                    onChange={(e) => setEditingAccount({ ...editingAccount, account_balance: parseFloat(e.target.value) })}
                    placeholder="Enter balance"
                  />
                </TableCell>
                <TableCell>Now</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="icon" variant="ghost" onClick={handleSave}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={handleCancelEdit}>
                    <X className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )}
            {tradingAccounts.map((account) => (
              <TableRow key={account.id}>
                {editingAccount?.id === account.id ? (
                  <>
                    <TableCell>
                      <Input
                        value={editingAccount.account_name}
                        onChange={(e) => setEditingAccount({ ...editingAccount, account_name: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={editingAccount.broker}
                        onValueChange={(value) => setEditingAccount({ ...editingAccount, broker: value as typeof BROKERS[number] })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {BROKERS.map((broker) => (
                            <SelectItem key={broker} value={broker}>
                              {broker}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={editingAccount.profit_calculation_method}
                        onValueChange={(value) => setEditingAccount({ ...editingAccount, profit_calculation_method: value as typeof PROFIT_CALC_METHODS[number] })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PROFIT_CALC_METHODS.map((method) => (
                            <SelectItem key={method} value={method}>
                              {method}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editingAccount.account_balance}
                        onChange={(e) => setEditingAccount({ ...editingAccount, account_balance: parseFloat(e.target.value) })}
                      />
                    </TableCell>
                    <TableCell>{new Date(account.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="icon" variant="ghost" onClick={handleSave}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={handleCancelEdit}>
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{account.account_name}</TableCell>
                    <TableCell>{account.broker}</TableCell>
                    <TableCell>{account.profit_calculation_method}</TableCell>
                    <TableCell>
                      ${account.account_balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>{new Date(account.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="icon" variant="ghost" onClick={() => handleStartEdit(account)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(account.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </>
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

