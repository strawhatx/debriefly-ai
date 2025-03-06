import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { handleCORS, handleReturnCORS } from "../utils/cors.ts";
import { tradeBehaviorPrompt } from "../utils/prompts.ts";
import OpenAI from "openai";

// Initialize Supabase and OpenAI
const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });

serve(async (req) => {
  try {
    const corsResponse = handleCORS(req);
    if (corsResponse) return corsResponse;

    const { user_id } = await req.json();

    // Fetch last analysis timestamp
    const { data: lastAnalysis } = await supabase
      .from("trade_behavior_analysis").select("created_at").eq("user_id", user_id)
      .order("created_at", { ascending: false }).limit(1);

    const lastAnalysisDate = lastAnalysis?.length ? new Date(lastAnalysis[0].created_at) : null;

    // Fetch new trades since last analysis
    const { data: newTrades, error: newTradesError } = await supabase
      .from("positions").select("*").eq("user_id", user_id)
      .gt("entry_date", lastAnalysisDate ? lastAnalysisDate.toISOString() : "1970-01-01T00:00:00Z")
      .order("entry_date", { ascending: false });

    if (newTradesError) return new Response(JSON.stringify({ error: newTradesError.message }), { headers: handleReturnCORS(req), status: 500 });

    // If no new trades, do not run AI analysis
    if (newTrades.length === 0) {
      return new Response(JSON.stringify({ message: "No new trades to analyze" }), { headers: handleReturnCORS(req), status: 200 });
    }

    // AI Analysis Prompt: Generate insights only for new trades
    const prompt = tradeBehaviorPrompt(newTrades);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    const insights = response.choices[0].message.content;

    // Save AI insights in Supabase
    const { error: saveError } = await supabase.from("trade_behavior_analysis")
      .insert({ user_id, insights, created_at: new Date().toISOString() });

    if (saveError) return new Response(JSON.stringify({ error: saveError.message }), { headers: handleReturnCORS(req), status: 500 });

    return new Response(JSON.stringify({ insights }), { headers: handleReturnCORS(req), status: 200 });
  }

  catch (error) {
    console.error("❌ Unexpected Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { headers: handleReturnCORS(req), status: 500 });
  }
});
