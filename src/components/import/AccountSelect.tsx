
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
}

interface AccountSelectProps {
  accounts: TradingAccount[] | undefined;
  selectedAccount: string;
  onAccountChange: (value: string) => void;
}

export const AccountSelect = ({
  accounts,
  selectedAccount,
  onAccountChange,
}: AccountSelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="account">Trading Account</Label>
      <Select value={selectedAccount} onValueChange={onAccountChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select an account" />
        </SelectTrigger>
        <SelectContent>
          {accounts?.map((account) => (
            <SelectItem key={account.id} value={account.id}>
              {account.account_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
