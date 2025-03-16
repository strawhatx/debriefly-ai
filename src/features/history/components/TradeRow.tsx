import { format } from "date-fns";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface Trade {
    id: string;
    symbol: string;
    entry_date: string;
    fill_price: number;
    stop_price: number;
    quantity: number;
    side: string;
    pnl: number | null;
    emotional_tags: string[]
  }

// Trade Row Component
export const TradeRow = ({ trade }: { trade: Trade}) => {
    const isBuy = trade.side?.toUpperCase() === 'LONG' || trade.side?.toUpperCase() === 'CALL';
  
    return (
      <tr className="border-b border-gray-700 hover:bg-gray-700/50">
        <td className="px-6 py-4">{format(new Date(trade.entry_date), "MMM dd yyyy")}</td>
        <td className="px-6 py-4">{trade.symbol}</td>
        <td className="px-6 py-4">
          <span className={`flex items-center gap-1 ${isBuy ? 'text-emerald-400' : 'text-red-400'}`}>
            {isBuy ? (<ArrowUpRight className="w-4 h-4" />) : (<ArrowDownRight className="w-4 h-4" />)}
            {trade.side}
          </span>
        </td>
        <td className="px-6 py-4">{trade.fill_price}</td>
        <td className="px-6 py-4">{trade.stop_price}</td>
        <td className={`px-6 py-4 ${trade.pnl > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {trade.pnl > 0 ? '+' : '-'}${Math.abs(trade.pnl).toFixed(2)}
        </td>
        <td className="px-4 py-4">
          {(trade.emotional_tags?.length > 0) && (
            <span className="px-2 py-1 bg-gray-700 rounded-full text-sm">
              {trade.emotional_tags[0]}
            </span>
          )}
        </td>
      </tr>
    );
  };
  