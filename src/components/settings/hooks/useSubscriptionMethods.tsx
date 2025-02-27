
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const API_URL = `${import.meta.env.VITE_SUPABASE_API}/subscriptions`; // API path

export const useSubscriptionMethods = (customerId: string) => {
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [renewalDate, setRenewalDate] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch current subscription details
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
        console.error("Error fetching subscription:", result.error);
        return;
      }

      if (result.subscription) {
        // Get plan name from price.product.name or default to a simple name
        const planName = result.subscription?.items?.data[0]?.price?.product?.name || "Premium";
        setSubscriptionTier(planName.toUpperCase());
        
        // Format renewal date
        if (result.subscription?.current_period_end) {
          setRenewalDate(new Date(result.subscription.current_period_end * 1000).toLocaleDateString());
        }
      }
    } 
    catch (error) {
      console.error("Error fetching subscription:", error);
    }
    setLoading(false);
  };

  // Create a Stripe Customer Portal session
  const createCustomerPortalSession = async (stripeCustomerId: string) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createCustomerPortalSession",
          stripeCustomerId,
        }),
      });

      const result = await response.json();
      if (result.error) {
        console.error("Error creating portal session:", result.error);
        return null;
      }

      return result.url;
    } catch (error) {
      console.error("Error creating customer portal session:", error);
      return null;
    }
  };

  // Create a Stripe Payment Link
  const createPaymentLink = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createPaymentLink",
        }),
      });

      const result = await response.json();
      if (result.error) {
        console.error("Error creating payment link:", result.error);
        return null;
      }

      return result.url;
    } catch (error) {
      console.error("Error creating payment link:", error);
      return null;
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchSubscription();
    }
  }, [customerId]);

  return { 
    subscriptionTier, 
    renewalDate, 
    loading, 
    createCustomerPortalSession,
    createPaymentLink
  };
};
