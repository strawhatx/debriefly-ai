import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.3.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { handleCORS, handleReturnCORS } from "../../utils/cors.ts";

// ✅ Load Environment Variables
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"), { apiVersion: "2023-10-16" });
const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));

// ✅ Helper: Get or Create a Stripe Customer
const getOrCreateCustomer = async (userId: string, email: string) => {
  // 🔍 Step 1: Check if the user already has a Stripe customer ID in Supabase
  const { data, error } = await supabase
    .from("profiles").select("stripe_customer_id").eq("id", userId).single();

  if (error && error.code !== "PGRST116") {
    console.error("❌ Supabase Error Fetching Customer ID:", error.message);
    return null;
  }

  if (data?.stripe_customer_id) {
    console.log("✅ Existing Stripe customer found:", data.stripe_customer_id);
    return data.stripe_customer_id;
  }

  // 🔥 If no customer exists, create one in Stripe
  console.log("🆕 Creating new Stripe customer for:", email);
  try {
    const customer = await stripe.customers.create({ email, metadata: { userId } });

    // 🔄 Save the new customer ID in Supabase
    const { error: updateError } = await supabase.from("profiles")
      .update({ stripe_customer_id: customer.id }).eq("id", userId);

    if (updateError) {
      console.error("❌ Supabase Error Saving Customer ID:", updateError.message);
      return null;
    }

    console.log("✅ Stripe Customer Created & Saved:", customer.id);
    return customer.id;
  } 
  catch (stripeError) {
    console.error("❌ Stripe Error:", stripeError.message);
    return null;
  }
};

// ✅ Helper: Get or Create a Default Subscription for a User
const getOrCreateSubscription = async (customerId: string, userId: string) => {
  // 🔍 Check if user already has an active subscription
  const existingSubscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "active",
  });

  if (existingSubscriptions.data.length > 0) {
    console.log("✅ Existing subscription found:", existingSubscriptions.data[0].id);
    return existingSubscriptions.data[0];
  }

  // 🔥 If no subscription exists, create a default subscription
  console.log("🆕 Creating default subscription for customer:", customerId);
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: Deno.env.get("STRIPE_DEFAULT_PRICE_ID") }], // Default plan
    expand: ["latest_invoice.payment_intent"],
  });

  // 🔄 Store new subscription in Supabase
  await supabase
    .from("subscriptions")
    .upsert({
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_price_id: Deno.env.get("STRIPE_DEFAULT_PRICE_ID"),
      status: subscription.status,
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    });

  return subscription;
};

// 🚀 **Main Function**
serve(async (req) => {
  try {
    const corsResponse = handleCORS(req);
    if (corsResponse) return corsResponse;

    const { action, userId, email, priceId } = await req.json();
    if (!action || !userId || !email) {
      console.error("❌ Missing required parameters:", { action, userId, email });
      return new Response(JSON.stringify({ error: "Missing required parameters" }), { headers: handleReturnCORS(req), status: 400 });
    }

    console.log(`📢 Processing action: ${action} for user: ${userId}`);
    
    // ✅ Fetch or create a Stripe customer ID
    const customerId = await getOrCreateCustomer(userId, email);
    if (!customerId) return new Response(JSON.stringify({ error: "Failed to create Stripe customer" }), { headers: handleReturnCORS(req), status: 500 });

    switch (action) {
      // ✅ 1 Create Stripe Customer on Signup
      case "createStripeCustomer":
        return new Response(JSON.stringify({ stripeCustomerId: customerId }), { headers: handleReturnCORS(req), status: 200 });

      // ✅ 2 Redirect User to Stripe Billing Portal
      case "createBillingPortal":
        await getOrCreateSubscription(customerId, userId); // Ensure user has a subscription

        const portalSession = await stripe.billingPortal.sessions.create({
          customer: customerId,
          return_url: Deno.env.get("PRODUCTION_URL") + "/settings/subscription",
        });

        return new Response(JSON.stringify({ url: portalSession.url }), { headers: handleReturnCORS(req), status: 200 });

      // ✅ 3 Generate Payment Link for Subscription
      case "createPaymentLink":
        if (!priceId) return new Response(JSON.stringify({ error: "Missing priceId" }), { headers: handleReturnCORS(req), status: 400 });

        const paymentLink = await stripe.paymentLinks.create({
          line_items: [{ price: priceId, quantity: 1 }],
          customer: customerId,
          success_url: Deno.env.get("PRODUCTION_URL") + "/success",
          cancel_url: Deno.env.get("PRODUCTION_URL") + "/cancel",
        });

        return new Response(JSON.stringify({ url: paymentLink.url }), { headers: handleReturnCORS(req), status: 200 });

      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), { headers: handleReturnCORS(req), status: 400 });
    }
  } 
  catch (error) {
    console.error("❌ Unexpected Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { headers: handleReturnCORS(req), status: 500 });
  }
});

