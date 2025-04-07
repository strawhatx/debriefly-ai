import { allTags, emotionAttributes } from '@/utils/constants';
import { useSessionTrades } from '../hooks/use-session-trades';
import { ArrowUpRight, ArrowDownRight, SortAsc, Calendar } from 'lucide-react';
import { useState } from 'react';

interface Position {
  id: string;
  date: string;
  symbol: string;
  type: 'LONG' | 'SHORT';
  pnl: number;
  tags: string[];
}

interface SortableColumnProps {
  label: string;
  sortKey: string;
  onSort: (key: string) => void;
}

interface TradeTagProps {
  tag: string;
}

const SortableColumn = ({ label, sortKey, onSort }: SortableColumnProps) => (
  <button
    onClick={() => onSort(sortKey)}
    className="flex items-center gap-2 hover:text-gray-300 transition-colors"
  >
    {label}
    <SortAsc className="size-4" />
  </button>
);

const TradeTag = ({ tag }: TradeTagProps) => {
  const { colorClass, icon } = emotionAttributes[tag] || {
    colorClass: "text-gray-400 bg-gray-900/50",
    icon: "❓",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-sm ${colorClass}`}>
      {icon} {tag}
    </span>
  )
};

const TradeTypeIndicator = ({ type }: { type: Position['type'] }) => (
  <span className={`flex items-center gap-1 ${type === 'LONG' ? 'text-emerald-400' : 'text-red-400'
    }`}>
    {type === 'LONG'
      ? <ArrowUpRight className="size-4" />
      : <ArrowDownRight className="size-4" />
    }
    {type}
  </span>
);

const TableHeader = ({ toggleSort }: { toggleSort: (key: string) => void }) => (
  <thead>
    <tr className="border-b border-gray-700">
      <th className="px-6 py-3 text-left">
        <SortableColumn label="Date" sortKey="date" onSort={toggleSort} />
      </th>
      <th className="px-6 py-3 text-left">Asset</th>
      <th className="px-6 py-3 text-left hidden sm:table-cell">Type</th>
      <th className="px-6 py-3 text-left">
        <SortableColumn label="P&L" sortKey="pnl" onSort={toggleSort} />
      </th>
      <th className="px-6 py-3 text-left hidden lg:table-cell">Tags</th>
    </tr>
  </thead>
);

const TradeRow = ({ trade }: { trade: Position }) => (
  <tr className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
    <td className="px-6 py-4">{trade.date}</td>
    <td className="px-6 py-4">{trade.symbol}</td>
    <td className="px-6 py-4 hidden sm:table-cell">
      <TradeTypeIndicator type={trade.type} />
    </td>
    <td className={`px-6 py-4 ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
      {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}
    </td>
    <td className="px-6 py-4 hidden lg:table-cell">
      <div className="flex gap-2 flex-wrap">
        {trade.tags.map((tag, index) => (
          <TradeTag key={`${trade.id}-${tag}-${index}`} tag={tag} />
        ))}
      </div>
    </td>
  </tr>
);

const EmptyState = () => (
  <tr>
    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
      No trades available for this session
    </td>
  </tr>
);

export const TradeReview = ({ trades }: { trades: Position[] | null }) => {
  const [selectedBehavior, setSelectedBehavior] = useState<string | null>(null);

  // Filter trades by selected behavior
  const filteredTrades = selectedBehavior ? trades.filter(trade => trade.tags.includes(selectedBehavior)) : trades;

  const { sortedTrades, toggleSort } = useSessionTrades(filteredTrades);

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="text-blue-400" />
          Detailed Trade Review
        </h2>
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
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <TableHeader toggleSort={toggleSort} />
          <tbody>
            {sortedTrades.length > 0
              ? sortedTrades.map((trade) => (
                <TradeRow key={trade.id} trade={trade} />
              ))
              : <EmptyState />
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};
