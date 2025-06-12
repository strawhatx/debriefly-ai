import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { handleCORS, handleReturnCORS } from "../utils/cors.ts";
import { validateSupabaseToken } from "../utils/auth.ts";

// Rate limiting configuration
const RATE_LIMIT = 8; // requests per second (Twelve Data free tier limit)
const RATE_WINDOW = 1000; // 1 second in milliseconds
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

        // Use Twelve Data API to validate the symbol
        const response = await fetch(
          `https://api.twelvedata.com/symbol_search?symbol=${symbol}&apikey=${Deno.env.get("TWELVE_DATA_API_KEY")}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Twelve Data API error: ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        
        // Check if the symbol exists in the response
        const exists = Array.isArray(data) && data.length > 0;

        return new Response(
          JSON.stringify({ exists }), 
          { headers: handleReturnCORS(req), status: 200 }
        );
      } catch (error) {
        attempt++;
        
        if (error.message.includes("Too Many Requests")) {
          console.warn(`Rate limit exceeded on attempt ${attempt}. Retrying...`);
          const delay = getRetryDelay(attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        if (attempt === MAX_RETRIES) {
          console.error(`❌ Forex symbol validation failed after ${MAX_RETRIES} attempts:`, error);
          throw error;
        }
        
        console.warn(`Attempt ${attempt} failed. Retrying...`);
        const delay = getRetryDelay(attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new Error(`Failed to validate forex symbol after ${MAX_RETRIES} attempts`);
  } catch (error) {
    console.error("❌ Forex symbol validation failed:", error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { headers: handleReturnCORS(req), status: 500 }
    );
  }
}); 