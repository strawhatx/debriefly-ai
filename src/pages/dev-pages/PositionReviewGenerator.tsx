
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { calculateBehaviorScore } from "../../utils/calculate-behavioral-score";
import { allStrategies, allTags } from "@/utils/constants";

export const PositionReviewGenerator = () => {
    const [trades, setTrades] = useState<any[]>();
    const [analysis, setAnalysis] = useState<any[]>();

    const generatePositionUpdate = async () => {
        for (const trade of trades) {
            const strategy = allStrategies[Math.floor(Math.random() * allStrategies.length)];
            const reward = Math.round((Math.random() * 9 + 1) * 2) / 2;
            const tagCount = Math.floor(Math.random() * 3) + 1;
            const tags = Array.from({ length: tagCount }, () =>
                allTags[Math.floor(Math.random() * allTags.length)]
            );
            const score = calculateBehaviorScore({ ...trade, strategy, reward, tags });

            const { error } = await supabase.from("positions")
                .update({
                    strategy,
                    reward,
                    tags,
                    score: parseFloat(score.toFixed(2)), // Convert to number
                    state: "CLOSED", // Use CLOSED instead of PUBLISHED
                })
                .eq("id", trade.id);

            if (error) {
                console.error(`Error updating trade ${trade.id}:`, error);
            }
        }

        const { error: deleteError } = await supabase
            .from("trade_analysis")
            .delete()
            .in("session_date", trades.map((trade) => trade.entry_date.split("T")[0]));

        if (deleteError) {
            console.error("Error deleting previous analysis:", deleteError);
            return;
        }

        await runTradeAnalysis();
    };

    const runTradeAnalysis = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        const API_URL = `${import.meta.env.VITE_SUPABASE_API}/ai-analysis`; // API path
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: user.id, trading_account_id: "all" }),
            });

            const result = await response.json();

            setAnalysis(result.insights);

            console.log("AI analysis result:", result);

            console.log("Positions updated successfully!");
        }
        catch (error) {
            console.error("❌ Error:", error);
            return null;
        }
    };

    useEffect(() => {
        const fetchPositions = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                console.error("User not authenticated");
                return;
            }

            const { data, error } = await supabase
                .from("positions").select(`
                    id,
                    symbol, 
                    asset_type, 
                    position_type, 
                    fill_price, 
                    stop_price, 
                    pnl, 
                    entry_date, 
                    closing_date, 
                    strategy, 
                    risk, 
                    reward, 
                    tags, 
                    score
                `)
                .eq("state", "DRAFT")
                .order("entry_date", { ascending: false });

            if (error) {
                console.error("Error fetching positions:", error);
                return;
            }

            setTrades(data.map((position) => ({
                id: position.id,
                entry_date: position.entry_date,
                closing_date: position.closing_date,
                symbol: position.symbol,
                market: position.asset_type,
                type: position.position_type,
                entry: position.fill_price,
                exit: position.stop_price,
                strategy: position.strategy,
                risk: position.risk,
                reward: position.reward,
                pnl: position.pnl,
                tags: position.tags,
                score: position.score,
            })));;
        };

        fetchPositions();
    }, []);

    return (
        <div className="p-6 bg-gray-900 text-white">
            <h2 className="text-2xl font-bold mb-4">Position Review Generator</h2>

            <button onClick={generatePositionUpdate} className="bg-blue-500 text-white p-2 rounded">
                Generate & Download CSV
            </button>

            {analysis && analysis.length > 0 && (
                <div className="mt-4">
                    {analysis.map(({ session_date, trades }) => (
                        <div key={session_date} className="bg-gray-800 p-4 rounded-lg mb-6">
                            <h3 className="text-lg font-semibold">Session: {session_date}</h3>
                            {trades.map((entry) => (
                                <div key={entry.position_id} className="mt-2">
                                    <p className="text-gray-400">{entry.insights}</p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
