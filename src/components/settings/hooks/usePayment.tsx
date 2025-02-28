import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const API_URL = `${import.meta.env.VITE_SUPABASE_API}/subscriptions`; // API path

export const usePayment = () => {
  const [loading, setLoading] = useState(false);

  // ✅ 1️⃣ Create a Stripe Customer for New Users
  const createStripeCustomer = async (userId: string, email: string) => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "createStripeCustomer", userId, email }),
      });

      const result = await response.json();
      setLoading(false);

      if (result.error) {
        console.error("❌ Error creating Stripe customer:", result.error);
        return null;
      }

      console.log("✅ Stripe Customer Created:", result.stripeCustomerId);
      return result.stripeCustomerId;
    } catch (error) {
      console.error("❌ Error:", error);
      setLoading(false);
      return null;
    }
  };

  const fetchSubscription = async (userId: string) => {
    const { data, error } = await supabase.from("subscriptions")
        .select("*").eq("user_id", userId).maybeSingle();
  
    if (error || !data) {
      console.warn("❌ No active subscription found.");
      return null;
    }
  
    return data;
  };
  

  // ✅ 2️⃣ Redirect User to Stripe Billing Portal
  const openBillingPortal = async (userId: string, email: string) => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "createBillingPortal", userId, email }),
      });

      const result = await response.json();
      setLoading(false);

      if (result.error) {
        console.error("❌ Error opening billing portal:", result.error);
      }

      window.location.href = result.url;
    } catch (error) {
      console.error("❌ Error:", error);
      setLoading(false);
    }
  };

  // ✅ 3️⃣ Generate a Payment Link for Subscription
  const createPaymentLink = async (userId: string, email: string, priceId: string) => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "createPaymentLink", userId, email, priceId }),
      });

      const result = await response.json();
      setLoading(false);

      if (result.error) {
        console.error("❌ Error creating payment link:", result.error);
        return;
      }

      window.location.href = result.url;
    } catch (error) {
      console.error("❌ Error:", error);
      setLoading(false);
    }
  };

  return { fetchSubscription, createStripeCustomer, openBillingPortal, createPaymentLink, loading };
};

