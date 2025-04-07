
export const calculateDiscipline = (trade: {
    type: 'LONG' | 'SHORT'; entry: number; exit: number; reward: number|null; tags?: string[] | null;
}): number => {
    if (!trade || !trade.entry || !trade.exit) return 0;

    const reward = trade.reward
    const tags = trade.tags || [];
    let score = 10;

    if (!reward || reward <= 0) {
        score -= 2; // Can't verify target exit, minor penalty
    } else {
        const expectedGain = trade.entry * reward;

        const actualGain = Math.abs(trade.exit - trade.entry);
        const ratioHit = actualGain / expectedGain;

        // Reward if within 80% to 120% of target
        if (ratioHit >= 0.8 && ratioHit <= 1.2) {
            score += 1;
        } else {
            score -= Math.min(3, Math.abs(1 - ratioHit) * 5); // Penalize based on deviation
        }
    }

    // Penalize bad discipline tags
    const disciplineBreakingTags = ['fomo', 'revenge', 'fear', 'impatience', 'greed'];
    const emotionalPenalties = tags.filter(tag =>  disciplineBreakingTags.includes(tag.toLowerCase())).length;

    score -= emotionalPenalties * 2;

    // Clamp between 0 and 10
    return Math.max(0, Math.min(10, score));
}
