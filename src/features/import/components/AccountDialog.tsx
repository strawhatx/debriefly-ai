
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MARKETS, EditingAccount } from "@/types/trading";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";

interface AccountDialogProps {
  refreshAccounts: () => void;
}

export const AccountDialog = ({ refreshAccounts }: AccountDialogProps) => {
  const { toast } = useToast();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [account, setAccount] = useState<EditingAccount>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleSave = async () => {
    if (!account) return;

    if (!account.account_name?.trim()) {
      toast({
        title: "Error",
        description: "Please enter an account name",
        variant: "destructive",
      });
      return;
    }

    if (!account.broker_id) {
      toast({
        title: "Error",
        description: "Please select a broker",
        variant: "destructive",
      });
      return;
    }

    if (!account.account_balance || isNaN(Number(account.account_balance)) || Number(account.account_balance) < 0) {
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

      const { error } = await supabase
        .from('trading_accounts')
        .insert([{
          account_name: account.account_name,
          user_id: user.id,
          broker_id: account.broker_id,
          market: account.market,
          account_balance: Number(account.account_balance)
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

      refreshAccounts();

      setAccount(null);
      toast({
        title: "Success",
        description: `Trading account added successfully`,
      });
    } catch (error: any) {
      console.error('Error saving trading account:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to add trading account`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
      <DialogTrigger asChild>
        <Button variant="link">
          here
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Account</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="file">Account Name</Label>
            <Input
              value={account.account_name || ''}
              onChange={(e) => setAccount({ ...account, account_name: e.target.value })}
              placeholder="Enter account name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">Broker</Label>
            <Select
              value={account.broker_id}
              onValueChange={(value) => setAccount({ ...account, broker_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select broker" />
              </SelectTrigger>
              <SelectContent>
                {brokers?.map((broker) => (
                  <SelectItem key={broker.id} value={broker.id}>
                    {broker.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">Market</Label>
            <Select
              value={account.market}
              onValueChange={(value) => setAccount({ ...account, market: value as typeof MARKETS[number] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                {MARKETS.map((market) => (
                  <SelectItem key={market} value={market}>
                    {market}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={account.account_balance || ''}
              onChange={(e) => setAccount({ ...account, account_balance: parseFloat(e.target.value) })}
              placeholder="Enter balance"
            />
          </div>

          <Button size="icon" disabled={isUploading} onClick={handleSave}>
            <Check className="h-4 w-4" />
            {isUploading ? "Uploading..." : "Start Import"}
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
};
