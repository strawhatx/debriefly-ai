import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import OpenAI from "https://esm.sh/openai@4.24.1";
import { handleCORS, handleReturnCORS } from "../utils/cors.ts";
import { tradeDebriefPrompt } from "../utils/prompts.ts";

const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });

// Add helper function for OpenAI API calls
async function analyzeWithOpenAI(prompt: string, model:"gpt-4o"| "gpt-4o-mini" | "gpt-3.5-turbo") {
  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" }, // Ensure JSON response
    });

    const insights = completion.choices[0]?.message?.content;
    if (!insights) {
      throw new Error("No response from OpenAI");
    }

    return {
      insights: JSON.parse(insights), // Parse JSON response
      model,
    };
  } catch (error) {
    console.error(`⚠️ ${model} analysis failed:`, error);
    return null;
  }
}

// Request body type
interface RequestBody {
  user_id: string;
}

// Error constants
const ERRORS = {
  MISSING_USER_ID: "Missing user_id",
  NO_POSITIONS: "No new positions to analyze",
} as const;

serve(async (req) => {
  try {
    // Handle CORS pre-flight requests
    const corsResponse = handleCORS(req);
    if (corsResponse) return corsResponse;

    // Validate request body
    const { user_id } = (await req.json()) as RequestBody;
    if (!user_id) {
      return new Response(
        JSON.stringify({ error: ERRORS.MISSING_USER_ID }),
        { headers: handleReturnCORS(req), status: 400 }
      );
    }

    console.log(`🔍 Fetching unanalyzed trades for user: ${user_id}`);

    // Call Supabase RPC that returns daily grouped positions
    const { data: sessionGroups, error: rpcError } = await supabase.rpc("get_unanalyzed_positions", {
      user_id_param: user_id,
    });

    if (rpcError) {
      console.error("❌ Error fetching positions:", rpcError.message);
      return new Response(
        JSON.stringify({ error: rpcError.message }),
        { headers: handleReturnCORS(req), status: 500 }
      );
    }

    if (!sessionGroups || sessionGroups.length === 0) {
      return new Response(
        JSON.stringify({ message: ERRORS.NO_POSITIONS }),
        { headers: handleReturnCORS(req), status: 200 }
      );
    }

    console.log(`📊 Found ${sessionGroups.length} daily sessions to analyze.`);

    // For each daily session, build a prompt and call OpenAI API concurrently
    const dailyAnalysisPromises = sessionGroups.map(async (session: any) => {
      const prompt = tradeDebriefPrompt(session);
      console.log(`🧠 Running AI analysis for session ${session.trade_day}...`);

      // Try GPT-4 first
      const gpt4Result = await analyzeWithOpenAI(prompt, "gpt-4o");
      
      // If GPT-4 fails, try GPT-3.5
      const analysis = gpt4Result || await analyzeWithOpenAI(prompt, "gpt-3.5-turbo");
      
      if (!analysis) {
        throw new Error("Both GPT-4 and GPT-3.5 analysis failed");
      }

      return {
        user_id,
        session_date: session.trade_day,
        insights: analysis.insights,
        model: analysis.model,
        created_at: new Date().toISOString(),
      };
    });

    // Await all OpenAI API calls concurrently
    const dailyAnalysisResults = await Promise.all(dailyAnalysisPromises);

    // Save each session debrief to your Supabase table (e.g., "trade_analysis")
    const { error: saveError } = await supabase
      .from("trade_analysis")
      .insert(dailyAnalysisResults)
      .select();

    if (saveError) {
      console.error("❌ Error saving AI insights:", saveError.message);
      return new Response(
        JSON.stringify({ error: saveError.message }),
        { headers: handleReturnCORS(req), status: 500 }
      );
    }

    console.log(`✅ AI analysis stored successfully for ${dailyAnalysisResults.length} sessions.`);
    return new Response(
      JSON.stringify({ insights: dailyAnalysisResults }),
      { headers: handleReturnCORS(req), status: 200 }
    );
  } catch (error) {
    console.error("❌ Unexpected Error:", error instanceof Error ? error.message : String(error));
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { headers: handleReturnCORS(req), status: 500 }
    );
  }
});
