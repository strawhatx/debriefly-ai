// ✅ CORS Helper Function
export const tradeBehaviorPrompt = (trades: []): String => {
    return `
        Analyze the following trading history for user performance and psychology patterns:

        ${JSON.stringify(trades)}

        **Behavior Tag Validation**  
        - If user-labeled behavior tags (e.g., “FOMO,” “Hesitation”) exist, validate them against trade patterns.  
        - Confirm if the behavior is consistent or an exception.  
        - Provide AI feedback on whether the user’s tagging is accurate.  

        **Pattern Detection (If No Tags Exist)**  
        - If no behavior tags are present, infer psychological patterns such as:  
        - Overtrading (excessive trades within a short time)  
        - Hesitation (delayed entries after valid signals)  
        - Revenge Trading (aggressive trades after consecutive losses)  
        - Emotional Risk-Taking (position size increase after a loss)  
        - Exit Anxiety (premature exits in profitable trades)  
        - FOMO Trading (chasing high-volatility moves without confirmation)  

        **Contextual Trade Analysis**  
        - How did this session compare to the user's past sessions?  
        - Was risk higher/lower than usual?  
        - Were trades consistent with the user's strategy?  

        **Behavior & Performance Correlation**  
        - Check if emotional patterns directly impacted win rate, profit/loss, or risk exposure.  
        - Example: “Trades labeled as ‘FOMO’ had a 30% lower win rate than disciplined trades.”  

        **Personalized AI Insights & Recommendations**  
        For each behavior detected, provide:  
        1️⃣ **Issue Summary** (Explain what the pattern means)  
        2️⃣ **Trade Evidence** (Show examples from user’s data)  
        3️⃣ **Impact on Performance** (How it affected P/L, risk, or consistency)  
        4️⃣ **Actionable Fix** (What the user should do differently)`;
};
