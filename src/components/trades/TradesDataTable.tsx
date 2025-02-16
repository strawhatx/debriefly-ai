
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { format } from "date-fns";

export interface Trade {
  id: string;
  symbol: string;
  entry_date: string;
  closing_date: string | null;
  fill_price: number;
  quantity: number;
  side: string;
  pnl: number | null;
  fees: number;
  trading_accounts: {
    account_name: string;
  };
}

interface TradingAccount {
  id: string;
  account_name: string;
}

interface TradesDataTableProps {
  trades: Trade[];
  isLoading: boolean;
  tradingAccounts: TradingAccount[];
  selectedAccount: string;
  onAccountChange: (value: string) => void;
}

export const TradesDataTable = ({
  trades,
  isLoading,
  tradingAccounts,
  selectedAccount,
  onAccountChange,
}: TradesDataTableProps) => {
  const [search, setSearch] = useState("");

  const filteredTrades = trades.filter((trade) =>
    trade.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-[200px]">
          <Select value={selectedAccount} onValueChange={onAccountChange}>
            <SelectTrigger>
              <SelectValue placeholder="All accounts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All accounts</SelectItem>
              {tradingAccounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.account_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Side</TableHead>
              <TableHead>Entry Date</TableHead>
              <TableHead>Exit Date</TableHead>
              <TableHead>Entry Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Fees</TableHead>
              <TableHead className="text-right">P&L</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredTrades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  No trades found
                </TableCell>
              </TableRow>
            ) : (
              filteredTrades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell>{trade.trading_accounts.account_name}</TableCell>
                  <TableCell>{trade.symbol}</TableCell>
                  <TableCell>{trade.side}</TableCell>
                  <TableCell>
                    {format(new Date(trade.entry_date), "MMM d, yyyy HH:mm")}
                  </TableCell>
                  <TableCell>
                    {trade.closing_date
                      ? format(new Date(trade.closing_date), "MMM d, yyyy HH:mm")
                      : "-"}
                  </TableCell>
                  <TableCell>${trade.fill_price.toFixed(2)}</TableCell>
                  <TableCell>{trade.quantity}</TableCell>
                  <TableCell>${trade.fees.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    {trade.pnl !== null ? (
                      <span
                        className={
                          trade.pnl >= 0 ? "text-green-600" : "text-red-600"
                        }
                      >
                        ${trade.pnl.toFixed(2)}
                      </span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
