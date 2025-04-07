
export const calculateConfidence = (trade: {
  pnl: number;  reward?: number; strategy?: string | null; tags?: string[] | null;
}): number =>{
  if (!trade) return 0;

  let score = 5; // Neutral starting point

  const rr = trade.reward;
  if (rr && rr >= 2) score += 1; // Good RR
  else if (rr && rr < 1) score -= 1;

  // 2. PnL based confidence
  if (trade.pnl > 0) score += 2;
  else if (trade.pnl < 0) score -= 2;

  // 3. Strategy usage
  if (trade.strategy) score += 1;
  else score -= 1;

  // 4. Emotional tags
  const tags = trade.tags?.map(tag => tag.toLowerCase()) || [];

  const confidentTags = ['calm', 'clear', 'confident'];
  const insecureTags = ['fomo', 'fear', 'doubt', 'revenge', 'hesitation'];

  tags.forEach(tag => {
    if (confidentTags.includes(tag)) score += 1;
    if (insecureTags.includes(tag)) score -= 1;
  });

  // Clamp score between 0 and 10
  return Math.max(0, Math.min(10, score));
}
