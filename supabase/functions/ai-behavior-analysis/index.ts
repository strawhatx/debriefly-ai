import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { handleCORS, handleReturnCORS } from "../utils/cors.ts";
import { tradeBehaviorPrompt } from "../utils/prompts.ts";

const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

serve(async (req) => {
  try {
    const corsResponse = handleCORS(req);
    if (corsResponse) return corsResponse;

    const { user_id } = await req.json();
    if (!user_id) return new Response(JSON.stringify({ error: "Missing user_id" }), { headers: handleReturnCORS(req), status: 400 });

    console.log(`🔍 Fetching unanalyzed trades for user: ${user_id}`);

    const { data: unanalyzedPositions, error: positionError } = await supabase
      .rpc("get_unanalyzed_positions", { user_id_param: user_id });

    if (positionError) {
      console.error("❌ Error fetching positions:", positionError.message);
      return new Response(JSON.stringify({ error: positionError.message }), { headers: handleReturnCORS(req), status: 500 });
    }

    if (!unanalyzedPositions || unanalyzedPositions.length === 0) {
      return new Response(JSON.stringify({ message: "No new positions to analyze" }), { headers: handleReturnCORS(req), status: 200 });
    }

    console.log(`📊 Found ${unanalyzedPositions.length} unanalyzed positions. Running Gemini AI analysis...`);

    // 🧠 AI Trade Behavior Analysis with Gemini
    const prompt = tradeBehaviorPrompt(unanalyzedPositions);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: { text: prompt } }),
    });

    const result = await response.json();
    const insights = result.candidates?.[0]?.output || "No insights available.";

    // 📝 Save AI insights per position
    const aiInsertData = unanalyzedPositions.map(pos => ({
      user_id,
      position_id: pos.position_id,
      insights
    }));

    const { error: saveError } = await supabase.from("trade_behavior_analysis").insert(aiInsertData);

    if (saveError) {
      console.error("❌ Error saving AI insights:", saveError.message);
      return new Response(JSON.stringify({ error: saveError.message }), { headers: handleReturnCORS(req), status: 500 });
    }

    console.log(`✅ AI analysis stored successfully for ${unanalyzedPositions.length} positions.`);
    return new Response(JSON.stringify({ insights }), { headers: handleReturnCORS(req), status: 200 });

  } catch (error) {
    console.error("❌ Unexpected Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { headers: handleReturnCORS(req), status: 500 });
  }
});
