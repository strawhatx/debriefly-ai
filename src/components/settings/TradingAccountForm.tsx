
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { PROFIT_CALC_METHODS, EditingAccount } from "@/types/trading";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TradingAccountFormProps {
  editingAccount: EditingAccount;
  onUpdate: (account: EditingAccount) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const TradingAccountForm = ({
  editingAccount,
  onUpdate,
  onSave,
  onCancel,
}: TradingAccountFormProps) => {
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

  return (
    <>
      <td>
        <Input
          value={editingAccount.account_name || ''}
          onChange={(e) => onUpdate({ ...editingAccount, account_name: e.target.value })}
          placeholder="Enter account name"
        />
      </td>
      <td>
        <Select
          value={editingAccount.broker_id}
          onValueChange={(value) => onUpdate({ ...editingAccount, broker_id: value })}
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
      </td>
      <td>
        <Select
          value={editingAccount.profit_calculation_method}
          onValueChange={(value) => onUpdate({ ...editingAccount, profit_calculation_method: value as typeof PROFIT_CALC_METHODS[number] })}
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
      </td>
      <td>
        <Input
          type="number"
          step="0.01"
          min="0"
          value={editingAccount.account_balance || ''}
          onChange={(e) => onUpdate({ ...editingAccount, account_balance: parseFloat(e.target.value) })}
          placeholder="Enter balance"
        />
      </td>
      <td className="text-right space-x-2">
        <Button size="icon" variant="ghost" onClick={onSave}>
          <Check className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </td>
    </>
  );
};
