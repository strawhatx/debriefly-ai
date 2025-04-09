import { allTags, emotionAttributes } from '@/utils/constants';
import { ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { DataTable } from '@/components/ui/data-table';
import { Card } from '@/components/ui/card';

interface Position {
  id: string;
  date: string;
  symbol: string;
  type: 'LONG' | 'SHORT';
  pnl: number;
  tags: string[];
}

interface TradeReviewProps {
  trades: Position[] | null;
}

// Columns definition moved outside the component
const columns = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }: { row: any }) => (
      <div>{format(new Date(row.getValue("date")), "yyyy-MM-dd")}</div>
    ),
  },
  {
    accessorKey: "symbol",
    header: "Asset",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }: { row: any }) => (
      <span
        className={`flex items-center gap-1 ${row.getValue("type") === 'LONG' ? 'text-emerald-400' : 'text-red-400'
          }`}
      >
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
    accessorKey: "pnl",
    header: "P&L",
    cell: ({ row }: { row: any }) => (
      <div
        className={`${row.getValue("pnl") >= 0 ? 'text-emerald-400' : 'text-red-400'
          }`}
      >
        {row.getValue("pnl") >= 0 ? '+' : ''}
        {row.getValue("pnl")?.toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "tags",
    header: "Emotions",
    meta: {
      className: "hidden lg:table-cell", // Hidden on small screens
    },
    cell: ({ row }: { row: any }) => (
      <div className="flex gap-2 flex-wrap">
        {row.getValue("tags").map((tag: string, index: number) => (
          <TradeTag key={`${tag}-${index}`} tag={tag} />
        ))}
      </div>
    ),
  },
];

// TradeTag Component
const TradeTag = ({ tag }: { tag: string }) => {
  const { colorClass, icon } = emotionAttributes[tag] || {
    colorClass: "text-gray-400 bg-gray-900/50",
    icon: "❓",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-sm ${colorClass}`}>
      {icon} {tag}
    </span>
  );
};

// BehaviorFilter Component
const BehaviorFilter = ({
  selectedBehavior,
  setSelectedBehavior,
}: {
  selectedBehavior: string | null;
  setSelectedBehavior: (behavior: string | null) => void;
}) => (
  <div className="flex items-center gap-2">
    <span className="text-sm text-gray-400">Filter by behavior:</span>
    <select
      className="px-3 py-1 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
      value={selectedBehavior || ''}
      onChange={(e) => setSelectedBehavior(e.target.value || null)}
    >
      <option value="">All Behaviors</option>
      {allTags.map((tag, index) => (
        <option key={index} value={tag}>
          {tag}
        </option>
      ))}
    </select>
  </div>
);

// Main TradeReview Component
export const TradeReview = ({ trades }: TradeReviewProps) => {
  const [selectedBehavior, setSelectedBehavior] = useState<string | null>(null);

  // Memoized filtered trades
  const filteredTrades = useMemo(() => {
    if (!trades) return [];
    return selectedBehavior
      ? trades.filter((trade) => trade.tags.includes(selectedBehavior))
      : trades;
  }, [trades, selectedBehavior]);

  return (
    <Card className="bg-gray-800 rounded-xl border border-gray-700 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
          <Calendar className="text-blue-400" />
          Detailed Trade Review
        </h2>
        <BehaviorFilter
          selectedBehavior={selectedBehavior}
          setSelectedBehavior={setSelectedBehavior}
        />
      </div>

      <div className="overflow-x-auto">
        {filteredTrades.length > 0 ? (
          <DataTable
            columns={columns} 
            data={filteredTrades}
            toolbarEnabled={false}
            pageSize={6}
          />
        ) : (
          <div className="p-4 flex items-center justify-center text-gray-400 min-h-44">
            No trades match the selected behavior.
          </div>
        )}
      </div>
    </Card>
  );
};
