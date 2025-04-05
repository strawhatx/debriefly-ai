import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TradeStatistics } from "./components/TradeStatistics";
import { useRawTrade } from "./hooks/use-raw-trade";
import { DataTable, createSortableColumn } from "@/components/ui/data-table";
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, ClipboardCopy, Database, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RawTradeModal } from "./components/RawTradeModal";
import { Card } from "@/components/ui/card";
import { useTrades } from "@/hooks/use-trades";
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

export const History = () => {
  const [mappedTrades, setMappedTrades] = useState<Trade[]>(null);
  const { trades, error } = useTrades();
  const [selectedTradeId, setSelectedTradeId] = useState<string | null>(null);
  const { data: rawTrade, isLoading: isLoadingRaw, error: rawError } = useRawTrade(selectedTradeId);

  const handleViewRawData = (tradeId: string) => setSelectedTradeId(tradeId);
    useEffect(() => {
    // Perform any side effects or data fetching here
    // For example, you might want to fetch trades or update the state
    var result = trades.map((trade) => {
      return {
        id: trade.id,
        date: trade.entry_date,
        asset: trade.symbol,
        type: trade.position_type,
        entry: trade.fill_price,
        exit: trade.stop_price,
        pnl: trade.pnl,
        topEmotion: trade.tags[0] || "None",
        fees: trade.fees,
        emotional_tags: trade.tags || null,
      }
    });

    setMappedTrades(result);
  }, [trades]);

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
      {!mappedTrades || mappedTrades.length === 0 ? (
        <p className="text-gray-400">No trades found for this account.</p>
      ) : (
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
                            onClick={() => handleViewRawData(trade.id)}
                          >
                            <Database className="w-4 h-4 mr-2" />
                            View raw data
                          </DropdownMenuItem>
                          {/*
                            <DropdownMenuItem
                            onClick={() => handleViewNotebook(trade.id)}
                          >
                            <BookOpen className="w-4 h-4 mr-2" />
                            View notebook
                          </DropdownMenuItem>
                          */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )
                  },
                },
              ]}
              data={mappedTrades}
              searchKey="asset"
              searchPlaceholder="Search by asset..."
              pageSize={10}
            />
          </div>
        </Card>
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
