
import { TableCell, TableRow } from "@/components/ui/table";

export const EmptyTradingAccounts = () => {
  return (
    <TableRow>
      <TableCell colSpan={6} className="text-center text-muted-foreground py-4">
        No trading accounts yet. Click "Add Account" to create your first one!
      </TableCell>
    </TableRow>
  );
};
