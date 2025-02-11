
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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

interface TradingAccountsSectionProps {
  tradingAccounts: any[];
  setTradingAccounts: (accounts: any[]) => void;
}

export const TradingAccountsSection = ({ tradingAccounts, setTradingAccounts }: TradingAccountsSectionProps) => {
  const { toast } = useToast();
  const [newAccountName, setNewAccountName] = useState("");
  const [newBroker, setNewBroker] = useState<typeof BROKERS[number]>("Coinbase");
  const [newProfitCalcMethod, setNewProfitCalcMethod] = useState<typeof PROFIT_CALC_METHODS[number]>("FIFO");
  const [newAccountBalance, setNewAccountBalance] = useState("");

  const handleAddTradingAccount = async () => {
    if (!newAccountName.trim()) {
      toast({
        title: "Error",
        description: "Please enter an account name",
        variant: "destructive",
      });
      return;
    }

    if (!newAccountBalance || isNaN(Number(newAccountBalance)) || Number(newAccountBalance) < 0) {
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

      const { data, error } = await supabase
        .from('trading_accounts')
        .insert([{ 
          account_name: newAccountName,
          user_id: user.id,
          broker: newBroker,
          profit_calculation_method: newProfitCalcMethod,
          account_balance: Number(newAccountBalance)
        }])
        .select()
        .single();

      if (error) throw error;

      setTradingAccounts([data, ...tradingAccounts]);
      setNewAccountName("");
      setNewBroker("Coinbase");
      setNewProfitCalcMethod("FIFO");
      setNewAccountBalance("");
      
      toast({
        title: "Success",
        description: "Trading account added successfully",
      });
    } catch (error: any) {
      console.error('Error adding trading account:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add trading account",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTradingAccount = async (id: string) => {
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
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Trading Accounts</h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                placeholder="Enter account name"
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="broker">Broker</Label>
              <Select
                value={newBroker}
                onValueChange={(value) => setNewBroker(value as typeof BROKERS[number])}
              >
                <SelectTrigger id="broker">
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
            </div>

            <div className="grid gap-2">
              <Label htmlFor="profitCalcMethod">Profit Calculation Method</Label>
              <Select
                value={newProfitCalcMethod}
                onValueChange={(value) => setNewProfitCalcMethod(value as typeof PROFIT_CALC_METHODS[number])}
              >
                <SelectTrigger id="profitCalcMethod">
                  <SelectValue placeholder="Select profit calculation method" />
                </SelectTrigger>
                <SelectContent>
                  {PROFIT_CALC_METHODS.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="accountBalance">Account Balance</Label>
              <Input
                id="accountBalance"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter account balance"
                value={newAccountBalance}
                onChange={(e) => setNewAccountBalance(e.target.value)}
              />
            </div>

            <Button onClick={handleAddTradingAccount} className="w-full">
              Add Account
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {tradingAccounts.map((account) => (
            <div key={account.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">{account.account_name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {account.broker} • {account.profit_calculation_method}
                  </p>
                  <p className="text-sm font-medium">
                    Balance: ${account.account_balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Created on {new Date(account.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-x-2">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteTradingAccount(account.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {tradingAccounts.length === 0 && (
            <p className="text-muted-foreground text-center py-4">
              No trading accounts yet. Add your first one!
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};
