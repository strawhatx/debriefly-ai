
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.3.0?target=deno";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { handleCORS, handleReturnCORS } from "../utils/cors.ts";

// ✅ Initialize Stripe & Supabase
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"), { apiVersion: "2023-10-16" });
const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));

// ✅ Helper: Create a Stripe Customer Portal Session
const createCustomerPortalSession = async (req: Request, stripeCustomerId: string): Promise<Response> => {
  try {
    console.log("✅ Creating customer portal session for:", stripeCustomerId);
    
    // Set the return URL to the settings page
    const returnUrl = Deno.env.get("PRODUCTION_URL") || "http://localhost:5173/settings";
    
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl,
    });

    console.log("✅ Portal session created:", session.id);

    return new Response(JSON.stringify({ success: true, url: session.url }), { 
      headers: handleReturnCORS(req), 
      status: 200 
    });
  }
  catch (error) {
    console.error("❌ Stripe Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: handleReturnCORS(req), 
      status: 500 
    });
  }
};

// ✅ Helper: Create a New Subscription
const createSubscription = async (req: Request, stripeCustomerId: string, priceId: string): Promise<Response> => {
  try {
    console.log("✅ Creating subscription for customer:", stripeCustomerId);

    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });

    console.log("✅ Subscription Created:", subscription.id);

    return new Response(JSON.stringify({ success: true, subscriptionId: subscription.id }), { headers: handleReturnCORS(req), status: 200 });
  }
  catch (error) {
    console.error("❌ Stripe Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { headers: handleReturnCORS(req), status: 500 });
  }
};

// ✅ Helper: Upgrade or Downgrade Subscription
const updateSubscription = async (req: Request, stripeCustomerId: string, newPriceId: string): Promise<Response> => {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: "active",
      limit: 1,
    });

    if (!subscriptions.data.length) {
      return new Response(JSON.stringify({ error: "No active subscription found." }), { headers: handleReturnCORS(req), status: 400 });
    }

    const subscription = subscriptions.data[0];

    console.log("🔍 Current Subscription:", subscription.id);

    const updatedSubscription = await stripe.subscriptions.update(subscription.id, {
      items: [{ id: subscription.items.data[0].id, price: newPriceId }],
      proration_behavior: "create_prorations",
    });

    console.log("✅ Subscription Updated:", updatedSubscription.id);

    return new Response(JSON.stringify({ success: true, subscriptionId: updatedSubscription.id }), { headers: handleReturnCORS(req), status: 200 });
  } catch (error) {
    console.error("❌ Stripe Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { headers: handleReturnCORS(req), status: 500 });
  }
};

// ✅ Helper: Cancel Subscription
const cancelSubscription = async (req: Request, stripeCustomerId: string): Promise<Response> => {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: "active",
      limit: 1,
    });

    if (!subscriptions.data.length) {
      return new Response(JSON.stringify({ error: "No active subscription found." }), { headers: handleReturnCORS(req), status: 400 });
    }

    const subscription = subscriptions.data[0];

    await stripe.subscriptions.cancel(subscription.id);

    console.log("✅ Subscription Canceled:", subscription.id);

    return new Response(JSON.stringify({ success: true }), { headers: handleReturnCORS(req), status: 200 });
  } catch (error) {
    console.error("❌ Stripe Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { headers: handleReturnCORS(req), status: 500 });
  }
};

// ✅ Helper: Fetch Current Subscription Details
const getSubscriptionDetails = async (req: Request, stripeCustomerId: string): Promise<Response> => {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: "active",
      limit: 1,
    });

    if (!subscriptions.data.length) {
      return new Response(JSON.stringify({ error: "No active subscription found." }), { headers: handleReturnCORS(req), status: 400 });
    }

    return new Response(JSON.stringify({ subscription: subscriptions.data[0] }), { headers: handleReturnCORS(req), status: 200 });
  } 
  catch (error) {
    console.error("❌ Stripe Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { headers: handleReturnCORS(req), status: 500 });
  }
};

// 🚀 **Main Function**
serve(async (req) => {
  try {
    const corsResponse = handleCORS(req);
    if (corsResponse) return corsResponse;

    const { action, stripeCustomerId, priceId } = await req.json();

    if (!action) {
      return new Response(JSON.stringify({ error: "Missing action parameter" }), { status: 400 });
    }

    switch (action) {
      case "createSubscription":
        if (!stripeCustomerId || !priceId) return new Response(JSON.stringify({ error: "Missing required fields" }), { headers: handleReturnCORS(req), status: 400 });
        return createSubscription(req, stripeCustomerId, priceId);

      case "updateSubscription":
        if (!stripeCustomerId || !priceId) return new Response(JSON.stringify({ error: "Missing required fields" }), { headers: handleReturnCORS(req), status: 400 });
        return updateSubscription(req, stripeCustomerId, priceId);

      case "cancelSubscription":
        if (!stripeCustomerId) return new Response(JSON.stringify({ error: "Missing required fields" }), { headers: handleReturnCORS(req), status: 400 });
        return cancelSubscription(req, stripeCustomerId);

      case "getSubscriptionDetails":
        if (!stripeCustomerId) return new Response(JSON.stringify({ error: "Missing required fields" }), { headers: handleReturnCORS(req), status: 400 });
        return getSubscriptionDetails(req, stripeCustomerId);
        
      case "createCustomerPortalSession":
        if (!stripeCustomerId) return new Response(JSON.stringify({ error: "Missing required fields" }), { headers: handleReturnCORS(req), status: 400 });
        return createCustomerPortalSession(req, stripeCustomerId);

      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), { headers: handleReturnCORS(req), status: 400 });
    }
  }
  catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Internal server error" }), { headers: handleReturnCORS(req), status: 500 });
  }
});
