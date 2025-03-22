import { useState } from "react";

// Define strict types for our data structures
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

export const useSessionTrades = (positions: Position[]) => {
  if (!positions) return { sortedTrades: [], toggleSort: () => {} };
  
  const [sortField, setSortField] = useState<'time' | 'pnl'>('time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedTrades = [...positions].sort((a, b) => {
    if (sortOrder === 'asc') {
      return sortField === 'time'
        ? a.time.localeCompare(b.time)
        : a.pnl - b.pnl;
    } else {
      return sortField === 'time'
        ? b.time.localeCompare(a.time)
        : b.pnl - a.pnl;
    }
  });

  const toggleSort = (field: 'time' | 'pnl') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return { sortedTrades, toggleSort };
};