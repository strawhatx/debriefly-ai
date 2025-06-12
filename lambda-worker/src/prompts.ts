import { Json } from './types';

export function generateTradeAnalysisPrompt(trades: Json[]): string {
  return `
Analyze the following trading history and provide a structured JSON response for each trading day. The trading data is:

${JSON.stringify(trades, null, 2)}

Please provide your analysis in the following JSON format:

{
  "what_went_well": []
  "areas_for_improvement": [],
  "strategy_recommendations": [
    {
      "title": "",
      "description": "",
      "predicted_win_rate_increase": ""
    }
  ],
  "behavior_insights": [
    {
      "title": "",
      "description": "",
      "recommendation": ""
    }
  ]
}

Requirements:
- "what_went_well" must contain at least 2 items in each array
- "areas_for_improvement" must contain at least 2 items in each array
- "strategy_recommendations" must contain exactly 3 recommendations
- "behavior_insights" must contain exactly 3 insights
- All descriptions should be specific and actionable
- Win rate increases should be expressed as percentages

Return ONLY the JSON object with no additional text or formatting.`;
} 