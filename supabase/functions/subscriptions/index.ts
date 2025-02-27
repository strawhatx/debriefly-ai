
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.3.0?target=deno";
import { createClient } from "@supabase/supabase-js";
import { handleCORS, handleReturnCORS } from "../utils/cors.ts";

// Initialize Stripe & Supabase
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"), { apiVersion: "2023-10-16" });
const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));

// Helper: Create a Stripe Customer Portal Session
const createCustomerPortalSession = async (req: Request, stripeCustomerId: string): Promise<Response> => {
  try {
    console.log("Creating customer portal session for:", stripeCustomerId);
    
    // Set the return URL to the settings page
    const returnUrl = Deno.env.get("PRODUCTION_URL") || "http://localhost:5173/settings";
    
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl,
    });

    console.log("Portal session created:", session.id);

    return new Response(JSON.stringify({ success: true, url: session.url }), { 
      headers: handleReturnCORS(req), 
      status: 200 
    });
  }
  catch (error) {
    console.error("Stripe Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: handleReturnCORS(req), 
      status: 500 
    });
  }
};

// Helper: Create a Stripe Payment Link
const createPaymentLink = async (req: Request): Promise<Response> => {
  try {
    console.log("Creating payment link");
    
    // Get the price ID for the subscription product
    const { data: priceData } = await supabase
      .from('subscription_plans')
      .select('stripe_price_id')
      .eq('name', 'Pro')  // Use your product name here
      .single();
    
    if (!priceData?.stripe_price_id) {
      throw new Error("No price ID found for the subscription plan");
    }
    
    // Create the payment link
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: priceData.stripe_price_id,
          quantity: 1,
        },
      ],
      after_completion: {
        type: 'redirect',
        redirect: {
          url: Deno.env.get("PRODUCTION_URL") || "http://localhost:5173/settings",
        },
      },
    });

    console.log("Payment link created:", paymentLink.url);

    return new Response(JSON.stringify({ success: true, url: paymentLink.url }), { 
      headers: handleReturnCORS(req), 
      status: 200 
    });
  }
  catch (error) {
    console.error("Stripe Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: handleReturnCORS(req), 
      status: 500 
    });
  }
};

// Helper: Fetch Current Subscription Details
const getSubscriptionDetails = async (req: Request, stripeCustomerId: string): Promise<Response> => {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: "active",
      limit: 1,
      expand: ['data.items.data.price.product'],
    });

    if (!subscriptions.data.length) {
      return new Response(JSON.stringify({ error: "No active subscription found." }), { headers: handleReturnCORS(req), status: 400 });
    }

    return new Response(JSON.stringify({ subscription: subscriptions.data[0] }), { headers: handleReturnCORS(req), status: 200 });
  } 
  catch (error) {
    console.error("Stripe Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { headers: handleReturnCORS(req), status: 500 });
  }
};

// Main Function
serve(async (req) => {
  try {
    const corsResponse = handleCORS(req);
    if (corsResponse) return corsResponse;

    const requestData = await req.json();
    const { action, stripeCustomerId } = requestData;

    if (!action) {
      return new Response(JSON.stringify({ error: "Missing action parameter" }), { status: 400 });
    }

    switch (action) {
      case "getSubscriptionDetails":
        if (!stripeCustomerId) return new Response(JSON.stringify({ error: "Missing required fields" }), { headers: handleReturnCORS(req), status: 400 });
        return getSubscriptionDetails(req, stripeCustomerId);
        
      case "createCustomerPortalSession":
        if (!stripeCustomerId) return new Response(JSON.stringify({ error: "Missing required fields" }), { headers: handleReturnCORS(req), status: 400 });
        return createCustomerPortalSession(req, stripeCustomerId);
        
      case "createPaymentLink":
        return createPaymentLink(req);

      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), { headers: handleReturnCORS(req), status: 400 });
    }
  }
  catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Internal server error" }), { headers: handleReturnCORS(req), status: 500 });
  }
});
