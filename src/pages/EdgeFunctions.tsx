//demo page

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const EdgeFunctions = () => {
    const [analysis, setAnalysis] = useState([]);

    useEffect(() => {
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
                setAnalysis(result);
            }
            catch (error) {
                console.error("❌ Error:", error);
                return null;
            }
        };

        runTradeAnalysis();
    }, []);

    return (
        <div className="p-6 bg-gray-900 text-white">
            <h2 className="text-2xl font-bold mb-4">Behavioral Analysis Test</h2>

            {analysis.length > 0 ? (
                analysis.map((entry) => (
                    <div key={entry.position_id} className="bg-gray-800 p-4 rounded-lg mb-6">
                        <h3 className="text-lg font-semibold">Position: {entry.position_id}</h3>
                        <p className="text-gray-400">{entry.insights}</p>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No AI analysis available yet.</p>
            )}
        </div>
    );
}
