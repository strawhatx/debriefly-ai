import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TradeStatistics } from "./components/TradeStatistics";
import { useTrades } from "./hooks/use-trades";
import { useRawTrade } from "./hooks/use-raw-trade";
import { DataTable, createSortableColumn } from "@/components/ui/data-table";
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, ClipboardCopy, Database, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Trade } from "./hooks/use-trades";
import { RawTradeModal } from "./components/RawTradeModal";

const columns = [
  {
    accessorKey: "date",
    header: createSortableColumn("Date"),
  },
  {
    accessorKey: "asset",
    header: "Asset",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className={`flex items-center gap-1 ${
        row.getValue("type") === 'LONG' ? 'text-emerald-400' : 'text-red-400'
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
    cell: ({ row }) => (
      <div className="text-right">
        {row.getValue("entry")?.toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "exit",
    header: "Exit",
    cell: ({ row }) => (
      <div className="text-right">
        {row.getValue("exit")?.toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "pnl",
    header: createSortableColumn("P&L"),
    cell: ({ row }) => (
      <div className={`text-right ${
        row.getValue("pnl") >= 0 ? 'text-emerald-400' : 'text-red-400'
      }`}>
        {row.getValue("pnl") >= 0 ? '+' : ''}{row.getValue("pnl")?.toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "topEmotion",
    header: "Top Emotion",
  },
];

export const History = () => {
  const navigate = useNavigate();
  const { trades, error } = useTrades();
  const [selectedTradeId, setSelectedTradeId] = useState<string | null>(null);
  const { data: rawTrade, isLoading: isLoadingRaw, error: rawError } = useRawTrade(selectedTradeId);

  const handleViewRawData = (tradeId: string) => setSelectedTradeId(tradeId);

  const handleViewNotebook = (tradeId: string) => navigate(`/app/notebook/${tradeId}`);


  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-500">Error: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Trade Statistics */}
      <TradeStatistics trades={trades} />

      {/* Trade Table */}
      {trades.length === 0 ? (
        <p className="text-gray-400">No trades found for this account.</p>
      ) : (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-4">
            <DataTable
              columns={[
                ...columns.slice(0, -1),
                {
                  id: "actions",
                  enableHiding: false,
                  cell: ({ row }) => {
                    const trade = row.original as Trade;
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
                            onClick={() => handleViewRawData(trade.id)}
                          >
                            <Database className="w-4 h-4 mr-2" />
                            View raw data
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleViewNotebook(trade.id)}
                          >
                            <BookOpen className="w-4 h-4 mr-2" />
                            View notebook
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
        </div>
      )}

      {/* Raw Trade Modal */}
      <RawTradeModal
        isOpen={!!selectedTradeId}
        onClose={() => setSelectedTradeId(null)}
        data={rawTrade}
        isLoading={isLoadingRaw}
        error={rawError}
      />
    </div>
  );
};
