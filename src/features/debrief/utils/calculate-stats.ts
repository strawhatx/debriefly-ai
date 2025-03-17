interface Position {
  risk: number;
  reward: number;
  outcome: 'win' | 'loss';
  // add other position fields as needed
}

export const calculateStats = (positions: Position[]) => {
  if (!positions?.length) {
    return {
      totalTrades: 0,
      profitFactor: 0,
      averageRR: 0,
      totalTradesChange: 0,
      profitFactorChange: 0,
      rrChange: 0,
    };
  }

  const wins = positions.filter(p => p.outcome === 'win');
  const losses = positions.filter(p => p.outcome === 'loss');
  
  const totalWins = wins.reduce((sum, p) => sum + p.reward, 0);
  const totalLosses = Math.abs(losses.reduce((sum, p) => sum + p.risk, 0));
  
  const profitFactor = totalLosses === 0 ? totalWins : totalWins / totalLosses;
  const averageRR = positions.reduce((sum, p) => sum + (p.reward / p.risk), 0) / positions.length;

  return {
    totalTrades: positions.length,
    profitFactor,
    averageRR,
    totalTradesChange: 0, // You'll need to implement the change calculation
    profitFactorChange: 0,
    rrChange: 0,
  };
}; 