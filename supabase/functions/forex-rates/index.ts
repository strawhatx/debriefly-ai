import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { handleCORS, handleReturnCORS } from "../utils/cors.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Rate limiting configuration
const RATE_LIMIT = 30; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute in milliseconds
const requestTimestamps: number[] = [];

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

// Helper function to check rate limit
function checkRateLimit(): boolean {
  const now = Date.now();
  // Remove timestamps older than the rate window
  while (requestTimestamps.length > 0 && requestTimestamps[0] < now - RATE_WINDOW) {
    requestTimestamps.shift();
  }
  return requestTimestamps.length < RATE_LIMIT;
}

// Helper function to add exponential backoff delay
function getRetryDelay(attempt: number): number {
  return INITIAL_RETRY_DELAY * Math.pow(2, attempt);
}

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

    let attempt = 0;
    while (attempt < MAX_RETRIES) {
      try {
        // Check rate limit
        if (!checkRateLimit()) {
          const waitTime = RATE_WINDOW - (Date.now() - requestTimestamps[0]);
          console.log(`Rate limit reached. Waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }

        // Add timestamp for rate limiting
        requestTimestamps.push(Date.now());

        // 2. Fetch from ForexRate API if not cached
        const response = await fetch(
          `https://api.forexrateapi.com/v1/latest?api_key=${Deno.env.get("FOREX_RATE_API_KEY")}&currencies=${quoteCurrency}&base=${baseCurrency}`
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Forex API error: ${response.statusText} - ${errorText}`);
        }

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

        throw new Error("Invalid rate from ForexRate API");
      } catch (error) {
        attempt++;
        
        if (error.message.includes("Too Many Requests")) {
          console.warn(`Rate limit exceeded on attempt ${attempt}. Retrying...`);
          const delay = getRetryDelay(attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        if (attempt === MAX_RETRIES) {
          console.error(`❌ Forex rate fetching failed after ${MAX_RETRIES} attempts:`, error);
          throw error;
        }
        
        console.warn(`Attempt ${attempt} failed. Retrying...`);
        const delay = getRetryDelay(attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new Error(`Failed to get forex rate after ${MAX_RETRIES} attempts`);
  } catch (error) {
    console.error("❌ Forex rate fetching failed:", error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { headers: handleReturnCORS(req), status: 500 }
    );
  }
}); 