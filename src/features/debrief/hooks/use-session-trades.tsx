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
      if (sortField === 'time') {
        // Parse the time strings to Date objects for proper comparison
        const dateA = new Date(a.time);
        const dateB = new Date(b.time);
        return dateA.getTime() - dateB.getTime();
      } else {
        return a.pnl - b.pnl;
      }
    } else {
      if (sortField === 'time') {
        // Parse the time strings to Date objects for proper comparison
        const dateA = new Date(a.time);
        const dateB = new Date(b.time);
        return dateB.getTime() - dateA.getTime();
      } else {
        return b.pnl - a.pnl;
      }
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