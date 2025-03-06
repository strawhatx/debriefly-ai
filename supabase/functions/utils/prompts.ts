// ✅ Enhanced Trade Behavior Analysis Prompt
export const tradeBehaviorPrompt = (trades): string => {
    return `
        Analyze the following trading history for user performance, psychology patterns, and behavioral improvements:

        ${JSON.stringify(trades, null, 2)}

        ---
        
        **📌 Behavior Tag Validation**  
        - If user-labeled behavior tags (e.g., “FOMO,” “Hesitation”) exist, validate them against trade patterns.  
        - Confirm if the behavior is consistent or an exception.  
        - Provide AI feedback on whether the user’s tagging is accurate.  

        **🧠 Pattern Detection (If No Tags Exist)**  
        - If no behavior tags are present, infer psychological patterns such as:  
        - **Overtrading** (excessive trades within a short time)  
        - **Hesitation** (delayed entries after valid signals)  
        - **Revenge Trading** (aggressive trades after consecutive losses)  
        - **Emotional Risk-Taking** (position size increase after a loss)  
        - **Exit Anxiety** (premature exits in profitable trades)  
        - **FOMO Trading** (chasing high-volatility moves without confirmation)  
        
        **📈 Statistical Insights & Performance Metrics**  
        - Calculate **win rate**, **profit/loss**, and **risk exposure** for each behavior.  
        - Example: “Trades labeled as ‘FOMO’ had a **30% lower win rate** than disciplined trades.”  
        - Compare these stats against the user’s past performance to identify improvements or regressions.  

        **📊 Behavior & Performance Correlation**  
        - Did emotional patterns **directly impact** profitability, consistency, or risk exposure?  
        - How do the most recent trades compare to past sessions? Has the user improved?  
        - Example: “Compared to last month, **hesitation in entries decreased by 20%, improving win rate by 8%**.”  

        **🎯 Personalized AI Insights & Recommendations**  
        For each detected behavior, provide:  
        1️⃣ **Issue Summary** (Explain the behavioral pattern)  
        2️⃣ **Trade Evidence** (Show examples from user’s data)  
        3️⃣ **Impact on Performance** (How it affected P/L, risk, or consistency)  
        4️⃣ **Actionable Fix** (What the user should do differently in their next session)  

        **🔥 Final Recommendation**  
        - What are the **top 2 improvements** the trader should focus on for the next session?  
        - Suggest **practical steps** (e.g., “Limit trades to max 3 per session” or “Use stop-loss discipline to avoid revenge trades”).  
    `;
};
