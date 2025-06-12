import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { handleCORS, handleReturnCORS } from "../utils/cors.ts";
import { tradeDebriefPrompt } from "../utils/prompts.ts";
import { validateSupabaseToken } from "../utils/auth.ts";

const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
const GEMINI_API_KEY = Deno.env.get("GOOGLE_GEMINI_API_KEY");

// Rate limiting configuration for Gemini API
const RATE_LIMIT = 15; // requests per minute (Gemini free tier)
const RATE_WINDOW = 60 * 1000; // 1 minute in milliseconds
const MIN_REQUEST_GAP = 100; // minimum 100ms between requests
const requestTimestamps: number[] = [];

// Helper function to check rate limit
function checkRateLimit(): boolean {
  const now = Date.now();
  while (requestTimestamps.length > 0 && requestTimestamps[0] < now - RATE_WINDOW) {
    requestTimestamps.shift();
  }
  return requestTimestamps.length < RATE_LIMIT;
}

// Helper function to get wait time
function getWaitTime(): number {
  const now = Date.now();
  if (requestTimestamps.length >= RATE_LIMIT) {
    return RATE_WINDOW - (now - requestTimestamps[0]);
  }
  return MIN_REQUEST_GAP;
}

// Helper function for Gemini API calls with rate limiting
async function analyzeWithGemini(prompt: string) {
  // Check rate limit
  if (!checkRateLimit()) {
    const waitTime = getWaitTime();
    console.log(`Rate limit reached. Waiting ${waitTime}ms before continuing...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }

  // Add timestamp for rate limiting
  requestTimestamps.push(Date.now());

  // Make Gemini API call
  const geminiResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
        },
      }),
    }
  );

  if (!geminiResponse.ok) {
    const errorText = await geminiResponse.text();
    if (errorText.includes("429") || errorText.includes("Too Many Requests")) {
      console.warn("Rate limit hit, retrying after delay...");
      await new Promise(resolve => setTimeout(resolve, getWaitTime()));
      return analyzeWithGemini(prompt); // Retry the request
    }
    throw new Error(`Gemini API error: ${geminiResponse.statusText} - ${errorText}`);
  }

  const result = await geminiResponse.json();
  const insights = result.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!insights) {
    throw new Error("No response from Gemini");
  }

  try {
    return {
      insights: JSON.parse(insights),
      model: "gemini-pro"
    };
  } catch (e) {
    console.warn("Failed to parse Gemini response as JSON, using raw text");
    return {
      insights,
      model: "gemini-pro"
    };
  }
}

// Request body type
interface RequestBody {
  user_id: string;
  trading_account_id: string;
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

    // Validate the JWT token
    const authHeader = req.headers.get("Authorization");
    await validateSupabaseToken(authHeader);

    // Validate request body
    const { user_id, trading_account_id } = (await req.json()) as RequestBody;
    if (!user_id) {
      return new Response(
        JSON.stringify({ error: ERRORS.MISSING_USER_ID }),
        { headers: handleReturnCORS(req), status: 400 }
      );
    }

    console.log(`🔍 Fetching unanalyzed trades for user: ${user_id}`);

    // Call Supabase RPC that returns daily grouped positions
    const { data: sessionGroups, error: rpcError } = await supabase.rpc("get_unanalyzed_positions", {
      trading_account_id_param: trading_account_id, user_id_param: user_id
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

    // For each daily session, build a prompt and call Gemini API
    const dailyAnalysisPromises = sessionGroups.map(async (session: any) => {
      if (!session.trades || session.trades.length === 0) {
        console.warn(`⚠️ No trade data for session ${session.trade_day}`);
        return null;
      }

      const prompt = tradeDebriefPrompt(session.trades);
      console.log(`🧠 Running Gemini analysis for session ${session.trade_day}...`);

      const analysis = await analyzeWithGemini(prompt);
      
      if (!analysis) {
        throw new Error("Gemini analysis failed");
      }

      const insights = analysis.insights.replace(/```json|```/g, "").trim();

      return {
        user_id,
        trading_account_id,
        session_date: session.trade_day,
        analysis: JSON.parse(insights) || analysis.insights,
        model: analysis.model,
        created_at: new Date().toISOString(),
      };
    });

    // Wait for all analyses to complete
    const dailyAnalysisResults = await Promise.all(dailyAnalysisPromises);

    // Filter out null results (from missing data)
    const validResults = dailyAnalysisResults.filter(result => result !== null);

    if (validResults.length === 0) {
      return new Response(
        JSON.stringify({ error: "No valid analysis results" }),
        { headers: handleReturnCORS(req), status: 400 }
      );
    }

    // Save each session debrief to your Supabase table
    const { error: saveError } = await supabase
      .from("trade_analysis")
      .insert(validResults)
      .select();

    if (saveError) {
      console.error("❌ Error saving AI insights:", saveError.message);
      return new Response(
        JSON.stringify({ error: saveError.message }),
        { headers: handleReturnCORS(req), status: 500 }
      );
    }

    console.log(`✅ AI analysis stored successfully for ${validResults.length} sessions.`);
    
    return new Response(
      JSON.stringify({ 
        insights: validResults,
        analyzed: validResults.length,
        skipped: dailyAnalysisResults.length - validResults.length
      }),
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