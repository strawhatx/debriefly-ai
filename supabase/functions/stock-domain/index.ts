import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { handleCORS, handleReturnCORS } from "../utils/cors.ts";

serve(async (req) => {
  try {
    const corsResponse = handleCORS(req);
    if (corsResponse) return corsResponse;

    const { symbol } = await req.json();
    
    if (!symbol) {
      return new Response(
        JSON.stringify({ error: "Missing symbol" }), 
        { headers: handleReturnCORS(req), status: 400 }
      );
    }

    // Use Finnhub API to get company website
    const response = await fetch(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${Deno.env.get("FINNHUB_API_KEY")}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await response.json();
    const hostname = data.weburl
      ? new URL(data.weburl).hostname.replace("www.", "")
      : "example.com";

    return new Response(
      JSON.stringify({ domain: hostname }), 
      { headers: handleReturnCORS(req), status: 200 }
    );
  } catch (error) {
    console.error("❌ Stock domain lookup failed:", error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { headers: handleReturnCORS(req), status: 500 }
    );
  }
}); 