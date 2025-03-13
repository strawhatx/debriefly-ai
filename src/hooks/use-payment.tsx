import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const API_URL = `${import.meta.env.VITE_SUPABASE_API}/payments`; // API path

export const usePayment = () => {
  const [loading, setLoading] = useState(false);

  // 🔹 Generic API Request Handler
  const apiRequest = async (body: object) => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (result.error) throw new Error(result.error);

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
