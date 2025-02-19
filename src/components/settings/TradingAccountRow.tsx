
import { Button } from "@/components/ui/button";
import { Pencil, X } from "lucide-react";
import { TradingAccount } from "@/types/trading";

interface TradingAccountRowProps {
  account: TradingAccount;
  onEdit: (account: TradingAccount) => void;
  onDelete: (id: string) => void;
}

export const TradingAccountRow = ({
  account,
  onEdit,
  onDelete,
}: TradingAccountRowProps) => {
  return (
    <>
      <td className="px-4">{account.account_name}</td>
      <td className="px-4"> {account.broker?.name || 'N/A'}</td>
      <td className="px-4">{account.profit_calculation_method}</td>
      <td className="px-4">
        ${account.account_balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </td>
      <td className="text-right space-x-2">
        <Button size="icon" variant="ghost" onClick={() => onEdit(account)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={() => onDelete(account.id)}>
          <X className="h-4 w-4" />
        </Button>
      </td>
    </>
  );
};
