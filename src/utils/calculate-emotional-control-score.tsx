import { emotionAttributes } from "./constants";

// Function to calculate emotional control score based on emotion percentages
export const calculateEmotionalControlScore = (tagPercentages: { tag: string; percentage: string }[]): number => {
    if (!tagPercentages.length) return 0;
    // Calculate weighted scores
    let positiveScore = 0;
    let neutralScore = 0;
    let negativeScore = 0;
  
    tagPercentages.forEach(({ tag, percentage }) => {
      const percentageValue = parseFloat(percentage);
      const { type } = emotionAttributes[tag];
      
      if (type === "POSITIVE") {
        positiveScore += percentageValue;
      } else if (type === "NEUTRAL") {
        neutralScore += percentageValue;
      } else {
        negativeScore += percentageValue;
      }
    });
  
    // Calculate final score (0-10 scale)
    // Positive emotions contribute positively, negative emotions contribute negatively
    // Neutral emotions have a small positive contribution
    const score = (positiveScore * 0.1) + (neutralScore * 0.05) - (negativeScore * 0.05);
    
    // Normalize to 0-10 range and ensure it's within bounds
    const normalizedScore = Math.min(Math.max(score, 0), 10);
    
    // Round to 1 decimal place
    return Math.round(normalizedScore * 10) / 10;
  };