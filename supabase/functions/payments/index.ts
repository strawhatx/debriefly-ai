import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.3.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { handleCORS, handleReturnCORS } from "../utils/cors.ts";

// ✅ Load Environment Variables
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"), { apiVersion: "2023-10-16" });
const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));

// ✅ Helper: Create a Stripe Customer & Store in Supabase
const createStripeCustomer = async (userId: string, email: string) => {
  if (!email) {
    console.error("❌ Missing email for user:", userId);
    return null;
  }

  console.log("🆕 Creating new Stripe customer for:", email);
  try {
    // 🔥 Create Customer in Stripe
    const customer = await stripe.customers.create({ email, metadata: { userId } });

    // 🔄 Save Customer ID in Supabase
    const { error } = await supabase
      .from("profiles")
      .update({ stripe_customer_id: customer.id })
      .eq("id", userId);

    if (error) {
      console.error("❌ Supabase Error Saving Customer ID:", error.message);
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

    switch (action) {
      // ✅ 1️⃣ Create Stripe Customer on Signup
      case "createStripeCustomer":
        const customerId = await createStripeCustomer(userId, email);
        if (!customerId) return new Response(JSON.stringify({ error: "Failed to create Stripe customer" }), { headers: handleReturnCORS(req), status: 500 });

        return new Response(JSON.stringify({ stripeCustomerId: customerId }), { headers: handleReturnCORS(req), status: 200 });

      // ✅ 2️⃣ Redirect User to Stripe Billing Portal
      case "createBillingPortal":
        const portalSession = await stripe.billingPortal.sessions.create({
          customer: await createStripeCustomer(userId, email), // Ensure user has a customer ID
          return_url: Deno.env.get("PRODUCTION_URL") + "/settings/subscription",
        });
        return new Response(JSON.stringify({ url: portalSession.url }), { headers: handleReturnCORS(req), status: 200 });

      // ✅ 3️⃣ Generate Payment Link for Subscription
      case "createPaymentLink":
        if (!priceId) return new Response(JSON.stringify({ error: "Missing priceId" }), { headers: handleReturnCORS(req), status: 400 });

        const paymentLink = await stripe.paymentLinks.create({
          line_items: [{ price: priceId, quantity: 1 }],
          customer: await createStripeCustomer(userId, email), // Ensure user has a customer ID
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
