
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const TradingAccountsHeader = () => {
  return (
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
  );
};
