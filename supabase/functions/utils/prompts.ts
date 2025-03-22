export const tradeDebriefPrompt = (tradesByDay) => {
  return `
For each trading day, analyze the trading history and provide a comprehensive session debrief that covers:

1. **Behavioral Insights**:
   - Identify key behavioral patterns (e.g., impulsiveness, hesitation, FOMO).
   - Highlight any noticeable emotional trends affecting performance.

2. **Strategy Suggestions**:
   - Recommend specific strategy optimizations based on the day's data.
   - Suggest adjustments to trading rules or tactics to improve execution and risk management.

3. **Actionable Improvements**:
   - List the top two improvements the trader should focus on.
   - Provide clear, practical steps (e.g., refining stop-loss settings or entry/exit criteria).

The trading data is provided below, grouped by trading day:

${JSON.stringify(tradesByDay, null, 2)}

For each day, please provide a concise, integrated debrief that merges these three aspects.
  `;
};

export const tradeBehaviorPrompt = (trades): string => {
    return `
        Analyze the following trading history from multiple expert perspectives:

        ${JSON.stringify(trades, null, 2)}

        ---
        
        **🎯 Role-Based Analysis**  

        **📌 Pro Trader (Execution & Strategy)**  
        - Evaluate trade execution quality (entry/exit precision).  
        - Identify **inefficiencies in strategy** (e.g., poor stop placement, chasing trades).  
        - Recommend **tactical improvements** (e.g., adjusting risk/reward ratio, avoiding overtrades).  

        **🧠 Trading Psychologist (Emotional Control & Discipline)**  
        - Detect **emotional trading behaviors** (revenge trading, hesitation, FOMO).  
        - Identify **consistency vs. impulsiveness** in decision-making.  
        - Suggest **mindset exercises** for discipline (journaling, post-trade analysis).  

        **📊 Risk Manager (Capital Protection)**  
        - Assess risk exposure per trade (**position sizing, stop-loss discipline**).  
        - Identify trades that **exceed acceptable risk limits**.  
        - Suggest improvements in **risk-reward ratio and capital allocation**.  

        **📈 Market Analyst (Market Trends & Timing)**  
        - Analyze how **market conditions affected trades** (trend-following vs. counter-trend).  
        - Identify if entries were **aligned with volatility and trend strength**.  
        - Recommend **timing adjustments** based on historical market patterns.  

        **📊 Quant Analyst (Data-Driven Edge)**  
        - Compute **win rate, max drawdown, risk/reward ratios**.  
        - Compare **trade performance across different setups**.  
        - Identify statistically profitable trade patterns.  

        **🎯 AI Strategist (Automated Strategy Optimization)**  
        - Suggest **rule-based trade execution refinements**.  
        - Optimize **trade filters based on past performance**.  
        - Recommend **improvements to systematic strategies**.  

        **📈 Statistical Insights & Performance Metrics**  
        - Calculate **win rate, profit/loss, and risk exposure** per role.  
        - Compare stats **against past performance** to identify trends.  
        - Example: "Your short trades had a **60% win rate**, while long trades had only **30%**."  

        **📊 Behavior & Performance Correlation**  
        - Did emotional patterns **directly impact** profitability, consistency, or risk exposure?  
        - How do the most recent trades compare to past sessions?  
        - Example: "Compared to last month, **hesitation in entries decreased by 20%, improving win rate by 8%**."  

        **🎯 Role-Specific AI Insights & Recommendations**  
        - **Pro Trader:** Tactical strategy refinements.  
        - **Psychologist:** Behavioral discipline insights.  
        - **Risk Manager:** Position sizing & risk adjustments.  
        - **Market Analyst:** Trend & volatility-based timing insights.  
        - **Quant Analyst:** Data-driven optimization.  
        - **AI Strategist:** Systematic improvements.  

        **🔥 Final Actionable Recommendations**  
        - What are the **top 2 improvements** the trader should focus on next?  
        - Suggest **practical steps** (e.g., "Limit trades to max 3 per session" or "Use stop-loss discipline to avoid revenge trades").  
    `;
};
