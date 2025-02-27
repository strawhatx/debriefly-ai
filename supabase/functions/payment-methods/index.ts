import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.3.0?target=deno";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { handleCORS, handleReturnCORS } from "../utils/cors.ts";

// ✅ Initialize Stripe & Supabase
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"), { apiVersion: "2023-10-16" });
const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));


// ✅ Helper: Fetch Stripe Customer
const getOrCreateCustomer = async (req: Request, email: string, userId: string): Promise<string> => {
  try {
    // Fetch Free Plan Price ID
    const { data:plans, error: planError } = await supabase.from("subscription_plans")
      .select("stripe_price_id").eq("name", "Beta").single();

    if (planError || !plans?.stripe_price_id) {
      console.error("❌ Error fetching Free Plan ID:", planError?.message);
      return new Response(JSON.stringify({ error: "Free plan not found" }), { status: 500 });
    }

    const freePlanPriceId = plan.stripe_price_id;

    // Check if customer already exists in Supabase
    const { data, error: profileError } = await supabase
      .from("profiles").select("stripe_customer_id").eq("id", userId).single();

    if (profileError || !data?.stripe_customer_id) {
      console.log("🆕 Creating new Stripe customer...");

      // Create customer in Stripe
      const customer = await stripe.customers.create({
        email,
        metadata: { userId },
      });

      // Create Free Subscription in Stripe
      const subscription = await stripe.subscriptions.create({
        customer: customer.id, 
        items: [{ price: freePlanPriceId }], 
        payment_behavior: "allow_incomplete",
      });

      console.log("✅ Free Subscription Created:", subscription.id);

      // Store the new customer ID in Supabase
      await supabase.from("profiles").update({ stripe_customer_id: customer.id }).eq("id", userId);

      return new Response(JSON.stringify({ customerId: customer.id }), {
        headers: handleReturnCORS(req),
        status: 200,
      });
    }

    console.log("✅ Found existing Stripe customer:", data.stripe_customer_id);
    return new Response(JSON.stringify({ customerId: data.stripe_customer_id }), {
      headers: handleReturnCORS(req),
      status: 200,
    });
  }
  catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: handleReturnCORS(req),
      status: 500,
    });
  }
}

// ✅ Helper: Create a SetupIntent
const createSetupIntent = async (req: Request, customerId: string): Promise<Response> => {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted) return new Response(JSON.stringify({ error: "Customer is deleted" }), { headers: handleReturnCORS(req), status: 400 });

    const setupIntent = await stripe.setupIntents.create({ customer: customerId });

    return new Response(JSON.stringify({ clientSecret: setupIntent.client_secret }), {
      headers: handleReturnCORS(req),
      status: 200,
    });
  }
  catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: handleReturnCORS(req),
      status: 500,
    });
  }
}

// ✅ Helper: Save Payment Method
const savePaymentMethod = async (req: Request, userId: string, customerId: string, paymentMethodId: string): Promise<Response> => {
  try {
    await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });

    // ✅ Fetch payment method details from Stripe
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    const cardDetails = paymentMethod.card;
    if (!cardDetails) {
      return new Response(JSON.stringify({ error: "Payment method is not a card" }), { headers: handleReturnCORS(req), status: 400 });
    }

    // ✅ Store the payment method in Supabase
    await supabase.from("payment_methods").insert([
      {
        user_id: userId,
        stripe_payment_method_id: paymentMethodId,
        last_4: cardDetails.last4,
        brand: cardDetails.brand,
        exp_month: cardDetails.exp_month,
        exp_year: cardDetails.exp_year,
      },
    ]);

    return new Response(JSON.stringify({ success: true }), {
      headers: handleReturnCORS(req),
      status: 200,
    });
  }
  catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: handleReturnCORS(req),
      status: 500,
    });
  }
}

// ✅ Helper: Set Default Payment Method
const setDefaultPaymentMethod = async (req: Request, customerId: string, paymentMethodId: string): Promise<Response> => {
  try {
    await stripe.customers.update(customerId, { invoice_settings: { default_payment_method: paymentMethodId } });

    return new Response(JSON.stringify({ success: true }), {
      headers: handleReturnCORS(req),
      status: 200,
    });
  }
  catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: handleReturnCORS(req),
      status: 500,
    });
  }
}

// ✅ Helper: Delete Payment Method
const deletePaymentMethod = async (req: Request, customerId: string, paymentMethodId: string): Promise<Response> => {
  try {
    await stripe.paymentMethods.detach(paymentMethodId);
    await supabase.from("payment_methods").delete().eq("stripe_payment_method_id", paymentMethodId);

    return new Response(JSON.stringify({ success: true }), {
      headers: handleReturnCORS(req),
      status: 200,
    });
  }
  catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: handleReturnCORS(req),
      status: 500,
    });
  }
}

// 🚀 **Main Function**
serve(async (req) => {
  try {
    const corsResponse = handleCORS(req);
    if (corsResponse) return corsResponse;

    const { action, email, userId, customerId, paymentMethodId } = await req.json();
    if (!action)
      return new Response(JSON.stringify({ error: "Missing action parameter" }), {
        headers: handleReturnCORS(req),
        status: 400
      });

    switch (action) {
      case "createCustomer":
        if (!email || !userId)
          return new Response(JSON.stringify({ error: "Missing required fields" }), { headers: handleReturnCORS(req), status: 400 });

        return await getOrCreateCustomer(req, email, userId);

      case "createSetupIntent":
        if (!customerId)
          return new Response(JSON.stringify({ error: "Missing customerId" }), { headers: handleReturnCORS(req), status: 400 });

        return createSetupIntent(req, customerId);

      case "savePaymentMethod":
        if (!customerId || !userId || !paymentMethodId)
          return new Response(JSON.stringify({ error: "Missing required fields" }), { headers: handleReturnCORS(req), status: 400 });

        return savePaymentMethod(req, userId, customerId, paymentMethodId);

      case "setDefaultPaymentMethod":
        if (!customerId || !paymentMethodId)
          return new Response(JSON.stringify({ error: "Missing required fields" }), { headers: handleReturnCORS(req), status: 400 });

        return setDefaultPaymentMethod(req, customerId, paymentMethodId);

      case "deletePaymentMethod":
        if (!customerId || !paymentMethodId)
          return new Response(JSON.stringify({ error: "Missing required fields" }), { headers: handleReturnCORS(req), status: 400 });

        return deletePaymentMethod(req, customerId, paymentMethodId);

      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), { headers: handleReturnCORS(req), status: 400 });
    }
  }
  catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Internal server error" }), {
      headers: handleReturnCORS(req),
      status: 500,
    });
  }
});
