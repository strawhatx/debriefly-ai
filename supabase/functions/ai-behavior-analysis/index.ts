import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { handleCORS, handleReturnCORS } from "../utils/cors.ts";
import { tradeBehaviorPrompt } from "../utils/prompts.ts";

const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
const GEMINI_API_KEY = Deno.env.get("GOOGLE_GEMINI_API_KEY");

// 1. Add request validation and type safety
interface RequestBody {
  user_id: string;
}

// 2. Add error constants
const ERRORS = {
  MISSING_USER_ID: "Missing user_id",
  NO_POSITIONS: "No new positions to analyze",
} as const;

serve(async (req) => {
  try {
    const corsResponse = handleCORS(req);
    if (corsResponse) return corsResponse;

    const { user_id } = (await req.json()) as RequestBody;
    if (!user_id) {
      return new Response(
        JSON.stringify({ error: ERRORS.MISSING_USER_ID }), 
        { headers: handleReturnCORS(req), status: 400 }
      );
    }

    console.log(`🔍 Fetching unanalyzed trades for user: ${user_id}`);

    // 3. Use Promise.all for concurrent operations
    const [{ data: unanalyzedPositions, error: positionError }] = await Promise.all([
      supabase.rpc("get_unanalyzed_positions", { user_id_param: user_id })
    ]);

    if (positionError) {
      console.error("❌ Error fetching positions:", positionError.message);
      return new Response(JSON.stringify({ error: positionError.message }), { headers: handleReturnCORS(req), status: 500 });
    }

    if (!unanalyzedPositions || unanalyzedPositions.length === 0) {
      return new Response(JSON.stringify({ message: ERRORS.NO_POSITIONS }), { headers: handleReturnCORS(req), status: 200 });
    }

    console.log(`📊 Found ${unanalyzedPositions.length} unanalyzed positions. Running Gemini AI analysis...`);

    // 🧠 AI Trade Behavior Analysis with Gemini
    const prompt = tradeBehaviorPrompt(unanalyzedPositions);

    // 4. Optimize Gemini API call
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 5. Add request timeout
          "Keep-Alive": "timeout=30",
        },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ text: tradeBehaviorPrompt(unanalyzedPositions) }] 
          }]
        }),
      }
    );

    // 6. Add response validation
    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.statusText}`);
    }

    const result = await geminiResponse.json();
    const insights = result.candidates?.[0]?.output ?? "No insights available.";

    // 📝 Save AI insights per position
    const aiInsertData = unanalyzedPositions.map(pos => ({
      user_id,
      position_id: pos.position_id,
      insights,
      created_at: new Date().toISOString(), // Add timestamp
    }));

    // 8. Uncomment and add error handling for insert
    const { error: saveError } = await supabase
      .from("trade_behavior_analysis")
      .insert(aiInsertData)
      .select();

    if (saveError) {
      console.error("❌ Error saving AI insights:", saveError.message);
      return new Response(JSON.stringify({ error: saveError.message }), { headers: handleReturnCORS(req), status: 500 });
    }

    console.log(`✅ AI analysis stored successfully for ${unanalyzedPositions.length} positions.`);
    return new Response(JSON.stringify({ insights }), { headers: handleReturnCORS(req), status: 200 });

  } catch (error) {
    console.error("❌ Unexpected Error:", error instanceof Error ? error.message : String(error));
    return new Response(
      JSON.stringify({ error: "Internal server error" }), 
      { headers: handleReturnCORS(req), status: 500 }
    );
  }
});
