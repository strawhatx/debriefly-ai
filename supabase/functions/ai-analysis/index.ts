import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { handleCORS, handleReturnCORS } from "../utils/cors.ts";
import { tradeBehaviorPrompt } from "../utils/prompts.ts";

const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const GEMINI_API_KEY = Deno.env.get("GOOGLE_GEMINI_API_KEY");

async function analyzeWithChatGPT(prompt: string): Promise<string> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const result = await response.json();
    return result.choices[0]?.message?.content ?? '';
  } catch (error) {
    console.error('ChatGPT Analysis failed:', error);
    throw error;
  }
}

async function analyzeWithGemini(prompt: string): Promise<string> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const result = await response.json();
    return result.candidates?.[0]?.content.parts?.[0]?.text ?? '';
  } catch (error) {
    console.error('Gemini Analysis failed:', error);
    throw error;
  }
}

async function getTradeAnalysis(prompt: string): Promise<string> {
  try {
    // Try ChatGPT first
    return await analyzeWithChatGPT(prompt);
  } catch (error) {
    console.log('Falling back to Gemini due to ChatGPT error:', error.message);
    // Fallback to Gemini
    try {
      return await analyzeWithGemini(prompt);
    } catch (geminiError) {
      throw new Error('Both AI services failed to analyze');
    }
  }
}

serve(async (req) => {
  try {
    const corsResponse = handleCORS(req);
    if (corsResponse) return corsResponse;

    const { user_id } = await req.json();
    if (!user_id) {
      return new Response(
        JSON.stringify({ error: "Missing user_id" }), 
        { headers: handleReturnCORS(req), status: 400 }
      );
    }

    const { data: unanalyzedPositions, error: positionError } = await supabase
      .rpc("get_unanalyzed_positions", { user_id_param: user_id });

    // ... existing error handling ...

    const prompt = tradeBehaviorPrompt(unanalyzedPositions);
    const insights = await getTradeAnalysis(prompt);

    const aiInsertData = unanalyzedPositions.map(pos => ({
      user_id,
      position_id: pos.position_id,
      insights,
      created_at: new Date().toISOString(),
      ai_provider: insights.length > 0 ? 'chatgpt' : 'gemini' // Track which AI provided the analysis
    }));

    const { error: saveError } = await supabase
      .from("trade_behavior_analysis")
      .insert(aiInsertData);

    // ... existing error handling and response ...

  } catch (error) {
    console.error("❌ Unexpected Error:", error instanceof Error ? error.message : String(error));
    return new Response(
      JSON.stringify({ error: "Internal server error" }), 
      { headers: handleReturnCORS(req), status: 500 }
    );
  }
}); 