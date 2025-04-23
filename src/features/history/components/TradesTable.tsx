import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DataTable, createSortableColumn } from "@/components/ui/data-table";
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, ClipboardCopy, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";

interface Trade {
  id: string;
  date: string;
  asset: string;
  type: 'LONG' | 'SHORT';
  entry: number;
  exit: number;
  pnl: number;
  topEmotion: string;
  fees: number;
  emotional_tags: string[] | null;
}

interface TradesTableProps {
  trades: Trade[];
  onViewRawData: (tradeId: string) => void;
}

const columns = [
  {
    accessorKey: "date",
    header: createSortableColumn("Date"),
    cell: ({ row }) => (
      <div>
        {format(new Date(row.getValue("date")), "yyyy-MM-dd")}
      </div>
    ),
  },
  {
    accessorKey: "asset",
    header: "Asset",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className={`flex items-center gap-1 ${row.getValue("type") === 'LONG' ? 'text-emerald-400' : 'text-red-400'
        }`}>
        {row.getValue("type") === 'LONG' ? (
          <ArrowUpRight className="w-4 h-4" />
        ) : (
          <ArrowDownRight className="w-4 h-4" />
        )}
        {row.getValue("type")}
      </span>
    ),
  },
  {
    accessorKey: "entry",
    header: "Entry",
    meta: {
      className: "hidden lg:table-cell", // Hidden on small screens
    },
    cell: ({ row }) => (
      <div>
        {row.getValue("entry")?.toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "exit",
    header: "Exit",
    meta: {
      className: "hidden lg:table-cell", // Hidden on small screens
    },
    cell: ({ row }) => (
      <div>
        {row.getValue("exit")?.toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "pnl",
    header: createSortableColumn("P&L"),
    cell: ({ row }) => (
      <div className={`${row.getValue("pnl") >= 0 ? 'text-emerald-400' : 'text-red-400'
        }`}>
        {row.getValue("pnl") >= 0 ? '+' : ''}{row.getValue("pnl")?.toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "topEmotion",
    header: "Top Emotion",
    meta: {
      className: "hidden lg:table-cell", // Hidden on small screens
    },
  },
];

export const TradesTable = ({ trades, onViewRawData }: TradesTableProps) => {
  if (!trades || trades.length === 0) {
    return <p className="text-gray-400">No trades found for this account.</p>;
  }

  return (
    <Card className="relative w-full overflow-auto">
      <div className="p-4">
        <DataTable
          columns={[
            ...columns.slice(0, -1),
            {
              id: "actions",
              enableHiding: false,
              cell: ({ row }) => {
                const trade = row.original;
                return (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-900" align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(trade.id)}
                      >
                        <ClipboardCopy className="w-4 h-4 mr-2" />
                        Copy trade ID
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(trade.asset)}
                      >
                        <ClipboardCopy className="w-4 h-4 mr-2" />
                        Copy asset
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onViewRawData(trade.id)}
                      >
                        <Database className="w-4 h-4 mr-2" />
                        View raw data
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              },
            },
          ]}
          data={trades}
          searchKey="asset"
          searchPlaceholder="Search by asset..."
          pageSize={10}
        />
      </div>
    </Card>
  );
}; 