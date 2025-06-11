import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.3.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ✅ Load Environment Variables
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"), { apiVersion: "2023-10-16" });
const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));

const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

// ✅ **Helper Function: Update Subscription in Supabase**
const handleSubscriptionUpdate = async (subscription) => {
  const userId = subscription.metadata.userId;
  const priceId = subscription.items.data[0].price.id;
  let status = subscription.status;

  // Map Stripe status to our status types
  if (status === 'trialing') status = 'active';
  if (status === 'incomplete' || status === 'incomplete_expired' || status === 'canceled') status = 'canceled';
  if (status === 'unpaid') status = 'past_due';

  const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();

  console.log(`🔄 Updating subscription for user: ${userId}`, {
    subscriptionId: subscription.id,
    status,
    priceId,
    currentPeriodEnd
  });

  await supabase
    .from("subscriptions")
    .upsert({
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_price_id: priceId,
      status,
      current_period_end: currentPeriodEnd,
    }, { onConflict: ["stripe_subscription_id"] });
};

// ✅ **Helper Function: Cancel Subscription in Supabase**
const handleSubscriptionCancel = async (subscription) => {
  console.log(`❌ Canceling subscription: ${subscription.id}`, {
    userId: subscription.metadata.userId,
    status: subscription.status
  });

  await supabase
    .from("subscriptions")
    .update({ status: "canceled" })
    .eq("stripe_subscription_id", subscription.id);
};

// 🚀 **Main Webhook Function**
serve(async (req) => {
  const body = await req.text();
  const sig = req.headers.get("Stripe-Signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return new Response(JSON.stringify({ error: "Invalid webhook signature" }), { status: 400 });
  }

  console.log(`📢 Received event: ${event.type}`, {
    subscriptionId: event.data.object.id,
    status: event.data.object.status
  });

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.trial_will_end":
    case "customer.subscription.resumed":
    case "customer.subscription.paused":
      await handleSubscriptionUpdate(event.data.object);
      break;
    
    case "customer.subscription.deleted":
    case "customer.subscription.canceled":
      await handleSubscriptionCancel(event.data.object);
      break;

    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`, {
        subscriptionId: event.data.object.id,
        status: event.data.object.status
      });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
