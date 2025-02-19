
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Check, CreditCard, Star } from "lucide-react";

interface SubscriptionSectionProps {
  subscriptionTier: 'FREE' | 'PREMIUM';
  renewalDate: 'April 15, 2024';
}

export const SubscriptionSection = ({ subscriptionTier, renewalDate }: SubscriptionSectionProps) => {
  const { toast } = useToast();

  const handleUpgradeSubscription = async () => {
    toast({
      title: "Coming Soon",
      description: "Subscription upgrades will be available soon!",
    });
  };

  const handleCancelSubscription = async () => {
    subscriptionTier = "FREE";
    toast({
      title: "Subscription Cancelled",
      description: "Your Subscription has been cancelled!",
    });
  };

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4">
      <Card className="h-full p-6 col-span-1 row-span-1">
        <h2 className="text-xl font-semibold mb-2">Current Plan</h2>
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-emerald-400 font-medium">{subscriptionTier}</span>
            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-sm rounded">
              Active
            </span>
          </div>
          <p className="text-gray-400">
            Your subscription renews on {renewalDate}
          </p>
        </div>
        <div className="flex gap-3 pt-3">
          <Button
            onClick={handleUpgradeSubscription}
            className="mt-2 px-4 py-2 bg-primary hover:bg-emerald-300 rounded-lg text-sm font-medium"
          >
            <Star /> Upgrade
          </Button>

          <Button
            variant="link"
            disabled={subscriptionTier === "FREE"}
            onClick={handleCancelSubscription}
            className="mt-2 px-4 py-2 text-red-400 hover:text-red-300 rounded-lg text-sm font-medium"
          >
            Cancel
          </Button>
        </div>
      </Card>

      <Card className="h-full p-6 col-span-1 row-span-1">
        <h2 className="text-xl font-semibold mb-6">Payment Methods</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
            <div className="flex items-center gap-4">
              <CreditCard className="w-6 h-6 text-gray-400" />
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-400">Expires 12/24</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-sm rounded">
              Default
            </span>
          </div>
          <button className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">
            + Add Payment Method
          </button>
        </div>
      </Card>

      {/* Billing History */}
      <Card className="bg-gray-800 rounded-xl p-6 border border-gray-700 col-span-2 row-span-1">
        <h2 className="text-xl font-semibold mb-6">Billing History</h2>
        <div className="space-y-4">
          {[
            { date: 'Mar 15, 2024', amount: '$29.00', status: 'Paid' },
            { date: 'Feb 15, 2024', amount: '$29.00', status: 'Paid' },
            { date: 'Jan 15, 2024', amount: '$29.00', status: 'Paid' }
          ].map((invoice, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
              <div>
                <p className="font-medium">{invoice.date}</p>
                <p className="text-sm text-gray-400">{invoice.amount}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Check className="w-4 h-4" />
                  {invoice.status}
                </span>
                <button className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
