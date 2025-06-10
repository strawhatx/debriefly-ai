import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchWithAuth } from "@/utils/api";

export const usePayment = () => {
  const [loading, setLoading] = useState(false);

  // 🔹 Generic API Request Handler
  const apiRequest = async (body: object) => {
    setLoading(true);
    try {
      const result = await fetchWithAuth("/payments", {
        method: "POST",
        body: JSON.stringify(body),
      });
      return result;
    } catch (error) {
      console.error("❌ API Error:", error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ✅ 1️⃣ Create a Stripe Customer for New Users
  const createStripeCustomer = useCallback(async (userId: string, email: string) => {
    const result = await apiRequest({ action: "createStripeCustomer", userId, email });
    if (result) console.log("✅ Stripe Customer Created:", result.stripeCustomerId);
    return result?.stripeCustomerId || null;
  }, []);

  // ✅ 2️⃣ Fetch Active Subscription
  const fetchSubscription = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !data) {
      console.warn("❌ No active subscription found.");
      return null;
    }

    return data;
  }, []);

  // ✅ 3️⃣ Redirect User to Stripe Billing Portal
  const openBillingPortal = useCallback(async (userId: string, email: string) => {
    const result = await apiRequest({ action: "createBillingPortal", userId, email });
    if (result?.url) window.location.href = result.url;
  }, []);

  // ✅ 4️⃣ Generate a Payment Link for Subscription
  const createPaymentLink = useCallback(async (userId: string, email: string, priceId: string) => {
    const result = await apiRequest({ action: "createPaymentLink", userId, email, priceId });
    if (result?.url) window.location.href = result.url;
  }, []);

  return {
    fetchSubscription,
    createStripeCustomer,
    openBillingPortal,
    createPaymentLink,
    loading
  };
};
