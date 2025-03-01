import { CheckIcon } from "lucide-react";
import { Card, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { usePayment } from "./hooks/usePayment";
import { useEffect, useState } from "react";

interface SubscriptionSectionProps {
  userId: string;
  email: string;
}

const tiers = [
  {
    name: "Beta (Limited-Time)",
    id: "tier-beta",
    priceMonthly: "$0",
    description: "🚀 Free Beta Access",
    features: [
      "1 Trading Account",
      "1GB of secure data storage",
      "Full AI Debrief Reports",
      "Behavior Pattern Analysis",
      "Strategy Suggestions",
      "Csv Trade History Import",
    ],
    isActive: true,
    stripePriceId: "price_1QwsM12c1fXi1EZHRerWIEBh",
  },
  {
    name: "Pro (Coming soon)",
    id: "tier-pro",
    priceMonthly: "$20",
    description: "🔥 Pro Plan (Coming Soon).",
    features: [
      "Everything in Free",
      "Advanced AI Insights & Custom Reports",
      "Weekly Performance Review (Coming Soon)",
      "Priority Support",
      "Broker Integration (Future Idea)",
    ],
    isActive: false,
    stripePriceId: "price_1QwsXn2c1fXi1EZHVhiacfWi",
  },
];

export const SubscriptionSection = ({ userId, email }: SubscriptionSectionProps) => {
  const { fetchSubscription, createPaymentLink, openBillingPortal, loading } = usePayment();
  const [activePlan, setActivePlan] = useState<string | null>(null);

  // ✅ Fetch the user's current active subscription
  useEffect(() => {
    const fetchData = async () => { 
      const subscription = await fetchSubscription(userId);
      if (subscription) {
        setActivePlan(subscription.stripe_price_id);
      }
    };

    fetchData();
  }, [userId]);


  return (
    <div className="mx-auto mt-16 gap-6 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
      {tiers.map((tier) => {
        const isCurrentPlan = activePlan === tier.stripePriceId;

        return (
          <Card key={tier.id} className="p-6 h-full">
            <h3 id={tier.id} className="text-primary text-lg font-semibold">{tier.name}</h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span className="text-white text-5xl font-semibold tracking-tight">{tier.priceMonthly}</span>
              <span className="text-gray-500 text-base">/month</span>
            </p>
            <p className="text-gray-400 mt-4 text-sm">{tier.description}</p>

            <ul role="list" className="text-gray-400 mt-6 space-y-3 text-sm">
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon aria-hidden="true" className="text-primary h-5 w-5 flex-none" />
                  {feature}
                </li>
              ))}
            </ul>

            <CardFooter>
              {/* ✅ If this is the user's active plan, show "Manage Billing" instead */}
              {isCurrentPlan ? (
                <Button
                  onClick={() => openBillingPortal(userId, email)}
                  className="mt-6 w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold"
                  disabled={loading}
                >
                  Manage Billing
                </Button>
              ) : (
                <Button
                  onClick={() => tier.isActive && createPaymentLink(userId, email, tier.stripePriceId)}
                  className="mt-6 w-full bg-primary hover:bg-emerald-400 text-white font-semibold"
                  disabled={!tier.isActive || loading}
                >
                  {tier.isActive ? "Get Started Today" : "Coming Soon"}
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};
