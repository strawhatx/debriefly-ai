import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const API_URL = `${import.meta.env.VITE_SUPABASE_API}/subscriptions`; // ✅ Correct API path

export const useSubscriptionMethods = (customerId: string) => {
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [renewalDate, setRenewalDate] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // ✅ Fetch price ID from Supabase
  const fetchPriceId = async (planName: string) => {
    const { data, error } = await supabase
      .from("subscription_plans")
      .select("stripe_price_id")
      .eq("name", planName)
      .single();

    if (error) {
      console.error("❌ Error fetching price ID:", error.message);
      return null;
    }

    return data.stripe_price_id;
  };

  // ✅ Fetch plan name from Supabase
  const fetchPlanName = async (priceId: string) => {
    const { data, error } = await supabase
      .from("subscription_plans")
      .select("name")
      .eq("stripe_price_id", priceId)
      .single();

    if (error) {
      console.error("❌ Error fetching plan name:", error.message);
      return "UNKNOWN";
    }

    return data.name.toUpperCase();
  };

  // ✅ Fetch current subscription details
  const fetchSubscription = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "getSubscriptionDetails",
          stripeCustomerId: customerId,
        }),
      });

      const result = await response.json();
      if (result.error) {
        console.error("❌ Error fetching subscription:", result.error);
        return;
      }

      // ✅ Get Plan Name from Supabase
      const priceId = result.subscription?.items?.data[0]?.price?.id;
      const planName = await fetchPlanName(priceId);

      setSubscriptionTier(planName);
      setRenewalDate(new Date(result.subscription?.current_period_end * 1000).toLocaleDateString());
    } 
    catch (error) {
      console.error("❌ Error fetching subscription:", error);
    }
    setLoading(false);
  };

  // ✅ Upgrade or downgrade subscription
  const createSubscription = async (newPlanName: string) => {
    setLoading(true);

    const newPriceId = await fetchPriceId(newPlanName);
    if (!newPriceId) {
      console.error("❌ No valid Price ID found for", newPlanName);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createSubscription",
          stripeCustomerId: customerId,
          priceId: newPriceId,
        }),
      });

      const result = await response.json();
      if (result.error) {
        console.error("❌ Error creating subscription:", result.error);
        return;
      }

      alert("✅ Subscription created successfully!");
      setSubscriptionTier(newPlanName.toUpperCase()); // ✅ Update state instantly
    } 
    catch (error) {
      console.error("❌ Error creating subscription:", error);
    }
    setLoading(false);
  };

  // ✅ Upgrade or downgrade subscription
  const updateSubscription = async (newPlanName: string) => {
    setLoading(true);

    const newPriceId = await fetchPriceId(newPlanName);
    if (!newPriceId) {
      console.error("❌ No valid Price ID found for", newPlanName);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateSubscription",
          stripeCustomerId: customerId,
          priceId: newPriceId,
        }),
      });

      const result = await response.json();
      if (result.error) {
        console.error("❌ Error updating subscription:", result.error);
        return;
      }

      alert("✅ Subscription updated successfully!");
      setSubscriptionTier(newPlanName.toUpperCase()); // ✅ Update state instantly
    } catch (error) {
      console.error("❌ Error updating subscription:", error);
    }
    setLoading(false);
  };

  // ✅ Cancel subscription
  const cancelSubscription = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "cancelSubscription",
          stripeCustomerId: customerId,
        }),
      });

      const result = await response.json();
      if (result.error) {
        console.error("❌ Error canceling subscription:", result.error);
        return;
      }

      alert("✅ Subscription canceled!");
      fetchSubscription();
    } catch (error) {
      console.error("❌ Error canceling subscription:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (customerId) {
      fetchSubscription();
    }
  }, [customerId]);

  return { subscriptionTier, renewalDate, loading, createSubscription, updateSubscription, cancelSubscription };
};
