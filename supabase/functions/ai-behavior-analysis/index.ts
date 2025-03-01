import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { handleCORS, handleReturnCORS } from "../utils/cors.ts";
import { tradeBehaviorPrompt } from "../utils/prompts.ts"
import OpenAI from "openai";

// Initialize Supabase and OpenAI
const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });

serve(async (req) => {
  try {
    const corsResponse = handleCORS(req);
    if (corsResponse) return corsResponse;

    const { user_id } = await req.json();

    // Fetch user's trade data from Supabase
    const { data: trades, error } = await supabase.from("positions").select("*").eq("user_id", user_id);

    if (error) return new Response(JSON.stringify({ error: error.message }), { headers: handleReturnCORS(req), status: 500 });

    // AI Analysis Prompt: Use tags if they exist, infer if they don’t
    const prompt = tradeBehaviorPrompt(trades)

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    return new Response(JSON.stringify({ insights: response.choices[0].message.content }), { headers: handleReturnCORS(req), status: 200 });
  }

  catch (error) {
    console.error("❌ Unexpected Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { headers: handleReturnCORS(req), status: 500 });
  }
});
