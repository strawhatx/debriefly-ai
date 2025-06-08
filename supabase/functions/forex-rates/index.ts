import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { handleCORS, handleReturnCORS } from "../../utils/cors.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  try {
    const corsResponse = handleCORS(req);
    if (corsResponse) return corsResponse;

    const { baseCurrency = "USD", quoteCurrency } = await req.json();
    
    if (!quoteCurrency) {
      return new Response(
        JSON.stringify({ error: "Missing quote currency" }), 
        { headers: handleReturnCORS(req), status: 400 }
      );
    }

    if (quoteCurrency === baseCurrency) {
      return new Response(
        JSON.stringify({ rate: 1 }), 
        { headers: handleReturnCORS(req), status: 200 }
      );
    }

    const today = new Date().toISOString().split("T")[0]; // format: YYYY-MM-DD

    // 1. Check Supabase for cached rate
    const { data: cachedRate, error } = await supabase
      .from("forex_rates")
      .select("rate")
      .eq("base_currency", baseCurrency)
      .eq("quote_currency", quoteCurrency)
      .eq("rate_date", today)
      .maybeSingle();

    if (cachedRate?.rate) {
      return new Response(
        JSON.stringify({ rate: parseFloat(cachedRate.rate.toString()) }), 
        { headers: handleReturnCORS(req), status: 200 }
      );
    }

    // 2. Fetch from CurrencyFreaks if not cached
    const response = await fetch(
      `https://api.forexrateapi.com/v1/latest?api_key=${Deno.env.get("FOREX_RATE_API_KEY")}&currencies=${quoteCurrency}&base=${baseCurrency}`
    );

    const data = await response.json();
    const rate = parseFloat(data.rates[quoteCurrency]);

    if (!isNaN(rate)) {
      // 3. Save to Supabase for future use
      await supabase.from("forex_rates").insert({
        base_currency: baseCurrency,
        quote_currency: quoteCurrency,
        rate,
        rate_date: today,
      });

      return new Response(
        JSON.stringify({ rate }), 
        { headers: handleReturnCORS(req), status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid rate from CurrencyFreaks" }), 
      { headers: handleReturnCORS(req), status: 500 }
    );
  } catch (error) {
    console.error("❌ Forex rate fetching failed:", error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { headers: handleReturnCORS(req), status: 500 }
    );
  }
}); 