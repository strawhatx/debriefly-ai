
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "../ui/button";
import { useSubscriptionMethods } from "./hooks/useSubscriptionMethods";
import { useToast } from "../ui/use-toast";

interface SubscriptionPlanProps {
  customerId: string;
}

export const SubscriptionPlan = ({ customerId }: SubscriptionPlanProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { 
    subscriptionTier, 
    renewalDate, 
    createCustomerPortalSession,
    createPaymentLink
  } = useSubscriptionMethods(customerId);

  const handleManageBilling = async () => {
    setLoading(true);
    try {
      const url = await createCustomerPortalSession(customerId);
      if (url) {
        window.location.href = url;
      } else {
        toast({
          title: "Error",
          description: "Could not create customer portal session",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Failed to create portal session:", error);
      toast({
        title: "Error",
        description: "Could not open Stripe customer portal",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const url = await createPaymentLink();
      if (url) {
        window.location.href = url;
      } else {
        toast({
          title: "Error",
          description: "Could not create payment link",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Failed to create payment link:", error);
      toast({
        title: "Error",
        description: "Could not create payment link",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!subscriptionTier && (
        <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
          <div className="flex items-center gap-4">
            <p className="font-sm">No Subscription saved.</p>
          </div>
        </div>
      )}

      <div>
        <div className="p-4 bg-gray-900/50 rounded-lg">
          {/* Show Subscription Plan & Status */}
          {subscriptionTier && (
            <div className="flex items-center justify-between mb-6">
              <span className="text-emerald-400 font-medium">{subscriptionTier}</span>
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-sm rounded">
                Active
              </span>
            </div>
          )}
          {/* Show Renewal Date for Paid Plans */}
          {(subscriptionTier && renewalDate) && (
            <p className="text-gray-400">Your subscription renews on {renewalDate}</p>
          )}
        </div>

        {/* Subscription Action Buttons */}
        <div className="flex gap-3 pt-3">
          {subscriptionTier ? (
            <Button
              onClick={handleManageBilling}
              className="mt-2 px-4 py-2 bg-primary hover:bg-emerald-300 rounded-lg text-sm font-medium"
              disabled={loading}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {loading ? "Loading..." : "Manage Billing"}
            </Button>
          ) : (
            <Button
              onClick={handleSubscribe}
              className="mt-2 px-4 py-2 bg-primary hover:bg-emerald-300 rounded-lg text-sm font-medium"
              disabled={loading}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Subscribe
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
