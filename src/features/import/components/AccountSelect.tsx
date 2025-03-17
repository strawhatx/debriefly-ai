
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AccountDialog } from "./AccountDialog";
import { useTradingAccounts } from "../hooks/use-trading-accounts";

interface AccountSelectProps {
  brokerId: string;
  selectedAccount: string;
  onAccountSelected: (accountId: string) => void;
}

export const AccountSelect = ({ brokerId, selectedAccount, onAccountSelected }: AccountSelectProps) => {
  const { tradingAccounts: accounts, refresh, isLoading } = useTradingAccounts(brokerId);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>Trading Account</Label>
        <div className="h-10 animate-pulse bg-muted rounded-md" />
      </div>
    );
  }

  if (!accounts || accounts.length === 0) {
    return (
      <div className="space-y-2">
        <Label>Trading Account</Label>
        <div className="text-sm text-muted-foreground">
          No trading accounts found for this broker. Please create one -- <AccountDialog onSave={refresh} />.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="account">Trading Account</Label>
      <Select value={selectedAccount} onValueChange={onAccountSelected}>
        <SelectTrigger id="account">
          <SelectValue placeholder="Select an account" />
        </SelectTrigger>
        <SelectContent>
          {accounts.map((account) => (
            <SelectItem key={account.id} value={account.id}>
              {account.account_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
