import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { handleCORS, handleReturnCORS } from "../utils/cors.ts";
import { validateSupabaseToken } from "../utils/auth.ts";

serve(async (req) => {
  try {
    const corsResponse = handleCORS(req);
    if (corsResponse) return corsResponse;

    // Validate the JWT token
    const authHeader = req.headers.get("Authorization");
    await validateSupabaseToken(authHeader);

    const { symbol } = await req.json();
    
    if (!symbol) {
      return new Response(
        JSON.stringify({ error: "Missing symbol" }), 
        { headers: handleReturnCORS(req), status: 400 }
      );
    }

    // Use Twelve Data API to validate the symbol
    const response = await fetch(
      `https://api.twelvedata.com/symbol_search?symbol=${symbol}&apikey=${Deno.env.get("TWELVE_DATA_API_KEY")}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await response.json();
    
    // Check if the symbol exists in the response
    const exists = Array.isArray(data) && data.length > 0;

    return new Response(
      JSON.stringify({ exists }), 
      { headers: handleReturnCORS(req), status: 200 }
    );
  } catch (error) {
    console.error("❌ Forex symbol validation failed:", error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { headers: handleReturnCORS(req), status: 500 }
    );
  }
}); 