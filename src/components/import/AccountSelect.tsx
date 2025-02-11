
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface TradingAccount {
  id: string;
  account_name: string;
  broker?: {
    id: string;
    name: string;
    description?: string;
  };
}

interface AccountSelectProps {
  accounts: TradingAccount[] | undefined;
  selectedAccount: string;
  onAccountChange: (value: string) => void;
  isLoading?: boolean;
}

export const AccountSelect = ({
  accounts,
  selectedAccount,
  onAccountChange,
  isLoading = false,
}: AccountSelectProps) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>Trading Account</Label>
        <div className="h-10 animate-pulse bg-muted rounded-md" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="account">Trading Account</Label>
      <Select value={selectedAccount} onValueChange={onAccountChange}>
        <SelectTrigger id="account">
          <SelectValue placeholder="Select an account" />
        </SelectTrigger>
        <SelectContent>
          {accounts?.map((account) => (
            <SelectItem key={account.id} value={account.id}>
              {account.account_name} {account.broker?.name ? `(${account.broker.name})` : ''}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
