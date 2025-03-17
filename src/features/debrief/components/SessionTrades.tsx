import { useSessionTrades } from '../hooks/use-session-trades';
import { ArrowUpRight, ArrowDownRight, SortAsc } from 'lucide-react';

interface Position {
  id: string;
  time: string;
  symbol: string;
  type: 'LONG' | 'SHORT';
  entry: number;
  exit: number;
  risk: number;
  reward: number;
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

const POSITIVE_TAGS = ['Disciplined', 'Planned', 'Confident'] as const;

const SortableColumn = ({ label, sortKey, onSort }: SortableColumnProps) => (
  <button
    onClick={() => onSort(sortKey)}
    className="flex items-center gap-2 hover:text-gray-300 transition-colors"
  >
    {label}
    <SortAsc className="size-4" />
  </button>
);

const TradeTag = ({ tag }: TradeTagProps) => (
  <span
    className={`px-2 py-1 rounded-full text-xs ${
      POSITIVE_TAGS.includes(tag as typeof POSITIVE_TAGS[number])
        ? 'bg-emerald-500/20 text-emerald-300'
        : 'bg-amber-500/20 text-amber-300'
    }`}
  >
    {tag}
  </span>
);

const TradeTypeIndicator = ({ type }: { type: Position['type'] }) => (
  <span className={`flex items-center gap-1 ${
    type === 'LONG' ? 'text-emerald-400' : 'text-red-400'
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
        <SortableColumn label="Time" sortKey="time" onSort={toggleSort} />
      </th>
      <th className="px-6 py-3 text-left">Symbol</th>
      <th className="px-6 py-3 text-left">Type</th>
      <th className="px-6 py-3 text-left">Entry</th>
      <th className="px-6 py-3 text-left">Exit</th>
      <th className="px-6 py-3 text-left">R:R</th>
      <th className="px-6 py-3 text-left">
        <SortableColumn label="P&L" sortKey="pnl" onSort={toggleSort} />
      </th>
      <th className="px-6 py-3 text-left">Tags</th>
    </tr>
  </thead>
);

const TradeRow = ({ trade }: { trade: Position }) => (
  <tr className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
    <td className="px-6 py-4">{trade.time}</td>
    <td className="px-6 py-4">{trade.symbol}</td>
    <td className="px-6 py-4">
      <TradeTypeIndicator type={trade.type} />
    </td>
    <td className="px-6 py-4">{trade.entry.toFixed(2)}</td>
    <td className="px-6 py-4">{trade.exit.toFixed(2)}</td>
    <td className="px-6 py-4">{trade.risk}:{trade.reward}</td>
    <td className={`px-6 py-4 ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
      {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}
    </td>
    <td className="px-6 py-4">
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

export const SessionTrades = ({ positions }: { positions: Position[] | null }) => {
  const { sortedTrades, toggleSort } = useSessionTrades(positions);

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold">Session Trades</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
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
