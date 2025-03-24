export const tradeDebriefPrompt = (tradesByDay) => {
  return `
Analyze the following trading history and provide a structured JSON response for each trading day. The trading data is:

${JSON.stringify(tradesByDay, null, 2)}

Please provide your analysis in the following JSON format:

{
  "strengths": {
    "patterns": [], // Array of successful trading patterns identified
    "execution": [], // Array of well-executed trading decisions
    "improvements": [] // Array of improvements from previous sessions
  },
  "behavioral_insights": {
    "positive_traits": [], // Array of positive behavioral patterns
    "negative_traits": [], // Array of concerning behavioral patterns
    "emotional_trends": [] // Array of emotional patterns affecting performance
  },
  "areas_for_improvement": {
    "patterns": [], // Array of patterns needing attention
    "recurring_mistakes": [], // Array of recurring issues
    "missed_opportunities": [] // Array of missed trading opportunities
  },
  "strategy_suggestions": {
    "optimizations": [], // Array of strategy optimization recommendations
    "risk_management": [], // Array of risk management adjustments
    "tactical_changes": [] // Array of specific tactical improvements
  },
  "actionable_improvements": {
    "priority_focus": [], // Top 2 improvements to focus on
    "practical_steps": [], // Array of specific action items
    "progress_metrics": [] // Array of metrics to track improvement
  },
  "summary": "" // A brief overall session summary
}

Ensure each array contains 2-3 specific, detailed points. Keep the analysis constructive and balanced between recognizing strengths and areas for growth. Focus on actionable insights that can lead to measurable improvements.

Return ONLY the JSON object with no additional text or formatting.
`;
};