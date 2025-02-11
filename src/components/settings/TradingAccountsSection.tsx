
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TradingAccountsSectionProps {
  tradingAccounts: any[];
  setTradingAccounts: (accounts: any[]) => void;
}

export const TradingAccountsSection = ({ tradingAccounts, setTradingAccounts }: TradingAccountsSectionProps) => {
  const { toast } = useToast();
  const [newAccountName, setNewAccountName] = useState("");

  const handleAddTradingAccount = async () => {
    if (!newAccountName.trim()) {
      toast({
        title: "Error",
        description: "Please enter an account name",
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
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setTradingAccounts([data, ...tradingAccounts]);
      setNewAccountName("");
      
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
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Trading Accounts</h3>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Enter account name"
              value={newAccountName}
              onChange={(e) => setNewAccountName(e.target.value)}
              className="w-64"
            />
            <Button onClick={handleAddTradingAccount}>Add Account</Button>
          </div>
        </div>
        <div className="space-y-4">
          {tradingAccounts.map((account) => (
            <div key={account.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{account.account_name}</h4>
                  <p className="text-sm text-muted-foreground">
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
