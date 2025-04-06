import { useState } from "react";

// Define strict types for our data structures
interface Position {
  id: string;
  date: string;
  symbol: string;
  type: 'LONG' | 'SHORT';
  pnl: number;
  tags: string[];
}

export const useSessionTrades = (positions: Position[]) => {
  if (!positions) return { sortedTrades: [], toggleSort: () => {} };
  
  const [sortField, setSortField] = useState<'date' | 'pnl'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedTrades = [...positions].sort((a, b) => {
    if (sortOrder === 'asc') {
      return sortField === 'date'
        ? a.date.localeCompare(b.date)
        : a.pnl - b.pnl;
    } else {
      return sortField === 'date'
        ? b.date.localeCompare(a.date)
        : b.pnl - a.pnl;
    }
  });

  const toggleSort = (field: 'date' | 'pnl') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return { sortedTrades, toggleSort };
};