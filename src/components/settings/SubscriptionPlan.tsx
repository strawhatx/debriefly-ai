import { Star } from "lucide-react";
import { Button } from "../ui/button";
import { useSubscriptionMethods } from "./hooks/useSubscriptionMethods";

interface SubscriptionPlanProps {
  customerId: string;
}

export const SubscriptionPlan = ({ customerId }: SubscriptionPlanProps) => {
  const { subscriptionTier, renewalDate, createSubscription, updateSubscription, cancelSubscription } = useSubscriptionMethods(customerId);

  // ✅ Determine Upgrade/Downgrade Plan Name
  const isBeta = subscriptionTier?.toUpperCase() === "BETA";
  const newPlan = subscriptionTier ? (isBeta ? "Pro" : "Beta") : "Beta"; // Swap between plans

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
          {/* ✅ Show Subscription Plan & Status */}
          {subscriptionTier && (
            <div className="flex items-center justify-between mb-6">
              <span className="text-emerald-400 font-medium">{subscriptionTier}</span>
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-sm rounded">
                Active
              </span>
            </div>
          )}
          {/* ✅ Show Renewal Date for Paid Plans */}
          {(subscriptionTier && renewalDate) && (
            <p className="text-gray-400">Your subscription renews on {renewalDate}</p>
          )}
        </div>

        {/* ✅ Subscription Action Buttons */}
        <div className="flex gap-3 pt-3">
          <Button
            onClick={() => subscriptionTier ? updateSubscription(newPlan) : createSubscription(newPlan)}
            className="mt-2 px-4 py-2 bg-primary hover:bg-emerald-300 rounded-lg text-sm font-medium"

          >
            <Star /> {subscriptionTier ? (isBeta ? "Upgrade to Pro" : "Switch to Beta") : "Enable Beta Access"}
          </Button>

          {(subscriptionTier && !isBeta) && (
            <Button
              variant="link"
              onClick={cancelSubscription}
              className="mt-2 px-4 py-2 text-red-400 hover:text-red-300 rounded-lg text-sm font-medium"

            >
              Cancel
            </Button>
          )}
        </div>
      </div>

    </div>
  );
};
