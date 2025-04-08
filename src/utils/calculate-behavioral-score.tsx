interface Trade {
  entry_date: string;
  closing_date: string;
  symbol: string;
  market: string;
  type: 'LONG' | 'SHORT';
  entry: number;
  exit: number;
  risk: number;
  reward: number;
  pnl: number;
  tags: string[];
  strategy: string | null;
}

interface ScoreWeights {
  riskReward: number;
  profitLoss: number;
  holdingTime: number;
  strategy: number;
  emotion: number;
}

const SCORE_WEIGHTS: ScoreWeights = {
  riskReward: 30,
  profitLoss: 20,
  holdingTime: 15,
  strategy: 20,
  emotion: 15,
} as const;

const NEGATIVE_EMOTIONS = [
  'fear',
  'greed',
  'revenge',
  'frustration'
] as const;

const SCORE_CONFIG = {
  maxReward: 10,
  maxHoldingTimeHours: 1,
  winningTradeScore: 20,
  losingTradeScore: 5,
  baseEmotionScore: 15,
  emotionPenalty: 10,
  strategyFollowedScore: 20,
  strategyMissingScore: 10,
} as const;

interface ScoreComponents {
  riskRewardScore: number;
  pnlScore: number;
  holdingTimeScore: number;
  strategyScore: number;
  emotionScore: number;
}

const calculateHoldingTimeInMinutes = (
  closingDate: string, 
  entryDate: string
): number => {
  return (new Date(closingDate).getTime() - new Date(entryDate).getTime()) / (1000 * 60);
};

const calculateRiskRewardScore = (reward: number): number => {
  return (reward / SCORE_CONFIG.maxReward) * SCORE_WEIGHTS.riskReward;
};

const calculatePnLScore = (pnl: number): number => {
  return pnl > 0 ? SCORE_CONFIG.winningTradeScore : SCORE_CONFIG.losingTradeScore;
};

const calculateHoldingTimeScore = (holdingTimeMinutes: number): number => {
  return Math.min(
    (holdingTimeMinutes / 60) * SCORE_WEIGHTS.holdingTime,
    SCORE_WEIGHTS.holdingTime
  );
};

const calculateStrategyScore = (hasStrategy: boolean): number => {
  return hasStrategy 
    ? SCORE_CONFIG.strategyFollowedScore 
    : SCORE_CONFIG.strategyMissingScore;
};

const calculateEmotionScore = (tags: string[]): number => {
  const hasNegativeEmotion = tags.some(tag => 
    NEGATIVE_EMOTIONS.includes(tag.toLowerCase() as typeof NEGATIVE_EMOTIONS[number])
  );

  return SCORE_CONFIG.baseEmotionScore - (
    hasNegativeEmotion ? SCORE_CONFIG.emotionPenalty : 0
  );
};

const validateTrade = (trade: Trade): void => {
  if (!trade.entry_date || !trade.closing_date) {
    throw new Error('Trade must have valid dates');
  }
  if (trade.reward < 0 || trade.risk < 0) {
    throw new Error('Trade must have valid risk/reward values');
  }
};

const scaleScore = (raw: number, from: number, to: number): number => 
  Math.max(0, Math.min(to, (raw / from) * to));

export const calculateBehaviorScore = (trade: Trade): number => {
  validateTrade(trade);

  const scoreComponents: ScoreComponents = {
    riskRewardScore: calculateRiskRewardScore(trade.reward),
    pnlScore: calculatePnLScore(trade.pnl),
    holdingTimeScore: calculateHoldingTimeScore(
      calculateHoldingTimeInMinutes(trade.closing_date, trade.entry_date)
    ),
    strategyScore: calculateStrategyScore(Boolean(trade.strategy)),
    emotionScore: calculateEmotionScore(trade.tags),
  };

  const rawScore = Object.values(scoreComponents).reduce((sum, score) => sum + score, 0);
  return scaleScore(rawScore, 100, 10);
};

interface ScoreResult {
  total: number;
  breakdown: ScoreComponents;
}

export const calculateBehaviorScoreWithBreakdown = (trade: Trade): ScoreResult => {
  validateTrade(trade);

  const breakdown: ScoreComponents = {
    riskRewardScore: calculateRiskRewardScore(trade.reward),
    pnlScore: calculatePnLScore(trade.pnl),
    holdingTimeScore: calculateHoldingTimeScore(
      calculateHoldingTimeInMinutes(trade.closing_date, trade.entry_date)
    ),
    strategyScore: calculateStrategyScore(Boolean(trade.strategy)),
    emotionScore: calculateEmotionScore(trade.tags),
  };

  const rawScore = Object.values(breakdown).reduce((sum, score) => sum + score, 0);

  return {
    total: scaleScore(rawScore, 100, 10),
    breakdown,
  };
};

// Example usage:
/* 
const trade: Trade = {
  entry_date: "2025-03-17T09:30:00Z",
  closing_date: "2025-03-17T10:30:00Z",
  symbol: "ES",
  market: "futures",
  type: "LONG",
  entry: 5000,
  exit: 5050,
  risk: 1,
  reward: 5,
  pnl: 250,
  tags: [],
  strategy: "pullback"
};

console.log("Behavior Score:", calculateBehaviorScore(trade));
*/
