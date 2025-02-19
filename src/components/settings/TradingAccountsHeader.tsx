
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const TradingAccountsHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="text-leftt">Name</TableHead>
        <TableHead className="text-left">Broker</TableHead>
        <TableHead className="text-left">Profit Calculation</TableHead>
        <TableHead className="text-left">Balance</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
